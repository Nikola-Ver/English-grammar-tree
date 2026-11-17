import { useEffect, useRef, useState } from 'react';
import type { QuickEx } from '../../../practice/types';
import { displayOption, type ExerciseProps, GapText, Html } from './common';

const SWIPE_PX = 56;

/**
 * One gap, a few big keys that never move: a / an / the / ∅, or the two sides of a tense duel.
 * Keys 1–4 answer; with two options the arrow keys and a swipe work too.
 */
export function QuickExercise({ ex, answered, onAnswer, sprint }: ExerciseProps<QuickEx>) {
  const [picked, setPicked] = useState<number | null>(null);
  const [drag, setDrag] = useState(0);
  const startX = useRef<number | null>(null);
  const duel = ex.options.length === 2;

  function choose(i: number) {
    if (answered || picked !== null) return;
    setPicked(i);
    onAnswer(i === ex.answer);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const n = Number(e.key);
      if (n >= 1 && n <= ex.options.length) choose(n - 1);
      else if (duel && e.key === 'ArrowLeft') choose(0);
      else if (duel && e.key === 'ArrowRight') choose(1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const right = picked === ex.answer;
  const cardState = picked === null ? '' : right ? ' ok' : ' bad';
  const lean = picked === null ? drag : 0;

  return (
    <div className={`pr-ex pr-quick${duel ? ' duel' : ''}`}>
      <div
        className={`pr-quick-card${cardState}`}
        style={lean ? { transform: `translateX(${lean}px) rotate(${lean / 18}deg)` } : undefined}
        onPointerDown={(e) => {
          if (!duel || answered) return;
          startX.current = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (startX.current !== null)
            setDrag(Math.max(-90, Math.min(90, e.clientX - startX.current)));
        }}
        onPointerUp={() => {
          if (startX.current === null) return;
          startX.current = null;
          if (drag <= -SWIPE_PX) choose(0);
          else if (drag >= SWIPE_PX) choose(1);
          setDrag(0);
        }}
        onPointerCancel={() => {
          startX.current = null;
          setDrag(0);
        }}
      >
        <div className={`pr-prompt${ex.prompt.length > 60 ? ' long' : ''}`}>
          <GapText
            text={ex.prompt}
            fill={picked === null ? undefined : ex.options[ex.answer]}
            state={right ? 'ok' : 'bad'}
          />
        </div>
        {sprint && picked !== null && !right && ex.why && (
          <Html className="pr-quick-why" html={ex.why} />
        )}
      </div>
      <div
        className="pr-quick-keys"
        style={{ gridTemplateColumns: `repeat(${ex.options.length}, 1fr)` }}
      >
        {ex.options.map((o, i) => {
          const state =
            picked === null ? '' : i === ex.answer ? ' ok' : i === picked ? ' bad' : ' dim';
          const leaning =
            duel &&
            picked === null &&
            ((i === 0 && drag <= -SWIPE_PX) || (i === 1 && drag >= SWIPE_PX));
          return (
            <button
              key={o}
              type="button"
              className={`pr-quick-key${state}${leaning ? ' lean' : ''}`}
              onClick={() => choose(i)}
              disabled={answered}
            >
              <span className="pr-quick-form">{displayOption(o)}</span>
              {ex.labels?.[i] && <span className="pr-quick-label">{ex.labels[i]}</span>}
              <span className="pr-key">{duel ? (i === 0 ? '←' : '→') : i + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
