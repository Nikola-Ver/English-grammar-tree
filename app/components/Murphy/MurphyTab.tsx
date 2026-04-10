import { MURPHY_DATA } from '../../data/murphy';
import type { DoneMap } from '../../hooks/useProgress';
import { countAll } from '../../hooks/useProgress';
import { copyToClipboard } from '../../utils/clipboard';
import { buildMurphyGlobalTestPrompt, buildMurphyRulePrompt } from '../../utils/prompts';
import { LevelBlock } from '../Grammar/LevelBlock';
import './MurphyTab.css';

interface Props {
  done: DoneMap;
  onToggleRule: (id: string) => void;
  onReset: () => void;
}

export function MurphyTab({ done, onToggleRule, onReset }: Props) {
  const { total, checked } = countAll(done, MURPHY_DATA);
  const pct = total ? Math.round((checked / total) * 100) : 0;

  async function handleGlobalTest(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget;
    const doneRules: {
      rule: import('../../data/grammar').Rule;
      level: import('../../data/grammar').Level;
      category: import('../../data/grammar').Category;
    }[] = [];
    MURPHY_DATA.forEach((lvl) => {
      lvl.categories.forEach((cat) => {
        cat.rules.forEach((rule) => {
          if (done[rule.id]) doneRules.push({ rule, level: lvl, category: cat });
        });
      });
    });
    if (doneRules.length === 0) {
      alert('Сначала отметь хотя бы один юнит как изученный!');
      return;
    }
    const orig = btn.innerHTML;
    const prompt = buildMurphyGlobalTestPrompt(doneRules);
    await copyToClipboard(prompt);
    btn.textContent = '✓ Скопировано!';
    setTimeout(() => {
      if (btn) btn.innerHTML = orig;
    }, 2000);
  }

  function handleReset() {
    if (window.confirm('Сбросить прогресс по книгам Мёрфи?')) {
      onReset();
    }
  }

  return (
    <div id="pane-murphy" className="tab-pane active">
      <div className="murphy-header">
        <div className="murphy-progress-block">
          <div className="murphy-progress-nums">
            <span className="murphy-checked">{checked}</span>
            <span className="murphy-total"> / {total} юнитов</span>
          </div>
          <div className="murphy-bar-bg">
            <div className="murphy-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="murphy-pct">{pct}% завершено</div>
        </div>
        <button className="murphy-test-btn" onClick={handleGlobalTest}>
          <span className="btn-icon">🧠</span> Тест по изученным юнитам
        </button>
      </div>

      <div className="level-path">
        {MURPHY_DATA.map((level) => (
          <LevelBlock
            key={level.id}
            level={level}
            done={done}
            onToggleRule={onToggleRule}
            searchQuery=""
            forceOpen={false}
            promptBuilder={buildMurphyRulePrompt}
          />
        ))}
      </div>

      <button className="reset-btn" onClick={handleReset}>
        ↺ Сбросить прогресс
      </button>
    </div>
  );
}
