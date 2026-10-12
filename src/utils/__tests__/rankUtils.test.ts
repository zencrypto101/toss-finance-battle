import { describe, it, expect } from 'vitest';
import {
  RANK_TIERS,
  calculateTierProgress,
  formatExpRemaining,
  getRankDivision,
  formatKRW,
  getRankFeeDiscount,
} from '../rankUtils';

describe('RANK_TIERS', () => {
  it('should have 7 tiers strictly ordered by level and requiredExp', () => {
    expect(RANK_TIERS).toHaveLength(7);
    for (let i = 0; i < RANK_TIERS.length; i++) {
      expect(RANK_TIERS[i].level).toBe(i + 1);
      if (i > 0) {
        expect(RANK_TIERS[i].requiredExp).toBeGreaterThan(RANK_TIERS[i - 1].requiredExp);
      }
    }
  });
});

describe('calculateTierProgress', () => {
  it('calculates level 1 progress accurately', () => {
    // Level 1: 0 to 100
    const result = calculateTierProgress(50, 1);
    expect(result.percent).toBe(50);
    expect(result.expInTier).toBe(50);
    expect(result.expNeededForTier).toBe(100);
    expect(result.isMaxLevel).toBe(false);
  });

  it('calculates level 2 progress within tier boundary', () => {
    // Level 2: 100 to 250 (range 150). CurrentExp = 175 -> (175 - 100) / 150 = 50%
    const result = calculateTierProgress(175, 2);
    expect(result.percent).toBe(50);
    expect(result.expInTier).toBe(75);
    expect(result.expNeededForTier).toBe(150);
  });

  it('returns 100% when user reaches or exceeds next tier threshold', () => {
    const result = calculateTierProgress(300, 2);
    expect(result.percent).toBe(100);
  });

  it('handles negative or demoted experience safely', () => {
    const result = calculateTierProgress(-20, 1);
    expect(result.percent).toBe(0);
    expect(result.expInTier).toBe(0);
  });

  it('handles maximum level (Level 7) properly', () => {
    const result = calculateTierProgress(3000, 7);
    expect(result.percent).toBe(100);
    expect(result.isMaxLevel).toBe(true);
    expect(result.expNeededForTier).toBe(0);
  });
});

describe('formatExpRemaining', () => {
  it('formats remaining exp and calculates game estimates correctly', () => {
    const info = formatExpRemaining(90, 45);
    expect(info.expText).toBe('90 EXP');
    expect(info.gamesEstimate).toBe(2);
    expect(info.label).toContain('약 2판 승리');
  });

  it('handles zero or negative remaining exp for maxed ranks', () => {
    const info = formatExpRemaining(0);
    expect(info.expText).toBe('0 EXP');
    expect(info.gamesEstimate).toBe(0);
    expect(info.label).toBe('최고 존엄 달성');
  });
});

describe('getRankDivision', () => {
  it('returns correct tactical division info based on level', () => {
    expect(getRankDivision(1).category).toBe('TRAINEE');
    expect(getRankDivision(2).category).toBe('ENLISTED');
    expect(getRankDivision(3).category).toBe('NCO');
    expect(getRankDivision(4).category).toBe('OFFICER');
    expect(getRankDivision(5).category).toBe('OFFICER');
    expect(getRankDivision(6).category).toBe('GENERAL');
    expect(getRankDivision(7).category).toBe('GENERAL');
  });
});

describe('formatKRW', () => {
  it('formats positive numbers into Korean Won style', () => {
    expect(formatKRW(10000000)).toBe('10,000,000원');
    expect(formatKRW(1234.56)).toBe('1,235원');
  });

  it('formats zero and negative amounts', () => {
    expect(formatKRW(0)).toBe('0원');
    expect(formatKRW(-50000)).toBe('-50,000원');
  });
});

describe('getRankFeeDiscount', () => {
  it('returns baseline fee for level 1 (recruit)', () => {
    const fee = getRankFeeDiscount(1);
    expect(fee.discountPercent).toBe(0);
    expect(fee.discountBadge).toBe('기본 수수료');
  });

  it('provides stepped discounts as rank increases', () => {
    expect(getRankFeeDiscount(2).discountPercent).toBe(10);
    expect(getRankFeeDiscount(3).discountPercent).toBe(20);
    expect(getRankFeeDiscount(4).discountPercent).toBe(35);
    expect(getRankFeeDiscount(5).discountPercent).toBe(50);
    expect(getRankFeeDiscount(6).discountPercent).toBe(70);
    expect(getRankFeeDiscount(7).discountPercent).toBe(99);
  });

  it('includes monthly savings estimate and perk description', () => {
    const officerFee = getRankFeeDiscount(4);
    expect(officerFee.monthlySavingsEstimate).toContain('절감');
    expect(officerFee.perkDescription).toContain('장교');
  });
});
