import React, { useState } from 'react';
import { UserProgress } from './types';
import {
  ChevronLeft,
  Award,
  Lock,
  CheckCircle2,
  Share2,
  Sparkles,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Percent,
  X,
  HelpCircle,
} from 'lucide-react';
import {
  RANK_TIERS,
  calculateTierProgress,
  formatExpRemaining,
  getRankDivision,
  getRankFeeDiscount,
} from './utils/rankUtils';

interface RankRoadmapProps {
  progress: UserProgress;
  onBack: () => void;
  onShare: () => void;
}

export const RankRoadmap: React.FC<RankRoadmapProps> = ({ progress, onBack, onShare }) => {
  const [activeTooltipLevel, setActiveTooltipLevel] = useState<number | null>(null);

  const currentLevel = progress.level;
  const currentExp = progress.currentExp;

  const nextTier = RANK_TIERS.find((t) => t.level === currentLevel + 1);
  const expToNext = nextTier ? Math.max(0, nextTier.requiredExp - currentExp) : 0;
  const progressInfo = calculateTierProgress(currentExp, currentLevel);
  const remainingInfo = formatExpRemaining(expToNext);
  const division = getRankDivision(currentLevel);
  const currentFeeDiscount = getRankFeeDiscount(currentLevel);

  return (
    <div className="fade-in" style={{ paddingTop: 10 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <button className="icon-btn" onClick={onBack} style={{ marginLeft: -8 }} aria-label="뒤로가기">
          <ChevronLeft size={24} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 900, color: '#191f28' }}>
          사관학교 계급 성장표
        </span>
        <div style={{ width: 32 }} />
      </div>

      {/* Hero Current Rank Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #191f28 0%, #2b3441 100%)',
          borderRadius: 20,
          padding: 18,
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(25,31,40,0.25)',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#f04452', letterSpacing: 0.5 }}>
                CURRENT RANK STATUS
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  backgroundColor: division.backgroundColor,
                  color: division.color,
                  padding: '2px 7px',
                  borderRadius: 9999,
                }}
              >
                {division.division}
              </span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 900, marginTop: 4, letterSpacing: -0.5 }}>
              Lv.{progress.level} {progress.rankTitle}
            </h1>
            <div style={{ fontSize: 12, color: '#b0b8c1', marginTop: 2 }}>
              {progress.rankBadge}
            </div>

            {/* Current Fee Discount Perk Tag */}
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                data-testid="hero-fee-perk-btn"
                onClick={() => setActiveTooltipLevel(activeTooltipLevel === currentLevel ? null : currentLevel)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: 8,
                  padding: '4px 8px',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Percent size={12} color="#3888ff" />
                <span>수수료 우대: <b>{currentFeeDiscount.discountBadge}</b></span>
                <HelpCircle size={11} color="#b0b8c1" />
              </button>
            </div>
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={22} color="#f04452" />
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
            <span style={{ color: '#b0b8c1' }}>
              보유 경험치: {currentExp.toLocaleString()} EXP
              {!progressInfo.isMaxLevel && (
                <span style={{ color: '#ffffff', fontWeight: 800, marginLeft: 4 }}>
                  ({progressInfo.percent}%)
                </span>
              )}
            </span>
            <span style={{ color: nextTier ? '#f04452' : '#04b067' }}>
              {remainingInfo.label}
            </span>
          </div>
          <div style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                backgroundColor: '#f04452',
                borderRadius: 4,
                width: `${progressInfo.percent}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Fair Promotion & Demotion Rules Banner */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          border: '1.5px solid #e5e8eb',
          padding: '14px 16px',
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: '#191f28', marginBottom: 8 }}>
          <AlertTriangle size={15} color="#ff8f00" />
          <span>공정한 사관학교 승급 & 강등 랭크 룰</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
          <div style={{ backgroundColor: '#e6f8f0', padding: '8px 10px', borderRadius: 8, color: '#04b067', fontWeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={14} /> 승급 보너스 (EXP UP)
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#191f28', marginTop: 4 }}>
              • 차트 수익률 +15% 이상: +45~65 EXP<br />
              • 퀴즈 4~5문항 정답: +25~45 EXP
            </div>
          </div>
          <div style={{ backgroundColor: '#feebee', padding: '8px 10px', borderRadius: 8, color: '#f04452', fontWeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingDown size={14} /> 강등 페널티 (EXP DOWN)
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#191f28', marginTop: 4 }}>
              • 차트 원금 -15% 손실: -15~35 EXP<br />
              • 퀴즈 2문항 이하: -20~35 EXP
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#8b95a1', marginTop: 8, textAlign: 'center' }}>
          ※ 경험치가 기준치 미만으로 떨어지면 하위 계급으로 강등됩니다 (Lv.1은 강등 면제).
        </div>
      </div>

      {/* 7-Tier Vertical Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#8b95a1' }}>
          7단계 진급 로드맵
        </div>

        {RANK_TIERS.map((tier) => {
          const isPassed = currentLevel > tier.level;
          const isCurrent = currentLevel === tier.level;
          const isLocked = currentLevel < tier.level;
          const tierDivision = getRankDivision(tier.level);

          return (
            <div
              key={tier.level}
              style={{
                backgroundColor: isCurrent ? '#ffffff' : isPassed ? '#f9fafb' : '#ffffff',
                border: isCurrent
                  ? '2px solid #f04452'
                  : isPassed
                  ? '1px solid #e5e8eb'
                  : '1px dashed #d1d6db',
                borderRadius: 14,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                opacity: isLocked ? 0.6 : 1,
                boxShadow: isCurrent ? '0 4px 16px rgba(240,68,82,0.1)' : 'none',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: isCurrent
                    ? '#feebee'
                    : isPassed
                    ? '#e6f8f0'
                    : '#f2f4f6',
                  color: isCurrent
                    ? '#f04452'
                    : isPassed
                    ? '#04b067'
                    : '#8b95a1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {isPassed ? <CheckCircle2 size={16} /> : isLocked ? <Lock size={14} /> : `L${tier.level}`}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#191f28' }}>
                      {tier.title}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        backgroundColor: isCurrent ? '#f04452' : '#f2f4f6',
                        color: isCurrent ? '#fff' : '#8b95a1',
                        padding: '1px 6px',
                        borderRadius: 4,
                      }}
                    >
                      {tier.badge}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        backgroundColor: tierDivision.backgroundColor,
                        color: tierDivision.color,
                        padding: '1px 5px',
                        borderRadius: 4,
                      }}
                    >
                      {tierDivision.division}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#8b95a1' }}>
                    {tier.requiredExp === 0 ? '기본' : `${tier.requiredExp} EXP`}
                  </span>
                </div>

                <div style={{ fontSize: 11, color: '#4e5968', marginTop: 3 }}>
                  {tier.description}
                </div>

                {/* Tier Fee Discount Perk Button */}
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    type="button"
                    data-testid={`fee-perk-btn-${tier.level}`}
                    onClick={() => setActiveTooltipLevel(activeTooltipLevel === tier.level ? null : tier.level)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: isCurrent ? '#feebee' : '#f2f4f6',
                      border: '1px solid ' + (isCurrent ? '#fcd3d7' : '#e5e8eb'),
                      borderRadius: 6,
                      padding: '2px 7px',
                      color: isCurrent ? '#f04452' : '#4e5968',
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Percent size={10} color={isCurrent ? '#f04452' : '#3182f6'} />
                    <span>{getRankFeeDiscount(tier.level).discountBadge}</span>
                  </button>
                </div>

                {/* Fee Discount Tooltip Component */}
                {activeTooltipLevel === tier.level && (
                  <div
                    data-testid={`fee-discount-tooltip-${tier.level}`}
                    style={{
                      marginTop: 8,
                      backgroundColor: '#191f28',
                      color: '#ffffff',
                      borderRadius: 10,
                      padding: '10px 12px',
                      fontSize: 11,
                      lineHeight: 1.45,
                      boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, color: '#3888ff' }}>
                        ⚡ {tier.title} 거래 혜택: {getRankFeeDiscount(tier.level).discountBadge}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTooltipLevel(null)}
                        style={{ background: 'none', border: 'none', color: '#b0b8c1', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <div style={{ color: '#e5e8eb' }}>
                      {getRankFeeDiscount(tier.level).perkDescription}
                    </div>
                    <div style={{ color: '#04b067', fontWeight: 700, marginTop: 4 }}>
                      💡 절감 추정치: {getRankFeeDiscount(tier.level).monthlySavingsEstimate}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 16 }}>
        <button type="button" className="btn-stock-red" onClick={onShare}>
          <Share2 size={18} style={{ marginRight: 8 }} />
          내 계급장 단톡방에 자랑하고 맞짱뜨기
        </button>

        <button type="button" className="btn-ghost" onClick={onBack}>
          사관학교 로비로 돌아가기
        </button>
      </div>
    </div>
  );
};
