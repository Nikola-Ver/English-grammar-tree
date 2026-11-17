import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shuffle } from '../../../practice/rng';
import { speak } from '../../../practice/speech';
import { normSentence, tokenize } from '../../../practice/text';
import type { TilesEx } from '../../../practice/types';
import type { ExerciseProps } from './common';

interface Tile {
  id: number;
  text: string;
}

export function TilesExercise({ ex, answered, onAnswer, rng }: ExerciseProps<TilesEx>) {
  const { t } = useTranslation();
  const pool = useMemo<Tile[]>(() => {
    const words = [...tokenize(ex.answer), ...(ex.extra ?? [])];
    let shuffled = shuffle(words, rng);
    // avoid presenting the solution already in order
    if (shuffled.join(' ') === ex.answer && words.length > 2)
      shuffled = [...shuffled.slice(1), shuffled[0]];
    return shuffled.map((text, id) => ({ id, text }));
  }, [ex, rng]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [verdict, setVerdict] = useState<boolean | null>(null);

  const built = placed.map((id) => pool[id].text).join(' ');
  const accepted = [ex.answer, ...(ex.alts ?? [])].map(normSentence);

  function check() {
    if (answered || placed.length === 0) return;
    const ok = accepted.includes(normSentence(built));
    setVerdict(ok);
    onAnswer(ok);
    if (ok && ex.speak) speak(ex.answer);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && !answered && placed.length > 0) {
        e.preventDefault();
        check();
      } else if (e.key === 'Backspace' && !answered) setPlaced((p) => p.slice(0, -1));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const instruction =
    ex.task === 'tense' && ex.param
      ? t('practice.instr.tiles.tense', { tense: ex.param })
      : ex.task === 'inversion' && ex.param
        ? t('practice.instr.tiles.inversion', { start: ex.param })
        : null;

  return (
    <div className="pr-ex">
      {ex.source && <div className="pr-source">{ex.source}</div>}
      {instruction && <div className="pr-param">{instruction}</div>}
      <div
        className={`pr-answer-line${verdict === true ? ' ok' : verdict === false ? ' bad' : ''}`}
      >
        {placed.length === 0 && <span className="pr-placeholder">{t('practice.tapTiles')}</span>}
        {placed.map((id) => (
          <button
            key={id}
            type="button"
            className="pr-tile placed"
            disabled={answered}
            onClick={() => setPlaced((p) => p.filter((x) => x !== id))}
          >
            {pool[id].text}
          </button>
        ))}
      </div>
      <div className="pr-tile-pool">
        {pool.map((tile) => {
          const used = placed.includes(tile.id);
          return (
            <button
              key={tile.id}
              type="button"
              className={`pr-tile${used ? ' used' : ''}`}
              disabled={answered || used}
              onClick={() => setPlaced((p) => [...p, tile.id])}
            >
              {tile.text}
            </button>
          );
        })}
      </div>
      {answered && verdict === false && (
        <div className="pr-correction">
          <span className="pr-arrow">→</span> {ex.answer}
        </div>
      )}
      {!answered && (
        <div className="pr-actions">
          <button
            type="button"
            className="pr-btn ghost"
            onClick={() => setPlaced([])}
            disabled={placed.length === 0}
          >
            {t('practice.clear')}
          </button>
          <button
            type="button"
            className="pr-btn primary"
            onClick={check}
            disabled={placed.length === 0}
          >
            {t('practice.check')}
          </button>
        </div>
      )}
    </div>
  );
}
