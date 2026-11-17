import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PracticeIndex } from '../../practice/items';
import { dayKey, dayNumber, inMistakeDeck, type RuleMastery } from '../../practice/srs';
import type { PracticeState } from '../../practice/store';

interface Props {
  state: PracticeState;
  index: PracticeIndex;
  mastery: Map<string, RuleMastery>;
  ruleTitle: (id: string) => string;
  onPractiseRule: (id: string) => void;
}

interface Tip {
  /** which chart the tooltip belongs to — each card shows only its own */
  chart: 'xp' | 'heat';
  x: number;
  y: number;
  text: string;
}

const GROUPS: { id: string; label: string; track: 'grammar' | 'murphy' | 'words' }[] = [
  { id: 'A1', label: 'A1', track: 'grammar' },
  { id: 'A2', label: 'A2', track: 'grammar' },
  { id: 'B1', label: 'B1', track: 'grammar' },
  { id: 'B2', label: 'B2', track: 'grammar' },
  { id: 'C1', label: 'C1', track: 'grammar' },
  { id: 'C2', label: 'C2', track: 'grammar' },
  { id: 'EL', label: 'Murphy EL', track: 'murphy' },
  { id: 'INT', label: 'Murphy INT', track: 'murphy' },
  { id: 'ADV', label: 'Murphy ADV', track: 'murphy' },
  { id: 'WORDS', label: '', track: 'words' },
];

export function ProgressPanel({ state, index, mastery, ruleTitle, onPractiseRule }: Props) {
  const { t, i18n } = useTranslation();
  const [tip, setTip] = useState<Tip | null>(null);
  const today = dayNumber();

  const totals = useMemo(() => {
    let n = 0;
    let c = 0;
    let ms = 0;
    for (const d of Object.values(state.days)) {
      n += d.n;
      c += d.c;
      ms += d.ms;
    }
    let inReview = 0;
    let deck = 0;
    for (const st of Object.values(state.items)) {
      if (st.b >= 1) inReview++;
      if (inMistakeDeck(st)) deck++;
    }
    return { n, c, minutes: Math.round(ms / 60000), inReview, deck };
  }, [state]);

  const xpDays = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const d = today - 13 + i;
        return { d, xp: state.days[dayKey(d)]?.xp ?? 0 };
      }),
    [state.days, today],
  );
  const maxXp = Math.max(state.settings.goal, ...xpDays.map((x) => x.xp));

  const heat = useMemo(() => {
    const weeks = 16;
    // columns are Monday-based weeks; the last column is the current week
    const todayDow = (new Date(today * 86_400_000).getUTCDay() + 6) % 7;
    const first = today - todayDow - (weeks - 1) * 7;
    const cells: { d: number; xp: number; col: number; row: number }[] = [];
    for (let d = first; d <= today; d++) {
      const k = d - first;
      cells.push({ d, xp: state.days[dayKey(d)]?.xp ?? 0, col: Math.floor(k / 7), row: k % 7 });
    }
    return cells;
  }, [state.days, today]);
  const goal = state.settings.goal;
  const heatLevel = (xp: number) =>
    xp <= 0 ? 0 : xp < goal * 0.5 ? 1 : xp < goal ? 2 : xp < goal * 2 ? 3 : 4;
  const frozen = new Set(state.streak.frozen);

  const levels = useMemo(
    () =>
      GROUPS.map((g) => {
        const order =
          g.track === 'grammar'
            ? index.grammarOrder
            : g.track === 'murphy'
              ? index.murphyOrder
              : index.wordsOrder;
        const ids = order.filter((id) => index.rules.get(id)?.levelId === g.id);
        const counts = [0, 0, 0, 0, 0];
        for (const id of ids) counts[mastery.get(id)?.stage ?? 0]++;
        return { ...g, total: ids.length, counts };
      }).filter((g) => g.total > 0),
    [index, mastery],
  );

  const weakest = useMemo(() => {
    const rows: { id: string; acc: number }[] = [];
    for (const [id, m] of mastery) {
      if (m.accuracy !== null && m.seen >= 2) {
        let n = 0;
        for (const iid of index.byRule.get(id) ?? []) n += state.items[iid]?.n ?? 0;
        if (n >= 4) rows.push({ id, acc: m.accuracy });
      }
    }
    return rows.sort((a, b) => a.acc - b.acc).slice(0, 5);
  }, [mastery, index, state.items]);

  const show = (e: React.MouseEvent | React.FocusEvent, text: string, chart: Tip['chart']) => {
    const host = (e.currentTarget as Element).closest('.pr-chart-card')?.getBoundingClientRect();
    const r = (e.currentTarget as Element).getBoundingClientRect();
    if (!host) return;
    setTip({ chart, x: r.left - host.left + r.width / 2, y: r.top - host.top, text });
  };
  const hide = () => setTip(null);
  const fmtDay = (d: number) =>
    new Date(d * 86_400_000).toLocaleDateString(i18n.language, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    });

  return (
    <div className="pr-progress-panel">
      <div className="pr-tiles">
        <div className="pr-tile-stat">
          <b>{totals.n}</b>
          <span>{t('practice.progress.answers')}</span>
        </div>
        <div className="pr-tile-stat">
          <b>{totals.n ? Math.round((totals.c / totals.n) * 100) : 0}%</b>
          <span>{t('practice.progress.accuracy')}</span>
        </div>
        <div className="pr-tile-stat">
          <b>{totals.minutes}</b>
          <span>{t('practice.progress.minutes')}</span>
        </div>
        <div className="pr-tile-stat">
          <b>{totals.inReview}</b>
          <span>{t('practice.progress.inReview')}</span>
        </div>
        <div className="pr-tile-stat">
          <b>{state.streak.best}</b>
          <span>{t('practice.progress.bestStreak')}</span>
        </div>
      </div>

      <div className="pr-charts">
        <div className="pr-chart-card">
          <div className="pr-chart-title">{t('practice.progress.xpChart')}</div>
          <svg
            viewBox="0 0 280 120"
            className="pr-chart"
            role="img"
            aria-label={t('practice.progress.xpChart')}
          >
            <line x1={0} x2={280} y1={100} y2={100} className="pr-axis" />
            <line
              x1={0}
              x2={280}
              y1={100 - (goal / maxXp) * 88}
              y2={100 - (goal / maxXp) * 88}
              className="pr-goal-rule"
            />
            <text
              x={2}
              y={100 - (goal / maxXp) * 88 - 3}
              textAnchor="start"
              className="pr-chart-note"
            >
              {t('practice.progress.goal', { xp: goal })}
            </text>
            {xpDays.map((x, i) => {
              const h = (x.xp / maxXp) * 88;
              const bx = 4 + i * 19.6;
              return (
                <g key={x.d}>
                  <rect
                    x={bx}
                    y={100 - Math.max(h, 0)}
                    width={13}
                    height={Math.max(h, 0)}
                    rx={Math.min(4, h / 2)}
                    className={`pr-bar${x.xp >= goal ? ' met' : ''}`}
                  />
                  <rect
                    x={bx - 3}
                    y={0}
                    width={19}
                    height={100}
                    className="pr-hit"
                    tabIndex={0}
                    onMouseEnter={(e) => show(e, `${fmtDay(x.d)}: ${x.xp} XP`, 'xp')}
                    onFocus={(e) => show(e, `${fmtDay(x.d)}: ${x.xp} XP`, 'xp')}
                    onMouseLeave={hide}
                    onBlur={hide}
                  />
                  {i % 2 === 1 && (
                    <text x={bx + 6.5} y={113} textAnchor="middle" className="pr-chart-tick">
                      {new Date(x.d * 86_400_000).getUTCDate()}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          {tip?.chart === 'xp' && (
            <div className="pr-tip" style={{ left: tip.x, top: tip.y }}>
              {tip.text}
            </div>
          )}
        </div>

        <div className="pr-chart-card">
          <div className="pr-chart-title">{t('practice.progress.activity')}</div>
          <svg
            viewBox="0 0 250 92"
            className="pr-chart"
            role="img"
            aria-label={t('practice.progress.activity')}
          >
            {heat.map((c) => (
              <rect
                key={c.d}
                x={c.col * 15.4}
                y={c.row * 12.6}
                width={12.6}
                height={10.6}
                rx={2.5}
                className={`pr-heat h${heatLevel(c.xp)}${c.d === today ? ' today' : ''}`}
                tabIndex={-1}
                onMouseEnter={(e) =>
                  show(
                    e,
                    `${fmtDay(c.d)}: ${c.xp} XP${frozen.has(c.d) ? ` · ❄️ ${t('practice.progress.frozen')}` : ''}`,
                    'heat',
                  )
                }
                onMouseLeave={hide}
              />
            ))}
          </svg>
          <div className="pr-legend-row">
            <span>{t('practice.progress.less')}</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} className={`pr-heat-swatch h${l}`} />
            ))}
            <span>{t('practice.progress.more')}</span>
          </div>
          {tip?.chart === 'heat' && (
            <div className="pr-tip" style={{ left: tip.x, top: tip.y }}>
              {tip.text}
            </div>
          )}
        </div>
      </div>

      <div className="pr-chart-card wide">
        <div className="pr-chart-title">{t('practice.progress.masteryChart')}</div>
        <div className="pr-legend-row">
          {[1, 2, 3, 4].map((s) => (
            <span key={s} className="pr-legend-item">
              <span className={`pr-stack-swatch s${s}`} /> {t(`practice.stage.icon${s}`)}{' '}
              {t(`practice.stage.name${s}`)}
            </span>
          ))}
          <span className="pr-legend-item">
            <span className="pr-stack-swatch s0" /> {t('practice.stage.name0')}
          </span>
        </div>
        <div className="pr-stack-list">
          {levels.map((g) => (
            <div key={g.id} className="pr-stack-row">
              <span className="pr-stack-label">{g.label || t('practice.progress.wordsRow')}</span>
              <div className="pr-stack">
                {[4, 3, 2, 1, 0].map((s) =>
                  g.counts[s] > 0 ? (
                    <span
                      key={s}
                      className={`pr-stack-seg s${s}`}
                      style={{ flexGrow: g.counts[s] }}
                      title={`${g.label} · ${t(`practice.stage.name${s}`)}: ${g.counts[s]}`}
                    />
                  ) : null,
                )}
              </div>
              <span className="pr-stack-num">
                {g.counts[3] + g.counts[4]}/{g.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {weakest.length > 0 && (
        <div className="pr-chart-card wide">
          <div className="pr-chart-title">{t('practice.progress.weakest')}</div>
          {weakest.map((w) => (
            <div key={w.id} className="pr-weak-row">
              <span className="pr-weak-acc">{Math.round(w.acc * 100)}%</span>
              <span className="pr-weak-title">{ruleTitle(w.id)}</span>
              <button
                type="button"
                className="pr-btn small ghost"
                onClick={() => onPractiseRule(w.id)}
              >
                {t('practice.practise')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
