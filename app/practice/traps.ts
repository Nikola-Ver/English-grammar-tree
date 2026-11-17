/**
 * Russian-speaker "traps": every practice item is tagged with the kind of interference it
 * tests, so the app can show which traps a learner falls into and train exactly those.
 * Names/descriptions: i18n practice.traps.<key>.{name,desc}.
 */
import type { TopicId, TrapKey } from './content/types';

export const TRAPS: { key: TrapKey; icon: string }[] = [
  { key: 'articles', icon: '🅰️' },
  { key: 'tenses', icon: '⏳' },
  { key: 'toBe', icon: '🟰' },
  { key: 'wordOrder', icon: '🔀' },
  { key: 'futureTime', icon: '⏭️' },
  { key: 'prepositions', icon: '📍' },
  { key: 'countable', icon: '🔢' },
  { key: 'conditionals', icon: '💭' },
  { key: 'sequence', icon: '💬' },
  { key: 'verbPatterns', icon: '🪣' },
  { key: 'modals', icon: '🔍' },
  { key: 'falseFriends', icon: '🦊' },
  { key: 'collocations', icon: '🧲' },
  { key: 'phrasal', icon: '🧗' },
  { key: 'politeness', icon: '🙏' },
];

export const TRAP_ICON: Record<TrapKey, string> = Object.fromEntries(
  TRAPS.map((t) => [t.key, t.icon]),
) as Record<TrapKey, string>;

/** Word-level topics (not grammar rules) — shown as a "Words" row in progress. */
export const TOPICS: { id: TopicId; trap: TrapKey; icon: string }[] = [
  { id: 'w_false_friends', trap: 'falseFriends', icon: '🦊' },
  { id: 'w_collocations', trap: 'collocations', icon: '🧲' },
  { id: 'w_phrasal', trap: 'phrasal', icon: '🧗' },
  { id: 'w_verb_prep', trap: 'prepositions', icon: '🔩' },
  { id: 'w_polite', trap: 'politeness', icon: '🙏' },
];

const GRAMMAR_TRAPS: Partial<Record<TrapKey, string[]>> = {
  toBe: ['a1_01', 'a1_02', 'a1_04', 'a2_05'],
  articles: ['a1_05', 'a1_06', 'a1_07'],
  tenses: [
    'a1_08',
    'a1_09',
    'a1_11',
    'a2_01',
    'a2_02',
    'a2_03',
    'a2_06',
    'a2_07',
    'a2_08',
    'a2_09',
    'a2_10',
    'b1_01',
    'b1_02',
    'b1_03',
    'b1_04',
    'b1_05',
    'b1_06',
    'b1_07',
    'b1_21',
    'b1_24',
    'b1_25',
    'b2_01',
    'b2_02',
    'c2_14',
  ],
  futureTime: ['b1_09'],
  wordOrder: [
    'a1_03',
    'a1_10',
    'a1_16',
    'a1_20',
    'a2_04',
    'a2_22',
    'a2_25',
    'a2_26',
    'b1_16',
    'c1_01',
    'c1_02',
    'c1_03',
    'c1_04',
    'c2_03',
    'c2_04',
  ],
  prepositions: ['a1_17', 'a1_24', 'a2_20', 'a2_21', 'b2_18', 'c1_13'],
  countable: ['a1_14', 'a2_17', 'a2_18', 'a2_19', 'b2_27'],
  conditionals: [
    'b1_08',
    'b1_10',
    'b1_11',
    'b2_07',
    'b2_08',
    'b2_14',
    'b2_15',
    'b2_16',
    'c1_07',
    'c1_08',
    'c1_09',
    'c2_01',
    'c2_02',
  ],
  verbPatterns: ['b1_18', 'b1_19', 'b1_20', 'b1_26', 'b2_12', 'b2_13', 'b2_20'],
  modals: [
    'a1_19',
    'a2_11',
    'a2_12',
    'a2_13',
    'a2_14',
    'b2_03',
    'b2_04',
    'b2_05',
    'b2_06',
    'b2_22',
    'b2_23',
    'b2_24',
    'b2_25',
  ],
  sequence: ['b1_15', 'b1_17', 'b2_21', 'c2_15'],
  phrasal: ['b1_27'],
  collocations: ['c2_08', 'c2_10'],
};

const BY_RULE = new Map<string, TrapKey>();
for (const [trap, ids] of Object.entries(GRAMMAR_TRAPS) as [TrapKey, string[]][]) {
  for (const id of ids) BY_RULE.set(id, trap);
}
for (const t of TOPICS) BY_RULE.set(t.id, t.trap);

/** Murphy units: matched on the unit title (order matters — most specific first). */
const MURPHY_PATTERNS: [RegExp, TrapKey][] = [
  [/phrasal|фразов|\b(up|off|out|away|back)\b.*\b(up|off|out|away|back)\b/i, 'phrasal'],
  [/\ba\/an\b|\bthe\b|артикл|article/i, 'articles'],
  [/when i do|when and if|\bif and when\b|as soon as/i, 'futureTime'],
  [/\bif\b|wish|conditional|услов/i, 'conditionals'],
  [/reported|косвенн|\bsaid\b|\btold\b/i, 'sequence'],
  [/question|вопрос|word order|порядок слов|do you|have you/i, 'wordOrder'],
  [/-ing|to \+|infinitive|gerund|инфинитив|герунди/i, 'verbPatterns'],
  [/\b(can|could|must|may|might|should|ought|need)\b|have to|модальн/i, 'modals'],
  [
    /countable|\bmuch\b|\bmany\b|\bfew\b|\blittle\b|\bsome\b|\bany\b|plural|исчисля|множествен/i,
    'countable',
  ],
  [
    /preposition|предлог|\bat\/on\/in\b|\bin\/at\b|\bon\/at\b|\bduring\b|\buntil\b/i,
    'prepositions',
  ],
  [/present|past|perfect|continuous|future|\bwill\b|going to|used to|\bsimple\b|врем/i, 'tenses'],
  [/^unit \d+ [—-] (am|is|are|was|were)\b/i, 'toBe'],
];

export function trapForRule(ruleId: string, title = ''): TrapKey | null {
  const direct = BY_RULE.get(ruleId);
  if (direct) return direct;
  if (/^(el|int|adv)_/.test(ruleId)) {
    for (const [re, trap] of MURPHY_PATTERNS) if (re.test(title)) return trap;
  }
  return null;
}

export function isTopic(id: string): id is TopicId {
  return id.startsWith('w_');
}
