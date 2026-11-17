/**
 * Syncs practice state to Firestore at users/{uid}/practice/state — cost-optimised:
 *
 *  - Reads: one getDoc on sign-in, and one more when the tab becomes visible again after
 *    PULL_INTERVAL_MS (to pick up another device). No realtime listener, so our own writes
 *    never come back as billed reads.
 *  - Writes: only the fields that changed since the last successful sync (practicePatch),
 *    sent with setDoc(..., { merge: true }); debounced to one write per burst of activity
 *    (PUSH_DEBOUNCE_MS, at most PUSH_MAX_WAIT_MS apart), flushed when the tab is hidden and
 *    when a session ends. A full overwrite happens only on first upload or after a reset.
 *  - Merge: per-item last-write-wins (mergeStates), so two devices can practise offline.
 */
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  applyRemote,
  getState,
  normalizeState,
  type PracticeState,
  practicePatch,
  setLocalChangeHook,
} from './store';

const PUSH_DEBOUNCE_MS = 4000;
const PUSH_MAX_WAIT_MS = 20_000;
const PULL_INTERVAL_MS = 3 * 60_000;

let currentUid: string | null = null;
/** What the server is known to hold (null = unknown → full upload). */
let lastSynced: PracticeState | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let firstPendingAt = 0;
let lastPullAt = 0;
let pushing: Promise<void> | null = null;
let ready = false;

function ref(uid: string) {
  return doc(db, 'users', uid, 'practice', 'state');
}

/** Firestore rejects `undefined`; a JSON round-trip drops those fields. */
function clean<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

async function pushNow(): Promise<void> {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;
  firstPendingAt = 0;
  const uid = currentUid;
  if (!uid || !ready || !navigator.onLine) return;
  if (pushing) await pushing;
  const cur = getState();
  const patch = practicePatch(cur, lastSynced);
  if (!patch) return;
  pushing = (async () => {
    try {
      if (patch === 'full') await setDoc(ref(uid), clean(cur));
      else await setDoc(ref(uid), clean(patch), { merge: true });
      if (currentUid === uid) lastSynced = cur;
    } catch {
      // offline / quota: keep lastSynced, the next push sends the accumulated diff
    } finally {
      pushing = null;
    }
  })();
  await pushing;
}

function schedulePush() {
  if (!currentUid) return;
  const now = Date.now();
  if (!firstPendingAt) firstPendingAt = now;
  const wait = Math.max(0, Math.min(PUSH_DEBOUNCE_MS, firstPendingAt + PUSH_MAX_WAIT_MS - now));
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => void pushNow(), wait);
}

async function pull(): Promise<void> {
  const uid = currentUid;
  if (!uid || !navigator.onLine) return;
  lastPullAt = Date.now();
  try {
    const snap = await getDoc(ref(uid));
    if (currentUid !== uid) return;
    if (snap.exists()) {
      const remote = normalizeState(snap.data() as Partial<PracticeState>);
      applyRemote(remote);
      lastSynced = remote;
    } else {
      lastSynced = null;
    }
    ready = true;
    // Upload whatever this device has that the server lacks.
    if (practicePatch(getState(), lastSynced)) await pushNow();
  } catch {
    // offline: stay local-first, retry on the next visibility/online event
  }
}

function onVisibility() {
  if (!currentUid) return;
  if (document.visibilityState === 'hidden') {
    void pushNow();
  } else if (Date.now() - lastPullAt > PULL_INTERVAL_MS) {
    void pull();
  }
}

function onPageHide() {
  if (currentUid) void pushNow();
}

function onOnline() {
  if (!currentUid) return;
  if (!ready) void pull();
  else void pushNow();
}

export function startPracticeSync(uid: string) {
  stopPracticeSync();
  currentUid = uid;
  ready = false;
  lastSynced = null;
  setLocalChangeHook(schedulePush);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('online', onOnline);
  void pull();
}

export function stopPracticeSync() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;
  firstPendingAt = 0;
  currentUid = null;
  lastSynced = null;
  ready = false;
  setLocalChangeHook(null);
  document.removeEventListener('visibilitychange', onVisibility);
  window.removeEventListener('pagehide', onPageHide);
  window.removeEventListener('online', onOnline);
}

/** Push pending changes right away (end of a session, so leaderboards are fresh). */
export function flushPracticeSync(): Promise<void> {
  return pushNow();
}

export async function deletePracticeData(uid: string) {
  await deleteDoc(ref(uid));
}
