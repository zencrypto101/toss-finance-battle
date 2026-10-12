import { describe, it, expect } from 'vitest';
import {
  calculateCAGR,
  calculateOperatingMargin,
  evaluateDebtHealth,
  analyzeThreeYearFinancials,
  calculateFinanceCourseScore,
  YearlyFinancialMetric,
} from '../financeUtils';

describe('financeUtils', () => {
  describe('calculateCAGR', () => {
    it('calculates accurate compound annual growth rate', () => {
      // 100 -> 144 in 2 years = sqrt(1.44) - 1 = +20%
      const cagr = calculateCAGR(100, 144, 2);
      expect(cagr).toBe(20);
    });

    it('returns 0 when start or end value is zero or negative', () => {
      expect(calculateCAGR(0, 100, 3)).toBe(0);
      expect(calculateCAGR(100, -50, 3)).toBe(0);
      expect(calculateCAGR(100, 0, 3)).toBe(0);
    });

    it('returns 0 when years is 0 or negative', () => {
      expect(calculateCAGR(100, 200, 0)).toBe(0);
      expect(calculateCAGR(100, 200, -1)).toBe(0);
    });
  });

  describe('calculateOperatingMargin', () => {
    it('calculates operating profit margin in percent', () => {
      expect(calculateOperatingMargin(250, 1000)).toBe(25);
      expect(calculateOperatingMargin(15, 100)).toBe(15);
    });

    it('returns negative percentage for operating loss', () => {
      expect(calculateOperatingMargin(-50, 500)).toBe(-10);
    });

    it('returns 0 when revenue is zero or negative', () => {
      expect(calculateOperatingMargin(10, 0)).toBe(0);
      expect(calculateOperatingMargin(10, -100)).toBe(0);
    });
  });

  describe('evaluateDebtHealth', () => {
    it('returns 100 for healthy debt ratio under 80%', () => {
      expect(evaluateDebtHealth(45)).toBe(100);
      expect(evaluateDebtHealth(80)).toBe(100);
    });

    it('penalizes moderately leveraged debt ratio', () => {
      const score = evaluateDebtHealth(120);
      expect(score).toBeLessThan(100);
      expect(score).toBeGreaterThan(50);
    });

    it('penalizes high debt and gives 0 for insolvency risk above 500%', () => {
      expect(evaluateDebtHealth(600)).toBe(0);
    });
  });

  describe('analyzeThreeYearFinancials', () => {
    it('handles empty records safely', () => {
      const result = analyzeThreeYearFinancials([]);
      expect(result.tenBaggerScore).toBe(0);
      expect(result.isTenBaggerCandidate).toBe(false);
      expect(result.verdictGrade).toBe('F');
    });

    it('identifies top-tier 10-bagger growth company (S Grade)', () => {
      const stellarCompany: YearlyFinancialMetric[] = [
        { year: 2021, revenue: 100, operatingProfit: 20, netProfit: 16, debtRatio: 50, roe: 22 },
        { year: 2022, revenue: 140, operatingProfit: 35, netProfit: 28, debtRatio: 45, roe: 25 },
        { year: 2023, revenue: 200, operatingProfit: 55, netProfit: 45, debtRatio: 40, roe: 28 },
      ];

      const analysis = analyzeThreeYearFinancials(stellarCompany);
      expect(analysis.cagrRevenue).toBeGreaterThan(30);
      expect(analysis.isTenBaggerCandidate).toBe(true);
      expect(analysis.verdictGrade).toBe('S');
      expect(analysis.tenBaggerScore).toBeGreaterThanOrEqual(90);
    });

    it('detects decaying zombie company with high debt and losses (F Grade)', () => {
      const zombieCompany: YearlyFinancialMetric[] = [
        { year: 2021, revenue: 200, operatingProfit: -10, netProfit: -20, debtRatio: 350, roe: -5 },
        { year: 2022, revenue: 160, operatingProfit: -30, netProfit: -45, debtRatio: 480, roe: -15 },
        { year: 2023, revenue: 110, operatingProfit: -60, netProfit: -80, debtRatio: 650, roe: -35 },
      ];

      const analysis = analyzeThreeYearFinancials(zombieCompany);
      expect(analysis.isTenBaggerCandidate).toBe(false);
      expect(analysis.verdictGrade).toBe('F');
      expect(analysis.analysisComment).toContain('한계기업');
    });

    it('sorts unchronological records by year before analysis', () => {
      const unsortedCompany: YearlyFinancialMetric[] = [
        { year: 2023, revenue: 150, operatingProfit: 30, netProfit: 24, debtRatio: 60, roe: 18 },
        { year: 2021, revenue: 100, operatingProfit: 20, netProfit: 15, debtRatio: 70, roe: 15 },
        { year: 2022, revenue: 120, operatingProfit: 24, netProfit: 19, debtRatio: 65, roe: 16 },
      ];

      const analysis = analyzeThreeYearFinancials(unsortedCompany);
      expect(analysis.cagrRevenue).toBeGreaterThan(0);
      expect(analysis.latestDebtRatio).toBe(60);
    });
  });

  describe('calculateFinanceCourseScore', () => {
    it('calculates perfect score and high title for 5/5 correct', () => {
      const res = calculateFinanceCourseScore(5, 5, 10);
      expect(res.finalScore).toBe(100);
      expect(res.expAwarded).toBe(50); // 5*8 + 10 = 50
      expect(res.passTier).toContain('워런 버핏');
    });

    it('calculates partial score and clamps negative inputs', () => {
      const res = calculateFinanceCourseScore(-1, 5);
      expect(res.finalScore).toBe(0);
      expect(res.expAwarded).toBe(0);
      expect(res.passTier).toContain('재무 문맹 탈출');
    });

    it('correctly assesses 3/5 passing grade', () => {
      const res = calculateFinanceCourseScore(3, 5);
      expect(res.finalScore).toBe(60);
      expect(res.expAwarded).toBe(24);
      expect(res.passTier).toContain('실전 재무 분석관');
    });
  });
});
