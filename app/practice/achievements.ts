/** Badges. Titles/descriptions live in i18n under practice.badges.<id>. */
import type { PracticeIndex } from './items';
import { dayNumber, FIX_TARGET, ruleMastery, STAGE_DONE } from './srs';
import type { PracticeState } from './store';

export interface BadgeStats {
  answers: number;
  correct: number;
  sessions: number;
  streakBest: number;
  xp: number;
  mastered: number;
  fixed: number;
  gamesPlayed: number;
  bossesPassed: number;
  placement: boolean;
  /** set by the runner for the session just finished */
  perfect?: boolean;
  bestCombo?: number;
  sprintScore?: number;
}

export interface BadgeDef {
  id: string;
  icon: string;
  test: (s: BadgeStats) => boolean;
}

export const BADGES: BadgeDef[] = [
  { id: 'first_step', icon: '🌱', test: (s) => s.answers >= 1 },
  { id: 'first_session', icon: '🎒', test: (s) => s.sessions >= 1 },
  { id: 'placement', icon: '🧭', test: (s) => s.placement },
  { id: 'streak_3', icon: '🔥', test: (s) => s.streakBest >= 3 },
  { id: 'streak_7', icon: '🔥', test: (s) => s.streakBest >= 7 },
  { id: 'streak_30', icon: '🌋', test: (s) => s.streakBest >= 30 },
  { id: 'correct_100', icon: '✅', test: (s) => s.correct >= 100 },
  { id: 'correct_1000', icon: '🏅', test: (s) => s.correct >= 1000 },
  { id: 'xp_1000', icon: '⭐', test: (s) => s.xp >= 1000 },
  { id: 'xp_10000', icon: '🌟', test: (s) => s.xp >= 10000 },
  { id: 'rules_5', icon: '🌸', test: (s) => s.mastered >= 5 },
  { id: 'rules_25', icon: '🌳', test: (s) => s.mastered >= 25 },
  { id: 'rules_100', icon: '🏞️', test: (s) => s.mastered >= 100 },
  { id: 'fixer_10', icon: '🩹', test: (s) => s.fixed >= 10 },
  { id: 'explorer', icon: '🗺️', test: (s) => s.gamesPlayed >= 10 },
  { id: 'perfect', icon: '💎', test: (s) => !!s.perfect },
  { id: 'combo_15', icon: '⚡', test: (s) => (s.bestCombo ?? 0) >= 15 },
  { id: 'sprinter', icon: '🏃', test: (s) => (s.sprintScore ?? 0) >= 25 },
  { id: 'boss_1', icon: '👑', test: (s) => s.bossesPassed >= 1 },
  { id: 'boss_all', icon: '🏆', test: (s) => s.bossesPassed >= 6 },
];

export function collectStats(state: PracticeState, index: PracticeIndex): BadgeStats {
  let answers = 0;
  let correct = 0;
  let sessions = 0;
  for (const d of Object.values(state.days)) {
    answers += d.n;
    correct += d.c;
    sessions += d.s;
  }
  const today = dayNumber();
  let mastered = 0;
  for (const id of [...index.grammarOrder, ...index.murphyOrder]) {
    if (ruleMastery(index.byRule.get(id), state.items, today).stage >= STAGE_DONE) mastered++;
  }
  let fixed = 0;
  for (const st of Object.values(state.items)) if (st.l > 0 && st.f >= FIX_TARGET) fixed++;
  return {
    answers,
    correct,
    sessions,
    streakBest: state.streak.best,
    xp: state.xp,
    mastered,
    fixed,
    gamesPlayed: Object.keys(state.games).filter((k) => k.startsWith('game:')).length,
    bossesPassed: Object.values(state.bosses).filter((b) => b.passedAt).length,
    placement: !!state.settings.placement,
  };
}

export function earnedBadges(stats: BadgeStats): string[] {
  return BADGES.filter((b) => b.test(stats)).map((b) => b.id);
}
