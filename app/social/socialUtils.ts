/** Pure helpers for the social layer (no Firebase imports — unit-tested in Node). */

export function pairId(a: string, b: string): string {
  return a < b ? `${a}_${b}` : `${b}_${a}`;
}

export function sanitizeName(raw: string): string {
  return Array.from(raw)
    .filter((ch) => ch.charCodeAt(0) >= 32 && ch !== '<' && ch !== '>')
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24);
}

/** ISO-8601 week key, e.g. "2026-W47", for the local date of `dayNum` (days since epoch). */
export function weekKey(dayNum: number): string {
  const d = new Date(dayNum * 86_400_000);
  const dow = (d.getUTCDay() + 6) % 7; // Monday = 0
  const thursday = new Date(d.getTime() + (3 - dow) * 86_400_000);
  const yearStart = Date.UTC(thursday.getUTCFullYear(), 0, 1);
  const week = Math.floor((thursday.getTime() - yearStart) / (7 * 86_400_000)) + 1;
  return `${thursday.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Day number of the Monday of the week containing `dayNum`. */
export function weekStart(dayNum: number): number {
  const dow = (new Date(dayNum * 86_400_000).getUTCDay() + 6) % 7;
  return dayNum - dow;
}

/** Streak as other people should see it: 0 once it has clearly lapsed. */
export function liveStreak(p: { streak: number; lastDay: number }, today: number): number {
  return today - p.lastDay <= 3 ? p.streak : 0;
}

/** Week XP that still belongs to the current week. */
export function liveWeekXp(p: { week: string; weekXp: number }, currentWeek: string): number {
  return p.week === currentWeek ? p.weekXp : 0;
}

export function normalizeCode(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8);
}
