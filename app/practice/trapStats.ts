/** Which Russian-speaker traps a learner falls into most (from SRS item history). */
import type { TrapKey } from './content/types';
import type { PracticeIndex } from './items';
import { type ItemState, inMistakeDeck } from './srs';
import { TRAPS } from './traps';

export interface TrapStat {
  trap: TrapKey;
  /** answers given on items with this trap */
  answers: number;
  correct: number;
  /** items with this trap currently in the mistake deck */
  deck: number;
  /** wrong answers on items touched in the last 14 days */
  recentLapses: number;
  /** items available to practise */
  available: number;
  /** 0..1, higher = weaker (smoothed error rate weighted by recency) */
  weakness: number;
}

const RECENT_DAYS = 14;
/** Minimum answers before a trap can be called "yours". */
export const TRAP_MIN_ANSWERS = 4;

export function trapStats(index: PracticeIndex, items: Record<string, ItemState>): TrapStat[] {
  const since = Date.now() - RECENT_DAYS * 86_400_000;
  return TRAPS.map(({ key }) => {
    const ids = index.byTrap.get(key) ?? [];
    let answers = 0;
    let correct = 0;
    let deck = 0;
    let recentLapses = 0;
    for (const id of ids) {
      const st = items[id];
      if (!st) continue;
      answers += st.n;
      correct += st.c;
      if (inMistakeDeck(st)) deck++;
      if (st.s >= since) recentLapses += st.l;
    }
    const errorRate = (answers - correct + 1) / (answers + 3);
    const recency = Math.min(1, (recentLapses + deck) / 4);
    const weakness = answers >= TRAP_MIN_ANSWERS ? errorRate * 0.7 + recency * 0.3 : 0;
    return { trap: key, answers, correct, deck, recentLapses, available: ids.length, weakness };
  }).sort((a, b) => b.weakness - a.weakness || b.answers - a.answers);
}

/** The learner's weakest traps with enough evidence (at most `n`). */
export function topTraps(
  index: PracticeIndex,
  items: Record<string, ItemState>,
  n = 3,
): TrapStat[] {
  return trapStats(index, items)
    .filter((t) => t.answers >= TRAP_MIN_ANSWERS && t.correct < t.answers && t.available > 0)
    .slice(0, n);
}
