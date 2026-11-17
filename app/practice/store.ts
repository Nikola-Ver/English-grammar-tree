/**
 * Practice state: SRS item states, daily activity, streak, XP, scores and badges.
 * Local-first (localStorage), merged with Firestore by practiceSync when signed in.
 */
import {
  applyClaudeMistakes,
  type ClaudeAnswer,
  type ClaudeMistake,
  isShaky,
  type ShakyEntry,
} from './claude.ts';
import { dayKey, dayNumber, type ItemState, markKnown, review } from './srs.ts';

export interface DayStat {
  /** xp earned */
  xp: number;
  /** answers */
  n: number;
  /** correct answers */
  c: number;
  /** sessions finished */
  s: number;
  /** active milliseconds */
  ms: number;
}

export interface StreakState {
  cur: number;
  best: number;
  /** day number when the goal was last met */
  last: number;
  freezes: number;
  /** day numbers bridged by a streak freeze */
  frozen: number[];
}

export interface PracticeSettings {
  goal: number;
  sound: boolean;
  /** CEFR level chosen by the placement test (A1…C2) */
  placement?: string;
  placementAt?: number;
  updatedAt: number;
}

export interface PracticeState {
  v: 1;
  items: Record<string, ItemState>;
  days: Record<string, DayStat>;
  streak: StreakState;
  settings: PracticeSettings;
  badges: Record<string, number>;
  bosses: Record<string, { best: number; passedAt?: number }>;
  games: Record<string, { best: number; plays: number }>;
  xp: number;
  /** rules flagged by repeated real-world mistakes reported through the Claude connector */
  shaky: Record<string, ShakyEntry>;
  /** upload time of the newest connector mistake already applied to `items` */
  claudeAt: number;
  updatedAt: number;
  /** set by "reset practice progress"; data older than this is discarded on merge */
  resetAt?: number;
}

const LS_KEY = 'practice_v1';
export const PRACTICE_CHANGED_EVENT = 'practice-changed';
export const GOAL_OPTIONS = [30, 50, 100, 150];
export const XP_CORRECT = 10;
export const XP_WRONG = 2;
const MAX_FREEZES = 2;

export function emptyState(): PracticeState {
  return {
    v: 1,
    items: {},
    days: {},
    streak: { cur: 0, best: 0, last: 0, freezes: 0, frozen: [] },
    settings: { goal: 50, sound: true, updatedAt: 0 },
    badges: {},
    bosses: {},
    games: {},
    xp: 0,
    shaky: {},
    claudeAt: 0,
    updatedAt: 0,
  };
}

function load(): PracticeState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<PracticeState>;
    const base = emptyState();
    return {
      ...base,
      ...parsed,
      streak: { ...base.streak, ...parsed.streak },
      settings: { ...base.settings, ...parsed.settings },
    };
  } catch {
    return emptyState();
  }
}

let state: PracticeState = load();
const listeners = new Set<() => void>();
let localChangeHook: (() => void) | null = null;
let persistTimer: ReturnType<typeof setTimeout> | null = null;
const PERSIST_DELAY_MS = 400;

/** Write the state to localStorage now (called on page hide and after debounced bursts). */
export function flushLocal() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = null;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // storage full or blocked — state stays in memory
  }
}

/** Coalesce bursts of changes (one answer = several commits) into one storage write. */
function persist() {
  if (persistTimer) return;
  persistTimer = setTimeout(flushLocal, PERSIST_DELAY_MS);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushLocal);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushLocal();
  });
}

function emit() {
  for (const fn of listeners) fn();
  window.dispatchEvent(new CustomEvent(PRACTICE_CHANGED_EVENT));
}

function commit(next: PracticeState, local = true) {
  state = next;
  persist();
  emit();
  if (local) localChangeHook?.();
}

export function getState(): PracticeState {
  return state;
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** practiceSync registers here to push local changes. */
export function setLocalChangeHook(fn: (() => void) | null) {
  localChangeHook = fn;
}

// ---------------------------------------------------------------------------
// Streak
// ---------------------------------------------------------------------------

function applyGoalMet(streak: StreakState, today: number): StreakState {
  if (streak.last === today) return streak;
  const s = { ...streak, frozen: [...streak.frozen] };
  const gap = streak.last ? today - streak.last - 1 : Number.POSITIVE_INFINITY;
  if (gap === 0) {
    s.cur += 1;
  } else if (gap > 0 && gap <= s.freezes) {
    s.freezes -= gap;
    for (let d = streak.last + 1; d < today; d++) s.frozen.push(d);
    s.cur += 1;
  } else {
    s.cur = 1;
  }
  s.last = today;
  s.best = Math.max(s.best, s.cur);
  if (s.cur > 0 && s.cur % 7 === 0) s.freezes = Math.min(MAX_FREEZES, s.freezes + 1);
  s.frozen = s.frozen.slice(-30);
  return s;
}

export interface StreakView {
  /** streak length that is still alive (0 if broken) */
  current: number;
  best: number;
  freezes: number;
  doneToday: boolean;
  /** alive but today's goal not met yet */
  atRisk: boolean;
}

export function streakView(s: PracticeState = state, today = dayNumber()): StreakView {
  const { streak } = s;
  const doneToday = streak.last === today;
  const gap = streak.last ? today - streak.last - 1 : Number.POSITIVE_INFINITY;
  const alive = doneToday || gap <= streak.freezes;
  return {
    current: alive ? streak.cur : 0,
    best: streak.best,
    freezes: streak.freezes,
    doneToday,
    atRisk: alive && !doneToday && streak.cur > 0,
  };
}

export function todayStat(s: PracticeState = state): DayStat {
  return s.days[dayKey(dayNumber())] ?? { xp: 0, n: 0, c: 0, s: 0, ms: 0 };
}

export function levelFromXp(xp: number): { level: number; into: number; span: number } {
  // level n starts at 50·n·(n−1) XP: 0, 100, 300, 600, 1000 …
  let level = 1;
  while (50 * (level + 1) * level <= xp) level++;
  const start = 50 * level * (level - 1);
  const next = 50 * (level + 1) * level;
  return { level, into: xp - start, span: next - start };
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export interface AnswerOptions {
  /** update the SRS schedule (false for arcade-only generated rounds) */
  srs?: boolean;
  /** extra XP (combo bonuses) */
  bonus?: number;
  /** active time spent on this answer */
  ms?: number;
}

export function recordAnswer(itemId: string | null, correct: boolean, opts: AnswerOptions = {}) {
  const now = Date.now();
  const today = dayNumber(now);
  const key = dayKey(today);
  const gained = (correct ? XP_CORRECT : XP_WRONG) + (opts.bonus ?? 0);
  const day = { ...(state.days[key] ?? { xp: 0, n: 0, c: 0, s: 0, ms: 0 }) };
  day.xp += gained;
  day.n += 1;
  if (correct) day.c += 1;
  day.ms += Math.min(opts.ms ?? 0, 120_000);
  const items =
    itemId && opts.srs !== false
      ? { ...state.items, [itemId]: review(state.items[itemId], correct, now) }
      : state.items;
  let streak = state.streak;
  if (day.xp >= state.settings.goal && (state.days[key]?.xp ?? 0) < state.settings.goal) {
    streak = applyGoalMet(streak, today);
  }
  commit({
    ...state,
    items,
    days: { ...state.days, [key]: day },
    streak,
    xp: state.xp + gained,
    updatedAt: now,
  });
  return gained;
}

export function recordSessionEnd(gameId: string, score: number) {
  const now = Date.now();
  const key = dayKey(dayNumber(now));
  const day = { ...(state.days[key] ?? { xp: 0, n: 0, c: 0, s: 0, ms: 0 }) };
  day.s += 1;
  const prev = state.games[gameId] ?? { best: 0, plays: 0 };
  commit({
    ...state,
    days: { ...state.days, [key]: day },
    games: {
      ...state.games,
      [gameId]: { best: Math.max(prev.best, score), plays: prev.plays + 1 },
    },
    updatedAt: now,
  });
}

export function markItemsKnown(itemIds: string[], box: number) {
  const now = Date.now();
  const items = { ...state.items };
  for (const id of itemIds) items[id] = markKnown(items[id], box, now);
  commit({ ...state, items, updatedAt: now });
}

export function setGoal(goal: number) {
  const now = Date.now();
  commit({ ...state, settings: { ...state.settings, goal, updatedAt: now }, updatedAt: now });
}

export function setSound(sound: boolean) {
  const now = Date.now();
  commit({ ...state, settings: { ...state.settings, sound, updatedAt: now }, updatedAt: now });
}

export function setPlacement(level: string) {
  const now = Date.now();
  commit({
    ...state,
    settings: { ...state.settings, placement: level, placementAt: now, updatedAt: now },
    updatedAt: now,
  });
}

export function recordBoss(levelId: string, pct: number, passed: boolean) {
  const now = Date.now();
  const prev = state.bosses[levelId] ?? { best: 0 };
  commit({
    ...state,
    bosses: {
      ...state.bosses,
      [levelId]: {
        best: Math.max(prev.best, pct),
        passedAt: prev.passedAt ?? (passed ? now : undefined),
      },
    },
    updatedAt: now,
  });
}

export function awardBadges(ids: string[]): string[] {
  const fresh = ids.filter((id) => !state.badges[id]);
  if (fresh.length === 0) return [];
  const now = Date.now();
  const badges = { ...state.badges };
  for (const id of fresh) badges[id] = now;
  commit({ ...state, badges, updatedAt: now });
  return fresh;
}

/**
 * Apply mistakes reported by the Claude connector that this state has not seen yet.
 * Returns true when something changed.
 */
export function ingestClaudeMistakes(
  mistakes: ClaudeMistake[],
  itemsOfRule: (ruleId: string) => string[] | undefined,
): boolean {
  const now = Date.now();
  const next = applyClaudeMistakes(state, mistakes, itemsOfRule, now);
  if (!next) return false;
  const { answers, sessions, ...slice } = next;
  commit({ ...state, ...slice, ...creditClaudePractice(state, answers, sessions), updatedAt: now });
  return true;
}

/**
 * Count answers given in Claude drills like answers given in the app, on the day they were
 * given: XP, the daily goal and the streak. Finished rounds count as sessions.
 */
export function creditClaudePractice(
  s: PracticeState,
  answers: ClaudeAnswer[],
  sessions: number[],
): Pick<PracticeState, 'days' | 'streak' | 'xp' | 'games'> {
  const days = { ...s.days };
  let { streak, xp } = s;
  const dayOf = (t: number) => {
    const key = dayKey(dayNumber(t));
    days[key] = { ...(days[key] ?? { xp: 0, n: 0, c: 0, s: 0, ms: 0 }) };
    return days[key];
  };
  for (const a of answers) {
    const day = dayOf(a.t);
    const gained = a.correct ? XP_CORRECT : XP_WRONG;
    const before = day.xp;
    day.xp += gained;
    day.n += 1;
    if (a.correct) day.c += 1;
    xp += gained;
    const dayNo = dayNumber(a.t);
    if (before < s.settings.goal && day.xp >= s.settings.goal && dayNo > streak.last) {
      streak = applyGoalMet(streak, dayNo);
    }
  }
  let games = s.games;
  if (sessions.length) {
    for (const t of sessions) dayOf(t).s += 1;
    const prev = games.claude ?? { best: 0, plays: 0 };
    games = { ...games, claude: { best: prev.best, plays: prev.plays + sessions.length } };
  }
  return { days, streak, xp, games };
}

export function resetPractice() {
  const now = Date.now();
  // keep the connector high-water mark so old Claude mistakes are not applied again
  commit({ ...emptyState(), claudeAt: state.claudeAt, resetAt: now, updatedAt: now });
}

// ---------------------------------------------------------------------------
// Merge (sync)
// ---------------------------------------------------------------------------

export function mergeStates(a0: PracticeState, b0: PracticeState): PracticeState {
  // A reset on one device wins over everything recorded before it on the other.
  const ra = a0.resetAt ?? 0;
  const rb = b0.resetAt ?? 0;
  const a = rb > ra ? { ...emptyState(), resetAt: rb, settings: a0.settings } : a0;
  const b = ra > rb ? { ...emptyState(), resetAt: ra } : b0;
  const items: Record<string, ItemState> = { ...a.items };
  for (const [id, st] of Object.entries(b.items ?? {})) {
    const cur = items[id];
    if (!cur || st.s > cur.s) items[id] = st;
  }
  const days: Record<string, DayStat> = { ...a.days };
  for (const [k, d] of Object.entries(b.days ?? {})) {
    const cur = days[k];
    days[k] = cur
      ? {
          xp: Math.max(cur.xp, d.xp),
          n: Math.max(cur.n, d.n),
          c: Math.max(cur.c, d.c),
          s: Math.max(cur.s, d.s),
          ms: Math.max(cur.ms, d.ms),
        }
      : d;
  }
  const sa = a.streak;
  const sb = b.streak ?? sa;
  const streak =
    sb.last > sa.last || (sb.last === sa.last && sb.cur > sa.cur)
      ? { ...sb, best: Math.max(sa.best, sb.best) }
      : { ...sa, best: Math.max(sa.best, sb.best) };
  const settings =
    (b.settings?.updatedAt ?? 0) > a.settings.updatedAt
      ? { ...a.settings, ...b.settings }
      : a.settings;
  const badges = { ...a.badges };
  for (const [k, t] of Object.entries(b.badges ?? {}))
    badges[k] = badges[k] ? Math.min(badges[k], t) : t;
  const bosses = { ...a.bosses };
  for (const [k, v] of Object.entries(b.bosses ?? {})) {
    const cur = bosses[k];
    bosses[k] = cur
      ? { best: Math.max(cur.best, v.best), passedAt: cur.passedAt ?? v.passedAt }
      : v;
  }
  const games = { ...a.games };
  for (const [k, v] of Object.entries(b.games ?? {})) {
    const cur = games[k];
    games[k] = cur ? { best: Math.max(cur.best, v.best), plays: Math.max(cur.plays, v.plays) } : v;
  }
  const shaky: Record<string, ShakyEntry> = { ...(a.shaky ?? {}) };
  for (const [r, e] of Object.entries(b.shaky ?? {})) {
    const cur = shaky[r];
    if (!cur) shaky[r] = e;
    else {
      // an entry that has recovered is superseded by a newer flag; otherwise keep both item lists
      const [old, fresh] = e.t >= cur.t ? [cur, e] : [e, cur];
      shaky[r] = isShaky(old, items)
        ? { t: fresh.t, items: [...new Set([...old.items, ...fresh.items])] }
        : fresh;
    }
  }
  return {
    v: 1,
    items,
    days,
    streak,
    settings,
    badges,
    bosses,
    games,
    xp: Math.max(a.xp, b.xp ?? 0),
    shaky,
    claudeAt: Math.max(a.claudeAt ?? 0, b.claudeAt ?? 0),
    updatedAt: Math.max(a.updatedAt, b.updatedAt ?? 0),
    ...(Math.max(ra, rb) ? { resetAt: Math.max(ra, rb) } : {}),
  };
}

/** Fill in defaults for a state that came from Firestore (older docs may miss fields). */
export function normalizeState(raw: Partial<PracticeState> | undefined): PracticeState {
  const base = emptyState();
  if (!raw) return base;
  return {
    ...base,
    ...raw,
    items: raw.items ?? {},
    days: raw.days ?? {},
    streak: { ...base.streak, ...raw.streak },
    settings: { ...base.settings, ...raw.settings },
    badges: raw.badges ?? {},
    bosses: raw.bosses ?? {},
    games: raw.games ?? {},
    shaky: raw.shaky ?? {},
    claudeAt: raw.claudeAt ?? 0,
  };
}

const TOP_LEVEL_MAPS = ['streak', 'settings', 'badges', 'bosses', 'games', 'shaky'] as const;

/**
 * Smallest Firestore update that brings `base` (what the server has) up to `cur`.
 * Returns 'full' when the document must be replaced (first upload, or after a reset),
 * null when nothing changed, otherwise a partial object for setDoc(..., { merge: true }).
 */
export function practicePatch(
  cur: PracticeState,
  base: PracticeState | null,
): Record<string, unknown> | 'full' | null {
  if (!base || (cur.resetAt ?? 0) > (base.resetAt ?? 0)) return 'full';
  const patch: Record<string, unknown> = {};
  const items: Record<string, ItemState> = {};
  for (const [id, st] of Object.entries(cur.items)) {
    const old = base.items[id];
    if (!old || old.s !== st.s || old.n !== st.n || old.b !== st.b || old.d !== st.d)
      items[id] = st;
  }
  if (Object.keys(items).length) patch.items = items;
  const days: Record<string, DayStat> = {};
  for (const [k, d] of Object.entries(cur.days)) {
    const old = base.days[k];
    if (!old || old.xp !== d.xp || old.n !== d.n || old.s !== d.s || old.ms !== d.ms) days[k] = d;
  }
  if (Object.keys(days).length) patch.days = days;
  for (const key of TOP_LEVEL_MAPS) {
    if (JSON.stringify(cur[key]) !== JSON.stringify(base[key])) patch[key] = cur[key];
  }
  if (cur.xp !== base.xp) patch.xp = cur.xp;
  if (cur.claudeAt !== base.claudeAt) patch.claudeAt = cur.claudeAt;
  if (Object.keys(patch).length === 0) return null;
  patch.updatedAt = cur.updatedAt;
  patch.v = 1;
  return patch;
}

/** Apply a remote snapshot. Returns true when local state changed. */
export function applyRemote(remote: PracticeState): boolean {
  const merged = mergeStates(state, normalizeState(remote));
  if (JSON.stringify(merged) === JSON.stringify(state)) return false;
  commit(merged, false);
  return true;
}

/** Re-read localStorage (e.g. after another tab wrote). */
export function reloadFromStorage() {
  state = load();
  emit();
}
