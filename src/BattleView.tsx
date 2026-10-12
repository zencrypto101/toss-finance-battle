import React, { useState, useEffect } from 'react';
import {
  BattleParticipant,
  BattleOutcomeResult,
  MOCK_OPPONENTS,
  getOpponentById,
  calculateBattleOutcome,
  simulateUserTrajectory,
  compareTrajectories,
} from './utils/battleUtils';
import { Swords, ChevronLeft, Trophy, RotateCcw, TrendingUp, TrendingDown, Award, Zap } from 'lucide-react';

interface BattleViewProps {
  userReturn: number;
  userRankTitle: string;
  onBack: () => void;
  onExpChange: (amount: number) => void;
}

export const BattleView: React.FC<BattleViewProps> = ({
  userReturn = 35.0,
  userRankTitle = '정예 사관생도',
  onBack,
  onExpChange,
}) => {
  const [selectedOpponentId, setSelectedOpponentId] = useState<string>(MOCK_OPPONENTS[0].id);
  const [currentTick, setCurrentTick] = useState<number>(5);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<BattleOutcomeResult | null>(null);

  const opponent: BattleParticipant = getOpponentById(selectedOpponentId);
  const userTrajectory: number[] = simulateUserTrajectory(userReturn, 5);
  const comparison = compareTrajectories(userTrajectory, opponent.returnsTrajectory);

  const currentUserTickReturn = userTrajectory[Math.min(currentTick - 1, userTrajectory.length - 1)] || 0;
  const currentOpponentTickReturn = opponent.returnsTrajectory[Math.min(currentTick - 1, opponent.returnsTrajectory.length - 1)] || 0;

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(type === 'heavy' ? [30, 40] : 15);
      } catch (e) {}
    }
  };

  const handleStartSimulation = () => {
    triggerHaptic('medium');
    setIsSimulating(true);
    setCurrentTick(1);
    setOutcome(null);

    let step = 1;
    const interval = setInterval(() => {
      step += 1;
      if (step <= 5) {
        setCurrentTick(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        const finalRes = calculateBattleOutcome(userReturn, opponent.finalReturnRate);
        setOutcome(finalRes);
        onExpChange(finalRes.expChange);
        triggerHaptic(finalRes.winner === 'USER' ? 'medium' : 'heavy');
      }
    }, 450);
  };

  return (
    <div className="fade-in" style={{ paddingTop: 8, paddingBottom: 20 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button className="icon-btn" onClick={onBack} style={{ marginLeft: -8 }} aria-label="뒤로가기">
          <ChevronLeft size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Swords size={18} color="#f04452" />
          <span style={{ fontSize: 16, fontWeight: 900, color: '#191f28' }}>
            1:1 실시간 맞짱 배틀
          </span>
        </div>
        <div style={{ width: 24 }} />
      </div>

      {/* Opponent Selector Chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {MOCK_OPPONENTS.map((opp) => (
          <button
            key={opp.id}
            type="button"
            data-testid={`select-opponent-${opp.id}`}
            onClick={() => {
              setSelectedOpponentId(opp.id);
              setOutcome(null);
              setCurrentTick(5);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 800,
              border: selectedOpponentId === opp.id ? '2px solid #191f28' : '1px solid #e5e8eb',
              backgroundColor: selectedOpponentId === opp.id ? '#191f28' : '#ffffff',
              color: selectedOpponentId === opp.id ? '#ffffff' : '#4e5968',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{opp.avatarIcon}</span>
            <span>{opp.name}</span>
          </button>
        ))}
      </div>

      {/* Matchup Hero Arena Card */}
      <div
        data-testid="battle-arena-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 22,
          border: '1.5px solid #191f28',
          padding: '18px 16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* User Side */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 26, marginBottom: 4 }}>🦁</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#191f28' }}>나 (생도)</div>
            <div style={{ fontSize: 10, color: '#8b95a1', fontWeight: 600 }}>{userRankTitle}</div>
            <div
              data-testid="user-live-return"
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: currentUserTickReturn >= 0 ? '#f04452' : '#3182f6',
                marginTop: 6,
              }}
            >
              {currentUserTickReturn >= 0 ? '+' : ''}{currentUserTickReturn}%
            </div>
          </div>

          {/* VS Center Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 10px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#191f28',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              }}
            >
              VS
            </div>
            <span style={{ fontSize: 10, color: '#8b95a1', marginTop: 4, fontWeight: 700 }}>
              {currentTick}/5 틱
            </span>
          </div>

          {/* Opponent Side */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 26, marginBottom: 4 }}>{opponent.avatarIcon}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#191f28' }}>{opponent.name}</div>
            <div style={{ fontSize: 10, color: '#8b95a1', fontWeight: 600 }}>{opponent.rankTitle}</div>
            <div
              data-testid="opponent-live-return"
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: currentOpponentTickReturn >= 0 ? '#f04452' : '#3182f6',
                marginTop: 6,
              }}
            >
              {currentOpponentTickReturn >= 0 ? '+' : ''}{currentOpponentTickReturn}%
            </div>
          </div>
        </div>

        {/* Real-time Trajectory Progress Bars */}
        <div style={{ marginTop: 18, borderTop: '1px solid #f2f4f6', paddingTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#4e5968', marginBottom: 6 }}>
            <span>수익률 궤적 대결</span>
            <span>최대 격차: {comparison.maxLead}%p</span>
          </div>

          {/* User Bar */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8b95a1', marginBottom: 2 }}>
              <span>내 궤적</span>
              <span style={{ fontWeight: 700, color: '#f04452' }}>{currentUserTickReturn}%</span>
            </div>
            <div style={{ height: 8, backgroundColor: '#f2f4f6', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#f04452',
                  borderRadius: 4,
                  width: `${Math.min(100, Math.max(10, Math.abs(currentUserTickReturn) * 1.5))}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Opponent Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8b95a1', marginBottom: 2 }}>
              <span>상대 궤적</span>
              <span style={{ fontWeight: 700, color: '#3182f6' }}>{currentOpponentTickReturn}%</span>
            </div>
            <div style={{ height: 8, backgroundColor: '#f2f4f6', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#3182f6',
                  borderRadius: 4,
                  width: `${Math.min(100, Math.max(10, Math.abs(currentOpponentTickReturn) * 1.5))}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA Button */}
      <button
        type="button"
        data-testid="simulate-battle-btn"
        disabled={isSimulating}
        onClick={handleStartSimulation}
        className="btn-stock-red"
        style={{
          padding: '14px 0',
          fontSize: 15,
          fontWeight: 900,
          marginBottom: 10,
        }}
      >
        <Zap size={18} style={{ marginRight: 6 }} />
        {isSimulating ? '실시간 틱 수익률 대결 중...' : '맞짱 배틀 시뮬레이션 가동!'}
      </button>

      <button type="button" className="btn-ghost" onClick={onBack}>
        사관학교 메인 로비로 복귀
      </button>

      {/* Battle Outcome Modal */}
      {outcome && (
        <div
          data-testid="battle-outcome-modal"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            zIndex: 10002,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 22,
              padding: '26px 20px',
              maxWidth: 340,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
              border: `2px solid ${outcome.badgeColor}`,
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 8 }}>
              {outcome.winner === 'USER' ? '🏆' : outcome.winner === 'OPPONENT' ? '💀' : '⚖️'}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#191f28', marginBottom: 4 }}>
              {outcome.outcomeTitle}
            </h3>
            <div style={{ fontSize: 13, fontWeight: 700, color: outcome.badgeColor, marginBottom: 12 }}>
              격차: {outcome.diffRate}%p · {outcome.expChange >= 0 ? `+${outcome.expChange}` : outcome.expChange} EXP
            </div>
            <p style={{ fontSize: 12, color: '#4e5968', lineHeight: 1.45, marginBottom: 20 }}>
              {outcome.outcomeComment}
            </p>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                data-testid="battle-rematch-btn"
                onClick={() => setOutcome(null)}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: 12,
                  border: '1px solid #e5e8eb',
                  backgroundColor: '#f2f4f6',
                  color: '#4e5968',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                다시 대결
              </button>
              <button
                type="button"
                data-testid="battle-lobby-btn"
                onClick={() => {
                  setOutcome(null);
                  onBack();
                }}
                className="btn-stock-red"
                style={{ flex: 1, padding: '12px 0', fontSize: 13 }}
              >
                로비 복귀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
