import { writeFileSync } from 'node:fs';
import { DATA } from '../app/data/grammar';
import { MURPHY_DATA } from '../app/data/murphy';

const grammar: Record<string, unknown> = {};
for (const lvl of DATA) {
  for (const cat of lvl.categories) {
    for (const rule of cat.rules) {
      grammar[rule.id] = {
        text: rule.text,
        note: rule.note ?? '',
        exp: rule.exp ?? '',
        exc: rule.exc ?? '',
        tip: rule.tip ?? '',
        mistakes: rule.mistakes ?? [],
        markers: rule.markers ?? null,
        ex: rule.ex ?? [],
      };
    }
  }
}

const murphy: Record<string, unknown> = {};
for (const lvl of MURPHY_DATA) {
  for (const cat of lvl.categories) {
    for (const rule of cat.rules) {
      murphy[rule.id] = {
        text: rule.text,
        note: rule.note ?? '',
        exp: rule.exp ?? '',
        unitUrl: rule.unitUrl ?? '',
      };
    }
  }
}

writeFileSync(
  'app/i18n/generated/rule-source-ru.json',
  JSON.stringify({ grammar, murphy }, null, 2),
  'utf8',
);
console.log('grammar keys', Object.keys(grammar).length, 'murphy keys', Object.keys(murphy).length);
