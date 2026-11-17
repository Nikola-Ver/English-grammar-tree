import {
  createContext,
  lazy,
  type ReactNode,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { useTranslation } from 'react-i18next';
import { getClaudeLog, subscribeClaudeLog } from '../../practice/claudeLog';
import { flushPracticeSync } from '../../practice/practiceSync';
import type { PracticeRequest } from '../../practice/spec';
import type { RuleMastery } from '../../practice/srs';
import { getState, ingestClaudeMistakes } from '../../practice/store';
import { usePracticeState } from '../../practice/usePracticeState';
import { getSocialState, publishProfile } from '../../social/social';

const getSocialMe = () => getSocialState().me;

import { profileStatsFrom, useSocial } from '../../social/stats';

type Engine = typeof import('../../practice/engine');

const GameRunner = lazy(() => import('./GameRunner'));

interface PracticeContextValue {
  start: (req: PracticeRequest) => void;
  /** null until the engine has loaded */
  engine: Engine | null;
  mastery: Map<string, RuleMastery> | null;
}

const PracticeContext = createContext<PracticeContextValue>({
  start: () => {},
  engine: null,
  mastery: null,
});

export function usePractice(): PracticeContextValue {
  return useContext(PracticeContext);
}

let enginePromise: Promise<Engine> | null = null;
export function loadEngine(): Promise<Engine> {
  enginePromise ??= import('../../practice/engine');
  return enginePromise;
}

interface Props {
  children: ReactNode;
  onOpenRule: (ruleId: string) => void;
}

export function PracticeProvider({ children, onOpenRule }: Props) {
  const { i18n } = useTranslation();
  const state = usePracticeState();
  const [engine, setEngine] = useState<Engine | null>(null);
  const [active, setActive] = useState<{ req: PracticeRequest; n: number } | null>(null);
  const social = useSocial();

  useEffect(() => {
    let cancelled = false;
    void loadEngine().then((m) => {
      if (!cancelled) setEngine(() => m);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const index = useMemo(
    () => (engine ? engine.indexFor(i18n) : null),
    [engine, i18n, i18n.language],
  );
  const mastery = useMemo(
    () => (engine && index ? engine.masteryMap(index, state) : null),
    [engine, index, state],
  );

  // Mistakes reported by the Claude connector send items of that rule back to training.
  const claudeLog = useSyncExternalStore(subscribeClaudeLog, getClaudeLog, getClaudeLog);
  useEffect(() => {
    if (index && claudeLog.length) ingestClaudeMistakes(claudeLog, (r) => index.byRule.get(r));
  }, [index, claudeLog]);

  // Installed-PWA icon badge: number of wilting rules.
  useEffect(() => {
    if (!mastery) return;
    const nav = navigator as Navigator & {
      setAppBadge?: (n: number) => Promise<void>;
      clearAppBadge?: () => Promise<void>;
    };
    let wilting = 0;
    for (const m of mastery.values()) if (m.wilting || m.shaky) wilting++;
    try {
      if (wilting > 0) void nav.setAppBadge?.(wilting).catch(() => {});
      else void nav.clearAppBadge?.().catch(() => {});
    } catch {
      // unsupported
    }
  }, [mastery]);

  const masteredRef = useRef(0);
  const mastered = useMemo(() => {
    if (!mastery) return 0;
    let n = 0;
    for (const m of mastery.values()) if (m.stage >= 3) n++;
    return n;
  }, [mastery]);

  masteredRef.current = mastered;

  // Keep the public leaderboard card current (publishProfile skips unchanged values and throttles).
  useEffect(() => {
    if (social.me && mastery) void publishProfile(profileStatsFrom(state, mastered));
  }, [social.me, mastery, state, mastered]);

  const start = useCallback((req: PracticeRequest) => {
    setActive((prev) => ({ req, n: (prev?.n ?? 0) + 1 }));
  }, []);

  const close = useCallback(() => {
    setActive(null);
    // End of a session: save to the cloud now and refresh the leaderboard card.
    void flushPracticeSync();
    if (getSocialMe()) void publishProfile(profileStatsFrom(getState(), masteredRef.current), true);
  }, []);

  const openRule = useCallback(
    (ruleId: string) => {
      setActive(null);
      onOpenRule(ruleId);
    },
    [onOpenRule],
  );

  const value = useMemo(() => ({ start, engine, mastery }), [start, engine, mastery]);

  return (
    <PracticeContext.Provider value={value}>
      {children}
      {active && (
        <Suspense fallback={null}>
          <GameRunner
            key={active.n}
            request={active.req}
            onClose={close}
            onOpenRule={openRule}
            onStart={start}
          />
        </Suspense>
      )}
    </PracticeContext.Provider>
  );
}
