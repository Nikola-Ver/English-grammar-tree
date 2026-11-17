import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DoneMap } from '../../hooks/useProgress';
import type { PracticeIndex } from '../../practice/items';
import type { RuleMastery } from '../../practice/srs';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const W = 480;
const H = 520;
const CX = 240;
const GROUND = 478;
/** Branch length per level — longest in the middle, so the crown is round. */
const LENGTH = [150, 172, 182, 172, 146, 110];
const GOLDEN = 137.508;

interface Props {
  index: PracticeIndex;
  mastery: Map<string, RuleMastery>;
  done: DoneMap;
  bosses: Record<string, { best: number; passedAt?: number }>;
  selected: string | null;
  onSelect: (ruleId: string) => void;
  ruleTitle: (id: string) => string;
}

type Pt = [number, number];

function bez(p0: Pt, p1: Pt, p2: Pt, t: number): Pt {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
}

function tan(p0: Pt, p1: Pt, p2: Pt, t: number): Pt {
  const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  const l = Math.hypot(dx, dy) || 1;
  return [dx / l, dy / l];
}

/** Filled, tapering limb along a quadratic curve. */
function limb(p0: Pt, p1: Pt, p2: Pt, w0: number, w1: number): string {
  const n = 14;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const [x, y] = bez(p0, p1, p2, t);
    const [tx, ty] = tan(p0, p1, p2, t);
    const w = (w0 + (w1 - w0) * t) / 2;
    left.push(`${(x - ty * w).toFixed(1)},${(y + tx * w).toFixed(1)}`);
    right.push(`${(x + ty * w).toFixed(1)},${(y - tx * w).toFixed(1)}`);
  }
  return `M${left.join(' L')} L${right.reverse().join(' L')} Z`;
}

/** Trunk x-offset at height y (gentle S-curve). */
function trunkX(y: number): number {
  return CX + Math.sin((GROUND - y) / 95) * 7;
}

/** Trunk width at height y. */
function trunkW(y: number): number {
  const t = (GROUND - y) / (GROUND - 95);
  return 48 - 34 * Math.min(1, Math.max(0, t));
}

const LEAF = 'M0,0 C3,-4.4 8.5,-4.4 12,0 C8.5,4.4 3,4.4 0,0 Z';

interface LeafPos {
  id: string;
  x: number;
  y: number;
  angle: number;
}

interface Cluster {
  x: number;
  y: number;
  r: number;
  twig: string;
  leaves: LeafPos[];
}

interface Branch {
  lvl: string;
  i: number;
  side: number;
  path: string;
  origin: Pt;
  end: Pt;
  clusters: Cluster[];
  ids: string[];
}

/** The learner's grammar tree: a branch per CEFR level, a twig per topic, a leaf per rule. */
export function TreeView({ index, mastery, done, bosses, selected, onSelect, ruleTitle }: Props) {
  const { t } = useTranslation();

  const branches = useMemo<Branch[]>(() => {
    return LEVELS.map((lvl, i) => {
      const ids = index.grammarOrder.filter((id) => index.rules.get(id)?.levelId === lvl);
      const byCat = new Map<number, string[]>();
      for (const id of ids) {
        const c = index.rules.get(id)?.catIdx ?? 0;
        byCat.set(c, [...(byCat.get(c) ?? []), id]);
      }
      const side = i % 2 === 0 ? -1 : 1;
      const y0 = 404 - i * 54;
      const x0 = trunkX(y0) + side * trunkW(y0) * 0.3;
      const len = LENGTH[i];
      const rise = 46 + i * 7;
      const p0: Pt = [x0, y0];
      const p1: Pt = [x0 + side * len * 0.55, y0 + 4];
      const p2: Pt = [x0 + side * len, y0 - rise];
      const cats = [...byCat.entries()];
      const clusters: Cluster[] = cats.map(([, ruleIds], c) => {
        const tt = 0.3 + (0.66 * (c + 0.5)) / cats.length;
        const [bx, by] = bez(p0, p1, p2, tt);
        const [tx, ty] = tan(p0, p1, p2, tt);
        const up = c % 2 === 0 ? -1 : 1;
        // twig leaves the branch at ~45°, alternating above/below
        const ang = Math.atan2(ty, tx) + up * side * 0.85;
        const tl = 15 + Math.min(ruleIds.length, 6) * 2;
        const ex = bx + Math.cos(ang) * tl;
        const ey = by + Math.sin(ang) * tl - (up < 0 ? 4 : 0);
        const leaves = ruleIds.map((id, k) => {
          const r = 5.4 * Math.sqrt(k + 0.7);
          const th = ((k * GOLDEN + c * 40) * Math.PI) / 180;
          return {
            id,
            x: ex + Math.cos(th) * r,
            y: ey + Math.sin(th) * r,
            angle: (th * 180) / Math.PI,
          };
        });
        const r = 5.4 * Math.sqrt(ruleIds.length + 0.7) + 9;
        const mx = bx + (ex - bx) * 0.5 + up * 2;
        const my = by + (ey - by) * 0.5;
        return {
          x: ex,
          y: ey,
          r,
          twig: `M${bx.toFixed(1)},${by.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`,
          leaves,
        };
      });
      return {
        lvl,
        i,
        side,
        path: limb(p0, p1, p2, 13 - i * 0.9, 3),
        origin: p0,
        end: p2,
        clusters,
        ids,
      };
    });
  }, [index]);

  const trunk = useMemo(() => {
    const ys: number[] = [];
    for (let y = GROUND + 4; y >= 128; y -= 12) ys.push(y);
    const left = ys.map((y) => `${(trunkX(y) - trunkW(y) / 2).toFixed(1)},${y}`);
    const right = ys.map((y) => `${(trunkX(y) + trunkW(y) / 2).toFixed(1)},${y}`).reverse();
    return `M${left.join(' L')} Q${trunkX(118).toFixed(1)},112 ${right[0]} L${right.join(' L')} Z`;
  }, []);

  return (
    <svg
      className="pr-tree"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={t('practice.tree.aria')}
    >
      <defs>
        <linearGradient id="pr-bark" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--pr-bark-dark)" />
          <stop offset="0.45" stopColor="var(--pr-bark-light)" />
          <stop offset="1" stopColor="var(--pr-bark-dark)" />
        </linearGradient>
        <radialGradient id="pr-foliage">
          <stop offset="0" stopColor="var(--pr-foliage)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--pr-foliage)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pr-apple" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fda4af" />
          <stop offset="0.45" stopColor="#ef4444" />
          <stop offset="1" stopColor="#991b1b" />
        </radialGradient>
        <linearGradient id="pr-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--pr-grass)" />
          <stop offset="1" stopColor="var(--pr-grass)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* crown glow */}
      <ellipse cx={CX} cy={250} rx={215} ry={190} className="pr-crown" />

      {/* ground and roots */}
      <ellipse cx={CX} cy={GROUND + 14} rx={210} ry={26} fill="url(#pr-ground)" />
      {[-1, 1].map((s) =>
        [0, 1].map((k) => (
          <path
            key={`${s}${k}`}
            d={`M${CX + s * (8 + k * 10)},${GROUND - 4} Q${CX + s * (34 + k * 30)},${GROUND + 2} ${CX + s * (62 + k * 46)},${GROUND + 10 + k * 4}`}
            className="pr-root"
            strokeWidth={7 - k * 2.5}
          />
        )),
      )}

      {/* foliage behind each topic cluster — fuller as the level blooms */}
      {branches.map((b) => {
        let bloom = 0;
        for (const id of b.ids) bloom += Math.min(4, mastery.get(id)?.stage ?? 0);
        const pct = b.ids.length ? bloom / (b.ids.length * 4) : 0;
        return b.clusters.map((c, k) => (
          <circle
            // biome-ignore lint/suspicious/noArrayIndexKey: clusters are positional
            key={`${b.lvl}f${k}`}
            cx={c.x}
            cy={c.y}
            r={c.r + 6}
            fill="url(#pr-foliage)"
            opacity={0.18 + pct * 0.6}
          />
        ));
      })}

      <path d={trunk} fill="url(#pr-bark)" className="pr-trunk" />
      {/* leader shoot at the top of the crown */}
      <path
        d={`M${trunkX(126).toFixed(1)},126 Q${(trunkX(126) - 4).toFixed(1)},104 ${(trunkX(126) + 5).toFixed(1)},84`}
        className="pr-twig"
        strokeWidth={3}
      />
      <circle cx={trunkX(126) + 5} cy={80} r={16} fill="url(#pr-foliage)" opacity={0.35} />
      {[0, 1, 2, 3].map((k) => (
        <path
          key={k}
          d={`M${trunkX(GROUND - 30 - k * 85) - 6 + k * 3},${GROUND - 30 - k * 85} q4,-18 1,-34`}
          className="pr-bark-line"
        />
      ))}

      {branches.map((b) => {
        const passed = !!bosses[b.lvl]?.passedAt;
        let mastered = 0;
        for (const id of b.ids) if ((mastery.get(id)?.stage ?? 0) >= 3) mastered++;
        return (
          <g
            key={b.lvl}
            className="pr-branch"
            style={{
              transformOrigin: `${b.origin[0]}px ${b.origin[1]}px`,
              animationDelay: `${-b.i * 0.9}s`,
            }}
          >
            <path d={b.path} fill="url(#pr-bark)" className="pr-limb" />
            {b.clusters.map((c, k) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: clusters are positional
              <path key={k} d={c.twig} className="pr-twig" />
            ))}
            {b.clusters.flatMap((c) =>
              c.leaves.map((l) => {
                const m = mastery.get(l.id);
                const stage = m?.stage ?? 0;
                const claimed = stage < 2 && !!done[l.id];
                const wilt = !!m?.wilting;
                const label = `${ruleTitle(l.id)} — ${t(`practice.stage.name${claimed ? 'Claimed' : stage}`)}${wilt ? ` · ${t('practice.stage.wilting')}` : ''}`;
                const kind = wilt ? 'wilt' : claimed ? 'claimed' : `s${stage}`;
                return (
                  // biome-ignore lint/a11y/useSemanticElements: SVG group acting as a leaf button (no <button> inside SVG)
                  <g
                    key={l.id}
                    className={`pr-leaf ${kind}${selected === l.id ? ' sel' : ''}`}
                    transform={`translate(${l.x.toFixed(1)},${l.y.toFixed(1)})`}
                    onClick={() => onSelect(l.id)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(l.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={label}
                  >
                    <title>{label}</title>
                    <circle r={8.5} className="pr-leaf-hit" />
                    <g className="pr-leaf-art">
                      <g transform={`rotate(${(wilt ? l.angle + 50 : l.angle).toFixed(0)})`}>
                        {kind === 's0' && <ellipse rx={2.8} ry={2.1} className="pr-bud" />}
                        {(kind === 's1' ||
                          kind === 's2' ||
                          kind === 'claimed' ||
                          kind === 'wilt') && (
                          <g transform={kind === 's1' ? 'scale(0.7)' : undefined}>
                            <path d={LEAF} className="pr-leaf-shape" />
                            <path d="M1,0 L10.5,0" className="pr-leaf-vein" />
                          </g>
                        )}
                        {kind === 's3' && (
                          <g className="pr-flower">
                            {[0, 72, 144, 216, 288].map((a) => (
                              <ellipse
                                key={a}
                                rx={2.4}
                                ry={3.8}
                                transform={`rotate(${a}) translate(0,-3.4)`}
                                className="pr-petal"
                              />
                            ))}
                            <circle r={1.9} className="pr-flower-center" />
                          </g>
                        )}
                      </g>
                    </g>
                    {kind === 's4' && (
                      <g className="pr-apple">
                        <path d="M0,-5.6 q1,-3 3,-3.6" className="pr-apple-stem" />
                        <ellipse
                          cx={2.6}
                          cy={-7.6}
                          rx={2.4}
                          ry={1.2}
                          transform="rotate(-25 2.6 -7.6)"
                          className="pr-apple-leaf"
                        />
                        <circle r={5.4} fill="url(#pr-apple)" />
                        <circle cx={-1.8} cy={-1.8} r={1.2} className="pr-apple-shine" />
                      </g>
                    )}
                  </g>
                );
              }),
            )}
            <g
              transform={`translate(${Math.min(W - 28, Math.max(28, b.end[0] + b.side * 36)).toFixed(1)},${(b.end[1] + 6).toFixed(1)})`}
              className="pr-branch-sign"
            >
              <rect
                x={-25}
                y={-11}
                width={50}
                height={22}
                rx={6}
                style={{ fill: `var(--${b.lvl.toLowerCase()})` }}
              />
              <text y={4.5} textAnchor="middle" className="pr-sign-level">
                {passed ? '👑' : ''}
                {b.lvl}
              </text>
              <text y={25} textAnchor="middle" className="pr-sign-count">
                {mastered}/{b.ids.length}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
