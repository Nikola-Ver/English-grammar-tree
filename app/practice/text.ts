/** Text helpers for turning rule content into exercises. */

const CYRILLIC = /[Ѐ-ӿ]/;

export function hasCyrillic(s: string): boolean {
  return CYRILLIC.test(s);
}

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function tokenize(s: string): string[] {
  return s.trim().split(/\s+/).filter(Boolean);
}

/** Normalised token for comparison: lowercase, curly quotes → straight, edge punctuation removed. */
export function normToken(t: string): string {
  return t
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/^[("'«]+|[.,!?;:)"'»]+$/g, '');
}

/** Normalised sentence for answer comparison. */
export function normSentence(s: string): string {
  return tokenize(s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"'))
    .map((t) => t.toLowerCase())
    .join(' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/[.!]+$/, '')
    .trim();
}

/**
 * Single-region diff between two token lists (common prefix + common suffix).
 * Returns the differing slices: a[aStart..aEnd), b[bStart..bEnd).
 */
export function diffRegion(a: string[], b: string[]) {
  const na = a.map(normToken);
  const nb = b.map(normToken);
  let pre = 0;
  while (pre < na.length && pre < nb.length && na[pre] === nb[pre]) pre++;
  let suf = 0;
  while (
    suf < na.length - pre &&
    suf < nb.length - pre &&
    na[na.length - 1 - suf] === nb[nb.length - 1 - suf]
  )
    suf++;
  return { aStart: pre, aEnd: na.length - suf, bStart: pre, bEnd: nb.length - suf };
}

export interface MistakePair {
  wrong: string;
  right: string;
}

const RIGHT_CUT = /\s+[—–]\s+|\s+-\s+|\s+\(|\s*;\s+/;

/**
 * Parse `<s>wrong</s> → right — explanation` into a wrong/right sentence pair.
 * Handles fragments on the right ("→ should <em>see</em>") by patching them into the wrong sentence.
 * Returns null when the line cannot be turned into a clean, fully-English pair.
 */
export function parseMistake(line: string): MistakePair | null {
  const m = line.match(/<s>([\s\S]*?)<\/s>\s*(?:→|->)\s*([\s\S]*)$/);
  if (!m) return null;
  const wrong = stripHtml(m[1]);
  let rightRaw = stripHtml(m[2]);
  const cut = rightRaw.search(RIGHT_CUT);
  if (cut > 0) rightRaw = rightRaw.slice(0, cut);
  rightRaw = rightRaw.trim();
  if (!wrong || !rightRaw) return null;
  if (hasCyrillic(wrong) || hasCyrillic(rightRaw)) return null;
  if (/\.\.\.|…|\/|=|\+/.test(wrong) || /\.\.\.|…|\/|=|\+/.test(rightRaw)) return null;

  const wt = tokenize(wrong);
  let rt = tokenize(rightRaw);
  if (wt.length < 2 || rt.length < 1) return null;

  const firstIsLower = /^[a-z]/.test(rt[0]);
  const wrongStartsUpper = /^[A-Z]/.test(wt[0]);
  if (firstIsLower && wrongStartsUpper && rt.length < wt.length + 2) {
    // Fragment: patch it into the wrong sentence.
    const nw = wt.map(normToken);
    const i = nw.indexOf(normToken(rt[0]));
    if (i < 0) return null;
    const lastNorm = normToken(rt[rt.length - 1]);
    // the replaced span is roughly as long as the correction (at most one token shorter)
    const minJ = i + Math.max(0, rt.length - 2);
    let j = -1;
    for (let k = nw.length - 1; k >= minJ; k--) {
      if (nw[k] === lastNorm) {
        j = k;
        break;
      }
    }
    if (j < 0) {
      // the corrected word usually shares a stem with the wrong one (complete/completed, build/built)
      const stem = lastNorm.slice(0, 3);
      for (let k = nw.length - 1; k >= minJ; k--) {
        if (stem.length === 3 && nw[k].startsWith(stem)) {
          j = k;
          break;
        }
      }
    }
    if (j < 0) return null;
    rt = [...wt.slice(0, i), ...rt, ...wt.slice(j + 1)];
  }
  // Carry final punctuation of the wrong sentence over when the right one lacks it.
  const lastW = wt[wt.length - 1];
  const lastR = rt[rt.length - 1];
  const punct = lastW.match(/[.!?]$/)?.[0];
  if (punct && !/[.!?]$/.test(lastR)) rt = [...rt.slice(0, -1), lastR + punct];

  // A correction that is much shorter than the wrong sentence and ends differently was
  // truncated by the author ("<s>She is going to school every day</s> → She goes").
  if (wt.length - rt.length >= 2 && normToken(wt[wt.length - 1]) !== normToken(rt[rt.length - 1])) {
    return null;
  }
  const right = rt.join(' ');
  if (normSentence(wrong) === normSentence(right)) return null;
  if (rt.length < 2) return null;
  return { wrong, right };
}

/** "she is" → "She is" */
export function capitalize(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
