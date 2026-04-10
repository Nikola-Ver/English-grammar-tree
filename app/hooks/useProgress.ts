import { useState, useEffect } from 'react';
import { DATA } from '../data/grammar';
import type { Level } from '../data/grammar';

export type DoneMap = Record<string, boolean>;

const SK = 'eng_v4';

function loadDone(): DoneMap {
  try {
    return JSON.parse(localStorage.getItem(SK) || '{}');
  } catch {
    return {};
  }
}

function saveDone(d: DoneMap) {
  localStorage.setItem(SK, JSON.stringify(d));
}

export function countLevel(lvl: Level, done: DoneMap) {
  let total = 0, checked = 0;
  lvl.categories.forEach(cat => {
    cat.rules.forEach(r => {
      total++;
      if (done[r.id]) checked++;
    });
  });
  return { total, checked };
}

export function countAll(done: DoneMap) {
  let total = 0, checked = 0;
  DATA.forEach(lvl => {
    const x = countLevel(lvl, done);
    total += x.total;
    checked += x.checked;
  });
  return { total, checked };
}

export function useProgress() {
  const [done, setDone] = useState<DoneMap>(loadDone);

  useEffect(() => {
    saveDone(done);
  }, [done]);

  function toggleRule(id: string) {
    setDone(prev => {
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
