/**
 * Grades a typed English translation and explains the mistake in terms of Russian-speaker traps.
 *
 * Tolerated: case, punctuation, curly quotes, contractions (I'm = I am, don't = do not…),
 * and swapping up to two content words (synonyms such as big/large) when the grammar is identical.
 * Not tolerated: any difference in articles, auxiliaries, be-forms, prepositions, pronouns or word
 * order — those are exactly what the exercise trains.
 */
import type { TrapKey } from './content/types';

const CONTRACTIONS: [RegExp, string][] = [
  [/\bcan't\b/g, 'can not'],
  [/\bcannot\b/g, 'can not'],
  [/\bwon't\b/g, 'will not'],
  [/\bshan't\b/g, 'shall not'],
  [/\bain't\b/g, 'is not'],
  [/\b(\w+)n't\b/g, '$1 not'],
  [/\bi'm\b/g, 'i am'],
  [/\b(\w+)'re\b/g, '$1 are'],
  [/\b(\w+)'ve\b/g, '$1 have'],
  [/\b(\w+)'ll\b/g, '$1 will'],
  [/\blet's\b/g, 'let us'],
];

const ARTICLES = new Set(['a', 'an', 'the']);
const BE = new Set(['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);
const AUX = new Set([
  'do',
  'does',
  'did',
  'have',
  'has',
  'had',
  'will',
  'would',
  'shall',
  'been',
  'was',
  'were',
]);
const MODALS = new Set([
  'can',
  'could',
  'must',
  'may',
  'might',
  'should',
  'ought',
  'need',
  'needn',
]);
const PREPOSITIONS = new Set([
  'in',
  'on',
  'at',
  'to',
  'for',
  'from',
  'of',
  'with',
  'about',
  'by',
  'into',
  'onto',
  'since',
  'during',
  'until',
  'till',
  'over',
  'under',
  'after',
  'before',
  'through',
  'across',
  'along',
  'towards',
  'toward',
  'up',
  'off',
  'out',
  'down',
  'away',
  'back',
  'around',
  'without',
  'within',
  'between',
  'among',
  'like',
  'per',
]);
const FUNCTION_WORDS = new Set([
  ...ARTICLES,
  ...BE,
  ...AUX,
  ...MODALS,
  ...PREPOSITIONS,
  'not',
  'no',
  'i',
  'you',
  'he',
  'she',
  'it',
  'we',
  'they',
  'me',
  'him',
  'her',
  'us',
  'them',
  'my',
  'your',
  'his',
  'its',
  'our',
  'their',
  'mine',
  'yours',
  'this',
  'that',
  'these',
  'those',
  'there',
  'here',
  'what',
  'where',
  'when',
  'who',
  'whom',
  'whose',
  'which',
  'why',
  'how',
  'if',
  'whether',
  'and',
  'or',
  'but',
  'so',
  'than',
  'then',
  'some',
  'any',
  'much',
  'many',
  'few',
  'little',
  'more',
  'most',
  'yet',
  'already',
  'just',
  'still',
  'ever',
  'never',
  'ago',
  'as',
  'is',
  "'s",
  "'d",
  'let',
  'us',
]);
const TIME_CONJ = ['when', 'if', 'as soon as', 'before', 'after', 'until', 'unless', 'once'];
const SUBJECTS = new Set(['i', 'you', 'he', 'she', 'it', 'we', 'they', 'who', 'which', 'that']);

export function normalizeEnglish(s: string): string[] {
  let t = s
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[“”«»]/g, '"');
  for (const [re, rep] of CONTRACTIONS) t = t.replace(re, rep);
  return t
    .replace(/'s\b/g, " 's")
    .replace(/'d\b/g, " 'd")
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .replace(/(^|\s)-+|-+(\s|$)/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/** Expand ambiguous 's / 'd in the learner's answer to match the reference where possible. */
function alignAmbiguous(user: string[], ref: string[]): string[] {
  return user.map((tok, i) => {
    if (tok === "'s" && (ref[i] === 'is' || ref[i] === 'has')) return ref[i];
    if (tok === "'d" && (ref[i] === 'would' || ref[i] === 'had')) return ref[i];
    return tok;
  });
}

function expandRef(ref: string[]): string[] {
  // the reference itself may use 's/'d: treat as their long forms by context (best effort)
  return ref.map((t, i) =>
    t === "'s"
      ? ref[i + 1]?.endsWith('ed') || ref[i + 1] === 'been'
        ? 'has'
        : 'is'
      : t === "'d"
        ? 'would'
        : t,
  );
}

export type DiffOp = { op: 'same' | 'missing' | 'extra'; word: string };

/** LCS-based token diff: which reference words the learner missed and which they added. */
export function diffTokens(user: string[], ref: string[]): DiffOp[] {
  const n = user.length;
  const m = ref.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = user[i] === ref[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && user[i] === ref[j]) {
      out.push({ op: 'same', word: ref[j] });
      i++;
      j++;
    } else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) {
      out.push({ op: 'missing', word: ref[j] });
      j++;
    } else {
      out.push({ op: 'extra', word: user[i] });
      i++;
    }
  }
  return out;
}

export interface TranslationGrade {
  verdict: 'exact' | 'accepted' | 'wrong';
  /** the reference the answer was compared with (best match) */
  reference: string;
  diff: DiffOp[];
  traps: TrapKey[];
}

function sorted(a: string[]) {
  return [...a].sort().join(' ');
}

function detectTraps(user: string[], ref: string[], diff: DiffOp[]): TrapKey[] {
  const missing = diff.filter((d) => d.op === 'missing').map((d) => d.word);
  const extra = diff.filter((d) => d.op === 'extra').map((d) => d.word);
  const changed = [...missing, ...extra];
  const traps = new Set<TrapKey>();
  if (sorted(user) === sorted(ref) && user.join(' ') !== ref.join(' ')) traps.add('wordOrder');
  if (changed.some((w) => ARTICLES.has(w))) traps.add('articles');
  const refText = ` ${ref.join(' ')} `;
  if (extra.includes('will') && TIME_CONJ.some((c) => refText.includes(` ${c} `)))
    traps.add('futureTime');
  if (missing.some((w) => BE.has(w)) && !extra.some((w) => BE.has(w) || AUX.has(w)))
    traps.add('toBe');
  if (changed.includes('would') && refText.includes(' if ')) traps.add('conditionals');
  // Questions and negatives without do/does/did ("Where she lives?", "I not like")
  const doMissing =
    missing.some((w) => w === 'do' || w === 'does' || w === 'did') &&
    !extra.some((w) => AUX.has(w));
  if (doMissing) traps.add('wordOrder');
  else if (
    changed.some((w) => AUX.has(w) && !BE.has(w)) ||
    changed.some((w) => /ed$|en$/.test(w) && w.length > 3)
  )
    traps.add('tenses');
  if (changed.some((w) => BE.has(w)) && !traps.has('toBe') && !traps.has('futureTime'))
    traps.add('tenses');
  if (changed.some((w) => PREPOSITIONS.has(w)) && !changed.every((w) => ARTICLES.has(w)))
    traps.add('prepositions');
  // plural -s on a noun (not 3rd-person -s on a verb: that one follows a pronoun)
  const afterPronoun = (w: string) =>
    [user, ref].some((seq) => {
      const i = seq.indexOf(w);
      return i > 0 && SUBJECTS.has(seq[i - 1]);
    });
  if (
    missing.some((w) =>
      extra.some(
        (x) =>
          (x === `${w}s` || `${x}s` === w || x === `${w}es` || `${x}es` === w) &&
          !afterPronoun(w) &&
          !afterPronoun(x),
      ),
    )
  )
    traps.add('countable');
  if (changed.some((w) => w === 'to') && changed.some((w) => w.endsWith('ing'))) {
    traps.add('verbPatterns');
    traps.delete('prepositions');
  }
  if (changed.some((w) => MODALS.has(w))) traps.add('modals');
  // More specific tense traps replace the generic one.
  const tenseWords = changed.some((w) => AUX.has(w) || BE.has(w) || /ed$|en$/.test(w));
  if (
    tenseWords &&
    / (if|wish|wishes) /.test(refText) &&
    changed.some((w) => ['had', 'have', 'would', 'were'].includes(w))
  )
    traps.add('conditionals');
  if (tenseWords && / (said|told|asked|explained|thought|knew) /.test(refText))
    traps.add('sequence');
  if (traps.has('futureTime') || traps.has('conditionals') || traps.has('sequence'))
    traps.delete('tenses');
  return [...traps];
}

export function gradeTranslation(answer: string, references: string[]): TranslationGrade {
  const refs = references.map((r) => ({ raw: r, toks: expandRef(normalizeEnglish(r)) }));
  let best: { raw: string; toks: string[]; user: string[]; diff: DiffOp[]; cost: number } | null =
    null;
  for (const r of refs) {
    const user = alignAmbiguous(normalizeEnglish(answer), r.toks);
    const diff = diffTokens(user, r.toks);
    const cost = diff.filter((d) => d.op !== 'same').length;
    if (!best || cost < best.cost) best = { ...r, user, diff, cost };
  }
  if (!best) return { verdict: 'wrong', reference: '', diff: [], traps: [] };
  if (best.cost === 0) return { verdict: 'exact', reference: best.raw, diff: best.diff, traps: [] };

  const missing = best.diff.filter((d) => d.op === 'missing').map((d) => d.word);
  const extra = best.diff.filter((d) => d.op === 'extra').map((d) => d.word);
  // Synonym swap: same length, ≤ 2 content words replaced one-for-one, grammar untouched.
  const contentOnly =
    missing.length === extra.length &&
    missing.length <= 2 &&
    best.user.length === best.toks.length &&
    [...missing, ...extra].every((w) => !FUNCTION_WORDS.has(w) && !/ed$|ing$/.test(w)) &&
    best.user.every(
      (w, i) =>
        w === best?.toks[i] || (!FUNCTION_WORDS.has(w) && !FUNCTION_WORDS.has(best?.toks[i] ?? '')),
    );
  // cat/cats, live/lives, work/worked are grammar (number, agreement, tense), not synonyms
  const sameStem = (a: string, b: string) => {
    const [short, long] = a.length <= b.length ? [a, b] : [b, a];
    return (
      short.length >= 2 &&
      long.startsWith(short.replace(/e$/, '')) &&
      long.length - short.length <= 3
    );
  };
  const inflectionOnly = missing.some((w) => extra.some((x) => sameStem(w, x)));
  if (contentOnly && !inflectionOnly)
    return { verdict: 'accepted', reference: best.raw, diff: best.diff, traps: [] };

  // A mostly different sentence isn't a "trap" — don't guess; the caller shows the item's own trap.
  const same = best.diff.filter((d) => d.op === 'same').length;
  if (same < best.toks.length * 0.5)
    return { verdict: 'wrong', reference: best.raw, diff: best.diff, traps: [] };
  const traps = detectTraps(best.user, best.toks, best.diff).slice(0, 2);
  if (traps.length === 0 && inflectionOnly) traps.push('tenses');
  return { verdict: 'wrong', reference: best.raw, diff: best.diff, traps };
}
