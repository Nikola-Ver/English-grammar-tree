import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TrueFalseEx } from '../../../practice/types';
import type { ExerciseProps } from './common';

export function TrueFalseExercise({ ex, answered, onAnswer }: ExerciseProps<TrueFalseEx>) {
  const { t } = useTranslation();
  const [picked, setPicked] = useState<boolean | null>(null);

  function choose(v: boolean) {
    if (answered || picked !== null) return;
    setPicked(v);
    onAnswer(v === ex.correct);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key === '1') choose(true);
      else if (e.key === 'ArrowRight' || e.key === '2') choose(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="pr-ex">
      <div className={`pr-prompt big${answered ? (ex.correct ? ' ok-text' : ' bad-text') : ''}`}>
        {ex.sentence}
      </div>
      {answered && !ex.correct && ex.fix && (
        <div className="pr-correction">
          <span className="pr-arrow">→</span> {ex.fix}
        </div>
      )}
      <div className="pr-tf">
        <button
          type="button"
          className={`pr-tf-btn yes${answered && picked === true ? (ex.correct ? ' ok' : ' bad') : ''}`}
          onClick={() => choose(true)}
          disabled={answered}
        >
          ✓ {t('practice.correctSentence')}
        </button>
        <button
          type="button"
          className={`pr-tf-btn no${answered && picked === false ? (!ex.correct ? ' ok' : ' bad') : ''}`}
          onClick={() => choose(false)}
          disabled={answered}
        >
          ✗ {t('practice.hasMistake')}
        </button>
      </div>
    </div>
  );
}
