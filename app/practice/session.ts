/**
 * Builders that turn the item index + the learner's state into exercise queues:
 * daily session, rule practice, test-out, placement, level exams and arcade games.
 */
import { listCuratedComparisons } from '../data/tenseComparisons';
import { TENSES } from '../data/tenses';
import type { DoneMap } from '../hooks/useProgress';
import type { UiLang } from '../i18n/localizeRules';
import type { DrillSetKey } from './content';
import { IRREGULAR_VERBS } from './content';
import type { TenseKey, TrapKey } from './content/types';
import { grammarRulesOfLevel, type PracticeIndex, TENSE_KEYS, TENSE_RULES } from './items';
import { pick, type Rng, sample, shuffle } from './rng';
import { dayNumber, inMistakeDeck, ruleMastery } from './srs';
import type { PracticeState } from './store';
import { topTraps } from './trapStats';
import type { Exercise, Item } from './types';

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type LevelId = (typeof LEVELS)[number];

export interface BuildCtx {
  index: PracticeIndex;
  state: PracticeState;
  rng: Rng;
  lang: UiLang;
  /** false = ignore the learner's schedule (challenge links must be reproducible) */
  personal: boolean;
  done: DoneMap;
  /** whether speech synthesis is available (dictation games) */
  canSpeak: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Highest CEFR level index the learner works at (placement or progress), default A2. */
export function userLevelIdx(ctx: Pick<BuildCtx, 'index' | 'state' | 'done'>): number {
  const placed = ctx.state.settings.placement;
  let lvl = placed ? LEVELS.indexOf(placed as LevelId) : -1;
  for (const id of ctx.index.grammarOrder) {
    if (ctx.done[id]) lvl = Math.max(lvl, ctx.index.rules.get(id)?.levelIdx ?? 0);
  }
  return lvl < 0 ? 1 : lvl;
}

/** Highest item level to draw from; challenges ignore personal progress so they stay reproducible. */
function levelCap(ctx: BuildCtx): number {
  return ctx.personal ? userLevelIdx(ctx) + 1 : 5;
}

function itemLevel(ctx: BuildCtx, item: Item): number {
  let lvl = 0;
  for (const r of item.rules) lvl = Math.max(lvl, ctx.index.rules.get(r)?.levelIdx ?? 0);
  return lvl;
}

function usable(ex: Exercise, ctx: BuildCtx): boolean {
  if (ex.kind === 'type' && ex.say && !ctx.canSpeak) return false;
  return true;
}

export interface VariantOpts {
  kinds?: Exercise['kind'][];
  /** prefer the hardest variant (tests, exams) */
  hard?: boolean;
  /** skip right/wrong variants when others exist (lessons) */
  lesson?: boolean;
  /** skip audio variants */
  noAudio?: boolean;
  /** only gap fills (choice with instr gap) for mistake items */
  instr?: string;
}

export function variantFor(item: Item, ctx: BuildCtx, opts: VariantOpts = {}): Exercise | null {
  let vs = item.variants.filter((v) => usable(v, ctx));
  if (opts.noAudio) vs = vs.filter((v) => !(v.kind === 'type' && v.say));
  if (opts.kinds) vs = vs.filter((v) => opts.kinds?.includes(v.kind));
  if (opts.instr) vs = vs.filter((v) => v.instr === opts.instr);
  if (opts.lesson && vs.some((v) => v.kind !== 'truefalse'))
    vs = vs.filter((v) => v.kind !== 'truefalse');
  if (vs.length === 0) return null;
  if (opts.hard) return vs[vs.length - 1];
  const box = ctx.personal ? (ctx.state.items[item.id]?.b ?? 0) : 2;
  const target = (box / 3) * (vs.length - 1) + (ctx.rng() - 0.5) * 1.5;
  const idx = Math.max(0, Math.min(vs.length - 1, Math.round(target)));
  return vs[idx];
}

/** Order item ids: due first (most overdue), then unseen, then the rest — random within groups. */
function prioritize(ids: string[], ctx: BuildCtx): string[] {
  if (!ctx.personal) return shuffle(ids, ctx.rng);
  const today = dayNumber();
  const scored = ids.map((id) => {
    const st = ctx.state.items[id];
    const p = !st
      ? 1
      : st.d <= today
        ? 0 + Math.max(0, 1 - (today - st.d) / 30) * 0.5
        : 2 + st.b / 10;
    return { id, p: p + ctx.rng() * 0.3 };
  });
  return scored.sort((a, b) => a.p - b.p).map((x) => x.id);
}

function exercisesFrom(
  ids: string[],
  n: number,
  ctx: BuildCtx,
  opts: VariantOpts = {},
): Exercise[] {
  const out: Exercise[] = [];
  for (const id of ids) {
    if (out.length >= n) break;
    const item = ctx.index.items.get(id);
    if (!item) continue;
    const ex = variantFor(item, ctx, opts);
    if (ex) out.push(ex);
  }
  return out;
}

const SOURCE_ORDER = ['m:', 'd:', 'x:', 't:', 'v:'];

/**
 * Round-robin across item sources (mistakes, drills, examples, tense sentences, verbs)
 * so one big shared pool (e.g. 150 irregular verbs credited to Present Perfect) can't
 * crowd out a rule's own material. Order inside each source is preserved.
 */
function diversify(ids: string[], maxPerSource = Number.POSITIVE_INFINITY): string[] {
  const groups = new Map<string, string[]>();
  for (const id of ids) {
    const k = id.slice(0, 2);
    const g = groups.get(k);
    if (g) g.push(id);
    else groups.set(k, [id]);
  }
  const keys = [...groups.keys()].sort((a, b) => SOURCE_ORDER.indexOf(a) - SOURCE_ORDER.indexOf(b));
  const out: string[] = [];
  for (let round = 0; round < maxPerSource; round++) {
    let added = false;
    for (const k of keys) {
      const id = groups.get(k)?.[round];
      if (id) {
        out.push(id);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}

/** Shuffle so that the same rule rarely appears twice in a row. */
function interleave(list: Exercise[], rng: Rng): Exercise[] {
  const pool = shuffle(list, rng);
  const out: Exercise[] = [];
  while (pool.length) {
    const prev = out[out.length - 1]?.rules[0];
    const i = pool.findIndex((e) => e.rules[0] !== prev);
    out.push(pool.splice(i < 0 ? 0 : i, 1)[0]);
  }
  return out;
}

function levelFilter(ctx: BuildCtx, maxLevel: number) {
  return (id: string) => {
    const it = ctx.index.items.get(id);
    return !!it && itemLevel(ctx, it) <= maxLevel;
  };
}

// ---------------------------------------------------------------------------
// Daily session
// ---------------------------------------------------------------------------

export function nextNewRule(ctx: BuildCtx, skip: Set<string> = new Set()): string | null {
  const today = dayNumber();
  const start = ctx.state.settings.placement
    ? LEVELS.indexOf(ctx.state.settings.placement as LevelId)
    : 0;
  const ordered = ctx.index.grammarOrder.filter(
    (id) => (ctx.index.rules.get(id)?.levelIdx ?? 0) >= start,
  );
  for (const id of [...ordered, ...ctx.index.grammarOrder]) {
    if (skip.has(id) || ctx.done[id]) continue;
    const ids = ctx.index.byRule.get(id);
    if (!ids || ids.length < 2) continue;
    if (ruleMastery(ids, ctx.state.items, today).stage <= 1) return id;
  }
  return null;
}

export interface DailyPlan {
  exercises: Exercise[];
  newRule: string | null;
  dueCount: number;
}

export const DAILY_SIZE = 12;

export function dueItemIds(ctx: Pick<BuildCtx, 'index' | 'state'>): string[] {
  const today = dayNumber();
  return Object.entries(ctx.state.items)
    .filter(([id, st]) => st.d <= today && ctx.index.items.has(id))
    .sort((a, b) => a[1].d - b[1].d || a[1].b - b[1].b)
    .map(([id]) => id);
}

export function mistakeDeckIds(ctx: Pick<BuildCtx, 'index' | 'state'>): string[] {
  return Object.entries(ctx.state.items)
    .filter(([id, st]) => inMistakeDeck(st) && ctx.index.items.has(id))
    .sort((a, b) => b[1].s - a[1].s)
    .map(([id]) => id);
}

export function buildDaily(ctx: BuildCtx): DailyPlan {
  const chosen = new Set<string>();
  const due = dueItemIds(ctx);
  const deck = mistakeDeckIds(ctx).filter((id) => !due.includes(id));
  const take = (ids: string[], n: number) => {
    let k = 0;
    for (const id of ids) {
      if (k >= n || chosen.size >= DAILY_SIZE) break;
      if (!chosen.has(id)) {
        chosen.add(id);
        k++;
      }
    }
  };
  take(due, 7);
  take(deck, 2);
  // two items aimed at the learner's weakest Russian-speaker trap
  const weakest = topTraps(ctx.index, ctx.state.items, 1)[0];
  if (weakest) {
    const pool = (ctx.index.byTrap.get(weakest.trap) ?? []).filter(
      levelFilter(ctx, levelCap(ctx) + 1),
    );
    take(prioritize(pool, ctx), 2);
  }
  const newRule = nextNewRule(ctx);
  if (newRule) {
    const fresh = (ctx.index.byRule.get(newRule) ?? []).filter((id) => !ctx.state.items[id]);
    take(shuffle(fresh, ctx.rng), 3);
  }
  take(due, DAILY_SIZE);
  // Still short (new learner): more new material from the following rules.
  const skip = new Set<string>(newRule ? [newRule] : []);
  for (let guard = 0; chosen.size < DAILY_SIZE && guard < 6; guard++) {
    const r = nextNewRule(ctx, skip);
    if (!r) break;
    skip.add(r);
    const fresh = (ctx.index.byRule.get(r) ?? []).filter((id) => !ctx.state.items[id]);
    take(shuffle(fresh, ctx.rng), 3);
  }
  const exercises = interleave(
    exercisesFrom([...chosen], DAILY_SIZE, ctx, { lesson: true }),
    ctx.rng,
  );
  return { exercises, newRule, dueCount: due.length };
}

// ---------------------------------------------------------------------------
// Rule-level
// ---------------------------------------------------------------------------

export function buildRulePractice(ctx: BuildCtx, ruleId: string, n = 10): Exercise[] {
  const ids = diversify(prioritize(ctx.index.byRule.get(ruleId) ?? [], ctx));
  return exercisesFrom(ids, n, ctx, { lesson: true });
}

export const TEST_OUT_SIZE = 5;

export function canTestOut(index: PracticeIndex, ruleId: string): boolean {
  return (index.byRule.get(ruleId)?.length ?? 0) >= 3;
}

export function buildTestOut(ctx: BuildCtx, ruleId: string): Exercise[] {
  const ids = diversify(shuffle(ctx.index.byRule.get(ruleId) ?? [], ctx.rng));
  return exercisesFrom(ids, TEST_OUT_SIZE, ctx, { hard: true, noAudio: true, lesson: true });
}

// ---------------------------------------------------------------------------
// Placement test (adaptive)
// ---------------------------------------------------------------------------

export const PLACEMENT_PER_LEVEL = 4;

export interface PlacementController {
  next(lastCorrect: boolean | null): Exercise | null;
  result(): LevelId;
  progress(): { level: LevelId; step: number };
}

export function createPlacement(ctx: BuildCtx): PlacementController {
  let level = 1; // start at A2
  let passed = -1;
  let correct = 0;
  let asked = 0;
  let queue: Exercise[] = [];
  let finished = false;
  let wentDown = false;
  const tested = new Set<number>();

  const fill = () => {
    const ids = shuffle(
      grammarRulesOfLevel(ctx.index, LEVELS[level]).flatMap((r) =>
        (ctx.index.byRule.get(r) ?? []).slice(0, 4),
      ),
      ctx.rng,
    );
    const seenRules = new Set<string>();
    queue = [];
    for (const id of ids) {
      if (queue.length >= PLACEMENT_PER_LEVEL) break;
      const item = ctx.index.items.get(id);
      if (!item || seenRules.has(item.rules[0])) continue;
      const ex = variantFor(item, ctx, { hard: true, noAudio: true, lesson: true });
      if (!ex) continue;
      seenRules.add(item.rules[0]);
      queue.push(ex);
    }
    correct = 0;
    asked = 0;
    tested.add(level);
  };
  fill();

  return {
    next(lastCorrect) {
      if (finished) return null;
      if (lastCorrect !== null) {
        asked++;
        if (lastCorrect) correct++;
      }
      if (asked >= queue.length) {
        const ok = correct >= Math.ceil(queue.length * 0.75);
        if (ok) {
          passed = Math.max(passed, level);
          if (level < LEVELS.length - 1 && !wentDown) {
            level++;
            fill();
          } else finished = true;
        } else if (level === 1 && !tested.has(0)) {
          wentDown = true;
          level = 0;
          fill();
        } else finished = true;
        if (finished) return null;
      }
      return queue[asked] ?? null;
    },
    result() {
      // Start at the first level not passed.
      return LEVELS[Math.min(LEVELS.length - 1, passed + 1)];
    },
    progress() {
      return { level: LEVELS[level], step: asked };
    },
  };
}

// ---------------------------------------------------------------------------
// Level exam ("boss")
// ---------------------------------------------------------------------------

export const BOSS_SIZE = 20;
export const BOSS_PASS = 0.8;

export function buildBoss(ctx: BuildCtx, levelId: string): Exercise[] {
  const rules = shuffle(grammarRulesOfLevel(ctx.index, levelId), ctx.rng);
  const out: Exercise[] = [];
  for (let round = 0; round < 3 && out.length < BOSS_SIZE; round++) {
    for (const r of rules) {
      if (out.length >= BOSS_SIZE) break;
      const ids = diversify(shuffle(ctx.index.byRule.get(r) ?? [], ctx.rng));
      const item = ids[round] ? ctx.index.items.get(ids[round]) : undefined;
      if (!item) continue;
      const ex = variantFor(item, ctx, { hard: true, noAudio: true, lesson: true });
      if (ex) out.push(ex);
    }
  }
  return interleave(out, ctx.rng);
}

// ---------------------------------------------------------------------------
// Arcade builders
// ---------------------------------------------------------------------------

export function buildFromSet(
  ctx: BuildCtx,
  key: DrillSetKey,
  n = 10,
  kinds?: Exercise['kind'][],
): Exercise[] {
  let ids = ctx.index.bySet.get(key) ?? [];
  if (kinds)
    ids = ids.filter((id) => ctx.index.items.get(id)?.variants.some((v) => kinds.includes(v.kind)));
  return exercisesFrom(prioritize(ids, ctx), n, ctx, { kinds });
}

export function buildFromSets(ctx: BuildCtx, keys: DrillSetKey[], n = 10): Exercise[] {
  const ids = keys.flatMap((k) => ctx.index.bySet.get(k) ?? []);
  return interleave(exercisesFrom(prioritize(ids, ctx), n, ctx), ctx.rng);
}

export function buildMistakeGame(
  ctx: BuildCtx,
  kind: 'spot' | 'gap',
  n = 10,
  track?: 'grammar' | 'murphy',
): Exercise[] {
  const cap = levelCap(ctx);
  const ids = ctx.index.mistakeItems
    .filter(levelFilter(ctx, cap))
    .filter((id) => !track || ctx.index.items.get(id)?.track === track);
  const opts: VariantOpts =
    kind === 'spot' ? { kinds: ['spot'] } : { kinds: ['choice'], instr: 'gap' };
  return exercisesFrom(prioritize(ids, ctx), n, ctx, opts);
}

export function buildMistakeDeck(ctx: BuildCtx, n = 12): Exercise[] {
  return exercisesFrom(mistakeDeckIds(ctx), n, ctx, { lesson: true });
}

export function buildExamples(ctx: BuildCtx, kind: 'tiles' | 'type', n = 8): Exercise[] {
  const cap = levelCap(ctx);
  const ids = ctx.index.exampleItems.filter(levelFilter(ctx, cap));
  return exercisesFrom(prioritize(ids, ctx), n, ctx, { kinds: [kind] });
}

export function buildTenseItems(
  ctx: BuildCtx,
  kind: 'choice' | 'timeline' | 'tree',
  n = 10,
): Exercise[] {
  return exercisesFrom(prioritize(ctx.index.tenseItems, ctx), n, ctx, { kinds: [kind] });
}

/** Type the English for sentences in the learner's language (Russian drills + rule examples). */
export function buildTranslate(ctx: BuildCtx, n = 10): Exercise[] {
  const cap = levelCap(ctx);
  const ids = ctx.index.translateItems.filter(levelFilter(ctx, cap));
  return exercisesFrom(prioritize(ids, ctx), n, ctx, { kinds: ['translate'] });
}

/** A session aimed at one Russian-speaker trap. */
export function buildTrapSession(ctx: BuildCtx, trap: TrapKey, n = 10): Exercise[] {
  const cap = levelCap(ctx) + 1;
  const ids = (ctx.index.byTrap.get(trap) ?? []).filter(levelFilter(ctx, cap));
  const pool = ids.length >= n ? ids : (ctx.index.byTrap.get(trap) ?? []);
  return interleave(
    exercisesFrom(diversify(prioritize(pool, ctx)), n, ctx, { lesson: true }),
    ctx.rng,
  );
}

/** Your weakest trap right now (falls back to articles + tenses for new learners). */
export function buildMyTraps(ctx: BuildCtx, n = 12): Exercise[] {
  const top = topTraps(ctx.index, ctx.state.items, 2).map((t) => t.trap);
  const traps: TrapKey[] = top.length ? top : ['articles', 'tenses'];
  const per = Math.ceil(n / traps.length);
  return interleave(
    traps.flatMap((t) => buildTrapSession(ctx, t, per)),
    ctx.rng,
  ).slice(0, n);
}

export function buildDailyChallenge(ctx: BuildCtx, n = 15): Exercise[] {
  const pools = [
    ctx.index.mistakeItems,
    ctx.index.exampleItems,
    ctx.index.tenseItems,
    ctx.index.verbItems,
    ...[...ctx.index.bySet.values()],
  ];
  const out: Exercise[] = [];
  const used = new Set<string>();
  for (let guard = 0; out.length < n && guard < n * 10; guard++) {
    const pool = pick(pools, ctx.rng);
    const id = pick(pool, ctx.rng);
    if (!id || used.has(id)) continue;
    const item = ctx.index.items.get(id);
    if (!item || itemLevel(ctx, item) > 3) continue;
    const ex = variantFor(item, ctx, { lesson: true, noAudio: true });
    if (!ex || ex.kind === 'tree') continue;
    used.add(id);
    out.push(ex);
  }
  return out;
}

/** Endless generators (sprint / survival). */
export type Generator = (ctx: BuildCtx, step: number) => Exercise | null;

export const genRightOrWrong: Generator = (ctx) => {
  const cap = levelCap(ctx);
  for (let i = 0; i < 20; i++) {
    const id = pick(ctx.index.mistakeItems, ctx.rng);
    const item = ctx.index.items.get(id);
    if (!item || itemLevel(ctx, item) > cap) continue;
    const tf = item.variants.filter((v) => v.kind === 'truefalse');
    if (tf.length) return pick(tf, ctx.rng);
  }
  return null;
};

export const genVerbForge: Generator = (ctx) => {
  const id = pick(ctx.index.verbItems.slice(0, 60 + Math.floor(ctx.rng() * 90)), ctx.rng);
  const item = ctx.index.items.get(id);
  if (!item) return null;
  return (
    pick(
      item.variants.filter((v) => v.kind === 'type'),
      ctx.rng,
    ) ?? null
  );
};

export const genSurvival: Generator = (ctx, step) => {
  const maxLevel = Math.min(5, Math.floor(step / 5));
  const pools = [ctx.index.mistakeItems, ctx.index.tenseItems, ...[...ctx.index.bySet.values()]];
  for (let i = 0; i < 40; i++) {
    const id = pick(pick(pools, ctx.rng), ctx.rng);
    const item = id ? ctx.index.items.get(id) : undefined;
    if (!item) continue;
    const lvl = itemLevel(ctx, item);
    if (lvl > maxLevel || lvl < maxLevel - 2) continue;
    const ex = variantFor(item, ctx, {
      lesson: true,
      noAudio: true,
      kinds: ['choice', 'spot', 'tiles', 'type'],
    });
    if (ex) return ex;
  }
  return null;
};

// ---------------------------------------------------------------------------
// Generated (arcade-only) rounds — not tracked by SRS
// ---------------------------------------------------------------------------

function markerList(key: TenseKey): string[] {
  return TENSES[key].markers
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);
}

export function buildMarkerSort(ctx: BuildCtx, rounds = 4): Exercise[] {
  const out: Exercise[] = [];
  for (let r = 0; r < rounds; r++) {
    // one tense per time frame, so a marker can only belong to one bucket
    const keys = [
      pick(
        TENSE_KEYS.filter((k) => k.startsWith('present')),
        ctx.rng,
      ),
      pick(
        TENSE_KEYS.filter((k) => k.startsWith('past')),
        ctx.rng,
      ),
      pick(
        TENSE_KEYS.filter((k) => k.startsWith('future')),
        ctx.rng,
      ),
    ] as TenseKey[];
    const lists = keys.map(markerList);
    const items: [string, number][] = [];
    keys.forEach((_, bi) => {
      const unique = lists[bi].filter((m) => lists.every((l, j) => j === bi || !l.includes(m)));
      for (const m of sample(unique, 3, ctx.rng)) items.push([m, bi]);
    });
    out.push({
      kind: 'sort',
      itemId: `g:markers:${r}`,
      rules: keys.flatMap((k) => TENSE_RULES[k]),
      title: '',
      instr: 'markerSort',
      buckets: keys.map((k) => TENSES[k].name),
      items: shuffle(items, ctx.rng),
    });
  }
  return out;
}

export function buildSameScene(ctx: BuildCtx, n = 10): Exercise[] {
  const out: Exercise[] = [];
  const pairs = listCuratedComparisons();
  const scenes = shuffle(
    pairs.flatMap(([a, b, cmp]) => (cmp.sharedContexts ?? []).map((s) => ({ a, b, s }))),
    ctx.rng,
  );
  for (const { a, b, s } of scenes) {
    if (out.length >= n) break;
    const useA = ctx.rng() < 0.5;
    const [k, other] = useA ? [a, b] : [b, a];
    const sentence = useA ? s.a : s.b;
    const otherSentence = useA ? s.b : s.a;
    const meaning = useA ? s.aTr : s.bTr;
    const rules = [...TENSE_RULES[k as TenseKey], ...TENSE_RULES[other as TenseKey]];
    if (ctx.lang === 'ru') {
      out.push({
        kind: 'choice',
        itemId: `g:scene:${k}:${out.length}`,
        rules,
        prompt: meaning,
        options: [sentence, otherSentence],
        instr: 'sameScene',
        why: s.note,
      });
    } else {
      out.push({
        kind: 'choice',
        itemId: `g:scene:${k}:${out.length}`,
        rules,
        prompt: sentence,
        options: [TENSES[k as TenseKey].name, TENSES[other as TenseKey].name],
        instr: 'whichTense',
      });
    }
  }
  return out;
}

export function buildVerbMemory(ctx: BuildCtx, rounds = 4): Exercise[] {
  const out: Exercise[] = [];
  const pool = IRREGULAR_VERBS.slice(0, 100);
  for (let r = 0; r < rounds; r++) {
    const verbs = sample(pool, 5, ctx.rng);
    const useV3 = r % 2 === 1;
    const rights = new Set<string>();
    const pairs: [string, string][] = [];
    for (const [v1, v2, v3] of verbs) {
      const right = (useV3 ? v3 : v2).split('/')[0];
      if (rights.has(right)) continue;
      rights.add(right);
      pairs.push([v1, right]);
    }
    out.push({
      kind: 'match',
      itemId: `g:verbs:${r}`,
      rules: useV3 ? ['b1_01'] : ['a2_02'],
      title: useV3 ? 'V1 → V3 (Past Participle)' : 'V1 → V2 (Past Simple)',
      pairs,
    });
  }
  return out;
}

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function numberTask(rng: Rng): { say: string; answer: string } {
  const kind = Math.floor(rng() * 6);
  switch (kind) {
    case 0: {
      const teen = 13 + Math.floor(rng() * 7);
      const n = rng() < 0.5 ? teen : (teen - 10) * 10;
      return { say: String(n), answer: String(n) };
    }
    case 1: {
      const n = 100 + Math.floor(rng() * 9900);
      return { say: n.toLocaleString('en-US'), answer: String(n) };
    }
    case 2: {
      const y = 1900 + Math.floor(rng() * 130);
      return { say: `in ${y}`, answer: String(y) };
    }
    case 3: {
      const d = 1 + Math.floor(rng() * 20);
      const c = Math.floor(rng() * 100);
      const s = `$${d}.${String(c).padStart(2, '0')}`;
      return { say: s, answer: `${d}.${String(c).padStart(2, '0')}` };
    }
    case 4: {
      const a = Math.floor(rng() * 10);
      const b = Math.floor(rng() * 10);
      return { say: `${a} point ${ONES[b]}`, answer: `${a}.${b}` };
    }
    default: {
      const n = 10_000 + Math.floor(rng() * 990_000);
      return { say: n.toLocaleString('en-US'), answer: String(n) };
    }
  }
}

export function buildNumbers(ctx: BuildCtx, n = 10): Exercise[] {
  const out: Exercise[] = [];
  for (let i = 0; i < n; i++) {
    const t = numberTask(ctx.rng);
    out.push({
      kind: 'type',
      itemId: `g:num:${i}`,
      rules: ['a1_21'],
      prompt: '',
      answer: t.answer,
      say: t.say,
      numeric: true,
      instr: 'numbers',
    });
  }
  return out;
}

export function isTracked(ex: Exercise): boolean {
  return !ex.itemId.startsWith('g:');
}
