import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { findRule } from '../../practice/engine';
import { buildRuleUrl } from '../../utils/deepLink';
import { RuContrastBox } from '../Grammar/RuContrastBox';
import '../Grammar/RuleExpansion.css';

interface Props {
  ruleId: string;
  onClose: () => void;
}

/**
 * The rule, read inside a game: it opens over the round and closing it returns to exactly
 * where the learner was. Read-only (notes and pins live on the rule's own page).
 */
export function RulePeek({ ruleId, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const rule = useMemo(() => findRule(i18n, ruleId), [i18n, ruleId]);
  const back = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    back.current?.focus();
  }, []);

  if (!rule) return null;

  return (
    <div className="pr-peek" role="dialog" aria-modal="true" aria-label={rule.text}>
      <div className="pr-peek-head">
        <button ref={back} type="button" className="pr-btn small" onClick={onClose}>
          ← {t('practice.peek.back')}
        </button>
        <a
          className="pr-peek-tab"
          href={buildRuleUrl(ruleId)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('practice.peek.newTab')} ↗
        </a>
      </div>
      <div className="pr-peek-body">
        <h3 className="pr-peek-title">{rule.text}</h3>
        {rule.note && <p className="pr-peek-note">{rule.note}</p>}
        {/* first-party rule content, the same HTML the Grammar tab shows */}
        <div className="rule-exp pr-peek-exp">
          {rule.exp && <div dangerouslySetInnerHTML={{ __html: rule.exp }} />}
          {rule.ex && rule.ex.length > 0 && (
            <ul className="ex-list">
              {rule.ex.map(([en, tr]) => (
                <li key={en}>
                  {en}
                  {tr && tr !== en && <span className="tr">{tr}</span>}
                </li>
              ))}
            </ul>
          )}
          {rule.exc?.trim() && (
            <div className="exc-block">
              <strong>{t('rule.exceptions')}</strong>{' '}
              <span dangerouslySetInnerHTML={{ __html: rule.exc }} />
            </div>
          )}
          {rule.tip && (
            <div className="tip-block">
              <strong>{t('rule.tip')}</strong>{' '}
              <span dangerouslySetInnerHTML={{ __html: rule.tip }} />
            </div>
          )}
          {rule.markers && rule.markers.tags.length > 0 && (
            <div className="markers-block">
              <strong>{t('tenseUi.timeMarkers')}</strong>
              <div className="markers-wrap">
                {rule.markers.tags.map((tag) => (
                  <span key={tag} className="marker-tag">
                    {tag}
                  </span>
                ))}
              </div>
              {rule.markers.note && <div className="markers-note">{rule.markers.note}</div>}
            </div>
          )}
          {rule.mistakes && rule.mistakes.length > 0 && (
            <div className="mistakes-block">
              <strong>{t('rule.mistakes')}</strong>
              <ul>
                {rule.mistakes.map((m) => (
                  <li key={m} dangerouslySetInnerHTML={{ __html: m }} />
                ))}
              </ul>
            </div>
          )}
        </div>
        <RuContrastBox ruleId={ruleId} />
      </div>
    </div>
  );
}
