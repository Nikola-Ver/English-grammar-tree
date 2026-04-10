import type { Category, Level, Rule } from '../data/grammar';

export function buildMurphyRulePrompt(rule: Rule, level: Level, category: Category): string {
  let prompt = `Я изучаю английскую грамматику по книге «${level.name}» (тема «${category.name}»).\n\n`;
  prompt += `Юнит: «${rule.text}»\n`;
  if (rule.note) prompt += `Подсказка: ${rule.note}\n`;
  if (rule.unitUrl) prompt += `Источник: ${rule.unitUrl}\n`;
  prompt += '\nПожалуйста, проведи углублённое тестирование этой темы:\n';
  prompt += '1. Объясни тему кратко своими словами (2–3 предложения).\n';
  prompt += '2. Дай 5 упражнений на заполнение пропусков (gaps).\n';
  prompt += '3. Дай 3 предложения с ошибками для исправления.\n';
  prompt += '4. Задай 2 вопроса на перевод с русского на английский.\n';
  prompt += '5. После того как я отвечу — проверь ответы и дай подробную обратную связь.';
  return prompt;
}

export function buildMurphyGlobalTestPrompt(
  doneRules: { rule: Rule; level: Level; category: Category }[],
): string {
  const ruleList = doneRules
    .map(
      (item, idx) => `${idx + 1}. [${item.level.name} — ${item.category.name}] ${item.rule.text}`,
    )
    .join('\n');

  let prompt = 'Я изучил(а) следующие темы из книг Мёрфи (English Grammar in Use):\n\n';
  prompt += `${ruleList}\n\n`;
  prompt += 'Пожалуйста, проведи комплексное тестирование по всем этим темам:\n';
  prompt +=
    '1. Сначала дай 10 упражнений на заполнение пропусков, смешивая разные темы из списка.\n';
  prompt += '2. Дай 5 предложений с ошибками для исправления (ошибки касаются тем из списка).\n';
  prompt +=
    '3. Дай 5 предложений для перевода с русского на английский (проверяют несколько тем).\n';
  prompt +=
    '4. Задай 3 вопроса в формате «выбери правильный вариант» (multiple choice) с объяснением.\n';
  prompt +=
    '5. После моих ответов — проверь и дай подробную обратную связь с объяснением ошибок.\n\n';
  prompt += 'Начни с упражнений, не раскрывая ответы заранее.';
  return prompt;
}

export function buildRulePrompt(rule: Rule, level: Level, category: Category): string {
  let prompt = `Я изучаю английскую грамматику (уровень ${level.name}, тема «${category.name}»).\n\n`;
  prompt += `Правило: «${rule.text}»\n`;
  if (rule.note) prompt += `Подсказка: ${rule.note}\n`;
  prompt += '\nПожалуйста, проведи углублённое тестирование этого правила:\n';
  prompt += '1. Объясни правило кратко своими словами (2–3 предложения).\n';
  prompt += '2. Дай 5 упражнений на заполнение пропусков (gaps).\n';
  prompt += '3. Дай 3 предложения с ошибками для исправления.\n';
  prompt += '4. Задай 2 вопроса на перевод с русского на английский.\n';
  prompt += '5. После того как я отвечу — проверь ответы и дай подробную обратную связь.';
  return prompt;
}

interface DoneRule {
  rule: Rule;
  level: Level;
  category: Category;
}

export function buildGlobalTestPrompt(doneRules: DoneRule[]): string {
  const ruleList = doneRules
    .map((item, idx) => `${idx + 1}. [${item.level.id} — ${item.category.name}] ${item.rule.text}`)
    .join('\n');

  let prompt = 'Я изучил(а) следующие правила английской грамматики:\n\n';
  prompt += `${ruleList}\n\n`;
  prompt += 'Пожалуйста, проведи комплексное тестирование по всем этим правилам:\n';
  prompt +=
    '1. Сначала дай 10 упражнений на заполнение пропусков, смешивая разные правила из списка.\n';
  prompt += '2. Дай 5 предложений с ошибками для исправления (ошибки касаются правил из списка).\n';
  prompt +=
    '3. Дай 5 предложений для перевода с русского на английский (проверяют несколько правил).\n';
  prompt +=
    '4. Задай 3 вопроса в формате «выбери правильный вариант» (multiple choice) с объяснением.\n';
  prompt +=
    '5. После моих ответов — проверь и дай подробную обратную связь с объяснением ошибок.\n\n';
  prompt += 'Начни с упражнений, не раскрывая ответы заранее.';
  return prompt;
}
