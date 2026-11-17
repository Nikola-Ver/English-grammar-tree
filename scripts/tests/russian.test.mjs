/**
 * Tests for the Russian-speaker features: translation grading and trap mapping.
 * Run: npm test
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

const { gradeTranslation, normalizeEnglish } = await import('../../app/practice/translateGrade.ts');
const { trapForRule, TRAPS, TOPICS } = await import('../../app/practice/traps.ts');

const g = (answer, ...refs) => gradeTranslation(answer, refs);

test('normalizeEnglish expands contractions and drops punctuation', () => {
  assert.deepEqual(normalizeEnglish("I'm sure she doesn't know."), ['i', 'am', 'sure', 'she', 'does', 'not', 'know']);
  assert.deepEqual(normalizeEnglish('I can’t come!'), ['i', 'can', 'not', 'come']);
});

test('exact answers pass regardless of case, punctuation and contractions', () => {
  assert.equal(g("i've already read this book", 'I have already read this book.').verdict, 'exact');
  assert.equal(g('She does not like coffee', "She doesn't like coffee.").verdict, 'exact');
});

test('alternatives are accepted', () => {
  assert.equal(g('He said that he was tired.', 'He said he was tired.', 'He said that he was tired.').verdict, 'exact');
});

test('a synonym swap is accepted, an inflection change is not', () => {
  assert.equal(g('He is a large man.', 'He is a big man.').verdict, 'accepted');
  assert.equal(g('I have two cat.', 'I have two cats.').verdict, 'wrong');
});

test('typical Russian-speaker errors are named', () => {
  const cases = [
    ['I already read this book.', 'I have already read this book.', 'tenses'],
    ['I am student.', 'I am a student.', 'articles'],
    ['I student.', 'I am a student.', 'toBe'],
    ['Where she lives?', 'Where does she live?', 'wordOrder'],
    ['When he will come, call me.', 'When he comes, call me.', 'futureTime'],
    ['It depends from the weather.', 'It depends on the weather.', 'prepositions'],
    ['I need an informations.', 'I need some information.', 'countable'],
    ['If I knew, I would come.', 'If I had known, I would have come.', 'conditionals'],
    ['He said that he is tired.', 'He said he was tired.', 'sequence'],
    ['I enjoy to swim.', 'I enjoy swimming.', 'verbPatterns'],
  ];
  for (const [answer, ref, trap] of cases) {
    const r = g(answer, ref);
    assert.equal(r.verdict, 'wrong', answer);
    assert.ok(r.traps.includes(trap), `${answer} → ${r.traps.join(',')} (expected ${trap})`);
  }
});

test('no false countable trap on 3rd-person verbs', () => {
  assert.ok(!g('Where she lives?', 'Where does she live?').traps.includes('countable'));
});

test('trap mapping covers grammar rules, Murphy titles and topics', () => {
  assert.equal(trapForRule('a1_05'), 'articles');
  assert.equal(trapForRule('b1_03'), 'tenses');
  assert.equal(trapForRule('b1_09'), 'futureTime');
  assert.equal(trapForRule('b1_15'), 'sequence');
  assert.equal(trapForRule('el_u47', 'Unit 47 — A/an, the и zero article (3)'), 'articles');
  assert.equal(trapForRule('int_u31', 'Unit 31 — Must и have to'), 'modals');
  assert.equal(trapForRule('el_u03', 'Unit 3 — I am doing (Present Continuous)'), 'tenses');
  assert.equal(trapForRule('w_false_friends'), 'falseFriends');
  assert.equal(trapForRule('c1_14'), null);
  const keys = new Set(TRAPS.map((t) => t.key));
  for (const topic of TOPICS) assert.ok(keys.has(topic.trap));
});
