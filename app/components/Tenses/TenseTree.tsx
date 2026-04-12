import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TENSES } from '../../data/tenses';
import { TENSE_TREE } from '../../data/tenseTree';
import { TenseResult } from './TenseResult';

interface Props {
  onSelectTense: (key: string) => void;
}

interface PathStep {
  aKey: string;
}

export function TenseTree({ onSelectTense }: Props) {
  const { t } = useTranslation();
  const [node, setNode] = useState('start');
  const [path, setPath] = useState<PathStep[]>([]);
  const [result, setResult] = useState<string | null>(null);

  function choose(i: number) {
    const n = TENSE_TREE[node];
    if (!n) return;
    const c = n.choices[i];
    const newPath = [...path, { aKey: c.labelKey }];
    setPath(newPath);
    if (c.result) {
      setResult(c.result);
      onSelectTense(c.result);
    } else if (c.next) {
      setNode(c.next);
    }
  }

  function restart() {
    setNode('start');
    setPath([]);
    setResult(null);
  }

  if (result && TENSES[result]) {
    return (
      <TenseResult
        tenseKey={result}
        tense={TENSES[result]}
        breadcrumbs={path}
        onRestart={restart}
      />
    );
  }

  const current = TENSE_TREE[node];
  if (!current) return null;

  return (
    <>
      {path.length > 0 && (
        <div className="tt-breadcrumb">
          {path.map((p) => (
            <span key={p.aKey} className="tt-crumb">
              {t(p.aKey)}
            </span>
          ))}
        </div>
      )}
      <div className="tt-step">
        <div className="tt-question">
          <span className="tt-q-icon">❓</span>
          {t(current.qKey)}
        </div>
        <div className="tt-choices">
          {current.choices.map((c, i) => (
            <div key={c.labelKey} className="tt-choice" onClick={() => choose(i)}>
              <span>{c.icon}</span>
              <span>{t(c.labelKey)}</span>
              <span className="choice-arrow">›</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
