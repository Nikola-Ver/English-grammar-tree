import type { StoredNote } from '../utils/notesStorage';

interface SyncCallbacks {
  onProgressChange: () => void;
  onNoteChanged: (note: StoredNote) => void;
  onNoteDeleted: (noteId: string) => void;
}

let callbacks: SyncCallbacks | null = null;

export function registerSyncCallbacks(cbs: SyncCallbacks): void {
  callbacks = cbs;
}

export function unregisterSyncCallbacks(): void {
  callbacks = null;
}

export function notifyProgressChanged(): void {
  callbacks?.onProgressChange();
}

export function notifyNoteChanged(note: StoredNote): void {
  callbacks?.onNoteChanged(note);
}

export function notifyNoteDeleted(noteId: string): void {
  callbacks?.onNoteDeleted(noteId);
}

/** Custom event dispatched when Firestore data is applied to localStorage. */
export const SYNC_APPLIED_EVENT = 'firestore-sync-applied';
