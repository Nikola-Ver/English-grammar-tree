import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getTenseComparison, hasCuratedComparison } from '../../data/tenseComparisons';
import { TENSES } from '../../data/tenses';

interface Props {
  keyA: string;
  keyB: string;
  onSwap: () => void;
  onClear: () => void;
}

export function TenseComparison({ keyA, keyB, onSwap, onClear }: Props) {
  const { t } = useTranslation();
  const a = TENSES[keyA];
  const b = TENSES[keyB];

  const comparison = useMemo(
    () => getTenseComparison(keyA, keyB, (key: string) => t(key)),
    [keyA, keyB, t],
  );

  if (!a || !b || keyA === keyB) return null;

  const curated = hasCuratedComparison(keyA, keyB);

  return (
    <div
      className="tt-compare-panel"
      style={
        {
          '--compare-color-a': a.color,
          '--compare-color-b': b.color,
        } as React.CSSProperties
      }
    >
      <div className="tt-compare-header">
        <div className="tt-compare-title-row">
          <span className="tt-compare-section-title">{t('tensesTab.compareHeading')}</span>
          <div className="tt-compare-actions">
            <button type="button" className="tt-compare-btn" onClick={onSwap}>
              ⇄ {t('tensesTab.compareSwap')}
            </button>
            <button type="button" className="tt-compare-btn" onClick={onClear}>
              × {t('tensesTab.compareClear')}
            </button>
          </div>
        </div>

        <div className="tt-compare-names">
          <div className="tt-compare-name" style={{ color: a.color, borderColor: a.color }}>
            <div className="tt-compare-name-label">{a.name}</div>
            <div className="tt-compare-name-formula">{a.formula}</div>
          </div>
          <div className="tt-compare-vs">vs</div>
          <div className="tt-compare-name" style={{ color: b.color, borderColor: b.color }}>
            <div className="tt-compare-name-label">{b.name}</div>
            <div className="tt-compare-name-formula">{b.formula}</div>
          </div>
        </div>
      </div>

      {comparison.summary && <div className="tt-compare-summary">{comparison.summary}</div>}

      {comparison.rows.length > 0 && (
        <div className="tt-compare-table">
          <div className="tt-compare-row tt-compare-row-head">
            <div className="tt-compare-col-label" />
            <div className="tt-compare-col-a" style={{ color: a.color }}>
              {a.name}
            </div>
            <div className="tt-compare-col-b" style={{ color: b.color }}>
              {b.name}
            </div>
          </div>
          {comparison.rows.map((row) => (
            <div key={row.label} className="tt-compare-row">
              <div className="tt-compare-col-label">{row.label}</div>
              <div className="tt-compare-col-a" data-tense-name={a.name}>
                {row.a}
              </div>
              <div className="tt-compare-col-b" data-tense-name={b.name}>
                {row.b}
              </div>
            </div>
          ))}
        </div>
      )}

      {comparison.sharedContexts && comparison.sharedContexts.length > 0 && (
        <div className="tt-compare-contexts">
          <div className="tt-compare-subtitle">{t('tensesTab.compareContexts')}</div>
          <ul className="tt-compare-ctx-list">
            {comparison.sharedContexts.map((ctx) => (
              <li key={ctx.context} className="tt-compare-ctx-item">
                <div className="tt-compare-ctx-title">{ctx.context}</div>
                <div className="tt-compare-ctx-pair">
                  <div className="tt-compare-ctx-side" style={{ borderColor: a.color }}>
                    <div className="tt-compare-ctx-en">{ctx.a}</div>
                    <div className="tt-compare-ctx-tr">{ctx.aTr}</div>
                  </div>
                  <div className="tt-compare-ctx-side" style={{ borderColor: b.color }}>
                    <div className="tt-compare-ctx-en">{ctx.b}</div>
                    <div className="tt-compare-ctx-tr">{ctx.bTr}</div>
                  </div>
                </div>
                {ctx.note && <div className="tt-compare-ctx-note">{ctx.note}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {comparison.notes && comparison.notes.length > 0 && (
        <div className="tt-compare-notes">
          <div className="tt-compare-subtitle">{t('tensesTab.compareNotes')}</div>
          <ul className="tt-compare-note-list">
            {comparison.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {!curated && <div className="tt-compare-auto-hint">{t('tensesTab.compareAutoHint')}</div>}
    </div>
  );
}
