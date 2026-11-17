/**
 * English Grammar Tree — local Claude connector (MCP server over stdio).
 *
 * Runs on the learner's computer, keeps a copy of their progress in a local file and syncs
 * with the app's Firestore once a day (first use of the day) or on request. No hosting.
 *
 * Bundled with the app's own practice code (scripts/build-mcp.mjs), so rule ids, exercises,
 * mastery and the "shaky" logic are exactly the app's.
 */
import readline from 'node:readline';
import enGrammar from '../../app/i18n/rules/en/grammar.json';
import {
  applyClaudeMistakes,
  cleanText,
  isMistake,
  isShaky,
  meetsShakyThreshold,
  parseClaudeDoc,
  ruleEvidence,
} from '../../app/practice/claude.ts';
import { getPracticeIndex } from '../../app/practice/items.ts';
import { dayNumber, inMistakeDeck, ruleMastery } from '../../app/practice/srs.ts';
import { levelFromXp, normalizeState, streakView } from '../../app/practice/store.ts';
import { topTraps } from '../../app/practice/trapStats.ts';
import { trapForRule } from '../../app/practice/traps.ts';
import { createCloud } from './cloud.js';
import { clearLocal, HOME, loadAuth, loadData, saveAuth, saveData } from './local.js';
import { startLogin } from './login.js';

const VERSION = '0.2.0';
const LANG = process.env.EGT_LANG === 'ru' ? 'ru' : 'en';
/** EGT_NO_TEXT=1: upload only which rule was broken, never what was written. */
const NO_TEXT = !!process.env.EGT_NO_TEXT;
const MAX_LOG = 400;
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TOPIC_TITLES = {
  w_false_friends: 'False friends (words that look like Russian ones)',
  w_collocations: 'Word partners (collocations: make/do, take a photo)',
  w_phrasal: 'Phrasal verbs',
  w_verb_prep: 'Verbs with prepositions (depend on, wait for)',
  w_polite: 'Sounding polite (too-direct requests)',
};

const INSTRUCTIONS = `English Grammar Tree is the user's English-learning app (grammar rules A1–C2, spaced repetition). The user connected it so that you act as their English coach in the background of every conversation, while still doing whatever they actually asked.

How to work:
1. In a conversation where the user writes in English, call get_progress once near the start (it is fast and local). Call list_rules once when you first need rule ids.
2. Always answer the user's real request first. Then, if their own message contained genuine English mistakes (grammar, word choice, collocations, articles, prepositions, tense — not typos, casual lowercase or missing full stops), add a short "English note": the corrected version and a one-line reason. At most 3 corrections per message; prefer rules marked shaky or weak.
3. Log every mistake you corrected with log_mistakes, choosing the closest rule_id. If nothing fits, skip logging rather than guess.
4. When log_mistakes or get_progress reports a rule as SHAKY (the user keeps breaking it in real writing even if the app shows it as done), say so plainly and offer a two-minute drill. Also remind them the app will make them retrain it.
5. Practice in chat is real practice. Whenever the user wants to train (or accepts a drill), call get_drills, ask the exercises one at a time without showing the answer, judge each reply, and report every result with log_drill_result including its item_id. Correct answers raise the rule in the app (leaves grow on their tree), wrong ones send the exercise back for review, and a finished round counts as a training session towards their daily goal and streak. Never report an answer the user did not give.
6. If you can see that the user does not really command a rule, even one the app shows as mastered (for example they get it right only by copying, avoid it, or explain it wrongly), mark it with flag_shaky and tell them why. Use it sparingly: for a single slip use log_mistakes instead.
7. Progress syncs with the app on the first use each day. Call sync only when the user asks to sync or says they have just practised in the app.
8. If the tools say the account is not connected, tell the user and offer to run connect.
Never lecture; keep notes brief, and stop correcting if the user asks you to.`;

// ---------------------------------------------------------------------------
// Catalogue (built from the app's own content)
// ---------------------------------------------------------------------------

const index = getPracticeIndex(LANG, { grammar: enGrammar, murphy: {} });

function strip(html) {
  return String(html ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const RULES = [...index.grammarOrder, ...index.wordsOrder].map((id) => {
  const meta = index.rules.get(id);
  const g = enGrammar[id];
  const title = TOPIC_TITLES[id] ?? strip(g?.text) ?? id;
  return {
    id,
    level: meta.track === 'words' ? 'words' : meta.levelId,
    title,
    example: strip(g?.note),
    trap: trapForRule(id, title) ?? null,
  };
});
const RULE = new Map(RULES.map((r) => [r.id, r]));

// ---------------------------------------------------------------------------
// Local state + sync
// ---------------------------------------------------------------------------

let auth = loadAuth();
let data = loadData(auth?.uid ?? null);

function allMistakes() {
  return [...data.log, ...data.pending];
}

/**
 * The downloaded progress with everything logged here already applied, exactly as the app will
 * apply it at the next sync, so Claude sees the result of a drill straight away.
 */
function viewState() {
  if (!data.state) return null;
  const now = Date.now();
  const waiting = data.pending.map((m) => ({ ...m, at: now }));
  const next = applyClaudeMistakes(data.state, [...data.log, ...waiting], (r) => index.byRule.get(r), now);
  return next ? { ...data.state, items: next.items, shaky: next.shaky } : data.state;
}

/** Exercises handed out by get_drills in this session: item id → { rule, round }. */
const issued = new Map();
let rounds = 0;
const roundStats = new Map();

async function sync() {
  if (!auth) throw new Error('Not connected. Run the connect tool first.');
  const cloud = createCloud(auth, saveAuth);
  const [stateDoc, claudeDoc] = await Promise.all([cloud.getDoc('state'), cloud.getDoc('claude')]);
  let remote = parseClaudeDoc(claudeDoc);
  const now = Date.now();
  const uploading = data.pending.map((m) => ({ ...m, at: now }));
  // keep the cloud log bounded: drop the oldest entries beyond MAX_LOG
  const overflow = Math.max(0, remote.length + uploading.length - MAX_LOG);
  const dropped = remote.slice(0, overflow);
  remote = remote.slice(overflow);
  if (uploading.length || dropped.length) {
    const m = {};
    for (const { id, ...rest } of uploading) m[id] = rest;
    const paths = [...uploading, ...dropped].map((x) => `m.${x.id}`);
    for (let i = 0; i < paths.length; i += 100) {
      await cloud.patchDoc('claude', { v: 1, updatedAt: now, m }, [
        'v',
        'updatedAt',
        ...paths.slice(i, i + 100),
      ]);
    }
  }
  data = {
    ...data,
    uid: auth.uid,
    state: stateDoc ? normalizeState(stateDoc) : null,
    log: [...remote, ...uploading],
    pending: [],
    syncedAt: now,
    syncDay: dayNumber(now),
  };
  saveData(data);
  return { uploaded: uploading.length };
}

/** Once a day, on first use. Never throws: the connector keeps working from the local copy. */
async function dailySync() {
  if (!auth || data.syncDay === dayNumber()) return null;
  try {
    await sync();
    return null;
  } catch (e) {
    return `Sync failed (${e.message}); using the local copy.`;
  }
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

function ruleView(id, state, all, now) {
  const items = state?.items ?? {};
  const m = ruleMastery(index.byRule.get(id), items, dayNumber(now));
  const entry = state?.shaky?.[id];
  const ev = ruleEvidence(all, id, entry?.t ?? 0, now);
  const shaky = isShaky(entry, items) || meetsShakyThreshold(ev);
  const mine = all.filter((x) => x.r === id && isMistake(x));
  const since30 = now - 30 * 86_400_000;
  return {
    id,
    level: RULE.get(id)?.level,
    title: RULE.get(id)?.title ?? id,
    stage: ['not started', 'started', 'learning', 'mastered', 'long-term'][m.stage],
    accuracy_in_app: m.accuracy === null ? null : Math.round(m.accuracy * 100),
    shaky,
    real_mistakes_30d: mine.filter((x) => x.t >= since30).length,
    recent_examples: mine
      .slice(-2)
      .filter((x) => x.w)
      .map((x) => `${x.w} → ${x.c}`),
    in_claude_drills: data.drills[id] ?? null,
    _score:
      (shaky ? 100 : 0) +
      mine.filter((x) => x.t >= since30).length * 5 +
      (m.wilting ? 3 : 0) +
      (m.accuracy !== null && m.seen >= 3 ? (1 - m.accuracy) * 10 : 0),
  };
}

function progress() {
  const now = Date.now();
  const state = viewState();
  const all = allMistakes();
  const views = RULES.map((r) => ruleView(r.id, state, all, now));
  const weak = views
    .filter((v) => v._score > 1)
    .sort((a, b) => b._score - a._score)
    .slice(0, 12)
    .map(({ _score, ...v }) => v);
  const levels = {};
  for (const lvl of LEVELS) {
    const ids = index.grammarOrder.filter((id) => index.rules.get(id).levelId === lvl);
    const mastered = views.filter(
      (v) => v.level === lvl && (v.stage === 'mastered' || v.stage === 'long-term') && !v.shaky,
    ).length;
    levels[lvl] = `${mastered}/${ids.length} rules mastered`;
  }
  const out = {
    connected: !!auth,
    last_sync: data.syncedAt ? new Date(data.syncedAt).toISOString() : 'never',
    entries_waiting_for_sync: data.pending.length,
    levels,
    shaky_rules: views.filter((v) => v.shaky).map((v) => `${v.id} — ${v.title}`),
    weakest_rules: weak,
  };
  if (state) {
    const s = streakView(state, dayNumber(now));
    out.placement_level = state.settings.placement ?? 'not taken';
    out.xp = state.xp;
    out.app_level = levelFromXp(state.xp).level;
    out.streak_days = s.current;
    out.practised_in_app_today = s.doneToday;
    out.items_in_mistake_deck = Object.values(state.items).filter(inMistakeDeck).length;
    out.top_traps = topTraps(index, state.items, 3).map((t) => ({
      trap: t.trap,
      accuracy: Math.round((t.correct / t.answers) * 100),
    }));
  } else {
    out.note = auth
      ? 'No practice data in the app yet.'
      : 'Not connected: progress is unknown. Offer to run connect.';
  }
  return out;
}

function shuffle(a) {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const TILE_TASKS = {
  question: 'Turn it into a question',
  negative: 'Make it negative',
  passive: 'Rewrite it in the passive',
  reported: 'Report what was said',
  wish: 'Express it with "I wish" / "If only"',
  inversion: 'Rewrite using inversion, starting with',
  cleft: 'Add emphasis with a cleft sentence',
  relative: 'Join the sentences with a relative clause',
  adjOrder: 'Put the adjectives in the right order',
  conditional: 'Rewrite as a conditional',
  tense: 'Rewrite it in',
  formal: 'Rewrite it in a formal register',
};

/** One exercise in a form Claude can ask in chat, or null when the item has none. */
function drillFrom(item, ruleId) {
  const base = { item_id: item.id, rule_id: ruleId };
  const picks = shuffle(item.variants);
  for (const v of picks) {
    const why = strip(v.why) || undefined;
    if (v.kind === 'choice' && !v.display && v.instr !== 'whichTense')
      return {
        ...base,
        task: 'Choose the right option',
        prompt: [v.context, v.prompt].filter(Boolean).join(' — '),
        options: shuffle(v.options),
        answer: v.options[0],
        why,
      };
    if (v.kind === 'translate')
      return { ...base, task: 'Translate into English', prompt: v.source, answer: v.answer, why };
    if (v.kind === 'type' && !v.say && v.prompt)
      return { ...base, task: 'Type the answer', prompt: v.prompt, answer: v.answer, why };
    if (v.kind === 'tiles' && TILE_TASKS[v.task] && v.source)
      return {
        ...base,
        task: `${TILE_TASKS[v.task]}${v.param ? ` ${v.param}` : ''}`,
        prompt: v.source,
        answer: v.answer,
        why,
      };
    if (v.kind === 'truefalse' && !v.correct && v.fix)
      return {
        ...base,
        task: 'Find and fix the mistake',
        prompt: v.sentence,
        answer: v.fix,
        why,
      };
  }
  return null;
}

function drills(ruleId, count) {
  const items = viewState()?.items ?? {};
  let ruleIds;
  if (ruleId) ruleIds = [ruleId];
  else {
    const p = progress();
    ruleIds = [
      ...new Set([...p.shaky_rules.map((s) => s.split(' — ')[0]), ...p.weakest_rules.map((r) => r.id)]),
    ].slice(0, 3);
  }
  const out = [];
  const per = Math.max(1, Math.ceil(count / Math.max(1, ruleIds.length)));
  for (const r of ruleIds) {
    const ids = shuffle(index.byRule.get(r) ?? []).sort(
      (a, b) => Number(inMistakeDeck(items[b])) - Number(inMistakeDeck(items[a])),
    );
    let n = 0;
    for (const id of ids) {
      if (n >= per || out.length >= count) break;
      const d = drillFrom(index.items.get(id), r);
      if (d) {
        out.push(d);
        n++;
      }
    }
  }
  return out;
}

function newId() {
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function addMistake(ruleId, wrong, correct, note, src, itemId) {
  data.pending.push({
    id: newId(),
    r: ruleId,
    w: NO_TEXT ? '' : cleanText(wrong),
    c: NO_TEXT ? '' : cleanText(correct),
    ...(note && !NO_TEXT ? { n: cleanText(note) } : {}),
    t: Date.now(),
    at: 0,
    ...(src === 'drill' ? { src: 'drill' } : {}),
    ...(itemId ? { i: itemId } : {}),
  });
}

/** A non-mistake entry: a correct drill answer, a shaky flag or a finished round. */
function addEvent(event) {
  data.pending.push({ id: newId(), r: '', w: '', c: '', t: Date.now(), at: 0, ...event });
}

function ruleStatus(ruleId) {
  const { _score, ...v } = ruleView(ruleId, viewState(), allMistakes(), Date.now());
  return v;
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: 'get_progress',
    description:
      "The user's English Grammar Tree progress: CEFR level, streak, mastery per level, shaky rules (rules they keep breaking in real writing), weakest rules with their own recent mistakes, and top interference traps. Local and fast; syncs with the app on the first call each day.",
    inputSchema: { type: 'object', properties: {} },
    run: async () => {
      const warn = await dailySync();
      return { ...(warn ? { warning: warn } : {}), ...progress() };
    },
  },
  {
    name: 'list_rules',
    description:
      'The rule catalogue (id, level, title, example, trap) used to attribute mistakes. Optional filters: level (A1…C2 or "words") and a text query.',
    inputSchema: {
      type: 'object',
      properties: {
        level: { type: 'string', enum: [...LEVELS, 'words'] },
        query: { type: 'string', description: 'words to look for in the title or example' },
      },
    },
    run: async ({ level, query }) => {
      const words = String(query ?? '')
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
      return RULES.filter(
        (r) =>
          (!level || r.level === level) &&
          words.every((w) => `${r.title} ${r.example} ${r.trap ?? ''}`.toLowerCase().includes(w)),
      ).map((r) => `${r.id} | ${r.level} | ${r.title}${r.example ? ` — ${r.example}` : ''}`);
    },
  },
  {
    name: 'log_mistakes',
    description:
      "Record English mistakes the user made in their own messages, each attributed to one rule. Stored locally and uploaded to the app at the next sync, where repeated mistakes mark the rule as shaky and force retraining. Returns each rule's status so you can tell the user when a rule has become shaky.",
    inputSchema: {
      type: 'object',
      properties: {
        mistakes: {
          type: 'array',
          minItems: 1,
          maxItems: 10,
          items: {
            type: 'object',
            properties: {
              rule_id: { type: 'string', description: 'id from list_rules' },
              wrong: { type: 'string', description: 'what the user wrote (the sentence or clause)' },
              correct: { type: 'string', description: 'the corrected version' },
              note: { type: 'string', description: 'one short line on why' },
            },
            required: ['rule_id', 'wrong', 'correct'],
          },
        },
      },
      required: ['mistakes'],
    },
    run: async ({ mistakes }) => {
      const warn = await dailySync();
      const logged = new Set();
      const unknown = [];
      for (const m of Array.isArray(mistakes) ? mistakes.slice(0, 10) : []) {
        if (!RULE.has(m?.rule_id)) {
          unknown.push(String(m?.rule_id));
          continue;
        }
        addMistake(m.rule_id, m.wrong, m.correct, m.note, 'chat');
        logged.add(m.rule_id);
      }
      saveData(data);
      return {
        ...(warn ? { warning: warn } : {}),
        logged: [...logged].map(ruleStatus),
        ...(unknown.length ? { unknown_rule_ids: unknown, hint: 'Use ids from list_rules.' } : {}),
        waiting_for_sync: data.pending.length,
      };
    },
  },
  {
    name: 'get_drills',
    description:
      "Exercises from the app for one rule, or (without rule_id) for the user's shaky and weakest rules. Each has the expected answer: ask them one at a time and do not reveal the answer before the user replies.",
    inputSchema: {
      type: 'object',
      properties: {
        rule_id: { type: 'string' },
        count: { type: 'integer', minimum: 1, maximum: 10, default: 5 },
      },
    },
    run: async ({ rule_id, count }) => {
      await dailySync();
      if (rule_id && !RULE.has(rule_id)) return { error: 'Unknown rule_id. Use ids from list_rules.' };
      const list = drills(rule_id, Math.min(10, Math.max(1, Number(count) || 5)));
      if (!list.length) return { note: 'No ready-made exercises for this rule; write your own.' };
      const round = ++rounds;
      roundStats.set(round, { total: list.length, answered: 0, correct: 0 });
      for (const d of list) issued.set(d.item_id, { rule: d.rule_id, round });
      return {
        how: 'Ask one at a time, hide the answer, then call log_drill_result with the item_id for each reply.',
        exercises: list,
      };
    },
  },
  {
    name: 'log_drill_result',
    description:
      "Report how the user answered one exercise from get_drills. With its item_id the answer counts as real practice in the app: a correct answer moves the exercise forward (the rule's leaves grow), a wrong one sends it back for review and is logged as a mistake. When every exercise of a round is answered, the round counts as a training session towards the daily goal and streak.",
    inputSchema: {
      type: 'object',
      properties: {
        rule_id: { type: 'string' },
        item_id: { type: 'string', description: 'item_id of the exercise from get_drills' },
        correct: { type: 'boolean' },
        user_answer: { type: 'string' },
        expected: { type: 'string' },
      },
      required: ['rule_id', 'correct'],
    },
    run: async ({ rule_id, item_id, correct, user_answer, expected }) => {
      if (!RULE.has(rule_id)) return { error: 'Unknown rule_id. Use ids from list_rules.' };
      const d = data.drills[rule_id] ?? { n: 0, c: 0, t: 0 };
      data.drills[rule_id] = { n: d.n + 1, c: d.c + (correct ? 1 : 0), t: Date.now() };
      // only exercises handed out in this session, answered once, count as practice in the app
      const given = item_id ? issued.get(item_id) : null;
      const counted = !!given && given.rule === rule_id;
      let sessionDone = false;
      if (counted) {
        issued.delete(item_id);
        if (correct) addEvent({ k: 'ok', r: rule_id, i: item_id });
        const stats = roundStats.get(given.round);
        if (stats) {
          stats.answered += 1;
          if (correct) stats.correct += 1;
          if (stats.answered >= stats.total) {
            addEvent({ k: 'session', q: stats.total, ok: stats.correct });
            roundStats.delete(given.round);
            sessionDone = true;
          }
        }
      }
      if (!correct) addMistake(rule_id, user_answer, expected, undefined, 'drill', counted ? item_id : null);
      saveData(data);
      return {
        ...ruleStatus(rule_id),
        counted_in_app: counted,
        ...(counted ? {} : { note: 'Not counted as app practice: pass the item_id of an exercise from get_drills, once.' }),
        ...(sessionDone ? { session_complete: 'This round counts as a training session in the app after the next sync.' } : {}),
        waiting_for_sync: data.pending.length,
      };
    },
  },
  {
    name: 'flag_shaky',
    description:
      "Mark rules as shaky because the user clearly does not command them, even if the app shows them as learned. The app then yellows the rule on the tree, takes its level out of full bloom and makes the user retrain it until they answer its exercises correctly on three different days. Use for a real, repeated weakness you can explain; for a single slip use log_mistakes.",
    inputSchema: {
      type: 'object',
      properties: {
        rule_ids: { type: 'array', minItems: 1, maxItems: 5, items: { type: 'string' } },
        reason: { type: 'string', description: 'one short line the user will see in the app' },
      },
      required: ['rule_ids', 'reason'],
    },
    run: async ({ rule_ids, reason }) => {
      const warn = await dailySync();
      const flagged = [];
      const unknown = [];
      for (const id of Array.isArray(rule_ids) ? rule_ids.slice(0, 5) : []) {
        if (!RULE.has(id)) {
          unknown.push(String(id));
          continue;
        }
        addEvent({ k: 'flag', r: id, ...(NO_TEXT ? {} : { n: cleanText(reason) }) });
        flagged.push(id);
      }
      saveData(data);
      return {
        ...(warn ? { warning: warn } : {}),
        flagged: flagged.map(ruleStatus),
        ...(unknown.length ? { unknown_rule_ids: unknown, hint: 'Use ids from list_rules.' } : {}),
        waiting_for_sync: data.pending.length,
      };
    },
  },
  {
    name: 'sync',
    description:
      'Sync with the app now: download the latest practice progress and upload mistakes logged here. Happens automatically on the first use each day; call this only when the user asks.',
    inputSchema: { type: 'object', properties: {} },
    run: async () => {
      const r = await sync();
      return { synced: true, uploaded_entries: r.uploaded, ...progress() };
    },
  },
  {
    name: 'connect',
    description:
      "Sign in to the user's English Grammar Tree account: opens the app in their browser, where they click Allow. Needed once per computer. Pass disconnect=true to sign out and delete the local copy.",
    inputSchema: {
      type: 'object',
      properties: { disconnect: { type: 'boolean' } },
    },
    run: async ({ disconnect }) => {
      if (disconnect) {
        clearLocal();
        auth = null;
        data = loadData(null);
        return { connected: false, note: `Signed out; local files in ${HOME} deleted.` };
      }
      const login = startLogin();
      const url = await login.url;
      const result = await Promise.race([
        login.done,
        new Promise((resolve) => setTimeout(() => resolve('waiting'), 45_000)),
      ]);
      if (result === 'waiting')
        return {
          connected: false,
          note: 'Waiting for the user to click Allow in the browser. If the page did not open, give them this link. Then call connect again.',
          url,
        };
      if (!result) return { connected: false, note: 'Timed out. Call connect again.' };
      auth = result;
      saveAuth(auth);
      data = loadData(auth.uid);
      try {
        await sync();
      } catch (e) {
        return { connected: true, warning: `Signed in, but the first sync failed: ${e.message}` };
      }
      return { connected: true, ...progress() };
    },
  },
];

// ---------------------------------------------------------------------------
// MCP over stdio (JSON-RPC 2.0, one message per line)
// ---------------------------------------------------------------------------

const PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05'];

function send(msg) {
  process.stdout.write(`${JSON.stringify(msg)}\n`);
}

async function handle(msg) {
  const { id, method, params } = msg;
  if (id === undefined || id === null) return; // notification
  const ok = (result) => send({ jsonrpc: '2.0', id, result });
  try {
    if (method === 'initialize') {
      const asked = params?.protocolVersion;
      ok({
        protocolVersion: PROTOCOLS.includes(asked) ? asked : PROTOCOLS[0],
        capabilities: { tools: {} },
        serverInfo: { name: 'english-grammar-tree', version: VERSION },
        instructions: INSTRUCTIONS,
      });
    } else if (method === 'ping') {
      ok({});
    } else if (method === 'tools/list') {
      ok({ tools: TOOLS.map(({ run, ...t }) => t) });
    } else if (method === 'tools/call') {
      const tool = TOOLS.find((t) => t.name === params?.name);
      if (!tool) {
        send({ jsonrpc: '2.0', id, error: { code: -32602, message: `Unknown tool: ${params?.name}` } });
        return;
      }
      try {
        const result = await tool.run(params.arguments ?? {});
        ok({ content: [{ type: 'text', text: JSON.stringify(result, null, 1) }] });
      } catch (e) {
        ok({ content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true });
      }
    } else {
      send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
    }
  } catch (e) {
    send({ jsonrpc: '2.0', id, error: { code: -32603, message: String(e?.message ?? e) } });
  }
}

let queue = Promise.resolve();
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
  if (!line.trim()) return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
    return;
  }
  // one at a time: tools share the local file
  queue = queue.then(() => handle(msg));
});
rl.on('close', () => queue.then(() => process.exit(0)));
