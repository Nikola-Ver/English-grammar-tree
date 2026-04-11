export interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Merge overlapping/adjacent client rects from a Range into one rect per visual
 * line.  This prevents doubled highlights when a selection crosses inline
 * element boundaries (each inline element produces its own DOMRect even though
 * they sit on the same line).
 */
export function rectsFromRange(range: Range): HighlightRect[] {
  const raw = Array.from(range.getClientRects())
    .filter((r) => r.width > 0 && r.height > 0)
    .map((r) => ({ top: r.top, left: r.left, width: r.width, height: r.height }));

  if (raw.length <= 1) return raw;

  raw.sort((a, b) => a.top - b.top || a.left - b.left);

  const merged: HighlightRect[] = [];
  let rowStart = 0;

  for (let i = 1; i <= raw.length; i++) {
    const sameRow =
      i < raw.length && Math.abs(raw[i].top - raw[rowStart].top) < raw[rowStart].height * 0.5;

    if (!sameRow) {
      const row = raw.slice(rowStart, i);
      const top = Math.min(...row.map((r) => r.top));
      const left = Math.min(...row.map((r) => r.left));
      const right = Math.max(...row.map((r) => r.left + r.width));
      const bottom = Math.max(...row.map((r) => r.top + r.height));
      merged.push({ top, left, width: right - left, height: bottom - top });
      rowStart = i;
    }
  }

  return merged;
}

/**
 * Same as rectsFromRange but returns coordinates relative to `container`'s
 * padding box so the rects can be positioned with `position: absolute` inside
 * the container and will scroll with it.
 */
export function rectsFromRangeInContainer(range: Range, container: Element): HighlightRect[] {
  const merged = rectsFromRange(range);
  const box = container.getBoundingClientRect();
  const bTop = container.clientTop;
  const bLeft = container.clientLeft;
  return merged.map((r) => ({
    top: r.top - box.top - bTop,
    left: r.left - box.left - bLeft,
    width: r.width,
    height: r.height,
  }));
}

/**
 * Compute an anchor point (center-x, bottom-y) for a range, returned in
 * container-relative coordinates for use with `position: absolute` panels.
 */
export function anchorFromRangeInContainer(
  range: Range,
  container: Element,
): { x: number; y: number } {
  const b = range.getBoundingClientRect();
  const box = container.getBoundingClientRect();
  return {
    x: (b.left + b.right) / 2 - box.left - container.clientLeft,
    y: b.bottom - box.top - container.clientTop,
  };
}

export function hlPosClass(index: number, total: number): string {
  if (total === 1) return 'hl-single';
  if (index === 0) return 'hl-first';
  if (index === total - 1) return 'hl-last';
  return '';
}
