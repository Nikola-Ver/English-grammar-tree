import type { i18n as I18nInstance, TFunction } from 'i18next';
import type { Level, Rule, RuleLink } from '../data/grammar';

export type UiLang = 'en' | 'ru' | 'de' | 'es' | 'fr' | 'zh';

export interface GrammarRuleStrings {
  text: string;
  note: string;
  exp: string;
  exc: string;
  tip: string;
  mistakes: string[];
  markers: { tags: string[]; note?: string } | null;
  ex: [string, string][];
}

export interface MurphyRuleStrings {
  text: string;
  note: string;
  exp: string;
  unitUrl: string;
}

export interface RuleContentBundle {
  grammar: Record<string, GrammarRuleStrings>;
  murphy: Record<string, MurphyRuleStrings>;
}

export function getRuleContentBundle(i18n: I18nInstance): RuleContentBundle | undefined {
  const lng = normalizeUiLang(i18n.language);
  if (lng === 'ru') return undefined;
  const pack = i18n.getResourceBundle(lng, 'translation') as
    | { ruleContent?: RuleContentBundle }
    | undefined;
  if (pack?.ruleContent) return pack.ruleContent;
  const enPack = i18n.getResourceBundle('en', 'translation') as
    | { ruleContent?: RuleContentBundle }
    | undefined;
  return enPack?.ruleContent;
}

export function normalizeUiLang(lng: string): UiLang {
  const base = lng.split('-')[0].toLowerCase();
  if (
    base === 'ru' ||
    base === 'en' ||
    base === 'de' ||
    base === 'es' ||
    base === 'fr' ||
    base === 'zh'
  ) {
    return base;
  }
  return 'en';
}

export function filterGrammarLinks(
  links: RuleLink[] | undefined,
  lang: UiLang,
): RuleLink[] | undefined {
  if (!links?.length) return links;
  if (lang === 'ru') {
    return links.filter((l) => l.type === 'ru' || l.type === 'yt');
  }
  if (lang === 'en') {
    return links.filter((l) => l.type === 'en');
  }
  const localized = links.filter((l) => l.type === lang);
  if (localized.length > 0) return localized;
  return links.filter((l) => l.type === 'en');
}

function mergeGrammarRule(base: Rule, bundle: RuleContentBundle | undefined, lang: UiLang): Rule {
  const links = filterGrammarLinks(base.links, lang);
  if (lang === 'ru' || !bundle) {
    return { ...base, links };
  }
  const g = bundle.grammar[base.id];
  if (!g) {
    return { ...base, links };
  }
  return {
    ...base,
    text: g.text || base.text,
    note: g.note || base.note,
    exp: g.exp || base.exp,
    exc: g.exc || base.exc,
    tip: g.tip || base.tip,
    mistakes: g.mistakes?.length ? g.mistakes : base.mistakes,
    markers: g.markers !== undefined ? (g.markers ?? base.markers) : base.markers,
    ex: g.ex?.length ? g.ex : base.ex,
    links,
  };
}

export function localizeGrammarLevels(
  levels: Level[],
  bundle: RuleContentBundle | undefined,
  t: TFunction,
  lang: UiLang,
): Level[] {
  if (lang === 'ru') {
    return levels.map((lvl) => ({
      ...lvl,
      categories: lvl.categories.map((cat) => ({
        ...cat,
        rules: cat.rules.map((r) => mergeGrammarRule(r, bundle, lang)),
      })),
    }));
  }
  return levels.map((lvl) => ({
    ...lvl,
    name: t(`grammarUi.levels.${lvl.id}.name`, { defaultValue: lvl.name }),
    sub: t(`grammarUi.levels.${lvl.id}.sub`, { defaultValue: lvl.sub }),
    categories: lvl.categories.map((cat, ci) => ({
      ...cat,
      name: t(`grammarUi.categories.${lvl.id}.${ci}`, { defaultValue: cat.name }),
      rules: cat.rules.map((r) => mergeGrammarRule(r, bundle, lang)),
    })),
  }));
}

function mergeMurphyRule(base: Rule, bundle: RuleContentBundle | undefined, lang: UiLang): Rule {
  if (lang === 'ru') {
    return base;
  }
  const m = bundle?.murphy[base.id];
  const merged =
    m != null
      ? {
          ...base,
          text: m.text || base.text,
          note: m.note || base.note,
          exp: m.exp || base.exp,
        }
      : { ...base };
  // Only Russian keeps ok-english.ru Murphy lesson links; other locales had generic hubs, not book refs.
  return { ...merged, unitUrl: undefined };
}

export function localizeMurphyLevels(
  levels: Level[],
  bundle: RuleContentBundle | undefined,
  t: TFunction,
  lang: UiLang,
): Level[] {
  if (lang === 'ru') {
    return levels.map((lvl) => ({
      ...lvl,
      categories: lvl.categories.map((cat) => ({
        ...cat,
        rules: cat.rules.map((r) => mergeMurphyRule(r, bundle, lang)),
      })),
    }));
  }
  return levels.map((lvl) => ({
    ...lvl,
    name: t(`murphyUi.levels.${lvl.id}.name`, { defaultValue: lvl.name }),
    sub: t(`murphyUi.levels.${lvl.id}.sub`, { defaultValue: lvl.sub }),
    categories: lvl.categories.map((cat, ci) => ({
      ...cat,
      name: t(`murphyUi.categories.${lvl.id}.${ci}`, { defaultValue: cat.name }),
      rules: cat.rules.map((r) => mergeMurphyRule(r, bundle, lang)),
    })),
  }));
}
