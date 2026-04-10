import './Header.css';
import { DATA } from '../../data/grammar';
import type { DoneMap } from '../../hooks/useProgress';
import { countAll, countLevel } from '../../hooks/useProgress';
import { copyToClipboard } from '../../utils/clipboard';
import { buildGlobalTestPrompt } from '../../utils/prompts';

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

  async function handleGlobalTest(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget;
    const doneRules: {
      rule: import('../../data/grammar').Rule;
      level: import('../../data/grammar').Level;
      category: import('../../data/grammar').Category;
    }[] = [];
    DATA.forEach((lvl) => {
      lvl.categories.forEach((cat) => {
        cat.rules.forEach((rule) => {
          if (done[rule.id]) doneRules.push({ rule, level: lvl, category: cat });
        });
      });
    });
    if (doneRules.length === 0) {
      alert('Сначала отметь хотя бы одно правило как изученное!');
      return;
    }
    const orig = btn.textContent;
    const prompt = buildGlobalTestPrompt(doneRules);
    await copyToClipboard(prompt);
    btn.textContent = '✓ Скопировано!';
    setTimeout(() => {
      if (btn) btn.textContent = orig;
    }, 2000);
  }

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
        <div className="overall-progress">
          <div className="overall-num">{checked}</div>
          <div className="overall-label">
            из <span>{total}</span> правил
          </div>
          <div className="overall-bar-bg">
            <div className="overall-bar-fill" style={{ width: `${pct}%` }} />
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
        <button className="global-test-btn" onClick={handleGlobalTest}>
          <span className="btn-icon">🧠</span> Тест по изученным правилам
        </button>
      </div>
    </header>
  );
}
