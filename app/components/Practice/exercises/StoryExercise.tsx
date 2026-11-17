import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parseStory } from '../../../practice/gameText';
import { shuffle } from '../../../practice/rng';
import type { StoryEx } from '../../../practice/types';
import { type ExerciseProps, Html } from './common';

/**
 * Story time: a short story with a choice in every gap. One gap is active at a time; its
 * options sit in a bar under the story, and picking one moves on to the next empty gap.
 */
export function StoryExercise({ ex, answered, onAnswer, rng }: ExerciseProps<StoryEx>) {
  const { t } = useTranslation();
  const story = useMemo(() => parseStory(ex.text), [ex]);
  // option order per gap: [index into gap.options, …]; 0 is the right one
  const orders = useMemo(
    () =>
      story.gaps.map((g) =>
        shuffle(
          g.options.map((_, i) => i),
          rng,
        ),
      ),
    [story, rng],
  );
  const [choice, setChoice] = useState<(number | null)[]>(() => story.gaps.map(() => null));
  const [active, setActive] = useState(0);
  const [checked, setChecked] = useState(false);
  const allSet = choice.every((c) => c !== null);

  function pick(option: number) {
    if (answered) return;
    const nextChoice = choice.map((c, g) => (g === active ? option : c));
    setChoice(nextChoice);
    // move to the next empty gap, wrapping round
    for (let step = 1; step <= story.gaps.length; step++) {
      const g = (active + step) % story.gaps.length;
      if (nextChoice[g] === null) {
        setActive(g);
        return;
      }
    }
  }

  function check() {
    const right = choice.filter((c) => c === 0).length;
    const score = right / story.gaps.length;
    setChecked(true);
    onAnswer(score >= 0.8, score);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (answered) return;
      const n = Number(e.key);
      const order = orders[active];
      if (order && n >= 1 && n <= order.length) pick(order[n - 1]);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const gap = story.gaps[active];
  const misses = checked ? story.gaps.map((_, g) => g).filter((g) => choice[g] !== 0) : [];

  return (
    <div className="pr-ex pr-story">
      {ex.title && <div className="pr-story-title">{ex.title}</div>}
      <div className="pr-story-text">
        {story.parts.map((part, i) => {
          const g = story.gaps[i];
          const c = choice[i];
          const state = checked ? (c === 0 ? ' ok' : ' bad') : i === active ? ' active' : '';
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: static text segments
            <span key={i}>
              {part}
              {g && (
                <button
                  type="button"
                  className={`pr-story-gap${c === null ? ' empty' : ''}${state}`}
                  onClick={() => setActive(i)}
                  disabled={answered}
                >
                  {checked && c !== 0 && c !== null && <s>{g.options[c]}</s>}
                  {checked ? g.options[0] : c === null ? (g.hint ?? '…') : g.options[c]}
                </button>
              )}
            </span>
          );
        })}
      </div>

      {!answered && gap && (
        <div className="pr-story-bar">
          <div className="pr-story-bar-label">
            {t('practice.story.gap', { i: active + 1, n: story.gaps.length })}
            {gap.hint ? ` · ${gap.hint}` : ''}
          </div>
          <div className="pr-story-options">
            {orders[active].map((o, k) => (
              <button
                key={o}
                type="button"
                className={`pr-option${choice[active] === o ? ' picked' : ''}`}
                onClick={() => pick(o)}
              >
                <span className="pr-key">{k + 1}</span>
                {gap.options[o]}
              </button>
            ))}
          </div>
        </div>
      )}

      {checked && misses.length > 0 && (
        <ul className="pr-story-notes">
          {misses.map((g) => (
            <li key={g}>
              <b>{story.gaps[g].options[0]}</b>
              {ex.notes[g] ? ' — ' : ''}
              {ex.notes[g] && <Html html={ex.notes[g]} />}
            </li>
          ))}
        </ul>
      )}

      {!answered && (
        <div className="pr-actions">
          <button type="button" className="pr-btn primary" onClick={check} disabled={!allSet}>
            {t('practice.check')}
          </button>
        </div>
      )}
    </div>
  );
}
