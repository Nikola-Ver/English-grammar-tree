/**
 * i18n layout:
 *   locales/     — UI strings (tabs, header, account, …)
 *   aiPrompt/    — LLM quiz prompt copy (per UI language)
 *   labels/      — Grammar & Murphy section titles (grammarUi, murphyUi) per UI language
 *   rules/<lang> — Pedagogical copy: grammar.json + murphy.json (en = source; de/es/fr/zh machine-translated from en)
 */
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import aiPromptDe from './aiPrompt/de.json';
import aiPromptEn from './aiPrompt/en.json';
import aiPromptEs from './aiPrompt/es.json';
import aiPromptFr from './aiPrompt/fr.json';
import aiPromptRu from './aiPrompt/ru.json';
import aiPromptZh from './aiPrompt/zh.json';
import labelsDe from './labels/de.json';
import labelsEn from './labels/en.json';
import labelsEs from './labels/es.json';
import labelsFr from './labels/fr.json';
import labelsZh from './labels/zh.json';
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import grammarDe from './rules/de/grammar.json';
import murphyDe from './rules/de/murphy.json';
import grammarEn from './rules/en/grammar.json';
import murphyEn from './rules/en/murphy.json';
import grammarEs from './rules/es/grammar.json';
import murphyEs from './rules/es/murphy.json';
import grammarFr from './rules/fr/grammar.json';
import murphyFr from './rules/fr/murphy.json';
import grammarZh from './rules/zh/grammar.json';
import murphyZh from './rules/zh/murphy.json';

/** Short `label` keeps the header control minimal; `hint` is the tooltip / full name. */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'EN', hint: 'English' },
  { code: 'ru', label: 'RU', hint: 'Русский' },
  { code: 'zh', label: 'ZH', hint: '中文' },
  { code: 'de', label: 'DE', hint: 'Deutsch' },
  { code: 'es', label: 'ES', hint: 'Español' },
  { code: 'fr', label: 'FR', hint: 'Français' },
] as const;

const ruleContentEn = { grammar: grammarEn, murphy: murphyEn };
const ruleContentDe = { grammar: grammarDe, murphy: murphyDe };
const ruleContentEs = { grammar: grammarEs, murphy: murphyEs };
const ruleContentFr = { grammar: grammarFr, murphy: murphyFr };
const ruleContentZh = { grammar: grammarZh, murphy: murphyZh };

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { ...en, ...labelsEn, ...aiPromptEn, ruleContent: ruleContentEn } },
      ru: { translation: { ...ru, ...aiPromptRu } },
      zh: { translation: { ...zh, ...labelsZh, ...aiPromptZh, ruleContent: ruleContentZh } },
      de: { translation: { ...de, ...labelsDe, ...aiPromptDe, ruleContent: ruleContentDe } },
      es: { translation: { ...es, ...labelsEs, ...aiPromptEs, ruleContent: ruleContentEs } },
      fr: { translation: { ...fr, ...labelsFr, ...aiPromptFr, ruleContent: ruleContentFr } },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru', 'zh', 'de', 'es', 'fr'],
    interpolation: { escapeValue: false },
    detection: {
      /* Saved choice wins; if none (first visit), navigator / Accept-Language is used. */
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
