import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SortEx } from '../../../practice/types';
import type { ExerciseProps } from './common';

export function SortExercise({ ex, answered, onAnswer }: ExerciseProps<SortEx>) {
  const { t } = useTranslation();
  const [assign, setAssign] = useState<(number | null)[]>(() => ex.items.map(() => null));
  const [selected, setSelected] = useState<number | null>(() => (ex.items.length ? 0 : null));
  const [checked, setChecked] = useState(false);

  const unassigned = ex.items.map((_, i) => i).filter((i) => assign[i] === null);

  function place(bucket: number) {
    if (answered || selected === null) return;
    const next = assign.slice();
    next[selected] = bucket;
    setAssign(next);
    const remaining = ex.items.map((_, i) => i).filter((i) => next[i] === null);
    setSelected(remaining[0] ?? null);
  }

  function unplace(i: number) {
    if (answered) return;
    const next = assign.slice();
    next[i] = null;
    setAssign(next);
    setSelected(i);
  }

  function check() {
    const right = ex.items.filter(([, b], i) => assign[i] === b).length;
    const score = right / ex.items.length;
    setChecked(true);
    onAnswer(score >= 0.8, score);
  }

  return (
    <div className="pr-ex">
      {ex.title && <div className="pr-source">{ex.title}</div>}
      <div className="pr-chip-pool">
        {unassigned.length === 0 && !checked && (
          <span className="pr-placeholder">{t('practice.allPlaced')}</span>
        )}
        {unassigned.map((i) => (
          <button
            key={i}
            type="button"
            className={`pr-chip${selected === i ? ' selected' : ''}`}
            onClick={() => setSelected(i)}
          >
            {ex.items[i][0]}
          </button>
        ))}
      </div>
      <div className={`pr-buckets n${ex.buckets.length}`}>
        {ex.buckets.map((label, b) => (
          // biome-ignore lint/a11y/useSemanticElements: the bucket contains chip buttons, so it cannot itself be a <button>
          <div
            key={label}
            className={`pr-bucket${selected !== null && !answered ? ' armed' : ''}`}
            onClick={() => place(b)}
            onKeyDown={(e) => e.key === 'Enter' && place(b)}
            role="button"
            tabIndex={0}
          >
            <div className="pr-bucket-label">{label}</div>
            <div className="pr-bucket-items">
              {ex.items.map(([text, correct], i) =>
                assign[i] === b ? (
                  <button
                    key={text}
                    type="button"
                    className={`pr-chip small${checked ? (correct === b ? ' ok' : ' bad') : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      unplace(i);
                    }}
                    title={checked && correct !== b ? ex.buckets[correct] : undefined}
                  >
                    {text}
                    {checked && correct !== b && (
                      <span className="pr-chip-fix"> → {ex.buckets[correct]}</span>
                    )}
                  </button>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>
      {!answered && (
        <div className="pr-actions">
          <button
            type="button"
            className="pr-btn primary"
            onClick={check}
            disabled={unassigned.length > 0}
          >
            {t('practice.check')}
          </button>
        </div>
      )}
    </div>
  );
}
