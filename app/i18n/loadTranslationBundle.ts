import type { SupportedLangCode } from './supportedLanguages';

/** Locales with full labels + pedagogical rule JSON (same layout as legacy `config` merge). */
type FullBundleLang = Exclude<SupportedLangCode, 'ru'>;

async function loadFullBundle(code: FullBundleLang): Promise<Record<string, unknown>> {
  const [locales, labels, aiPrompt, grammar, murphy] = await Promise.all([
    import(`./locales/${code}.json`),
    import(`./labels/${code}.json`),
    import(`./aiPrompt/${code}.json`),
    import(`./rules/${code}/grammar.json`),
    import(`./rules/${code}/murphy.json`),
  ]);
  return {
    ...locales.default,
    ...labels.default,
    ...aiPrompt.default,
    ruleContent: {
      grammar: grammar.default,
      murphy: murphy.default,
    },
  };
}

async function loadRussianBundle(): Promise<Record<string, unknown>> {
  const [locales, aiPrompt] = await Promise.all([
    import('./locales/ru.json'),
    import('./aiPrompt/ru.json'),
  ]);
  return { ...locales.default, ...aiPrompt.default };
}

/**
 * Loads one UI language: locales, ai prompts, and (except Russian) labels + rule JSON.
 */
export async function loadTranslationBundle(
  code: SupportedLangCode,
): Promise<Record<string, unknown>> {
  if (code === 'ru') return loadRussianBundle();
  return loadFullBundle(code);
}
