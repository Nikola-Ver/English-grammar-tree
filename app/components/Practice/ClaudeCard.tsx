import { useMemo, useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { isMistake, shakyRuleIds } from '../../practice/claude';
import {
  clearClaudeLog,
  deleteClaudeMistake,
  getClaudeLog,
  subscribeClaudeLog,
} from '../../practice/claudeLog';
import type { PracticeState } from '../../practice/store';
import { usePractice } from './PracticeProvider';

interface Props {
  state: PracticeState;
  ruleTitle: (id: string) => string;
}

const SHOWN = 8;

/** Mistakes the Claude connector noticed in real conversations, and the rules they shook. */
export function ClaudeCard({ state, ruleTitle }: Props) {
  const { t } = useTranslation();
  const { start } = usePractice();
  const log = useSyncExternalStore(subscribeClaudeLog, getClaudeLog, getClaudeLog);
  const [showAll, setShowAll] = useState(false);
  const shaky = useMemo(() => shakyRuleIds(state), [state]);
  const recent = useMemo(() => log.filter(isMistake).reverse(), [log]);
  // why Claude flagged a rule, newest reason per rule
  const reasons = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of log) if (m.k === 'flag' && m.n) map.set(m.r, m.n);
    return map;
  }, [log]);

  if (recent.length === 0 && shaky.length === 0) return null;
  const list = showAll ? recent : recent.slice(0, SHOWN);

  return (
    <section className="pr-card pr-claude">
      <div className="pr-card-head">
        <h3>🤖 {t('practice.claude.title')}</h3>
        <span className="pr-card-meta">{t('practice.claude.meta')}</span>
      </div>

      {shaky.map((id) => (
        <div key={id} className="pr-weak-row pr-claude-shaky">
          <span className="pr-claude-flag">⚠️ {t('practice.stage.shaky')}</span>
          <span className="pr-weak-title">
            {ruleTitle(id)}
            {reasons.has(id) && <small className="pr-claude-reason">🤖 {reasons.get(id)}</small>}
          </span>
          <button
            type="button"
            className="pr-btn small primary"
            onClick={() => start({ type: 'rule', ruleId: id })}
          >
            {t('practice.trapsCard.train')}
          </button>
        </div>
      ))}
      {shaky.length > 0 && <p className="pr-claude-hint">{t('practice.claude.shakyHint')}</p>}

      {list.map((m) => (
        <div key={m.id} className="pr-claude-row">
          <div className="pr-claude-text">
            {m.w && <s>{m.w}</s>}
            {m.c && <em>{m.c}</em>}
            <small>
              {ruleTitle(m.r)}
              {m.n ? ` — ${m.n}` : ''}
            </small>
          </div>
          <button
            type="button"
            className="pr-close"
            title={t('practice.claude.remove')}
            aria-label={t('practice.claude.remove')}
            onClick={() => void deleteClaudeMistake(m.id)}
          >
            ×
          </button>
        </div>
      ))}

      {recent.length > 0 && (
        <div className="pr-actions pr-traps-actions">
          {recent.length > SHOWN && (
            <button type="button" className="pr-btn ghost" onClick={() => setShowAll((v) => !v)}>
              {showAll
                ? t('practice.trapsCard.showTop')
                : t('practice.claude.showAll', { n: recent.length })}
            </button>
          )}
          <button
            type="button"
            className="pr-btn ghost"
            onClick={() => {
              if (window.confirm(t('practice.claude.clearConfirm'))) void clearClaudeLog();
            }}
          >
            {t('practice.claude.clear')}
          </button>
        </div>
      )}
    </section>
  );
}
