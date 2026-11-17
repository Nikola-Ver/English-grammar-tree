import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './RuleItem.css';
import type { Category, Level, Rule } from '../../data/grammar';
import { normalizeUiLang } from '../../i18n/localizeRules';
import { IconCheck, IconShare } from '../../icons';
import { copyToClipboard } from '../../utils/clipboard';
import { buildRuleUrl } from '../../utils/deepLink';
import { spawnParticles } from '../../utils/particles';
import { buildRulePrompt } from '../../utils/prompts';
import { usePractice } from '../Practice/PracticeProvider';
import { RuContrastBox } from './RuContrastBox';
import { RuleExpansion } from './RuleExpansion';

const STAGE_ICONS = ['', '🌱', '🍃', '🌸', '🍎'];

interface Props {
  rule: Rule;
  level: Level;
  categoryName: string;
  isDone: boolean;
  animDelay: number;
  onToggle: (id: string) => void;
  searchHidden: boolean;
  isTarget?: boolean;
  /** Same value as parent LevelBlock; exposed as `--rule-stack-order` for stacking */
  stackOrder?: number;
  promptBuilder?: (rule: Rule, level: Level, cat: Category) => string;
}

export function RuleItem({
  rule,
  level,
  isDone,
  animDelay,
  onToggle,
  searchHidden,
  isTarget = false,
  stackOrder = 0,
  promptBuilder,
}: Props) {
  const { t, i18n } = useTranslation();
  const [expOpen, setExpOpen] = useState(isTarget);
  const [shareCopied, setShareCopied] = useState(false);
  const [testCopied, setTestCopied] = useState(false);
  const checkRef = useRef<HTMLDivElement>(null);
  const { start: startPractice, mastery } = usePractice();
  const m = mastery?.get(rule.id);
  const canPractise = !!m && m.total > 0;
  // Touch-handling refs for immediate-first-tap expansion on mobile
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastToggleTouchRef = useRef(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only scroll-to-target
  useEffect(() => {
    if (!isTarget) return;
    const el = document.getElementById(`ri-${rule.id}`);
    if (!el) return;
    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('rule-target-highlight');
      setTimeout(() => el.classList.remove('rule-target-highlight'), 2400);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const handleCheck = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      // Earned mastery: marking a rule as known takes a short test when exercises exist.
      if (!isDone && m && m.total >= 3 && m.stage < 3) {
        startPractice({ type: 'testout', ruleId: rule.id });
        return;
      }
      const el = checkRef.current;
      if (el && !isDone) {
        el.classList.add('anim-check');
        spawnParticles(el, level.color);
        setTimeout(() => el.classList.remove('anim-check'), 600);
      } else if (el) {
        const ruleEl = el.closest('.rule-item');
        ruleEl?.classList.add('uncheck-anim');
        setTimeout(() => ruleEl?.classList.remove('uncheck-anim'), 400);
      }
      setExpOpen(false);
      onToggle(rule.id);
    },
    [isDone, level.color, onToggle, rule.id, m, startPractice],
  );

  // On mobile, fire the toggle immediately on touchend (first tap) and guard
  // the subsequent synthetic click from double-toggling.
  const handleExpTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as Element;
    if (target.closest('.rule-check, .rule-actions')) return;
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleExpTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const t = e.changedTouches[0];
      const dx = Math.abs(t.clientX - touchStartRef.current.x);
      const dy = Math.abs(t.clientY - touchStartRef.current.y);
      touchStartRef.current = null;
      if (dx > 10 || dy > 10) return; // scroll gesture, not a tap
      e.preventDefault(); // suppress the follow-up synthetic click where supported
      lastToggleTouchRef.current = Date.now();
      if (rule.exp) setExpOpen((v) => !v);
    },
    [rule.exp],
  );

  const handleExpToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Skip if already handled by touchend (prevents double-toggle)
      if (Date.now() - lastToggleTouchRef.current < 600) return;
      if (rule.exp) setExpOpen((v) => !v);
    },
    [rule.exp],
  );

  async function handleTest(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const cat = level.categories.find((c) => c.rules.some((r) => r.id === rule.id));
    if (!cat) return;
    const build =
      promptBuilder ?? ((r, l, c) => buildRulePrompt(normalizeUiLang(i18n.language), r, l, c));
    const prompt = build(rule, level, cat);
    await copyToClipboard(prompt);
    setTestCopied(true);
    e.currentTarget.classList.add('copied');
    setTimeout(() => {
      setTestCopied(false);
      e.currentTarget.classList.remove('copied');
    }, 2000);
  }

  async function handleShare(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const url = buildRuleUrl(rule.id);
    history.replaceState(null, '', `#rule-${rule.id}`);
    await copyToClipboard(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  const checkStyle = isDone
    ? { background: level.color, borderColor: level.color, color: '#000' }
    : { borderColor: 'var(--border2)' };

  const titleNode = rule.unitUrl ? (
    <a
      className="rule-text rule-unit-link"
      href={rule.unitUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      {rule.text}
    </a>
  ) : (
    <div className="rule-text">{rule.text}</div>
  );

  return (
    <div
      className={`rule-item${isDone ? ' done' : ''}${searchHidden ? ' hidden-search' : ''}`}
      id={`ri-${rule.id}`}
      style={
        {
          '--anim-delay': `${animDelay}s`,
          '--rule-stack-order': stackOrder,
        } as React.CSSProperties
      }
    >
      <div
        className="rule-top"
        onClick={handleExpToggle}
        onTouchStart={handleExpTouchStart}
        onTouchEnd={handleExpTouchEnd}
      >
        <div ref={checkRef} className="rule-check" onClick={handleCheck} style={checkStyle}>
          {isDone && <IconCheck className="chk-svg" />}
        </div>
        <div className="rule-main">
          {titleNode}
          {rule.note && <span className="rule-note">{rule.note}</span>}
        </div>
        <div className="rule-actions">
          {m && (m.stage > 0 || m.wilting) && (
            <span
              className={`rule-stage${m.wilting ? ' wilting' : ''}`}
              title={`${t(`practice.stage.name${m.stage}`)}${m.wilting ? ` · ${t('practice.stage.wilting')}` : ''}`}
            >
              {m.wilting ? '🍂' : STAGE_ICONS[m.stage]}
            </span>
          )}
          {canPractise && (
            <button
              type="button"
              className="practice-btn"
              onClick={(e) => {
                e.stopPropagation();
                startPractice({ type: 'rule', ruleId: rule.id });
              }}
              title={t('rule.practiceTitle')}
            >
              {t('rule.practice')}
            </button>
          )}
          <button
            className={`share-btn${shareCopied ? ' copied' : ''}`}
            onClick={handleShare}
            title={t('rule.copyLinkTitle')}
          >
            {shareCopied ? '✓' : <IconShare />}
          </button>
          {rule.exp && (
            <button className="test-btn" onClick={handleTest}>
              {testCopied ? t('copied') : t('rule.test')}
            </button>
          )}
          {rule.exp && <span className={`rule-arrow${expOpen ? ' open' : ''}`}>▾</span>}
        </div>
      </div>
      {rule.exp && <RuleExpansion rule={rule} isOpen={expOpen} />}
      {expOpen && <RuContrastBox ruleId={rule.id} />}
    </div>
  );
}
