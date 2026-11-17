/**
 * Lays the grammar rules out on the painted tree: which twig points belong to which rule,
 * and the area of the crown each rule owns (for hover, click and the outline).
 *
 * Pure module (no browser imports): shared by the tree scene and tests.
 */
import { TREE_H, TREE_LIMBS, TREE_W } from './treeMap.ts';

export interface TreePoint {
  x: number;
  y: number;
  /** direction the twig points in, rad (canvas axes: y grows downwards) */
  a: number;
  tip: boolean;
  limb: number;
  /** index of the rule in the flattened level order, -1 when the level has no rules */
  rule: number;
  /** the point that carries the rule's bud, blossom or apple */
  first: boolean;
  /** stable per-point number for varying the artwork */
  seed: number;
}

export interface TreeLayout {
  points: TreePoint[];
  byLimb: TreePoint[][];
  /** closed outlines per rule, each a flat [x, y, x, y, …] list in painting coordinates */
  outlines: number[][][];
  /** top centre of each rule's area, for its name tag */
  tagAt: [number, number][];
  /** rule under a point of the painting, or -1 */
  hit: (x: number, y: number) => number;
}

const STEP = 4;
const PAD = 92;
/** how far from its twig points a rule's area reaches */
const RADIUS = 52;
/** leaves sit a little beyond the twig point, so the area is centred there */
const LEAF_OFFSET = 22;

/** Smooth a closed polygon by cutting its corners once (Chaikin). */
function chaikin(p: number[]): number[] {
  const out: number[] = [];
  const n = p.length / 2;
  for (let i = 0; i < n; i++) {
    const x0 = p[i * 2];
    const y0 = p[i * 2 + 1];
    const x1 = p[((i + 1) % n) * 2];
    const y1 = p[((i + 1) % n) * 2 + 1];
    out.push(x0 * 0.75 + x1 * 0.25, y0 * 0.75 + y1 * 0.25);
    out.push(x0 * 0.25 + x1 * 0.75, y0 * 0.25 + y1 * 0.75);
  }
  return out;
}

/**
 * @param ruleCounts number of rules on each limb, in level order (A1 … C2)
 */
export function buildTreeLayout(ruleCounts: number[]): TreeLayout {
  const points: TreePoint[] = [];
  const byLimb: TreePoint[][] = [];
  let offset = 0;
  TREE_LIMBS.forEach((limb, l) => {
    const n = ruleCounts[l] ?? 0;
    const tips = limb.pts.filter((p) => p[3] === 1).length;
    const list: TreePoint[] = [];
    const seen = new Set<number>();
    let group = -1;
    limb.pts.forEach((p, j) => {
      if (p[3] === 1) group++;
      // rules follow the branch: whole twigs while there are enough, single points otherwise
      const local =
        n === 0
          ? -1
          : n <= tips
            ? Math.floor((Math.max(0, group) * n) / tips)
            : Math.min(n - 1, Math.floor((j * n) / limb.pts.length));
      const rule = local < 0 ? -1 : offset + local;
      const first = rule >= 0 && !seen.has(rule);
      if (first) seen.add(rule);
      const point: TreePoint = {
        x: p[0],
        y: p[1],
        a: p[2] / 100,
        tip: p[3] === 1,
        limb: l,
        rule,
        first,
        seed: points.length * 7919 + 3,
      };
      list.push(point);
      points.push(point);
    });
    byLimb.push(list);
    offset += n;
  });
  const total = offset;

  // nearest twig point for every cell of a coarse grid → one area per rule, no overlaps
  const gw = Math.ceil((TREE_W + PAD * 2) / STEP);
  const gh = Math.ceil((TREE_H + PAD * 2) / STEP);
  const label = new Int16Array(gw * gh).fill(-1);
  const dist = new Float32Array(gw * gh).fill(Number.POSITIVE_INFINITY);
  const reach = Math.ceil(RADIUS / STEP);
  for (const p of points) {
    if (p.rule < 0) continue;
    const sx = (p.x + Math.cos(p.a) * LEAF_OFFSET + PAD) / STEP;
    const sy = (p.y + Math.sin(p.a) * LEAF_OFFSET + PAD) / STEP;
    const cx = Math.round(sx);
    const cy = Math.round(sy);
    for (let y = Math.max(0, cy - reach); y <= Math.min(gh - 1, cy + reach); y++) {
      for (let x = Math.max(0, cx - reach); x <= Math.min(gw - 1, cx + reach); x++) {
        const d = (x + 0.5 - sx) ** 2 + (y + 0.5 - sy) ** 2;
        if (d > reach * reach) continue;
        const i = y * gw + x;
        if (d < dist[i]) {
          dist[i] = d;
          label[i] = p.rule;
        }
      }
    }
  }

  // boundary edges of every area, walked clockwise
  const vw = gw + 1;
  const edges: Map<number, number[]>[] = Array.from({ length: total }, () => new Map());
  const sumX = new Float64Array(total);
  const cells = new Uint32Array(total);
  const minY = new Float64Array(total).fill(Number.POSITIVE_INFINITY);
  const at = (x: number, y: number) =>
    x < 0 || y < 0 || x >= gw || y >= gh ? -1 : label[y * gw + x];
  const add = (k: number, from: number, to: number) => {
    const list = edges[k].get(from);
    if (list) list.push(to);
    else edges[k].set(from, [to]);
  };
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      const k = label[y * gw + x];
      if (k < 0) continue;
      sumX[k] += x;
      cells[k]++;
      if (y < minY[k]) minY[k] = y;
      const tl = y * vw + x;
      const tr = tl + 1;
      const bl = tl + vw;
      const br = bl + 1;
      if (at(x, y - 1) !== k) add(k, tl, tr);
      if (at(x + 1, y) !== k) add(k, tr, br);
      if (at(x, y + 1) !== k) add(k, br, bl);
      if (at(x - 1, y) !== k) add(k, bl, tl);
    }
  }

  const outlines: number[][][] = [];
  const tagAt: [number, number][] = [];
  for (let k = 0; k < total; k++) {
    const map = edges[k];
    const loops: number[][] = [];
    while (map.size > 0) {
      const start = map.keys().next().value as number;
      const verts: number[] = [];
      let v = start;
      for (let guard = 0; guard < 100000; guard++) {
        verts.push(v);
        const next = map.get(v);
        if (!next) break;
        const to = next.pop() as number;
        if (next.length === 0) map.delete(v);
        v = to;
        if (v === start) break;
      }
      if (verts.length < 8) continue;
      // edge midpoints turn the grid's stair-steps into diagonals
      const poly: number[] = [];
      for (let i = 0; i < verts.length; i++) {
        const a = verts[i];
        const b = verts[(i + 1) % verts.length];
        poly.push(
          (((a % vw) + (b % vw)) / 2) * STEP - PAD,
          ((Math.floor(a / vw) + Math.floor(b / vw)) / 2) * STEP - PAD,
        );
      }
      loops.push(chaikin(poly).map((n) => Math.round(n * 10) / 10));
    }
    outlines.push(loops);
    tagAt.push(
      cells[k] > 0 ? [(sumX[k] / cells[k]) * STEP - PAD, minY[k] * STEP - PAD] : [TREE_W / 2, 0],
    );
  }

  const hit = (x: number, y: number) => {
    const gx = Math.floor((x + PAD) / STEP);
    const gy = Math.floor((y + PAD) / STEP);
    return at(gx, gy);
  };

  return { points, byLimb, outlines, tagAt, hit };
}
