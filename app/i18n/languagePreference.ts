import { SUPPORTED_LANGUAGES } from './supportedLanguages';

const CODES = new Set<string>(SUPPORTED_LANGUAGES.map((l) => l.code));

/** First segment must be an app-supported UI code, else null. */
export function matchSupportedLang(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const base = raw.split('-')[0].toLowerCase();
  return CODES.has(base) ? base : null;
}

export function normalizeSupportedLang(raw: string | null | undefined): string {
  return matchSupportedLang(raw) ?? 'en';
}

/** Pick the best supported language from the browser list (Accept-Languages style). */
export function pickNavigatorLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';
  const list = [...(navigator.languages ?? []), navigator.language].filter(Boolean);
  for (const l of list) {
    const m = matchSupportedLang(l);
    if (m) return m;
  }
  return 'en';
}

/** Value persisted by i18next-browser-languagedetector (default key). */
const I18NEXT_LS_KEY = 'i18nextLng';

export function readStoredUiLanguage(): string | null {
  const raw = localStorage.getItem(I18NEXT_LS_KEY);
  return raw ? matchSupportedLang(raw) : null;
}

export function persistUiLanguage(code: string): void {
  const n = normalizeSupportedLang(code);
  localStorage.setItem(I18NEXT_LS_KEY, n);
}
