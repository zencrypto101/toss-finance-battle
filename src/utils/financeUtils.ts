export interface YearlyFinancialMetric {
  year: number;
  revenue: number; // in 100M KRW or billions
  operatingProfit: number;
  netProfit: number;
  debtRatio: number; // in percent (e.g. 85.5)
  roe: number; // in percent (e.g. 18.2)
}

export type VerdictGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface ThreeYearAnalysisResult {
  cagrRevenue: number;
  averageOperatingMargin: number;
  latestDebtRatio: number;
  averageRoe: number;
  tenBaggerScore: number; // 0 - 100
  isTenBaggerCandidate: boolean;
  verdictGrade: VerdictGrade;
  analysisComment: string;
}

export interface FinanceCourseScoreResult {
  finalScore: number; // 0 - 100
  correctCount: number;
  totalQuestions: number;
  expAwarded: number;
  passTier: string;
}

/**
 * Calculates Compound Annual Growth Rate (CAGR) safely in percentage
 */
export function calculateCAGR(startVal: number, endVal: number, years: number): number {
  if (years <= 0 || startVal <= 0 || endVal <= 0) {
    return 0;
  }
  const ratio = endVal / startVal;
  const cagr = (Math.pow(ratio, 1 / years) - 1) * 100;
  return Number.isFinite(cagr) ? Math.round(cagr * 10) / 10 : 0;
}

/**
 * Calculates Operating Margin (영업이익률) in percentage
 */
export function calculateOperatingMargin(operatingProfit: number, revenue: number): number {
  if (revenue <= 0) return 0;
  const margin = (operatingProfit / revenue) * 100;
  return Number.isFinite(margin) ? Math.round(margin * 10) / 10 : 0;
}

/**
 * Evaluates debt stability health score (0 - 100)
 */
export function evaluateDebtHealth(debtRatio: number): number {
  if (debtRatio <= 0) return 100;
  if (debtRatio <= 80) return 100;
  if (debtRatio <= 150) return Math.max(0, Math.round(100 - (debtRatio - 80) * 0.5));
  if (debtRatio <= 300) return Math.max(0, Math.round(65 - (debtRatio - 150) * 0.3));
  if (debtRatio <= 500) return Math.max(0, Math.round(20 - (debtRatio - 300) * 0.1));
  return 0;
}

/**
 * Comprehensive 3-year financial health and 10-bagger potential analyzer
 */
export function analyzeThreeYearFinancials(records: YearlyFinancialMetric[]): ThreeYearAnalysisResult {
  if (!records || records.length === 0) {
    return {
      cagrRevenue: 0,
      averageOperatingMargin: 0,
      latestDebtRatio: 0,
      averageRoe: 0,
      tenBaggerScore: 0,
      isTenBaggerCandidate: false,
      verdictGrade: 'F',
      analysisComment: '재무제표 데이터가 존재하지 않습니다.',
    };
  }

  const sorted = [...records].sort((a, b) => a.year - b.year);
  const start = sorted[0];
  const end = sorted[sorted.length - 1];
  const years = Math.max(1, sorted.length - 1);

  const cagrRevenue = calculateCAGR(start.revenue, end.revenue, years);

  const opMargins = sorted.map((r) => calculateOperatingMargin(r.operatingProfit, r.revenue));
  const avgOpMargin = opMargins.reduce((sum, m) => sum + m, 0) / opMargins.length;
  const roundedAvgOpMargin = Math.round(avgOpMargin * 10) / 10;

  const avgRoe = sorted.reduce((sum, r) => sum + r.roe, 0) / sorted.length;
  const roundedAvgRoe = Math.round(avgRoe * 10) / 10;

  const latestDebt = end.debtRatio;
  const debtHealth = evaluateDebtHealth(latestDebt);

  // Ten-bagger Scoring Algorithm (100 pts scale)
  // Growth (35 pts): CAGR > 25% gets max 35
  const growthScore = Math.min(35, Math.max(0, Math.round((cagrRevenue / 25) * 35)));
  // Profitability (35 pts): Avg Op Margin > 20% & ROE > 15%
  const profitScore = Math.min(35, Math.max(0, Math.round((roundedAvgOpMargin / 20) * 20 + (roundedAvgRoe / 15) * 15)));
  // Stability (30 pts): Debt health
  const stabilityScore = Math.min(30, Math.max(0, Math.round((debtHealth / 100) * 30)));

  const totalScore = Math.min(100, Math.max(0, growthScore + profitScore + stabilityScore));
  const isCandidate = totalScore >= 75 && cagrRevenue >= 20 && latestDebt <= 150 && roundedAvgOpMargin >= 10;

  let verdictGrade: VerdictGrade = 'F';
  let analysisComment = '';

  if (totalScore >= 90) {
    verdictGrade = 'S';
    analysisComment = '압도적 성장성과 초격차 수익성, 초우량 재무를 갖춘 최상급 10배 텐배거 후보입니다.';
  } else if (totalScore >= 80) {
    verdictGrade = 'A';
    analysisComment = '매출 성장률과 영업이익률이 고르게 탁월하여 시장을 주도할 잠재력이 충분합니다.';
  } else if (totalScore >= 65) {
    verdictGrade = 'B';
    analysisComment = '안정적인 실적을 유지하고 있으나 폭발적인 성장 모멘텀 확인이 더 필요합니다.';
  } else if (totalScore >= 50) {
    verdictGrade = 'C';
    analysisComment = '평이한 수익성 혹은 부채비율 부담이 있어 보수적인 접근이 요구됩니다.';
  } else if (totalScore >= 35) {
    verdictGrade = 'D';
    analysisComment = '수익성 악화 또는 재무 건전성 훼손으로 밸류에이션 트랩 위험이 큽니다.';
  } else {
    verdictGrade = 'F';
    analysisComment = '만성 적자 또는 한계기업 징후가 뚜렷하여 상장폐지/감자 위험이 매우 높습니다.';
  }

  return {
    cagrRevenue,
    averageOperatingMargin: roundedAvgOpMargin,
    latestDebtRatio: latestDebt,
    averageRoe: roundedAvgRoe,
    tenBaggerScore: totalScore,
    isTenBaggerCandidate: isCandidate,
    verdictGrade,
    analysisComment,
  };
}

/**
 * Calculates final score and experience for Financial Statement course
 */
export function calculateFinanceCourseScore(
  correctCount: number,
  totalQuestions: number = 5,
  streakBonus: number = 0
): FinanceCourseScoreResult {
  const safeTotal = Math.max(1, totalQuestions);
  const safeCorrect = Math.max(0, Math.min(correctCount, safeTotal));
  const baseScore = Math.round((safeCorrect / safeTotal) * 100);

  // EXP: 8 EXP per correct question + streak bonus
  const expAwarded = safeCorrect * 8 + Math.max(0, streakBonus);

  let passTier = '재무 문맹 탈출';
  if (baseScore === 100) {
    passTier = '워런 버핏급 가치평가 마스터';
  } else if (baseScore >= 80) {
    passTier = '베테랑 재무제표 옥석 감별사';
  } else if (baseScore >= 60) {
    passTier = '실전 재무 분석관';
  }

  return {
    finalScore: baseScore,
    correctCount: safeCorrect,
    totalQuestions: safeTotal,
    expAwarded,
    passTier,
  };
}
