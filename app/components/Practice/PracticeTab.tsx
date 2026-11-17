import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthSync } from '../../context/AuthSyncContext';
import { readDoneMap } from '../../hooks/useProgress';
import type { Challenge } from '../../practice/challenge';
import {
  BADGES,
  dueItemIds,
  GAMES,
  indexFor,
  mistakeDeckIds,
  nextNewRule,
  ruleTitle,
  userLevelIdx,
} from '../../practice/engine';
import { makeRng } from '../../practice/rng';
import { canSpeak } from '../../practice/speech';
import {
  GOAL_OPTIONS,
  levelFromXp,
  resetPractice,
  setGoal,
  setSound,
  streakView,
  todayStat,
} from '../../practice/store';
import { usePracticeState } from '../../practice/usePracticeState';
import { SYNC_APPLIED_EVENT } from '../../services/syncRegistry';
import { useSocial } from '../../social/stats';
import { LeaderboardPanel } from '../Social/LeaderboardPanel';
import { ClaudeCard } from './ClaudeCard';
import { GamesSection } from './GamesSection';
import { usePractice } from './PracticeProvider';
import { ProgressPanel } from './ProgressPanel';
import { TrapsCard } from './TrapsCard';
import { TreeView } from './TreeView';
import './Practice.css';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SECTIONS = ['tree', 'games', 'leaderboard', 'progress', 'badges'] as const;
type Section = (typeof SECTIONS)[number];
const SECTION_ICONS: Record<Section, string> = {
  tree: '🌳',
  games: '🎮',
  leaderboard: '🏆',
  progress: '📊',
  badges: '🏅',
};
const LS_SECTION = 'today-section-v1';

interface Props {
  challenge: Challenge | null;
  onChallengeConsumed: () => void;
  onOpenRule: (ruleId: string) => void;
  inviteCode: string | null;
  onInviteConsumed: () => void;
  onSignIn: () => void;
}

function useDoneMap() {
  const [done, setDone] = useState(() => ({
    ...readDoneMap('eng_v4'),
    ...readDoneMap('murphy_v1'),
  }));
  useEffect(() => {
    const h = () => setDone({ ...readDoneMap('eng_v4'), ...readDoneMap('murphy_v1') });
    window.addEventListener(SYNC_APPLIED_EVENT, h);
    return () => window.removeEventListener(SYNC_APPLIED_EVENT, h);
  }, []);
  return done;
}

function initialSection(): Section {
  try {
    const v = localStorage.getItem(LS_SECTION) as Section | null;
    if (v && (SECTIONS as readonly string[]).includes(v)) return v;
  } catch {
    // storage blocked
  }
  return 'tree';
}

export function PracticeTab({
  challenge,
  onChallengeConsumed,
  onOpenRule,
  inviteCode,
  onInviteConsumed,
  onSignIn,
}: Props) {
  const { t, i18n } = useTranslation();
  const { start, mastery } = usePractice();
  const { user } = useAuthSync();
  const social = useSocial();
  const state = usePracticeState();
  const done = useDoneMap();
  const index = useMemo(() => indexFor(i18n), [i18n, i18n.language]);
  const [selected, setSelected] = useState<string | null>(null);
  const [section, setSection] = useState<Section>(() =>
    inviteCode ? 'leaderboard' : initialSection(),
  );
  const [confirmReset, setConfirmReset] = useState(false);
  const speechOk = canSpeak();

  useEffect(() => {
    try {
      localStorage.setItem(LS_SECTION, section);
    } catch {
      // storage blocked
    }
  }, [section]);

  useEffect(() => {
    if (inviteCode) setSection('leaderboard');
  }, [inviteCode]);

  const streak = streakView(state);
  const today = todayStat(state);
  const goal = state.settings.goal;
  const goalPct = Math.min(1, today.xp / goal);
  const lvl = levelFromXp(state.xp);
  const ctx = {
    index,
    state,
    done,
    rng: makeRng(1),
    lang: 'en' as const,
    personal: true,
    canSpeak: speechOk,
  };
  const dueCount = dueItemIds(ctx).length;
  const deckCount = mistakeDeckIds(ctx).length;
  const newRule = nextNewRule(ctx);
  const levelIdx = userLevelIdx(ctx);
  const isNew = Object.keys(state.items).length === 0 && !state.settings.placement;
  const title = (id: string) => ruleTitle(i18n, id);
  const incoming = social.friendships.filter(
    (f) => f.status === 'pending' && f.to === social.uid,
  ).length;

  const masteredGrammar = useMemo(() => {
    if (!mastery) return 0;
    let n = 0;
    for (const id of index.grammarOrder) if ((mastery.get(id)?.stage ?? 0) >= 3) n++;
    return n;
  }, [mastery, index]);
  const wilting = useMemo(() => {
    if (!mastery) return 0;
    let n = 0;
    for (const m of mastery.values()) if (m.wilting) n++;
    return n;
  }, [mastery]);

  const sel = selected ? mastery?.get(selected) : null;
  const hour = new Date().getHours();
  const greetingKey =
    hour < 5 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const firstName = social.me?.name ?? user?.displayName?.split(' ')[0] ?? '';
  const nudge = streak.atRisk
    ? t('practice.hero.nudgeStreak', { n: streak.current })
    : wilting > 0
      ? t('practice.hero.nudgeWilting', { n: wilting })
      : !streak.doneToday
        ? t('practice.hero.nudgeGoal', { xp: Math.max(0, goal - today.xp) })
        : t('practice.hero.nudgeDone');

  return (
    <div className="pr-tab">
      {challenge && (
        <div className="pr-banner gold">
          <div>
            <div className="pr-banner-title">🏁 {t('practice.challenge.title')}</div>
            <div className="pr-banner-text">
              {t('practice.challenge.text', {
                game: t(`practice.games.${challenge.g}.title`),
                score: challenge.sc,
                n: challenge.n,
              })}
            </div>
          </div>
          <div className="pr-actions">
            <button
              type="button"
              className="pr-btn primary"
              onClick={() => {
                start({
                  type: 'game',
                  gameId: challenge.g,
                  seed: challenge.s,
                  challenge: { sc: challenge.sc, n: challenge.n },
                });
                onChallengeConsumed();
              }}
            >
              {t('practice.challenge.accept')}
            </button>
            <button type="button" className="pr-btn ghost" onClick={onChallengeConsumed}>
              {t('practice.challenge.dismiss')}
            </button>
          </div>
        </div>
      )}

      <section className="pr-hero">
        <div className="pr-hero-top">
          <div className="pr-hello">
            <h2>
              {t(`practice.hero.${greetingKey}`)}
              {firstName ? `, ${firstName}` : ''}
            </h2>
            <p>{nudge}</p>
          </div>
          <div className="pr-hero-stats">
            <div
              className={`pr-stat-pill streak${streak.atRisk ? ' risk' : ''}${streak.doneToday ? ' lit' : ''}`}
              title={streak.freezes > 0 ? t('practice.freezeHint') : undefined}
            >
              <span className="pr-pill-icon">🔥</span>
              <b>{streak.current}</b>
              <small>{t('practice.streakDays', { count: streak.current })}</small>
              {streak.freezes > 0 && <span className="pr-freeze">❄️{streak.freezes}</span>}
            </div>
            <div className="pr-stat-pill" title={t('practice.goalHint')}>
              <svg viewBox="0 0 44 44" className="pr-ring">
                <circle cx={22} cy={22} r={18} className="pr-ring-track" />
                <circle
                  cx={22}
                  cy={22}
                  r={18}
                  className={`pr-ring-fill${goalPct >= 1 ? ' full' : ''}`}
                  strokeDasharray={`${goalPct * 113.1} 113.1`}
                  transform="rotate(-90 22 22)"
                />
              </svg>
              <b>
                {today.xp}
                <span className="pr-of">/{goal}</span>
              </b>
              <small>{t('practice.dailyGoal')}</small>
            </div>
            <div className="pr-stat-pill">
              <span className="pr-level-badge">{lvl.level}</span>
              <span className="pr-level-info">
                <small>{t('practice.level', { n: lvl.level })}</small>
                <span className="pr-level-bar">
                  <span style={{ width: `${(lvl.into / lvl.span) * 100}%` }} />
                </span>
                <small className="pr-xp-total">{state.xp} XP</small>
              </span>
            </div>
          </div>
        </div>

        <div className="pr-cta-row">
          {isNew ? (
            <>
              <button type="button" className="pr-cta" onClick={() => start({ type: 'placement' })}>
                <span className="pr-cta-icon">🧭</span>
                <span>
                  <b>{t('practice.cta.placement')}</b>
                  <small>{t('practice.cta.placementSub')}</small>
                </span>
                <span className="pr-cta-go">→</span>
              </button>
              <button
                type="button"
                className="pr-cta secondary"
                onClick={() => start({ type: 'daily' })}
              >
                <span className="pr-cta-icon">🌱</span>
                <span>
                  <b>{t('practice.cta.startFromZero')}</b>
                  <small>{t('practice.cta.dailySub')}</small>
                </span>
              </button>
            </>
          ) : (
            <button type="button" className="pr-cta" onClick={() => start({ type: 'daily' })}>
              <span className="pr-cta-icon">{streak.doneToday ? '🌳' : '💧'}</span>
              <span>
                <b>{streak.doneToday ? t('practice.cta.dailyMore') : t('practice.cta.daily')}</b>
                <small>
                  {t('practice.cta.dailyInfo', { due: dueCount })}
                  {newRule ? ` · ${t('practice.cta.newRule', { rule: title(newRule) })}` : ''}
                </small>
              </span>
              <span className="pr-cta-go">→</span>
            </button>
          )}
          {deckCount > 0 && (
            <button
              type="button"
              className="pr-cta secondary"
              onClick={() => start({ type: 'deck' })}
            >
              <span className="pr-cta-icon">🩹</span>
              <span>
                <b>{t('practice.cta.deck', { n: deckCount })}</b>
                <small>{t('practice.cta.deckSub')}</small>
              </span>
            </button>
          )}
        </div>
      </section>

      <nav className="pr-subnav" aria-label={t('practice.sections.label')}>
        {SECTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className={`pr-subnav-btn${section === s ? ' on' : ''}`}
            aria-current={section === s ? 'page' : undefined}
            onClick={() => setSection(s)}
          >
            <span className="pr-subnav-icon">{SECTION_ICONS[s]}</span>
            <span className="pr-subnav-label">{t(`practice.sections.${s}`)}</span>
            {s === 'leaderboard' && incoming > 0 && <span className="pr-dot">{incoming}</span>}
            {s === 'tree' && wilting > 0 && <span className="pr-dot amber">{wilting}</span>}
          </button>
        ))}
      </nav>

      {section === 'tree' && (
        <>
          <section className="pr-card pr-tree-card">
            <div className="pr-card-head">
              <h3>{t('practice.tree.title')}</h3>
              <span className="pr-card-meta">
                {t('practice.tree.meta', {
                  mastered: masteredGrammar,
                  total: index.grammarOrder.length,
                })}
                {wilting > 0 ? ` · 🍂 ${t('practice.tree.wilting', { n: wilting })}` : ''}
              </span>
            </div>
            {mastery ? (
              <TreeView
                index={index}
                mastery={mastery}
                done={done}
                bosses={state.bosses}
                selected={selected}
                onSelect={setSelected}
                ruleTitle={title}
              />
            ) : (
              <div className="pr-tree-loading">{t('common.loading')}</div>
            )}
            {selected ? (
              <div className="pr-leaf-card">
                <button
                  type="button"
                  className="pr-leaf-card-close"
                  onClick={() => setSelected(null)}
                  aria-label={t('practice.close')}
                >
                  ✕
                </button>
                <div className="pr-leaf-card-title">{title(selected)}</div>
                <div className="pr-leaf-card-meta">
                  {t(`practice.stage.icon${sel?.stage ?? 0}`)}{' '}
                  {t(`practice.stage.name${sel?.stage ?? 0}`)}
                  {sel?.wilting ? ` · 🍂 ${t('practice.stage.wilting')}` : ''}
                  {sel?.accuracy != null
                    ? ` · ${t('practice.accuracy', { pct: Math.round(sel.accuracy * 100) })}`
                    : ''}
                  {sel ? ` · ${t('practice.itemsSeen', { seen: sel.seen, total: sel.total })}` : ''}
                </div>
                <div className="pr-actions">
                  <button
                    type="button"
                    className="pr-btn primary"
                    onClick={() => start({ type: 'rule', ruleId: selected })}
                  >
                    🎯 {t('practice.practise')}
                  </button>
                  <button
                    type="button"
                    className="pr-btn ghost"
                    onClick={() => onOpenRule(selected)}
                  >
                    📖 {t('practice.openRule')}
                  </button>
                </div>
              </div>
            ) : (
              <p className="pr-tree-hint">👆 {t('practice.tree.hint')}</p>
            )}
            <div className="pr-tree-legend">
              {[0, 1, 2, 3, 4].map((s) => (
                <span key={s}>
                  {t(`practice.stage.icon${s}`)} {t(`practice.stage.name${s}`)}
                </span>
              ))}
              <span>🍂 {t('practice.stage.wilting')}</span>
            </div>
          </section>

          <section className="pr-card">
            <div className="pr-card-head">
              <h3>👑 {t('practice.exams.title')}</h3>
              <span className="pr-card-meta">{t('practice.exams.meta')}</span>
            </div>
            <div className="pr-exams">
              {LEVELS.map((l) => {
                const b = state.bosses[l];
                return (
                  <button
                    key={l}
                    type="button"
                    className={`pr-exam${b?.passedAt ? ' passed' : ''}`}
                    style={{ '--lvl': `var(--${l.toLowerCase()})` } as React.CSSProperties}
                    onClick={() => start({ type: 'boss', level: l })}
                  >
                    <span className="pr-exam-level">
                      {b?.passedAt ? '👑' : ''} {l}
                    </span>
                    <span className="pr-exam-best">
                      {b ? t('practice.exams.best', { pct: b.best }) : t('practice.exams.notTaken')}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}

      {section === 'games' && (
        <section className="pr-card">
          <div className="pr-card-head">
            <h3>🎮 {t('practice.arcade.title')}</h3>
            <span className="pr-card-meta">{t('practice.arcade.meta', { n: GAMES.length })}</span>
          </div>
          <GamesSection
            state={state}
            speechOk={speechOk}
            canTranslate={i18n.language.split('-')[0] !== 'en'}
            levelIdx={levelIdx}
          />
        </section>
      )}

      {section === 'leaderboard' && (
        <section className="pr-card">
          <div className="pr-card-head">
            <h3>🏆 {t('social.title')}</h3>
            <span className="pr-card-meta">{t('social.meta')}</span>
          </div>
          <LeaderboardPanel
            signedIn={!!user || !!social.uid}
            onSignIn={onSignIn}
            inviteCode={inviteCode}
            onInviteConsumed={onInviteConsumed}
          />
        </section>
      )}

      {section === 'progress' && (
        <>
          <ClaudeCard state={state} ruleTitle={title} />
          <TrapsCard index={index} state={state} />
          <section className="pr-card">
            <div className="pr-card-head">
              <h3>📊 {t('practice.progress.title')}</h3>
            </div>
            {mastery ? (
              <ProgressPanel
                state={state}
                index={index}
                mastery={mastery}
                ruleTitle={title}
                onPractiseRule={(id) => start({ type: 'rule', ruleId: id })}
              />
            ) : null}
          </section>
          <section className="pr-card pr-settings">
            <div className="pr-card-head">
              <h3>⚙️ {t('practice.settings.title')}</h3>
            </div>
            <div className="pr-setting">
              <span>{t('practice.settings.goal')}</span>
              <div className="pr-seg">
                {GOAL_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={g === goal ? 'on' : ''}
                    onClick={() => setGoal(g)}
                  >
                    {t(`practice.settings.goal${g}`)}
                  </button>
                ))}
              </div>
            </div>
            <div className="pr-setting">
              <span>{t('practice.settings.sound')}</span>
              <div className="pr-seg">
                <button
                  type="button"
                  className={state.settings.sound ? 'on' : ''}
                  onClick={() => setSound(true)}
                >
                  {t('practice.settings.on')}
                </button>
                <button
                  type="button"
                  className={!state.settings.sound ? 'on' : ''}
                  onClick={() => setSound(false)}
                >
                  {t('practice.settings.off')}
                </button>
              </div>
            </div>
            <div className="pr-setting">
              <span>{t('practice.settings.placement')}</span>
              <button
                type="button"
                className="pr-btn small ghost"
                onClick={() => start({ type: 'placement' })}
              >
                🧭 {state.settings.placement ?? '—'} · {t('practice.settings.retake')}
              </button>
            </div>
            <div className="pr-setting">
              <span>{t('practice.settings.reset')}</span>
              {confirmReset ? (
                <span className="pr-actions">
                  <button
                    type="button"
                    className="pr-btn small danger"
                    onClick={() => {
                      resetPractice();
                      setConfirmReset(false);
                    }}
                  >
                    {t('practice.settings.resetConfirm')}
                  </button>
                  <button
                    type="button"
                    className="pr-btn small ghost"
                    onClick={() => setConfirmReset(false)}
                  >
                    {t('practice.settings.cancel')}
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="pr-btn small ghost"
                  onClick={() => setConfirmReset(true)}
                >
                  {t('practice.settings.resetBtn')}
                </button>
              )}
            </div>
          </section>
        </>
      )}

      {section === 'badges' && (
        <section className="pr-card">
          <div className="pr-card-head">
            <h3>🏅 {t('practice.badgesTitle')}</h3>
            <span className="pr-card-meta">
              {Object.keys(state.badges).length}/{BADGES.length}
            </span>
          </div>
          <div className="pr-badges">
            {BADGES.map((b) => {
              const earned = !!state.badges[b.id];
              return (
                <div
                  key={b.id}
                  className={`pr-badge${earned ? ' earned' : ''}`}
                  title={t(`practice.badges.${b.id}.desc`)}
                >
                  <span className="pr-badge-icon">{earned ? b.icon : '🔒'}</span>
                  <span className="pr-badge-name">{t(`practice.badges.${b.id}.title`)}</span>
                  <span className="pr-badge-desc">{t(`practice.badges.${b.id}.desc`)}</span>
                  {earned && (
                    <span className="pr-badge-date">
                      {new Date(state.badges[b.id]).toLocaleDateString(i18n.language)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
