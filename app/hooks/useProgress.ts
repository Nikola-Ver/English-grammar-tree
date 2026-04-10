import { useEffect, useState } from 'react';
import type { Level } from '../data/grammar';
import { DATA } from '../data/grammar';

export type DoneMap = Record<string, boolean>;

const DEFAULT_SK = 'eng_v4';

function loadDone(sk: string): DoneMap {
  try {
    return JSON.parse(localStorage.getItem(sk) || '{}');
  } catch {
    return {};
  }
}

function saveDone(d: DoneMap, sk: string) {
  localStorage.setItem(sk, JSON.stringify(d));
}

export function countLevel(lvl: Level, done: DoneMap) {
  let total = 0,
    checked = 0;
  lvl.categories.forEach((cat) => {
    cat.rules.forEach((r) => {
      total++;
      if (done[r.id]) checked++;
    });
  });
  return { total, checked };
}

export function countAll(done: DoneMap, data: Level[] = DATA) {
  let total = 0,
    checked = 0;
  data.forEach((lvl) => {
    const x = countLevel(lvl, done);
    total += x.total;
    checked += x.checked;
  });
  return { total, checked };
}

export function useProgress(storageKey = DEFAULT_SK) {
  const [done, setDone] = useState<DoneMap>(() => loadDone(storageKey));

  useEffect(() => {
    saveDone(done, storageKey);
  }, [done, storageKey]);

  function toggleRule(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id]) delete next[id];
      return next;
    });
  }

  function resetAll() {
    setDone({});
  }

  return { done, toggleRule, resetAll };
}
