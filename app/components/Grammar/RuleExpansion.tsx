import { useEffect, useRef, useState } from 'react';
import './RuleExpansion.css';
import type { Rule } from '../../data/grammar';

interface Props {
  rule: Rule;
  isOpen: boolean;
}

export function RuleExpansion({ rule, isOpen }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [everOpened, setEverOpened] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isOpen) {
      setEverOpened(true);
      el.style.transition = 'none';
      el.style.maxHeight = '0';
      el.style.opacity = '0';
      el.style.padding = '0 13px';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition =
            'max-height 0.44s cubic-bezier(0.22,1,0.36,1), opacity 0.28s ease, padding 0.3s ease';
          el.style.maxHeight = `${el.scrollHeight + 30}px`;
          el.style.opacity = '1';
          el.style.padding = '11px 13px';

          const onEnd = (e: TransitionEvent) => {
            if (e.propertyName === 'max-height') {
              el.style.maxHeight = 'none';
              el.removeEventListener('transitionend', onEnd);
            }
          };
          el.addEventListener('transitionend', onEnd);
        });
      });
    } else {
      if (!everOpened) return;
      el.style.maxHeight = `${el.scrollHeight + 30}px`;
      el.style.opacity = '1';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition =
            'max-height 0.32s cubic-bezier(0.4,0,0.6,1), opacity 0.2s ease, padding 0.25s ease';
          el.style.maxHeight = '0';
          el.style.opacity = '0';
          el.style.padding = '0 13px';
        });
      });
    }
  }, [isOpen, everOpened]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!rule.exp) return null;

  return (
    <div ref={ref} className="rule-exp">
      {everOpened && (
        <>
          <div dangerouslySetInnerHTML={{ __html: rule.exp }} />
          {rule.ex && rule.ex.length > 0 && (
            <ul className="ex-list">
              {rule.ex.map(([en, ru], i) => (
                <li key={i}>
                  {en}
                  {ru && <span className="tr">{ru}</span>}
                </li>
              ))}
            </ul>
          )}
          {rule.exc && (
            <div className="exc-block">
              <strong>⚠️ Исключения:</strong> <span dangerouslySetInnerHTML={{ __html: rule.exc }} />
            </div>
          )}
          {rule.tip && (
            <div className="tip-block">
              <strong>💡 Совет:</strong> <span dangerouslySetInnerHTML={{ __html: rule.tip }} />
            </div>
          )}
          {rule.markers && rule.markers.tags.length > 0 && (
            <div className="markers-block">
              <strong>⏱ Маркеры времени</strong>
              <div className="markers-wrap">
                {rule.markers.tags.map((t, i) => (
                  <span key={i} className="marker-tag">
                    {t}
                  </span>
                ))}
              </div>
              {rule.markers.note && <div className="markers-note">{rule.markers.note}</div>}
            </div>
          )}
          {rule.mistakes && rule.mistakes.length > 0 && (
            <div className="mistakes-block">
              <strong>🚫 Типичные ошибки:</strong>
              <ul>
                {rule.mistakes.map((m, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: m }} />
                ))}
              </ul>
            </div>
          )}
          {rule.links && rule.links.length > 0 && (
            <div className="link-row">
              {rule.links.map((l, i) => {
                const icon = l.type === 'yt' ? '▶' : l.type === 'ru' ? 'RU' : 'EN';
                return (
                  <a
                    key={i}
                    className={`lnk ${l.type}`}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="lnk-dot" />
                    {icon} {l.label}
                  </a>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
