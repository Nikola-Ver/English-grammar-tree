import type { Rng } from '../../../practice/rng';
import type { Exercise } from '../../../practice/types';

export interface ExerciseProps<E extends Exercise> {
  ex: E;
  answered: boolean;
  /** score 0..1 (partial credit); correct = whether it counts as right */
  onAnswer: (correct: boolean, score?: number) => void;
  rng: Rng;
  /** fast mode (sprint): no extra confirmation steps */
  sprint?: boolean;
}

/** Renders "___" gaps as styled blanks; fills the blank once answered. */
export function GapText({
  text,
  fill,
  state,
}: {
  text: string;
  fill?: string;
  state?: 'ok' | 'bad';
}) {
  const parts = text.split('___');
  return (
    <>
      {parts.map((p, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static split of a fixed string
        <span key={i}>
          {p}
          {i < parts.length - 1 && (
            <span className={`pr-blank${fill ? ` filled ${state ?? ''}` : ''}`}>
              {fill ? displayOption(fill) : ' '}
            </span>
          )}
        </span>
      ))}
    </>
  );
}

export function displayOption(o: string): string {
  return o === '—' ? '∅' : o;
}

export function Html({ html, className }: { html: string; className?: string }) {
  // Content comes from the app's own rule data and drill files (trusted).
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
