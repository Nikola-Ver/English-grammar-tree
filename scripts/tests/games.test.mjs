/**
 * Text formats of the article and tense games, and the hand-written content behind them.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

const { parseInsert, insertWord, gradeInsert, parseStory } = await import(
  '../../app/practice/gameText.ts'
);
const { ARTICLE_BLITZ } = await import('../../app/practice/content/articleBlitz.ts');
const { ARTICLE_REPAIR } = await import('../../app/practice/content/articleRepair.ts');
const { TENSE_DUEL } = await import('../../app/practice/content/tenseDuel.ts');
const { TENSE_STORIES } = await import('../../app/practice/content/stories.ts');

test('article repair: the text is shown without its articles', () => {
  const p = parseInsert('I bought {a} car yesterday. {The} car is red.');
  assert.deepEqual(p.words, ['I', 'bought', 'car', 'yesterday.', 'car', 'is', 'red.']);
  assert.deepEqual(p.need, [null, null, 'a', null, 'the', null, null]);
  assert.deepEqual(p.start, [true, false, false, false, true, false, false]);
  // a sentence that lost its article starts with a capital; with the article it does not
  assert.deepEqual(insertWord(p, 4, null), { article: null, word: 'Car' });
  assert.deepEqual(insertWord(p, 4, 'the'), { article: 'The', word: 'car' });
  assert.deepEqual(insertWord(p, 2, 'a'), { article: 'a', word: 'car' });
  assert.deepEqual(insertWord(p, 0, null), { article: null, word: 'I' });
});

test('article repair: grading counts right, wrong and extra articles', () => {
  const p = parseInsert('I bought {a} car yesterday. {The} car is red.');
  const pick = (map) => p.words.map((_, i) => map[i] ?? null);
  assert.equal(gradeInsert(p, pick({ 2: 'a', 4: 'the' })).score, 1);
  assert.equal(gradeInsert(p, pick({ 2: 'a' })).score, 0.5);
  // the wrong article is not credit
  assert.equal(gradeInsert(p, pick({ 2: 'the', 4: 'the' })).score, 0.5);
  // an article where none belongs cancels a right one
  const extra = gradeInsert(p, pick({ 2: 'a', 4: 'the', 3: 'the' }));
  assert.deepEqual([extra.right, extra.extra, extra.score], [2, 1, 0.5]);
  assert.equal(gradeInsert(p, pick({ 0: 'a', 1: 'a', 5: 'a' })).score, 0);
});

test('story time: gaps carry a hint and options, the first one right', () => {
  const s = parseStory('I {go: went|was going} home. It {rained|was raining}.');
  assert.deepEqual(s.parts, ['I ', ' home. It ', '.']);
  assert.deepEqual(s.gaps, [
    { hint: 'go', options: ['went', 'was going'] },
    { hint: null, options: ['rained', 'was raining'] },
  ]);
});

test('article blitz: every phrase has one gap and uses a / an by sound', () => {
  assert.ok(ARTICLE_BLITZ.length >= 80);
  const counts = { a: 0, an: 0, the: 0, '—': 0 };
  for (const s of ARTICLE_BLITZ) {
    assert.deepEqual(s.options, ['a', 'an', 'the', '—'], s.id);
    const answer = s.options[s.answer];
    counts[answer]++;
    const after = s.prompt.split('___')[1].trim();
    const vowelSound = /^(?:[aeio]|un(?!i)|hour|honest|MBA)/i.test(after) && !/^(?:one|uni|use|eur)/i.test(after);
    if (answer === 'an') assert.ok(vowelSound, `${s.id}: an ${after}`);
    if (answer === 'a') assert.ok(!vowelSound, `${s.id}: a ${after}`);
  }
  // no key is so rare that guessing the others pays off
  for (const [k, n] of Object.entries(counts)) assert.ok(n >= 12, `${k}: ${n}`);
});

test('tense duel: two fixed sides per duel and a fair split', () => {
  const byDuel = new Map();
  for (const s of TENSE_DUEL) {
    assert.equal(s.options.length, 2, s.id);
    assert.equal(s.labels.length, 2, s.id);
    const key = s.id.split('_')[1];
    const d = byDuel.get(key) ?? { labels: s.labels.join('|'), n: [0, 0] };
    assert.equal(s.labels.join('|'), d.labels, `${s.id}: sides must not move`);
    d.n[s.answer]++;
    byDuel.set(key, d);
  }
  assert.equal(byDuel.size, 6);
  for (const [key, d] of byDuel) {
    assert.ok(d.n[0] >= 3 && d.n[1] >= 3, `${key}: ${d.n} — one side is almost never right`);
  }
});

test('ids of the new content are unique and stable in shape', () => {
  const ids = [...ARTICLE_BLITZ, ...ARTICLE_REPAIR, ...TENSE_DUEL, ...TENSE_STORIES].map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ARTICLE_BLITZ[0].id, 'ab_001');
  assert.equal(TENSE_DUEL[0].id, 'td_pp_01');
  for (const s of TENSE_STORIES) assert.equal(s.notes.length, parseStory(s.text).gaps.length, s.id);
});
