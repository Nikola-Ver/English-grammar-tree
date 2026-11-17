/**
 * Hand-authored drill content for the practice games.
 *
 * Every seed is credited to one or more grammar rule ids (`rules`), which is how
 * practice results feed the spaced-repetition schedule and the mastery tree.
 *
 * Conventions:
 *  - All learner-facing English is natural, unambiguous, and has exactly ONE correct answer
 *    (list any other fully-correct answers in `alts`).
 *  - `why` is a short explanation (≤ 160 chars) shown after answering, in English and Russian.
 *    Other UI languages fall back to English.
 *  - `id` values are stable forever (SRS state is keyed by them): never renumber or reuse.
 */

/**
 * Typical Russian-speaker interference ("traps"). Every item is tagged with one, so the
 * app can show "your top traps" and train them.
 */
export type TrapKey =
  | 'articles' // no articles in Russian
  | 'toBe' // dropping am/is/are ("I student")
  | 'tenses' // aspect vs tense: Present Perfect vs Past Simple, Continuous…
  | 'futureTime' // "when/if he will come"
  | 'wordOrder' // questions without do, adverb/adjective position, there is, inversion
  | 'prepositions' // in/on/at, depend on, wait for, since vs for
  | 'countable' // informations, advices, much/many
  | 'conditionals' // Russian «бы» covers 2nd, 3rd conditional and wish
  | 'verbPatterns' // -ing vs to + verb
  | 'modals' // must vs have to, can/could, should
  | 'sequence' // reported speech backshift (Russian doesn't backshift)
  | 'falseFriends' // magazine ≠ магазин
  | 'collocations' // make/do, take a photo
  | 'phrasal' // phrasal verbs
  | 'politeness'; // too-direct requests

/** Word-level topics that are not grammar rules; items credit these ids in `rules`. */
export type TopicId =
  | 'w_false_friends'
  | 'w_collocations'
  | 'w_phrasal'
  | 'w_verb_prep'
  | 'w_polite';

export interface L10n {
  en: string;
  ru: string;
}

interface SeedBase {
  /** Stable unique id, e.g. `art_07`. Prefix is per content file. */
  id: string;
  /** Grammar rule ids (see rule list) and/or TopicIds credited by this item. At least one. */
  rules: string[];
  why?: L10n;
  /** Overrides the trap derived from the first rule. */
  trap?: TrapKey;
}

/**
 * Multiple choice. `prompt` is an English sentence with `___` marking the gap,
 * or a full question. `options[0]` is the correct answer; the UI shuffles them.
 */
export interface ChoiceSeed extends SeedBase {
  kind: 'choice';
  prompt: string;
  /** Optional English context shown above the prompt (a situation, clue, or dialogue line). */
  context?: string;
  /** 2–4 options, first is correct, all distinct. */
  options: string[];
}

/** What the learner is asked to do in a tiles item; the UI shows a localized instruction. */
export type TilesTask =
  | 'build' // put the words in order
  | 'question' // turn the statement into a question
  | 'negative' // make it negative
  | 'passive' // rewrite in the passive
  | 'reported' // report what was said
  | 'wish' // express the regret/wish with "I wish" / "If only"
  | 'inversion' // rewrite starting with the given inverted phrase
  | 'cleft' // emphasise using a cleft sentence
  | 'relative' // join the two sentences with a relative pronoun
  | 'adjOrder' // order the adjectives before the noun
  | 'conditional' // rewrite as a conditional
  | 'tense' // rewrite in the tense named in `param`
  | 'formal'; // rewrite in a more formal register

/**
 * Word-tile builder. The learner sees `source` (+ localized instruction for `task`)
 * and assembles `answer` from shuffled tiles. Tiles = `answer.split(' ')` + `extra`.
 * Punctuation stays attached to its word ("garden."). Use full forms, not contractions,
 * unless the contraction is the point.
 */
export interface TilesSeed extends SeedBase {
  kind: 'tiles';
  task: TilesTask;
  /** Sentence(s) to transform, or for `build` a translation-free description. */
  source: string;
  /** Extra parameter for the task, e.g. tense name "Present Perfect" or a starting phrase "Never". */
  param?: string;
  /** The correct sentence, words separated by single spaces. */
  answer: string;
  /** Other fully-correct word orders (same tiles). */
  alts?: string[];
  /** 0–3 distractor tiles (wrong forms) mixed into the pool. */
  extra?: string[];
}

/**
 * Bucket sort round: 6–10 items, each belongs to exactly one bucket.
 * Bucket labels are short English (e.g. "in", "on", "at" / "-ing", "to + verb").
 */
export interface SortSeed extends SeedBase {
  kind: 'sort';
  /** Localized title for the round (what is being sorted). */
  title: L10n;
  buckets: string[];
  /** [item text, bucket index] */
  items: [string, number][];
}

/** Match halves: 4–6 pairs [left, right]. Each left matches exactly one right. */
export interface MatchSeed extends SeedBase {
  kind: 'match';
  title: L10n;
  pairs: [string, string][];
}

/**
 * Paragraph with several gaps; each gap cycles through `options`.
 * Mark gaps inline as `{answer}` where answer is one of `options`.
 * Use "—" in options for "nothing / zero article / no comma".
 * Example: "I saw {a} cat in {the} garden. {—} Cats love {—} milk."
 */
export interface GapsSeed extends SeedBase {
  kind: 'gaps';
  title: L10n;
  options: string[];
  text: string;
}

/** Typed answer (short). Case-insensitive compare; `alts` are also accepted. */
export interface TypeSeed extends SeedBase {
  kind: 'type';
  prompt: string;
  answer: string;
  alts?: string[];
}

/**
 * Translate from Russian (Russian UI only). The learner types the English sentence;
 * grading tolerates contractions, punctuation and swapped content words, but not
 * article / auxiliary / preposition / word-order differences — those are the traps.
 * The Russian must pin the English down (time markers, context) so one translation fits;
 * list every other natural translation in `alts`.
 */
export interface TranslateSeed extends SeedBase {
  kind: 'translate';
  ru: string;
  en: string;
  alts?: string[];
  trap: TrapKey;
  why: L10n;
}

export type Seed =
  | ChoiceSeed
  | TilesSeed
  | SortSeed
  | MatchSeed
  | GapsSeed
  | TypeSeed
  | TranslateSeed;

/**
 * "Почему по-русски иначе" note shown on a grammar rule card.
 * `ru`/`en`: 2–4 short sentences (HTML: <em>, <b> only) on why a Russian speaker goes wrong here.
 * `pairs`: 2–3 examples — the Russian sentence, the word-for-word (wrong) English calque, the correct English.
 */
export interface RuContrast {
  ru: string;
  en: string;
  pairs: { ru: string; calque: string; en: string }[];
  trap: TrapKey;
}

/** Irregular verb: base, past simple, past participle, Russian gloss. Variants separated by "/". */
export type IrregularVerb = [v1: string, v2: string, v3: string, ru: string];

/** Tense keys used across the app (see app/data/tenses.ts). */
export type TenseKey =
  | 'present_simple'
  | 'present_continuous'
  | 'present_perfect'
  | 'present_perfect_continuous'
  | 'past_simple'
  | 'past_continuous'
  | 'past_perfect'
  | 'past_perfect_continuous'
  | 'future_will'
  | 'future_going_to'
  | 'future_continuous'
  | 'future_perfect'
  | 'future_perfect_continuous';

/**
 * A sentence whose tense is unambiguous from the sentence alone.
 * `rules` = grammar rule ids that teach that tense.
 */
export interface TenseSentence {
  id: string;
  text: string;
  tense: TenseKey;
  rules: string[];
}
