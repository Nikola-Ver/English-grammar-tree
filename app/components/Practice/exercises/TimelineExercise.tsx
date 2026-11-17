import { useMemo, useState } from 'react';
import { TENSES } from '../../../data/tenses';
import { shuffle } from '../../../practice/rng';
import type { TimelineEx } from '../../../practice/types';
import type { ExerciseProps } from './common';
import { TensePictogram } from './TensePictogram';

export function TimelineExercise({ ex, answered, onAnswer, rng }: ExerciseProps<TimelineEx>) {
  const order = useMemo(() => shuffle(ex.options, rng), [ex, rng]);
  const [picked, setPicked] = useState<string | null>(null);

  function choose(k: string) {
    if (answered) return;
    setPicked(k);
    onAnswer(k === ex.tense);
  }

  return (
    <div className="pr-ex">
      <div className="pr-prompt">{ex.sentence}</div>
      <div className="pr-picto-grid">
        {order.map((k) => {
          const state = answered ? (k === ex.tense ? ' ok' : k === picked ? ' bad' : ' dim') : '';
          return (
            <button
              key={k}
              type="button"
              className={`pr-picto-card${state}`}
              onClick={() => choose(k)}
              disabled={answered}
            >
              <TensePictogram tense={k} />
              <span className={`pr-picto-name${answered ? ' shown' : ''}`}>
                {answered ? TENSES[k].name : ' '}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
