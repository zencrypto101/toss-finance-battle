import React, { useState, useEffect, useRef } from 'react';
import {
  SCENARIOS,
  getRandomScenario,
  calculateUserProgress,
  evaluateChartGame,
  evaluateCertificate,
} from './data';
import {
  ChartScenario,
  TradeAction,
  ChartGameResult,
  BattleMirrorData,
  NewsEvent,
  AcademyCertificate,
  UserProgress,
} from './types';
import { ChartCanvas } from './ChartCanvas';
import { CourseDart } from './CourseDart';
import { CourseFinancials } from './CourseFinancials';
import { Certificate } from './Certificate';
import { RankRoadmap } from './RankRoadmap';
import {
  generateChartResultShareUrl,
  generateChartResultShareText,
  copyToClipboard,
  TOAST_MESSAGES,
} from './utils/shareUtils';
import {
  getStoredExp,
  saveStoredExp,
  resetStoredExp,
  TOAST_STORAGE_MESSAGES,
} from './utils/storageUtils';
import {
  X,
  Share2,
  Swords,
  Flame,
  Zap,
  RotateCcw,
  Sparkles,
  Copy,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Play,
  ArrowRight,
  Radio,
  Award,
  BookOpen,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  Dices,
  Trophy,
} from 'lucide-react';
import {
  isAllCoursesCompleted,
  calculateComprehensiveScore,
  evaluatePromotionCelebration,
} from './utils/gameEngine';

const INITIAL_CASH = 10_000_000;

export default function App() {
  const [view, setView] = useState<'LOBBY' | 'ROADMAP' | 'COURSE_CHART' | 'CHART_RESULT' | 'COURSE_DART' | 'COURSE_FINANCE' | 'CERTIFICATE' | 'BATTLE_VIEW'>('LOBBY');

  // Persistent User EXP & Level System
  const [totalExp, setTotalExp] = useState<number>(() => getStoredExp());

  const userProgress: UserProgress = calculateUserProgress(totalExp);

  // Reset Confirmation Modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);

  // Subject Scores
  const [chartScore, setChartScore] = useState<number>(50);
  const [dartScore, setDartScore] = useState<number>(50);
  const [financeScore, setFinanceScore] = useState<number>(50);

  // Completion statuses
  const [completedCourses, setCompletedCourses] = useState<{ chart: boolean; dart: boolean; finance: boolean }>({
    chart: false,
    dart: false,
    finance: false,
  });

  // Chart Game states & Refs to prevent Stale Closure bug
  const [selectedScenario, setSelectedScenario] = useState<ChartScenario>(() => getRandomScenario());
  const [currentTick, setCurrentTick] = useState(1);
  const currentTickRef = useRef(1);

  const [cash, setCash] = useState(INITIAL_CASH);
  const cashRef = useRef(INITIAL_CASH);

  const [shares, setShares] = useState(0);
  const sharesRef = useRef(0);

  const [userTrades, setUserTrades] = useState<TradeAction[]>([]);
  const userTradesRef = useRef<TradeAction[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Briefing 3, 2, 1 Countdown Overlay state
  const [isBriefing, setIsBriefing] = useState(false);
  const [briefingCount, setBriefingCount] = useState(3);
  const briefingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live News
  const [activeNews, setActiveNews] = useState<NewsEvent | null>(null);
  const [newsCountdown, setNewsCountdown] = useState<number>(3);
  const [newsOutcomeNotice, setNewsOutcomeNotice] = useState<string | null>(null);
  const [flashEffect, setFlashEffect] = useState<'BUY' | 'SELL' | null>(null);
  const [lastChartResult, setLastChartResult] = useState<ChartGameResult | null>(null);

  // Battle Host Info
  const [battleHost, setBattleHost] = useState<BattleMirrorData | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save EXP to localStorage with Fair Promotion & Demotion alerts
  const addExp = (amount: number) => {
    setTotalExp((prev) => {
      const next = Math.max(0, prev + amount);
      saveStoredExp(next);

      const prevProg = calculateUserProgress(prev);
      const nextProg = calculateUserProgress(next);

      if (nextProg.level > prevProg.level) {
        showToast(`🎉 축 진급! [${nextProg.rankTitle}] 계급으로 승급했습니다!`);
      } else if (nextProg.level < prevProg.level) {
        showToast(`🚨 강등 경보! 누적 손실로 [${nextProg.rankTitle}] 계급으로 강등되었습니다.`);
      } else if (amount < 0) {
        showToast(`⚠️ 손실 페널티: EXP ${amount} 차감되었습니다.`);
      }
      return next;
    });
  };

  const handleResetData = () => {
    triggerHaptic('medium');
    resetStoredExp();
    setTotalExp(0);
    setChartScore(50);
    setDartScore(50);
    setFinanceScore(50);
    setCompletedCourses({ chart: false, dart: false, finance: false });
    setIsResetModalOpen(false);
    showToast(TOAST_STORAGE_MESSAGES.RESET_SUCCESS);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__SET_VIEW__ = (v) => {
        if (v === 'CHART_RESULT' && !lastChartResult) {
          setLastChartResult({
            scenarioId: 'gme-2021',
            scenarioName: '게임스탑 (GME)',
            period: '2021 월가 공매도 징벌전',
            initialCash: INITIAL_CASH,
            finalAsset: 14_500_000,
            totalReturnRate: 45.0,
            tradeCount: 2,
            trades: [],
            tierTitle: '전설의 야수 사령관',
            verdictComment: '완벽한 타이밍에 매수하여 세력을 격파했습니다.',
            autopsies: [
              {
                second: 2,
                eventHeadline: '🚨 [레딧 속보] 개미 군단 총공격! 멜빈 캐피탈 마진콜 숏 청산 시작',
                marketOutcome: '+200% 수직 양봉 빔 폭등',
                userAction: '전탄 매수',
                verdictType: 'GENIUS',
                verdictLabel: '신의 한 수',
                comment: '공매도 세력의 청산 타이밍을 완벽하게 읽고 탑승했습니다.',
              },
            ],
            score: 95,
            earnedExp: 55,
          });
        }
        setView(v);
      };
      window.__OPEN_RESET_MODAL__ = () => setIsResetModalOpen(true);
    }

    const params = new URLSearchParams(window.location.search);
    const host = params.get('host');
    const hostScore = params.get('score');
    const hostRank = params.get('rank');
    const viewParam = params.get('view');
    const modalParam = params.get('modal');

    if (modalParam === 'reset') {
      setIsResetModalOpen(true);
    } else if (modalParam === 'celebration') {
      setIsCelebrationModalOpen(true);
    }

    if (viewParam === 'COURSE_DART') {
      setView('COURSE_DART');
    } else if (viewParam === 'ROADMAP') {
      setView('ROADMAP');
    } else if (viewParam === 'COURSE_FINANCE') {
      setView('COURSE_FINANCE');
    } else if (viewParam === 'CERTIFICATE') {
      setView('CERTIFICATE');
    }

    if (viewParam === 'CHART_RESULT') {
      const mockResult: ChartGameResult = {
        scenarioId: 'gme-2021',
        scenarioName: '게임스탑 (GME)',
        period: '2021 월가 공매도 징벌전',
        initialCash: INITIAL_CASH,
        finalAsset: 14_500_000,
        totalReturnRate: 45.0,
        tradeCount: 2,
        trades: [],
        tierTitle: '전설의 야수 사령관',
        verdictComment: '완벽한 타이밍에 매수하여 세력을 격파했습니다.',
        autopsies: [
          {
            second: 2,
            eventHeadline: '🚨 [레딧 속보] 개미 군단 총공격! 멜빈 캐피탈 마진콜 숏 청산 시작',
            marketOutcome: '+200% 수직 양봉 빔 폭등',
            userAction: '전탄 매수',
            verdictType: 'GENIUS',
            verdictLabel: '신의 한 수',
            comment: '공매도 세력의 청산 타이밍을 완벽하게 읽고 탑승했습니다.',
          },
        ],
        score: 95,
        earnedExp: 55,
      };
      setLastChartResult(mockResult);
      setView('CHART_RESULT');
      return;
    }

    if (host && hostScore) {
      setBattleHost({
        hostName: decodeURIComponent(host),
        hostRank: hostRank ? decodeURIComponent(hostRank) : '사관학교 생도',
        hostScore: parseInt(hostScore, 10) || 78,
      });
      setView('BATTLE_VIEW');
    }
  }, []);

  const handleCopyChartResult = async () => {
    if (!lastChartResult) return;
    triggerHaptic('light');

    const shareUrl = generateChartResultShareUrl(
      lastChartResult,
      window.location.origin + window.location.pathname
    );
    const shareText = generateChartResultShareText(lastChartResult, shareUrl);

    const success = await copyToClipboard(`${shareText}\n${shareUrl}`);
    if (success) {
      showToast(TOAST_MESSAGES.COPY_SUCCESS);
    } else {
      showToast(TOAST_MESSAGES.COPY_FAIL);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(type === 'heavy' ? [30, 40] : 15);
      } catch (e) {}
    }
  };

  // Start Chart Course with 3, 2, 1 Mission Briefing!
  const handleStartChartGame = (scenario?: ChartScenario) => {
    triggerHaptic('medium');
    const targetScenario = scenario || getRandomScenario();
    setSelectedScenario(targetScenario);

    setCurrentTick(1);
    currentTickRef.current = 1;

    setCash(INITIAL_CASH);
    cashRef.current = INITIAL_CASH;

    setShares(0);
    sharesRef.current = 0;

    setUserTrades([]);
    userTradesRef.current = [];

    setFlashEffect(null);
    setActiveNews(null);
    setNewsOutcomeNotice(null);

    setIsBriefing(true);
    setBriefingCount(3);
    setView('COURSE_CHART');

    if (timerRef.current) clearInterval(timerRef.current);
    if (briefingTimerRef.current) clearInterval(briefingTimerRef.current);

    let count = 3;
    briefingTimerRef.current = setInterval(() => {
      count -= 1;
      triggerHaptic('light');
      if (count > 0) {
        setBriefingCount(count);
      } else {
        clearInterval(briefingTimerRef.current!);
        briefingTimerRef.current = null;
        setIsBriefing(false);
        triggerHaptic('heavy');
        startRealtimeTradingLoop(targetScenario);
      }
    }, 950);
  };

  const startRealtimeTradingLoop = (targetScenario: ChartScenario) => {
    let tick = 1;
    timerRef.current = setInterval(() => {
      tick += 1;
      currentTickRef.current = tick;

      if (tick > targetScenario.candles.length) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        finishChartGame(targetScenario);
      } else {
        setCurrentTick(tick);

        const eventMatch = targetScenario.events.find(
          (e) => tick >= e.second && tick < e.second + e.duration
        );
        if (eventMatch) {
          setActiveNews(eventMatch);
          setNewsCountdown(eventMatch.second + eventMatch.duration - tick);
          triggerHaptic('heavy');
        } else {
          const justEnded = targetScenario.events.find(
            (e) => tick === e.second + e.duration
          );
          if (justEnded) {
            setActiveNews(null);
            setNewsOutcomeNotice(`${justEnded.outcomeTitle}`);
            setTimeout(() => setNewsOutcomeNotice(null), 2400);
          } else {
            setActiveNews(null);
          }
        }
      }
    }, 850);
  };

  const finishChartGame = (scenarioTarget: ChartScenario) => {
    triggerHaptic('heavy');
    const lastPrice = scenarioTarget.candles[29]?.close || 100;
    const finalVal = cashRef.current + sharesRef.current * lastPrice;
    const res = evaluateChartGame(scenarioTarget, INITIAL_CASH, finalVal, userTradesRef.current);

    setLastChartResult(res);
    setChartScore(res.score);
    setCompletedCourses((prev) => ({ ...prev, chart: true }));
    addExp(res.earnedExp);

    setView('CHART_RESULT');
  };

  const currentPrice = selectedScenario.candles[currentTick - 1]?.close || 100;
  const currentAsset = cashRef.current + sharesRef.current * currentPrice;
  const currentReturnRate = Math.round(((currentAsset - INITIAL_CASH) / INITIAL_CASH) * 1000) / 10;

  const handleBuy = () => {
    if (cashRef.current <= 0) {
      showToast('예수금이 부족합니다! (이미 풀매수 상태)');
      return;
    }
    triggerHaptic('heavy');
    setFlashEffect('BUY');
    setTimeout(() => setFlashEffect(null), 300);

    const boughtShares = cashRef.current / currentPrice;
    sharesRef.current += boughtShares;
    cashRef.current = 0;

    setCash(0);
    setShares(sharesRef.current);

    const newTrade: TradeAction = {
      second: currentTickRef.current,
      type: 'BUY',
      price: currentPrice,
      newsContext: activeNews ? activeNews.badge : undefined,
    };
    userTradesRef.current.push(newTrade);
    setUserTrades([...userTradesRef.current]);
  };

  const handleSell = () => {
    if (sharesRef.current <= 0) {
      showToast('매도할 보유 주식이 없습니다!');
      return;
    }
    triggerHaptic('medium');
    setFlashEffect('SELL');
    setTimeout(() => setFlashEffect(null), 300);

    const gainedCash = sharesRef.current * currentPrice;
    cashRef.current = gainedCash;
    sharesRef.current = 0;

    setCash(gainedCash);
    setShares(0);

    const newTrade: TradeAction = {
      second: currentTickRef.current,
      type: 'SELL',
      price: currentPrice,
      newsContext: activeNews ? activeNews.badge : undefined,
    };
    userTradesRef.current.push(newTrade);
    setUserTrades([...userTradesRef.current]);
  };

  const certificate: AcademyCertificate = evaluateCertificate(userProgress, chartScore, dartScore, financeScore);

  const handleShareCertificate = async () => {
    triggerHaptic('light');
    const url = new URL(window.location.href);
    url.searchParams.set('host', '나');
    url.searchParams.set('rank', certificate.rankTitle);
    url.searchParams.set('score', certificate.totalScore.toString());

    const shareUrl = url.toString();
    const shareText = `[투자사관학교 공식 임관장] 내 계급은 ${certificate.rankTitle} (${certificate.totalScore}점)! 너는 몇 계급인지 계급장 까봐라 ㅋㅋㅋ`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '대한민국 투자사관학교 임관장',
          text: shareText,
          url: shareUrl,
        });
        showToast('공유 링크가 열렸습니다!');
        return;
      } catch (e) {}
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      showToast('임관장 링크 복사 완료! 단톡방에 서열 배틀을 신청하세요.');
    } catch (e) {
      showToast('링크: ' + shareUrl);
    }
  };

  const handleCopyCommunity = async () => {
    triggerHaptic('light');
    const text = `[대한민국 투자사관학교 공식 임관]\n🎖️ 최종 계급: ${certificate.rankTitle}\n📊 종합 점수: ${certificate.totalScore}점 (차트 ${certificate.chartGrade} / 공시 ${certificate.dartGrade} / 재무 ${certificate.financeGrade})\n"토스증권 서학개미 여러분, 계급장 맞짱 받습니다."\n#투자사관학교 #토스증권 #계급장배틀`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('토스증권 종목 토론방 공유 텍스트 복사 완료!');
    } catch (e) {}
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast */}
      {toastMessage && (
        <div
          data-testid="toast-message"
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#191f28',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 24,
            fontSize: 13,
            fontWeight: 700,
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            maxWidth: '90%',
            width: 'max-content',
            textAlign: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <Sparkles size={16} color="#f04452" style={{ flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="top-app-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ShieldCheck size={18} color="#f04452" />
          <span style={{ fontSize: 14, fontWeight: 900, color: '#191f28' }}>
            대한민국 투자사관학교
          </span>
        </div>

        <button
          className="icon-btn"
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (briefingTimerRef.current) clearInterval(briefingTimerRef.current);
            setIsBriefing(false);
            setView('LOBBY');
          }}
          aria-label="로비로 이동"
        >
          <X size={22} />
        </button>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ flex: 1, padding: '0 20px 80px 20px', display: 'flex', flexDirection: 'column' }}>
        {/* VIEW 1: LOBBY */}
        {view === 'LOBBY' && (
          <div className="fade-in" style={{ paddingTop: 10 }}>
            {/* Cadet Rank Card with Clickable Roadmap Button */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                border: '1.5px solid #191f28',
                padding: '18px 18px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    backgroundColor: '#feebee',
                    color: '#f04452',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  {userProgress.rankBadge}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setView('ROADMAP');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3182f6',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    padding: '2px 6px',
                  }}
                >
                  성장 현황 보기 <ChevronRight size={14} />
                </button>
              </div>

              <div
                onClick={() => {
                  triggerHaptic('light');
                  setView('ROADMAP');
                }}
                style={{ cursor: 'pointer' }}
              >
                <h1 style={{ fontSize: 22, fontWeight: 900, color: '#191f28', marginTop: 6 }}>
                  Lv.{userProgress.level} {userProgress.rankTitle}
                </h1>

                {/* EXP Progress Bar */}
                <div style={{ height: 6, backgroundColor: '#f2f4f6', borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: '#f04452',
                      borderRadius: 3,
                      width: `${Math.min(100, (userProgress.currentExp / userProgress.maxExp) * 100)}%`,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: '#8b95a1' }}>
                    누적 경험치 {userProgress.currentExp} / {userProgress.maxExp} EXP
                  </span>
                  <span style={{ fontSize: 11, color: '#3182f6', fontWeight: 700 }}>
                    승강제 계급표 탭 &gt;
                  </span>
                </div>
              </div>
            </div>

            {/* Courses Curriculum */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#8b95a1' }}>
                  실전 훈련 커리큘럼
                </span>
                <span style={{ fontSize: 11, color: '#f04452', fontWeight: 700 }}>
                  🎲 매판 무작위 랜덤 출제
                </span>
              </div>

              {/* Course 1 Card */}
              <div
                onClick={() => handleStartChartGame()}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e8eb',
                  borderRadius: 16,
                  padding: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#191f28' }}>
                      [과목 1] 블라인드 차트 단타 훈련
                    </span>
                    <span style={{ fontSize: 10, color: '#f04452', backgroundColor: '#feebee', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>
                      🔥 심박수 180 주의
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#4e5968', marginTop: 3, fontWeight: 500 }}>
                    가짜뉴스 4연타를 뚫고 전설의 불장에서 살아남으세요
                  </div>
                </div>
                <ChevronRight size={18} color="#8b95a1" />
              </div>

              {/* Course 2 Card */}
              <div
                onClick={() => setView('COURSE_DART')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e8eb',
                  borderRadius: 16,
                  padding: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#191f28' }}>
                      [과목 2] DART 공시 속보 판별 훈련
                    </span>
                    <span style={{ fontSize: 10, color: '#3182f6', backgroundColor: '#e8f3ff', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>
                      🚨 세력 작전주 감별
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#4e5968', marginTop: 3, fontWeight: 500 }}>
                    상폐 찌라시와 1조 대박 공시, 1초 만에 걸러내기
                  </div>
                </div>
                <ChevronRight size={18} color="#8b95a1" />
              </div>

              {/* Course 3 Card */}
              <div
                onClick={() => setView('COURSE_FINANCE')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e8eb',
                  borderRadius: 16,
                  padding: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#191f28' }}>
                      [과목 3] 재무제표 옥석 가리기 훈련
                    </span>
                    <span style={{ fontSize: 10, color: '#04b067', backgroundColor: '#e6f8f0', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>
                      💎 10배 텐배거 발굴
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#4e5968', marginTop: 3, fontWeight: 500 }}>
                    쓰레기 적자 기업 속 숨겨진 진짜 진주 찾기
                  </div>
                </div>
                <ChevronRight size={18} color="#8b95a1" />
              </div>
            </div>

            {/* View Certificate CTA Button */}
            <button
              type="button"
              className="btn-stock-red"
              onClick={() => setView('CERTIFICATE')}
            >
              <Award size={18} style={{ marginRight: 8 }} />
              종합 임관장 & 계급장 발급받기
            </button>

            {/* Reset Data Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <button
                type="button"
                data-testid="reset-data-btn"
                onClick={() => {
                  triggerHaptic('light');
                  setIsResetModalOpen(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b95a1',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 10px',
                  borderRadius: 8,
                }}
              >
                <RotateCcw size={13} color="#8b95a1" />
                데이터 초기화
              </button>
            </div>

            {/* Reset Confirm Modal */}
            {isResetModalOpen && (
              <div
                data-testid="reset-confirm-modal"
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  zIndex: 10000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                }}
              >
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 20,
                    padding: '24px 20px',
                    maxWidth: 340,
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: '#feebee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto',
                    }}
                  >
                    <AlertTriangle size={24} color="#f04452" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: '#191f28', marginBottom: 6 }}>
                    모든 훈련 데이터를 초기화할까요?
                  </h3>
                  <p style={{ fontSize: 13, color: '#4e5968', lineHeight: 1.45, marginBottom: 20 }}>
                    누적된 경험치(EXP)와 진급 계급이 모두 리셋되어 <b>Lv.1 훈련병</b> 상태로 되돌아갑니다.
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      data-testid="cancel-reset-btn"
                      onClick={() => setIsResetModalOpen(false)}
                      style={{
                        flex: 1,
                        padding: '12px 0',
                        borderRadius: 12,
                        border: '1px solid #e5e8eb',
                        backgroundColor: '#f2f4f6',
                        color: '#4e5968',
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      data-testid="confirm-reset-btn"
                      onClick={handleResetData}
                      style={{
                        flex: 1,
                        padding: '12px 0',
                        borderRadius: 12,
                        border: 'none',
                        backgroundColor: '#f04452',
                        color: '#ffffff',
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      초기화하기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Promotion Celebration Modal */}
            {isCelebrationModalOpen && (
              <div
                data-testid="promotion-celebration-modal"
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  zIndex: 10001,
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
                    padding: '28px 20px',
                    maxWidth: 350,
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
                    border: '2px solid #b8860b',
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: '#fff9e6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 14px auto',
                    }}
                  >
                    <Trophy size={28} color="#b8860b" />
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 900, color: '#191f28', marginBottom: 6 }}>
                    👑 3과목 올클리어! 전군 지휘관 승급
                  </h3>
                  <p style={{ fontSize: 13, color: '#4e5968', lineHeight: 1.45, marginBottom: 16 }}>
                    종합 평가 {calculateComprehensiveScore(chartScore, dartScore, financeScore)}점 초격차 실적으로 투자사관학교 전 과정을 수료했습니다!
                  </p>

                  {/* Privileges Box */}
                  <div
                    style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: 12,
                      padding: '12px 14px',
                      textAlign: 'left',
                      marginBottom: 20,
                      border: '1px solid #e5e8eb',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#191f28', marginBottom: 6 }}>
                      🎖️ 즉시 해금된 특권
                    </div>
                    {[
                      '대한민국 투자사관학교 공식 수료 인증장 발급',
                      '토스증권 주식 거래 수수료 우대 혜택 적용',
                      '단톡방 맞짱 배틀 챌린지 전용 칭호 부여',
                      '상위 0.1% 극야수 사령관 명예의 전당 등재',
                    ].map((priv, idx) => (
                      <div key={idx} style={{ fontSize: 12, color: '#4e5968', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <CheckCircle size={13} color="#04b067" />
                        <span>{priv}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      type="button"
                      data-testid="close-celebration-btn"
                      onClick={() => {
                        triggerHaptic('medium');
                        setIsCelebrationModalOpen(false);
                        setView('CERTIFICATE');
                      }}
                      className="btn-stock-red"
                      style={{
                        padding: '13px 0',
                        fontSize: 15,
                        fontWeight: 900,
                      }}
                    >
                      <Award size={16} style={{ marginRight: 6 }} />
                      종합 임관장 발급받으러 가기
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCelebrationModalOpen(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8b95a1',
                        fontSize: 12,
                        cursor: 'pointer',
                        padding: '6px 0',
                      }}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mandatory Regulatory Disclaimer */}
            <div
              style={{
                marginTop: 18,
                backgroundColor: '#f2f4f6',
                borderRadius: 12,
                padding: '10px 12px',
                fontSize: 11,
                color: '#8b95a1',
                lineHeight: 1.45,
                textAlign: 'center',
              }}
            >
              ※ 본 서비스는 과거 역사적 데이터 기반의 교육·모의 훈련 시뮬레이션이며, 실제 투자를 권유하거나 자문하지 않습니다. 가상 훈련 머니는 현금성 환전이 불가능합니다.
            </div>
          </div>
        )}

        {/* VIEW 1.5: ROADMAP */}
        {view === 'ROADMAP' && (
          <RankRoadmap
            progress={userProgress}
            onBack={() => setView('LOBBY')}
            onShare={handleShareCertificate}
          />
        )}

        {/* VIEW 2: COURSE 1 (CHART GAME WITH 3, 2, 1 COUNTDOWN OVERLAY) */}
        {view === 'COURSE_CHART' && (
          <div className="fade-in" style={{ paddingTop: 8, position: 'relative' }}>
            {/* 3, 2, 1 MISSION BRIEFING OVERLAY */}
            {isBriefing && (
              <div
                className="fade-in"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(25, 31, 40, 0.94)',
                  zIndex: 9999,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                  textAlign: 'center',
                  color: '#ffffff',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#feebee',
                    color: '#f04452',
                    fontSize: 12,
                    fontWeight: 900,
                    padding: '4px 12px',
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                >
                  {selectedScenario.badge}
                </div>

                <div style={{ fontSize: 13, color: '#8b95a1', fontWeight: 700 }}>
                  {selectedScenario.period}
                </div>

                <h1 style={{ fontSize: 24, fontWeight: 900, marginTop: 4, letterSpacing: -0.5 }}>
                  {selectedScenario.name}
                </h1>

                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: 14,
                    padding: 16,
                    margin: '20px 0',
                    maxWidth: 320,
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: '#e5e8eb',
                  }}
                >
                  🎯 <b>미션 브리핑</b><br />
                  "시작 2초 뒤 첫 긴급 속보 폭발!<br />
                  찌라시 4연타를 뚫고 전설의 불장에서 살아남으세요."
                </div>

                {/* Big Countdown Number */}
                <div
                  key={briefingCount}
                  style={{
                    fontSize: 72,
                    fontWeight: 900,
                    color: '#f04452',
                    letterSpacing: -2,
                    animation: 'pulse 0.9s infinite',
                  }}
                >
                  {briefingCount}
                </div>
                <div style={{ fontSize: 12, color: '#b0b8c1', marginTop: 4 }}>
                  초 후 실전 호가창이 개장됩니다!
                </div>
              </div>
            )}

            {/* In-game live content */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8b95a1' }}>
                  종목: <span style={{ color: '#191f28' }}>??? (블라인드)</span>
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: currentReturnRate >= 0 ? '#f04452' : '#3182f6',
                    letterSpacing: -0.5,
                  }}
                >
                  {currentReturnRate >= 0 ? '+' : ''}{currentReturnRate}%
                </div>
                <div style={{ fontSize: 13, color: '#4e5968', fontWeight: 600 }}>
                  평가 자산: {Math.round(currentAsset).toLocaleString()}원
                </div>
              </div>

              <div style={{ backgroundColor: '#191f28', color: '#fff', borderRadius: 12, padding: '6px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#8b95a1', fontWeight: 700 }}>남은 시간</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#f04452' }}>
                  {Math.max(0, 30 - currentTick)}초
                </div>
              </div>
            </div>

            {/* Active News Event Banner */}
            {activeNews && (
              <div
                className="fade-in"
                style={{
                  backgroundColor: '#feebee',
                  border: '2px solid #f04452',
                  borderRadius: 14,
                  padding: '10px 14px',
                  marginBottom: 10,
                  boxShadow: '0 6px 18px rgba(240,68,82,0.25)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Radio size={16} color="#f04452" />
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#f04452' }}>
                      {activeNews.badge} 발생!
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#f04452', color: '#fff', padding: '2px 8px', borderRadius: 10 }}>
                    결정까지 D-{newsCountdown}초
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#191f28', marginTop: 4 }}>
                  {activeNews.headline}
                </div>
              </div>
            )}

            {/* Chart Area */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                padding: 12,
                border: flashEffect === 'BUY'
                  ? '2px solid #f04452'
                  : flashEffect === 'SELL'
                  ? '2px solid #3182f6'
                  : '1px solid #e5e8eb',
                boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
              }}
            >
              <ChartCanvas
                candles={selectedScenario.candles}
                currentTick={currentTick}
                userTrades={userTrades}
                events={selectedScenario.events}
              />
            </div>

            {/* Position Info */}
            <div
              style={{
                marginTop: 12,
                backgroundColor: '#f9fafb',
                borderRadius: 14,
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                fontWeight: 600,
                border: '1px solid #e5e8eb',
              }}
            >
              <div>
                <span style={{ color: '#8b95a1' }}>포지션: </span>
                <span style={{ color: shares > 0 ? '#f04452' : '#4e5968', fontWeight: 800 }}>
                  {shares > 0 ? '🔥 풀매수 보유 중' : '💤 현금 관망 중'}
                </span>
              </div>
              <div>
                <span style={{ color: '#8b95a1' }}>예수금: </span>
                <span style={{ color: '#191f28' }}>{Math.round(cash).toLocaleString()}원</span>
              </div>
            </div>

            {/* Dual Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
              <button
                type="button"
                onClick={handleSell}
                disabled={shares <= 0}
                style={{
                  height: 58,
                  backgroundColor: shares > 0 ? '#3182f6' : '#e5e8eb',
                  color: shares > 0 ? '#fff' : '#8b95a1',
                  border: 'none',
                  borderRadius: 16,
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: shares > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <TrendingDown size={18} /> 전량 매도 (탈출)
              </button>

              <button
                type="button"
                onClick={handleBuy}
                disabled={cash <= 0}
                style={{
                  height: 58,
                  backgroundColor: cash > 0 ? '#f04452' : '#e5e8eb',
                  color: cash > 0 ? '#fff' : '#8b95a1',
                  border: 'none',
                  borderRadius: 16,
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: cash > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: cash > 0 ? '0 4px 14px rgba(240,68,82,0.3)' : 'none',
                }}
              >
                <Flame size={18} /> 영혼의 풀매수!
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: CHART RESULT (WITH PRECISE HEADLINE & 4-COLOR AUTOPSIES) */}
        {view === 'CHART_RESULT' && lastChartResult && (
          <div className="fade-in" style={{ paddingTop: 14 }}>
            <div style={{ backgroundColor: '#191f28', borderRadius: 18, padding: '16px 20px', color: '#fff', textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#f04452', fontWeight: 800, letterSpacing: 1 }}>SECRET STOCK UNVEILED</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{lastChartResult.scenarioName}</h2>
              <div style={{ fontSize: 12, color: '#8b95a1' }}>{lastChartResult.period}</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #191f28', borderRadius: 20, padding: 18, textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f04452' }}>{lastChartResult.tierTitle}</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: lastChartResult.totalReturnRate >= 0 ? '#f04452' : '#3182f6', margin: '4px 0' }}>
                {lastChartResult.totalReturnRate >= 0 ? '+' : ''}{lastChartResult.totalReturnRate}%
              </div>
              <div style={{ fontSize: 13, color: '#4e5968', fontWeight: 600 }}>
                최종 자산: {Math.round(lastChartResult.finalAsset).toLocaleString()}원 (경험치 {lastChartResult.earnedExp >= 0 ? '+' : ''}{lastChartResult.earnedExp} EXP)
              </div>
            </div>

            {/* AUTOPSY SECTION (PERFECTLY MATCHED HEADLINE & ACTIONS) */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e8eb', borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#191f28', marginBottom: 12 }}>
                📋 내가 당한 속보/찌라시 부검표 (총 {lastChartResult.autopsies.length}건)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lastChartResult.autopsies.map((a, i) => {
                  const isGenius = a.verdictType === 'GENIUS';
                  const isDefense = a.verdictType === 'DEFENSE';
                  const isPass = a.verdictType === 'PASS';
                  const isBlackCow = a.verdictType === 'BLACK_COW';

                  const badgeBg = isGenius
                    ? '#e6f8f0'
                    : isDefense
                    ? '#e8f3ff'
                    : isPass
                    ? '#f2f4f6'
                    : '#feebee';

                  const badgeColor = isGenius
                    ? '#04b067'
                    : isDefense
                    ? '#3182f6'
                    : isPass
                    ? '#6b7684'
                    : '#f04452';

                  return (
                    <div
                      key={i}
                      style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: 12,
                        padding: '12px 14px',
                        border: '1px solid #e5e8eb',
                      }}
                    >
                      {/* Event Headline & Actual Result */}
                      <div style={{ borderBottom: '1px dashed #e5e8eb', paddingBottom: 8, marginBottom: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#191f28', lineHeight: 1.35 }}>
                          [{a.second}초 사건] {a.eventHeadline}
                        </div>
                        <div style={{ fontSize: 11, color: '#8b95a1', marginTop: 2 }}>
                          📈 실제 시장 반응: <b style={{ color: '#4e5968' }}>{a.marketOutcome}</b>
                        </div>
                      </div>

                      {/* 4-Color Badge & User Action */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            backgroundColor: badgeBg,
                            color: badgeColor,
                            padding: '2px 8px',
                            borderRadius: 6,
                          }}
                        >
                          {a.verdictLabel}
                        </span>

                        <span style={{ fontSize: 11, fontWeight: 700, color: '#191f28' }}>
                          내 선택: {a.userAction}
                        </span>
                      </div>

                      {/* Tailored Commentary */}
                      <div style={{ fontSize: 12, color: '#333d4b', fontStyle: 'italic', lineHeight: 1.4 }}>
                        {a.comment}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Replay action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                data-testid="copy-chart-result-btn"
                className="btn-outline-stock"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '14px',
                  borderRadius: 14,
                  border: '1.5px solid #191f28',
                  backgroundColor: '#ffffff',
                  color: '#191f28',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
                onClick={handleCopyChartResult}
              >
                <Copy size={18} color="#191f28" />
                결과 링크 클립보드 복사
              </button>

              <button
                type="button"
                className="btn-stock-red"
                onClick={() => handleStartChartGame(getRandomScenario())}
              >
                <Dices size={18} style={{ marginRight: 8 }} />
                새로운 랜덤 차트로 즉시 재도전하기
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={() => setView('LOBBY')}
              >
                사관학교 로비로 복귀하기
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: COURSE 2 (DART TEST) */}
        {view === 'COURSE_DART' && (
          <CourseDart
            onFinish={(score, correctCount) => {
              setDartScore(score);
              setCompletedCourses((prev) => ({ ...prev, dart: true }));

              let expDelta = 25;
              if (correctCount === 5) expDelta = 45;
              else if (correctCount === 4) expDelta = 25;
              else if (correctCount === 3) expDelta = 10;
              else if (correctCount <= 2) expDelta = -20;

              addExp(expDelta);
              showToast(`DART 훈련 완료! (정답 ${correctCount}/5 · EXP ${expDelta >= 0 ? '+' : ''}${expDelta})`);
              setView('LOBBY');
            }}
            onBack={() => setView('LOBBY')}
          />
        )}

        {/* VIEW 5: COURSE 3 (FINANCIAL TEST) */}
        {view === 'COURSE_FINANCE' && (
          <CourseFinancials
            onFinish={(score, correctCount) => {
              setFinanceScore(score);
              setCompletedCourses((prev) => ({ ...prev, finance: true }));

              let expDelta = 25;
              if (correctCount === 5) expDelta = 45;
              else if (correctCount === 4) expDelta = 25;
              else if (correctCount === 3) expDelta = 10;
              else if (correctCount <= 2) expDelta = -20;

              addExp(expDelta);
              showToast(`재무제표 훈련 완료! (정답 ${correctCount}/5 · EXP ${expDelta >= 0 ? '+' : ''}${expDelta})`);
              setView('LOBBY');
            }}
            onBack={() => setView('LOBBY')}
          />
        )}

        {/* VIEW 6: CERTIFICATE */}
        {view === 'CERTIFICATE' && (
          <Certificate
            cert={certificate}
            onShare={handleShareCertificate}
            onCopyCommunity={handleCopyCommunity}
            onRestart={() => setView('LOBBY')}
          />
        )}

        {/* VIEW 7: BATTLE MIRROR VIEW */}
        {view === 'BATTLE_VIEW' && battleHost && (
          <div className="fade-in" style={{ paddingTop: 14 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <span style={{ backgroundColor: '#f04452', color: '#fff', fontSize: 12, fontWeight: 900, padding: '4px 10px', borderRadius: 8 }}>
                1:1 RANK BATTLE
              </span>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#191f28', marginTop: 8 }}>
                사관학교 계급 서열 맞짱
              </h2>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #191f28', borderRadius: 20, padding: 18, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, backgroundColor: '#f9fafb', borderRadius: 14, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#8b95a1' }}>도발자</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#191f28' }}>{battleHost.hostName}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#f04452', marginTop: 4 }}>{battleHost.hostScore}점</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#4e5968', marginTop: 2 }}>{battleHost.hostRank}</div>
                </div>

                <div style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#191f28', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  VS
                </div>

                <div style={{ flex: 1, backgroundColor: '#f9fafb', borderRadius: 14, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#8b95a1' }}>나</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#191f28' }}>생도</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#3182f6', marginTop: 4 }}>{certificate.totalScore}점</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#4e5968', marginTop: 2 }}>{certificate.rankTitle}</div>
                </div>
              </div>
            </div>

            <button type="button" className="btn-stock-red" onClick={() => setView('LOBBY')}>
              사관학교 입교하고 계급 뒤집기
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
