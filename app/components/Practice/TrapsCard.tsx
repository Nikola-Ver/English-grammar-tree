import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PracticeIndex } from '../../practice/items';
import type { PracticeState } from '../../practice/store';
import { TRAP_MIN_ANSWERS, trapStats } from '../../practice/trapStats';
import { TRAP_ICON } from '../../practice/traps';
import { usePractice } from './PracticeProvider';

interface Props {
  index: PracticeIndex;
  state: PracticeState;
}

/** "Your Russian traps": where interference from Russian costs the learner most. */
export function TrapsCard({ index, state }: Props) {
  const { t } = useTranslation();
  const { start } = usePractice();
  const [showAll, setShowAll] = useState(false);
  const stats = useMemo(() => trapStats(index, state.items), [index, state.items]);
  const known = stats.filter((s) => s.answers >= TRAP_MIN_ANSWERS && s.available > 0);
  const top = known.filter((s) => s.correct < s.answers).slice(0, 3);
  const list = showAll ? stats.filter((s) => s.available > 0) : top;

  return (
    <section className="pr-card pr-traps">
      <div className="pr-card-head">
        <h3>🪤 {t('practice.trapsCard.title')}</h3>
        <span className="pr-card-meta">{t('practice.trapsCard.meta')}</span>
      </div>

      {top.length === 0 && !showAll && (
        <p className="pr-traps-empty">{t('practice.trapsCard.empty')}</p>
      )}

      <div className="pr-trap-list">
        {list.map((s, i) => {
          const acc = s.answers ? Math.round((s.correct / s.answers) * 100) : null;
          return (
            <div key={s.trap} className={`pr-trap-row${!showAll && i === 0 ? ' worst' : ''}`}>
              <span className="pr-trap-icon big">{TRAP_ICON[s.trap]}</span>
              <span className="pr-trap-main">
                <b>{t(`practice.traps.${s.trap}.name`)}</b>
                <small>{t(`practice.traps.${s.trap}.desc`)}</small>
                <span className="pr-trap-meter" aria-hidden="true">
                  <span
                    style={{ width: `${acc ?? 0}%` }}
                    className={acc !== null && acc < 60 ? 'low' : ''}
                  />
                </span>
                <small className="pr-trap-nums">
                  {acc !== null
                    ? t('practice.trapsCard.stats', { acc, n: s.answers, deck: s.deck })
                    : t('practice.trapsCard.noData')}
                </small>
              </span>
              <button
                type="button"
                className="pr-btn small primary"
                onClick={() => start({ type: 'trap', trap: s.trap })}
              >
                {t('practice.trapsCard.train')}
              </button>
            </div>
          );
        })}
      </div>

      <div className="pr-actions pr-traps-actions">
        {top.length > 0 && (
          <button
            type="button"
            className="pr-btn primary"
            onClick={() => start({ type: 'game', gameId: 'my-traps' })}
          >
            🪤 {t('practice.trapsCard.trainTop')}
          </button>
        )}
        <button type="button" className="pr-btn ghost" onClick={() => setShowAll((v) => !v)}>
          {showAll ? t('practice.trapsCard.showTop') : t('practice.trapsCard.showAll')}
        </button>
      </div>
    </section>
  );
}
