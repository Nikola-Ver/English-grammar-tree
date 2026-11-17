/**
 * Arcade game catalog. Titles/descriptions: i18n practice.games.<id>.{title,desc}.
 * Every game is reproducible from a seed (challenge links) when built with personal=false.
 */
import {
  type BuildCtx,
  buildDailyChallenge,
  buildExamples,
  buildFromSet,
  buildFromSets,
  buildMarkerSort,
  buildMistakeGame,
  buildMyTraps,
  buildNumbers,
  buildSameScene,
  buildTenseItems,
  buildTranslate,
  buildVerbMemory,
  type Generator,
  genFromSet,
  genRightOrWrong,
  genSurvival,
  genVerbForge,
} from './session';
import type { Exercise } from './types';

export type GameGroup = 'core' | 'tenses' | 'words' | 'structures' | 'advanced';
export type GameMode = 'lesson' | 'sprint' | 'survival';

export interface GameDef {
  id: string;
  icon: string;
  group: GameGroup;
  /** CEFR range shown on the card */
  level: string;
  mode: GameMode;
  needsSpeech?: boolean;
  /** needs sentences in the UI language to translate from (not available in the English UI) */
  needsTranslation?: boolean;
  /** lesson games */
  build?: (ctx: BuildCtx) => Exercise[];
  /** sprint/survival games */
  gen?: Generator;
  timeMs?: number;
  lives?: number;
}

export const GAMES: GameDef[] = [
  // Core — built from every rule's examples and common mistakes
  {
    id: 'daily-challenge',
    icon: '🗓️',
    group: 'core',
    level: 'A1–B2',
    mode: 'lesson',
    build: (c) => buildDailyChallenge(c),
  },
  {
    id: 'error-hunter',
    icon: '🔎',
    group: 'core',
    level: 'A1–C2',
    mode: 'lesson',
    build: (c) => buildMistakeGame(c, 'spot'),
  },
  {
    id: 'right-or-wrong',
    icon: '⚡',
    group: 'core',
    level: 'A1–C2',
    mode: 'sprint',
    gen: genRightOrWrong,
    timeMs: 60_000,
  },
  {
    id: 'gap-fill',
    icon: '🧩',
    group: 'core',
    level: 'A1–C2',
    mode: 'lesson',
    build: (c) => buildMistakeGame(c, 'gap'),
  },
  {
    id: 'sentence-builder',
    icon: '🧱',
    group: 'core',
    level: 'A1–C2',
    mode: 'lesson',
    build: (c) => buildExamples(c, 'tiles'),
  },
  {
    id: 'dictation',
    icon: '🎧',
    group: 'core',
    level: 'A1–C2',
    mode: 'lesson',
    needsSpeech: true,
    build: (c) => buildExamples(c, 'type'),
  },
  {
    id: 'survival',
    icon: '❤️',
    group: 'core',
    level: 'A1 → C2',
    mode: 'survival',
    gen: genSurvival,
    lives: 3,
  },
  {
    id: 'translate',
    icon: '✍️',
    group: 'core',
    level: 'A1–C1',
    mode: 'lesson',
    needsTranslation: true,
    build: (c) => buildTranslate(c),
  },
  {
    id: 'my-traps',
    icon: '🪤',
    group: 'core',
    level: 'A1–C2',
    mode: 'lesson',
    build: (c) => buildMyTraps(c),
  },
  {
    id: 'murphy-drill',
    icon: '📕',
    group: 'core',
    level: 'Murphy',
    mode: 'lesson',
    build: (c) => buildMistakeGame(c, 'gap', 10, 'murphy'),
  },

  // Tenses
  {
    id: 'tense-detective',
    icon: '🕵️',
    group: 'tenses',
    level: 'A2–B2',
    mode: 'lesson',
    build: (c) => buildTenseItems(c, 'tree', 6),
  },
  {
    id: 'timeline-match',
    icon: '📈',
    group: 'tenses',
    level: 'A2–B2',
    mode: 'lesson',
    build: (c) => buildTenseItems(c, 'timeline'),
  },
  {
    id: 'which-tense',
    icon: '🎯',
    group: 'tenses',
    level: 'A2–B2',
    mode: 'lesson',
    build: (c) => buildTenseItems(c, 'choice'),
  },
  {
    id: 'marker-sort',
    icon: '🗂️',
    group: 'tenses',
    level: 'A2–B2',
    mode: 'lesson',
    build: (c) => buildMarkerSort(c),
  },
  {
    id: 'same-scene',
    icon: '🎭',
    group: 'tenses',
    level: 'A2–B2',
    mode: 'lesson',
    build: (c) => buildSameScene(c),
  },
  {
    id: 'tense-forms',
    icon: '🛠️',
    group: 'tenses',
    level: 'A2–C1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'tenses', 10, ['choice']),
  },
  {
    id: 'tense-chameleon',
    icon: '🦎',
    group: 'tenses',
    level: 'B1–C1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'tenses', 6, ['tiles']),
  },
  {
    id: 'tense-duel',
    icon: '⚔️',
    group: 'tenses',
    level: 'A2–B2',
    mode: 'sprint',
    gen: genFromSet('tenseDuel'),
    timeMs: 60_000,
  },
  {
    id: 'story-time',
    icon: '🎬',
    group: 'tenses',
    level: 'A2–B2',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'stories', 4),
  },
  {
    id: 'verb-forge',
    icon: '⚒️',
    group: 'tenses',
    level: 'A2–B1',
    mode: 'sprint',
    gen: genVerbForge,
    timeMs: 60_000,
  },
  {
    id: 'verb-memory',
    icon: '🧠',
    group: 'tenses',
    level: 'A2–B1',
    mode: 'lesson',
    build: (c) => buildVerbMemory(c),
  },

  // Words & phrases
  {
    id: 'article-rush',
    icon: '📰',
    group: 'words',
    level: 'A1–B1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'articles', 8),
  },
  {
    id: 'article-blitz',
    icon: '🚀',
    group: 'words',
    level: 'A1–B1',
    mode: 'sprint',
    gen: genFromSet('articleBlitz'),
    timeMs: 60_000,
  },
  {
    id: 'article-repair',
    icon: '🔧',
    group: 'words',
    level: 'A1–B1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'articleRepair', 6),
  },
  {
    id: 'preposition-sort',
    icon: '📍',
    group: 'words',
    level: 'A1–B1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'prepositions', 8),
  },
  {
    id: 'count-it',
    icon: '🔢',
    group: 'words',
    level: 'A1–B1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'nouns', 10),
  },
  {
    id: 'adjective-stack',
    icon: '🎨',
    group: 'words',
    level: 'A2–B1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'adjectives', 10),
  },
  {
    id: 'false-friends',
    icon: '🦊',
    group: 'words',
    level: 'A2–C1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'falseFriends', 10),
  },
  {
    id: 'collocations',
    icon: '🧲',
    group: 'words',
    level: 'A2–C1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'collocations', 10),
  },
  {
    id: 'phrasal-verbs',
    icon: '🧗',
    group: 'words',
    level: 'B1–B2',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'phrasal', 10),
  },
  {
    id: 'verb-prep',
    icon: '🔩',
    group: 'words',
    level: 'A2–B2',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'verbPrep', 10),
  },
  {
    id: 'polite',
    icon: '🙏',
    group: 'words',
    level: 'A2–C1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'politeness', 10),
  },
  {
    id: 'number-dictation',
    icon: '🔊',
    group: 'words',
    level: 'A1–A2',
    mode: 'lesson',
    needsSpeech: true,
    build: (c) => buildNumbers(c),
  },

  // Sentence structures
  {
    id: 'question-maker',
    icon: '❓',
    group: 'structures',
    level: 'A1–B1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'questions', 10),
  },
  {
    id: 'consequence-match',
    icon: '🔀',
    group: 'structures',
    level: 'B1–C1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'conditionals', 8),
  },
  {
    id: 'transformer',
    icon: '🔁',
    group: 'structures',
    level: 'B1–B2',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'passive', 8),
  },
  {
    id: 'gossip-chain',
    icon: '💬',
    group: 'structures',
    level: 'B1–B2',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'reported', 8),
  },
  {
    id: 'verb-patterns',
    icon: '🪣',
    group: 'structures',
    level: 'B1–B2',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'verbPatterns', 8),
  },
  {
    id: 'detective',
    icon: '🔍',
    group: 'structures',
    level: 'A2–B2',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'modals', 10),
  },
  {
    id: 'regret-machine',
    icon: '💭',
    group: 'structures',
    level: 'B2–C1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'wish', 8),
  },
  {
    id: 'sentence-welder',
    icon: '🔗',
    group: 'structures',
    level: 'B1–B2',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'relatives', 8),
  },

  // Advanced
  {
    id: 'formalizer',
    icon: '🎩',
    group: 'advanced',
    level: 'C1–C2',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'inversion', 8),
  },
  {
    id: 'spotlight',
    icon: '🔦',
    group: 'advanced',
    level: 'C1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'cleft', 8),
  },
  {
    id: 'connector-bridge',
    icon: '🌉',
    group: 'advanced',
    level: 'B2–C1',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'linkers', 10),
  },
  {
    id: 'register-slider',
    icon: '🎚️',
    group: 'advanced',
    level: 'C1–C2',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'register', 8),
  },
  {
    id: 'comma-tap',
    icon: '✒️',
    group: 'advanced',
    level: 'B2–C2',
    mode: 'lesson',
    build: (c) => buildFromSet(c, 'punctuation', 6),
  },
  {
    id: 'c-mix',
    icon: '🏔️',
    group: 'advanced',
    level: 'C1–C2',
    mode: 'lesson',
    build: (c) => buildFromSets(c, ['advanced', 'inversion', 'cleft', 'register'], 12),
  },
];

export const GAME_GROUPS: GameGroup[] = ['core', 'tenses', 'words', 'structures', 'advanced'];

export function getGame(id: string): GameDef | undefined {
  return GAMES.find((g) => g.id === id);
}
