export type MergePref = 'merge' | 'replace' | 'ask';

const KEY = 'sync-merge-pref';

export function loadMergePref(): MergePref {
  const v = localStorage.getItem(KEY);
  if (v === 'merge' || v === 'replace') return v;
  return 'ask';
}

export function saveMergePref(pref: MergePref): void {
  localStorage.setItem(KEY, pref);
}
