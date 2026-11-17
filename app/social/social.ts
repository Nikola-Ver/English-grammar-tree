/**
 * Social layer: public profiles, friends and leaderboards.
 *
 * Firestore layout (see firestore.rules):
 *   profiles/{uid}         public card: name, xp, level, streak, week xp, badges, mastered…
 *   friendCodes/{CODE}     { uid } — lets people add you by an 8-character code
 *   friendships/{a_b}      { users, from, to, status: pending|accepted }
 *
 * Cost notes: the profile is written only when a shown value changes (at most every
 * PUBLISH_MIN_MS unless forced at the end of a session); leaderboards are cached for
 * CACHE_MS; the only realtime listener is on your own friendships (a handful of docs).
 */
import type { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { normalizeCode, pairId, sanitizeName } from './socialUtils';

export {
  liveStreak,
  liveWeekXp,
  normalizeCode,
  pairId,
  sanitizeName,
  weekKey,
  weekStart,
} from './socialUtils';

export type Visibility = 'everyone' | 'friends';

export interface PublicProfile {
  uid: string;
  name: string;
  photo: string | null;
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  lastDay: number;
  week: string;
  weekXp: number;
  badges: number;
  topBadges: string[];
  mastered: number;
  visibility: Visibility;
  code: string;
}

export interface ProfileStats {
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  lastDay: number;
  week: string;
  weekXp: number;
  badges: number;
  topBadges: string[];
  mastered: number;
}

export interface Friendship {
  id: string;
  users: string[];
  from: string;
  to: string;
  status: 'pending' | 'accepted';
  /** the other person */
  other: string;
}

export interface SocialState {
  uid: string | null;
  ready: boolean;
  me: PublicProfile | null;
  friendships: Friendship[];
  /** profiles of everyone in friendships (pending and accepted), when readable */
  people: Record<string, PublicProfile>;
}

const PUBLISH_MIN_MS = 30_000;
const CACHE_MS = 60_000;
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

let state: SocialState = { uid: null, ready: false, me: null, friendships: [], people: {} };
const listeners = new Set<() => void>();
let unsubFriendships: (() => void) | null = null;
let lastPublishedAt = 0;
let lastPublishedJson = '';
let pendingStats: ProfileStats | null = null;
let publishTimer: ReturnType<typeof setTimeout> | null = null;
const cache = new Map<string, { at: number; rows: PublicProfile[] }>();

function set(next: Partial<SocialState>) {
  state = { ...state, ...next };
  for (const fn of listeners) fn();
}

export function getSocialState(): SocialState {
  return state;
}

export function subscribeSocial(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Default public name: first name only (never the email). */
export function defaultName(user: User): string {
  const first = sanitizeName((user.displayName ?? '').split(' ')[0] ?? '');
  return first || `Learner ${user.uid.slice(0, 4).toUpperCase()}`;
}

/** 8 characters without look-alikes (no I, O, 0, 1); always contains a digit so it can't be a name. */
function randomCode(): string {
  for (;;) {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const code = Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
    if (/\d/.test(code)) return code;
  }
}

function fromDoc(uid: string, d: Record<string, unknown>): PublicProfile {
  return {
    uid,
    name: String(d.name ?? '?'),
    photo: typeof d.photo === 'string' ? d.photo : null,
    xp: Number(d.xp ?? 0),
    level: Number(d.level ?? 1),
    streak: Number(d.streak ?? 0),
    bestStreak: Number(d.bestStreak ?? 0),
    lastDay: Number(d.lastDay ?? 0),
    week: String(d.week ?? ''),
    weekXp: Number(d.weekXp ?? 0),
    badges: Number(d.badges ?? 0),
    topBadges: Array.isArray(d.topBadges) ? (d.topBadges as string[]).slice(0, 6) : [],
    mastered: Number(d.mastered ?? 0),
    visibility: d.visibility === 'friends' ? 'friends' : 'everyone',
    code: String(d.code ?? ''),
  };
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

function profileRef(uid: string) {
  return doc(db, 'profiles', uid);
}

async function claimCode(uid: string): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    try {
      await setDoc(doc(db, 'friendCodes', code), { uid });
      return code;
    } catch {
      // taken (create denied) — try another
    }
  }
  throw new Error('code');
}

async function writeProfile(p: PublicProfile): Promise<void> {
  const { uid, ...rest } = p;
  await setDoc(profileRef(uid), {
    ...rest,
    photo:
      rest.photo && /^https:\/\//.test(rest.photo) && rest.photo.length <= 600 ? rest.photo : null,
    nameLower: rest.name.toLowerCase(),
    bestStreak: Math.max(rest.bestStreak, rest.streak),
    weekXp: Math.min(rest.weekXp, rest.xp),
    topBadges: rest.topBadges.slice(0, 6),
    updatedAt: serverTimestamp(),
  });
  lastPublishedAt = Date.now();
  lastPublishedJson = JSON.stringify(p);
}

const EMPTY_STATS: ProfileStats = {
  xp: 0,
  level: 1,
  streak: 0,
  bestStreak: 0,
  lastDay: 0,
  week: '',
  weekXp: 0,
  badges: 0,
  topBadges: [],
  mastered: 0,
};

export async function startSocial(user: User): Promise<void> {
  stopSocial();
  set({ uid: user.uid, ready: false, me: null, friendships: [], people: {} });
  try {
    const snap = await getDoc(profileRef(user.uid));
    if (state.uid !== user.uid) return;
    let me: PublicProfile;
    if (snap.exists()) {
      me = fromDoc(user.uid, snap.data());
      lastPublishedJson = JSON.stringify(me);
    } else {
      const code = await claimCode(user.uid);
      me = {
        uid: user.uid,
        name: defaultName(user),
        photo: user.photoURL,
        visibility: 'everyone',
        code,
        ...(pendingStats ?? EMPTY_STATS),
      };
      await writeProfile(me);
    }
    set({ me, ready: true });
    if (pendingStats) void publishProfile(pendingStats, true);
  } catch {
    set({ ready: true });
  }
  listenFriendships(user.uid);
}

export function stopSocial() {
  unsubFriendships?.();
  unsubFriendships = null;
  if (publishTimer) clearTimeout(publishTimer);
  publishTimer = null;
  cache.clear();
  lastPublishedJson = '';
  set({ uid: null, ready: false, me: null, friendships: [], people: {} });
}

/**
 * Publish leaderboard stats. Skips the write when nothing visible changed; otherwise
 * writes at most every PUBLISH_MIN_MS (force = end of a session).
 */
export function publishProfile(stats: ProfileStats, force = false): Promise<void> {
  pendingStats = stats;
  const me = state.me;
  if (!me || !state.uid) return Promise.resolve();
  const next: PublicProfile = { ...me, ...stats };
  if (JSON.stringify(next) === lastPublishedJson) return Promise.resolve();
  const wait = force ? 0 : Math.max(0, lastPublishedAt + PUBLISH_MIN_MS - Date.now());
  if (publishTimer) clearTimeout(publishTimer);
  return new Promise((resolve) => {
    publishTimer = setTimeout(async () => {
      publishTimer = null;
      const latest: PublicProfile = { ...(state.me ?? me), ...(pendingStats ?? stats) };
      if (JSON.stringify(latest) === lastPublishedJson || !navigator.onLine) return resolve();
      try {
        await writeProfile(latest);
        set({ me: latest });
      } catch {
        // offline — next change retries
      }
      resolve();
    }, wait);
  });
}

export async function updateMyProfile(patch: { name?: string; visibility?: Visibility }) {
  const me = state.me;
  if (!me) return;
  const next: PublicProfile = {
    ...me,
    ...(patch.name !== undefined ? { name: sanitizeName(patch.name) || me.name } : {}),
    ...(patch.visibility ? { visibility: patch.visibility } : {}),
  };
  await writeProfile(next);
  cache.clear();
  set({ me: next });
}

// ---------------------------------------------------------------------------
// Friends
// ---------------------------------------------------------------------------

function listenFriendships(uid: string) {
  unsubFriendships?.();
  const q = query(collection(db, 'friendships'), where('users', 'array-contains', uid));
  unsubFriendships = onSnapshot(
    q,
    (snap) => {
      const list: Friendship[] = snap.docs.map((d) => {
        const data = d.data() as Omit<Friendship, 'id' | 'other'>;
        const other = data.users.find((u) => u !== uid) ?? '';
        return { id: d.id, ...data, other };
      });
      set({ friendships: list });
      void loadPeople(list.map((f) => f.other));
    },
    () => {
      // rules not deployed yet / offline
    },
  );
}

async function loadPeople(uids: string[]) {
  const missing = uids.filter((u) => u && !state.people[u]);
  if (missing.length === 0) return;
  const found = await fetchProfiles(missing);
  const people = { ...state.people };
  for (const p of found) people[p.uid] = p;
  set({ people });
}

export async function fetchProfiles(uids: string[]): Promise<PublicProfile[]> {
  const results = await Promise.all(
    uids.map(async (uid) => {
      try {
        const snap = await getDoc(profileRef(uid));
        return snap.exists() ? fromDoc(uid, snap.data()) : null;
      } catch {
        return null; // not visible to us
      }
    }),
  );
  return results.filter((p): p is PublicProfile => p !== null);
}

export type AddResult = 'sent' | 'accepted' | 'already' | 'pending' | 'self' | 'notFound' | 'error';

export async function addFriendByUid(otherUid: string): Promise<AddResult> {
  const uid = state.uid;
  if (!uid) return 'error';
  if (otherUid === uid) return 'self';
  const existing = state.friendships.find((f) => f.other === otherUid);
  if (existing?.status === 'accepted') return 'already';
  if (existing?.status === 'pending') {
    if (existing.to === uid) {
      await acceptFriend(existing.id);
      return 'accepted';
    }
    return 'pending';
  }
  try {
    await setDoc(doc(db, 'friendships', pairId(uid, otherUid)), {
      users: [uid, otherUid],
      from: uid,
      to: otherUid,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return 'sent';
  } catch {
    return 'error';
  }
}

export async function addFriendByCode(raw: string): Promise<AddResult> {
  const code = normalizeCode(raw);
  if (code.length !== 8) return 'notFound';
  try {
    const snap = await getDoc(doc(db, 'friendCodes', code));
    if (!snap.exists()) return 'notFound';
    return addFriendByUid(String(snap.data().uid));
  } catch {
    return 'error';
  }
}

export async function acceptFriend(id: string) {
  await updateDoc(doc(db, 'friendships', id), { status: 'accepted', updatedAt: serverTimestamp() });
  cache.delete('friends');
}

/** Decline a request, cancel your own request, or remove a friend. */
export async function removeFriendship(id: string) {
  await deleteDoc(doc(db, 'friendships', id));
  cache.delete('friends');
}

export async function searchPeople(raw: string): Promise<PublicProfile[]> {
  const q = raw.trim().toLowerCase();
  if (q.length < 2) return [];
  const snap = await getDocs(
    query(
      collection(db, 'profiles'),
      where('visibility', '==', 'everyone'),
      where('nameLower', '>=', q),
      where('nameLower', '<=', `${q}`),
      orderBy('nameLower'),
      limit(12),
    ),
  );
  return snap.docs.map((d) => fromDoc(d.id, d.data())).filter((p) => p.uid !== state.uid);
}

// ---------------------------------------------------------------------------
// Leaderboards
// ---------------------------------------------------------------------------

export type Board = 'friends' | 'weekGlobal' | 'xpGlobal';

export async function loadBoard(
  board: Board,
  currentWeek: string,
  fresh = false,
): Promise<PublicProfile[]> {
  const key = board === 'weekGlobal' ? `${board}:${currentWeek}` : board;
  const hit = cache.get(key);
  if (!fresh && hit && Date.now() - hit.at < CACHE_MS) return hit.rows;
  let rows: PublicProfile[];
  if (board === 'friends') {
    const ids = state.friendships.filter((f) => f.status === 'accepted').map((f) => f.other);
    // Reuse profiles already loaded for the friend list; only fetch the missing ones (or all on refresh).
    const known = fresh
      ? []
      : ids.map((id) => state.people[id]).filter((p): p is PublicProfile => !!p);
    const missing = ids.filter((id) => fresh || !state.people[id]);
    const fetched = missing.length ? await fetchProfiles(missing) : [];
    if (fetched.length) {
      const people = { ...state.people };
      for (const p of fetched) people[p.uid] = p;
      set({ people });
    }
    rows = [...known, ...fetched];
    if (state.me) rows.push(state.me);
  } else if (board === 'xpGlobal') {
    const snap = await getDocs(
      query(
        collection(db, 'profiles'),
        where('visibility', '==', 'everyone'),
        orderBy('xp', 'desc'),
        limit(50),
      ),
    );
    rows = snap.docs.map((d) => fromDoc(d.id, d.data()));
  } else {
    const snap = await getDocs(
      query(
        collection(db, 'profiles'),
        where('visibility', '==', 'everyone'),
        where('week', '==', currentWeek),
        orderBy('weekXp', 'desc'),
        limit(50),
      ),
    );
    rows = snap.docs.map((d) => fromDoc(d.id, d.data()));
  }
  cache.set(key, { at: Date.now(), rows });
  return rows;
}

/** Remove everything social for an account that is being deleted. */
export async function deleteSocialData(uid: string) {
  const fs = await getDocs(
    query(collection(db, 'friendships'), where('users', 'array-contains', uid)),
  );
  await Promise.all(fs.docs.map((d) => deleteDoc(d.ref).catch(() => {})));
  try {
    const p = await getDoc(profileRef(uid));
    const code = p.exists() ? String(p.data().code ?? '') : '';
    if (code) await deleteDoc(doc(db, 'friendCodes', code)).catch(() => {});
    if (p.exists()) await deleteDoc(profileRef(uid));
  } catch {
    // nothing to delete
  }
}

/** Development only: preview the social UI with sample data (no Firestore needed). */
export function _debugSocial(next: Partial<SocialState>) {
  if (!import.meta.env.DEV) return;
  cache.clear();
  set(next);
}

export function inviteUrl(code: string): string {
  return `${location.origin}${location.pathname}#friend=${code}`;
}

export function parseFriendHash(hash: string = location.hash): string | null {
  const m = hash.match(/^#friend=([A-Za-z0-9]{8})$/);
  return m ? normalizeCode(m[1]) : null;
}
