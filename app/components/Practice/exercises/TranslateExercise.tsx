import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { speak } from '../../../practice/speech';
import { gradeTranslation, type TranslationGrade } from '../../../practice/translateGrade';
import { TRAP_ICON } from '../../../practice/traps';
import type { TranslateEx } from '../../../practice/types';
import type { ExerciseProps } from './common';

/** Type the English for a sentence in your language; mistakes are explained as Russian-speaker traps. */
export function TranslateExercise({ ex, answered, onAnswer }: ExerciseProps<TranslateEx>) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [grade, setGrade] = useState<TranslationGrade | null>(null);
  const [gaveUp, setGaveUp] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function check() {
    if (answered || !value.trim()) return;
    const g = gradeTranslation(value, [ex.answer, ...(ex.alts ?? [])]);
    setGrade(g);
    onAnswer(g.verdict !== 'wrong');
    if (g.verdict !== 'wrong') speak(ex.answer);
  }

  function giveUp() {
    if (answered) return;
    setGaveUp(true);
    onAnswer(false);
  }

  const traps = grade?.traps.length
    ? grade.traps
    : grade?.verdict === 'wrong' && ex.trap
      ? [ex.trap]
      : [];

  return (
    <div className="pr-ex">
      <div className="pr-source pr-translate-source">{ex.source}</div>
      <textarea
        ref={inputRef}
        className={`pr-input pr-translate-input${grade ? (grade.verdict === 'wrong' ? ' bad' : ' ok') : ''}`}
        value={value}
        rows={2}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            check();
          }
        }}
        disabled={answered}
        autoComplete="off"
        autoCapitalize="sentences"
        spellCheck={false}
        placeholder={t('practice.translate.placeholder')}
        aria-label={t('practice.translate.placeholder')}
      />

      {!answered && (
        <div className="pr-actions">
          <button type="button" className="pr-btn ghost" onClick={giveUp}>
            {t('practice.translate.showAnswer')}
          </button>
          <button type="button" className="pr-btn primary" onClick={check} disabled={!value.trim()}>
            {t('practice.check')}
          </button>
        </div>
      )}

      {grade?.verdict === 'accepted' && (
        <div className="pr-correction">
          ✓ {t('practice.translate.accepted')} <b>{grade.reference}</b>
        </div>
      )}

      {(grade?.verdict === 'wrong' || gaveUp) && (
        <div className="pr-translate-result">
          {grade && (
            <div className="pr-diff" title={t('practice.translate.diff')}>
              {grade.diff.map((d, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: diff tokens are positional
                  key={i}
                  className={`pr-diff-${d.op}`}
                  title={
                    d.op === 'missing'
                      ? t('practice.translate.missing')
                      : d.op === 'extra'
                        ? t('practice.translate.extra')
                        : undefined
                  }
                >
                  {d.word}
                </span>
              ))}
            </div>
          )}
          <div className="pr-correction">
            <span className="pr-arrow">→</span> {grade?.reference || ex.answer}
            <button
              type="button"
              className="pr-btn round small pr-speak"
              onClick={() => speak(grade?.reference || ex.answer)}
              aria-label={t('practice.listen')}
            >
              🔊
            </button>
          </div>
          {traps.map((trap) => (
            <div key={trap} className="pr-trap-hint">
              <span className="pr-trap-icon">{TRAP_ICON[trap]}</span>
              <span>
                <b>{t(`practice.traps.${trap}.name`)}</b> — {t(`practice.traps.${trap}.hint`)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
