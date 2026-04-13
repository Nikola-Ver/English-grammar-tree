import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MURPHY_DATA } from '../../data/murphy';
import type { DoneMap } from '../../hooks/useProgress';
import { countAll } from '../../hooks/useProgress';
import {
  getRuleContentBundle,
  localizeMurphyLevels,
  normalizeUiLang,
} from '../../i18n/localizeRules';
import { copyToClipboard } from '../../utils/clipboard';
import {
  buildMurphyCategoryTestPrompt,
  buildMurphyGlobalTestPrompt,
  buildMurphyRulePrompt,
} from '../../utils/prompts';
import { LevelBlock } from '../Grammar/LevelBlock';
import './MurphyTab.css';

interface Props {
  done: DoneMap;
  onToggleRule: (id: string) => void;
  onReset: () => void;
  targetRuleId?: string | null;
}

export function MurphyTab({ done, onToggleRule, onReset, targetRuleId }: Props) {
  const { t, i18n } = useTranslation();
  const uiLang = normalizeUiLang(i18n.language);
  const murphyLevels = useMemo(() => {
    const bundle = getRuleContentBundle(i18n);
    return localizeMurphyLevels(MURPHY_DATA, bundle, t, uiLang);
  }, [i18n, t, uiLang]);
  const { total, checked } = countAll(done, murphyLevels);
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
    murphyLevels.forEach((lvl) => {
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
    murphyLevels.forEach((lvl) => {
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
    murphyLevels.forEach((lvl) => {
      lvl.categories.forEach((cat) => {
        cat.rules.forEach((rule) => {
          if (done[rule.id]) doneRules.push({ rule, level: lvl, category: cat });
        });
      });
    });
    if (doneRules.length === 0) {
      alert(t('murphy.alertNoUnits'));
      return;
    }
    const prompt = buildMurphyGlobalTestPrompt(uiLang, doneRules);
    await copyToClipboard(prompt);
    setTestCopied(true);
    setTimeout(() => setTestCopied(false), 2000);
  }

  return (
    <div id="pane-murphy" className="tab-pane active">
      <div className="murphy-header">
        <div className="murphy-progress-block">
          <div className="murphy-progress-nums">
            <span className="murphy-checked">{checked}</span>
            <span className="murphy-total">
              {' '}
              / {total} {t('murphy.unitsUnit')}
            </span>
          </div>
          <div className="murphy-bar-bg">
            <div className="murphy-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="murphy-pct">{t('murphy.progressDone', { pct })}</div>
        </div>
        <div className="murphy-header-right">
          <button
            className={`tab-reset-btn${confirmReset ? ' confirming' : ''}`}
            onClick={handleReset}
            aria-label={confirmReset ? t('murphy.resetConfirmHint') : t('murphy.resetProgress')}
            title={confirmReset ? t('murphy.resetConfirmHint') : t('murphy.resetProgress')}
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
            className={`murphy-search-btn${searchOpen ? ' active' : ''}`}
            onClick={toggleSearch}
            aria-label={searchOpen ? t('murphy.closeSearch') : t('murphy.search')}
            title={searchOpen ? t('murphy.closeSearch') : t('murphy.search')}
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
          <button className="murphy-test-btn" onClick={handleGlobalTest}>
            <span className="btn-icon">🧠</span>{' '}
            {testCopied ? t('copied') : t('murphy.testLearned')}
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
            {t('murphy.resetBanner')}
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

      <div className={`murphy-search-row${searchOpen ? ' open' : ''}`}>
        <div className="murphy-search-inner">
          <span className="murphy-search-icon" aria-hidden="true">
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
            className="murphy-search-input"
            type="search"
            placeholder={t('murphy.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            tabIndex={searchOpen ? 0 : -1}
            aria-hidden={searchOpen ? undefined : true}
          />
          {searchQuery && (
            <button
              className="murphy-search-clear"
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              aria-label={t('murphy.clearSearch')}
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
        {murphyLevels.map((level) => (
          <LevelBlock
            key={level.id}
            level={level}
            done={done}
            onToggleRule={onToggleRule}
            searchQuery={searchQuery}
            forceOpen={forceOpenSet.has(level.id)}
            targetRuleId={targetRuleId}
            promptBuilder={(r, l, c) => buildMurphyRulePrompt(uiLang, r, l, c)}
            categoryPromptBuilder={(l, c) => buildMurphyCategoryTestPrompt(uiLang, l, c)}
          />
        ))}
      </div>
      {!hasResults && <div className="no-results">{t('murphy.noResults')}</div>}
    </div>
  );
}
