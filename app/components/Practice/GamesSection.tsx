import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GAME_GROUPS, GAMES, type GameDef, type GameGroup } from '../../practice/games';
import { dayKey, dayNumber } from '../../practice/srs';
import type { PracticeState } from '../../practice/store';
import { usePractice } from './PracticeProvider';

interface Props {
  state: PracticeState;
  speechOk: boolean;
  /** UI language has sentences to translate from (false for English) */
  canTranslate: boolean;
  /** learner's CEFR level index (0 = A1) */
  levelIdx: number;
}

const LEVEL_IDS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/** Does the card's level label ("A2–B2", "A1 → C2", "C1") include the learner's level? */
function fitsLevel(game: GameDef, levelIdx: number): boolean {
  const found = LEVEL_IDS.map((l, i) => (game.level.includes(l) ? i : -1)).filter((i) => i >= 0);
  if (found.length === 0) return true;
  return levelIdx >= Math.min(...found) - 1 && levelIdx <= Math.max(...found) + 1;
}

const GROUP_ICONS: Record<GameGroup, string> = {
  core: '⭐',
  tenses: '⏳',
  words: '🔤',
  structures: '🧩',
  advanced: '🏔️',
};

export function GamesSection({ state, speechOk, canTranslate, levelIdx }: Props) {
  const { t } = useTranslation();
  const { start } = usePractice();
  const [filter, setFilter] = useState<GameGroup | 'all'>('all');

  const recommended = useMemo(() => {
    const playable = GAMES.filter(
      (g) => (!g.needsSpeech || speechOk) && (!g.needsTranslation || canTranslate),
    );
    const today = dayKey(dayNumber());
    const picks: GameDef[] = [];
    const daily = playable.find((g) => g.id === 'daily-challenge');
    if (daily && (state.days[today]?.s ?? 0) === 0) picks.push(daily);
    // games at your level you have played least
    const fresh = playable
      .filter((g) => g.id !== 'daily-challenge' && fitsLevel(g, levelIdx))
      .sort(
        (a, b) =>
          (state.games[`game:${a.id}`]?.plays ?? 0) - (state.games[`game:${b.id}`]?.plays ?? 0),
      );
    for (const g of fresh) {
      if (picks.length >= 3) break;
      if (!picks.some((p) => p.group === g.group)) picks.push(g);
    }
    return picks.slice(0, 3);
  }, [state.games, state.days, speechOk, canTranslate, levelIdx]);

  const shown = filter === 'all' ? GAMES : GAMES.filter((g) => g.group === filter);

  const card = (game: GameDef, big = false) => {
    const noSpeech = !!game.needsSpeech && !speechOk;
    const noTranslation = !!game.needsTranslation && !canTranslate;
    const disabled = noSpeech || noTranslation;
    const stat = state.games[`game:${game.id}`];
    return (
      <button
        key={game.id}
        type="button"
        className={`pr-game g-${game.group}${big ? ' big' : ''}`}
        disabled={disabled}
        onClick={() => start({ type: 'game', gameId: game.id })}
        title={
          noSpeech
            ? t('practice.arcade.noSpeech')
            : noTranslation
              ? t('practice.arcade.noTranslation')
              : t(`practice.games.${game.id}.desc`)
        }
      >
        <span className="pr-game-icon">{game.icon}</span>
        <span className="pr-game-text">
          <b>{t(`practice.games.${game.id}.title`)}</b>
          <small>{t(`practice.games.${game.id}.desc`)}</small>
        </span>
        <span className="pr-game-meta">
          <span className="pr-game-level">{game.level}</span>
          {game.mode !== 'lesson' && (
            <span className="pr-game-mode">{t(`practice.arcade.mode.${game.mode}`)}</span>
          )}
          {stat ? (
            <span className="pr-game-best">
              {t('practice.arcade.best', {
                score: game.mode === 'lesson' ? `${stat.best}%` : stat.best,
              })}
            </span>
          ) : (
            <span className="pr-game-new">{t('practice.arcade.new')}</span>
          )}
        </span>
      </button>
    );
  };

  return (
    <div className="pr-section-body">
      {recommended.length > 0 && (
        <>
          <div className="pr-section-label">✨ {t('practice.arcade.recommended')}</div>
          <div className="pr-games recommended">{recommended.map((g) => card(g, true))}</div>
        </>
      )}
      <div className="pr-chips" role="tablist" aria-label={t('practice.arcade.title')}>
        {(['all', ...GAME_GROUPS] as const).map((g) => (
          <button
            key={g}
            type="button"
            role="tab"
            aria-selected={filter === g}
            className={`pr-chip-filter${filter === g ? ' on' : ''}`}
            onClick={() => setFilter(g)}
          >
            {g === 'all'
              ? `🎮 ${t('practice.arcade.all')}`
              : `${GROUP_ICONS[g]} ${t(`practice.arcade.groups.${g}`)}`}
            <span className="pr-chip-count">
              {g === 'all' ? GAMES.length : GAMES.filter((x) => x.group === g).length}
            </span>
          </button>
        ))}
      </div>
      <div className="pr-games">{shown.map((g) => card(g))}</div>
    </div>
  );
}
