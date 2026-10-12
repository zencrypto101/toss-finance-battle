import { describe, it, expect } from 'vitest';
import {
  MOCK_OPPONENTS,
  getOpponentById,
  calculateBattleOutcome,
  compareTrajectories,
  simulateUserTrajectory,
} from '../battleUtils';

describe('battleUtils', () => {
  describe('getOpponentById', () => {
    it('returns default opponent when no id is provided', () => {
      const opp = getOpponentById();
      expect(opp.id).toBe(MOCK_OPPONENTS[0].id);
    });

    it('returns specified opponent when valid id provided', () => {
      const opp = getOpponentById('yeouido-sniper');
      expect(opp.name).toContain('여의도 단타 스나이퍼');
      expect(opp.finalReturnRate).toBe(-12.4);
    });

    it('fallbacks to default when unknown id provided', () => {
      const opp = getOpponentById('unknown-id');
      expect(opp.id).toBe(MOCK_OPPONENTS[0].id);
    });
  });

  describe('calculateBattleOutcome', () => {
    it('awards win and +50 EXP when user return is higher', () => {
      const outcome = calculateBattleOutcome(35.5, 20.0);
      expect(outcome.winner).toBe('USER');
      expect(outcome.diffRate).toBe(15.5);
      expect(outcome.expChange).toBe(50);
      expect(outcome.outcomeTitle).toContain('압도적 승리');
      expect(outcome.badgeColor).toBe('#04b067');
    });

    it('penalizes -15 EXP and marks loss when opponent return is higher', () => {
      const outcome = calculateBattleOutcome(-5.0, 15.0);
      expect(outcome.winner).toBe('OPPONENT');
      expect(outcome.diffRate).toBe(20.0);
      expect(outcome.expChange).toBe(-15);
      expect(outcome.outcomeTitle).toContain('쓰라린 패배');
      expect(outcome.badgeColor).toBe('#f04452');
    });

    it('handles exact draw with +10 EXP', () => {
      const outcome = calculateBattleOutcome(10.5, 10.5);
      expect(outcome.winner).toBe('DRAW');
      expect(outcome.diffRate).toBe(0);
      expect(outcome.expChange).toBe(10);
      expect(outcome.outcomeTitle).toContain('무승부');
    });
  });

  describe('compareTrajectories', () => {
    it('identifies tick leaders and tracks max lead', () => {
      const userTraj = [0, 5, 15, 25, 35];
      const oppTraj = [0, 8, 12, 20, 28];

      const res = compareTrajectories(userTraj, oppTraj);
      expect(res.leaderByTick).toHaveLength(5);
      expect(res.leaderByTick[0]).toBe('TIE');
      expect(res.leaderByTick[1]).toBe('OPPONENT'); // 8 > 5
      expect(res.leaderByTick[2]).toBe('USER'); // 15 > 12
      expect(res.leaderByTick[4]).toBe('USER'); // 35 > 28
      expect(res.maxLead).toBe(7); // |35 - 28| = 7
    });

    it('handles mismatched trajectory lengths safely', () => {
      const shortUser = [0, 10];
      const longOpp = [0, 5, 10, 15];

      const res = compareTrajectories(shortUser, longOpp);
      expect(res.leaderByTick).toHaveLength(4);
    });
  });

  describe('simulateUserTrajectory', () => {
    it('creates trajectory ending with final return rate', () => {
      const traj = simulateUserTrajectory(45.0, 5);
      expect(traj).toHaveLength(5);
      expect(traj[0]).toBe(0);
      expect(traj[4]).toBe(45.0);
    });

    it('handles single tick request safely', () => {
      const traj = simulateUserTrajectory(20.0, 1);
      expect(traj).toEqual([20.0]);
    });
  });
});
