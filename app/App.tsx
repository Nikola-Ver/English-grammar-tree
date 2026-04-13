import { lazy, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './styles/base.css';
import { Header } from './components/Header/Header';
import { Tabs } from './components/Tabs';
import { AuthSyncProvider, useAuthSync } from './context/AuthSyncContext';
import { useProgress } from './hooks/useProgress';
import { useTheme } from './hooks/useTheme';
import { matchSupportedLang } from './i18n/languagePreference';
import { parseRuleHash, parseTenseHash } from './utils/deepLink';
import { findRuleTab } from './utils/findRuleTab';

const GrammarTab = lazy(() =>
  import('./components/Grammar/GrammarTab').then((m) => ({ default: m.GrammarTab })),
);
const MurphyTab = lazy(() =>
  import('./components/Murphy/MurphyTab').then((m) => ({ default: m.MurphyTab })),
);
const TensesTab = lazy(() =>
  import('./components/Tenses/TensesTab').then((m) => ({ default: m.TensesTab })),
);
const AuthPage = lazy(() =>
  import('./components/Auth/AuthPage').then((m) => ({ default: m.AuthPage })),
);
const AccountPage = lazy(() =>
  import('./components/Account/AccountPage').then((m) => ({ default: m.AccountPage })),
);

type Tab = 'grammar' | 'murphy' | 'tenses';
type View = 'main' | 'auth' | 'account';

function TabSuspenseFallback() {
  const { t } = useTranslation();
  return (
    <div className="tab-suspense-fallback" role="status" aria-live="polite">
      {t('common.loading')}
    </div>
  );
}

function AppContent() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('grammar');
  const [view, setView] = useState<View>('main');
  const [targetRuleId, setTargetRuleId] = useState<string | null>(null);
  const [targetTenseKey, setTargetTenseKey] = useState<string | null>(null);
  const grammarProgress = useProgress('eng_v4');
  const murphyProgress = useProgress('murphy_v1');
  const { theme, toggleTheme } = useTheme();
  const { user, authLoading } = useAuthSync();
  const userId = user?.uid ?? null;

  // Return to main when auth finishes loading or when the signed-in user changes
  // (authLoading alone does not change after the first check, so sign-in on the auth screen would otherwise leave view stuck on 'auth').
  useEffect(() => {
    if (!authLoading) setView('main');
  }, [authLoading, userId]);

  useEffect(() => {
    const lang = i18n.language?.split('-')[0] ?? 'en';
    document.documentElement.lang = lang;
  }, [i18n.language]);

  useEffect(() => {
    const parsedRule = parseRuleHash();
    if (parsedRule?.ruleId) {
      const ruleId = parsedRule.ruleId;
      let cancelled = false;
      void findRuleTab(ruleId).then((tab) => {
        if (cancelled || !tab) return;
        setActiveTab(tab);
        setTargetRuleId(ruleId);
      });
      if (parsedRule.lang && matchSupportedLang(parsedRule.lang)) {
        i18n.changeLanguage(parsedRule.lang);
      }
      return () => {
        cancelled = true;
      };
    }
    const parsedTense = parseTenseHash();
    if (parsedTense?.tenseKey) {
      setActiveTab('tenses');
      setTargetTenseKey(parsedTense.tenseKey);
      if (parsedTense.lang && matchSupportedLang(parsedTense.lang)) {
        i18n.changeLanguage(parsedTense.lang);
      }
    }
  }, [i18n]);

  function handleTabSwitch(tab: Tab) {
    if (tab !== activeTab) {
      history.replaceState(null, '', location.pathname + location.search);
      setTargetRuleId(null);
      setTargetTenseKey(null);
    }
    setActiveTab(tab);
  }

  function handleAvatarClick() {
    setView(user ? 'account' : 'auth');
  }

  function handleBackToMain() {
    setView('main');
  }

  return (
    <div className="wrap">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onAvatarClick={handleAvatarClick}
        onTitleClick={handleBackToMain}
      />

      {view === 'auth' && (
        <Suspense fallback={<TabSuspenseFallback />}>
          <AuthPage onContinueWithout={handleBackToMain} />
        </Suspense>
      )}

      {view === 'account' && (
        <Suspense fallback={<TabSuspenseFallback />}>
          <AccountPage onBack={handleBackToMain} />
        </Suspense>
      )}

      {view === 'main' && (
        <>
          <Tabs activeTab={activeTab} onSwitch={handleTabSwitch} />
          <Suspense fallback={<TabSuspenseFallback />}>
            {activeTab === 'grammar' && (
              <GrammarTab
                done={grammarProgress.done}
                onToggleRule={grammarProgress.toggleRule}
                onReset={grammarProgress.resetAll}
                targetRuleId={targetRuleId}
              />
            )}
            {activeTab === 'murphy' && (
              <MurphyTab
                done={murphyProgress.done}
                onToggleRule={murphyProgress.toggleRule}
                onReset={murphyProgress.resetAll}
                targetRuleId={targetRuleId}
              />
            )}
            {activeTab === 'tenses' && <TensesTab targetTenseKey={targetTenseKey} />}
          </Suspense>
        </>
      )}
    </div>
  );
}

export function App() {
  return (
    <AuthSyncProvider>
      <AppContent />
    </AuthSyncProvider>
  );
}
