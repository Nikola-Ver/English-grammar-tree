/**
 * Text formats of the hand-written article and tense games.
 *
 * Pure module (no browser imports): shared by the exercise components, the content validator
 * and tests.
 */

// ---------------------------------------------------------------------------
// Article repair: "I bought {a} car. {The} car is red."
// The braces mark articles the learner has to put back; everything else is shown.
// ---------------------------------------------------------------------------

export const ARTICLES = ['a', 'an', 'the'] as const;

export interface InsertParsed {
  /** the text without its articles, one entry per word (punctuation stays attached) */
  words: string[];
  /** article that belongs before words[i], or null */
  need: (string | null)[];
  /** words[i] is the first visible word of a sentence */
  start: boolean[];
}

export function parseInsert(text: string): InsertParsed {
  const words: string[] = [];
  const need: (string | null)[] = [];
  const start: boolean[] = [];
  let pending: string | null = null;
  let sentenceStart = true;
  for (const token of text.trim().split(/\s+/)) {
    const slot = token.match(/^\{([A-Za-z]+)\}$/);
    if (slot) {
      pending = slot[1].toLowerCase();
      continue;
    }
    words.push(token);
    need.push(pending);
    start.push(sentenceStart);
    pending = null;
    sentenceStart = /[.!?]["')]?$/.test(token);
  }
  return { words, need, start };
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** How word `i` reads with (or without) an article in front of it. */
export function insertWord(
  p: InsertParsed,
  i: number,
  article: string | null,
): { article: string | null; word: string } {
  const first = p.start[i];
  if (article) return { article: first ? capitalize(article) : article, word: p.words[i] };
  // a sentence that lost its article starts with the next word, so that word gets the capital
  return { article: null, word: first && p.need[i] ? capitalize(p.words[i]) : p.words[i] };
}

export interface InsertGrade {
  /** needed articles put back correctly */
  right: number;
  /** articles added where none belongs */
  extra: number;
  total: number;
  /** 0..1 */
  score: number;
}

export function gradeInsert(p: InsertParsed, choice: (string | null)[]): InsertGrade {
  let right = 0;
  let extra = 0;
  let total = 0;
  p.need.forEach((n, i) => {
    if (n) total++;
    if (n && choice[i] === n) right++;
    if (!n && choice[i]) extra++;
  });
  return { right, extra, total, score: total ? Math.max(0, right - extra) / total : 0 };
}

// ---------------------------------------------------------------------------
// Story time: "Yesterday I {go: went|was going|have gone} to the park."
// Each gap: an optional hint before the colon (the base verb), then the options;
// the first option is the right one.
// ---------------------------------------------------------------------------

export interface StoryGap {
  hint: string | null;
  /** options[0] is correct */
  options: string[];
}

export interface StoryParsed {
  /** text around the gaps: parts[i] comes before gaps[i] */
  parts: string[];
  gaps: StoryGap[];
}

export function parseStory(text: string): StoryParsed {
  const raw = text.split(/\{([^}]*)\}/);
  const parts: string[] = [];
  const gaps: StoryGap[] = [];
  raw.forEach((chunk, i) => {
    if (i % 2 === 0) {
      parts.push(chunk);
      return;
    }
    const colon = chunk.indexOf(':');
    const hasHint = colon >= 0 && !chunk.slice(0, colon).includes('|');
    const body = hasHint ? chunk.slice(colon + 1) : chunk;
    gaps.push({
      hint: hasHint ? chunk.slice(0, colon).trim() : null,
      options: body.split('|').map((o) => o.trim()),
    });
  });
  return { parts, gaps };
}
