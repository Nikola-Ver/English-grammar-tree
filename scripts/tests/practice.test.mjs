/**
 * Unit tests for the pure practice modules.
 * Run: npm test   (Node ≥ 23.6 strips TypeScript types natively)
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

const { parseMistake, diffRegion, tokenize, normSentence } = await import('../../app/practice/text.ts');
const { review, ruleMastery, dayNumber, inMistakeDeck, FIX_TARGET, INTERVALS } = await import(
  '../../app/practice/srs.ts'
);
const { mergeStates, emptyState, streakView, levelFromXp } = await import('../../app/practice/store.ts');

test('parseMistake: full sentences', () => {
  assert.deepEqual(parseMistake('<s>I is hungry</s> → I <em>am</em> hungry'), {
    wrong: 'I is hungry',
    right: 'I am hungry',
  });
});

test('parseMistake: fragments are patched into the wrong sentence', () => {
  assert.equal(parseMistake('<s>You should to see a doctor</s> → should <em>see</em> (without to)')?.right, 'You should see a doctor');
  assert.equal(parseMistake('<s>The project has been complete</s> → has been <em>completed</em>')?.right, 'The project has been completed');
  assert.equal(parseMistake('<s>The bridge was build in 1890</s> → was <em>built</em>')?.right, 'The bridge was built in 1890');
  assert.equal(parseMistake('<s>If you heat water, it will boil</s> → it <em>boils</em>')?.right, 'If you heat water, it boils');
});

test('parseMistake: rejects unusable lines', () => {
  // truncated correction
  assert.equal(parseMistake('<s>She is going to school every day</s> → She <em>goes</em>'), null);
  // Russian in the corrected part
  assert.equal(parseMistake('<s>3,14</s> → 3<em>.</em>14 (точка, не запятая)'), null);
  // no arrow
  assert.equal(parseMistake('<s>She is not = shes not</s> — только <em>she\'s not</em>'), null);
  // alternatives with "/"
  assert.equal(parseMistake('<s>He hasn\'t no money</s> → <em>He has no money</em> / <em>He hasn\'t any money</em>.'), null);
});

test('diffRegion finds the single changed span', () => {
  const d = diffRegion(tokenize('There is many people.'), tokenize('There are many people.'));
  assert.deepEqual(d, { aStart: 1, aEnd: 2, bStart: 1, bEnd: 2 });
});

test('normSentence ignores case, final period and curly quotes', () => {
  assert.equal(normSentence('I’m here.'), normSentence("i'm here"));
});

test('SRS: correct answers climb boxes only when due', () => {
  const now = Date.UTC(2026, 0, 10, 12);
  const s1 = review(undefined, true, now);
  assert.equal(s1.b, 1);
  assert.equal(s1.d, dayNumber(now) + INTERVALS[1]);
  const s2 = review(s1, true, now); // same day, not due → no promotion
  assert.equal(s2.b, 1);
  const later = now + 86_400_000 * INTERVALS[1];
  const s3 = review(s2, true, later);
  assert.equal(s3.b, 2);
});

test('SRS: a lapse drops the box and enters the mistake deck until fixed on separate days', () => {
  const day = 86_400_000;
  const t0 = Date.UTC(2026, 0, 10, 12);
  let st = review(undefined, true, t0);
  st = review(st, false, t0);
  assert.equal(st.b, 0);
  assert.ok(inMistakeDeck(st));
  for (let k = 1; k <= FIX_TARGET; k++) st = review(st, true, t0 + k * 10 * day);
  assert.ok(!inMistakeDeck(st));
});

test('ruleMastery: stages follow the best items', () => {
  const today = 20_000;
  const mk = (b) => ({ b, d: today + 30, n: 3, c: 3, l: 0, f: 0, fd: 0, s: 1 });
  const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
  assert.equal(ruleMastery(ids, {}, today).stage, 0);
  assert.equal(ruleMastery(ids, Object.fromEntries(ids.map((id) => [id, mk(3)])), today).stage, 3);
  assert.equal(ruleMastery(ids, Object.fromEntries(ids.map((id) => [id, mk(5)])), today).stage, 4);
  const overdue = { a: { ...mk(2), d: today - 2 }, b: mk(2), c: mk(2) };
  assert.equal(ruleMastery(ids, overdue, today).wilting, true);
});

test('mergeStates: per-item last write wins, stats take the max', () => {
  const a = emptyState();
  const b = emptyState();
  a.items.x = { b: 1, d: 1, n: 1, c: 1, l: 0, f: 0, fd: 0, s: 100 };
  b.items.x = { b: 3, d: 9, n: 4, c: 4, l: 0, f: 0, fd: 0, s: 200 };
  b.items.y = { b: 2, d: 5, n: 2, c: 2, l: 0, f: 0, fd: 0, s: 50 };
  a.days['2026-01-01'] = { xp: 40, n: 4, c: 3, s: 1, ms: 1000 };
  b.days['2026-01-01'] = { xp: 20, n: 2, c: 2, s: 2, ms: 500 };
  a.badges.first_step = 10;
  b.badges.first_step = 5;
  const m = mergeStates(a, b);
  assert.equal(m.items.x.b, 3);
  assert.ok(m.items.y);
  assert.equal(m.days['2026-01-01'].xp, 40);
  assert.equal(m.days['2026-01-01'].s, 2);
  assert.equal(m.badges.first_step, 5);
  assert.deepEqual(mergeStates(m, m), m);
});

test('streakView: alive yesterday, broken after a gap without freezes', () => {
  const s = emptyState();
  s.streak = { cur: 5, best: 5, last: 1000, freezes: 0, frozen: [] };
  assert.equal(streakView(s, 1001).current, 5);
  assert.equal(streakView(s, 1001).atRisk, true);
  assert.equal(streakView(s, 1003).current, 0);
  s.streak.freezes = 2;
  assert.equal(streakView(s, 1003).current, 5);
});

test('levelFromXp', () => {
  assert.equal(levelFromXp(0).level, 1);
  assert.equal(levelFromXp(100).level, 2);
  assert.equal(levelFromXp(299).level, 2);
  assert.equal(levelFromXp(300).level, 3);
});
