import { DATA } from '../../data/grammar';
import type { DoneMap } from '../../hooks/useProgress';
import { LevelBlock } from './LevelBlock';

interface Props {
  done: DoneMap;
  onToggleRule: (id: string) => void;
  onReset: () => void;
  searchQuery: string;
}

export function GrammarTab({ done, onToggleRule, onReset, searchQuery }: Props) {
  const q = searchQuery.trim().toLowerCase();

  // Determine which levels need to be force-opened for search
  const forceOpenSet = new Set<string>();
  if (q) {
    DATA.forEach((lvl) => {
      lvl.categories.forEach((cat) => {
        cat.rules.forEach((rule) => {
          if (`${rule.text} ${rule.note || ''} ${rule.exp || ''}`.toLowerCase().includes(q)) {
            forceOpenSet.add(lvl.id);
          }
        });
      });
    });
  }

  const hasResults =
    !q ||
    DATA.some((lvl) =>
      lvl.categories.some((cat) =>
        cat.rules.some((rule) =>
          `${rule.text} ${rule.note || ''} ${rule.exp || ''}`.toLowerCase().includes(q),
        ),
      ),
    );

  function handleReset() {
    if (window.confirm('Сбросить весь прогресс?')) {
      onReset();
    }
  }

  return (
    <div id="pane-grammar" className="tab-pane active">
      <div className="level-path">
        {DATA.map((level) => (
          <LevelBlock
            key={level.id}
            level={level}
            done={done}
            onToggleRule={onToggleRule}
            searchQuery={searchQuery}
            forceOpen={forceOpenSet.has(level.id)}
          />
        ))}
      </div>
      {!hasResults && <div className="no-results">Ничего не найдено по запросу</div>}
      <button className="reset-btn" onClick={handleReset}>
        ↺ Сбросить прогресс
      </button>
    </div>
  );
}
