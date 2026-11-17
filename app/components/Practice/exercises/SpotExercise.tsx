import { useMemo, useState } from 'react';
import type { SpotEx } from '../../../practice/types';
import type { ExerciseProps } from './common';

export function SpotExercise({ ex, answered, onAnswer }: ExerciseProps<SpotEx>) {
  const [tapped, setTapped] = useState<number | null>(null);
  const tokens = useMemo(() => ex.tokens.map((text, pos) => ({ text, pos })), [ex]);

  function tap(i: number) {
    if (answered) return;
    setTapped(i);
    onAnswer(ex.wrong.includes(i));
  }

  return (
    <div className="pr-ex">
      <div className="pr-prompt pr-tokens">
        {tokens.map(({ text: tok, pos: i }) => {
          const isWrong = ex.wrong.includes(i);
          const cls = answered ? (isWrong ? ' bad-token' : i === tapped ? ' miss' : '') : '';
          return (
            <button
              key={i}
              type="button"
              className={`pr-token${cls}`}
              onClick={() => tap(i)}
              disabled={answered}
            >
              {tok}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="pr-correction">
          <span className="pr-arrow">→</span> {ex.correct}
        </div>
      )}
    </div>
  );
}
