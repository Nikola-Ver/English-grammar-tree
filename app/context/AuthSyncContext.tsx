import type { User } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CONTENT_VERSION } from '../data/contentVersion';
import type { MigrationData } from '../data/migrations';
import { MIGRATIONS } from '../data/migrations';
import { auth } from '../firebase';
import type { DoneMap } from '../hooks/useProgress';
import {
  deleteAllUserData,
  deleteNoteFromFirestore,
  getNotesCollection,
  getUserDoc,
  pushAllData,
  pushNote,
  subscribeToNotes,
  subscribeToUserDoc,
} from '../services/firestoreService';
import { loadMergePref, saveMergePref } from '../services/mergePref';
import {
  registerSyncCallbacks,
  SYNC_APPLIED_EVENT,
  unregisterSyncCallbacks,
} from '../services/syncRegistry';
import type { StoredNote } from '../utils/notesStorage';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

export interface AuthSyncContextValue {
  user: User | null;
  authLoading: boolean;
  syncStatus: SyncStatus;
  lastSyncAt: Date | null;
  mergeDialogVisible: boolean;
  onMergeChoice: (choice: 'merge' | 'replace', remember: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  syncNow: () => Promise<void>;
}

const LS_GRAMMAR = 'eng_v4';
const LS_MURPHY = 'murphy_v1';
const LS_GRAMMAR_TOMBSTONES = 'eng_v4_tombstones';
const LS_MURPHY_TOMBSTONES = 'murphy_v1_tombstones';
const LS_NOTES = 'eng-notes-v1';
const LS_THEME = 'theme-override';
const SYNC_DEBOUNCE_MS = 800;

// biome-ignore lint/suspicious/noExplicitAny: safe generic parse
function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readAllLocal() {
  return {
    grammar: safeParse<DoneMap>(localStorage.getItem(LS_GRAMMAR), {}),
    murphy: safeParse<DoneMap>(localStorage.getItem(LS_MURPHY), {}),
    grammarTombstones: safeParse<Record<string, number>>(
      localStorage.getItem(LS_GRAMMAR_TOMBSTONES),
      {},
    ),
    murphyTombstones: safeParse<Record<string, number>>(
      localStorage.getItem(LS_MURPHY_TOMBSTONES),
      {},
    ),
    notes: safeParse<StoredNote[]>(localStorage.getItem(LS_NOTES), []),
    theme: (() => {
      const v = localStorage.getItem(LS_THEME);
      return v === 'dark' || v === 'light' ? v : null;
    })() as 'dark' | 'light' | null,
  };
}

function hasData(grammar: DoneMap, murphy: DoneMap, notes: StoredNote[]): boolean {
  return (
    Object.values(grammar).some(Boolean) || Object.values(murphy).some(Boolean) || notes.length > 0
  );
}

// tombstones: rules explicitly unchecked locally — they veto re-import from remote
function mergeProgress(
  local: DoneMap,
  remote: Record<string, boolean>,
  tombstones: Record<string, number> = {},
): DoneMap {
  const result: DoneMap = { ...local };
  for (const k of Object.keys(remote)) {
    if (!(k in tombstones)) result[k] = true;
  }
  return result;
}

function mergeNotesList(local: StoredNote[], remote: Map<string, StoredNote>): StoredNote[] {
  const map = new Map<string, StoredNote>();
  for (const n of local) map.set(n.id, n);
  for (const [id, rn] of remote) {
    const ln = map.get(id);
    if (!ln || rn.updatedAt > ln.updatedAt) map.set(id, rn);
  }
  return Array.from(map.values());
}

function applyMigrations(data: MigrationData, fromVersion: number): MigrationData {
  let result = data;
  for (let i = fromVersion; i < CONTENT_VERSION; i++) {
    if (MIGRATIONS[i]) result = MIGRATIONS[i](result);
  }
  return result;
}

function getProvider(user: User): 'google' | 'password' {
  return user.providerData[0]?.providerId === 'google.com' ? 'google' : 'password';
}

// ---------------------------------------------------------------------------

export const AuthSyncContext = createContext<AuthSyncContextValue | null>(null);

export function useAuthSync(): AuthSyncContextValue {
  const ctx = useContext(AuthSyncContext);
  if (!ctx) throw new Error('useAuthSync must be used inside AuthSyncProvider');
  return ctx;
}

export function AuthSyncProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [mergeDialogResolve, setMergeDialogResolve] = useState<
    ((choice: 'merge' | 'replace') => void) | null
  >(null);

  const userRef = useRef<User | null>(null);
  const syncDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapshotUnsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // -------------------------------------------------------------------------
  // Core push
  // -------------------------------------------------------------------------

  const pushToFirestore = useCallback(async (currentUser: User): Promise<void> => {
    if (!navigator.onLine) {
      setSyncStatus('offline');
      return;
    }
    setSyncStatus('syncing');
    try {
      const { grammar, murphy, grammarTombstones, murphyTombstones, notes, theme } = readAllLocal();
      await pushAllData(
        currentUser.uid,
        grammar,
        murphy,
        grammarTombstones,
        murphyTombstones,
        notes,
        theme,
        getProvider(currentUser),
        currentUser.displayName ?? '',
        currentUser.email ?? '',
        currentUser.photoURL,
      );
      setLastSyncAt(new Date());
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  }, []);

  const schedulePush = useCallback(() => {
    if (!userRef.current) return;
    if (syncDebounceRef.current) clearTimeout(syncDebounceRef.current);
    syncDebounceRef.current = setTimeout(() => {
      if (userRef.current) pushToFirestore(userRef.current);
    }, SYNC_DEBOUNCE_MS);
  }, [pushToFirestore]);

  const handleNoteChanged = useCallback(
    async (note: StoredNote): Promise<void> => {
      if (!userRef.current) return;
      if (!navigator.onLine) {
        schedulePush();
        return;
      }
      try {
        await pushNote(userRef.current.uid, note);
      } catch {
        schedulePush();
      }
    },
    [schedulePush],
  );

  const handleNoteDeleted = useCallback(
    async (noteId: string): Promise<void> => {
      if (!userRef.current) return;
      if (!navigator.onLine) {
        schedulePush();
        return;
      }
      try {
        await deleteNoteFromFirestore(userRef.current.uid, noteId);
      } catch {
        schedulePush();
      }
    },
    [schedulePush],
  );

  // -------------------------------------------------------------------------
  // Pull & merge helpers
  // -------------------------------------------------------------------------

  const applyLocalWrite = useCallback(
    (
      grammar: DoneMap,
      murphy: DoneMap,
      notes: StoredNote[],
      theme: 'dark' | 'light' | null,
    ): void => {
      localStorage.setItem(LS_GRAMMAR, JSON.stringify(grammar));
      localStorage.setItem(LS_MURPHY, JSON.stringify(murphy));
      localStorage.setItem(LS_NOTES, JSON.stringify(notes));
      if (theme) localStorage.setItem(LS_THEME, theme);
      window.dispatchEvent(new CustomEvent(SYNC_APPLIED_EVENT));
    },
    [],
  );

  // -------------------------------------------------------------------------
  // On sign-in: pull cloud data, merge, setup listeners
  // -------------------------------------------------------------------------

  const handleUserSignedIn = useCallback(
    async (currentUser: User): Promise<void> => {
      // Clean up any previous listeners
      if (snapshotUnsubRef.current) {
        snapshotUnsubRef.current();
        snapshotUnsubRef.current = null;
      }

      setSyncStatus('syncing');
      try {
        const [cloudDoc, cloudNotes] = await Promise.all([
          getUserDoc(currentUser.uid),
          getNotesCollection(currentUser.uid),
        ]);

        const local = readAllLocal();
        const localHasData = hasData(local.grammar, local.murphy, local.notes);
        const cloudHasData =
          cloudDoc !== null &&
          hasData(
            cloudDoc.progress.grammar,
            cloudDoc.progress.murphy,
            Array.from(cloudNotes.values()),
          );

        if (localHasData && cloudHasData) {
          const savedPref = loadMergePref();
          const choice =
            savedPref !== 'ask'
              ? savedPref
              : await new Promise<'merge' | 'replace'>((resolve) => {
                  setMergeDialogResolve(() => resolve);
                });

          if (choice === 'merge') {
            // Run migrations on cloud data before merging
            const migratedCloud =
              cloudDoc && cloudDoc.contentVersion < CONTENT_VERSION
                ? applyMigrations(
                    {
                      grammar: cloudDoc.progress.grammar,
                      murphy: cloudDoc.progress.murphy,
                      notes: Array.from(cloudNotes.values()),
                    },
                    cloudDoc.contentVersion,
                  )
                : {
                    grammar: cloudDoc?.progress.grammar ?? {},
                    murphy: cloudDoc?.progress.murphy ?? {},
                    notes: Array.from(cloudNotes.values()),
                  };

            const merged = {
              grammar: mergeProgress(local.grammar, migratedCloud.grammar, local.grammarTombstones),
              murphy: mergeProgress(local.murphy, migratedCloud.murphy, local.murphyTombstones),
              notes: mergeNotesList(
                local.notes,
                new Map(migratedCloud.notes.map((n) => [n.id, n])),
              ),
              theme: local.theme ?? cloudDoc?.settings.theme ?? null,
            };
            applyLocalWrite(merged.grammar, merged.murphy, merged.notes, merged.theme);
          }
          // 'replace': keep local as-is, push will overwrite cloud
        } else if (cloudHasData && cloudDoc) {
          // Only cloud has data — import it, run migrations
          const migrated = applyMigrations(
            {
              grammar: cloudDoc.progress.grammar,
              murphy: cloudDoc.progress.murphy,
              notes: Array.from(cloudNotes.values()),
            },
            cloudDoc.contentVersion,
          );
          const theme = cloudDoc.settings.theme ?? local.theme;
          applyLocalWrite(migrated.grammar, migrated.murphy, migrated.notes, theme);
        }
        // else: only local has data or neither → just push local

        await pushToFirestore(currentUser);

        // Real-time listeners -------------------------------------------------
        const userDocUnsub = subscribeToUserDoc(currentUser.uid, (remoteDoc) => {
          if (!remoteDoc) return;
          const loc = readAllLocal();

          // Merge remote tombstones into local (union: most recent unmark per rule wins)
          const remoteTsGrammar = remoteDoc.progress.grammarTombstones ?? {};
          const remoteTsMurphy = remoteDoc.progress.murphyTombstones ?? {};
          const mergedTsGrammar: Record<string, number> = { ...loc.grammarTombstones };
          for (const [k, ts] of Object.entries(remoteTsGrammar)) {
            const remoteMs = ts.toMillis();
            if (!(k in mergedTsGrammar) || remoteMs > mergedTsGrammar[k]) {
              mergedTsGrammar[k] = remoteMs;
            }
          }
          const mergedTsMurphy: Record<string, number> = { ...loc.murphyTombstones };
          for (const [k, ts] of Object.entries(remoteTsMurphy)) {
            const remoteMs = ts.toMillis();
            if (!(k in mergedTsMurphy) || remoteMs > mergedTsMurphy[k]) {
              mergedTsMurphy[k] = remoteMs;
            }
          }

          const ng = mergeProgress(loc.grammar, remoteDoc.progress.grammar, mergedTsGrammar);
          const nm = mergeProgress(loc.murphy, remoteDoc.progress.murphy, mergedTsMurphy);

          let changed = false;
          const ngStr = JSON.stringify(ng);
          const nmStr = JSON.stringify(nm);
          const tsGStr = JSON.stringify(mergedTsGrammar);
          const tsMStr = JSON.stringify(mergedTsMurphy);
          if (ngStr !== localStorage.getItem(LS_GRAMMAR)) {
            localStorage.setItem(LS_GRAMMAR, ngStr);
            changed = true;
          }
          if (nmStr !== localStorage.getItem(LS_MURPHY)) {
            localStorage.setItem(LS_MURPHY, nmStr);
            changed = true;
          }
          if (tsGStr !== localStorage.getItem(LS_GRAMMAR_TOMBSTONES)) {
            localStorage.setItem(LS_GRAMMAR_TOMBSTONES, tsGStr);
          }
          if (tsMStr !== localStorage.getItem(LS_MURPHY_TOMBSTONES)) {
            localStorage.setItem(LS_MURPHY_TOMBSTONES, tsMStr);
          }
          const rt = remoteDoc.settings.theme;
          if (rt && rt !== localStorage.getItem(LS_THEME)) {
            localStorage.setItem(LS_THEME, rt);
            changed = true;
          }
          if (changed) window.dispatchEvent(new CustomEvent(SYNC_APPLIED_EVENT));
          if (remoteDoc.lastSyncAt) setLastSyncAt(remoteDoc.lastSyncAt.toDate());
        });

        const notesUnsub = subscribeToNotes(currentUser.uid, (remoteNotes) => {
          const loc = readAllLocal();
          const merged = mergeNotesList(loc.notes, remoteNotes);
          const mergedStr = JSON.stringify(merged);
          if (mergedStr !== localStorage.getItem(LS_NOTES)) {
            localStorage.setItem(LS_NOTES, mergedStr);
            window.dispatchEvent(new CustomEvent(SYNC_APPLIED_EVENT));
          }
        });

        snapshotUnsubRef.current = () => {
          userDocUnsub();
          notesUnsub();
        };
      } catch {
        setSyncStatus('error');
      }
    },
    [pushToFirestore, applyLocalWrite],
  );

  // -------------------------------------------------------------------------
  // Auth state listener
  // -------------------------------------------------------------------------

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);

      if (firebaseUser) {
        registerSyncCallbacks({
          onProgressChange: schedulePush,
          onNoteChanged: handleNoteChanged,
          onNoteDeleted: handleNoteDeleted,
        });
        await handleUserSignedIn(firebaseUser);
      } else {
        unregisterSyncCallbacks();
        setSyncStatus('idle');
        setLastSyncAt(null);
        if (snapshotUnsubRef.current) {
          snapshotUnsubRef.current();
          snapshotUnsubRef.current = null;
        }
      }
    });
    return () => unsub();
  }, [handleUserSignedIn, schedulePush, handleNoteChanged, handleNoteDeleted]);

  // -------------------------------------------------------------------------
  // Auth actions
  // -------------------------------------------------------------------------

  const signInWithGoogle = useCallback(async (): Promise<void> => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    unregisterSyncCallbacks();
    if (syncDebounceRef.current) clearTimeout(syncDebounceRef.current);
    if (snapshotUnsubRef.current) {
      snapshotUnsubRef.current();
      snapshotUnsubRef.current = null;
    }
    await firebaseSignOut(auth);
    setSyncStatus('idle');
    setLastSyncAt(null);
  }, []);

  const deleteAccount = useCallback(async (): Promise<void> => {
    if (!userRef.current) return;
    const uid = userRef.current.uid;
    unregisterSyncCallbacks();
    if (syncDebounceRef.current) clearTimeout(syncDebounceRef.current);
    if (snapshotUnsubRef.current) {
      snapshotUnsubRef.current();
      snapshotUnsubRef.current = null;
    }
    await deleteAllUserData(uid);
    localStorage.removeItem(LS_GRAMMAR);
    localStorage.removeItem(LS_MURPHY);
    localStorage.removeItem(LS_GRAMMAR_TOMBSTONES);
    localStorage.removeItem(LS_MURPHY_TOMBSTONES);
    localStorage.removeItem(LS_NOTES);
    localStorage.removeItem(LS_THEME);
    await deleteUser(userRef.current);
    setSyncStatus('idle');
    setLastSyncAt(null);
  }, []);

  const syncNow = useCallback(async (): Promise<void> => {
    if (userRef.current) await pushToFirestore(userRef.current);
  }, [pushToFirestore]);

  const onMergeChoice = useCallback(
    (choice: 'merge' | 'replace', remember: boolean): void => {
      if (remember) saveMergePref(choice);
      if (mergeDialogResolve) {
        mergeDialogResolve(choice);
        setMergeDialogResolve(null);
      }
    },
    [mergeDialogResolve],
  );

  return (
    <AuthSyncContext.Provider
      value={{
        user,
        authLoading,
        syncStatus,
        lastSyncAt,
        mergeDialogVisible: mergeDialogResolve !== null,
        onMergeChoice,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        deleteAccount,
        syncNow,
      }}
    >
      {children}
    </AuthSyncContext.Provider>
  );
}
