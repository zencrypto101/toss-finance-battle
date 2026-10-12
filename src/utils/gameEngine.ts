export interface CourseCompletionState {
  chart: boolean;
  dart: boolean;
  finance: boolean;
}

export interface PromotionCelebrationResult {
  shouldCelebrate: boolean;
  isAllCompleted: boolean;
  isCommanderRank: boolean;
  celebrationTitle: string;
  celebrationSubtitle: string;
  rankBadge: string;
  unlockedPrivileges: string[];
}

/**
 * Checks if all 3 courses are successfully completed
 */
export function isAllCoursesCompleted(state: CourseCompletionState): boolean {
  return state.chart === true && state.dart === true && state.finance === true;
}

/**
 * Calculates weighted comprehensive score across 3 courses
 * Chart (40%), DART (30%), Finance (30%)
 */
export function calculateComprehensiveScore(
  chartScore: number,
  dartScore: number,
  financeScore: number
): number {
  const weighted = chartScore * 0.4 + dartScore * 0.3 + financeScore * 0.3;
  return Math.min(100, Math.max(0, Math.round(weighted)));
}

/**
 * Evaluates whether to trigger the full promotion celebration modal
 */
export function evaluatePromotionCelebration(
  completion: CourseCompletionState,
  currentLevel: number,
  comprehensiveScore: number
): PromotionCelebrationResult {
  const allCompleted = isAllCoursesCompleted(completion);
  const isCommander = currentLevel >= 6;

  if (!allCompleted) {
    return {
      shouldCelebrate: false,
      isAllCompleted: false,
      isCommanderRank: isCommander,
      celebrationTitle: '',
      celebrationSubtitle: '',
      rankBadge: '',
      unlockedPrivileges: [],
    };
  }

  const privileges: string[] = [
    '대한민국 투자사관학교 공식 수료 인증장 발급',
    '토스증권 주식 거래 수수료 우대 혜택 적용',
    '단톡방 맞짱 배틀 챌린지 전용 칭호 부여',
  ];

  if (isCommander) {
    privileges.push('상위 0.1% 극야수 사령관 명예의 전당 등재');
  }

  let title = '🎉 전 과목 완수! 정예 임관 축하';
  let subtitle = `종합 평가 ${comprehensiveScore}점으로 투자사관학교 전 과정을 우수 수료했습니다.`;

  if (isCommander) {
    title = '👑 전설의 야수 사령관 최종 등극!';
    subtitle = `종합 평가 ${comprehensiveScore}점 초격차 실적으로 사령관 계급장에 도달했습니다!`;
  }

  return {
    shouldCelebrate: true,
    isAllCompleted: true,
    isCommanderRank: isCommander,
    celebrationTitle: title,
    celebrationSubtitle: subtitle,
    rankBadge: isCommander ? '⚡ 실전 야전 사령관' : '⚔️ 실전 임관 장교',
    unlockedPrivileges: privileges,
  };
}
