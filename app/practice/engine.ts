/**
 * Heavy practice entry point (rule data + drill content). Loaded lazily by the UI.
 */
import type { i18n as I18nInstance } from 'i18next';
import { DATA, type Rule } from '../data/grammar';
import { MURPHY_DATA } from '../data/murphy';
import { readDoneMap } from '../hooks/useProgress';
import {
  getRuleContentBundle,
  localizeRule,
  normalizeUiLang,
  type UiLang,
} from '../i18n/localizeRules';
import { shakyRuleIds } from './claude';
import { getPracticeIndex, type PracticeIndex } from './items';
import type { CtxBase } from './spec';
import { canSpeak } from './speech';
import { dayNumber, type RuleMastery, ruleMastery } from './srs';
import { getState, type PracticeState } from './store';

export const GRAMMAR_SK = 'eng_v4';
export const MURPHY_SK = 'murphy_v1';

export function indexFor(i18n: I18nInstance): PracticeIndex {
  const lang = normalizeUiLang(i18n.language);
  return getPracticeIndex(lang, getRuleContentBundle(i18n));
}

export function makeCtxBase(i18n: I18nInstance): CtxBase {
  const lang: UiLang = normalizeUiLang(i18n.language);
  return {
    index: indexFor(i18n),
    state: getState(),
    lang,
    done: { ...readDoneMap(GRAMMAR_SK), ...readDoneMap(MURPHY_SK) },
    canSpeak: canSpeak(),
  };
}

export function masteryMap(index: PracticeIndex, state: PracticeState): Map<string, RuleMastery> {
  const today = dayNumber();
  const map = new Map<string, RuleMastery>();
  for (const id of index.rules.keys())
    map.set(id, ruleMastery(index.byRule.get(id), state.items, today));
  for (const id of shakyRuleIds(state)) {
    const m = map.get(id);
    if (m) m.shaky = true;
  }
  return map;
}

const titleCache = new Map<string, string>();

/** Localized rule / unit title. */
export function ruleTitle(i18n: I18nInstance, ruleId: string): string {
  const lang = normalizeUiLang(i18n.language);
  const key = `${lang}:${ruleId}`;
  const cached = titleCache.get(key);
  if (cached) return cached;
  if (ruleId.startsWith('w_')) return i18n.t(`practice.topics.${ruleId}`);
  let title = ruleId;
  const bundle = lang === 'ru' ? undefined : getRuleContentBundle(i18n);
  for (const [levels, kind] of [
    [DATA, 'grammar'],
    [MURPHY_DATA, 'murphy'],
  ] as const) {
    for (const lvl of levels)
      for (const c of lvl.categories)
        for (const r of c.rules)
          if (r.id === ruleId) {
            title = (bundle?.[kind][r.id]?.text || r.text).replace(/<[^>]+>/g, '');
          }
  }
  titleCache.set(key, title);
  return title;
}

/** A grammar rule or Murphy unit in the interface language; null for word topics. */
export function findRule(i18n: I18nInstance, ruleId: string): Rule | null {
  const lang = normalizeUiLang(i18n.language);
  const bundle = lang === 'ru' ? undefined : getRuleContentBundle(i18n);
  for (const [levels, kind] of [
    [DATA, 'grammar'],
    [MURPHY_DATA, 'murphy'],
  ] as const) {
    for (const lvl of levels)
      for (const c of lvl.categories)
        for (const r of c.rules) if (r.id === ruleId) return localizeRule(r, kind, bundle, lang);
  }
  return null;
}

/** Progress map a rule belongs to; null for word topics (they have no ✓ in Grammar/Murphy). */
export function trackStorageKey(index: PracticeIndex, ruleId: string): string | null {
  const track = index.rules.get(ruleId)?.track;
  return track === 'murphy' ? MURPHY_SK : track === 'words' ? null : GRAMMAR_SK;
}

export * from './achievements';
export * from './challenge';
export * from './claude';
export * from './games';
export * from './items';
export * from './session';
export * from './spec';
export * from './srs';
export * from './trapStats';
export * from './traps';
