import { useEffect, useMemo, useState } from 'react';
import { shuffle } from '../../../practice/rng';
import type { ChoiceEx } from '../../../practice/types';
import { displayOption, type ExerciseProps, GapText } from './common';

export function ChoiceExercise({ ex, answered, onAnswer, rng }: ExerciseProps<ChoiceEx>) {
  const order = useMemo(
    () =>
      shuffle(
        ex.options.map((_, i) => i),
        rng,
      ),
    [ex, rng],
  );
  const [picked, setPicked] = useState<number | null>(null);

  function choose(i: number) {
    if (answered || picked !== null) return;
    setPicked(i);
    onAnswer(i === 0);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const n = Number(e.key);
      if (n >= 1 && n <= order.length) choose(order[n - 1]);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const hasGap = ex.prompt.includes('___');
  const fill = answered && hasGap ? ex.options[0] : undefined;

  return (
    <div className="pr-ex">
      {ex.context && <div className="pr-context">{ex.context}</div>}
      <div className={`pr-prompt${ex.prompt.length > 90 ? ' long' : ''}`}>
        <GapText text={ex.prompt} fill={fill} state={picked === 0 ? 'ok' : 'bad'} />
      </div>
      {ex.hint && <div className="pr-hint">{ex.hint}</div>}
      <div className={`pr-options${ex.options.some((o) => o.length > 28) ? ' stacked' : ''}`}>
        {order.map((i, k) => {
          const state = answered ? (i === 0 ? ' ok' : i === picked ? ' bad' : ' dim') : '';
          return (
            <button
              key={i}
              type="button"
              className={`pr-option${state}`}
              onClick={() => choose(i)}
              disabled={answered}
            >
              <span className="pr-key">{k + 1}</span>
              {displayOption(ex.options[i])}
            </button>
          );
        })}
      </div>
    </div>
  );
}
