import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GapsEx } from '../../../practice/types';
import { displayOption, type ExerciseProps } from './common';

export function GapsExercise({ ex, answered, onAnswer }: ExerciseProps<GapsEx>) {
  const { t } = useTranslation();
  const parts = useMemo(() => ex.text.split(/\{([^}]*)\}/), [ex]);
  const answers = parts.filter((_, i) => i % 2 === 1);
  const [choice, setChoice] = useState<(number | null)[]>(() => answers.map(() => null));
  const [checked, setChecked] = useState(false);

  function cycle(g: number) {
    if (answered) return;
    const next = choice.slice();
    next[g] = next[g] === null ? 0 : ((next[g] as number) + 1) % ex.options.length;
    setChoice(next);
  }

  function check() {
    const right = answers.filter(
      (a, g) => choice[g] !== null && ex.options[choice[g] as number] === a,
    ).length;
    const score = right / answers.length;
    setChecked(true);
    onAnswer(score >= 0.85, score);
  }

  let g = -1;
  return (
    <div className="pr-ex">
      {ex.title && <div className="pr-source">{ex.title}</div>}
      <div className="pr-legend">
        {ex.options.map((o) => (
          <span key={o} className="pr-legend-opt">
            {displayOption(o)}
          </span>
        ))}
        <span className="pr-legend-hint">{t('practice.tapToCycle')}</span>
      </div>
      <div className="pr-gaps-text">
        {parts.map((p, i) => {
          if (i % 2 === 0) {
            // biome-ignore lint/suspicious/noArrayIndexKey: static text segments
            return <span key={i}>{p}</span>;
          }
          g++;
          const gi = g;
          const c = choice[gi];
          const val = c === null ? '?' : displayOption(ex.options[c]);
          const ok = checked && c !== null && ex.options[c] === p;
          return (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: gap position is the identity
              key={i}
              type="button"
              className={`pr-gap${c === null ? ' empty' : ''}${checked ? (ok ? ' ok' : ' bad') : ''}`}
              onClick={() => cycle(gi)}
              disabled={answered}
            >
              {val}
              {checked && !ok && <span className="pr-gap-fix">{displayOption(p)}</span>}
            </button>
          );
        })}
      </div>
      {!answered && (
        <div className="pr-actions">
          <button
            type="button"
            className="pr-btn primary"
            onClick={check}
            disabled={choice.some((c) => c === null)}
          >
            {t('practice.check')}
          </button>
        </div>
      )}
    </div>
  );
}
