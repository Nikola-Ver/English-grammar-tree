import type { Tense } from '../../data/tenses';

interface Props {
  tenseKey: string;
  tense: Tense;
  breadcrumbs: { q: string; a: string }[];
  onRestart: () => void;
}


export function TenseResult({ tense, breadcrumbs, onRestart }: Props) {
  const markers = tense.markers ? tense.markers.split(',') : [];

  return (
    <>
      {breadcrumbs.length > 0 && (
        <div className="tt-breadcrumb">
          {breadcrumbs.map((p, i) => (
            <span key={i} className="tt-crumb">{p.a}</span>
          ))}
        </div>
      )}
      <div className="tt-result">
        <div className="tt-result-left">
          <div className="tt-result-name" style={{ color: tense.color }}>{tense.name}</div>
          <div className="tt-result-formula">{tense.formula}</div>
          <div className="tt-result-desc" style={{ marginTop: 8 }}>{tense.desc}</div>
          {markers.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--b1)', margin: '10px 0 5px' }}>⏱ Маркеры времени</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {markers.map((m, i) => (
                  <span key={i} style={{ background: 'var(--bg3)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 4, padding: '2px 7px', fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--b1)', whiteSpace: 'nowrap' }}>
                    {m.trim()}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="tt-result-right">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted2)', marginBottom: 5 }}>Примеры</div>
          <ul className="tt-result-ex">
            {tense.examples.map(([en, ru], i) => (
              <li key={i}>
                {en}
                {ru && <span className="tr">{ru}</span>}
              </li>
            ))}
          </ul>
          {tense.mistakes && tense.mistakes.length > 0 && (
            <div className="tt-mistakes" style={{ marginTop: 10 }}>
              <strong>🚫 Типичные ошибки:</strong>
              <ul style={{ margin: '4px 0 0 14px', padding: 0, listStyle: 'disc' }}>
                {tense.mistakes.map((m, i) => (
                  <li key={i} style={{ marginBottom: 3, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: m }} />
                ))}
              </ul>
            </div>
          )}
          <button className="tt-restart" onClick={onRestart}>↺ Начать сначала</button>
        </div>
      </div>
    </>
  );
}
