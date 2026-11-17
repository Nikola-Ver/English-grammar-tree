/**
 * The log of mistakes reported by the Claude connector, read from
 * users/{uid}/practice/claude (written by mcp/, never by the app except to delete entries).
 *
 * Cost: one document read at sign-in and at most one more every PULL_INTERVAL_MS when the
 * tab comes back; no listener. The list is cached in localStorage for display.
 */
import { deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { type ClaudeMistake, parseClaudeDoc } from './claude';

const LS_KEY = 'claude_log_v1';
const PULL_INTERVAL_MS = 10 * 60_000;

function load(): ClaudeMistake[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as ClaudeMistake[]) : [];
  } catch {
    return [];
  }
}

let list: ClaudeMistake[] = load();
let currentUid: string | null = null;
let lastPullAt = 0;
const listeners = new Set<() => void>();

function set(next: ClaudeMistake[]) {
  list = next;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  } catch {
    // storage full or blocked
  }
  for (const fn of listeners) fn();
}

function ref(uid: string) {
  return doc(db, 'users', uid, 'practice', 'claude');
}

export function getClaudeLog(): ClaudeMistake[] {
  return list;
}

export function subscribeClaudeLog(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export async function pullClaudeLog(uid: string, force = false): Promise<void> {
  if (currentUid !== uid) {
    currentUid = uid;
    lastPullAt = 0;
  }
  if (!force && Date.now() - lastPullAt < PULL_INTERVAL_MS) return;
  lastPullAt = Date.now();
  try {
    const snap = await getDoc(ref(uid));
    if (currentUid !== uid) return;
    set(snap.exists() ? parseClaudeDoc(snap.data()) : []);
  } catch {
    // offline: keep the cached list
  }
}

export function stopClaudeLog() {
  currentUid = null;
  lastPullAt = 0;
  if (list.length) set([]);
}

/** Remove one reported mistake (wrongly attributed, or simply unwanted). */
export async function deleteClaudeMistake(id: string): Promise<void> {
  const uid = currentUid;
  set(list.filter((m) => m.id !== id));
  if (!uid) return;
  await updateDoc(ref(uid), { [`m.${id}`]: deleteField(), updatedAt: Date.now() }).catch(() => {});
}

/** Remove everything Claude has reported. */
export async function clearClaudeLog(): Promise<void> {
  const uid = currentUid;
  set([]);
  if (!uid) return;
  await setDoc(ref(uid), { v: 1, m: {}, updatedAt: Date.now() }).catch(() => {});
}
