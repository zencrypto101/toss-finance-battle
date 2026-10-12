import { describe, it, expect } from 'vitest';
import {
  isAllCoursesCompleted,
  calculateComprehensiveScore,
  evaluatePromotionCelebration,
} from '../gameEngine';

describe('gameEngine', () => {
  describe('isAllCoursesCompleted', () => {
    it('returns true only when all three courses are completed', () => {
      expect(isAllCoursesCompleted({ chart: true, dart: true, finance: true })).toBe(true);
    });

    it('returns false if any course is missing', () => {
      expect(isAllCoursesCompleted({ chart: true, dart: false, finance: true })).toBe(false);
      expect(isAllCoursesCompleted({ chart: false, dart: false, finance: false })).toBe(false);
    });
  });

  describe('calculateComprehensiveScore', () => {
    it('calculates weighted score (Chart 40%, DART 30%, Finance 30%)', () => {
      // 100 * 0.4 + 80 * 0.3 + 90 * 0.3 = 40 + 24 + 27 = 91
      const score = calculateComprehensiveScore(100, 80, 90);
      expect(score).toBe(91);
    });

    it('clamps inputs properly between 0 and 100', () => {
      expect(calculateComprehensiveScore(0, 0, 0)).toBe(0);
      expect(calculateComprehensiveScore(100, 100, 100)).toBe(100);
    });
  });

  describe('evaluatePromotionCelebration', () => {
    it('does not celebrate when courses are incomplete', () => {
      const res = evaluatePromotionCelebration({ chart: true, dart: false, finance: true }, 4, 85);
      expect(res.shouldCelebrate).toBe(false);
      expect(res.isAllCompleted).toBe(false);
    });

    it('celebrates officer promotion upon full course completion for mid tiers', () => {
      const res = evaluatePromotionCelebration({ chart: true, dart: true, finance: true }, 4, 85);
      expect(res.shouldCelebrate).toBe(true);
      expect(res.isAllCompleted).toBe(true);
      expect(res.isCommanderRank).toBe(false);
      expect(res.celebrationTitle).toContain('정예 임관 축하');
      expect(res.unlockedPrivileges.length).toBeGreaterThanOrEqual(3);
    });

    it('triggers supreme commander celebration for Level 6 and above', () => {
      const res = evaluatePromotionCelebration({ chart: true, dart: true, finance: true }, 6, 96);
      expect(res.shouldCelebrate).toBe(true);
      expect(res.isCommanderRank).toBe(true);
      expect(res.celebrationTitle).toContain('사령관');
      expect(res.unlockedPrivileges).toContain('상위 0.1% 극야수 사령관 명예의 전당 등재');
    });
  });
});
