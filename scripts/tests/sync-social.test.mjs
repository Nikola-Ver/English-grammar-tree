/**
 * Tests for cloud-sync diffing and the social helpers.
 * Run: npm test
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

const { emptyState, mergeStates, practicePatch, normalizeState } = await import(
  '../../app/practice/store.ts'
);
const { weekKey, weekStart, liveStreak, liveWeekXp, pairId, sanitizeName, normalizeCode } =
  await import('../../app/social/socialUtils.ts');

const item = (s, b = 1) => ({ b, d: 10, n: 1, c: 1, l: 0, f: 0, fd: 0, s });

test('practicePatch: first upload is a full write', () => {
  assert.equal(practicePatch(emptyState(), null), 'full');
});

test('practicePatch: nothing changed → null', () => {
  const a = emptyState();
  a.items.x = item(1);
  assert.equal(practicePatch(a, structuredClone(a)), null);
});

test('practicePatch: only changed items and days are sent', () => {
  const base = emptyState();
  base.items.a = item(1);
  base.items.b = item(1);
  base.days['2026-01-01'] = { xp: 10, n: 1, c: 1, s: 0, ms: 0 };
  const cur = structuredClone(base);
  cur.items.b = item(2, 2);
  cur.items.c = item(3);
  cur.days['2026-01-01'] = { xp: 20, n: 2, c: 2, s: 0, ms: 0 };
  cur.xp = 20;
  const patch = practicePatch(cur, base);
  assert.notEqual(patch, 'full');
  assert.deepEqual(Object.keys(patch.items).sort(), ['b', 'c']);
  assert.deepEqual(Object.keys(patch.days), ['2026-01-01']);
  assert.equal(patch.xp, 20);
  assert.equal(patch.streak, undefined);
  assert.equal(patch.badges, undefined);
});

test('practicePatch: a reset forces a full overwrite', () => {
  const base = emptyState();
  base.items.a = item(1);
  const cur = { ...emptyState(), resetAt: 5 };
  assert.equal(practicePatch(cur, base), 'full');
});

test('mergeStates: a newer reset on either side discards older data', () => {
  const old = emptyState();
  old.items.a = item(1);
  old.xp = 500;
  const reset = { ...emptyState(), resetAt: 100 };
  reset.items.b = item(200);
  const m1 = mergeStates(old, reset);
  assert.deepEqual(Object.keys(m1.items), ['b']);
  assert.equal(m1.xp, 0);
  assert.equal(m1.resetAt, 100);
  const m2 = mergeStates(reset, old);
  assert.deepEqual(Object.keys(m2.items), ['b']);
});

test('normalizeState fills missing fields from older documents', () => {
  const s = normalizeState({ xp: 5, items: { a: item(1) } });
  assert.equal(s.xp, 5);
  assert.deepEqual(s.days, {});
  assert.equal(s.settings.goal, 50);
  assert.equal(s.streak.cur, 0);
});

test('weekKey follows ISO-8601 weeks', () => {
  const day = (y, m, d) => Date.UTC(y, m - 1, d) / 86_400_000;
  assert.equal(weekKey(day(2026, 11, 16)), '2026-W47'); // Monday
  assert.equal(weekKey(day(2026, 11, 22)), '2026-W47'); // Sunday
  assert.equal(weekKey(day(2026, 11, 23)), '2026-W48');
  assert.equal(weekKey(day(2021, 1, 3)), '2020-W53'); // belongs to the previous ISO year
  assert.equal(weekKey(day(2024, 12, 30)), '2025-W01');
  assert.equal(weekStart(day(2026, 11, 19)), day(2026, 11, 16));
});

test('liveStreak / liveWeekXp hide stale values', () => {
  assert.equal(liveStreak({ streak: 9, lastDay: 100 }, 101), 9);
  assert.equal(liveStreak({ streak: 9, lastDay: 100 }, 110), 0);
  assert.equal(liveWeekXp({ week: '2026-W47', weekXp: 300 }, '2026-W47'), 300);
  assert.equal(liveWeekXp({ week: '2026-W46', weekXp: 300 }, '2026-W47'), 0);
});

test('pairId is order-independent', () => {
  assert.equal(pairId('b', 'a'), 'a_b');
  assert.equal(pairId('a', 'b'), 'a_b');
});

test('sanitizeName strips markup and control characters, limits length', () => {
  assert.equal(sanitizeName('  <b>Anna</b>\u0007  K  '), 'bAnna/b K');
  assert.equal(sanitizeName('x'.repeat(40)).length, 24);
});

test('normalizeCode uppercases and strips separators', () => {
  assert.equal(normalizeCode('k7mx-2qpa'), 'K7MX2QPA');
});
