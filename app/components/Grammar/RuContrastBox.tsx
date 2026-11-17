import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { normalizeUiLang } from '../../i18n/localizeRules';
import type { RuContrast } from '../../practice/content/types';
import { speak } from '../../practice/speech';
import { TRAP_ICON } from '../../practice/traps';
import { usePractice } from '../Practice/PracticeProvider';
import './RuContrastBox.css';

type ContrastMap = Record<string, RuContrast>;

let cache: ContrastMap | null = null;
let loading: Promise<ContrastMap> | null = null;

function loadContrast(): Promise<ContrastMap> {
  if (!loading) {
    loading = import('../../practice/content/contrast').then((m) => {
      const data: ContrastMap = m.RU_CONTRAST;
      cache = data;
      return data;
    });
  }
  return loading;
}

/**
 * «Почему по-русски иначе»: how Russian makes this rule hard, with typical word-for-word
 * mistakes. Rendered outside the rule text so saved notes/pins keep their positions.
 * Shown for the Russian and English interfaces (both are used by Russian speakers).
 */
export function RuContrastBox({ ruleId }: { ruleId: string }) {
  const { t, i18n } = useTranslation();
  const { start } = usePractice();
  const lang = normalizeUiLang(i18n.language);
  const [data, setData] = useState<ContrastMap | null>(cache);

  useEffect(() => {
    if (!data) void loadContrast().then(setData);
  }, [data]);

  if (lang !== 'ru' && lang !== 'en') return null;
  const c = data?.[ruleId];
  if (!c) return null;

  return (
    <section className="ru-contrast" aria-label={t('practice.contrast.title')}>
      <div className="ru-contrast-head">
        <span className="ru-contrast-title">🇷🇺 {t('practice.contrast.title')}</span>
        <span className="ru-contrast-trap">
          {TRAP_ICON[c.trap]} {t(`practice.traps.${c.trap}.name`)}
        </span>
      </div>
      {/* first-party content (<em>/<b> only) */}
      <p
        className="ru-contrast-text"
        dangerouslySetInnerHTML={{ __html: lang === 'ru' ? c.ru : c.en }}
      />
      <div className="ru-contrast-pairs">
        {c.pairs.map((p) => (
          <div key={p.ru} className="ru-contrast-pair">
            <span className="ru-contrast-ru">{p.ru}</span>
            <span className="ru-contrast-bad">
              <span aria-hidden="true">✗</span> <s>{p.calque}</s>
            </span>
            <span className="ru-contrast-good">
              <span aria-hidden="true">✓</span> {p.en}
              <button
                type="button"
                className="ru-contrast-speak"
                onClick={() => speak(p.en)}
                aria-label={t('practice.listen')}
              >
                🔊
              </button>
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="ru-contrast-train"
        onClick={() => start({ type: 'trap', trap: c.trap })}
      >
        🪤 {t('practice.contrast.train')}
      </button>
    </section>
  );
}
