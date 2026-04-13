/**
 * i18n layout:
 *   locales/     — UI strings (tabs, header, account, …)
 *   aiPrompt/    — LLM quiz prompt copy (per UI language)
 *   labels/      — Grammar & Murphy section titles (grammarUi, murphyUi) per UI language
 *   rules/<lang> — Pedagogical copy: grammar.json + murphy.json (en = source; de/es/fr/zh machine-translated from en)
 *
 * Only the active language (plus English for fallback) is loaded at startup; other
 * languages are fetched when the user switches.
 */
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import {
  normalizeSupportedLang,
  pickNavigatorLanguage,
  readStoredUiLanguage,
} from './languagePreference';
import { loadTranslationBundle } from './loadTranslationBundle';
import type { SupportedLangCode } from './supportedLanguages';
import { SUPPORTED_LANGUAGES } from './supportedLanguages';

export type { SupportedLangCode };
export { SUPPORTED_LANGUAGES };

const loadedLanguages = new Set<SupportedLangCode>();

const i18n = i18next.createInstance();

export async function ensureLanguageLoaded(lng: string): Promise<void> {
  const code = normalizeSupportedLang(lng) as SupportedLangCode;
  if (loadedLanguages.has(code)) return;
  const bundle = await loadTranslationBundle(code);
  i18n.addResourceBundle(code, 'translation', bundle, true, true);
  loadedLanguages.add(code);
}

export async function initI18n(): Promise<void> {
  const initial = readStoredUiLanguage() ?? pickNavigatorLanguage();
  const lng = normalizeSupportedLang(initial) as SupportedLangCode;

  const enBundle = await loadTranslationBundle('en');
  loadedLanguages.add('en');

  const resources: Record<string, { translation: Record<string, unknown> }> = {
    en: { translation: enBundle },
  };

  if (lng !== 'en') {
    resources[lng] = { translation: await loadTranslationBundle(lng) };
    loadedLanguages.add(lng);
  }

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng,
      fallbackLng: 'en',
      supportedLngs: ['en', 'ru', 'zh', 'de', 'es', 'fr'],
      partialBundledLanguages: true,
      interpolation: { escapeValue: false },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      },
    });

  const changeLanguageBase = i18n.changeLanguage.bind(i18n);
  async function changeLanguageWithLazyBundles(
    ...args: Parameters<typeof changeLanguageBase>
  ): ReturnType<typeof changeLanguageBase> {
    const [lng, ...rest] = args;
    if (lng) await ensureLanguageLoaded(lng);
    return changeLanguageBase(lng, ...rest);
  }
  i18n.changeLanguage = changeLanguageWithLazyBundles as typeof i18n.changeLanguage;
}

export default i18n;
