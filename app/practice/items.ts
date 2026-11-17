/**
 * Builds the practice item index from the app's existing content:
 *  - `mistakes` of every Grammar rule and Murphy unit  → spot-the-error, right/wrong, gap fill
 *  - `ex` example sentences of Grammar rules          → sentence builder, dictation
 *  - hand-authored drill sets (content/*)              → family games
 *  - tense sentences / irregular verbs                 → tense & verb games
 *
 * English learning material always comes from the source data; only explanations and
 * translations come from the UI-language bundle.
 */
import { DATA, type Level, type Rule } from '../data/grammar';
import { MURPHY_DATA } from '../data/murphy';
import { TENSES } from '../data/tenses';
import type { RuleContentBundle, UiLang } from '../i18n/localizeRules';
import { DRILL_SETS, type DrillSetKey, IRREGULAR_VERBS, TENSE_SENTENCES } from './content';
import type { IrregularVerb, L10n, Seed, TenseKey, TrapKey } from './content/types';
import { hashString, makeRng, shuffle } from './rng';
import {
  capitalize,
  diffRegion,
  escapeHtml,
  hasCyrillic,
  parseMistake,
  stripHtml,
  tokenize,
} from './text';
import { isTopic, TOPICS, trapForRule } from './traps';
import type { Exercise, Item, Track } from './types';

export const TENSE_KEYS = Object.keys(TENSES) as TenseKey[];

/** Grammar rules that teach each tense (credited by tense games). */
export const TENSE_RULES: Record<TenseKey, string[]> = {
  present_simple: ['a1_08'],
  present_continuous: ['a2_08'],
  present_perfect: ['b1_01'],
  present_perfect_continuous: ['b1_05'],
  past_simple: ['a2_01'],
  past_continuous: ['b1_06'],
  past_perfect: ['b2_01'],
  past_perfect_continuous: ['b2_02'],
  future_will: ['a2_06'],
  future_going_to: ['a2_07'],
  future_continuous: ['b1_24'],
  future_perfect: ['b1_25'],
  future_perfect_continuous: ['c2_14'],
};

export const VERB_RULES = ['a2_02'];
export const VERB_V3_RULES = ['b1_01'];

export interface RuleMeta {
  id: string;
  track: Track;
  levelId: string;
  /** 0..5 for A1..C2 (Murphy books map to their CEFR band). */
  levelIdx: number;
  catIdx: number;
  /** Position in curriculum order within its track. */
  order: number;
}

export interface PracticeIndex {
  lang: UiLang;
  items: Map<string, Item>;
  byRule: Map<string, string[]>;
  rules: Map<string, RuleMeta>;
  grammarOrder: string[];
  /** word-level topics (false friends, collocations…) */
  wordsOrder: string[];
  byTrap: Map<TrapKey, string[]>;
  /** items that have a translate variant */
  translateItems: string[];
  murphyOrder: string[];
  bySet: Map<DrillSetKey, string[]>;
  tenseItems: string[];
  verbItems: string[];
  exampleItems: string[];
  mistakeItems: string[];
}

const GRAMMAR_LEVEL_IDX: Record<string, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4, C2: 5 };
const MURPHY_LEVEL_IDX: Record<string, number> = { EL: 0, INT: 2, ADV: 4 };

// ---------------------------------------------------------------------------
// Confusable words used as extra distractors in gap fills.
// ---------------------------------------------------------------------------
// Only sets where swapping in another member is always wrong in a sentence that already
// fixes person/number. Sets that can form another correct sentence (do/did, will/would,
// little/a little, in/on/at without context) are deliberately left out.
const CONFUSABLES: string[][] = [
  ['am', 'is', 'are', 'be'],
  ['was', 'were'],
  ['do', 'does'],
  ["don't", "doesn't"],
  ['have', 'has'],
  ["haven't", "hasn't"],
  ['a', 'an'],
  ['much', 'many'],
  ['its', "it's"],
  ['their', 'there', "they're"],
  ['me', 'I'],
  ['him', 'he'],
  ['her', 'she'],
  ['them', 'they'],
  ['than', 'then'],
  ['bigger', 'more big'],
  ['better', 'more good'],
];

function confusablesFor(word: string): string[] {
  const w = word.toLowerCase();
  for (const set of CONFUSABLES) if (set.includes(w)) return set.filter((x) => x !== w);
  return [];
}

function splitTrailingPunct(tokens: string[]): { tokens: string[]; punct: string } {
  if (tokens.length === 0) return { tokens, punct: '' };
  const last = tokens[tokens.length - 1];
  const m = last.match(/^(.*?)([.,!?;:]+)$/);
  if (!m?.[1]) return { tokens, punct: '' };
  return { tokens: [...tokens.slice(0, -1), m[1]], punct: m[2] };
}

function pickL10n(v: L10n | undefined, lang: UiLang): string | undefined {
  if (!v) return undefined;
  return lang === 'ru' ? v.ru : v.en;
}

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

function mistakeItems(track: Track, rule: Rule, localizedMistakes: string[] | undefined): Item[] {
  const out: Item[] = [];
  (rule.mistakes ?? []).forEach((line, i) => {
    const pair = parseMistake(line);
    if (!pair) return;
    const id = `m:${rule.id}:${i}`;
    const loc = localizedMistakes?.[i];
    const why =
      loc && (localizedMistakes?.length ?? 0) === (rule.mistakes?.length ?? 0)
        ? loc
        : `<s>${escapeHtml(pair.wrong)}</s> → <em>${escapeHtml(pair.right)}</em>`;
    const wt = tokenize(pair.wrong);
    const rt = tokenize(pair.right);
    const d = diffRegion(wt, rt);
    const variants: Exercise[] = [
      {
        kind: 'truefalse',
        itemId: id,
        rules: [rule.id],
        sentence: pair.wrong,
        correct: false,
        fix: pair.right,
        why,
      },
      { kind: 'truefalse', itemId: id, rules: [rule.id], sentence: pair.right, correct: true, why },
    ];
    if (d.aEnd > d.aStart && d.aEnd - d.aStart <= 4) {
      const wrongIdx: number[] = [];
      for (let k = d.aStart; k < d.aEnd; k++) wrongIdx.push(k);
      variants.push({
        kind: 'spot',
        itemId: id,
        rules: [rule.id],
        tokens: wt,
        wrong: wrongIdx,
        correct: pair.right,
        why,
      });
    }
    const rightLen = d.bEnd - d.bStart;
    const wrongLen = d.aEnd - d.aStart;
    if (rightLen >= 1 && rightLen <= 4 && wrongLen <= 4) {
      const atEnd = d.bEnd === rt.length;
      const rSeg = splitTrailingPunct(rt.slice(d.bStart, d.bEnd));
      const wSeg = splitTrailingPunct(wt.slice(d.aStart, d.aEnd));
      const right = rSeg.tokens.join(' ');
      const wrong = wSeg.tokens.join(' ') || '—';
      const before = rt.slice(0, d.bStart).join(' ');
      const after = rt.slice(d.bEnd).join(' ');
      const hasContext = before.length + after.length > 0;
      const prompt = [before, `___${atEnd ? rSeg.punct : ''}`, after].filter(Boolean).join(' ');
      const opts = [right, wrong];
      if (rSeg.tokens.length === 1) {
        for (const c of confusablesFor(right)) {
          if (opts.length >= 4) break;
          if (!opts.some((o) => o.toLowerCase() === c.toLowerCase())) opts.push(c);
        }
      }
      const atStart = d.bStart === 0;
      const options = opts.map((o) => (atStart && o !== '—' ? capitalize(o) : o));
      if (hasContext && new Set(options.map((o) => o.toLowerCase())).size === options.length) {
        variants.push({
          kind: 'choice',
          itemId: id,
          rules: [rule.id],
          prompt,
          options,
          why,
          instr: 'gap',
        });
      }
    }
    out.push({ id, track, rules: [rule.id], variants });
  });
  return out;
}

function exampleItems(rule: Rule, translations: (string | undefined)[], lang: UiLang): Item[] {
  const out: Item[] = [];
  (rule.ex ?? []).forEach((pair, i) => {
    const en = stripHtml(pair[0]);
    if (hasCyrillic(en) || /[/…]|\.\.\.|\(|=/.test(en)) return;
    const toks = tokenize(en);
    if (toks.length < 3 || toks.length > 14) return;
    const tr = translations[i];
    const hint = tr && stripHtml(tr) !== en && lang !== 'en' ? stripHtml(tr) : undefined;
    const id = `x:${rule.id}:${i}`;
    out.push({
      id,
      track: 'grammar',
      rules: [rule.id],
      variants: [
        {
          kind: 'tiles',
          itemId: id,
          rules: [rule.id],
          task: hint ? 'build' : 'unscramble',
          source: hint,
          answer: toks.join(' '),
          speak: true,
        },
        { kind: 'type', itemId: id, rules: [rule.id], prompt: hint ?? '', answer: en, say: en },
        ...(hint
          ? [{ kind: 'translate' as const, itemId: id, rules: [rule.id], source: hint, answer: en }]
          : []),
      ],
    });
  });
  return out;
}

export function seedToExercise(seed: Seed, lang: UiLang): Exercise {
  const base = { itemId: `d:${seed.id}`, rules: seed.rules, why: pickL10n(seed.why, lang) };
  switch (seed.kind) {
    case 'translate':
      return {
        ...base,
        kind: 'translate',
        source: seed.ru,
        answer: seed.en,
        alts: seed.alts,
        trap: seed.trap,
      };
    case 'choice':
      return {
        ...base,
        kind: 'choice',
        prompt: seed.prompt,
        context: seed.context,
        options: seed.options,
      };
    case 'tiles':
      return {
        ...base,
        ...(seed.trap === 'politeness' ? { instr: 'tiles.polite' } : {}),
        kind: 'tiles',
        task: seed.task,
        source: seed.source,
        param: seed.param,
        answer: seed.answer,
        alts: seed.alts,
        extra: seed.extra,
      };
    case 'sort':
      return {
        ...base,
        kind: 'sort',
        title: pickL10n(seed.title, lang) ?? '',
        buckets: seed.buckets,
        items: seed.items,
      };
    case 'match':
      return { ...base, kind: 'match', title: pickL10n(seed.title, lang) ?? '', pairs: seed.pairs };
    case 'gaps':
      return {
        ...base,
        kind: 'gaps',
        title: pickL10n(seed.title, lang) ?? '',
        options: seed.options,
        text: seed.text,
      };
    case 'type':
      return { ...base, kind: 'type', prompt: seed.prompt, answer: seed.answer, alts: seed.alts };
  }
}

function tenseItems(): Item[] {
  return TENSE_SENTENCES.map((s) => {
    const id = `t:${s.id}`;
    const rng = makeRng(hashString(s.id));
    const others = shuffle(
      TENSE_KEYS.filter((k) => k !== s.tense),
      rng,
    ).slice(0, 3);
    const options = [s.tense, ...others];
    const names = options.map((k) => TENSES[k].name);
    return {
      id,
      track: 'grammar' as const,
      rules: s.rules,
      variants: [
        {
          kind: 'choice',
          itemId: id,
          rules: s.rules,
          prompt: s.text,
          options: names,
          instr: 'whichTense',
        },
        { kind: 'timeline', itemId: id, rules: s.rules, sentence: s.text, tense: s.tense, options },
        { kind: 'tree', itemId: id, rules: s.rules, sentence: s.text, tense: s.tense },
      ] satisfies Exercise[],
    };
  });
}

function firstForm(f: string): string {
  return f.split('/')[0];
}

function regularized(v1: string): string {
  if (v1.endsWith('e')) return `${v1}d`;
  if (/[^aeiou]y$/.test(v1)) return `${v1.slice(0, -1)}ied`;
  return `${v1}ed`;
}

function verbItems(verbs: IrregularVerb[], lang: UiLang): Item[] {
  return verbs.map(([v1, v2, v3, ru]) => {
    const id = `v:${v1}`;
    const gloss = lang === 'ru' ? ` (${ru})` : '';
    const wrongReg = regularized(v1);
    const pastOpts = [firstForm(v2), wrongReg];
    if (firstForm(v3) !== firstForm(v2)) pastOpts.push(firstForm(v3));
    if (!pastOpts.includes(v1)) pastOpts.push(v1);
    const rules = [...VERB_RULES, ...VERB_V3_RULES];
    const why = `<em>${v1}</em> → <em>${v2}</em> → <em>${v3}</em>`;
    return {
      id,
      track: 'grammar' as const,
      rules,
      variants: [
        {
          kind: 'choice',
          itemId: id,
          rules: VERB_RULES,
          prompt: `${v1}${gloss} → ___`,
          options: [...new Set(pastOpts)].slice(0, 4),
          why,
          instr: 'pastSimple',
        },
        {
          kind: 'type',
          itemId: id,
          rules: VERB_RULES,
          prompt: `${v1}${gloss} → Past Simple`,
          answer: firstForm(v2),
          alts: v2.split('/'),
          why,
        },
        {
          kind: 'type',
          itemId: id,
          rules,
          prompt: `${v1}${gloss} → Past Participle (V3)`,
          answer: firstForm(v3),
          alts: v3.split('/'),
          why,
        },
      ] satisfies Exercise[],
    };
  });
}

// ---------------------------------------------------------------------------
// Index
// ---------------------------------------------------------------------------

let cached: PracticeIndex | null = null;

export function getPracticeIndex(
  lang: UiLang,
  bundle: RuleContentBundle | undefined,
): PracticeIndex {
  if (cached && cached.lang === lang) return cached;

  const items = new Map<string, Item>();
  const byRule = new Map<string, string[]>();
  const rules = new Map<string, RuleMeta>();
  const bySet = new Map<DrillSetKey, string[]>();
  const byTrap = new Map<TrapKey, string[]>();
  const titles = new Map<string, string>();
  const translateIds: string[] = [];
  const add = (item: Item) => {
    if (item.variants.length === 0 || items.has(item.id)) return;
    item.trap ??= trapForRule(item.rules[0], titles.get(item.rules[0]) ?? '') ?? undefined;
    if (item.trap) {
      const list = byTrap.get(item.trap);
      if (list) list.push(item.id);
      else byTrap.set(item.trap, [item.id]);
    }
    if (item.variants.some((v) => v.kind === 'translate')) translateIds.push(item.id);
    items.set(item.id, item);
    for (const r of item.rules) {
      const list = byRule.get(r);
      if (list) list.push(item.id);
      else byRule.set(r, [item.id]);
    }
  };

  const grammarOrder: string[] = [];
  const mistakeIds: string[] = [];
  const exampleIds: string[] = [];
  DATA.forEach((lvl: Level) => {
    lvl.categories.forEach((cat, ci) => {
      for (const rule of cat.rules) {
        rules.set(rule.id, {
          id: rule.id,
          track: 'grammar',
          levelId: lvl.id,
          levelIdx: GRAMMAR_LEVEL_IDX[lvl.id] ?? 0,
          catIdx: ci,
          order: grammarOrder.length,
        });
        grammarOrder.push(rule.id);
        titles.set(rule.id, rule.text);
        const loc = lang === 'ru' ? rule.mistakes : bundle?.grammar[rule.id]?.mistakes;
        for (const it of mistakeItems('grammar', rule, loc)) {
          add(it);
          mistakeIds.push(it.id);
        }
        const tr = (rule.ex ?? []).map((p, i) =>
          lang === 'ru' ? p[1] : (bundle?.grammar[rule.id]?.ex?.[i]?.[1] ?? undefined),
        );
        for (const it of exampleItems(rule, tr, lang)) {
          add(it);
          exampleIds.push(it.id);
        }
      }
    });
  });

  const murphyOrder: string[] = [];
  MURPHY_DATA.forEach((lvl) => {
    lvl.categories.forEach((cat, ci) => {
      for (const rule of cat.rules) {
        rules.set(rule.id, {
          id: rule.id,
          track: 'murphy',
          levelId: lvl.id,
          levelIdx: MURPHY_LEVEL_IDX[lvl.id] ?? 0,
          catIdx: ci,
          order: murphyOrder.length,
        });
        murphyOrder.push(rule.id);
        titles.set(rule.id, rule.text);
        const loc = lang === 'ru' ? rule.mistakes : bundle?.murphy[rule.id]?.mistakes;
        for (const it of mistakeItems('murphy', rule, loc)) {
          add(it);
          mistakeIds.push(it.id);
        }
      }
    });
  });

  const wordsOrder: string[] = [];
  TOPICS.forEach((topic, i) => {
    rules.set(topic.id, {
      id: topic.id,
      track: 'words',
      levelId: 'WORDS',
      levelIdx: 1,
      catIdx: i,
      order: i,
    });
    wordsOrder.push(topic.id);
  });

  for (const [key, seeds] of Object.entries(DRILL_SETS) as [DrillSetKey, Seed[]][]) {
    const ids: string[] = [];
    for (const seed of seeds) {
      // Translation drills are written from Russian: only for the Russian UI.
      if (seed.kind === 'translate' && lang !== 'ru') continue;
      const ex = seedToExercise(seed, lang);
      const variants: Exercise[] =
        seed.kind === 'translate'
          ? [
              {
                kind: 'tiles',
                itemId: ex.itemId,
                rules: seed.rules,
                why: ex.why,
                task: 'build',
                source: seed.ru,
                answer: seed.en,
                alts: seed.alts?.filter(
                  (a) => a.split(' ').sort().join(' ') === seed.en.split(' ').sort().join(' '),
                ),
              },
              ex,
            ]
          : [ex];
      const track: Track = isTopic(seed.rules[0]) ? 'words' : 'grammar';
      add({ id: ex.itemId, track, rules: seed.rules, trap: seed.trap, variants });
      ids.push(ex.itemId);
    }
    bySet.set(key, ids);
  }

  const tIds: string[] = [];
  for (const it of tenseItems()) {
    add(it);
    tIds.push(it.id);
  }
  const vIds: string[] = [];
  for (const it of verbItems(IRREGULAR_VERBS, lang)) {
    add(it);
    vIds.push(it.id);
  }

  cached = {
    lang,
    items,
    byRule,
    rules,
    grammarOrder,
    murphyOrder,
    wordsOrder,
    bySet,
    byTrap,
    translateItems: translateIds,
    tenseItems: tIds,
    verbItems: vIds,
    exampleItems: exampleIds,
    mistakeItems: mistakeIds,
  };
  return cached;
}

/** Rule ids of one grammar CEFR level (A1…C2) in curriculum order. */
export function grammarRulesOfLevel(index: PracticeIndex, levelId: string): string[] {
  return index.grammarOrder.filter((id) => index.rules.get(id)?.levelId === levelId);
}
