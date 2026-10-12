export interface RankStep {
  level: number;
  title: string;
  badge: string;
  requiredExp: number;
  description: string;
  perk: string;
}

export const RANK_TIERS: RankStep[] = [
  {
    level: 1,
    title: '훈련병',
    badge: '🐣 신규 입교',
    requiredExp: 0,
    description: '사관학교 기초 입교생 · 강등 면제 보호 구역',
    perk: '기본 3대 훈련 코스 자유 입장',
  },
  {
    level: 2,
    title: '이병',
    badge: '🌱 실전 돌입',
    requiredExp: 100,
    description: '실전 투입 신병 · 뇌동매매 자제 훈련 단계',
    perk: 'DART 공시 팩트체크 속도전 해금',
  },
  {
    level: 3,
    title: '하사',
    badge: '🛡️ 원금 수호대장',
    requiredExp: 250,
    description: '원금 방어선 구축 · 세력의 낚시 찌라시 1차 방어',
    perk: '1:1 친구 도발 맞짱장 발송 권한',
  },
  {
    level: 4,
    title: '소위',
    badge: '⚔️ 실전 임관 장교',
    requiredExp: 500,
    description: '정식 장교 임관 · 재무제표 옥석 가리기 마스터',
    perk: '정식 투자사관학교 수료 인증장 열람',
  },
  {
    level: 5,
    title: '대령',
    badge: '🎯 날카로운 분석관',
    requiredExp: 900,
    description: '연대장급 직관 · 개미털기 V자 반등 완벽 포착',
    perk: '토스증권 종목 토론방 전용 칭호 부여',
  },
  {
    level: 6,
    title: '1성 장군',
    badge: '⚡ 실전 야전 사령관',
    requiredExp: 1500,
    description: '여단 지휘관 · 3배 레버리지 파동 통제자',
    perk: '단톡방 계급 서열 최상위 배지 활성화',
  },
  {
    level: 7,
    title: '수석 참모총장',
    badge: '👑 상위 0.1% 극야수 사령관',
    requiredExp: 2500,
    description: '사관학교 최고 존엄 · 월가 스캘퍼 신의 경지',
    perk: '사관학교 명예의 전당 영구 등재',
  },
];

export interface TierProgressResult {
  percent: number;
  expInTier: number;
  expNeededForTier: number;
  isMaxLevel: boolean;
}

/**
 * Calculates current tier segment progress percentage (0 - 100)
 */
export function calculateTierProgress(
  currentExp: number,
  currentLevel: number,
  tiers: RankStep[] = RANK_TIERS
): TierProgressResult {
  const safeExp = Math.max(0, currentExp);
  const currentTier = tiers.find((t) => t.level === currentLevel);
  const nextTier = tiers.find((t) => t.level === currentLevel + 1);

  if (!nextTier) {
    return {
      percent: 100,
      expInTier: safeExp,
      expNeededForTier: 0,
      isMaxLevel: true,
    };
  }

  const baseExp = currentTier ? currentTier.requiredExp : 0;
  const targetExp = nextTier.requiredExp;
  const expNeededForTier = Math.max(1, targetExp - baseExp);
  const expInTier = Math.max(0, safeExp - baseExp);

  const rawPercent = (expInTier / expNeededForTier) * 100;
  const percent = Math.min(100, Math.max(0, Math.round(rawPercent)));

  return {
    percent,
    expInTier,
    expNeededForTier,
    isMaxLevel: false,
  };
}

export interface ExpRemainingInfo {
  expText: string;
  gamesEstimate: number;
  label: string;
}

export interface FeeDiscountInfo {
  discountPercent: number;
  discountBadge: string;
  monthlySavingsEstimate: string;
  perkDescription: string;
}

/**
 * Returns commission discount and trading fee perks by rank tier
 */
export function getRankFeeDiscount(level: number): FeeDiscountInfo {
  switch (level) {
    case 1:
      return {
        discountPercent: 0,
        discountBadge: '기본 수수료',
        monthlySavingsEstimate: '0원',
        perkDescription: '기본 거래 수수료 적용 (0.015%)',
      };
    case 2:
      return {
        discountPercent: 10,
        discountBadge: '10% 우대',
        monthlySavingsEstimate: '월 약 5,000원 절감',
        perkDescription: '국내 주식 위탁 수수료 10% 감면',
      };
    case 3:
      return {
        discountPercent: 20,
        discountBadge: '20% 우대',
        monthlySavingsEstimate: '월 약 15,000원 절감',
        perkDescription: '국내/해외 주식 수수료 20% 특별 할인',
      };
    case 4:
      return {
        discountPercent: 35,
        discountBadge: '35% 특별 감면',
        monthlySavingsEstimate: '월 약 35,000원 절감',
        perkDescription: '장교 임관 우대 수수료 35% 할인 + 환전 우대 80%',
      };
    case 5:
      return {
        discountPercent: 50,
        discountBadge: '50% 반값 우대',
        monthlySavingsEstimate: '월 약 70,000원 절감',
        perkDescription: '영관급 VIP 수수료 50% 반값 혜택 + 실시간 호가 무료',
      };
    case 6:
      return {
        discountPercent: 70,
        discountBadge: '70% 파격 감면',
        monthlySavingsEstimate: '월 약 150,000원 절감',
        perkDescription: '장군급 전술 혜택: 수수료 70% 할인 + 시간외 거래 무료',
      };
    case 7:
    default:
      return {
        discountPercent: 99,
        discountBadge: '수수료 평생 0원급',
        monthlySavingsEstimate: '월 약 300,000원+ 절감',
        perkDescription: '참모총장 특권: 유관기관 제비용 제외 전액 평생 면제',
      };
  }
}

/**
 * Formats remaining EXP and estimates required games to next promotion
 */
export function formatExpRemaining(
  expToNext: number,
  avgExpPerGame = 45
): ExpRemainingInfo {
  const safeExp = Math.max(0, expToNext);
  if (safeExp === 0) {
    return {
      expText: '0 EXP',
      gamesEstimate: 0,
      label: '최고 존엄 달성',
    };
  }

  const games = Math.ceil(safeExp / Math.max(1, avgExpPerGame));
  return {
    expText: `${safeExp.toLocaleString()} EXP`,
    gamesEstimate: games,
    label: `진급까지 ${safeExp.toLocaleString()} EXP (약 ${games}판 승리)`,
  };
}

export interface RankDivisionBadge {
  division: string;
  category: 'TRAINEE' | 'ENLISTED' | 'NCO' | 'OFFICER' | 'GENERAL';
  color: string;
  backgroundColor: string;
}

/**
 * Resolves military tactical division grouping and color palette
 */
export function getRankDivision(level: number): RankDivisionBadge {
  if (level >= 6) {
    return {
      division: '장성급 사령관',
      category: 'GENERAL',
      color: '#f04452',
      backgroundColor: '#feebee',
    };
  }
  if (level >= 4) {
    return {
      division: '위관/영관 장교',
      category: 'OFFICER',
      color: '#3182f6',
      backgroundColor: '#e8f3ff',
    };
  }
  if (level === 3) {
    return {
      division: '정예 부사관',
      category: 'NCO',
      color: '#04b067',
      backgroundColor: '#e6f8f0',
    };
  }
  if (level === 2) {
    return {
      division: '실전 야전병',
      category: 'ENLISTED',
      color: '#4e5968',
      backgroundColor: '#f2f4f6',
    };
  }
  return {
    division: '기초 입교생',
    category: 'TRAINEE',
    color: '#8b95a1',
    backgroundColor: '#f9fafb',
  };
}

/**
 * Formats number into KRW currency format (e.g. 10,000,000원)
 */
export function formatKRW(amount: number): string {
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString()}원`;
}
