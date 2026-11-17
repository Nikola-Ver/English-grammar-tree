/**
 * Draws the painted grammar tree on a canvas.
 *
 * The artwork (public/tree) is a bare tree cut into a trunk and six limbs, four meadows for the
 * time of day, and sprites for leaves, blossom and fruit. Every rule owns a few twig points; what
 * is drawn on them follows the rule's mastery, so the foliage is the learner's progress.
 *
 * Leaves are painted once per change into two layers per limb (behind and in front of the wood);
 * a frame only composes those layers, so the wind costs almost nothing.
 */
import type { TreeLayout, TreePoint } from '../../practice/treeLayout';
import { TREE_H, TREE_LIMBS, TREE_SPRITES, TREE_W } from '../../practice/treeMap';

export interface RuleLook {
  /** 0 not started … 4 mastered */
  stage: number;
  /** due for review: the tips yellow */
  wilting: boolean;
  /** keeps going wrong in real use: the whole spray yellows */
  shaky: boolean;
}

export interface LevelSign {
  name: string;
  done: number;
  total: number;
  crowned: boolean;
}

export interface TreeAssets {
  meadows: HTMLImageElement[];
  trunk: HTMLImageElement;
  limbs: HTMLImageElement[];
  sprites: Record<string, HTMLImageElement>;
}

export interface TreeScene {
  setState: (looks: RuleLook[], signs: LevelSign[]) => void;
  setSelected: (rule: number) => void;
  setHover: (rule: number) => void;
  /** rule under a pointer position, or -1 */
  ruleAt: (clientX: number, clientY: number) => number;
  setRunning: (on: boolean) => void;
  destroy: () => void;
}

const PHASES = ['night', 'sunrise', 'day', 'sunset'];
/** hour at which each phase starts fading into the next one */
const PHASE_ENDS = [5, 9, 17, 21];
/** colour laid over the tree in each phase: r, g, b, strength */
const TINTS = [
  [18, 28, 84, 0.5],
  [255, 170, 190, 0.1],
  [255, 255, 255, 0],
  [255, 140, 60, 0.15],
];
const SPRITE_NAMES = Object.keys(TREE_SPRITES);
const TAU = Math.PI * 2;

/** the tree is drawn smaller than the meadow and stands on its stones */
const SCALE = 0.86;
const OFF_X = 724 - 700 * SCALE;
const OFF_Y = 962 - 1050 * SCALE;
const LAYER_PAD = 130;
const SIGN_AT = [
  [185, 790],
  [1280, 790],
  [150, 372],
  [1335, 350],
  [300, 150],
  [1135, 140],
];
/** back to front, so the lower limbs overlap the upper ones */
const DRAW_ORDER = [4, 5, 2, 3, 0, 1];
const GRASS_Y = 936;
const GRASS_H = 74;

let assetsPromise: Promise<TreeAssets> | null = null;

export function loadTreeAssets(): Promise<TreeAssets> {
  if (assetsPromise) return assetsPromise;
  const base = `${import.meta.env.BASE_URL}tree/`;
  const load = (name: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`tree image missing: ${name}`));
      img.src = `${base}${name}.webp`;
    });
  assetsPromise = Promise.all([
    Promise.all(PHASES.map((p) => load(`meadow-${p}`))),
    load('trunk'),
    Promise.all(TREE_LIMBS.map((_, l) => load(`limb${l}`))),
    Promise.all(SPRITE_NAMES.map((n) => load(`spr_${n}`))),
  ]).then(([meadows, trunk, limbs, sprites]) => ({
    meadows,
    trunk,
    limbs,
    sprites: Object.fromEntries(SPRITE_NAMES.map((n, i) => [n, sprites[i]])),
  }));
  assetsPromise.catch(() => {
    assetsPromise = null;
  });
  return assetsPromise;
}

function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

/** How much of each phase to show at a given hour: one phase, or two while they cross-fade. */
export function phaseWeights(hour: number): number[] {
  const w = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    let d = hour - PHASE_ENDS[i];
    if (d > 12) d -= 24;
    if (d < -12) d += 24;
    if (Math.abs(d) < 0.5) {
      w[i] = 0.5 - d;
      w[(i + 1) % 4] = 0.5 + d;
      return w;
    }
  }
  w[hour >= 21 || hour < 5 ? 0 : hour < 9 ? 1 : hour < 17 ? 2 : 3] = 1;
  return w;
}

function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

function drawSign(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sign: LevelSign,
  gold: boolean,
) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(1.9, 1.9);
  ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.beginPath();
  ctx.roundRect(-25, -20, 52, 47, 7);
  ctx.fill();
  ctx.fillStyle = '#6b4420';
  ctx.strokeStyle = '#3d240e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-23, -2, 46, 25, 6);
  ctx.fill();
  ctx.stroke();
  const g = ctx.createLinearGradient(0, -23, 0, 3);
  g.addColorStop(0, gold ? '#fff6c0' : '#f3e3b6');
  g.addColorStop(1, gold ? '#f2c044' : '#d2ab6c');
  ctx.fillStyle = g;
  ctx.strokeStyle = '#8a5a22';
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.roundRect(-27, -23, 54, 27, 7);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-21, -19.5);
  ctx.lineTo(21, -19.5);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#6a3f14';
  ctx.font = "700 18px Georgia, 'Times New Roman', serif";
  ctx.fillText(sign.name, 0, -9);
  ctx.fillStyle = '#fff3d6';
  ctx.font = '700 12.5px Outfit, system-ui, sans-serif';
  ctx.fillText(`${sign.done}/${sign.total}`, 0, 11.5);
  if (sign.crowned) {
    ctx.font = '15px serif';
    ctx.fillText('👑', 0, -31);
  }
  if (gold) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,244,180,0.95)';
    sparkle(ctx, 24, -22, 8);
    sparkle(ctx, -25, -16, 4);
  }
  ctx.restore();
}

interface Layer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
}

interface Effect {
  kind: 'ring' | 'spark';
  x: number;
  y: number;
  r: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  colour: string;
  ground: number;
  rest: number;
}

export function createTreeScene(
  canvas: HTMLCanvasElement,
  assets: TreeAssets,
  layout: TreeLayout,
  options: { reduceMotion: boolean; titleOf: (rule: number) => string },
): TreeScene {
  canvas.width = TREE_W;
  canvas.height = TREE_H;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const make = (w: number, h: number) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return { canvas: c, ctx: c.getContext('2d') as CanvasRenderingContext2D };
  };
  const tree = make(TREE_W, TREE_H);
  const layer = (l: number): Layer => {
    const limb = TREE_LIMBS[l];
    return {
      ...make(limb.w + LAYER_PAD * 2, limb.h + LAYER_PAD * 2),
      x: limb.x - LAYER_PAD,
      y: limb.y - LAYER_PAD,
    };
  };
  const under = TREE_LIMBS.map((_, l) => layer(l));
  const over = TREE_LIMBS.map((_, l) => layer(l));
  const effects: Effect[][] = TREE_LIMBS.map(() => []);
  const full: boolean[] = TREE_LIMBS.map(() => false);

  // the grass in front of the roots, so the tree stands in the meadow instead of on it
  const grasses = assets.meadows.map((meadow) => {
    const g = make(TREE_W, GRASS_H);
    const k = meadow.height / TREE_H;
    g.ctx.drawImage(meadow, 0, GRASS_Y * k, meadow.width, GRASS_H * k, 0, 0, TREE_W, GRASS_H);
    g.ctx.globalCompositeOperation = 'destination-in';
    const fade = g.ctx.createLinearGradient(0, 0, 0, GRASS_H);
    fade.addColorStop(0, 'rgba(0,0,0,0)');
    fade.addColorStop(0.3, 'rgba(0,0,0,0.25)');
    fade.addColorStop(0.62, 'rgba(0,0,0,1)');
    g.ctx.fillStyle = fade;
    g.ctx.fillRect(0, 0, TREE_W, GRASS_H);
    return g.canvas;
  });

  const paths = layout.outlines.map((loops) => {
    const path = new Path2D();
    for (const p of loops) {
      path.moveTo(p[0], p[1]);
      for (let i = 2; i < p.length; i += 2) path.lineTo(p[i], p[i + 1]);
      path.closePath();
    }
    return path;
  });
  const limbOfRule: number[] = [];
  for (const p of layout.points) if (p.rule >= 0) limbOfRule[p.rule] = p.limb;

  // per-point variety, fixed so the foliage never reshuffles
  const variety = new Map<
    TreePoint,
    { v: number; flip: boolean; k: number; j: number; u: number }
  >();
  for (const p of layout.points) {
    const r = rng(p.seed);
    variety.set(p, {
      v: (r() * 4) | 0,
      flip: r() < 0.5,
      k: 0.86 + r() * 0.3,
      j: r() - 0.5,
      u: r(),
    });
  }
  const drawOrder = layout.byLimb.map((list) =>
    [...list].sort((a, b) => (variety.get(a)?.u ?? 0) - (variety.get(b)?.u ?? 0)),
  );

  let looks: RuleLook[] = [];
  let signs: LevelSign[] = [];
  let selected = -1;
  let hover = -1;
  let running = false;
  let frameId = 0;
  let last = 0;
  let lastDraw = 0;
  let nextLeaf = 0;
  let dirty = true;
  let destroyed = false;
  const shakeAt = TREE_LIMBS.map(() => -9);
  const angles = TREE_LIMBS.map(() => 0);
  const particles: Particle[] = [];

  function stamp(
    target: Layer,
    name: string,
    p: TreePoint,
    direction: number,
    size: number,
    flip: boolean,
  ) {
    const m = TREE_SPRITES[name];
    const c = target.ctx;
    c.save();
    c.translate(p.x - target.x, p.y - target.y);
    c.rotate(flip ? direction - (Math.PI - m[4]) : direction - m[4]);
    c.scale(flip ? -size : size, size);
    c.drawImage(assets.sprites[name], -m[2], -m[3]);
    c.restore();
  }

  function paintLimb(l: number) {
    const limb = TREE_LIMBS[l];
    const back = under[l];
    const front = over[l];
    back.ctx.clearRect(0, 0, back.canvas.width, back.canvas.height);
    front.ctx.clearRect(0, 0, front.canvas.width, front.canvas.height);
    const list = drawOrder[l];
    const rules = new Set(list.map((p) => p.rule).filter((r) => r >= 0));
    full[l] =
      rules.size > 0 &&
      [...rules].every(
        (r) => (looks[r]?.stage ?? 0) >= 3 && !looks[r]?.wilting && !looks[r]?.shaky,
      );
    const fx: Effect[] = [];
    const fruit: (() => void)[] = [];
    for (const p of list) {
      const look = looks[p.rule];
      const q = variety.get(p);
      if (!look || !q) continue;
      const s = look.stage;
      if (look.shaky) {
        if (p.tip || q.u < 0.55)
          stamp(front, 'wilt', p, Math.PI / 2 + q.j * 0.9, 0.5 * q.k, q.flip);
        if (p.first) fx.push({ kind: 'ring', x: p.x, y: p.y + 22, r: 34 });
        continue;
      }
      if (s <= 0) {
        if (p.tip || p.first) stamp(front, 'bud', p, p.a, 0.6 * q.k, q.flip);
        continue;
      }
      if (s === 1) {
        if (p.tip || p.first) stamp(front, `y${q.v}`, p, p.a, 0.5 * q.k, q.flip);
        else if (q.u < 0.3) stamp(front, `y${q.v}`, p, p.a, 0.36 * q.k, q.flip);
        continue;
      }
      const big = s >= 3;
      const yellow = look.wilting && p.tip;
      if (p.tip || big || q.u < 0.55) {
        stamp(back, `d${q.v}`, p, p.a + (q.flip ? 0.55 : -0.55), (big ? 0.74 : 0.56) * q.k, q.flip);
        if (yellow) stamp(front, 'wilt', p, Math.PI / 2 + q.j * 0.9, 0.5 * q.k, q.flip);
        else stamp(front, `g${q.v}`, p, p.a, (big ? 0.62 : 0.48) * q.k, q.flip);
        if (big && !yellow && (p.tip || q.u < 0.5)) {
          stamp(front, `g${(q.v + 1) % 4}`, p, p.a + (q.flip ? -1 : 1) * 0.95, 0.52 * q.k, q.flip);
        }
      }
      if (big && !yellow) {
        if (p.first && s === 3) fruit.push(() => stamp(front, 'blossom', p, p.a, 0.46, q.flip));
        else if (p.first) fruit.push(() => stamp(front, 'apple', p, Math.PI / 2, 0.3, false));
        else if (q.u < (full[l] ? 0.34 : 0.1)) {
          fruit.push(() => stamp(front, 'blossom', p, p.a + q.j, 0.36 * q.k, q.flip));
        }
      }
      if (full[l] && q.u > 0.86) {
        fx.push({ kind: 'spark', x: p.x + q.j * 40, y: p.y - 20, r: 9 + q.k * 8 });
      }
    }
    back.ctx.drawImage(assets.limbs[l], limb.x - back.x, limb.y - back.y);
    for (const draw of fruit) draw();
    effects[l] = fx;
  }

  function limbAngle(l: number, t: number) {
    if (options.reduceMotion) return 0;
    const wind =
      (Math.sin(t * 0.9 + l * 1.7) + 0.5 * Math.sin(t * 2.3 + l * 0.9)) *
      (0.6 + 0.4 * Math.sin(t * 0.23)) *
      0.0045;
    const dt = t - shakeAt[l];
    return wind + (dt < 3 ? Math.sin(dt * 11) * Math.exp(-dt * 2.4) * 0.02 : 0);
  }

  function withLimb(c: CanvasRenderingContext2D, l: number, draw: () => void) {
    const limb = TREE_LIMBS[l];
    c.save();
    c.translate(limb.px, limb.py);
    c.rotate(angles[l]);
    c.translate(-limb.px, -limb.py);
    draw();
    c.restore();
  }

  function dropLeaves(l: number, n: number) {
    const leafy = layout.byLimb[l].filter((p) => (looks[p.rule]?.stage ?? 0) >= 2);
    if (leafy.length === 0) return;
    for (let i = 0; i < n && particles.length < 60; i++) {
      const p = leafy[(Math.random() * leafy.length) | 0];
      const look = looks[p.rule];
      particles.push({
        x: p.x + (Math.random() - 0.5) * 50,
        y: p.y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.25) * 50,
        vy: 40 + Math.random() * 60,
        phase: Math.random() * 6,
        colour: look?.shaky
          ? '#d9a52e'
          : (look?.stage ?? 0) >= 3 && Math.random() < 0.5
            ? '#ffdbe6'
            : ['#6f9a2e', '#8fb23a', '#55852a'][(Math.random() * 3) | 0],
        ground: 1030 + Math.random() * 90,
        rest: 0,
      });
    }
  }

  function outline(path: Path2D, width: number, colour: string) {
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.lineWidth = width + 2.5;
    ctx.stroke(path);
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.stroke(path);
  }

  function highlight(rule: number, chosen: boolean) {
    const path = paths[rule];
    if (!path) return;
    ctx.fillStyle = chosen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.26)';
    ctx.fill(path);
    outline(path, 4.5, chosen ? '#ffe27a' : '#ffffff');
  }

  function nameTag(rule: number) {
    const at = layout.tagAt[rule];
    const text = options.titleOf(rule);
    if (!at || !text) return;
    ctx.save();
    ctx.font = '600 26px Outfit, system-ui, sans-serif';
    const w = Math.min(ctx.measureText(text).width + 28, (TREE_W - 40) / SCALE);
    const left = (20 - OFF_X) / SCALE + w / 2;
    const right = (TREE_W - 20 - OFF_X) / SCALE - w / 2;
    const x = Math.max(left, Math.min(right, at[0]));
    const y = Math.max((30 - OFF_Y) / SCALE, at[1] - 30);
    ctx.fillStyle = 'rgba(20,24,20,0.88)';
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - 22, w, 44, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + 1, w - 20);
    ctx.restore();
  }

  function render(t: number, dt: number) {
    const now = new Date();
    const w = phaseWeights(now.getHours() + now.getMinutes() / 60);
    const blend = (images: CanvasImageSource[], y: number) => {
      let first = true;
      for (let i = 0; i < 4; i++) {
        if (w[i] <= 0) continue;
        ctx.globalAlpha = first ? 1 : w[i];
        ctx.drawImage(images[i], 0, y, TREE_W, y === 0 ? TREE_H : GRASS_H);
        first = false;
      }
      ctx.globalAlpha = 1;
    };
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    blend(assets.meadows, 0);

    // shadow on the grass, deeper as the crown fills in and fainter at night
    ctx.setTransform(SCALE, 0, 0, SCALE, OFF_X, OFF_Y);
    let leafy = 0;
    for (const look of looks) if (look.stage >= 2) leafy++;
    const shade = (0.3 + (looks.length ? leafy / looks.length : 0) * 0.22) * (1 - 0.5 * w[0]);
    const shadow = ctx.createRadialGradient(700, 1050, 40, 700, 1050, 560);
    shadow.addColorStop(0, `rgba(20,50,10,${shade})`);
    shadow.addColorStop(1, 'rgba(20,50,10,0)');
    ctx.save();
    ctx.translate(700, 1050);
    ctx.scale(1, 0.13);
    ctx.translate(-700, -1050);
    ctx.fillStyle = shadow;
    ctx.fillRect(100, 400, 1200, 1300);
    ctx.restore();

    for (let l = 0; l < angles.length; l++) angles[l] = limbAngle(l, t);
    const tc = tree.ctx;
    tc.setTransform(1, 0, 0, 1, 0, 0);
    tc.clearRect(0, 0, TREE_W, TREE_H);
    tc.setTransform(SCALE, 0, 0, SCALE, OFF_X, OFF_Y);
    for (const l of DRAW_ORDER)
      withLimb(tc, l, () => tc.drawImage(under[l].canvas, under[l].x, under[l].y));
    tc.drawImage(assets.trunk, 0, 0);
    for (const l of DRAW_ORDER)
      withLimb(tc, l, () => tc.drawImage(over[l].canvas, over[l].x, over[l].y));
    let ta = 0;
    let tr = 0;
    let tg = 0;
    let tb = 0;
    for (let i = 0; i < 4; i++) {
      const k = w[i] * TINTS[i][3];
      ta += k;
      tr += TINTS[i][0] * k;
      tg += TINTS[i][1] * k;
      tb += TINTS[i][2] * k;
    }
    if (ta > 0.003) {
      tc.setTransform(1, 0, 0, 1, 0, 0);
      tc.globalCompositeOperation = 'source-atop';
      tc.fillStyle = `rgba(${Math.round(tr / ta)},${Math.round(tg / ta)},${Math.round(tb / ta)},${ta.toFixed(3)})`;
      tc.fillRect(0, 0, TREE_W, TREE_H);
      tc.globalCompositeOperation = 'source-over';
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(tree.canvas, 0, 0);
    blend(grasses, GRASS_Y);

    ctx.setTransform(SCALE, 0, 0, SCALE, OFF_X, OFF_Y);
    for (const l of DRAW_ORDER) {
      withLimb(ctx, l, () => {
        if (hover >= 0 && hover !== selected && limbOfRule[hover] === l) highlight(hover, false);
        if (selected >= 0 && limbOfRule[selected] === l) highlight(selected, true);
        for (const fx of effects[l]) {
          if (fx.kind === 'ring') {
            ctx.strokeStyle = '#ff3b30';
            ctx.lineWidth = 3.5;
            ctx.setLineDash([9, 7]);
            ctx.beginPath();
            ctx.arc(fx.x, fx.y, fx.r, 0, TAU);
            ctx.stroke();
            ctx.setLineDash([]);
          } else {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = `rgba(255,240,170,${0.55 + 0.4 * Math.sin(t * 3 + fx.x)})`;
            sparkle(ctx, fx.x, fx.y, fx.r);
            ctx.restore();
          }
        }
        if (signs[l]) drawSign(ctx, SIGN_AT[l][0], SIGN_AT[l][1], signs[l], full[l]);
      });
    }
    if (hover >= 0) nameTag(hover);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p.y < p.ground) {
        p.x += (p.vx + Math.sin(t * 3 + p.phase) * 60) * dt;
        p.y += p.vy * dt;
      } else {
        p.rest += dt;
        if (p.rest > 5) {
          particles.splice(i, 1);
          continue;
        }
      }
      ctx.globalAlpha = p.rest > 3 ? Math.max(0, 1 - (p.rest - 3) / 2) : 1;
      ctx.fillStyle = p.colour;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, 7, 3.4, p.rest ? p.phase : t * 2.5 + p.phase, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function frame(ms: number) {
    frameId = 0;
    if (destroyed || !running) return;
    // ~30 frames a second is plenty for a slow sway, and still: only when something changed
    if (ms - lastDraw >= 30 && (!options.reduceMotion || dirty)) {
      const t = ms / 1000;
      const dt = Math.min(0.1, t - last || 0);
      last = t;
      lastDraw = ms;
      dirty = false;
      if (!options.reduceMotion && t > nextLeaf) {
        nextLeaf = t + 0.6 + Math.random() * 1.2;
        dropLeaves((Math.random() * TREE_LIMBS.length) | 0, 1);
      }
      render(t, dt);
    }
    frameId = requestAnimationFrame(frame);
  }

  function wake() {
    dirty = true;
    if (running && !frameId && !destroyed) frameId = requestAnimationFrame(frame);
  }

  return {
    setState(nextLooks, nextSigns) {
      const changed = TREE_LIMBS.map((_, l) =>
        layout.byLimb[l].some((p) => {
          const a = looks[p.rule];
          const b = nextLooks[p.rule];
          return (
            !a !== !b ||
            (a && b && (a.stage !== b.stage || a.wilting !== b.wilting || a.shaky !== b.shaky))
          );
        }),
      );
      const firstPaint = looks.length === 0;
      looks = nextLooks;
      signs = nextSigns;
      changed.forEach((yes, l) => {
        if (!yes && !firstPaint) return;
        paintLimb(l);
        if (!firstPaint && !options.reduceMotion) {
          shakeAt[l] = performance.now() / 1000;
          dropLeaves(l, 6);
        }
      });
      wake();
    },
    setSelected(rule) {
      if (rule === selected) return;
      selected = rule;
      if (rule >= 0 && !options.reduceMotion) shakeAt[limbOfRule[rule]] = performance.now() / 1000;
      wake();
    },
    setHover(rule) {
      if (rule === hover) return;
      hover = rule;
      wake();
    },
    ruleAt(clientX, clientY) {
      const box = canvas.getBoundingClientRect();
      if (box.width === 0) return -1;
      const x = ((clientX - box.left) * TREE_W) / box.width;
      const y = ((clientY - box.top) * TREE_H) / box.height;
      return layout.hit((x - OFF_X) / SCALE, (y - OFF_Y) / SCALE);
    },
    setRunning(on) {
      if (on === running) return;
      running = on;
      if (on) wake();
      else if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    },
    destroy() {
      destroyed = true;
      if (frameId) cancelAnimationFrame(frameId);
    },
  };
}
