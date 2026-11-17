import { useSyncExternalStore } from 'react';
import { dayKey, dayNumber } from '../practice/srs';
import { levelFromXp, type PracticeState, streakView } from '../practice/store';
import {
  getSocialState,
  type ProfileStats,
  type SocialState,
  subscribeSocial,
  weekKey,
  weekStart,
} from './social';

/** XP earned in the current ISO week (Monday–Sunday). */
export function weekXpOf(state: PracticeState, today = dayNumber()): number {
  let xp = 0;
  for (let d = weekStart(today); d <= today; d++) xp += state.days[dayKey(d)]?.xp ?? 0;
  return xp;
}

/** The public numbers shown on leaderboards. */
export function profileStatsFrom(state: PracticeState, mastered: number): ProfileStats {
  const today = dayNumber();
  const streak = streakView(state, today);
  const top = Object.entries(state.badges)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id]) => id);
  return {
    xp: Math.floor(state.xp),
    level: levelFromXp(state.xp).level,
    streak: streak.current,
    bestStreak: Math.max(streak.best, streak.current),
    lastDay: state.streak.last,
    week: weekKey(today),
    weekXp: weekXpOf(state, today),
    badges: Object.keys(state.badges).length,
    topBadges: top,
    mastered,
  };
}

export function useSocial(): SocialState {
  return useSyncExternalStore(subscribeSocial, getSocialState, getSocialState);
}
