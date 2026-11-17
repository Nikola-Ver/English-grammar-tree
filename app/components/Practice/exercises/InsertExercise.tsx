import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ARTICLES, gradeInsert, insertWord, parseInsert } from '../../../practice/gameText';
import type { InsertEx } from '../../../practice/types';
import type { ExerciseProps } from './common';

/** none → a → an → the → none */
function next(article: string | null): string | null {
  if (article === null) return ARTICLES[0];
  const i = ARTICLES.indexOf(article as (typeof ARTICLES)[number]);
  return i + 1 < ARTICLES.length ? ARTICLES[i + 1] : null;
}

/**
 * Article repair: the text is shown with its articles taken out. Tapping a word puts an
 * article in front of it (tap again to change it), so the learner decides both where an
 * article belongs and which one.
 */
export function InsertExercise({ ex, answered, onAnswer }: ExerciseProps<InsertEx>) {
  const { t } = useTranslation();
  const parsed = useMemo(() => parseInsert(ex.text), [ex]);
  const [choice, setChoice] = useState<(string | null)[]>(() => parsed.words.map(() => null));
  const [checked, setChecked] = useState(false);
  const total = parsed.need.filter(Boolean).length;
  const placed = choice.filter(Boolean).length;

  function tap(i: number) {
    if (answered) return;
    setChoice((c) => c.map((v, k) => (k === i ? next(v) : v)));
  }

  function check() {
    const g = gradeInsert(parsed, choice);
    setChecked(true);
    onAnswer(g.score >= 0.85, g.score);
  }

  return (
    <div className="pr-ex pr-ins">
      <div className="pr-ins-head">
        <span className="pr-ins-count">🔧 {t('practice.insert.count', { n: placed, total })}</span>
        <span className="pr-legend-hint">{t('practice.insert.hint')}</span>
      </div>
      <div className="pr-ins-text">
        {parsed.words.map((_, i) => {
          const mine = choice[i];
          const need = parsed.need[i];
          // after checking, the word shows what belongs there
          const shown = insertWord(parsed, i, checked ? need : mine);
          const state = !checked
            ? ''
            : need && mine === need
              ? ' ok'
              : need
                ? ' missed'
                : mine
                  ? ' extra'
                  : '';
          const wrong = checked && mine && mine !== need ? mine : null;
          return (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: word position is the identity
              key={i}
              type="button"
              className={`pr-ins-word${mine && !checked ? ' has' : ''}${state}`}
              onClick={() => tap(i)}
              disabled={answered}
              aria-label={shown.article ? `${shown.article} ${shown.word}` : shown.word}
            >
              {wrong && <s className="pr-ins-wrong">{wrong}</s>}
              {shown.article && <span className="pr-ins-art">{shown.article}</span>}
              {shown.word}
            </button>
          );
        })}
      </div>
      {!answered && (
        <div className="pr-actions">
          <button type="button" className="pr-btn primary" onClick={check} disabled={placed === 0}>
            {t('practice.check')}
          </button>
        </div>
      )}
    </div>
  );
}
