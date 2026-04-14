import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DATA } from '../../data/grammar';
import type { DoneMap } from '../../hooks/useProgress';
import { countAll } from '../../hooks/useProgress';
import {
  getRuleContentBundle,
  localizeGrammarLevels,
  normalizeUiLang,
} from '../../i18n/localizeRules';
import { copyToClipboard } from '../../utils/clipboard';
import { buildCategoryTestPrompt, buildGlobalTestPrompt } from '../../utils/prompts';
import { LevelBlock } from './LevelBlock';

interface Props {
  done: DoneMap;
  onToggleRule: (id: string) => void;
  onReset: () => void;
  targetRuleId?: string | null;
}

export function GrammarTab({ done, onToggleRule, onReset, targetRuleId }: Props) {
  const { t, i18n } = useTranslation();
  const uiLang = normalizeUiLang(i18n.language);
  const grammarData = useMemo(() => {
    const bundle = getRuleContentBundle(i18n);
    return localizeGrammarLevels(DATA, bundle, t, uiLang);
  }, [i18n, t, uiLang]);
  const { total, checked } = countAll(done, grammarData);
  const pct = total ? Math.round((checked / total) * 100) : 0;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [confirmReset, setConfirmReset] = useState(false);
  const [testCopied, setTestCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = searchQuery.trim().toLowerCase();

  const forceOpenSet = new Set<string>();
  if (q) {
    grammarData.forEach((lvl) => {
      if (lvl.id.toLowerCase().includes(q) || lvl.name.toLowerCase().includes(q)) {
        forceOpenSet.add(lvl.id);
        return;
      }
      lvl.categories.forEach((cat) => {
        if (cat.name.toLowerCase().includes(q)) {
          forceOpenSet.add(lvl.id);
          return;
        }
        cat.rules.forEach((rule) => {
          if (`${rule.text} ${rule.note || ''}`.toLowerCase().includes(q)) {
            forceOpenSet.add(lvl.id);
          }
        });
      });
    });
  }
  if (targetRuleId) {
    grammarData.forEach((lvl) => {
      if (lvl.categories.some((cat) => cat.rules.some((r) => r.id === targetRuleId))) {
        forceOpenSet.add(lvl.id);
      }
    });
  }
  const hasResults = !q || forceOpenSet.size > 0;

  function toggleSearch() {
    if (searchOpen) {
      setSearchOpen(false);
      setSearchQuery('');
    } else {
      setSearchOpen(true);
    }
  }

  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => searchInputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  // Clear reset confirm timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      resetTimerRef.current = setTimeout(() => {
        setConfirmReset(false);
        resetTimerRef.current = null;
      }, 3000);
    } else {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
      setConfirmReset(false);
      onReset();
    }
  }

  async function handleGlobalTest() {
    const doneRules: {
      rule: import('../../data/grammar').Rule;
      level: import('../../data/grammar').Level;
      category: import('../../data/grammar').Category;
    }[] = [];
    grammarData.forEach((lvl) => {
      lvl.categories.forEach((cat) => {
        cat.rules.forEach((rule) => {
          if (done[rule.id]) doneRules.push({ rule, level: lvl, category: cat });
        });
      });
    });
    if (doneRules.length === 0) {
      alert(t('grammar.alertNoRules'));
      return;
    }
    const prompt = buildGlobalTestPrompt(uiLang, doneRules);
    await copyToClipboard(prompt);
    setTestCopied(true);
    setTimeout(() => setTestCopied(false), 2000);
  }

  return (
    <div id="pane-grammar" className="tab-pane active">
      <div className="grammar-header">
        <div className="grammar-progress-block">
          <div className="grammar-progress-nums">
            <span className="grammar-checked">{checked}</span>
            <span className="grammar-total">
              {' '}
              / {total} {t('grammar.rulesUnit')}
            </span>
          </div>
          <div className="grammar-bar-bg">
            <div className="grammar-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="grammar-pct">{t('grammar.progressDone', { pct })}</div>
        </div>
        <div className="grammar-header-right">
          <button
            className={`tab-reset-btn${confirmReset ? ' confirming' : ''}`}
            onClick={handleReset}
            aria-label={confirmReset ? t('grammar.resetConfirmHint') : t('grammar.resetProgress')}
            title={confirmReset ? t('grammar.resetConfirmHint') : t('grammar.resetProgress')}
          >
            {confirmReset ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-4.96" />
              </svg>
            )}
          </button>
          <button
            className={`grammar-search-btn${searchOpen ? ' active' : ''}`}
            onClick={toggleSearch}
            aria-label={searchOpen ? t('grammar.closeSearch') : t('grammar.search')}
            title={searchOpen ? t('grammar.closeSearch') : t('grammar.search')}
          >
            {searchOpen ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
          </button>
          <button className="global-test-btn" onClick={handleGlobalTest}>
            <span className="btn-icon">🧠</span>{' '}
            {testCopied ? t('copied') : t('grammar.testLearned')}
          </button>
        </div>
      </div>

      <div
        className={`reset-confirm-banner${confirmReset ? ' open' : ''}`}
        role="alert"
        aria-live="polite"
      >
        <div className="reset-confirm-inner">
          <span className="reset-confirm-text">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {t('grammar.resetBanner')}
          </span>
          <button
            className="reset-confirm-cancel"
            onClick={() => {
              setConfirmReset(false);
              if (resetTimerRef.current) {
                clearTimeout(resetTimerRef.current);
                resetTimerRef.current = null;
              }
            }}
            tabIndex={confirmReset ? 0 : -1}
          >
            {t('account.cancel')}
          </button>
        </div>
      </div>

      <div className={`grammar-search-row${searchOpen ? ' open' : ''}`}>
        <div className="grammar-search-inner">
          <span className="grammar-search-icon" aria-hidden="true">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            ref={searchInputRef}
            className="grammar-search-input"
            type="search"
            placeholder={t('grammar.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            tabIndex={searchOpen ? 0 : -1}
            aria-hidden={searchOpen ? undefined : true}
          />
          {searchQuery && (
            <button
              className="grammar-search-clear"
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              aria-label={t('grammar.clearSearch')}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="level-path">
        {grammarData.map((level, i) => (
          <LevelBlock
            key={level.id}
            level={level}
            done={done}
            onToggleRule={onToggleRule}
            searchQuery={searchQuery}
            forceOpen={forceOpenSet.has(level.id)}
            targetRuleId={targetRuleId}
            stackOrder={grammarData.length - 1 - i}
            categoryPromptBuilder={(lvl, cat) => buildCategoryTestPrompt(uiLang, lvl, cat)}
          />
        ))}
      </div>
      {!hasResults && <div className="no-results">{t('grammar.noResults')}</div>}
    </div>
  );
}
