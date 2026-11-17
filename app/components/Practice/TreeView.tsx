import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DoneMap } from '../../hooks/useProgress';
import type { PracticeIndex } from '../../practice/items';
import type { RuleMastery } from '../../practice/srs';
import { buildTreeLayout } from '../../practice/treeLayout';
import {
  createTreeScene,
  type LevelSign,
  loadTreeAssets,
  type RuleLook,
  type TreeScene,
} from './treeScene';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

interface Props {
  index: PracticeIndex;
  mastery: Map<string, RuleMastery>;
  done: DoneMap;
  bosses: Record<string, { best: number; passedAt?: number }>;
  selected: string | null;
  onSelect: (ruleId: string) => void;
  ruleTitle: (id: string) => string;
}

/**
 * The learner's grammar tree: a painted tree with a limb per CEFR level. Every rule owns a few
 * twigs, bare until the rule is practised, then in leaf, in blossom and finally bearing an apple.
 */
export function TreeView({ index, mastery, done, bosses, selected, onSelect, ruleTitle }: Props) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<TreeScene | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // rules in tree order: level by level, in curriculum order along each limb
  const ruleIds = useMemo(
    () =>
      LEVELS.map((lvl) => index.grammarOrder.filter((id) => index.rules.get(id)?.levelId === lvl)),
    [index],
  );
  const flat = useMemo(() => ruleIds.flat(), [ruleIds]);
  const layout = useMemo(() => buildTreeLayout(ruleIds.map((ids) => ids.length)), [ruleIds]);

  const titleRef = useRef(ruleTitle);
  titleRef.current = ruleTitle;
  const flatRef = useRef(flat);
  flatRef.current = flat;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let scene: TreeScene | null = null;
    let cancelled = false;
    let onScreen = true;
    const sync = () => scene?.setRunning(onScreen && !document.hidden);
    const observer = new IntersectionObserver((entries) => {
      onScreen = entries.some((e) => e.isIntersecting);
      sync();
    });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    loadTreeAssets()
      .then((assets) => {
        if (cancelled) return;
        scene = createTreeScene(canvas, assets, layout, {
          reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          titleOf: (rule) => titleRef.current(flatRef.current[rule] ?? ''),
        });
        sceneRef.current = scene;
        setReady(true);
        sync();
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      scene?.destroy();
      sceneRef.current = null;
      setReady(false);
    };
  }, [layout]);

  const labels = useMemo(
    () =>
      flat.map((id) => {
        const m = mastery.get(id);
        const stage = m?.stage ?? 0;
        const claimed = stage < 2 && !!done[id];
        const note = m?.shaky
          ? ` · ${t('practice.stage.shaky')}`
          : m?.wilting
            ? ` · ${t('practice.stage.wilting')}`
            : '';
        return `${ruleTitle(id)} — ${t(`practice.stage.name${claimed ? 'Claimed' : stage}`)}${note}`;
      }),
    [flat, mastery, done, ruleTitle, t],
  );

  useEffect(() => {
    if (!ready) return;
    const looks: RuleLook[] = flat.map((id) => {
      const m = mastery.get(id);
      const stage = m?.stage ?? 0;
      // a rule ticked as known without practice shows its first leaves
      return {
        stage: stage < 1 && done[id] ? 1 : stage,
        wilting: !!m?.wilting,
        shaky: !!m?.shaky,
      };
    });
    const signs: LevelSign[] = LEVELS.map((name, l) => ({
      name,
      done: ruleIds[l].filter((id) => (mastery.get(id)?.stage ?? 0) >= 3).length,
      total: ruleIds[l].length,
      crowned: !!bosses[name]?.passedAt,
    }));
    sceneRef.current?.setState(looks, signs);
  }, [ready, flat, ruleIds, mastery, done, bosses]);

  useEffect(() => {
    if (ready) sceneRef.current?.setSelected(selected ? flat.indexOf(selected) : -1);
  }, [ready, selected, flat]);

  const ruleAt = (e: { clientX: number; clientY: number }) =>
    sceneRef.current?.ruleAt(e.clientX, e.clientY) ?? -1;

  return (
    <div className="pr-tree-wrap">
      <canvas
        ref={canvasRef}
        className="pr-tree"
        role="img"
        aria-label={t('practice.tree.aria')}
        onPointerMove={(e) => {
          const rule = e.pointerType === 'touch' ? -1 : ruleAt(e);
          sceneRef.current?.setHover(rule);
          e.currentTarget.style.cursor = rule >= 0 ? 'pointer' : 'default';
        }}
        onPointerLeave={() => sceneRef.current?.setHover(-1)}
        onClick={(e) => {
          const rule = ruleAt(e);
          if (rule >= 0 && flat[rule]) onSelect(flat[rule]);
        }}
      />
      {!ready && (
        <div className="pr-tree-loading pr-tree-cover">
          {failed ? t('practice.tree.failed') : t('common.loading')}
        </div>
      )}
      {/* the same rules as buttons, for keyboards and screen readers */}
      <ul className="pr-tree-list">
        {flat.map((id, i) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onSelect(id)}
              onFocus={() => sceneRef.current?.setHover(i)}
              onBlur={() => sceneRef.current?.setHover(-1)}
            >
              {labels[i]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
