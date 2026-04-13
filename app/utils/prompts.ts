import type { TFunction } from 'i18next';
import type { Category, Level, Rule } from '../data/grammar';
import i18n from '../i18n/config';
import { normalizeUiLang } from '../i18n/localizeRules';

/** Fixed translator for `aiPrompt.*` strings in the given UI language. */
function pt(lang: string): TFunction {
  return i18n.getFixedT(normalizeUiLang(lang), 'translation');
}

export function buildMurphyRulePrompt(
  lang: string,
  rule: Rule,
  level: Level,
  category: Category,
): string {
  const t = pt(lang);
  let prompt = t('aiPrompt.murphyRuleOpen', { level: level.name, category: category.name });
  prompt += t('aiPrompt.unit', { text: rule.text });
  if (rule.note) prompt += t('aiPrompt.hint', { note: rule.note });
  if (rule.unitUrl) prompt += t('aiPrompt.source', { url: rule.unitUrl });
  prompt += `\n${t('aiPrompt.deepTitle')}${t('aiPrompt.deep1')}${t('aiPrompt.deep2')}${t('aiPrompt.deep3')}${t('aiPrompt.deep4')}${t('aiPrompt.deep5')}`;
  return prompt;
}

export function buildMurphyGlobalTestPrompt(
  lang: string,
  doneRules: { rule: Rule; level: Level; category: Category }[],
): string {
  const t = pt(lang);
  const ruleList = doneRules
    .map(
      (item, idx) => `${idx + 1}. [${item.level.name} — ${item.category.name}] ${item.rule.text}`,
    )
    .join('\n');

  let prompt = t('aiPrompt.murphyGlobalIntro');
  prompt += `${ruleList}\n\n`;
  prompt += t('aiPrompt.murphyGlobalTitle');
  prompt += `${t('aiPrompt.glob1')}${t('aiPrompt.glob2')}${t('aiPrompt.glob3')}${t('aiPrompt.glob4')}${t('aiPrompt.glob5')}`;
  prompt += t('aiPrompt.murphyGlobalFooter');
  return prompt;
}

export function buildRulePrompt(
  lang: string,
  rule: Rule,
  level: Level,
  category: Category,
): string {
  const t = pt(lang);
  let prompt = t('aiPrompt.grammarRuleOpen', { level: level.name, category: category.name });
  prompt += t('aiPrompt.rule', { text: rule.text });
  if (rule.note) prompt += t('aiPrompt.hint', { note: rule.note });
  prompt += `\n${t('aiPrompt.deepTitle')}${t('aiPrompt.deep1')}${t('aiPrompt.deep2')}${t('aiPrompt.deep3')}${t('aiPrompt.deep4')}${t('aiPrompt.deep5')}`;
  return prompt;
}

interface DoneRule {
  rule: Rule;
  level: Level;
  category: Category;
}

function rulesWithExplanations(category: Category) {
  return category.rules.filter((r) => r.exp);
}

/** Quiz prompt for every rule in the category that has an explanation (same scope as per-rule ✦ Quiz). */
export function buildCategoryTestPrompt(
  lang: string,
  level: Level,
  category: Category,
): string | null {
  const t = pt(lang);
  const rules = rulesWithExplanations(category);
  if (rules.length === 0) return null;

  const ruleList = rules
    .map((r, idx) => {
      let line = `${idx + 1}. «${r.text}»`;
      if (r.note) line += ` — ${r.note}`;
      return line;
    })
    .join('\n');

  let prompt = t('aiPrompt.catGrammarOpen', { level: level.name, category: category.name });
  prompt += `${t('aiPrompt.catGrammarList')}${ruleList}\n\n`;
  prompt += t('aiPrompt.catGrammarTitle');
  prompt += `${t('aiPrompt.cat1')}${t('aiPrompt.cat2')}${t('aiPrompt.cat3')}${t('aiPrompt.cat4')}${t('aiPrompt.cat5')}`;
  prompt += t('aiPrompt.catFooter');
  return prompt;
}

/** Murphy: same idea as buildCategoryTestPrompt, with book-style wording. */
export function buildMurphyCategoryTestPrompt(
  lang: string,
  level: Level,
  category: Category,
): string | null {
  const t = pt(lang);
  const rules = rulesWithExplanations(category);
  if (rules.length === 0) return null;

  const ruleList = rules
    .map((r, idx) => {
      let line = `${idx + 1}. «${r.text}»`;
      if (r.note) line += ` — ${r.note}`;
      return line;
    })
    .join('\n');

  let prompt = t('aiPrompt.catMurphyOpen', { level: level.name, category: category.name });
  prompt += `${t('aiPrompt.catMurphyList')}${ruleList}\n\n`;
  prompt += t('aiPrompt.catMurphyTitle');
  prompt += `${t('aiPrompt.cat1')}${t('aiPrompt.cat2')}${t('aiPrompt.cat3')}${t('aiPrompt.cat4')}${t('aiPrompt.cat5')}`;
  prompt += t('aiPrompt.catFooter');
  return prompt;
}

export function buildGlobalTestPrompt(lang: string, doneRules: DoneRule[]): string {
  const t = pt(lang);
  const ruleList = doneRules
    .map((item, idx) => `${idx + 1}. [${item.level.id} — ${item.category.name}] ${item.rule.text}`)
    .join('\n');

  let prompt = t('aiPrompt.grammarGlobalIntro');
  prompt += `${ruleList}\n\n`;
  prompt += t('aiPrompt.grammarGlobalTitle');
  prompt += `${t('aiPrompt.glob1')}${t('aiPrompt.glob2')}${t('aiPrompt.glob3')}${t('aiPrompt.glob4')}${t('aiPrompt.glob5')}`;
  prompt += t('aiPrompt.grammarGlobalFooter');
  return prompt;
}
