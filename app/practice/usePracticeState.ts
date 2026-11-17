import { useSyncExternalStore } from 'react';
import { getState, type PracticeState, subscribe } from './store';

/** Live practice state (re-renders on every change). */
export function usePracticeState(): PracticeState {
  return useSyncExternalStore(subscribe, getState, getState);
}
