import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { markRulesDone } from '../../hooks/useProgress';
import { normalizeUiLang } from '../../i18n/localizeRules';
import { downloadCertificate } from '../../practice/certificate';
import {
  BADGES,
  buildChallengeUrl,
  buildSpec,
  collectStats,
  earnedBadges,
  grammarRulesOfLevel,
  isTracked,
  makeCtxBase,
  masteryMap,
  type PracticeRequest,
  ruleTitle,
  runCtx,
  STAGE_DONE,
  trackStorageKey,
} from '../../practice/engine';
import { makeRng } from '../../practice/rng';
import { sfx } from '../../practice/sound';
import { stopSpeaking } from '../../practice/speech';
import {
  awardBadges,
  getState,
  markItemsKnown,
  recordAnswer,
  recordBoss,
  recordSessionEnd,
  setPlacement,
  streakView,
  todayStat,
} from '../../practice/store';
import type { Exercise, QuickEx } from '../../practice/types';
import { copyToClipboard } from '../../utils/clipboard';
import { ChoiceExercise } from './exercises/ChoiceExercise';
import { displayOption, GapText, Html } from './exercises/common';
import { GapsExercise } from './exercises/GapsExercise';
import { InsertExercise } from './exercises/InsertExercise';
import { MatchExercise } from './exercises/MatchExercise';
import { QuickExercise } from './exercises/QuickExercise';
import { SortExercise } from './exercises/SortExercise';
import { SpotExercise } from './exercises/SpotExercise';
import { StoryExercise } from './exercises/StoryExercise';
import { TilesExercise } from './exercises/TilesExercise';
import { TimelineExercise } from './exercises/TimelineExercise';
import { TranslateExercise } from './exercises/TranslateExercise';
import { TreeExercise } from './exercises/TreeExercise';
import { TrueFalseExercise } from './exercises/TrueFalseExercise';
import { TypeExercise } from './exercises/TypeExercise';
import { RulePeek } from './RulePeek';
import './Practice.css';

interface Props {
  request: PracticeRequest;
  onClose: () => void;
  /** start another request from the results screen (e.g. "practise this rule") */
  onStart: (req: PracticeRequest) => void;
}

interface AnswerLog {
  ex: Exercise;
  correct: boolean;
  score: number;
}

const PRAISE_COUNT = 6;

function instrKey(ex: Exercise): string {
  if (ex.instr) return ex.instr;
  switch (ex.kind) {
    case 'tiles':
      return `tiles.${ex.task}`;
    case 'type':
      return ex.say ? 'dictation' : 'type';
    default:
      return ex.kind;
  }
}

function renderExercise(
  ex: Exercise,
  answered: boolean,
  onAnswer: (c: boolean, s?: number) => void,
  rng: () => number,
  sprint: boolean,
) {
  const p = { answered, onAnswer, rng, sprint };
  switch (ex.kind) {
    case 'choice':
      return <ChoiceExercise ex={ex} {...p} />;
    case 'spot':
      return <SpotExercise ex={ex} {...p} />;
    case 'tiles':
      return <TilesExercise ex={ex} {...p} />;
    case 'sort':
      return <SortExercise ex={ex} {...p} />;
    case 'match':
      return <MatchExercise ex={ex} {...p} />;
    case 'gaps':
      return <GapsExercise ex={ex} {...p} />;
    case 'type':
      return <TypeExercise ex={ex} {...p} />;
    case 'truefalse':
      return <TrueFalseExercise ex={ex} {...p} />;
    case 'tree':
      return <TreeExercise ex={ex} {...p} />;
    case 'timeline':
      return <TimelineExercise ex={ex} {...p} />;
    case 'translate':
      return <TranslateExercise ex={ex} {...p} />;
    case 'quick':
      return <QuickExercise ex={ex} {...p} />;
    case 'insert':
      return <InsertExercise ex={ex} {...p} />;
    case 'story':
      return <StoryExercise ex={ex} {...p} />;
  }
}

export default function GameRunner({ request, onClose, onStart }: Props) {
  const { t, i18n } = useTranslation();
  const lang = normalizeUiLang(i18n.language);
  const base = useMemo(() => makeCtxBase(i18n), [i18n]);
  const [spec] = useState(() => buildSpec(request, base));
  const genCtx = useRef(runCtx(spec, base));
  const rng = useMemo(() => makeRng(spec.seed ^ 0x51ed), [spec.seed]);

  const [masteryBefore] = useState(() => masteryMap(base.index, base.state));

  const [queue, setQueue] = useState<Exercise[]>(() => {
    if (spec.placement) {
      const first = spec.placement.next(null);
      return first ? [first] : [];
    }
    if (spec.gen) {
      const first = spec.gen(genCtx.current, 0);
      return first ? [first] : [];
    }
    return spec.exercises;
  });
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [last, setLast] = useState<AnswerLog | null>(null);
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [lives, setLives] = useState(spec.lives ?? 0);
  const [timeLeft, setTimeLeft] = useState(spec.timeMs ?? 0);
  const [done, setDone] = useState(queue.length === 0);
  const [retried] = useState(() => new Set<string>());
  const exStart = useRef(Date.now());
  /** rule opened over the game (the round stays exactly where it was) */
  const [peek, setPeek] = useState<string | null>(null);
  const praise = useRef(0);

  const current = queue[idx];

  const closeEarly = useCallback(() => {
    markMastered(base, new Set(log.flatMap((l) => l.ex.rules)));
    onClose();
  }, [base, log, onClose]);
  const sprint = spec.mode === 'sprint';
  const total =
    spec.mode === 'lesson' || spec.mode === 'exam' || spec.mode === 'testout'
      ? queue.length
      : undefined;

  // Sprint timer
  useEffect(() => {
    if (!sprint || done) return;
    const started = Date.now();
    const initial = spec.timeMs ?? 0;
    const id = setInterval(() => {
      const left = Math.max(0, initial - (Date.now() - started));
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(id);
        setDone(true);
      }
    }, 200);
    return () => clearInterval(id);
  }, [sprint, done, spec.timeMs]);

  // Lock page scroll while the runner is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      stopSpeaking();
    };
  }, []);

  const advance = useCallback(
    (lastLog: AnswerLog | null) => {
      setAnswered(false);
      setLast(null);
      exStart.current = Date.now();
      if (spec.placement) {
        const next = spec.placement.next(lastLog ? lastLog.correct : null);
        if (!next) {
          setDone(true);
          return;
        }
        setQueue((q) => [...q, next]);
        setIdx((i) => i + 1);
        return;
      }
      if (spec.gen) {
        if (spec.mode === 'survival' && lives <= 0) {
          setDone(true);
          return;
        }
        const next = spec.gen(genCtx.current, idx + 1);
        if (!next) {
          setDone(true);
          return;
        }
        setQueue((q) => [...q, next]);
        setIdx((i) => i + 1);
        return;
      }
      if (idx + 1 >= queue.length) {
        setDone(true);
        return;
      }
      setIdx((i) => i + 1);
    },
    [spec, idx, queue.length, lives],
  );

  const onAnswer = useCallback(
    (correct: boolean, score = correct ? 1 : 0) => {
      if (answered || done || !current) return;
      const ms = Date.now() - exStart.current;
      const nextCombo = correct ? combo + 1 : 0;
      const bonus = correct
        ? sprint
          ? Math.min(nextCombo, 10)
          : nextCombo >= 6
            ? 5
            : nextCombo >= 3
              ? 2
              : 0
        : 0;
      const tracked = spec.srs && isTracked(current) && spec.mode !== 'placement';
      const gained = recordAnswer(tracked ? current.itemId : null, correct, {
        srs: tracked,
        bonus,
        ms,
      });
      setXp((x) => x + gained);
      setCombo(nextCombo);
      setMaxCombo((m) => Math.max(m, nextCombo));
      if (correct) sfx.correct(nextCombo);
      else sfx.wrong();
      const entry = { ex: current, correct, score };
      setLog((l) => [...l, entry]);
      setLast(entry);
      setAnswered(true);
      if (!correct) {
        if (spec.mode === 'survival') setLives((l) => l - 1);
        if (spec.retryWrong && !retried.has(current.itemId) && retried.size < 4) {
          retried.add(current.itemId);
          setQueue((q) => [...q, current]);
        }
      }
      if (correct) praise.current = (praise.current + 1) % PRAISE_COUNT;
      // a wrong quick pick shows its one-line reason, so it stays up a little longer
      const pause = correct ? 350 : current.kind === 'quick' && current.why ? 2200 : 1100;
      if (sprint) setTimeout(() => advance(entry), pause);
    },
    [answered, done, current, combo, sprint, spec, retried, advance],
  );

  // Enter = continue
  useEffect(() => {
    if (!answered || sprint || done || peek) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault();
        advance(last);
      }
    }
    const id = setTimeout(() => window.addEventListener('keydown', onKey), 50);
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', onKey);
    };
  }, [answered, sprint, done, advance, last, peek]);

  // Esc = the ✕ button: close the rule if one is open, otherwise leave the game
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      if (peek) setPeek(null);
      else if (done) onClose();
      else closeEarly();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [peek, done, onClose, closeEarly]);

  if (done) {
    return createPortal(
      <div className="pr-overlay" role="dialog" aria-modal="true">
        <div className="pr-runner">
          <Results
            spec={spec}
            log={log}
            xp={xp}
            maxCombo={maxCombo}
            base={base}
            masteryBefore={masteryBefore}
            lang={lang}
            onClose={onClose}
            onOpenRule={(id) => {
              // word topics have no rule page
              if (base.index.rules.get(id)?.track !== 'words') setPeek(id);
            }}
            onStart={onStart}
          />
          {peek && <RulePeek ruleId={peek} onClose={() => setPeek(null)} />}
        </div>
      </div>,
      document.body,
    );
  }

  const correctCount = log.filter((l) => l.correct).length;
  const progress = total ? Math.min(1, log.length / total) : 0;
  const ruleId = current?.rules[0];
  const isNewRule =
    spec.newRule && current?.rules.includes(spec.newRule) && !base.state.items[current.itemId];

  return createPortal(
    <div className="pr-overlay" role="dialog" aria-modal="true">
      <div className="pr-runner">
        <div className="pr-topbar">
          <button
            type="button"
            className="pr-close"
            onClick={closeEarly}
            aria-label={t('practice.close')}
          >
            ✕
          </button>
          {total !== undefined && (
            <div
              className="pr-progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={log.length}
            >
              <div className="pr-progress-fill" style={{ width: `${progress * 100}%` }} />
            </div>
          )}
          {sprint && (
            <div className="pr-timer">
              <div className="pr-progress">
                <div
                  className={`pr-progress-fill timer${timeLeft < 10_000 ? ' low' : ''}`}
                  style={{ width: `${(timeLeft / (spec.timeMs ?? 1)) * 100}%` }}
                />
              </div>
              <span>{Math.ceil(timeLeft / 1000)}s</span>
            </div>
          )}
          {spec.mode === 'survival' && (
            <div className="pr-lives" role="img" aria-label={t('practice.lives', { n: lives })}>
              {Array.from({ length: spec.lives ?? 0 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed heart slots
                <span key={i} className={i < lives ? 'on' : 'off'}>
                  ❤️
                </span>
              ))}
            </div>
          )}
          {spec.mode === 'placement' && spec.placement && (
            <div className="pr-placement-level">{spec.placement.progress().level}</div>
          )}
          <div className={`pr-combo${combo >= 3 ? ' hot' : ''}`} title={t('practice.combo')}>
            {combo >= 2 ? `🔥 ×${combo}` : ''}
          </div>
          <div className="pr-xp">+{xp} XP</div>
        </div>

        <div className="pr-stage">
          {current && (
            <>
              <div className="pr-instr">
                {isNewRule && <span className="pr-new">{t('practice.newRule')}</span>}
                {t(`practice.instr.${instrKey(current)}`)}
              </div>
              <div key={idx} className="pr-ex-wrap">
                {renderExercise(current, answered, onAnswer, rng, sprint)}
              </div>
            </>
          )}
        </div>

        {answered && last && !sprint && (
          <div className={`pr-feedback ${last.correct ? 'ok' : 'bad'}`}>
            <div className="pr-feedback-main">
              <div className="pr-feedback-title">
                {last.correct
                  ? `✓ ${t(`practice.praise.${praise.current}`)}`
                  : last.score > 0
                    ? `◐ ${t('practice.partly', { pct: Math.round(last.score * 100) })}`
                    : `✗ ${t('practice.notQuite')}`}
              </div>
              {last.ex.why && <Html className="pr-why" html={last.ex.why} />}
              {ruleId &&
                base.index.rules.get(ruleId) &&
                base.index.rules.get(ruleId)?.track !== 'words' && (
                  <button type="button" className="pr-rule-link" onClick={() => setPeek(ruleId)}>
                    📖 {ruleTitle(i18n, ruleId)}
                  </button>
                )}
            </div>
            <button
              type="button"
              className="pr-btn primary pr-continue"
              onClick={() => advance(last)}
            >
              {t('practice.continue')}
            </button>
          </div>
        )}
        {sprint && (
          <div className="pr-sprint-score">
            {t('practice.score')}: <b>{correctCount}</b>
          </div>
        )}
        {peek && <RulePeek ruleId={peek} onClose={() => setPeek(null)} />}
      </div>
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

/** Mark rules that reached the "blossom" stage as done in the Grammar/Murphy progress. */
function markMastered(base: ReturnType<typeof makeCtxBase>, ruleIds: Iterable<string>) {
  const after = masteryMap(base.index, getState());
  const byStore: Record<string, string[]> = {};
  for (const id of ruleIds) {
    if ((after.get(id)?.stage ?? 0) >= STAGE_DONE && !base.done[id]) {
      const sk = trackStorageKey(base.index, id);
      if (sk) byStore[sk] = [...(byStore[sk] ?? []), id];
    }
  }
  for (const [sk, ids] of Object.entries(byStore)) markRulesDone(sk, [...new Set(ids)]);
  return after;
}

interface Outcome {
  grown: { id: string; from: number; to: number }[];
  badges: string[];
}

const finishedRuns = new WeakMap<object, Outcome>();

interface ResultsProps {
  spec: ReturnType<typeof buildSpec>;
  log: AnswerLog[];
  xp: number;
  maxCombo: number;
  base: ReturnType<typeof makeCtxBase>;
  masteryBefore: ReturnType<typeof masteryMap>;
  lang: string;
  onClose: () => void;
  onOpenRule: (ruleId: string) => void;
  onStart: (req: PracticeRequest) => void;
}

function Results({
  spec,
  log,
  xp,
  maxCombo,
  base,
  masteryBefore,
  lang,
  onClose,
  onOpenRule,
  onStart,
}: ResultsProps) {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [placementApplied, setPlacementApplied] = useState(false);
  const correct = log.filter((l) => l.correct).length;
  const n = log.length;
  const pct = n ? correct / n : 0;
  const passed = spec.passPct !== undefined ? pct >= spec.passPct && n > 0 : undefined;
  const placementLevel = spec.placement?.result();

  // One-time side effects of finishing, run from an effect (never during render) and keyed
  // on the spec object so React StrictMode's double effects cannot record anything twice.
  const computeOutcome = (): Outcome => {
    const req = spec.request;
    const index = base.index;
    if (n > 0)
      recordSessionEnd(
        spec.key,
        spec.mode === 'sprint' || spec.mode === 'survival' ? correct : Math.round(pct * 100),
      );

    if (req.type === 'testout' && passed) {
      markItemsKnown(
        log.filter((l) => l.correct).map((l) => l.ex.itemId),
        3,
      );
    }
    if (req.type === 'boss') recordBoss(req.level, Math.round(pct * 100), !!passed);

    // Rules that grew a stage
    const touched = new Set(log.flatMap((l) => l.ex.rules));
    if (req.type === 'testout') touched.add(req.ruleId);
    const after = markMastered(base, touched);
    const grown: { id: string; from: number; to: number }[] = [];
    for (const id of touched) {
      const b = masteryBefore.get(id)?.stage ?? 0;
      const a = after.get(id)?.stage ?? 0;
      if (a > b) grown.push({ id, from: b, to: a });
    }
    const testSk = req.type === 'testout' ? trackStorageKey(index, req.ruleId) : null;
    if (req.type === 'testout' && passed && testSk && !base.done[req.ruleId]) {
      markRulesDone(testSk, [req.ruleId]);
    }

    const stats = {
      ...collectStats(getState(), index),
      perfect: n >= 10 && correct === n,
      bestCombo: maxCombo,
      sprintScore: spec.mode === 'sprint' ? correct : 0,
    };
    const badges = awardBadges(earnedBadges(stats));
    sfx.finish();
    return { grown: grown.sort((a, b) => b.to - a.to), badges };
  };
  const [outcome, setOutcome] = useState<Outcome>(
    () => finishedRuns.get(spec) ?? { grown: [], badges: [] },
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: finishing happens once per run
  useEffect(() => {
    let o = finishedRuns.get(spec);
    if (!o) {
      o = computeOutcome();
      finishedRuns.set(spec, o);
    }
    setOutcome(o);
  }, [spec]);

  const streak = streakView(getState());
  const today = todayStat(getState());
  const goal = getState().settings.goal;
  const req = spec.request;

  async function share() {
    if (!spec.shareGameId) return;
    const score = spec.mode === 'sprint' || spec.mode === 'survival' ? correct : correct;
    const url = buildChallengeUrl({
      g: spec.shareGameId,
      s: spec.seed,
      sc: score,
      n: Math.max(n, 1),
      l: lang,
    });
    const text = t('practice.challengeShareText', { score, n });
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      try {
        await navigator.share({ title: 'English Grammar Tree', text, url });
        return;
      } catch {
        // fall back to copy
      }
    }
    await copyToClipboard(`${text} ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function applyPlacement(markKnown: boolean) {
    if (!placementLevel) return;
    setPlacement(placementLevel);
    if (markKnown) {
      const lvlIdx = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(placementLevel);
      const ids = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
        .slice(0, lvlIdx)
        .flatMap((l) => grammarRulesOfLevel(base.index, l));
      markRulesDone('eng_v4', ids);
    }
    setPlacementApplied(true);
  }

  // quick-fire rounds leave no time to read: list what went wrong, once each
  const review: QuickEx[] = [];
  for (const l of log) {
    if (l.correct || l.ex.kind !== 'quick' || review.length >= 6) continue;
    if (!review.some((r) => r.itemId === l.ex.itemId)) review.push(l.ex);
  }

  const beat = spec.challenge ? correct > spec.challenge.sc : undefined;
  const headline =
    req.type === 'placement'
      ? t('practice.results.placementTitle', { level: placementLevel })
      : passed === true
        ? t(req.type === 'boss' ? 'practice.results.examPassed' : 'practice.results.testPassed')
        : passed === false
          ? t('practice.results.notPassed')
          : pct >= 0.9
            ? t('practice.results.excellent')
            : pct >= 0.6
              ? t('practice.results.good')
              : t('practice.results.keepGoing');

  return (
    <div className="pr-results">
      <div className="pr-results-icon">{passed === false ? '🌱' : spec.icon}</div>
      <h2 className="pr-results-title">{headline}</h2>

      {req.type !== 'placement' && (
        <div className="pr-results-stats">
          <div className="pr-stat">
            <b>
              {correct}/{n}
            </b>
            <span>{t('practice.results.correct')}</span>
          </div>
          <div className="pr-stat">
            <b>+{xp}</b>
            <span>XP</span>
          </div>
          <div className="pr-stat">
            <b>×{maxCombo}</b>
            <span>{t('practice.results.bestCombo')}</span>
          </div>
        </div>
      )}

      {spec.challenge && (
        <div className={`pr-challenge-result ${beat ? 'won' : 'lost'}`}>
          {beat
            ? t('practice.results.challengeWon', { score: spec.challenge.sc })
            : t('practice.results.challengeLost', { score: spec.challenge.sc })}
        </div>
      )}

      <div className="pr-goal-line">
        {streak.doneToday ? (
          <span>🔥 {t('practice.results.goalDone', { n: streak.current })}</span>
        ) : (
          <span>🎯 {t('practice.results.goalLeft', { xp: Math.max(0, goal - today.xp) })}</span>
        )}
      </div>

      {req.type === 'placement' && placementLevel && (
        <div className="pr-placement-box">
          <p>{t('practice.results.placementText', { level: placementLevel })}</p>
          {!placementApplied ? (
            <div className="pr-actions">
              {placementLevel !== 'A1' && (
                <button
                  type="button"
                  className="pr-btn primary"
                  onClick={() => applyPlacement(true)}
                >
                  {t('practice.results.placementMark', { level: placementLevel })}
                </button>
              )}
              <button type="button" className="pr-btn ghost" onClick={() => applyPlacement(false)}>
                {t('practice.results.placementOnly', { level: placementLevel })}
              </button>
            </div>
          ) : (
            <p className="pr-ok-note">✓ {t('practice.results.placementSaved')}</p>
          )}
        </div>
      )}

      {review.length > 0 && (
        <div className="pr-review">
          <div className="pr-section-label">{t('practice.results.review')}</div>
          {review.map((ex) => (
            <div key={ex.itemId} className="pr-review-row">
              <div className="pr-review-text">
                <GapText text={ex.prompt} fill={displayOption(ex.options[ex.answer])} state="ok" />
              </div>
              {ex.why && <Html className="pr-review-why" html={ex.why} />}
            </div>
          ))}
        </div>
      )}

      {outcome.grown.length > 0 && (
        <div className="pr-grown">
          <div className="pr-section-label">{t('practice.results.grown')}</div>
          {outcome.grown.slice(0, 6).map((g) => (
            <button
              key={g.id}
              type="button"
              className="pr-grown-row"
              onClick={() => onOpenRule(g.id)}
            >
              <span className="pr-stage-icons">
                {t(`practice.stage.icon${g.from}`)} → {t(`practice.stage.icon${g.to}`)}
              </span>
              <span className="pr-grown-title">{ruleTitle(i18n, g.id)}</span>
            </button>
          ))}
        </div>
      )}

      {outcome.badges.length > 0 && (
        <div className="pr-new-badges">
          <div className="pr-section-label">{t('practice.results.newBadges')}</div>
          <div className="pr-badge-row">
            {outcome.badges.map((id) => (
              <div key={id} className="pr-badge earned pop">
                <span className="pr-badge-icon">{BADGES.find((b) => b.id === id)?.icon}</span>
                <span className="pr-badge-name">{t(`practice.badges.${id}.title`)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {req.type === 'boss' && passed && (
        <button
          type="button"
          className="pr-btn ghost"
          onClick={() =>
            void downloadCertificate(req.level, {
              heading: t('practice.cert.heading'),
              line: t('practice.cert.line'),
              levelName: t(`practice.levelName.${req.level}`),
              scoreLine: t('practice.cert.score', { pct: Math.round(pct * 100) }),
              date: new Date().toLocaleDateString(i18n.language),
            })
          }
        >
          📜 {t('practice.cert.download')}
        </button>
      )}

      {req.type === 'testout' && passed === false && (
        <button
          type="button"
          className="pr-btn ghost"
          onClick={() => onStart({ type: 'rule', ruleId: req.ruleId })}
        >
          🎯 {t('practice.results.practiseRule')}
        </button>
      )}

      <div className="pr-actions pr-results-actions">
        {spec.shareGameId && n > 0 && (
          <button type="button" className="pr-btn ghost" onClick={share}>
            {copied ? t('copied') : `🏁 ${t('practice.results.challenge')}`}
          </button>
        )}
        {(req.type === 'game' || req.type === 'rule' || req.type === 'boss') && (
          <button
            type="button"
            className="pr-btn ghost"
            onClick={() =>
              onStart({
                ...req,
                ...(req.type === 'game' ? { seed: undefined, challenge: undefined } : {}),
              })
            }
          >
            ↻ {t('practice.results.again')}
          </button>
        )}
        <button type="button" className="pr-btn primary" onClick={onClose}>
          {t('practice.results.done')}
        </button>
      </div>
    </div>
  );
}
