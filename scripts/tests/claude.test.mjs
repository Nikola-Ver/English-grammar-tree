/**
 * Claude connector: the shaky-rule logic shared with the app, the sign-in handoff and an
 * end-to-end run of the bundled connector against a fake Firebase.
 * Run: npm test
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

const { applyClaudeMistakes, isShaky, shakyRuleIds, parseClaudeDoc, SHAKY_ITEMS } = await import(
  '../../app/practice/claude.ts'
);
const { review, ruleMastery, dayNumber, inMistakeDeck, STAGE_DONE } = await import(
  '../../app/practice/srs.ts'
);
const { mergeStates, emptyState, practicePatch, creditClaudePractice } = await import(
  '../../app/practice/store.ts'
);
const { encodeFields, decodeFields } = await import('../../mcp/src/cloud.js');

const DAY = 86_400_000;
const NOW = Date.UTC(2026, 5, 20, 12);
const RULE_ITEMS = Array.from({ length: 8 }, (_, i) => `i${i}`);
const itemsOf = (r) => (r === 'b1_01' ? RULE_ITEMS : undefined);

/** A rule the learner has mastered: every item in box 4, due in the future. */
function masteredState() {
  const items = {};
  for (const id of RULE_ITEMS)
    items[id] = { b: 4, d: dayNumber(NOW) + 10, n: 4, c: 4, l: 0, f: 0, fd: 0, s: NOW - 20 * DAY };
  return { ...emptyState(), items };
}

const mistake = (id, daysAgo, at = NOW) => ({
  id,
  r: 'b1_01',
  w: 'I live here since 2010',
  c: 'I have lived here since 2010',
  t: NOW - daysAgo * DAY,
  at,
});

test('one mistake sends one item of the rule back to the mistake deck', () => {
  const s = masteredState();
  const next = applyClaudeMistakes(s, [mistake('a', 0)], itemsOf, NOW);
  const lapsed = RULE_ITEMS.filter((id) => inMistakeDeck(next.items[id]));
  assert.equal(lapsed.length, 1);
  assert.equal(next.items[lapsed[0]].d, dayNumber(NOW));
  assert.deepEqual(shakyRuleIds(next), []);
  assert.equal(next.claudeAt, NOW);
  // still mastered: one slip is not "bad understanding"
  assert.ok(ruleMastery(RULE_ITEMS, next.items, dayNumber(NOW)).stage >= STAGE_DONE);
});

test('repeated mistakes on different days make a mastered rule shaky', () => {
  const s = masteredState();
  const log = [mistake('a', 5), mistake('b', 2), mistake('c', 0)];
  const next = applyClaudeMistakes(s, log, itemsOf, NOW);
  assert.deepEqual(shakyRuleIds(next), ['b1_01']);
  assert.equal(next.shaky.b1_01.items.length, SHAKY_ITEMS);
  assert.ok(ruleMastery(RULE_ITEMS, next.items, dayNumber(NOW)).stage < STAGE_DONE);
});

test('three mistakes on the same day are not enough', () => {
  const log = [mistake('a', 0), mistake('b', 0), mistake('c', 0)];
  const next = applyClaudeMistakes(masteredState(), log, itemsOf, NOW);
  assert.deepEqual(shakyRuleIds(next), []);
});

test('already applied mistakes are not applied twice', () => {
  const log = [mistake('a', 5), mistake('b', 2), mistake('c', 0)];
  const once = applyClaudeMistakes(masteredState(), log, itemsOf, NOW);
  assert.equal(applyClaudeMistakes({ ...masteredState(), ...once }, log, itemsOf, NOW), null);
});

test('a shaky rule recovers after correct answers on three different days', () => {
  const log = [mistake('a', 5), mistake('b', 2), mistake('c', 0)];
  const next = applyClaudeMistakes(masteredState(), log, itemsOf, NOW);
  const items = { ...next.items };
  for (let day = 1; day <= 3; day++)
    for (const id of next.shaky.b1_01.items) items[id] = review(items[id], true, NOW + day * 9 * DAY);
  assert.equal(isShaky(next.shaky.b1_01, items), false);
  // a new mistake after recovery starts counting from scratch
  const later = { ...mistake('d', -30), at: NOW + 30 * DAY };
  const again = applyClaudeMistakes(
    { ...next, items },
    [...log, later],
    itemsOf,
    NOW + 30 * DAY,
  );
  assert.deepEqual(shakyRuleIds(again), []);
});

test('unknown rules are skipped but still advance the high-water mark', () => {
  const next = applyClaudeMistakes(masteredState(), [{ ...mistake('a', 0), r: 'nope' }], itemsOf, NOW);
  assert.equal(next.claudeAt, NOW);
  assert.deepEqual(next.items, masteredState().items);
});

test('shaky state merges across devices and is part of the sync patch', () => {
  const base = masteredState();
  const log = [mistake('a', 5), mistake('b', 2), mistake('c', 0)];
  const flagged = { ...base, ...applyClaudeMistakes(base, log, itemsOf, NOW), updatedAt: NOW };
  const merged = mergeStates(base, flagged);
  assert.deepEqual(shakyRuleIds(merged), ['b1_01']);
  assert.equal(merged.claudeAt, NOW);
  assert.deepEqual(mergeStates(merged, flagged), merged);
  const patch = practicePatch(flagged, base);
  assert.ok(patch.shaky.b1_01 && patch.claudeAt === NOW && Object.keys(patch.items).length === SHAKY_ITEMS);
});

test('Firestore values survive an encode/decode round trip', () => {
  const doc = { v: 1, m: { c1: { r: 'a1_05', w: 'x', t: 1750000000000, at: 0 } }, list: [1, 'a', true], f: 0.5 };
  assert.deepEqual(decodeFields(encodeFields(doc)), doc);
  assert.equal(parseClaudeDoc(doc)[0].id, 'c1');
});

test('sign-in handoff: only the right state is accepted', async () => {
  process.env.EGT_NO_BROWSER = '1';
  const { startLogin } = await import('../../mcp/src/login.js');
  const login = startLogin();
  const url = await login.url;
  const [, port, state] = url.match(/#connect=(\d+)\.([a-f0-9]+)$/);
  const post = (body) =>
    fetch(`http://127.0.0.1:${port}/token`, { method: 'POST', body: JSON.stringify(body) });
  const creds = { uid: 'u1', rt: 'refresh', key: 'k', pid: 'p' };
  assert.equal((await post({ ...creds, state: 'wrong' })).status, 400);
  assert.match(await (await fetch(`http://127.0.0.1:${port}/done`)).text(), /Connecting/);
  assert.equal((await post({ ...creds, state })).status, 204);
  assert.deepEqual(await login.done, creds);
});

test('connector end to end against a fake Firebase', async () => {
  const { build } = await import('esbuild');
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'egt-'));
  const out = path.join(home, 'index.mjs');
  await build({
    entryPoints: ['mcp/src/index.js'],
    outfile: out,
    bundle: true,
    platform: 'node',
    format: 'esm',
    logLevel: 'silent',
  });
  fs.writeFileSync(path.join(home, 'auth.json'), JSON.stringify({ uid: 'u1', rt: 'r', key: 'k', pid: 'p' }));

  const now = Date.now();
  const remoteLog = {
    v: 1,
    m: {
      old1: { r: 'a1_05', w: 'I am student', c: 'I am a student', t: now - 3 * DAY, at: now - 3 * DAY },
      old2: { r: 'a1_05', w: 'She is doctor', c: 'She is a doctor', t: now - 2 * DAY, at: now - 2 * DAY },
    },
  };
  const state = { ...emptyState(), xp: 420, settings: { goal: 50, sound: true, placement: 'B1', updatedAt: 1 } };
  const patches = [];
  const fake = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => {
      body += c;
    });
    req.on('end', () => {
      const json = (v, code = 200) => res.writeHead(code, { 'content-type': 'application/json' }).end(JSON.stringify(v));
      if (req.url.startsWith('/token')) return json({ id_token: 'ID', expires_in: '3600', refresh_token: 'r' });
      assert.equal(req.headers.authorization, 'Bearer ID');
      assert.ok(req.url.includes('/projects/p/databases/(default)/documents/users/u1/practice/'));
      if (req.method === 'PATCH') {
        patches.push({ url: decodeURIComponent(req.url), doc: decodeFields(JSON.parse(body).fields) });
        return json({});
      }
      if (req.url.endsWith('/state')) return json({ fields: encodeFields(state) });
      if (req.url.endsWith('/claude')) return json({ fields: encodeFields(remoteLog) });
      json({ error: { message: 'not found' } }, 404);
    });
  });
  await new Promise((r) => fake.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${fake.address().port}`;

  const child = spawn(process.execPath, [out], {
    env: { ...process.env, EGT_HOME: home, EGT_TOKEN_URL: `${base}/token`, EGT_FIRESTORE_URL: base },
    stdio: ['pipe', 'pipe', 'inherit'],
  });
  const waiting = new Map();
  let buf = '';
  child.stdout.on('data', (c) => {
    buf += c;
    for (let i = buf.indexOf('\n'); i >= 0; i = buf.indexOf('\n')) {
      const msg = JSON.parse(buf.slice(0, i));
      buf = buf.slice(i + 1);
      waiting.get(msg.id)?.(msg);
    }
  });
  let seq = 0;
  const rpc = (method, params) =>
    new Promise((resolve) => {
      const id = ++seq;
      waiting.set(id, resolve);
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
    });
  const call = async (name, args = {}) => {
    const r = await rpc('tools/call', { name, arguments: args });
    assert.ok(!r.result.isError, r.result.content[0].text);
    return JSON.parse(r.result.content[0].text);
  };

  try {
    const init = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {} });
    assert.equal(init.result.protocolVersion, '2025-06-18');
    assert.match(init.result.instructions, /English coach/);
    const tools = (await rpc('tools/list')).result.tools.map((t) => t.name);
    assert.deepEqual(tools, ['get_progress', 'list_rules', 'log_mistakes', 'get_drills', 'log_drill_result', 'flag_shaky', 'sync', 'connect']);

    // first call of the day syncs
    const p = await call('get_progress');
    assert.equal(p.connected, true);
    assert.equal(p.xp, 420);
    assert.equal(p.placement_level, 'B1');
    assert.deepEqual(p.shaky_rules, []);
    assert.equal(p.weakest_rules[0].id, 'a1_05');

    const rules = await call('list_rules', { level: 'A1', query: 'article' });
    assert.ok(rules.some((r) => r.startsWith('a1_05 |')), rules.join('\n'));

    // the third mistake, on a third day, makes the rule shaky — before any sync
    const logged = await call('log_mistakes', {
      mistakes: [
        { rule_id: 'a1_05', wrong: 'He bought car', correct: 'He bought a car', note: 'singular countable noun' },
        { rule_id: 'zz_99', wrong: 'x', correct: 'y' },
      ],
    });
    assert.equal(logged.logged[0].shaky, true);
    assert.deepEqual(logged.unknown_rule_ids, ['zz_99']);
    assert.equal(logged.waiting_for_sync, 1);
    assert.equal(patches.length, 0, 'nothing is uploaded between syncs');

    const round = await call('get_drills', { count: 3 });
    const drills = round.exercises;
    assert.ok(drills.length >= 1 && drills.every((d) => d.rule_id === 'a1_05' && d.answer && d.prompt));
    // without the item id an answer is only noted locally
    const loose = await call('log_drill_result', { rule_id: 'a1_05', correct: true });
    assert.equal(loose.counted_in_app, false);
    assert.equal(loose.waiting_for_sync, 1);
    // with it, every answer is real practice and the finished round is a session
    let last;
    for (const d of drills) {
      last = await call('log_drill_result', { rule_id: d.rule_id, item_id: d.item_id, correct: true });
      assert.equal(last.counted_in_app, true);
    }
    assert.ok(last.session_complete);
    assert.equal(last.waiting_for_sync, 1 + drills.length + 1);
    const again = await call('log_drill_result', { rule_id: 'a1_05', item_id: drills[0].item_id, correct: true });
    assert.equal(again.counted_in_app, false, 'an exercise counts once');

    const flagged = await call('flag_shaky', { rule_ids: ['a2_01', 'zz_99'], reason: 'avoids it' });
    assert.equal(flagged.flagged[0].shaky, true);
    assert.deepEqual(flagged.unknown_rule_ids, ['zz_99']);

    const synced = await call('sync');
    assert.equal(synced.uploaded_entries, drills.length + 3);
    assert.equal(synced.entries_waiting_for_sync, 0);
    assert.ok(synced.shaky_rules.some((r) => r.startsWith('a2_01')));
    assert.equal(patches.length, 1);
    const uploaded = parseClaudeDoc(patches[0].doc);
    assert.equal(uploaded.filter((e) => e.k === 'ok').length, drills.length);
    assert.equal(uploaded.filter((e) => e.k === 'session')[0].q, drills.length);
    assert.equal(uploaded.filter((e) => e.k === 'flag')[0].n, 'avoids it');
    const [id, entry] = Object.entries(patches[0].doc.m).find(([, e]) => e.w);
    assert.match(id, /^c[a-z0-9]+$/);
    assert.ok(patches[0].url.includes(`updateMask.fieldPaths=m.${id}`));
    assert.equal(entry.w, 'He bought car');
    assert.ok(entry.at > 0);
    // the app reads this document with the same parser
    assert.ok(uploaded.every((e) => e.k === 'session' || e.r));
    // local copy survives a restart
    const saved = JSON.parse(fs.readFileSync(path.join(home, 'data.json'), 'utf8'));
    assert.equal(saved.log.length, 2 + drills.length + 3);
    assert.equal(fs.statSync(path.join(home, 'data.json')).mode & 0o077, 0);
  } finally {
    child.kill();
    fake.close();
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('correct answers in a Claude drill move the exercise forward like answers in the app', () => {
  const t0 = Date.UTC(2026, 0, 10, 12);
  const ok = (i, t, at) => ({ id: `o${at}`, r: 'r1', w: '', c: '', t, at, k: 'ok', i });
  const state = { items: {}, shaky: {}, claudeAt: 0 };
  const a = applyClaudeMistakes(state, [ok('i1', t0, 1), ok('zz', t0, 2)], () => ['i1', 'i2'], t0);
  assert.deepEqual(a.items.i1, review(undefined, true, t0));
  assert.equal(a.items.zz, undefined, 'an exercise of another rule is ignored');
  assert.deepEqual(a.answers, [{ t: t0, correct: true }]);
  assert.equal(a.claudeAt, 2);
  // applied once
  assert.equal(applyClaudeMistakes(a, [ok('i1', t0, 1), ok('zz', t0, 2)], () => ['i1', 'i2'], t0), null);
  // correct answers are not evidence of a shaky rule
  assert.deepEqual(shakyRuleIds(a), []);
});

test('a wrong drill answer lapses the exercise that was answered', () => {
  const t0 = Date.UTC(2026, 0, 10, 12);
  const items = { i1: review(undefined, true, t0), i2: review(undefined, true, t0) };
  const wrong = { id: 'w1', r: 'r1', w: 'x', c: 'y', t: t0, at: 5, src: 'drill', i: 'i2' };
  const a = applyClaudeMistakes({ items, shaky: {}, claudeAt: 0 }, [wrong], () => ['i1', 'i2'], t0);
  assert.ok(inMistakeDeck(a.items.i2));
  assert.ok(!inMistakeDeck(a.items.i1));
  assert.deepEqual(a.answers, [{ t: t0, correct: false }]);
});

test('a rule flagged by Claude turns shaky at once and recovers through practice', () => {
  const t0 = Date.UTC(2026, 0, 10, 12);
  const ids = ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8'];
  const items = Object.fromEntries(ids.map((id) => [id, review(undefined, true, t0)]));
  const flag = { id: 'f1', r: 'r1', w: '', c: '', n: 'guesses', t: t0, at: 9, k: 'flag' };
  const a = applyClaudeMistakes({ items, shaky: {}, claudeAt: 0 }, [flag], () => ids, t0);
  assert.deepEqual(shakyRuleIds(a), ['r1']);
  assert.equal(a.shaky.r1.items.length, SHAKY_ITEMS);
  assert.deepEqual(a.answers, []);
  // three correct answers on three different days clear it
  let s = a;
  for (let d = 1; d <= 3; d++) {
    const its = { ...s.items };
    for (const id of s.shaky.r1.items) its[id] = review(its[id], true, t0 + d * 86_400_000);
    s = { ...s, items: its };
  }
  assert.deepEqual(shakyRuleIds(s), []);
});

test('Claude practice counts towards XP, the daily goal, the streak and sessions', () => {
  const t0 = Date.UTC(2026, 0, 10, 12);
  const base = emptyState();
  const answers = Array.from({ length: 3 }, () => ({ t: t0, correct: true }));
  answers.push({ t: t0, correct: false });
  const session = { id: 's1', r: '', w: '', c: '', t: t0, at: 3, k: 'session', q: 4, ok: 3 };
  const applied = applyClaudeMistakes({ items: {}, shaky: {}, claudeAt: 0 }, [session], () => [], t0);
  assert.deepEqual(applied.sessions, [t0]);
  const s = { ...base, settings: { ...base.settings, goal: 30 } };
  const out = creditClaudePractice(s, answers, applied.sessions);
  const day = Object.values(out.days)[0];
  assert.deepEqual([day.xp, day.n, day.c, day.s], [32, 4, 3, 1]);
  assert.equal(out.xp, base.xp + 32);
  assert.equal(out.streak.cur, 1);
  assert.equal(out.streak.last, dayNumber(t0));
  assert.equal(out.games.claude.plays, 1);
  // below the goal the streak does not move
  const few = creditClaudePractice(s, answers.slice(0, 2), []);
  assert.equal(few.streak.cur, base.streak.cur);
});
