/**
 * Challenge links: `#challenge=<base64url(json)>`.
 * The friend replays the same seeded game and tries to beat the score.
 */

export interface Challenge {
  /** game id from the catalog, or "daily-challenge" */
  g: string;
  /** seed */
  s: number;
  /** score to beat */
  sc: number;
  /** out of */
  n: number;
  /** ui language of the sender (optional) */
  l?: string;
}

function toBase64Url(s: string): string {
  return btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64Url(s: string): string {
  const b = s.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(escape(atob(b + '==='.slice((b.length + 3) % 4))));
}

export function buildChallengeUrl(c: Challenge): string {
  return `${location.origin}${location.pathname}#challenge=${toBase64Url(JSON.stringify(c))}`;
}

export function parseChallengeHash(hash: string = location.hash): Challenge | null {
  const m = hash.match(/^#challenge=([A-Za-z0-9_-]+)$/);
  if (!m) return null;
  try {
    const c = JSON.parse(fromBase64Url(m[1])) as Challenge;
    if (
      typeof c.g !== 'string' ||
      typeof c.s !== 'number' ||
      typeof c.sc !== 'number' ||
      typeof c.n !== 'number'
    ) {
      return null;
    }
    return {
      g: c.g.slice(0, 40),
      s: c.s >>> 0,
      sc: Math.max(0, Math.floor(c.sc)),
      n: Math.max(1, Math.floor(c.n)),
      l: c.l,
    };
  } catch {
    return null;
  }
}

/** Same seed for everyone on a given (local) day. */
export function dailySeed(date = new Date()): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}
