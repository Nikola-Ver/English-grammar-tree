/** Short `label` keeps the header control minimal; `hint` is the tooltip / full name. */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'EN', hint: 'English' },
  { code: 'ru', label: 'RU', hint: 'Русский' },
  { code: 'zh', label: 'ZH', hint: '中文' },
  { code: 'de', label: 'DE', hint: 'Deutsch' },
  { code: 'es', label: 'ES', hint: 'Español' },
  { code: 'fr', label: 'FR', hint: 'Français' },
] as const;

export type SupportedLangCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];
