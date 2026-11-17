/**
 * Real-world mistakes reported by the Claude connector (see mcp/).
 *
 * The connector appends mistakes to users/{uid}/practice/claude. The app turns them into
 * spaced-repetition evidence: every mistake sends one item of the rule back to the mistake
 * deck; repeated mistakes flag the whole rule as "shaky" — its best items lapse, so the leaf
 * drops below "mastered" even when the rule is ticked as done — until those items are answered
 * correctly on FIX_TARGET different days.
 *
 * Pure module (no browser / Firebase imports): shared by the app, the connector and tests.
 */
import { dayNumber, type ItemState, inMistakeDeck, review } from './srs.ts';

export interface ClaudeMistake {
  /** stable id, [a-z][a-z0-9]* (used as a Firestore field name) */
  id: string;
  /** rule id (grammar rule, Murphy unit or word topic) */
  r: string;
  /** what the learner wrote */
  w: string;
  /** corrected version */
  c: string;
  /** short note on why */
  n?: string;
  /** when the mistake was made, ms epoch */
  t: number;
  /** when the connector uploaded it, ms epoch (the app's high-water mark) */
  at: number;
  /** 'drill' = wrong answer in a drill run inside Claude */
  src?: 'chat' | 'drill';
  /**
   * Entries that are not mistakes:
   * 'ok' = an exercise answered correctly in a Claude drill, 'flag' = Claude marked the rule
   * as shaky, 'session' = a finished round of Claude drills.
   */
  k?: 'ok' | 'flag' | 'session';
  /** the app exercise that was answered (drills) */
  i?: string;
  /** questions and correct answers in a finished round ('session') */
  q?: number;
  ok?: number;
}

/** An answer given in a Claude drill, to be counted like an answer given in the app. */
export interface ClaudeAnswer {
  t: number;
  correct: boolean;
}

/** What applying the connector's log changes, beyond the items themselves. */
export interface ClaudeApplied extends ClaudeSlice {
  answers: ClaudeAnswer[];
  /** end times of finished Claude drill rounds */
  sessions: number[];
}

/** True for a real mistake (not a correct answer, a flag or a session marker). */
export function isMistake(m: ClaudeMistake): boolean {
  return !m.k;
}

export interface ShakyEntry {
  /** time of the latest mistake counted, ms epoch */
  t: number;
  /** items lapsed because of it; the rule stays shaky while any is in the mistake deck */
  items: string[];
}

/** The slice of the practice state this module reads and rewrites. */
export interface ClaudeSlice {
  items: Record<string, ItemState>;
  shaky: Record<string, ShakyEntry>;
  claudeAt: number;
}

export const SHAKY_WINDOW_DAYS = 14;
/** Mistakes on one rule within the window… */
export const SHAKY_MIN = 3;
/** …made on at least this many different days. */
export const SHAKY_MIN_DAYS = 2;
/** Items sent back when a rule turns shaky (same as the mastery sample). */
export const SHAKY_ITEMS = 6;
export const MAX_TEXT = 300;

export function isShaky(entry: ShakyEntry | undefined, items: Record<string, ItemState>): boolean {
  return !!entry && entry.items.some((id) => inMistakeDeck(items[id]));
}

export function shakyRuleIds(state: Pick<ClaudeSlice, 'items' | 'shaky'>): string[] {
  return Object.keys(state.shaky ?? {}).filter((r) => isShaky(state.shaky[r], state.items));
}

/** Mistakes on a rule after `since`, inside the window that ends at `now`. */
export function ruleEvidence(
  mistakes: ClaudeMistake[],
  ruleId: string,
  since: number,
  now: number,
): { n: number; days: number } {
  const from = Math.max(since, now - SHAKY_WINDOW_DAYS * 86_400_000);
  const days = new Set<number>();
  let n = 0;
  for (const m of mistakes) {
    if (m.k || m.r !== ruleId || m.t <= from || m.t > now) continue;
    n++;
    days.add(dayNumber(m.t));
  }
  return { n, days: days.size };
}

export function meetsShakyThreshold(ev: { n: number; days: number }): boolean {
  return ev.n >= SHAKY_MIN && ev.days >= SHAKY_MIN_DAYS;
}

function lapse(prev: ItemState | undefined, now: number): ItemState {
  const today = dayNumber(now);
  if (!prev) return { b: 0, d: today, n: 0, c: 0, l: 1, f: 0, fd: 0, s: now };
  return { ...prev, l: prev.l + 1, f: 0, fd: 0, b: prev.b >= 3 ? 1 : 0, d: today, s: now };
}

/** The rule's strongest items that are not in the mistake deck yet (stable order). */
function pickItems(ids: string[], items: Record<string, ItemState>, n: number): string[] {
  return ids
    .filter((id) => !inMistakeDeck(items[id]))
    .sort((a, b) => (items[b]?.b ?? -1) - (items[a]?.b ?? -1) || (a < b ? -1 : a > b ? 1 : 0))
    .slice(0, n);
}

/**
 * Apply connector entries the app has not seen yet (`at` above the state's high-water mark):
 * mistakes, correct drill answers, rules Claude flagged as shaky and finished drill rounds.
 * Returns the changed slice, or null when there is nothing new.
 */
export function applyClaudeMistakes(
  state: ClaudeSlice,
  mistakes: ClaudeMistake[],
  itemsOfRule: (ruleId: string) => string[] | undefined,
  now: number = Date.now(),
): ClaudeApplied | null {
  const mark = state.claudeAt ?? 0;
  const fresh = mistakes.filter((m) => m.at > mark).sort((a, b) => a.t - b.t);
  if (fresh.length === 0) return null;
  const items = { ...state.items };
  const shaky = { ...(state.shaky ?? {}) };
  const answers: ClaudeAnswer[] = [];
  const sessions: number[] = [];
  let claudeAt = mark;
  for (const m of fresh) {
    claudeAt = Math.max(claudeAt, m.at);
    if (m.k === 'session') {
      sessions.push(m.t);
      continue;
    }
    const ids = itemsOfRule(m.r);
    if (!ids?.length) continue;
    const drilled = m.i && ids.includes(m.i) ? m.i : null;
    if (m.k === 'ok') {
      // a correct answer in a Claude drill moves the exercise forward exactly as in the app
      if (drilled) {
        items[drilled] = review(items[drilled], true, m.t);
        answers.push({ t: m.t, correct: true });
      }
      continue;
    }
    const entry = shaky[m.r];
    const hit = (n: number) => {
      const picked = pickItems(ids, items, n);
      // the exercise that was actually answered wrong goes first
      if (drilled && !inMistakeDeck(items[drilled]) && !picked.includes(drilled)) {
        picked.pop();
        picked.unshift(drilled);
      }
      for (const id of picked) items[id] = lapse(items[id], now);
      return picked;
    };
    if (m.src === 'drill' && drilled) answers.push({ t: m.t, correct: false });
    if (m.k === 'flag') {
      // Claude's judgement counts as the evidence: the rule turns shaky at once
      const earlier = ids.filter((id) => inMistakeDeck(items[id]));
      const picked = hit(Math.max(1, SHAKY_ITEMS - earlier.length));
      shaky[m.r] = { t: Math.max(entry?.t ?? 0, m.t), items: [...earlier, ...picked] };
    } else if (isShaky(entry, items)) {
      shaky[m.r] = { t: Math.max(entry.t, m.t), items: [...entry.items, ...hit(1)] };
    } else if (meetsShakyThreshold(ruleEvidence(mistakes, m.r, entry?.t ?? 0, m.t))) {
      // keep the single items lapsed by the earlier mistakes in the list
      const earlier = ids.filter((id) => inMistakeDeck(items[id]));
      const picked = hit(Math.max(1, SHAKY_ITEMS - earlier.length));
      shaky[m.r] = { t: m.t, items: [...earlier, ...picked] };
    } else {
      // a recovered rule keeps only its date, so a single new slip does not flag it again
      if (entry?.items.length) shaky[m.r] = { t: entry.t, items: [] };
      hit(1);
    }
  }
  return { items, shaky, claudeAt, answers, sessions };
}

/** Trim and bound free text before it is stored. */
export function cleanText(s: unknown): string {
  return String(s ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_TEXT);
}

/** Parse the Firestore document (`{ m: { id: mistake } }`) into a list, oldest first. */
export function parseClaudeDoc(data: unknown): ClaudeMistake[] {
  const m = (data as { m?: Record<string, Partial<ClaudeMistake>> } | undefined)?.m;
  if (!m || typeof m !== 'object') return [];
  const out: ClaudeMistake[] = [];
  for (const [id, v] of Object.entries(m)) {
    if (!v || typeof v.t !== 'number') continue;
    const k = v.k === 'ok' || v.k === 'flag' || v.k === 'session' ? v.k : undefined;
    if (typeof v.r !== 'string' && k !== 'session') continue;
    out.push({
      id,
      r: typeof v.r === 'string' ? v.r : '',
      w: cleanText(v.w),
      c: cleanText(v.c),
      ...(v.n ? { n: cleanText(v.n) } : {}),
      t: v.t,
      at: typeof v.at === 'number' ? v.at : v.t,
      ...(v.src === 'drill' ? { src: 'drill' as const } : {}),
      ...(k ? { k } : {}),
      ...(typeof v.i === 'string' ? { i: v.i } : {}),
      ...(typeof v.q === 'number' ? { q: v.q } : {}),
      ...(typeof v.ok === 'number' ? { ok: v.ok } : {}),
    });
  }
  return out.sort((a, b) => a.t - b.t);
}
