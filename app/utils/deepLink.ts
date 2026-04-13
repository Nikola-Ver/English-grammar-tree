export interface SelectionData {
  startPath: number[];
  startOffset: number;
  endPath: number[];
  endOffset: number;
  /** Optional message attached by the sender when locking a selection. */
  message?: string;
}

function encodeSelection(data: SelectionData): string {
  const core = [
    data.startPath.join('-'),
    data.startOffset,
    data.endPath.join('-'),
    data.endOffset,
  ].join(':');
  if (data.message) {
    // base64-encode so the message doesn't introduce colons or URL-unsafe chars
    const b64 = btoa(unescape(encodeURIComponent(data.message)));
    return `${core}:${b64}`;
  }
  return core;
}

function decodeSelection(encoded: string): SelectionData | null {
  const parts = encoded.split(':');
  if (parts.length < 4) return null;
  const [p0, p1, p2, p3, ...rest] = parts;
  const startPath = p0 ? p0.split('-').map(Number) : [];
  const startOffset = Number(p1);
  const endPath = p2 ? p2.split('-').map(Number) : [];
  const endOffset = Number(p3);
  if ([...startPath, startOffset, ...endPath, endOffset].some(Number.isNaN)) return null;
  let message: string | undefined;
  if (rest.length > 0) {
    try {
      message = decodeURIComponent(escape(atob(rest.join(':'))));
    } catch {
      // ignore malformed message
    }
  }
  return { startPath, startOffset, endPath, endOffset, message };
}

export interface ParsedDeepLink {
  ruleId?: string;
  tenseKey?: string;
  selectionData: SelectionData | null;
  /** Sender's UI language at the time the link was created. */
  lang: string | null;
}

/** Returns a shareable URL for a rule, optionally with a path-based selection. */
export function buildRuleUrl(ruleId: string, selectionData?: SelectionData, lang?: string): string {
  const base = `${location.origin}${location.pathname}`;
  let hash = `rule-${ruleId}`;
  if (lang) hash += `@${lang}`;
  if (selectionData) hash += `~${encodeSelection(selectionData)}`;
  return `${base}#${hash}`;
}

/** Reads the current URL hash and extracts rule ID, optional language and selection data. */
export function parseRuleHash(): ParsedDeepLink | null {
  const match = location.hash.match(/^#rule-([^@~\s]+?)(?:@([a-z]{2,3}))?(?:~(.+))?$/);
  if (!match) return null;
  return {
    ruleId: match[1],
    selectionData: match[3] ? decodeSelection(match[3]) : null,
    lang: match[2] ?? null,
  };
}

/** Returns a shareable URL for a tense, optionally with a path-based selection. */
export function buildTenseUrl(
  tenseKey: string,
  selectionData?: SelectionData,
  lang?: string,
): string {
  const base = `${location.origin}${location.pathname}`;
  let hash = `tense-${tenseKey}`;
  if (lang) hash += `@${lang}`;
  if (selectionData) hash += `~${encodeSelection(selectionData)}`;
  return `${base}#${hash}`;
}

/** Reads the current URL hash and extracts tense key, optional language and selection data. */
export function parseTenseHash(): ParsedDeepLink | null {
  const match = location.hash.match(/^#tense-([^@~\s]+?)(?:@([a-z]{2,3}))?(?:~(.+))?$/);
  if (!match) return null;
  return {
    tenseKey: match[1],
    selectionData: match[3] ? decodeSelection(match[3]) : null,
    lang: match[2] ?? null,
  };
}
