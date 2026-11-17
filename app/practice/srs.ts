/**
 * Leitner-style spaced repetition.
 *
 * Each item sits in a box 0..7. A correct answer on a due item moves it up one box and
 * schedules the next review INTERVALS[box] days later; a wrong answer drops it to box 0/1
 * and makes it due again today. Answering an item that is not yet due (e.g. replaying a game)
 * is recorded but does not move it up — mastery requires remembering across days.
 */

export interface ItemState {
  /** box 0..7 */
  b: number;
  /** due day (days since epoch, local time) */
  d: number;
  /** total answers */
  n: number;
  /** correct answers */
  c: number;
  /** lapses (wrong answers) */
  l: number;
  /** correct answers on distinct days since the last lapse (mistake-deck clearing) */
  f: number;
  /** day of the last correct answer counted in `f` */
  fd: number;
  /** last answered, ms epoch (merge key) */
  s: number;
}

export const INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120];
export const MAX_BOX = INTERVALS.length - 1;
/** Correct answers on separate days needed to clear an item from the mistake deck. */
export const FIX_TARGET = 3;

export function dayNumber(ms: number = Date.now()): number {
  const d = new Date(ms);
  return Math.floor((d.getTime() - d.getTimezoneOffset() * 60_000) / 86_400_000);
}

export function dayKey(day: number): string {
  return new Date(day * 86_400_000).toISOString().slice(0, 10);
}

export function isDue(st: ItemState | undefined, today: number): boolean {
  return !st || st.d <= today;
}

export function review(
  prev: ItemState | undefined,
  correct: boolean,
  now: number = Date.now(),
): ItemState {
  const today = dayNumber(now);
  const st: ItemState = prev
    ? { ...prev }
    : { b: 0, d: today, n: 0, c: 0, l: 0, f: 0, fd: 0, s: now };
  st.n += 1;
  st.s = now;
  if (correct) {
    st.c += 1;
    if (st.d <= today) {
      st.b = Math.min(MAX_BOX, st.b + 1);
      st.d = today + INTERVALS[st.b];
    }
    if (st.l > 0 && st.fd !== today && st.f < FIX_TARGET) {
      st.f += 1;
      st.fd = today;
    }
  } else {
    st.l += 1;
    st.f = 0;
    st.fd = 0;
    st.b = st.b >= 3 ? 1 : 0;
    st.d = today;
  }
  return st;
}

/** Seed an item as already known (test-out / placement). */
export function markKnown(prev: ItemState | undefined, box: number, now = Date.now()): ItemState {
  const today = dayNumber(now);
  const b = Math.max(prev?.b ?? 0, box);
  return {
    b,
    d: today + INTERVALS[b],
    n: (prev?.n ?? 0) + 1,
    c: (prev?.c ?? 0) + 1,
    l: prev?.l ?? 0,
    f: prev?.f ?? 0,
    fd: prev?.fd ?? 0,
    s: now,
  };
}

export function inMistakeDeck(st: ItemState | undefined): boolean {
  return !!st && st.l > 0 && st.f < FIX_TARGET;
}

/**
 * Mastery stages of a rule (the leaf on the tree):
 *  0 seed     — never practised
 *  1 sprout   — started
 *  2 leaf     — answered correctly
 *  3 blossom  — remembered across days (counts as "done")
 *  4 fruit    — long-term (2+ weeks)
 */
export type Stage = 0 | 1 | 2 | 3 | 4;
export const STAGE_DONE: Stage = 3;
const SAMPLE = 6;

export interface RuleMastery {
  stage: Stage;
  /** 0..1 progress within the mastery scale */
  score: number;
  /** some practised item is overdue → the leaf is wilting */
  wilting: boolean;
  dueCount: number;
  seen: number;
  total: number;
  accuracy: number | null;
}

export function ruleMastery(
  itemIds: string[] | undefined,
  states: Record<string, ItemState>,
  today: number,
): RuleMastery {
  const ids = itemIds ?? [];
  const boxes: number[] = [];
  let seen = 0;
  let due = 0;
  let n = 0;
  let c = 0;
  for (const id of ids) {
    const st = states[id];
    if (!st) continue;
    seen++;
    n += st.n;
    c += st.c;
    boxes.push(st.b);
    if (st.d < today && st.b >= 1) due++;
  }
  if (seen === 0) {
    return {
      stage: 0,
      score: 0,
      wilting: false,
      dueCount: 0,
      seen: 0,
      total: ids.length,
      accuracy: null,
    };
  }
  const k = Math.min(SAMPLE, ids.length);
  boxes.sort((a, b) => b - a);
  const top = boxes.slice(0, k);
  while (top.length < k) top.push(0);
  const score = top.reduce((s, b) => s + Math.min(b, 4), 0) / (4 * k);
  const stage: Stage = score >= 0.95 ? 4 : score >= 0.6 ? 3 : score >= 0.25 ? 2 : 1;
  return {
    stage,
    score,
    wilting: stage >= 2 && due > 0,
    dueCount: due,
    seen,
    total: ids.length,
    accuracy: n ? c / n : null,
  };
}
