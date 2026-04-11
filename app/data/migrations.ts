import type { DoneMap } from '../hooks/useProgress';
import type { StoredNote } from '../utils/notesStorage';

export interface MigrationData {
  grammar: DoneMap;
  murphy: DoneMap;
  notes: StoredNote[];
}

export type Migration = (data: MigrationData) => MigrationData;

// Add entries here when content changes require data remapping.
// Each migration transforms data from version N-1 to N.
export const MIGRATIONS: Migration[] = [];
