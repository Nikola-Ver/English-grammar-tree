import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { speak } from '../../../practice/speech';
import type { TypeEx } from '../../../practice/types';
import type { ExerciseProps } from './common';

function lenient(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?;:"«»()—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function asNumber(s: string): number {
  return Number.parseFloat(s.replace(/[\s,$€£]/g, ''));
}

export function TypeExercise({ ex, answered, onAnswer, sprint }: ExerciseProps<TypeEx>) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (ex.say) {
      const id = setTimeout(() => speak(ex.say as string), 250);
      return () => clearTimeout(id);
    }
  }, [ex]);

  function check() {
    if (answered || !value.trim()) return;
    let ok: boolean;
    if (ex.numeric) {
      ok = Math.abs(asNumber(value) - asNumber(ex.answer)) < 1e-9;
    } else {
      const accepted = [ex.answer, ...(ex.alts ?? [])].map(lenient);
      ok = accepted.includes(lenient(value));
    }
    setVerdict(ok);
    onAnswer(ok);
  }

  return (
    <div className="pr-ex">
      {ex.say && (
        <div className="pr-listen">
          <button
            type="button"
            className="pr-btn round"
            onClick={() => speak(ex.say as string)}
            aria-label={t('practice.listen')}
          >
            🔊
          </button>
          <button
            type="button"
            className="pr-btn round small"
            onClick={() => speak(ex.say as string, 0.6)}
            aria-label={t('practice.listenSlow')}
          >
            🐢
          </button>
        </div>
      )}
      {ex.prompt && <div className={`pr-prompt${ex.say ? ' hint-only' : ''}`}>{ex.prompt}</div>}
      <form
        className="pr-type-form"
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <input
          ref={inputRef}
          className={`pr-input${verdict === true ? ' ok' : verdict === false ? ' bad' : ''}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={answered}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode={ex.numeric ? 'decimal' : 'text'}
          placeholder={ex.numeric ? '123' : t('practice.typeHere')}
          aria-label={t('practice.typeHere')}
        />
        {!answered && (
          <button type="submit" className="pr-btn primary" disabled={!value.trim()}>
            {sprint ? '↵' : t('practice.check')}
          </button>
        )}
      </form>
      {answered && verdict === false && (
        <div className="pr-correction">
          <span className="pr-arrow">→</span> {ex.answer}
        </div>
      )}
    </div>
  );
}
