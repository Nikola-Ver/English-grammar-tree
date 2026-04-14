import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CategorySection.css';
import type { Category, Level, Rule } from '../../data/grammar';
import type { DoneMap } from '../../hooks/useProgress';
import { copyToClipboard } from '../../utils/clipboard';
import { RuleItem } from './RuleItem';

interface RuleRow {
  rule: Rule;
  searchHidden: boolean;
  delay: number;
}

interface Props {
  level: Level;
  cat: Category;
  categoryIndex: number;
  done: DoneMap;
  onToggleRule: (id: string) => void;
  ruleItems: RuleRow[];
  targetRuleId?: string | null;
  bodyOpen: boolean;
  onToggleCollapsed: () => void;
  categoryPrompt: string | null;
  promptBuilder?: (rule: Rule, level: Level, cat: Category) => string;
}

export function CategorySection({
  level,
  cat,
  categoryIndex,
  done,
  onToggleRule,
  ruleItems,
  targetRuleId,
  bodyOpen,
  onToggleCollapsed,
  categoryPrompt,
  promptBuilder,
}: Props) {
  const { t } = useTranslation();
  const [categoryTestCopied, setCategoryTestCopied] = useState(false);

  const showCategoryTest = !!categoryPrompt;

  return (
    <div
      className={`category category-section${bodyOpen ? ' open' : ''}`}
      style={
        {
          '--cat-stagger': `${categoryIndex * 0.055}s`,
          animationDelay: `${0.02 + categoryIndex * 0.06}s`,
        } as React.CSSProperties
      }
    >
      <div className="category-section-head" onClick={onToggleCollapsed}>
        <span className="category-section-chevron" aria-hidden="true">
          ▾
        </span>
        <div className="category-section-title">{cat.name}</div>
        <div className="category-section-tools" onClick={(e) => e.stopPropagation()}>
          {showCategoryTest && (
            <button
              type="button"
              className={`category-test-btn${categoryTestCopied ? ' copied' : ''}`}
              title={t('rule.testCategoryTitle')}
              onClick={async (e) => {
                e.stopPropagation();
                if (!categoryPrompt) return;
                await copyToClipboard(categoryPrompt);
                setCategoryTestCopied(true);
                setTimeout(() => setCategoryTestCopied(false), 2000);
              }}
            >
              {categoryTestCopied ? t('copied') : t('rule.testCategory')}
            </button>
          )}
        </div>
      </div>

      <div className={`category-section-body-wrap${bodyOpen ? ' open' : ''}`}>
        <div className="category-section-body">
          <div className="rules-grid">
            {ruleItems.map(({ rule, searchHidden, delay }, index) => (
              <RuleItem
                key={rule.id}
                rule={rule}
                level={level}
                categoryName={cat.name}
                isDone={!!done[rule.id]}
                animDelay={delay}
                onToggle={onToggleRule}
                searchHidden={searchHidden}
                promptBuilder={promptBuilder}
                isTarget={rule.id === targetRuleId}
                stackOrder={ruleItems.length - 1 - index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
