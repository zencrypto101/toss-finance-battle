import React, { useState } from 'react';
import { getRandomFinancialQuestions } from './data';
import { FinancialQuestion } from './types';
import { ChevronLeft, Gem, AlertOctagon } from 'lucide-react';
import { calculateFinanceCourseScore } from './utils/financeUtils';

interface CourseFinancialsProps {
  onFinish: (score: number, correctCount: number) => void;
  onBack: () => void;
}

export const CourseFinancials: React.FC<CourseFinancialsProps> = ({ onFinish, onBack }) => {
  const [questions] = useState<FinancialQuestion[]>(() => getRandomFinancialQuestions(5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentQ: FinancialQuestion = questions[currentIndex] || questions[0];

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(type === 'heavy' ? [30, 40] : 15);
      } catch (e) {}
    }
  };

  const handleAnswer = (choice: boolean) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(choice);

    const isCorrect = choice === currentQ.isGem;
    const nextCorrect = isCorrect ? correctCount + 1 : correctCount;

    if (isCorrect) {
      triggerHaptic('medium');
      setCorrectCount(nextCorrect);
      setFeedback('정답! ' + currentQ.explanation);
    } else {
      triggerHaptic('heavy');
      setFeedback('오답! ' + currentQ.explanation);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        const scoreResult = calculateFinanceCourseScore(nextCorrect, questions.length);
        onFinish(scoreResult.finalScore, nextCorrect);
      }
    }, 1100);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '480px', maxHeight: '580px', justifyContent: 'space-between' }}>
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <button className="icon-btn" onClick={onBack} style={{ marginLeft: -8 }} aria-label="뒤로가기">
            <ChevronLeft size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#04b067' }}>
              재무제표 옥석 가리기
            </span>
            <span style={{ fontSize: 12, color: '#8b95a1' }}>
              ({currentIndex + 1}/{questions.length})
            </span>
          </div>
          <div style={{ width: 24 }} />
        </div>

        {/* Progress Bar */}
        <div style={{ height: 3, backgroundColor: '#e5e8eb', borderRadius: 2, marginBottom: 10 }}>
          <div
            style={{
              height: '100%',
              backgroundColor: '#04b067',
              borderRadius: 2,
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              transition: 'width 0.25s',
            }}
          />
        </div>
      </div>

      {/* Financial Statement Card (Compact No-Scroll) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 18,
          border: '1.5px solid #191f28',
          padding: '14px 14px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          margin: '2px 0 14px 0',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: '#191f28' }}>
            {currentQ.companyName}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#8b95a1' }}>
            핵심 재무 스펙
          </span>
        </div>

        {/* Metrics Grid */}
        <div
          style={{
            backgroundColor: '#f9fafb',
            borderRadius: 12,
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            border: '1px solid #e5e8eb',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: '#8b95a1', fontWeight: 600 }}>PER / PBR</span>
            <span style={{ color: '#191f28', fontWeight: 800 }}>{currentQ.metrics.per} / {currentQ.metrics.pbr}</span>
          </div>
          <div style={{ height: 1, backgroundColor: '#e5e8eb' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: '#8b95a1', fontWeight: 600 }}>부채비율</span>
            <span style={{ color: '#191f28', fontWeight: 800 }}>{currentQ.metrics.debtRatio}</span>
          </div>
          <div style={{ height: 1, backgroundColor: '#e5e8eb' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: '#8b95a1', fontWeight: 600 }}>영업이익 추이</span>
            <span style={{ color: '#191f28', fontWeight: 800 }}>{currentQ.metrics.operatingProfitGrowth}</span>
          </div>
          {currentQ.metrics.dividendYield && (
            <>
              <div style={{ height: 1, backgroundColor: '#e5e8eb' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#8b95a1', fontWeight: 600 }}>배당 수익률</span>
                <span style={{ color: '#04b067', fontWeight: 800 }}>{currentQ.metrics.dividendYield}</span>
              </div>
            </>
          )}
        </div>

        {feedback && (
          <div
            className="fade-in"
            style={{
              marginTop: 8,
              backgroundColor: feedback.startsWith('정답') ? '#e6f8f0' : '#feebee',
              color: feedback.startsWith('정답') ? '#04b067' : '#f04452',
              padding: '6px 8px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            {feedback}
          </div>
        )}
      </div>

      {/* Compact Dual Buttons (52px height) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button
          type="button"
          data-testid="finance-trap-btn"
          onClick={() => handleAnswer(false)}
          disabled={selectedAnswer !== null}
          style={{
            height: 52,
            backgroundColor: '#ffffff',
            border: '2px solid #8b95a1',
            color: '#191f28',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 800,
            cursor: selectedAnswer !== null ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <AlertOctagon size={15} color="#f04452" /> 상폐/거품 위험
        </button>

        <button
          type="button"
          data-testid="finance-gem-btn"
          onClick={() => handleAnswer(true)}
          disabled={selectedAnswer !== null}
          style={{
            height: 52,
            backgroundColor: '#04b067',
            border: 'none',
            color: '#ffffff',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 800,
            cursor: selectedAnswer !== null ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            boxShadow: '0 4px 12px rgba(4,176,103,0.25)',
          }}
        >
          <Gem size={15} /> 저평가 알짜 진주!
        </button>
      </div>
    </div>
  );
};
