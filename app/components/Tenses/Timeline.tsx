import { useEffect, useRef } from 'react';
import { TL_DATA } from '../../data/timelineData';

interface Props {
  selectedKey: string | null;
  onSelectTense: (key: string) => void;
}

const TT_TIMELINE_MOBILE_MQ = '(max-width: 480px)';

/** `viewportW` = visible width of `.tt-timeline-scroll`; canvas is 2× that on mobile. */
function timelineLayout(viewportW: number) {
  const vw = Math.max(1, viewportW);
  const mobileWide =
    typeof window !== 'undefined' && window.matchMedia(TT_TIMELINE_MOBILE_MQ).matches;
  const W = mobileWide ? vw * 2 : vw;
  const compact = vw < 400;
  let PAD_L = compact ? 82 : 130;
  let PAD_R = compact ? 10 : 24;
  const minChart = 56;
  while (W - PAD_L - PAD_R < minChart && PAD_L > 36) {
    PAD_L -= 6;
  }
  while (W - PAD_L - PAD_R < minChart && PAD_R > 4) {
    PAD_R -= 2;
  }
  const ROW_H = compact ? 26 : 28;
  const ROWS = TL_DATA.length;
  const PAD_T = compact ? 32 : 36;
  const PAD_B = compact ? 24 : 28;
  const rowLabelPx = compact ? 10 : 11;
  const axisLabelPx = compact ? 9 : 10;
  const chartSpan = Math.max(1, W - PAD_L - PAD_R);
  return { W, PAD_L, PAD_R, PAD_T, PAD_B, ROW_H, ROWS, rowLabelPx, axisLabelPx, chartSpan };
}

function syncTimelineScrollEdge(inner: HTMLDivElement | null, outer: HTMLDivElement | null) {
  if (!inner || !outer) return;
  if (typeof window === 'undefined' || !window.matchMedia(TT_TIMELINE_MOBILE_MQ).matches) {
    outer.removeAttribute('data-scroll-edge');
    return;
  }
  const maxL = inner.scrollWidth - inner.clientWidth;
  if (maxL <= 2) {
    outer.dataset.scrollEdge = 'none';
    return;
  }
  if (inner.scrollLeft <= 2) {
    outer.dataset.scrollEdge = 'start';
  } else if (inner.scrollLeft >= maxL - 2) {
    outer.dataset.scrollEdge = 'end';
  } else {
    outer.dataset.scrollEdge = 'mid';
  }
}

export function Timeline({ selectedKey, onSelectTense }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollOuterRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  function draw() {
    const canvas = canvasRef.current;
    const scrollEl = scrollRef.current;
    if (!canvas || !scrollEl) return;
    const dpr = window.devicePixelRatio || 1;
    const { W, PAD_L, PAD_R, PAD_T, PAD_B, ROW_H, ROWS, rowLabelPx, axisLabelPx, chartSpan } =
      timelineLayout(scrollEl.clientWidth);
    const H = PAD_T + ROWS * ROW_H + PAD_B;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cs = getComputedStyle(document.documentElement);
    const C_MUTED = cs.getPropertyValue('--muted').trim() || '#6b7080';
    const C_MUTED2 = cs.getPropertyValue('--muted2').trim() || '#8b92a8';
    const C_BG2 = cs.getPropertyValue('--bg2').trim() || '#131620';
    const C_TEXT = cs.getPropertyValue('--text').trim() || '#e8eaf0';

    function hexToRgba(hex: string, alpha: number): string {
      const h = hex.replace('#', '');
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    const AXIS_MIN = -10,
      AXIS_MAX = 10;
    function xOf(v: number) {
      return PAD_L + ((v - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * chartSpan;
    }
    const nowX = xOf(0);

    ctx.fillStyle = C_BG2;
    ctx.fillRect(0, 0, W, H);

    const ticks = [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10];
    ticks.forEach((t) => {
      const x = xOf(t);
      ctx.strokeStyle = hexToRgba(C_TEXT, t === 0 ? 0.15 : 0.05);
      ctx.lineWidth = t === 0 ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(x, PAD_T - 14);
      ctx.lineTo(x, PAD_T + ROWS * ROW_H);
      ctx.stroke();
      ctx.fillStyle = t === 0 ? C_MUTED2 : C_MUTED;
      ctx.font = `${t === 0 ? '600 ' : ''}${axisLabelPx}px Outfit,sans-serif`;
      ctx.textAlign = 'center';
      if (t === 0 || t === -10 || t === 10 || t === -5 || t === 5) ctx.fillText('', x, PAD_T - 4);
    });

    const pastEnd = xOf(0) - 1,
      futureStart = xOf(0) + 1;
    ctx.fillStyle = 'rgba(56,189,248,0.03)';
    ctx.fillRect(PAD_L, PAD_T, pastEnd - PAD_L, ROWS * ROW_H);
    ctx.fillStyle = 'rgba(74,222,128,0.03)';
    ctx.fillRect(futureStart, PAD_T, W - PAD_R - futureStart, ROWS * ROW_H);

    ctx.font = `${axisLabelPx}px Outfit,sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = C_MUTED;
    ctx.fillText('← ПРОШЛОЕ', PAD_L + (pastEnd - PAD_L) / 2, PAD_T - 4);
    ctx.fillText('БУДУЩЕЕ →', futureStart + (W - PAD_R - futureStart) / 2, PAD_T - 4);

    TL_DATA.forEach((d, i) => {
      const y = PAD_T + i * ROW_H + ROW_H / 2;
      const x1 = xOf(d.start),
        x2 = xOf(d.end);
      const col = d.color;
      const isSelected = selectedKey === d.key;
      const isAnySelected = !!selectedKey;
      const dimmed = isAnySelected && !isSelected;

      if (isSelected) {
        ctx.save();
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.07;
        ctx.fillRect(0, PAD_T + i * ROW_H, W, ROW_H);
        ctx.restore();
        ctx.save();
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(0, PAD_T + i * ROW_H + 3, 3, ROW_H - 6);
        ctx.restore();
      } else {
        ctx.fillStyle = i % 2 === 0 ? hexToRgba(C_TEXT, 0.02) : 'transparent';
        ctx.fillRect(PAD_L, PAD_T + i * ROW_H, W - PAD_L - PAD_R, ROW_H);
      }

      ctx.save();
      ctx.globalAlpha = dimmed ? 0.2 : 1;

      ctx.font = isSelected
        ? `bold ${rowLabelPx + 0.5}px Outfit,sans-serif`
        : `${rowLabelPx}px Outfit,sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillStyle = isSelected ? col : C_MUTED2;
      ctx.fillText(d.label, PAD_L - 8, y + 4);

      if (d.type === 'point') {
        ctx.fillStyle = col;
        ctx.strokeStyle = col;
        ctx.beginPath();
        const ds = isSelected ? 9 : 7;
        ctx.moveTo(x1, y - ds);
        ctx.lineTo(x1 + ds, y);
        ctx.lineTo(x1, y + ds);
        ctx.lineTo(x1 - ds, y);
        ctx.closePath();
        ctx.fill();
        if (isSelected) {
          ctx.strokeStyle = col;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.35;
          ctx.beginPath();
          ctx.arc(x1, y, 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      } else if (d.type === 'arrow') {
        const bh = isSelected ? 10 : 8;
        ctx.save();
        ctx.globalAlpha = isSelected ? 0.28 : 0.18;
        ctx.fillStyle = col;
        ctx.beginPath();
        (
          ctx as CanvasRenderingContext2D & {
            roundRect: (x: number, y: number, w: number, h: number, r: number) => void;
          }
        ).roundRect(PAD_L, y - bh / 2, W - PAD_L - PAD_R, bh, 3);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = col;
        ctx.lineWidth = isSelected ? 2.5 : 2;
        ctx.globalAlpha = isSelected ? 1 : 0.7;
        ctx.beginPath();
        ctx.moveTo(PAD_L + 6, y - 5);
        ctx.lineTo(PAD_L, y);
        ctx.lineTo(PAD_L + 6, y + 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(W - PAD_R - 6, y - 5);
        ctx.lineTo(W - PAD_R, y);
        ctx.lineTo(W - PAD_R - 6, y + 5);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else {
        const bh = isSelected ? 13 : 10;
        ctx.save();
        ctx.globalAlpha = isSelected ? 0.3 : 0.22;
        ctx.fillStyle = col;
        ctx.beginPath();
        (
          ctx as CanvasRenderingContext2D & {
            roundRect: (x: number, y: number, w: number, h: number, r: number) => void;
          }
        ).roundRect(x1, y - bh / 2, x2 - x1, bh, 3);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = col;
        ctx.lineWidth = isSelected ? 3.5 : 2.5;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
        const capR = isSelected ? 5 : 4;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(x1, y, capR, 0, Math.PI * 2);
        ctx.fill();
        if (d.dotEnd === false) {
          ctx.strokeStyle = col;
          ctx.lineWidth = isSelected ? 2.5 : 2;
          ctx.beginPath();
          ctx.moveTo(x2 - 6, y - 5);
          ctx.lineTo(x2, y);
          ctx.lineTo(x2 - 6, y + 5);
          ctx.stroke();
        } else {
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(x2, y, capR, 0, Math.PI * 2);
          ctx.fill();
          if (d.dotEnd === true) {
            ctx.strokeStyle = col;
            ctx.lineWidth = isSelected ? 2 : 1.5;
            ctx.globalAlpha = isSelected ? 0.7 : 0.5;
            ctx.beginPath();
            ctx.arc(x2, y, isSelected ? 9 : 7, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      ctx.restore();
    });

    ctx.strokeStyle = hexToRgba(C_TEXT, 0.5);
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(nowX, PAD_T - 14);
    ctx.lineTo(nowX, PAD_T + ROWS * ROW_H);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = hexToRgba(C_TEXT, 0.8);
    ctx.font = `bold ${axisLabelPx}px Outfit,sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('▼ Сейчас', nowX, PAD_T - 16);

    queueMicrotask(() => syncTimelineScrollEdge(scrollRef.current, scrollOuterRef.current));
  }

  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    draw();
  });

  useEffect(() => {
    const onResize = () => drawRef.current();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => drawRef.current());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mql = window.matchMedia(TT_TIMELINE_MOBILE_MQ);
    const onChange = () => drawRef.current();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => drawRef.current());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const scrollEl = scrollRef.current;
    if (!canvas || !scrollEl) return;
    const rect = canvas.getBoundingClientRect();
    const { PAD_L, PAD_T, ROW_H, chartSpan } = timelineLayout(scrollEl.clientWidth);
    const AXIS_MIN = -10,
      AXIS_MAX = 10;
    const mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    function xOf(v: number) {
      return PAD_L + ((v - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * chartSpan;
    }
    TL_DATA.forEach((d, i) => {
      const x1 = xOf(d.start),
        x2 = xOf(d.end);
      const inY = my >= PAD_T + i * ROW_H && my <= PAD_T + (i + 1) * ROW_H;
      const inX = d.type === 'arrow' ? true : mx >= x1 - 10 && mx <= x2 + 10;
      if (inY && inX) onSelectTense(d.key);
    });
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const tip = tooltipRef.current;
    const scrollEl = scrollRef.current;
    if (!canvas || !tip || !scrollEl) return;
    const rect = canvas.getBoundingClientRect();
    const { PAD_L, PAD_T, ROW_H, chartSpan } = timelineLayout(scrollEl.clientWidth);
    const AXIS_MIN = -10,
      AXIS_MAX = 10;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    function xOf(v: number) {
      return PAD_L + ((v - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * chartSpan;
    }
    let hit: (typeof TL_DATA)[0] | null = null;
    TL_DATA.forEach((d, i) => {
      const x1 = xOf(d.start),
        x2 = xOf(d.end);
      const inY = my >= PAD_T + i * ROW_H && my <= PAD_T + (i + 1) * ROW_H;
      const inX = d.type === 'arrow' ? true : mx >= x1 - 10 && mx <= x2 + 10;
      if (inY && inX) hit = d;
    });
    if (hit) {
      tip.style.display = 'block';
      const pad = 14;
      const tipMax = 220;
      let left = e.clientX + pad;
      if (left + tipMax > window.innerWidth - 8) {
        left = Math.max(8, e.clientX - tipMax - pad);
      }
      let top = e.clientY - 10;
      if (top < 8) top = e.clientY + 24;
      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
      tip.innerHTML = `<div class="ttt-name" style="color:${(hit as (typeof TL_DATA)[0]).color}">${(hit as (typeof TL_DATA)[0]).label}</div><div class="ttt-desc">${(hit as (typeof TL_DATA)[0]).desc}</div>`;
    } else {
      tip.style.display = 'none';
    }
  }

  return (
    <>
      <div className="tt-timeline-wrap">
        <div className="tt-timeline-title">📊 Шкала времени — когда происходит действие</div>
        <p className="tt-timeline-hint" role="note">
          <span className="tt-timeline-hint-arrows" aria-hidden>
            ‹ ›
          </span>
          <span>Листайте шкалу в стороны</span>
        </p>
        <div ref={scrollOuterRef} className="tt-timeline-scroll-outer">
          <div
            ref={scrollRef}
            className="tt-timeline-scroll"
            onScroll={() => syncTimelineScrollEdge(scrollRef.current, scrollOuterRef.current)}
          >
            <canvas
              ref={canvasRef}
              className="tt-timeline-canvas"
              onClick={handleCanvasClick}
              onPointerMove={handlePointerMove}
              onPointerLeave={() => {
                if (tooltipRef.current) tooltipRef.current.style.display = 'none';
              }}
            />
          </div>
        </div>
        <div className="tt-timeline-legend">
          {TL_DATA.map((d) => (
            <div
              key={d.key}
              className="tt-tl-leg-item"
              style={{
                opacity: selectedKey && selectedKey !== d.key ? 0.35 : 1,
                fontWeight: selectedKey === d.key ? 600 : 400,
              }}
              onClick={() => onSelectTense(d.key)}
            >
              <div className="tt-tl-leg-dot" style={{ background: d.color }} />
              <span>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div ref={tooltipRef} className="tt-timeline-tooltip" style={{ display: 'none' }} />
    </>
  );
}
