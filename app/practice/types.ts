import type { TenseKey, TilesTask, TrapKey } from './content/types';

/** Which data set a rule id belongs to. */
export type Track = 'grammar' | 'murphy' | 'words';

/** One renderable exercise. Every exercise belongs to an SRS item (`itemId`). */
export type Exercise =
  | ChoiceEx
  | SpotEx
  | TilesEx
  | SortEx
  | MatchEx
  | GapsEx
  | TypeEx
  | TrueFalseEx
  | TreeEx
  | TimelineEx
  | TranslateEx
  | QuickEx
  | InsertEx
  | StoryEx;

export interface ExBase {
  /** SRS item this exercise exercises (several exercises can share one item). */
  itemId: string;
  /** Rule ids credited. */
  rules: string[];
  /** Explanation shown after answering (HTML from our own content — trusted). */
  why?: string;
  /** Optional localized instruction key override (practice.instr.*). */
  instr?: string;
}

export interface ChoiceEx extends ExBase {
  kind: 'choice';
  prompt: string;
  context?: string;
  /** options[0] is correct; UI shuffles. */
  options: string[];
  /** Show options as tense pictograms (Timeline game). */
  display?: 'text' | 'tense';
  /** Translation / meaning shown under the prompt. */
  hint?: string;
}

export interface SpotEx extends ExBase {
  kind: 'spot';
  tokens: string[];
  /** Indices of tokens that are wrong (any tap inside counts). */
  wrong: number[];
  /** Corrected sentence revealed after the tap. */
  correct: string;
}

export interface TilesEx extends ExBase {
  kind: 'tiles';
  task: TilesTask | 'unscramble';
  source?: string;
  param?: string;
  answer: string;
  alts?: string[];
  extra?: string[];
  /** Speak the answer after solving (sentence builder). */
  speak?: boolean;
}

export interface SortEx extends ExBase {
  kind: 'sort';
  title: string;
  buckets: string[];
  items: [string, number][];
}

export interface MatchEx extends ExBase {
  kind: 'match';
  title: string;
  pairs: [string, string][];
}

export interface GapsEx extends ExBase {
  kind: 'gaps';
  title: string;
  options: string[];
  text: string;
}

export interface TypeEx extends ExBase {
  kind: 'type';
  prompt: string;
  answer: string;
  alts?: string[];
  /** Text read aloud with speech synthesis (dictation). The prompt is then a hint. */
  say?: string;
  /** Compare as a number (ignores commas, spaces and currency signs). */
  numeric?: boolean;
}

export interface TrueFalseEx extends ExBase {
  kind: 'truefalse';
  sentence: string;
  correct: boolean;
  /** The corrected version, revealed after answering when the sentence is wrong. */
  fix?: string;
}

/** Walk the tense decision tree for a sentence. */
export interface TreeEx extends ExBase {
  kind: 'tree';
  sentence: string;
  tense: TenseKey;
}

/** Pick the timeline pictogram for a sentence. */
export interface TimelineEx extends ExBase {
  kind: 'timeline';
  sentence: string;
  tense: TenseKey;
  options: TenseKey[];
}

/** Type the English for a sentence in the learner's language (graded by translateGrade). */
export interface TranslateEx extends ExBase {
  kind: 'translate';
  /** sentence in the UI language */
  source: string;
  answer: string;
  alts?: string[];
  trap?: TrapKey;
}

/** One gap, a few options that always sit in the same place (article blitz, tense duel). */
export interface QuickEx extends ExBase {
  kind: 'quick';
  prompt: string;
  /** shown in this order, never shuffled */
  options: string[];
  /** small captions under the options */
  labels?: string[];
  /** index of the right option */
  answer: number;
}

/** Put the missing articles back (see parseInsert in gameText.ts). */
export interface InsertEx extends ExBase {
  kind: 'insert';
  text: string;
}

/** A story with a choice in every gap (see parseStory in gameText.ts). */
export interface StoryEx extends ExBase {
  kind: 'story';
  title: string;
  text: string;
  /** one explanation per gap */
  notes: string[];
}

/** A unit of spaced repetition with one or more ways to practise it. */
export interface Item {
  id: string;
  track: Track;
  rules: string[];
  /** Russian-speaker interference this item tests (for the traps report). */
  trap?: TrapKey;
  /** Easier variants first; the session picks harder ones as the item matures. */
  variants: Exercise[];
}

/** Result of answering one exercise. */
export interface AnswerResult {
  correct: boolean;
  /** 0..1 partial credit (sort/match/gaps). */
  score: number;
}
