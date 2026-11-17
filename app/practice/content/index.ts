import { ADJECTIVE_DRILLS } from './adjectives';
import { ADVANCED_DRILLS } from './advanced';
import { ARTICLE_BLITZ } from './articleBlitz';
import { ARTICLE_REPAIR } from './articleRepair';
import { ARTICLE_DRILLS } from './articles';
import { CLEFT_DRILLS } from './cleft';
import { CONDITIONAL_DRILLS } from './conditionals';
import { INVERSION_DRILLS } from './inversion';
import { LINKER_DRILLS } from './linkers';
import { MODAL_DRILLS } from './modals';
import { NOUN_DRILLS } from './nouns';
import { PASSIVE_DRILLS } from './passive';
import { POLITENESS_DRILLS } from './politeness';
import { PREPOSITION_DRILLS } from './prepositions';
import { PUNCTUATION_DRILLS } from './punctuation';
import { QUESTION_DRILLS } from './questions';
import { REGISTER_DRILLS } from './register';
import { RELATIVE_DRILLS } from './relatives';
import { REPORTED_DRILLS } from './reported';
import { TENSE_STORIES } from './stories';
import { TENSE_DUEL } from './tenseDuel';
import { TENSE_DRILLS } from './tenses';
import { TRANSLATE_DRILLS } from './translate';
import type { Seed } from './types';
import { VERB_PATTERN_DRILLS } from './verbPatterns';
import { WISH_DRILLS } from './wish';
import { COLLOCATION_DRILLS, FALSE_FRIEND_DRILLS, PHRASAL_DRILLS, VERB_PREP_DRILLS } from './words';

export { TENSE_SENTENCES } from './tenses';
export { IRREGULAR_VERBS } from './verbs';

/** Drill sets by game family. Keys are referenced by the game catalog. */
export const DRILL_SETS = {
  tenses: TENSE_DRILLS,
  questions: QUESTION_DRILLS,
  articles: ARTICLE_DRILLS,
  prepositions: PREPOSITION_DRILLS,
  nouns: NOUN_DRILLS,
  adjectives: ADJECTIVE_DRILLS,
  conditionals: CONDITIONAL_DRILLS,
  passive: PASSIVE_DRILLS,
  reported: REPORTED_DRILLS,
  verbPatterns: VERB_PATTERN_DRILLS,
  modals: MODAL_DRILLS,
  wish: WISH_DRILLS,
  relatives: RELATIVE_DRILLS,
  inversion: INVERSION_DRILLS,
  cleft: CLEFT_DRILLS,
  linkers: LINKER_DRILLS,
  register: REGISTER_DRILLS,
  punctuation: PUNCTUATION_DRILLS,
  advanced: ADVANCED_DRILLS,
  translate: TRANSLATE_DRILLS,
  falseFriends: FALSE_FRIEND_DRILLS,
  collocations: COLLOCATION_DRILLS,
  phrasal: PHRASAL_DRILLS,
  verbPrep: VERB_PREP_DRILLS,
  politeness: POLITENESS_DRILLS,
  articleBlitz: ARTICLE_BLITZ,
  articleRepair: ARTICLE_REPAIR,
  tenseDuel: TENSE_DUEL,
  stories: TENSE_STORIES,
} satisfies Record<string, Seed[]>;

export type DrillSetKey = keyof typeof DRILL_SETS;
