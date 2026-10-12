export interface BattleParticipant {
  id: string;
  name: string;
  rankTitle: string;
  badge: string;
  avatarIcon: string;
  finalReturnRate: number; // e.g. 32.5%
  returnsTrajectory: number[]; // 5 ticks trajectory: [0, 8.2, 14.5, 22.0, 32.5]
  isAi: boolean;
}

export type BattleWinner = 'USER' | 'OPPONENT' | 'DRAW';

export interface BattleOutcomeResult {
  winner: BattleWinner;
  diffRate: number; // absolute difference in percentage points
  expChange: number; // +50 on win, -15 on loss, +10 on draw
  outcomeTitle: string;
  outcomeComment: string;
  badgeColor: string;
}

export interface TrajectoryComparisonResult {
  leaderByTick: ('USER' | 'OPPONENT' | 'TIE')[];
  maxLead: number;
}

export const MOCK_OPPONENTS: BattleParticipant[] = [
  {
    id: 'wallstreet-quant',
    name: '월가 불개미 퀀트',
    rankTitle: '대령 (날카로운 분석관)',
    badge: '🎯 퀀트 사냥꾼',
    avatarIcon: '🤖',
    finalReturnRate: 28.5,
    returnsTrajectory: [0, 6.2, 12.8, 19.5, 28.5],
    isAi: true,
  },
  {
    id: 'yeouido-sniper',
    name: '여의도 단타 스나이퍼',
    rankTitle: '소위 (실전 임관 장교)',
    badge: '⚡ 스캘핑 귀재',
    avatarIcon: '🎯',
    finalReturnRate: -12.4,
    returnsTrajectory: [0, 15.0, 5.0, -4.2, -12.4],
    isAi: true,
  },
  {
    id: 'supreme-general',
    name: '전설의 3배 레버리지 총장',
    rankTitle: '수석 참모총장',
    badge: '👑 상위 0.1% 극야수',
    avatarIcon: '🦁',
    finalReturnRate: 48.0,
    returnsTrajectory: [0, 10.5, 24.0, 35.5, 48.0],
    isAi: false,
  },
];

/**
 * Generates an opponent for 1:1 match
 */
export function getOpponentById(id?: string): BattleParticipant {
  if (id) {
    const found = MOCK_OPPONENTS.find((o) => o.id === id);
    if (found) return found;
  }
  return MOCK_OPPONENTS[0];
}

/**
 * Calculates win/loss outcome and reward for PvP battle
 */
export function calculateBattleOutcome(
  userReturn: number,
  opponentReturn: number
): BattleOutcomeResult {
  const diff = Math.round(Math.abs(userReturn - opponentReturn) * 10) / 10;

  if (userReturn > opponentReturn) {
    return {
      winner: 'USER',
      diffRate: diff,
      expChange: 50,
      outcomeTitle: '🏆 1:1 맞짱 배틀 압도적 승리!',
      outcomeComment: `상대방(${opponentReturn >= 0 ? '+' : ''}${opponentReturn}%)을 +${diff}%p 차이로 완벽히 격파했습니다. 사관학교 명예 전당에 등극합니다!`,
      badgeColor: '#04b067',
    };
  }

  if (userReturn < opponentReturn) {
    return {
      winner: 'OPPONENT',
      diffRate: diff,
      expChange: -15,
      outcomeTitle: '💀 1:1 맞짱 배틀 쓰라린 패배...',
      outcomeComment: `상대방에게 -${diff}%p 격차로 밀렸습니다. 멘탈을 가다듬고 리벤지 매치로 설욕하세요!`,
      badgeColor: '#f04452',
    };
  }

  return {
    winner: 'DRAW',
    diffRate: 0,
    expChange: 10,
    outcomeTitle: '⚖️ 용호상박! 무승부 기록',
    outcomeComment: '양측 모두 완벽히 동일한 수익률을 기록하여 승부를 가리지 못했습니다.',
    badgeColor: '#8b95a1',
  };
}

/**
 * Compares return trajectory tick-by-tick
 */
export function compareTrajectories(
  userTrajectory: number[],
  opponentTrajectory: number[]
): TrajectoryComparisonResult {
  const len = Math.max(userTrajectory.length, opponentTrajectory.length);
  const leaders: ('USER' | 'OPPONENT' | 'TIE')[] = [];
  let maxLead = 0;

  for (let i = 0; i < len; i++) {
    const u = userTrajectory[i] ?? (userTrajectory[userTrajectory.length - 1] || 0);
    const o = opponentTrajectory[i] ?? (opponentTrajectory[opponentTrajectory.length - 1] || 0);

    const diff = Math.abs(u - o);
    if (diff > maxLead) {
      maxLead = diff;
    }

    if (u > o) {
      leaders.push('USER');
    } else if (u < o) {
      leaders.push('OPPONENT');
    } else {
      leaders.push('TIE');
    }
  }

  return {
    leaderByTick: leaders,
    maxLead: Math.round(maxLead * 10) / 10,
  };
}

/**
 * Simulates user trajectory matching their final return rate
 */
export function simulateUserTrajectory(finalReturn: number, ticks = 5): number[] {
  if (ticks <= 1) return [finalReturn];
  const result: number[] = [0];

  for (let i = 1; i < ticks - 1; i++) {
    const fraction = i / (ticks - 1);
    // Add small realistic fluctuation
    const noise = Math.sin(i * 1.5) * 3;
    const value = Math.round((finalReturn * fraction + noise) * 10) / 10;
    result.push(value);
  }

  result.push(finalReturn);
  return result;
}
