#!/usr/bin/env node
/**
 * Restores English examples that machine translation wrongly translated in
 * app/i18n/rules/<lang>/{grammar,murphy}.json.
 *
 * The Russian source (app/data/grammar.ts, app/data/murphy/levels.ts) is authoritative:
 * any part of a source string that contains no Cyrillic is English learning material
 * (an example, a form, a wrong sentence) and must stay English in every UI language.
 *
 * Repair levels, per string field:
 *  1. Source has no Cyrillic at all            → copy the source string verbatim.
 *  2. Split on separators (→, —, –, ":", <br>)  → if segment counts match, restore every
 *                                                 English-only source segment.
 *  3. Inline tags (<em>, <s>, <code>, <u>, <strong>, <b>, <i>) → if the per-tag counts match,
 *                                                 restore every English-only tag content.
 *
 * Usage: node scripts/repair-localized-rules.mjs [--check]
 *   --check  report only; exit 1 if anything would change.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const checkOnly = process.argv.includes('--check');
const verbose = process.argv.includes('--verbose');
const LANGS = ['en', 'de', 'es', 'fr', 'zh'];
const CYR = /[Ѐ-ӿ]/;

const { DATA } = await import(pathToFileURL(path.join(root, 'app/data/grammar.ts')).href);
const levels = await import(pathToFileURL(path.join(root, 'app/data/murphy/levels.ts')).href);
const MURPHY = Object.values(levels).filter((v) => v && typeof v === 'object' && 'categories' in v);

function indexRules(levelsArr) {
  const map = new Map();
  for (const lvl of levelsArr) for (const c of lvl.categories) for (const r of c.rules) map.set(r.id, r);
  return map;
}
const SOURCES = { grammar: indexRules(DATA), murphy: indexRules(MURPHY) };

const SEP_FINE = /(\s*→\s*|\s+[—–]\s+|:\s+|<br\s*\/?>|\s+\(|\)\s*)/;
const SEP = /(\s*→\s*|\s+[—–]\s+|:\s+|<br\s*\/?>)/;
const TAGS = ['em', 's', 'code', 'u', 'strong', 'b', 'i'];
const english = (s) => !CYR.test(s);

function repairTags(src, loc) {
  let out = loc;
  for (const tag of TAGS) {
    const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g');
    const s = [...src.matchAll(re)].map((m) => m[1]);
    const l = [...out.matchAll(re)].map((m) => m[1]);
    if (s.length === 0 || s.length !== l.length) continue;
    let k = 0;
    out = out.replace(re, (whole) => {
      const i = k++;
      return english(s[i]) && s[i] !== l[i] ? `<${tag}>${s[i]}</${tag}>` : whole;
    });
  }
  return out;
}

function repairString(src, loc, fine = true) {
  if (typeof src !== 'string' || typeof loc !== 'string') return loc;
  if (!src.trim()) return loc;
  if (english(src)) return src;
  let sp = fine ? src.split(SEP_FINE) : [];
  let lp = fine ? loc.split(SEP_FINE) : [null];
  if (sp.length !== lp.length) {
    sp = src.split(SEP);
    lp = loc.split(SEP);
  }
  let out = loc;
  if (sp.length === lp.length && sp.length > 1) {
    out = lp
      .map((seg, i) => {
        if (i % 2 === 1) return seg; // separator
        const s = sp[i];
        if (s.trim() && english(s)) return s;
        return repairTags(s, seg);
      })
      .join('');
  } else {
    out = repairTags(src, loc);
  }
  return out;
}

function repairArray(src, loc) {
  if (!Array.isArray(src) || !Array.isArray(loc) || src.length !== loc.length) return loc;
  return loc.map((l, i) => repairString(src[i], l));
}

let totalChanged = 0;
for (const lang of LANGS) {
  for (const kind of ['grammar', 'murphy']) {
    const file = path.join(root, `app/i18n/rules/${lang}/${kind}.json`);
    const bundle = JSON.parse(fs.readFileSync(file, 'utf8'));
    let changed = 0;
    const bump = (a, b) => {
      if (JSON.stringify(a) === JSON.stringify(b)) return;
      changed++;
      if (verbose) console.log(`  - ${JSON.stringify(a).slice(0, 240)}\n  + ${JSON.stringify(b).slice(0, 240)}`);
    };
    for (const [id, entry] of Object.entries(bundle)) {
      const src = SOURCES[kind].get(id);
      if (!src) continue;
      for (const f of ['text', 'note', 'exp', 'exc', 'tip']) {
        if (typeof entry[f] !== 'string') continue;
        // Long prose: parentheses are too frequent to align reliably — split on → / — / : / <br> only.
        const next = repairString(src[f] ?? '', entry[f], f === 'text' || f === 'note');
        bump(entry[f], next);
        entry[f] = next;
      }
      if (entry.mistakes) {
        const next = repairArray(src.mistakes ?? [], entry.mistakes);
        bump(entry.mistakes, next);
        entry.mistakes = next;
      }
      if (entry.markers && src.markers) {
        const tags = repairArray(src.markers.tags ?? [], entry.markers.tags ?? []);
        bump(entry.markers.tags, tags);
        entry.markers.tags = tags;
        if (typeof entry.markers.note === 'string') {
          const n = repairString(src.markers.note ?? '', entry.markers.note);
          bump(entry.markers.note, n);
          entry.markers.note = n;
        }
      }
      if (Array.isArray(entry.ex) && Array.isArray(src.ex) && entry.ex.length === src.ex.length) {
        const next = entry.ex.map((pair, i) => [src.ex[i][0], pair[1]]);
        bump(entry.ex, next);
        entry.ex = next;
      }
    }
    totalChanged += changed;
    console.log(`${lang}/${kind}: ${changed} field(s) ${checkOnly ? 'would change' : 'repaired'}`);
    if (!checkOnly && changed) {
      const nl = fs.readFileSync(file, 'utf8').endsWith('\n') ? '\n' : '';
      fs.writeFileSync(file, JSON.stringify(bundle, null, 2) + nl);
    }
  }
}
if (checkOnly && totalChanged) process.exit(1);
