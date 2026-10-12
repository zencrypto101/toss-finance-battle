import React, { useState, useEffect, useRef } from 'react';
import { getRandomDartQuestions } from './data';
import { DartQuestion } from './types';
import { ChevronLeft, Clock } from 'lucide-react';
import {
  DART_TIMER_CONFIG,
  calculateProgressPercentage,
  isTimerWarning,
  formatSecondsLeft,
} from './utils/timerUtils';

interface CourseDartProps {
  onFinish: (score: number, correctCount: number) => void;
  onBack: () => void;
}

export const CourseDart: React.FC<CourseDartProps> = ({ onFinish, onBack }) => {
  const [questions] = useState<DartQuestion[]>(() => getRandomDartQuestions(5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(DART_TIMER_CONFIG.MAX_SECONDS);

  const currentQ: DartQuestion = questions[currentIndex] || questions[0];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(type === 'heavy' ? [30, 40] : 15);
      } catch (e) {}
    }
  };

  const clearCountdownTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 10s countdown timer per question
  useEffect(() => {
    setTimeLeft(DART_TIMER_CONFIG.MAX_SECONDS);
    clearCountdownTimer();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearCountdownTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearCountdownTimer();
    };
  }, [currentIndex]);

  // Handle timeout auto-fail
  useEffect(() => {
    if (timeLeft === 0 && selectedAnswer === null) {
      clearCountdownTimer();
      setSelectedAnswer(false);
      triggerHaptic('heavy');
      setFeedback('⏱️ 시간 초과! (10초 제한시간 경과) ' + currentQ.explanation);

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          setFeedback(null);
        } else {
          const finalScore = Math.round((correctCount / questions.length) * 100);
          onFinish(finalScore, correctCount);
        }
      }, 1200);
    }
  }, [timeLeft, selectedAnswer, currentIndex, questions.length, correctCount, currentQ.explanation, onFinish]);

  const handleAnswer = (choice: boolean) => {
    if (selectedAnswer !== null) return;
    clearCountdownTimer();
    setSelectedAnswer(choice);

    const isCorrect = choice === currentQ.isGoodNews;
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
        const finalScore = Math.round((nextCorrect / questions.length) * 100);
        onFinish(finalScore, nextCorrect);
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
            <span style={{ fontSize: 13, fontWeight: 800, color: '#f04452' }}>
              DART 공시 속보 판별
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
              backgroundColor: '#f04452',
              borderRadius: 2,
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              transition: 'width 0.25s',
            }}
          />
        </div>

        {/* 10s Timer Gauge & Countdown Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} color={isTimerWarning(timeLeft) ? '#f04452' : '#4e5968'} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#4e5968' }}>판별 제한시간</span>
          </div>
          <span
            data-testid="dart-timer-countdown"
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: isTimerWarning(timeLeft) ? '#f04452' : '#3182f6',
              transition: 'color 0.2s',
            }}
          >
            {formatSecondsLeft(timeLeft)}
          </span>
        </div>

        {/* Timer Bar Gauge */}
        <div style={{ height: 6, backgroundColor: '#f2f4f6', borderRadius: 3, marginBottom: 12, overflow: 'hidden' }}>
          <div
            data-testid="dart-timer-gauge"
            style={{
              height: '100%',
              backgroundColor: isTimerWarning(timeLeft) ? '#f04452' : '#3182f6',
              borderRadius: 3,
              width: `${calculateProgressPercentage(timeLeft)}%`,
              transition: 'width 0.25s linear, background-color 0.25s ease',
            }}
          />
        </div>
      </div>

      {/* DART Card (Compact Mobile Fit) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 18,
          border: '1.5px solid #191f28',
          padding: '16px 16px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          margin: '4px 0 16px 0',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: '#3182f6',
              backgroundColor: '#e8f3ff',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            전자공시시스템 DART
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#8b95a1' }}>
            {currentQ.company}
          </span>
        </div>

        <h2
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#191f28',
            lineHeight: 1.4,
            letterSpacing: -0.3,
          }}
        >
          {currentQ.title}
        </h2>

        {feedback && (
          <div
            className="fade-in"
            style={{
              marginTop: 10,
              backgroundColor: feedback.startsWith('정답') ? '#e6f8f0' : '#feebee',
              color: feedback.startsWith('정답') ? '#04b067' : '#f04452',
              padding: '8px 10px',
              borderRadius: 10,
              fontSize: 12,
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
          onClick={() => handleAnswer(false)}
          disabled={selectedAnswer !== null}
          style={{
            height: 52,
            backgroundColor: '#ffffff',
            border: '2px solid #3182f6',
            color: '#3182f6',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 800,
            cursor: selectedAnswer !== null ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          🚨 악재 / 폭락
        </button>

        <button
          type="button"
          onClick={() => handleAnswer(true)}
          disabled={selectedAnswer !== null}
          style={{
            height: 52,
            backgroundColor: '#f04452',
            border: 'none',
            color: '#ffffff',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 800,
            cursor: selectedAnswer !== null ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            boxShadow: '0 4px 12px rgba(240,68,82,0.25)',
          }}
        >
          🔥 떡상 호재!
        </button>
      </div>
    </div>
  );
};
