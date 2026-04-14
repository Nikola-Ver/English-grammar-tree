import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LevelBlock.css';
import type { Category, Level, Rule } from '../../data/grammar';
import type { DoneMap } from '../../hooks/useProgress';
import { countLevel } from '../../hooks/useProgress';
import { CategorySection } from './CategorySection';

const LEVEL_SELECTION_UI_SELECTOR =
  '.sel-share-pop, .sel-lock-panel, .sel-note-panel, .sel-note-card, .sel-deep-msg-card';

interface Props {
  level: Level;
  done: DoneMap;
  onToggleRule: (id: string) => void;
  searchQuery: string;
  forceOpen: boolean;
  targetRuleId?: string | null;
  /** Higher = earlier band in the list; when two bands have open selection UI, the higher one stays on top */
  stackOrder?: number;
  promptBuilder?: (rule: Rule, level: Level, cat: Category) => string;
  categoryPromptBuilder?: (level: Level, cat: Category) => string | null;
}

export function LevelBlock({
  level,
  done,
  onToggleRule,
  searchQuery,
  forceOpen,
  targetRuleId,
  stackOrder = 0,
  promptBuilder,
  categoryPromptBuilder,
}: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  // When forceOpen is true but the user explicitly collapses the level, honour that
  const [userClosed, setUserClosed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const closingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref to the open-animation transitionend handler so it can be cancelled if
  // a close starts before the open animation completes.
  const openTransitionHandler = useRef<((e: TransitionEvent) => void) | null>(null);
  const k = level.id.toLowerCase();
  const { total, checked } = countLevel(level, done);
  const pct = total ? Math.round((checked / total) * 100) : 0;

  const [collapsedCategories, setCollapsedCategories] = useState<Set<number>>(() => new Set());
  const lastRuleDeepLinkRef = useRef<string | null>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [hasOpenSelectionUi, setHasOpenSelectionUi] = useState(false);

  // Reset user-override whenever forceOpen turns off so next deep-link works
  useEffect(() => {
    if (!forceOpen) setUserClosed(false);
  }, [forceOpen]);

  // Re-open the CEFR level when the user follows a new #rule-… link into this level
  // (so rule share / pin / notes UI is reachable even if they had collapsed the level).
  useEffect(() => {
    if (!targetRuleId) {
      lastRuleDeepLinkRef.current = null;
      return;
    }
    const inLevel = level.categories.some((c) => c.rules.some((r) => r.id === targetRuleId));
    if (!inLevel) {
      lastRuleDeepLinkRef.current = null;
      return;
    }
    if (lastRuleDeepLinkRef.current === targetRuleId) return;
    lastRuleDeepLinkRef.current = targetRuleId;
    setUserClosed(false);
    setIsOpen(true);
  }, [targetRuleId, level]);

  const open = userClosed ? false : isOpen || forceOpen;

  useEffect(() => {
    const root = blockRef.current;
    if (!root) return;
    const sync = () => setHasOpenSelectionUi(!!root.querySelector(LEVEL_SELECTION_UI_SELECTOR));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { subtree: true, childList: true });
    return () => mo.disconnect();
  }, [open, everOpened, level.id]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (open) {
      // Cancel any stale open-animation handler left over from a previous cycle
      if (openTransitionHandler.current) {
        el.removeEventListener('transitionend', openTransitionHandler.current);
        openTransitionHandler.current = null;
      }
      if (closingTimer.current) {
        clearTimeout(closingTimer.current);
        closingTimer.current = null;
      }
      setIsClosing(false);
      setEverOpened(true);
      el.classList.remove('level-content--closing');

      el.style.transition = 'none';
      el.style.maxHeight = '0';
      el.style.opacity = '0';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'max-height 0.54s cubic-bezier(0.22,1,0.36,1), opacity 0.36s ease';
          el.style.maxHeight = `${el.scrollHeight}px`;
          el.style.opacity = '1';

          const onEnd = (e: TransitionEvent) => {
            if (e.propertyName === 'max-height') {
              el.style.maxHeight = 'none';
              el.style.overflow = 'visible';
              el.removeEventListener('transitionend', onEnd);
              openTransitionHandler.current = null;
            }
          };
          openTransitionHandler.current = onEnd;
          el.addEventListener('transitionend', onEnd);
        });
      });
    } else {
      if (!everOpened) return;

      // Cancel the open-animation handler before it can fire during the close
      if (openTransitionHandler.current) {
        el.removeEventListener('transitionend', openTransitionHandler.current);
        openTransitionHandler.current = null;
      }

      setIsClosing(true);
      // Sync on the node so child exit animations start this frame (before max-height
      // shrinks). Do not fade this container's opacity — it would hide rule keyframes.
      el.classList.add('level-content--closing');
      el.style.overflow = 'hidden';
      el.style.maxHeight = `${el.scrollHeight}px`;
      el.style.opacity = '1';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'max-height 0.58s cubic-bezier(0.4, 0, 0.55, 1)';
          el.style.maxHeight = '0';

          closingTimer.current = setTimeout(() => {
            // Reset all inline styles so CSS values take full control cleanly
            el.style.transition = '';
            el.style.maxHeight = '';
            el.style.opacity = '';
            el.style.overflow = '';
            el.classList.remove('level-content--closing');
            setIsClosing(false);
            closingTimer.current = null;
          }, 600);
        });
      });
    }
  }, [open, everOpened]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (closingTimer.current) clearTimeout(closingTimer.current);
    };
  }, []);

  const toggleOpen = useCallback(() => {
    if (open) {
      setUserClosed(true);
      setIsOpen(false);
    } else {
      setUserClosed(false);
      setIsOpen(true);
    }
  }, [open]);

  const q = searchQuery.trim().toLowerCase();
  const levelMatches = q
    ? level.id.toLowerCase().includes(q) || level.name.toLowerCase().includes(q)
    : false;

  const collapseAllCategories = useCallback(() => {
    setCollapsedCategories(new Set(level.categories.map((_, i) => i)));
  }, [level.categories]);

  const expandAllCategories = useCallback(() => {
    setCollapsedCategories(new Set());
  }, []);

  const blockStyle = {
    '--level-stack-order': stackOrder,
    ...(hasOpenSelectionUi ? { zIndex: 500 + stackOrder } : {}),
  } as React.CSSProperties;

  return (
    <div
      ref={blockRef}
      className={`level-block${open ? ' open' : ''}${isClosing ? ' closing' : ''}`}
      id={`level-${k}`}
      style={blockStyle}
    >
      <div className="level-sticky">
        <div className="level-header" onClick={toggleOpen}>
          <div
            className="level-dot"
            style={{ color: level.color, borderColor: level.color, background: level.colorBg }}
          >
            {level.id}
          </div>
          <div className="level-info">
            <div className="level-name">{level.name}</div>
            <div className="level-sub">{level.sub}</div>
          </div>
          <div className="level-stats">
            <div className="level-frac" style={{ color: level.color }}>
              {checked}/{total}
            </div>
            <div className="level-pct">{pct}%</div>
          </div>
          <div className="level-toggle">▾</div>
        </div>
        <div className="level-progress-bar">
          <div
            className="level-progress-fill"
            style={{ background: level.color, width: `${pct}%` }}
          />
        </div>
      </div>
      <div ref={contentRef} className="level-content">
        {everOpened && level.categories.length > 0 && (
          <div
            className="level-category-bulk"
            style={{ '--level-accent': level.color } as React.CSSProperties}
          >
            <button
              type="button"
              className="level-category-bulk-btn level-category-bulk-btn--collapse"
              onClick={collapseAllCategories}
            >
              <span className="level-category-bulk-ico" aria-hidden="true">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 14l5-5 5 5M7 19l5-5 5 5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="level-category-bulk-label">{t('category.collapseAll')}</span>
            </button>
            <span className="level-category-bulk-divider" aria-hidden="true" />
            <button
              type="button"
              className="level-category-bulk-btn level-category-bulk-btn--expand"
              onClick={expandAllCategories}
            >
              <span className="level-category-bulk-ico" aria-hidden="true">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 10l5 5 5-5M7 5l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="level-category-bulk-label">{t('category.expandAll')}</span>
            </button>
          </div>
        )}
        {everOpened &&
          level.categories.map((cat, ci) => {
            const catMatches = q ? cat.name.toLowerCase().includes(q) : false;
            let ruleIdx = 0;
            const ruleItems = cat.rules.map((rule) => {
              const searchHidden =
                q && !levelMatches && !catMatches
                  ? !`${rule.text} ${rule.note || ''}`.toLowerCase().includes(q)
                  : false;
              const delay = 0.05 + ruleIdx * 0.028;
              ruleIdx++;
              return { rule, searchHidden, delay };
            });

            if (q && ruleItems.every((r) => r.searchHidden)) return null;

            const categoryKey = `${level.id}::${ci}::${cat.name}`;
            const categoryPrompt = categoryPromptBuilder?.(level, cat) ?? null;

            const hasVisibleRule = ruleItems.some((r) => !r.searchHidden);
            const searchKeepsCategoryOpen = !!q && hasVisibleRule;
            const targetRuleKeepsTopicOpen =
              !!targetRuleId && cat.rules.some((r) => r.id === targetRuleId);
            const userCollapsed = collapsedCategories.has(ci);
            const bodyOpen = !userCollapsed || searchKeepsCategoryOpen || targetRuleKeepsTopicOpen;

            return (
              <CategorySection
                key={categoryKey}
                level={level}
                cat={cat}
                categoryIndex={ci}
                done={done}
                onToggleRule={onToggleRule}
                ruleItems={ruleItems}
                targetRuleId={targetRuleId}
                bodyOpen={bodyOpen}
                onToggleCollapsed={() => {
                  setCollapsedCategories((prev) => {
                    const next = new Set(prev);
                    if (next.has(ci)) next.delete(ci);
                    else next.add(ci);
                    return next;
                  });
                }}
                categoryPrompt={categoryPrompt}
                promptBuilder={promptBuilder}
              />
            );
          })}
      </div>
    </div>
  );
}
