import './Header.css';
import { DATA } from '../../data/grammar';
import type { DoneMap } from '../../hooks/useProgress';
import { countAll, countLevel } from '../../hooks/useProgress';

interface Props {
  done: DoneMap;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Header({ done, searchQuery, onSearchChange }: Props) {
  const { total, checked } = countAll(done);
  const pct = total ? Math.round((checked / total) * 100) : 0;

  const completedLevels = DATA.filter((lvl) => {
    const { checked: c, total: t } = countLevel(lvl, done);
    return c === t && t > 0;
  });

  return (
    <header>
      <div className="header-top">
        <div className="title-block">
          <h1>
            English <span>Grammar</span> Tree
          </h1>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Поиск по теме..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="header-container">
        <div className="stats-row">
          <div className="stat-chip">
            Прогресс: <strong>{pct}%</strong>
          </div>
          <div className="stat-chip">
            Осталось: <strong>{total - checked}</strong> правил
          </div>
          {completedLevels.length > 0 && (
            <div className="stat-chip">
              ✓ Завершены: <strong>{completedLevels.map((l) => l.id).join(', ')}</strong>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
