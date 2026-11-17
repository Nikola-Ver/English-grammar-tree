#!/usr/bin/env node
/**
 * Validates hand-authored practice content in app/practice/content/*.ts.
 * Usage: node scripts/validate-practice-content.mjs [file ...]
 * (Node ≥ 23.6 strips TypeScript types natively.)
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const contentDir = path.join(root, 'app/practice/content');
const grammarSrc = fs.readFileSync(path.join(root, 'app/data/grammar.ts'), 'utf8');
const RULE_IDS = new Set([...grammarSrc.matchAll(/id: '([abc][12]_\w+)'/g)].map((m) => m[1]));
const TOPIC_IDS = new Set(['w_false_friends', 'w_collocations', 'w_phrasal', 'w_verb_prep', 'w_polite']);
const TRAPS = new Set([
  'articles',
  'toBe',
  'tenses',
  'futureTime',
  'wordOrder',
  'prepositions',
  'countable',
  'conditionals',
  'verbPatterns',
  'modals',
  'sequence',
  'falseFriends',
  'collocations',
  'phrasal',
  'politeness',
]);
const TENSES = new Set([
  'present_simple',
  'present_continuous',
  'present_perfect',
  'present_perfect_continuous',
  'past_simple',
  'past_continuous',
  'past_perfect',
  'past_perfect_continuous',
  'future_will',
  'future_going_to',
  'future_continuous',
  'future_perfect',
]);
const TASKS = new Set([
  'build',
  'question',
  'negative',
  'passive',
  'reported',
  'wish',
  'inversion',
  'cleft',
  'relative',
  'adjOrder',
  'conditional',
  'tense',
  'formal',
]);

const files = process.argv.slice(2).length
  ? process.argv.slice(2).map((f) => path.resolve(f))
  : fs
      .readdirSync(contentDir)
      .filter((f) => f.endsWith('.ts') && !['types.ts', 'index.ts', 'topics.ts'].includes(f))
      .map((f) => path.join(contentDir, f));

const allIds = new Map();
let errors = 0;
let count = 0;
function err(file, id, msg) {
  errors++;
  console.error(`✗ ${path.basename(file)} ${id ?? ''}: ${msg}`);
}
const isStr = (s) => typeof s === 'string' && s.trim().length > 0;
const hasCyrillic = (s) => /[Ѐ-ӿ]/.test(s);

function checkL10n(file, id, v, field) {
  if (v === undefined) return;
  if (!v || !isStr(v.en) || !isStr(v.ru)) return err(file, id, `${field} needs en + ru`);
  if (hasCyrillic(v.en)) err(file, id, `${field}.en contains Cyrillic`);
  if (!hasCyrillic(v.ru)) err(file, id, `${field}.ru has no Cyrillic`);
  if (field === 'why' && (v.en.length > 200 || v.ru.length > 220))
    err(file, id, 'why is too long');
}
function checkEnglish(file, id, s, field) {
  if (!isStr(s)) return err(file, id, `${field} is empty`);
  if (hasCyrillic(s)) err(file, id, `${field} contains Cyrillic`);
}
function checkRules(file, id, rules) {
  if (!Array.isArray(rules) || rules.length === 0) return err(file, id, 'rules[] is empty');
  for (const r of rules) if (!RULE_IDS.has(r) && !TOPIC_IDS.has(r)) err(file, id, `unknown rule id ${r}`);
}
function checkId(file, id) {
  if (!isStr(id)) return err(file, id, 'missing id');
  if (allIds.has(id)) err(file, id, `duplicate id (also in ${allIds.get(id)})`);
  allIds.set(id, path.basename(file));
}

function checkSeed(file, s) {
  const id = s.id;
  checkId(file, id);
  checkRules(file, id, s.rules);
  checkL10n(file, id, s.why, 'why');
  if (s.title) checkL10n(file, id, s.title, 'title');
  if (s.trap !== undefined && !TRAPS.has(s.trap)) err(file, id, `unknown trap ${s.trap}`);
  switch (s.kind) {
    case 'translate': {
      if (!isStr(s.ru) || !hasCyrillic(s.ru)) err(file, id, 'ru must be Russian');
      checkEnglish(file, id, s.en, 'en');
      for (const a of s.alts ?? []) checkEnglish(file, id, a, 'alt');
      if (!s.why) err(file, id, 'translate needs why');
      if (!TRAPS.has(s.trap)) err(file, id, 'translate needs a valid trap');
      const n = (s.en ?? '').split(/\s+/).length;
      if (n < 2 || n > 16) err(file, id, `en has ${n} words (2–16)`);
      break;
    }
    case 'choice': {
      checkEnglish(file, id, s.prompt, 'prompt');
      if (s.context) checkEnglish(file, id, s.context, 'context');
      if (!Array.isArray(s.options) || s.options.length < 2 || s.options.length > 4)
        err(file, id, 'options must have 2–4 entries');
      else if (new Set(s.options.map((o) => o.trim().toLowerCase())).size !== s.options.length)
        err(file, id, 'options not distinct');
      for (const o of s.options ?? []) checkEnglish(file, id, o, 'option');
      if (!s.prompt.includes('___') && !s.prompt.trim().endsWith('?') && !s.context)
        err(file, id, 'prompt needs ___ gap, a question, or a context');
      break;
    }
    case 'tiles': {
      if (!TASKS.has(s.task)) err(file, id, `unknown task ${s.task}`);
      checkEnglish(file, id, s.source, 'source');
      checkEnglish(file, id, s.answer, 'answer');
      if (/\s{2,}/.test(s.answer)) err(file, id, 'answer has double spaces');
      const tiles = s.answer.split(' ');
      if (tiles.length < 3 || tiles.length > 16) err(file, id, `answer has ${tiles.length} tiles`);
      for (const a of s.alts ?? []) {
        const at = a.split(' ').sort().join(' ');
        if (at !== [...tiles].sort().join(' ')) err(file, id, `alt "${a}" uses different tiles`);
      }
      for (const x of s.extra ?? []) if (tiles.includes(x)) err(file, id, `extra tile "${x}" is in answer`);
      if ((s.task === 'tense' || s.task === 'inversion') && !isStr(s.param))
        err(file, id, `${s.task} task needs param`);
      if (s.answer.trim() === s.source.trim()) err(file, id, 'answer equals source');
      break;
    }
    case 'sort': {
      if (!s.title) err(file, id, 'sort needs title');
      if (!Array.isArray(s.buckets) || s.buckets.length < 2 || s.buckets.length > 4)
        err(file, id, 'buckets must have 2–4 entries');
      if (!Array.isArray(s.items) || s.items.length < 5 || s.items.length > 12)
        err(file, id, 'items must have 5–12 entries');
      for (const [t, b] of s.items ?? []) {
        checkEnglish(file, id, t, 'item');
        if (!Number.isInteger(b) || b < 0 || b >= s.buckets.length) err(file, id, `bad bucket for "${t}"`);
      }
      const used = new Set((s.items ?? []).map((i) => i[1]));
      if (used.size < 2) err(file, id, 'items use fewer than 2 buckets');
      break;
    }
    case 'match': {
      if (!s.title) err(file, id, 'match needs title');
      if (!Array.isArray(s.pairs) || s.pairs.length < 4 || s.pairs.length > 6)
        err(file, id, 'pairs must have 4–6 entries');
      const rights = new Set();
      for (const [l, r] of s.pairs ?? []) {
        checkEnglish(file, id, l, 'left');
        checkEnglish(file, id, r, 'right');
        if (rights.has(r)) err(file, id, `duplicate right "${r}"`);
        rights.add(r);
      }
      break;
    }
    case 'gaps': {
      if (!s.title) err(file, id, 'gaps needs title');
      if (!Array.isArray(s.options) || s.options.length < 2) err(file, id, 'options needed');
      checkEnglish(file, id, s.text, 'text');
      const gaps = [...s.text.matchAll(/\{([^}]*)\}/g)].map((m) => m[1]);
      if (gaps.length < 3 || gaps.length > 14) err(file, id, `text has ${gaps.length} gaps (3–14)`);
      for (const g of gaps) if (!s.options.includes(g)) err(file, id, `gap {${g}} not in options`);
      break;
    }
    case 'type': {
      checkEnglish(file, id, s.prompt, 'prompt');
      checkEnglish(file, id, s.answer, 'answer');
      break;
    }
    default:
      err(file, id, `unknown kind ${s.kind}`);
  }
}

for (const file of files) {
  const mod = await import(pathToFileURL(file).href);
  for (const [name, value] of Object.entries(mod)) {
    if (!Array.isArray(value)) continue;
    for (const item of value) {
      count++;
      if (Array.isArray(item) && item.length === 4 && item.every((x) => typeof x === 'string')) {
        // IrregularVerb
        const [v1, v2, v3, ru] = item;
        checkId(file, `verb:${v1}`);
        for (const v of [v1, v2, v3]) checkEnglish(file, v1, v, 'verb form');
        if (!hasCyrillic(ru)) err(file, v1, 'ru gloss missing');
      } else if (item && typeof item === 'object' && 'tense' in item) {
        checkId(file, item.id);
        checkEnglish(file, item.id, item.text, 'text');
        if (!TENSES.has(item.tense)) err(file, item.id, `unknown tense ${item.tense}`);
        checkRules(file, item.id, item.rules);
      } else if (item && typeof item === 'object' && 'kind' in item) {
        checkSeed(file, item);
      } else {
        err(file, name, 'unrecognised item shape');
      }
    }
  }
}

// "Почему по-русски иначе" notes
const contrastDir = path.join(contentDir, 'contrast');
let contrastCount = 0;
if (fs.existsSync(contrastDir) && process.argv.slice(2).length === 0) {
  files.push(...fs.readdirSync(contrastDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts').map((f) => path.join(contrastDir, f)));
}
for (const file of files.filter((f) => f.includes(`${path.sep}contrast${path.sep}`))) {
  const mod = await import(pathToFileURL(file).href);
  for (const value of Object.values(mod)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    for (const [ruleId, c] of Object.entries(value)) {
      contrastCount++;
      const id = `contrast:${ruleId}`;
      if (!RULE_IDS.has(ruleId)) err(file, id, 'unknown rule id');
      if (!isStr(c.ru) || !hasCyrillic(c.ru)) err(file, id, 'ru must be Russian');
      if (!isStr(c.en) || hasCyrillic(c.en)) err(file, id, 'en must be English');
      if (!TRAPS.has(c.trap)) err(file, id, `unknown trap ${c.trap}`);
      if (!Array.isArray(c.pairs) || c.pairs.length < 1 || c.pairs.length > 4) err(file, id, 'pairs must have 1–4 entries');
      for (const p of c.pairs ?? []) {
        if (!hasCyrillic(p.ru ?? '')) err(file, id, 'pair.ru must be Russian');
        checkEnglish(file, id, p.calque, 'pair.calque');
        checkEnglish(file, id, p.en, 'pair.en');
        if ((p.calque ?? '').trim() === (p.en ?? '').trim()) err(file, id, 'calque equals en');
      }
      if ((c.ru ?? '').length > 520 || (c.en ?? '').length > 520) err(file, id, 'note too long');
    }
  }
}
if (contrastCount) console.log(`  ${contrastCount} contrast notes`);

console.log(`${errors ? '✗' : '✓'} ${count} items in ${files.length} file(s), ${errors} error(s)`);
process.exit(errors ? 1 : 0);
