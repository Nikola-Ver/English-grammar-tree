import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './styles/base.css';
import { Header } from './components/Header/Header';
import { PracticeProvider } from './components/Practice/PracticeProvider';
import { Tabs } from './components/Tabs';
import { AuthSyncProvider, useAuthSync } from './context/AuthSyncContext';
import { useProgress } from './hooks/useProgress';
import { useTheme } from './hooks/useTheme';
import { matchSupportedLang } from './i18n/languagePreference';
import { type Challenge, parseChallengeHash } from './practice/challenge';
import { parseFriendHash } from './social/social';
import { parseRuleHash, parseTenseHash } from './utils/deepLink';
import { findRuleTab } from './utils/findRuleTab';

const PracticeTab = lazy(() =>
  import('./components/Practice/PracticeTab').then((m) => ({ default: m.PracticeTab })),
);
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

type Tab = 'practice' | 'grammar' | 'murphy' | 'tenses';

const LS_LAST_TAB = 'last-tab-v1';

function initialTab(): Tab {
  try {
    const v = localStorage.getItem(LS_LAST_TAB);
    if (v === 'practice' || v === 'grammar' || v === 'murphy' || v === 'tenses') return v;
  } catch {
    // storage blocked
  }
  return 'practice';
}
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
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  /** bumps when a rule is opened from practice so the tab remounts and scrolls to it */
  const [ruleNav, setRuleNav] = useState(0);
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
    try {
      localStorage.setItem(LS_LAST_TAB, activeTab);
    } catch {
      // storage blocked
    }
  }, [activeTab]);

  useEffect(() => {
    const friendCode = parseFriendHash();
    if (friendCode) {
      setInviteCode(friendCode);
      setActiveTab('practice');
      history.replaceState(null, '', location.pathname + location.search);
      return;
    }
    const parsedChallenge = parseChallengeHash();
    if (parsedChallenge) {
      setChallenge(parsedChallenge);
      setActiveTab('practice');
      history.replaceState(null, '', location.pathname + location.search);
      if (
        parsedChallenge.l &&
        matchSupportedLang(parsedChallenge.l) &&
        !localStorage.getItem('i18nextLng')
      ) {
        i18n.changeLanguage(parsedChallenge.l);
      }
      return;
    }
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

  const clearInvite = useCallback(() => setInviteCode(null), []);

  const openRule = useCallback((ruleId: string) => {
    void findRuleTab(ruleId).then((tab) => {
      if (!tab) return;
      setView('main');
      history.replaceState(null, '', `#rule-${ruleId}`);
      setTargetRuleId(ruleId);
      setTargetTenseKey(null);
      setActiveTab(tab);
      setRuleNav((n) => n + 1);
    });
  }, []);

  function handleAvatarClick() {
    setView(user ? 'account' : 'auth');
  }

  function handleBackToMain() {
    setView('main');
  }

  return (
    <PracticeProvider onOpenRule={openRule}>
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
              {activeTab === 'practice' && (
                <PracticeTab
                  challenge={challenge}
                  onChallengeConsumed={() => setChallenge(null)}
                  onOpenRule={openRule}
                  inviteCode={inviteCode}
                  onInviteConsumed={clearInvite}
                  onSignIn={() => setView('auth')}
                />
              )}
              {activeTab === 'grammar' && (
                <GrammarTab
                  key={`g${ruleNav}`}
                  done={grammarProgress.done}
                  onToggleRule={grammarProgress.toggleRule}
                  onReset={grammarProgress.resetAll}
                  targetRuleId={targetRuleId}
                />
              )}
              {activeTab === 'murphy' && (
                <MurphyTab
                  key={`m${ruleNav}`}
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
    </PracticeProvider>
  );
}

export function App() {
  return (
    <AuthSyncProvider>
      <AppContent />
    </AuthSyncProvider>
  );
}
