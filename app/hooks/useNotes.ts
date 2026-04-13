import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { SYNC_APPLIED_EVENT } from '../services/syncRegistry';
import { getNotesForContext, type StoredNote } from '../utils/notesStorage';

/**
 * Manages notes for a single context (rule or tense).
 *
 * Returns `[notes, setNotes]` — the same shape as `useState` so callers can
 * do optimistic updates (add / remove) immediately while also receiving
 * real-time updates pushed from Firestore sync.
 */
export function useNotes(
  contextId: string,
  contextType: 'rule' | 'tense',
  language: string,
): [StoredNote[], Dispatch<SetStateAction<StoredNote[]>>] {
  const [notes, setNotes] = useState<StoredNote[]>(() =>
    getNotesForContext(contextId, contextType, language),
  );

  // Reload when the context or language we're watching changes
  useEffect(() => {
    setNotes(getNotesForContext(contextId, contextType, language));
  }, [contextId, contextType, language]);

  // Reload whenever Firestore pushes new data into localStorage
  useEffect(() => {
    const handler = () => {
      setNotes((prev) => {
        const fresh = getNotesForContext(contextId, contextType, language);
        return JSON.stringify(fresh) === JSON.stringify(prev) ? prev : fresh;
      });
    };
    window.addEventListener(SYNC_APPLIED_EVENT, handler);
    return () => window.removeEventListener(SYNC_APPLIED_EVENT, handler);
  }, [contextId, contextType, language]);

  return [notes, setNotes];
}
