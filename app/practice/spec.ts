/** Turns a lightweight practice request into a runnable game spec. */

import type { TrapKey } from './content/types';
import { getGame } from './games';
import { makeRng, randomSeed } from './rng';
import {
  BOSS_PASS,
  type BuildCtx,
  buildBoss,
  buildDaily,
  buildMistakeDeck,
  buildRulePractice,
  buildTestOut,
  buildTrapSession,
  createPlacement,
  type Generator,
  type PlacementController,
  TEST_OUT_SIZE,
} from './session';
import type { Exercise } from './types';

export type PracticeRequest =
  | { type: 'daily' }
  | { type: 'rule'; ruleId: string }
  | { type: 'testout'; ruleId: string }
  | { type: 'deck' }
  | { type: 'game'; gameId: string; seed?: number; challenge?: { sc: number; n: number } }
  | { type: 'boss'; level: string }
  | { type: 'placement' }
  | { type: 'trap'; trap: TrapKey };

export type SpecMode = 'lesson' | 'sprint' | 'survival' | 'placement' | 'exam' | 'testout';

export interface GameSpec {
  request: PracticeRequest;
  /** key for high scores in state.games */
  key: string;
  icon: string;
  mode: SpecMode;
  exercises: Exercise[];
  gen?: Generator;
  placement?: PlacementController;
  timeMs?: number;
  lives?: number;
  passPct?: number;
  /** re-ask wrong answers once at the end of a lesson */
  retryWrong: boolean;
  /** record answers into the SRS schedule */
  srs: boolean;
  seed: number;
  /** catalog id when the game can be shared as a challenge */
  shareGameId?: string;
  challenge?: { sc: number; n: number };
  newRule?: string | null;
}

export type CtxBase = Omit<BuildCtx, 'rng' | 'personal'>;

export function buildSpec(req: PracticeRequest, base: CtxBase): GameSpec {
  const seed = req.type === 'game' && req.seed !== undefined ? req.seed : randomSeed();
  const personal = !(req.type === 'game' && (req.challenge || req.gameId === 'daily-challenge'));
  const ctx: BuildCtx = { ...base, rng: makeRng(seed), personal };
  const common = { request: req, seed, srs: true, retryWrong: false };

  switch (req.type) {
    case 'daily': {
      const plan = buildDaily(ctx);
      return {
        ...common,
        key: 'daily',
        icon: '🌳',
        mode: 'lesson',
        exercises: plan.exercises,
        retryWrong: true,
        newRule: plan.newRule,
      };
    }
    case 'rule':
      return {
        ...common,
        key: 'rule',
        icon: '🎯',
        mode: 'lesson',
        exercises: buildRulePractice(ctx, req.ruleId),
        retryWrong: true,
      };
    case 'testout':
      return {
        ...common,
        key: 'testout',
        icon: '🧪',
        mode: 'testout',
        exercises: buildTestOut(ctx, req.ruleId),
        passPct: (TEST_OUT_SIZE - 1) / TEST_OUT_SIZE,
      };
    case 'deck':
      return {
        ...common,
        key: 'deck',
        icon: '🩹',
        mode: 'lesson',
        exercises: buildMistakeDeck(ctx),
        retryWrong: true,
      };
    case 'boss':
      return {
        ...common,
        key: `boss:${req.level}`,
        icon: '👑',
        mode: 'exam',
        exercises: buildBoss(ctx, req.level),
        passPct: BOSS_PASS,
      };
    case 'trap':
      return {
        ...common,
        key: `trap:${req.trap}`,
        icon: '🪤',
        mode: 'lesson',
        exercises: buildTrapSession(ctx, req.trap),
        retryWrong: true,
      };
    case 'placement':
      return {
        ...common,
        key: 'placement',
        icon: '🧭',
        mode: 'placement',
        exercises: [],
        placement: createPlacement(ctx),
        srs: false,
      };
    case 'game': {
      const g = getGame(req.gameId);
      if (!g) return { ...common, key: 'none', icon: '❔', mode: 'lesson', exercises: [] };
      const shared = {
        ...common,
        key: `game:${g.id}`,
        icon: g.icon,
        shareGameId: g.id,
        challenge: req.challenge,
      };
      if (g.mode === 'sprint')
        return { ...shared, mode: 'sprint', exercises: [], gen: g.gen, timeMs: g.timeMs };
      if (g.mode === 'survival')
        return { ...shared, mode: 'survival', exercises: [], gen: g.gen, lives: g.lives };
      return {
        ...shared,
        mode: 'lesson',
        exercises: g.build?.(ctx) ?? [],
        retryWrong: !req.challenge,
      };
    }
  }
}

/** The ctx used by generators during a run (sprint/survival need it per step). */
export function runCtx(spec: GameSpec, base: CtxBase): BuildCtx {
  return { ...base, rng: makeRng(spec.seed ^ 0x9e3779b9), personal: !spec.challenge };
}
