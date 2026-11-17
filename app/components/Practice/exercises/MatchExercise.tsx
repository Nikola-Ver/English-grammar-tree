import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shuffle } from '../../../practice/rng';
import type { MatchEx } from '../../../practice/types';
import type { ExerciseProps } from './common';

const PAIR_COLORS = ['#38bdf8', '#f472b6', '#4ade80', '#fb923c', '#a78bfa', '#facc15'];

export function MatchExercise({ ex, answered, onAnswer, rng }: ExerciseProps<MatchEx>) {
  const { t } = useTranslation();
  const rightOrder = useMemo(
    () =>
      shuffle(
        ex.pairs.map((_, i) => i),
        rng,
      ),
    [ex, rng],
  );
  const leftOrder = useMemo(
    () =>
      shuffle(
        ex.pairs.map((_, i) => i),
        rng,
      ),
    [ex, rng],
  );
  /** links[left] = right index */
  const [links, setLinks] = useState<(number | null)[]>(() => ex.pairs.map(() => null));
  const [activeLeft, setActiveLeft] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  function pickLeft(l: number) {
    if (answered) return;
    if (links[l] !== null) {
      const next = links.slice();
      next[l] = null;
      setLinks(next);
    }
    setActiveLeft(l);
  }

  function pickRight(r: number) {
    if (answered || activeLeft === null) return;
    const next = links.map((x) => (x === r ? null : x));
    next[activeLeft] = r;
    setLinks(next);
    const free = leftOrder.find((l) => next[l] === null);
    setActiveLeft(free ?? null);
  }

  function check() {
    const right = links.filter((r, l) => r === l).length;
    const score = right / ex.pairs.length;
    setChecked(true);
    onAnswer(score >= 0.8, score);
  }

  const colorOfLeft = (l: number) => {
    const order = leftOrder.filter((x) => links[x] !== null);
    const k = order.indexOf(l);
    return k >= 0 ? PAIR_COLORS[k % PAIR_COLORS.length] : undefined;
  };
  const leftOfRight = (r: number) => links.indexOf(r);

  return (
    <div className="pr-ex">
      {ex.title && <div className="pr-source">{ex.title}</div>}
      <div className="pr-match">
        <div className="pr-match-col">
          {leftOrder.map((l) => {
            const color = colorOfLeft(l);
            const state = checked ? (links[l] === l ? ' ok' : ' bad') : '';
            return (
              <button
                key={l}
                type="button"
                className={`pr-match-item${activeLeft === l ? ' selected' : ''}${state}`}
                style={
                  color ? { borderColor: color, boxShadow: `inset 4px 0 0 ${color}` } : undefined
                }
                onClick={() => pickLeft(l)}
                disabled={answered}
              >
                {ex.pairs[l][0]}
              </button>
            );
          })}
        </div>
        <div className="pr-match-col">
          {rightOrder.map((r) => {
            const l = leftOfRight(r);
            const color = l >= 0 ? colorOfLeft(l) : undefined;
            return (
              <button
                key={r}
                type="button"
                className={`pr-match-item${checked && l >= 0 ? (l === r ? ' ok' : ' bad') : ''}`}
                style={
                  color ? { borderColor: color, boxShadow: `inset -4px 0 0 ${color}` } : undefined
                }
                onClick={() => pickRight(r)}
                disabled={answered}
              >
                {ex.pairs[r][1]}
              </button>
            );
          })}
        </div>
      </div>
      {checked && links.some((r, l) => r !== l) && (
        <div className="pr-correction pr-match-key">
          {ex.pairs.map(([a, b]) => (
            <div key={a}>
              {a} <span className="pr-arrow">→</span> {b}
            </div>
          ))}
        </div>
      )}
      {!answered && (
        <div className="pr-actions">
          <button
            type="button"
            className="pr-btn primary"
            onClick={check}
            disabled={links.some((x) => x === null)}
          >
            {t('practice.check')}
          </button>
        </div>
      )}
    </div>
  );
}
