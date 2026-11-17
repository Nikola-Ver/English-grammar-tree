import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TENSES } from '../../../data/tenses';
import { TENSE_TREE } from '../../../data/tenseTree';
import type { TreeEx } from '../../../practice/types';
import type { ExerciseProps } from './common';

/** Walk the tense decision tree for a sentence — trains the reasoning, not just the label. */
export function TreeExercise({ ex, answered, onAnswer }: ExerciseProps<TreeEx>) {
  const { t } = useTranslation();
  const [node, setNode] = useState('start');
  const [path, setPath] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const current = TENSE_TREE[node];

  function choose(labelKey: string, next?: string, res?: string) {
    if (answered) return;
    setPath((p) => [...p, t(labelKey)]);
    if (res) {
      setResult(res);
      onAnswer(res === ex.tense);
    } else if (next) setNode(next);
  }

  return (
    <div className="pr-ex">
      <div className="pr-prompt">{ex.sentence}</div>
      {path.length > 0 && (
        <div className="pr-tree-path">
          {path.map((p, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: ordered breadcrumb
            <span key={i} className="pr-tree-step">
              {p}
            </span>
          ))}
        </div>
      )}
      {!result && current && (
        <>
          <div className="pr-tree-q">{t(current.qKey)}</div>
          <div className="pr-options stacked">
            {current.choices.map((c) => (
              <button
                key={c.labelKey}
                type="button"
                className="pr-option"
                onClick={() => choose(c.labelKey, c.next, c.result)}
                disabled={answered}
              >
                <span className="pr-key">{c.icon}</span>
                {t(c.labelKey)}
              </button>
            ))}
          </div>
        </>
      )}
      {result && (
        <div className={`pr-tree-result ${result === ex.tense ? 'ok' : 'bad'}`}>
          <span style={{ color: TENSES[result as keyof typeof TENSES]?.color }}>
            {TENSES[result as keyof typeof TENSES]?.name}
          </span>
          {result !== ex.tense && (
            <>
              {' '}
              <span className="pr-arrow">→</span>{' '}
              <span style={{ color: TENSES[ex.tense].color }}>{TENSES[ex.tense].name}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
