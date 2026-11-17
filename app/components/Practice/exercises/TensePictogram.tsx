import { TENSES } from '../../../data/tenses';
import type { TenseKey } from '../../../practice/content/types';

/** Compact timeline pictogram: past ← NOW → future, with the tense's shape. */
export function TensePictogram({ tense, size = 1 }: { tense: TenseKey; size?: number }) {
  const color = TENSES[tense]?.color ?? 'currentColor';
  const W = 120;
  const H = 46;
  const y = 28;
  const now = 60;
  const wave = (x1: number, x2: number) => {
    let d = `M${x1},${y}`;
    for (let x = x1; x < x2; x += 6) d += ' q3,-6 6,0';
    return <path d={d} fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" />;
  };
  const dot = (x: number, hollow = false) => (
    <circle
      cx={x}
      cy={y}
      r={4.2}
      fill={hollow ? 'var(--bg2)' : color}
      stroke={color}
      strokeWidth={2}
    />
  );
  const arrow = (x1: number, x2: number, dashed = false) => (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={x2 - 4}
        y2={y}
        stroke={color}
        strokeWidth={2.2}
        strokeDasharray={dashed ? '3 3' : undefined}
      />
      <path d={`M${x2},${y} l-6,-4 v8 z`} fill={color} />
    </g>
  );

  const shapes: Record<TenseKey, JSX.Element> = {
    present_simple: (
      <g>
        {[14, 32, 50, 68, 86, 104].map((x) => (
          <circle key={x} cx={x} cy={y} r={3} fill={color} />
        ))}
      </g>
    ),
    present_continuous: wave(44, 78),
    present_perfect: (
      <g>
        {dot(28)}
        {arrow(32, now, true)}
      </g>
    ),
    present_perfect_continuous: (
      <g>
        {wave(18, 54)}
        <path d={`M${now},${y} l-6,-4 v8 z`} fill={color} />
      </g>
    ),
    past_simple: dot(30),
    past_continuous: (
      <g>
        {wave(12, 46)}
        <line x1={34} y1={y - 10} x2={34} y2={y + 10} stroke="var(--text)" strokeWidth={2} />
      </g>
    ),
    past_perfect: (
      <g>
        {dot(14)}
        {arrow(18, 38, true)}
        {dot(42, true)}
      </g>
    ),
    past_perfect_continuous: (
      <g>
        {wave(8, 38)}
        {dot(42, true)}
      </g>
    ),
    future_will: dot(92),
    future_going_to: (
      <g>
        {arrow(now + 4, 88, true)}
        {dot(94)}
      </g>
    ),
    future_continuous: wave(78, 108),
    future_perfect: (
      <g>
        {dot(84)}
        {arrow(88, 104, true)}
        {dot(110, true)}
      </g>
    ),
    future_perfect_continuous: (
      <g>
        {wave(70, 104)}
        {dot(110, true)}
      </g>
    ),
  };

  return (
    <svg
      className="pr-picto"
      viewBox={`0 0 ${W} ${H}`}
      width={W * size}
      height={H * size}
      role="img"
      aria-label={TENSES[tense]?.name}
    >
      <line x1={4} y1={y} x2={W - 4} y2={y} stroke="var(--border2)" strokeWidth={1.5} />
      <line
        x1={now}
        y1={10}
        x2={now}
        y2={y + 12}
        stroke="var(--muted2)"
        strokeWidth={1.5}
        strokeDasharray="2 2"
      />
      <text x={now} y={8} textAnchor="middle" fontSize={7} fill="var(--muted2)">
        NOW
      </text>
      {shapes[tense]}
    </svg>
  );
}
