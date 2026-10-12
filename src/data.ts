import {
  ChartScenario,
  CandlePoint,
  NewsEvent,
  ChartGameResult,
  DartQuestion,
  FinancialQuestion,
  AcademyCertificate,
  TradeAction,
  NewsAutopsy,
  UserProgress,
} from './types';

function generateCandles(prices: number[]): CandlePoint[] {
  return prices.map((price, idx) => {
    const prev = idx === 0 ? prices[0] : prices[idx - 1];
    return {
      time: idx + 1,
      open: prev,
      close: price,
      price: price,
      high: Math.max(prev, price) + Math.floor(Math.random() * 3 + 2),
      low: Math.min(prev, price) - Math.floor(Math.random() * 3 + 2),
    };
  });
}

export const SCENARIOS: ChartScenario[] = [
  {
    id: 'gme-2021',
    name: '게임스탑 (GME)',
    period: '2021 월가 공매도 징벌전',
    badge: '🔥 숏스퀴즈 폭발',
    description: '개미들이 레딧에 뭉쳐 헤지펀드를 파산시킨 전설의 +1,500% 폭등 빔',
    basePrice: 100,
    candles: generateCandles([
      100, 108, 125, 142, 160, 180, 210, 245, 290, 340,
      390, 440, 480, 520, 500, 460, 420, 360, 310, 270,
      240, 210, 190, 175, 160, 145, 135, 125, 115, 105
    ]),
    events: [
      {
        second: 2,
        duration: 3,
        headline: '🚨 [레딧 속보] 개미 군단 총공격! 멜빈 캐피탈 마진콜 숏 청산 시작',
        category: '호재?',
        badge: '🚀 숏스퀴즈 개막',
        isBullish: true,
        isTrap: false,
        outcomeTitle: '+200% 수직 양봉 빔 폭등',
        outcomeDetail: '공매도 물량이 강제 청산되며 주가가 5배 이상 폭주',
      },
      {
        second: 9,
        duration: 3,
        headline: '🚨 [월가 속보] 시트론 리서치 "GME 20달러 간다" 공매도 리포트 발간',
        category: '악재?',
        badge: '⚠️ 세력 공매도',
        isBullish: true,
        isTrap: true,
        outcomeTitle: '공매도 세력 뚝배기 깨고 폭등',
        outcomeDetail: '리포트 비웃으며 매수세 결집, 숏스퀴즈 가속화',
      },
      {
        second: 17,
        duration: 3,
        headline: '🚨 [긴급] 로빈후드 등 주요 브로커, GME [매수 버튼] 기습 삭제!',
        category: '악재?',
        badge: '💀 매수 버튼 삭제',
        isBullish: false,
        isTrap: false,
        outcomeTitle: '매수 차단으로 -70% 급락 전환',
        outcomeDetail: '강제 매수 차단으로 매수세 급감, 롱 포지션 청산 사태',
      },
      {
        second: 24,
        duration: 3,
        headline: '🚨 [루머] 미국 의회 금융위, 주가조작 청문회 긴급 소집 통보',
        category: '악재?',
        badge: '⚡ 청문회 악재',
        isBullish: false,
        isTrap: false,
        outcomeTitle: '규제 리스크로 잔여 거품 급속 냉각',
        outcomeDetail: '거래량 급감하며 주가 제자리로 회귀',
      },
    ],
  },
  {
    id: 'nvda-2024',
    name: '엔비디아 (NVDA)',
    period: '2024 AI 슈퍼사이클 불장',
    badge: '🤖 AI 독점 랠리',
    description: '빅테크 공급 독점과 가짜 규제 뉴스가 뒤섞인 전설의 우상향 랠리',
    basePrice: 100,
    candles: generateCandles([
      100, 105, 118, 128, 136, 144, 150, 156, 152, 148,
      154, 160, 165, 170, 175, 160, 152, 168, 182, 195,
      205, 215, 210, 222, 230, 238, 235, 245, 252, 260
    ]),
    events: [
      {
        second: 2,
        duration: 3,
        headline: '🚨 [속보] 마이크로소프트·메타, 차세대 AI 가속기 10만 장 긴급 선결제',
        category: '호재?',
        badge: '🔥 빅테크 선결제',
        isBullish: true,
        isTrap: false,
        outcomeTitle: '+38% 수직 폭등 빔 적중',
        outcomeDetail: '빅테크 대량 주문 확인되며 매수세 폭발',
      },
      {
        second: 9,
        duration: 3,
        headline: '🚨 [어닝 속보] 젠슨 황 CEO "블랙웰 칩 1년치 물량 전량 완판"',
        category: '호재?',
        badge: '💎 어닝 서프라이즈',
        isBullish: true,
        isTrap: false,
        outcomeTitle: '실적 신기록 전고점 돌파 랠리',
        outcomeDetail: '마진율 75% 유지 확인되며 기관 풀매수 유입',
      },
      {
        second: 17,
        duration: 3,
        headline: '🚨 [단독] 미 재무부, 대중 반도체 추가 수출 규제 검토설 유출',
        category: '악재?',
        badge: '⚠️ 개미털기 낚시',
        isBullish: true,
        isTrap: true,
        outcomeTitle: '개미털기 낚시 판명! V자 폭등',
        outcomeDetail: '규제 영향 없음 공식 해명 발표되며 패닉셀 친 개미들 통곡',
      },
      {
        second: 24,
        duration: 3,
        headline: '🚨 [블룸버그] 사우디 국부펀드, 10조 원 규모 AI 펀드 조성 투자 결정',
        category: '호재?',
        badge: '💵 오일머니 유입',
        isBullish: true,
        isTrap: false,
        outcomeTitle: '오일머니 매수세로 최고가 마감',
        outcomeDetail: '글로벌 국부펀드 매수세로 마지막 불꽃 양봉 완성',
      },
    ],
  },
  {
    id: 'covid-2020',
    name: '나스닥 종합 (IXIC)',
    period: '2020 팬데믹 서킷 & V자 반등',
    badge: '⚡ 역사적 V자 반등',
    description: '서킷브레이커 연쇄 발동 후 미 연준의 무제한 양적완화 반등 기회',
    basePrice: 100,
    candles: generateCandles([
      100, 92, 80, 72, 65, 62, 66, 72, 80, 88,
      96, 105, 114, 122, 130, 138, 145, 154, 162, 170,
      178, 185, 192, 202, 210, 218, 225, 232, 240, 250
    ]),
    events: [
      {
        second: 2,
        duration: 3,
        headline: '🚨 [속보] 개장 3분 만에 서킷브레이커 발동! 전 종목 투매 폭탄',
        category: '악재?',
        badge: '💀 공포의 서킷',
        isBullish: false,
        isTrap: true,
        outcomeTitle: '바닥 찍고 역사적 V자 반등 개막',
        outcomeDetail: '공포에 던진 사람과 바닥을 잡은 사람의 운명이 갈림',
      },
      {
        second: 9,
        duration: 3,
        headline: '🚨 [백악관 타전] 전 국민 재난지원금 2조 달러 긴급 지급 행정명령',
        category: '호재?',
        badge: '💸 현금 살포 빔',
        isBullish: true,
        isTrap: false,
        outcomeTitle: '개미 군단 유동성 유입 가파른 반등',
        outcomeDetail: '지원금 계좌로 주식 매수세 급증',
      },
      {
        second: 17,
        duration: 3,
        headline: '🚨 [연준 긴급 발표] 파월 의장 "기준금리 0% 인하 및 무제한 양적완화"',
        category: '호재?',
        badge: '💵 무제한 유동성',
        isBullish: true,
        isTrap: false,
        outcomeTitle: '돈 복사 랠리 시작! 전고점 돌파',
        outcomeDetail: '시장에 풀린 유동성으로 2년간의 대세 상승장 진입',
      },
      {
        second: 24,
        duration: 3,
        headline: '🚨 [화이자 발표] 코로나 백신 임상 95% 유효성 중간 결과 발표',
        category: '호재?',
        badge: '💉 백신 서프라이즈',
        isBullish: true,
        isTrap: false,
        outcomeTitle: '경제 재개 기대감으로 역사적 피날레',
        outcomeDetail: '공포를 극복한 투자자들에게 초대박 수익 안겨줌',
      },
    ],
  },
  {
    id: 'btc-2021',
    name: '비트코인 (BTC)',
    period: '2021 불장 & 부처빔 대폭락',
    badge: '🎢 롤러코스터',
    description: 'CEO의 트윗 한마디와 초대형 규제 악재가 터져 나온 롤러코스터',
    basePrice: 100,
    candles: generateCandles([
      100, 108, 122, 135, 148, 160, 172, 180, 170, 150,
      130, 110, 95, 82, 75, 78, 80, 75, 68, 58,
      48, 42, 38, 42, 45, 48, 44, 40, 36, 33
    ]),
    events: [
      {
        second: 2,
        duration: 3,
        headline: '🚨 [CEO 트윗] 일론 머스크 "비트코인 결제 재개 오늘 밤 검토"',
        category: '찌라시',
        badge: '💀 어그로 낚시',
        isBullish: false,
        isTrap: true,
        outcomeTitle: '트윗 낚시 판명! -55% 폭락 빔',
        outcomeDetail: '"환경 문제로 결제 중단" 공식 트윗 뜨며 롱포지션 강제 청산',
      },
      {
        second: 9,
        duration: 3,
        headline: '🚨 [온체인 경고] 1만 BTC 고래 지갑, 코인베이스 거래소로 기습 이체',
        category: '악재?',
        badge: '🐳 고래 덤핑 경보',
        isBullish: false,
        isTrap: false,
        outcomeTitle: '시장가 매도 폭탄! 지지선 붕괴',
        outcomeDetail: '대규모 덤핑 물량 쏟아지며 하락 가속화',
      },
      {
        second: 17,
        duration: 3,
        headline: '🚨 [긴급 타전] 중국 정부, 암호화폐 거래·채굴 전면 금지령 발효',
        category: '악재?',
        badge: '⚡ 진짜 메가 악재',
        isBullish: false,
        isTrap: false,
        outcomeTitle: '초대형 악재 적중! 바닥 없는 추락',
        outcomeDetail: '채굴장 강제 폐쇄 소식에 매수벽 전멸하며 영혼까지 털림',
      },
      {
        second: 24,
        duration: 3,
        headline: '🚨 [거래소 속보] 선물 거래소 24시간 내 10조 원 규모 강제 청산',
        category: '악재?',
        badge: '🩸 피바다 청산',
        isBullish: false,
        isTrap: false,
        outcomeTitle: '연쇄 마진콜로 패닉셀 극대화',
        outcomeDetail: '손절 타이밍을 놓친 개미들의 시드가 0원으로 수렴',
      },
    ],
  },
  {
    id: 'luna-2022',
    name: '테라/루나 (LUNA)',
    period: '2022 죽음의 나선 -99.9%',
    badge: '☠️ 사상 초유의 청산',
    description: '알고리즘 페깅 붕괴로 48시간 만에 시총 50조 원이 증발한 공포의 칼날',
    basePrice: 100,
    candles: generateCandles([
      100, 92, 80, 68, 55, 42, 32, 24, 18, 14,
      10, 7, 5, 3.5, 2.5, 1.8, 1.2, 0.8, 0.5, 0.3,
      0.18, 0.1, 0.06, 0.04, 0.02, 0.01, 0.005, 0.002, 0.001, 0.0005
    ]),
    events: [
      {
        second: 2,
        duration: 3,
        headline: '🚨 [경고] UST 1달러 페깅 붕괴! 디페깅 비율 20% 돌파',
        category: '악재?',
        badge: '⚠️ 죽음의 나선 시작',
        isBullish: false,
        isTrap: false,
        outcomeTitle: '무한 발행 메커니즘 대폭락 빔',
        outcomeDetail: '물타기 하던 개미들까지 전부 청산시키는 바닥 없는 나선',
      },
      {
        second: 9,
        duration: 3,
        headline: '🚨 [창업자 트윗] 권도형 "더 많은 자본을 투입하고 있다. 진정하라"',
        category: '찌라시',
        badge: '💀 구원투수 낚시',
        isBullish: false,
        isTrap: true,
        outcomeTitle: '방어 실패! 추가 발행량 100배 폭증',
        outcomeDetail: '창업자 트윗 믿고 물탄 개미들 전액 증발',
      },
      {
        second: 17,
        duration: 3,
        headline: '🚨 [루머] 글로벌 탑티어 거래소, 거래 지원 종료(상폐) 긴급 검토',
        category: '악재?',
        badge: '⚡ 상장폐지 확정',
        isBullish: false,
        isTrap: false,
        outcomeTitle: '주가 -99.99% 수렴! 잔고 0원 도달',
        outcomeDetail: '떨어지는 칼날을 잡으면 손목이 잘린다는 교훈을 남김',
      },
      {
        second: 24,
        duration: 3,
        headline: '🚨 [공식] 테라 블록체인 네트워크 가동 전면 중단 선언',
        category: '악재?',
        badge: '💀 서버 셧다운',
        isBullish: false,
        isTrap: false,
        outcomeTitle: '금융 폰지 붕괴로 종결',
        outcomeDetail: '탈출하지 못한 모든 자산 영구 소멸',
      },
    ],
  },
  {
    id: 'tsla-2020',
    name: '테슬라 (TSLA)',
    period: '2020 공매도 박살 숏스퀴즈',
    badge: '🔋 전기차 숏스퀴즈',
    description: '공매도 헤지펀드 파산 위기와 악재 루머를 태우며 치솟은 광기의 랠리',
    basePrice: 100,
    candles: generateCandles([
      100, 95, 105, 118, 130, 142, 155, 168, 180, 192,
      205, 218, 225, 215, 205, 215, 230, 248, 265, 280,
      295, 310, 325, 340, 355, 368, 380, 395, 410, 425
    ]),
    events: [
      {
        second: 2,
        duration: 3,
        headline: '🚨 [텔레그램 찌라시] 유명 숏 헤지펀드 10조 원 마진콜 임박설',
        category: '호재?',
        badge: '🚀 숏스퀴즈 폭발',
        isBullish: true,
        isTrap: false,
        outcomeTitle: '숏스퀴즈 실현! 공매도 청산 랠리',
        outcomeDetail: '숏커버링 물량이 쏟아지며 주가 2배 수직 상승',
      },
      {
        second: 9,
        duration: 3,
        headline: '🚨 [속보] 프리몬트 공장 대형 화재로 인도 지연 루머 확산',
        category: '악재?',
        badge: '⚠️ 가짜뉴스 루머',
        isBullish: true,
        isTrap: true,
        outcomeTitle: '단순 소동 해명! 주가 전고점 돌파',
        outcomeDetail: '공장 정상 가동 확인되며 공매도 세력 추가 청산 폭발',
      },
      {
        second: 17,
        duration: 3,
        headline: '🚨 [S&P 지수위원회] 테슬라의 S&P 500 지수 전격 편입 공식 발표',
        category: '호재?',
        badge: '🏆 S&P500 편입',
        isBullish: true,
        isTrap: false,
        outcomeTitle: '패시브 펀드 수백조 원 의무 매수 빔',
        outcomeDetail: '글로벌 인덱스 펀드 매수세로 사상 최고가 기록',
      },
      {
        second: 24,
        duration: 3,
        headline: '🚨 [공시] 1주를 5주로 쪼개는 5:1 주식 액면분할 단행 결정',
        category: '호재?',
        badge: '🔥 5:1 액면분할',
        isBullish: true,
        isTrap: false,
        outcomeTitle: '개미 매수세 대거 유입 피날레',
        outcomeDetail: '공매도 세력을 완전히 태워버린 완벽한 승리',
      },
    ],
  },
];

export function getRandomScenario(): ChartScenario {
  const idx = Math.floor(Math.random() * SCENARIOS.length);
  return SCENARIOS[idx];
}

export function calculateUserProgress(totalExp: number): UserProgress {
  const safeExp = Math.max(0, totalExp);

  if (safeExp >= 2500) {
    return {
      level: 7,
      currentExp: safeExp,
      maxExp: 3500,
      rankTitle: '수석 참모총장',
      rankBadge: '👑 월가 극야수 사령관',
      totalGamesPlayed: 0,
      winCount: 0,
    };
  }
  if (safeExp >= 1500) {
    return {
      level: 6,
      currentExp: safeExp,
      maxExp: 2500,
      rankTitle: '1성 장군 (여단장)',
      rankBadge: '⚡ 실전 야전 사령관',
      totalGamesPlayed: 0,
      winCount: 0,
    };
  }
  if (safeExp >= 900) {
    return {
      level: 5,
      currentExp: safeExp,
      maxExp: 1500,
      rankTitle: '대령 (연대장)',
      rankBadge: '🎯 날카로운 분석관',
      totalGamesPlayed: 0,
      winCount: 0,
    };
  }
  if (safeExp >= 500) {
    return {
      level: 4,
      currentExp: safeExp,
      maxExp: 900,
      rankTitle: '소위 (소대장)',
      rankBadge: '⚔️ 실전 임관 장교',
      totalGamesPlayed: 0,
      winCount: 0,
    };
  }
  if (safeExp >= 250) {
    return {
      level: 3,
      currentExp: safeExp,
      maxExp: 500,
      rankTitle: '하사 (원금수호대장)',
      rankBadge: '🛡️ 원금 수호대장',
      totalGamesPlayed: 0,
      winCount: 0,
    };
  }
  if (safeExp >= 100) {
    return {
      level: 2,
      currentExp: safeExp,
      maxExp: 250,
      rankTitle: '이병 (실전 돌입)',
      rankBadge: '🌱 갓 임관한 신병',
      totalGamesPlayed: 0,
      winCount: 0,
    };
  }
  return {
    level: 1,
    currentExp: safeExp,
    maxExp: 100,
    rankTitle: '훈련병 (기초 훈련생)',
    rankBadge: '🐣 사관학교 신규 입교',
    totalGamesPlayed: 0,
    winCount: 0,
  };
}

export const DART_QUESTION_POOL: DartQuestion[] = [
  {
    id: 1,
    company: '에코머티리얼즈',
    title: '최대주주 및 특수관계인 지분 18.5% 시간외 대량매매(블록딜) 전량 처분',
    isGoodNews: false,
    explanation: '최대주주 블록딜은 고점 신호 및 단기 급락 악재입니다.',
  },
  {
    id: 2,
    company: '넥스트바이오',
    title: '빅파마와 1조 8,000억 원 기술수출 계약 체결 (계약금 2,000억 원 수령)',
    isGoodNews: true,
    explanation: '대규모 계약금 수령 및 라이선스 아웃은 기업가치 수직 상승 호재입니다.',
  },
  {
    id: 3,
    company: '알파하이텍',
    title: '운영자금 조달 목적 주주배정 후 실권주 일반공모 유상증자 (할인율 25%)',
    isGoodNews: false,
    explanation: '주주배정 유증은 지분 희석 및 주가 하락 압력 악재입니다.',
  },
  {
    id: 4,
    company: '클라우드솔루션',
    title: '주주가치 제고 위해 발행주식 5% 규모 자사주 매입 후 전량 소각',
    isGoodNews: true,
    explanation: '자사주 소각은 주당 가치를 즉각 끌어올리는 주주환원 호재입니다.',
  },
  {
    id: 5,
    company: '글로벌스타코퍼',
    title: '감사인 감사보고서 의견 거절 (계속기업 존속능력 불확실성)',
    isGoodNews: false,
    explanation: '감사의견 거절은 거래정지 및 상폐 실질심사 사유 악재입니다.',
  },
  {
    id: 6,
    company: '케이반도체',
    title: '삼성전자 대상 제3자배정 유상증자 500억 원 (보호예수 1년)',
    isGoodNews: true,
    explanation: '대기업 제3자배정 유증은 지분투자와 사업 파트너십 결합 호재입니다.',
  },
  {
    id: 7,
    company: '바이오네트웍스',
    title: '전 대표이사 임원 3인 특정경제범죄법 위반(500억 횡령·배임) 혐의 발생',
    isGoodNews: false,
    explanation: '대규모 횡령·배임은 거래정지 사유이자 신뢰도 추락 악재입니다.',
  },
  {
    id: 8,
    company: '스마트모빌리티',
    title: '1주당 신주 2주 배정 무상증자 결정 (주식발행초과금 재원 활용)',
    isGoodNews: true,
    explanation: '무상증자는 주식수 확대 및 주주환원 성격의 단기 폭등 호재입니다.',
  },
  {
    id: 9,
    company: '솔라에너지텍',
    title: '제2회차 전환사채(CB) 300억 전환가액 5,000원 → 2,500원 리픽싱 완료',
    isGoodNews: false,
    explanation: 'CB 리픽싱 하향은 오버행(매도 폭탄) 물량을 2배 늘리는 악재입니다.',
  },
  {
    id: 10,
    company: '퀀텀로보틱스',
    title: '미국 FDA 로봇수술 시스템 최종 품목허가(PMA) 승인 획득',
    isGoodNews: true,
    explanation: '미국 FDA 정식 품목허가는 글로벌 시장 진출 확정 호재입니다.',
  },
  {
    id: 11,
    company: '엔터테인홀딩스',
    title: '한국거래소, 공시번복 사유로 불성실공시법인 지정 및 벌점 부과',
    isGoodNews: false,
    explanation: '불성실공시법인 지정은 경영진 신뢰도 불량 경고 악재입니다.',
  },
  {
    id: 12,
    company: '그린케미칼',
    title: '연간 연결 영업이익 1,200억 원 달성 (전년 대비 +340% 흑자전환)',
    isGoodNews: true,
    explanation: '극적인 흑자전환과 실적 서프라이즈는 떡상 신호입니다.',
  },
  {
    id: 13,
    company: '메타인베스트',
    title: '보통주 10주를 1주로 무상감자(자본감소비율 90%) 결정',
    isGoodNews: false,
    explanation: '무상감자는 결손 보전을 위해 주주 가치를 깎아내는 악재입니다.',
  },
  {
    id: 14,
    company: '현대중공시스템',
    title: '사우디 아람코와 2조 4,000억 원 규모 초대형 플랜트 수주 계약 체결',
    isGoodNews: true,
    explanation: '대규모 해외 플랜트 수주는 수년간의 실적을 담보하는 호재입니다.',
  },
  {
    id: 15,
    company: '가상자산핀테크',
    title: '주요 종속회사 가상자산거래소, 금융정보분석원 영업정지 6개월 처분',
    isGoodNews: false,
    explanation: '핵심 캐시카우 영업정지는 매출 마비 직격탄 악재입니다.',
  },
  {
    id: 16,
    company: '미래항공우주',
    title: '방사청 주관 차세대 초음속 무인기 개발사업 최종 우선협상자 선정',
    isGoodNews: true,
    explanation: '국책 방산 사업 수주는 안정적인 국가 예산 투입 슈퍼 호재입니다.',
  },
];

export function getRandomDartQuestions(count = 5): DartQuestion[] {
  const shuffled = [...DART_QUESTION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const FINANCIAL_QUESTION_POOL: FinancialQuestion[] = [
  {
    id: 1,
    companyName: '한국우량반도체',
    metrics: {
      per: '6.2배 (업종 18배)',
      pbr: '0.65배 (청산가치 이하)',
      debtRatio: '24% (초우량)',
      operatingProfitGrowth: '+48% (영업익 사상최대)',
      dividendYield: '배당률 4.8%',
    },
    isGem: true,
    explanation: '낮은 PER/PBR, 낮은 부채, 높은 배당의 저평가 알짜 진주입니다.',
  },
  {
    id: 2,
    companyName: '테마바이오홀딩스',
    metrics: {
      per: '적자 (PER 산출불가)',
      pbr: '28.4배 (극단적 고평가)',
      debtRatio: '840% (자본잠식 직전)',
      operatingProfitGrowth: '3년 연속 영업손실',
      dividendYield: '배당 없음',
    },
    isGem: false,
    explanation: '3년 연속 적자에 부채비율 800% 초과인 전형적 상폐 위험주입니다.',
  },
  {
    id: 3,
    companyName: '글로벌엔터플랫폼',
    metrics: {
      per: '11.5배',
      pbr: '1.2배',
      debtRatio: '45%',
      operatingProfitGrowth: '+82% (흑자전환 성공)',
      dividendYield: '배당률 2.1%',
    },
    isGem: true,
    explanation: '확실한 턴어라운드를 기록한 밸류에이션 매력 진주입니다.',
  },
  {
    id: 4,
    companyName: '태양광스펙인베스트',
    metrics: {
      per: '140배',
      pbr: '14.2배',
      debtRatio: '380%',
      operatingProfitGrowth: '-62% (역성장)',
    },
    isGem: false,
    explanation: '영업이익 반토막에도 PER 140배인 위험 테마 거품주입니다.',
  },
  {
    id: 5,
    companyName: '정밀소재화학',
    metrics: {
      per: '7.8배',
      pbr: '0.82배',
      debtRatio: '32%',
      operatingProfitGrowth: '+25% (수익성 개선)',
      dividendYield: '배당률 3.6%',
    },
    isGem: true,
    explanation: '견고한 현금흐름과 안전마진을 확보한 가치투자 진주입니다.',
  },
  {
    id: 6,
    companyName: '초전도테크랩',
    metrics: {
      per: '적자 (매출 1억 미만)',
      pbr: '42.0배 (사상최고 거품)',
      debtRatio: '520%',
      operatingProfitGrowth: '영업현금흐름 마이너스',
      dividendYield: '배당 없음',
    },
    isGem: false,
    explanation: '매출 전무 상태에서 찌라시로 PBR 42배 띄운 작전주입니다.',
  },
  {
    id: 7,
    companyName: '대한물류인프라',
    metrics: {
      per: '8.4배',
      pbr: '0.55배',
      debtRatio: '58%',
      operatingProfitGrowth: '+18% (물동량 증가)',
      dividendYield: '배당률 5.4%',
    },
    isGem: true,
    explanation: '독점 인프라 자산과 5%대 배당을 지급하는 하방 닫힌 가치주입니다.',
  },
  {
    id: 8,
    companyName: '메타버스엔터텍',
    metrics: {
      per: '220배',
      pbr: '19.5배',
      debtRatio: '290%',
      operatingProfitGrowth: '영업이익 -84% 급감',
    },
    isGem: false,
    explanation: '테마 소멸 후 실적 붕괴에도 주가가 과대평가된 위험 종목입니다.',
  },
  {
    id: 9,
    companyName: '케이식품글로벌',
    metrics: {
      per: '12.0배',
      pbr: '1.4배',
      debtRatio: '42%',
      operatingProfitGrowth: '+65% (미국 수출 폭증)',
      dividendYield: '배당률 2.5%',
    },
    isGem: true,
    explanation: '글로벌 수출 호조로 이익 성장이 담보된 성장 진주입니다.',
  },
  {
    id: 10,
    companyName: '코스닥한계기업',
    metrics: {
      per: '적자',
      pbr: '0.4배 (착시 저PBR)',
      debtRatio: '1,200% (자본잠식 위기)',
      operatingProfitGrowth: '5년 연속 적자 지속',
    },
    isGem: false,
    explanation: '저PBR 착시 뒤에 5년 적자와 자본잠식이 숨은 시한폭탄입니다.',
  },
  {
    id: 11,
    companyName: '방산엔지니어링',
    metrics: {
      per: '9.8배',
      pbr: '1.1배',
      debtRatio: '38%',
      operatingProfitGrowth: '+42% (수주잔고 10조)',
      dividendYield: '배당률 2.8%',
    },
    isGem: true,
    explanation: '수주 잔고가 든든하게 실적을 견인하는 저평가 방산주입니다.',
  },
  {
    id: 12,
    companyName: '바이오신약개발원',
    metrics: {
      per: '적자',
      pbr: '15.2배',
      debtRatio: '450%',
      operatingProfitGrowth: '임상 3상 실패 발표',
    },
    isGem: false,
    explanation: '파이프라인 실패로 추가 유상증자가 불가피한 폭락 위험주입니다.',
  },
  {
    id: 13,
    companyName: '고배당금융지주',
    metrics: {
      per: '4.5배',
      pbr: '0.38배',
      debtRatio: '안정 (BIS 15.8%)',
      operatingProfitGrowth: '+12% (안정적 이익)',
      dividendYield: '배당률 7.2%',
    },
    isGem: true,
    explanation: '극단적 저평가와 7%대 배당수익률의 주주환원 대표 알짜주입니다.',
  },
  {
    id: 14,
    companyName: '2차전지잡주',
    metrics: {
      per: '적자',
      pbr: '35.0배',
      debtRatio: '680%',
      operatingProfitGrowth: '신사업 발표 후 실적 전무',
    },
    isGem: false,
    explanation: '본업 부실을 가리고 전환사채만 찍어내는 좀비기업입니다.',
  },
  {
    id: 15,
    companyName: '산업용전력인프라',
    metrics: {
      per: '13.2배',
      pbr: '1.5배',
      debtRatio: '48%',
      operatingProfitGrowth: '+78% (AI 데이터센터 수혜)',
      dividendYield: '배당률 2.0%',
    },
    isGem: true,
    explanation: 'AI 데이터센터 전력망 호황 수혜를 입는 실적 슈퍼사이클주입니다.',
  },
];

export function getRandomFinancialQuestions(count = 5): FinancialQuestion[] {
  const shuffled = [...FINANCIAL_QUESTION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 4-Quadrant Rich Autopsy Comments Pools (Non-overlapping)
// 1. Bull Win (상승장 성공: 풀매수 탑승 or 뚝심 홀딩)
const BULL_WIN_BUY_COMMENTS = [
  '세력의 개미털기 찌라시 비웃으며 바닥 풀매수 박은 야수! 🚀',
  '장대양봉 쏘아 올릴 때 꼭대기까지 야무지게 발라먹은 신들린 타점!',
  '소문에 사서 뉴스에 던진 월가 1급 스캘퍼의 칼타이밍 적중.',
  '악재 찌라시 속보 뜨자마자 "오히려 좋아" 외치고 저점 줍줍 대성공.',
];
const BULL_WIN_HOLD_COMMENTS = [
  '공포에 던지지 않고 끝까지 버텨내 폭등 빔을 정면으로 맞은 강심장! 💎',
  '개미털기 잔파도에 흔들리지 않고 큰 추세를 발라먹은 고수.',
  '심박수 180 찍으면서도 계좌 꽉 쥐고 전고점 돌파 만끽.',
];

// 2. Bull Fail (상승장 실패: 관망 패스 or 폭등 직전 패닉셀)
const BULL_FAIL_SELL_COMMENTS = [
  '폭등 빔 쏘기 0.5초 전에 쫄아서 던지고 피눈물 흘린 인간 지표 🤦‍♂️',
  '익절은 언제나 옳다며 0.3% 먹고 팔았더니 +40% 날아감 😭',
  '세력 형님들 밥상 다 차려놨는데 혼자 숟가락 던지고 도망침.',
];
const BULL_FAIL_PASS_COMMENTS = [
  '남들 잔치국수 먹을 때 밖에서 차트만 째려보다 손가락 빤 관망러 👀',
  '호재 속보 다 뜨고 꼭대기 도달해서야 침 흘리며 구경만 함.',
  '친구가 살 때 같이 샀으면 인생 바뀌었을 텐데 또 의심하다 놓침.',
];

// 3. Bear Win (하락장 성공: 악재 칼손절 or 쿨한 현금 관망)
const BEAR_WIN_SELL_COMMENTS = [
  '악재 속보 뜨자마자 비상탈출 버튼 연타해 원금 100% 사수한 생존왕 🛡️',
  '세력의 마지막 설거지 가짜 호재 냄새 맡고 1초 만에 손절 친 냉혈한.',
  '계좌 깡통 찰 뻔한 위기를 칼 같은 손절로 멱살 잡고 살려냄.',
];
const BEAR_WIN_PASS_COMMENTS = [
  '지하실 밑에 마그마 뚫리는 거 팝콘 먹으며 유유히 관망 🧘',
  '가짜 반등 낚시(데드캣)에 절대 안 속고 시드 온전히 지켜냄.',
  '오늘 밤 발 뻗고 편안하게 숙면 취할 자격 있는 유일한 생존자.',
];

// 4. Bear Fail (하락장 실패: 고점 불나방 매수 or 폭락 빔 방치)
const BEAR_FAIL_BUY_COMMENTS = [
  '가짜 호재 꼭대기 상투 잡고 세력 설거지 물량 온몸으로 받아냄 💀',
  '작전 세력이 판 꿀단지에 대가리 박고 영혼까지 털린 불나방.',
  '"이번엔 진짜 반등이다" 외치며 떨어지는 칼날 맨손으로 덥석 쥠.',
];
const BEAR_FAIL_HOLD_COMMENTS = [
  '장대음봉 마이너스 꽂히는데 두 손 모아 기도 매매하다 계좌 파열 💀',
  '물타기 하다가 평단가만 낮추고 비중 100% 강제 장기투자형 수감.',
  '탈출 버튼 안 누르고 멍하니 구경하다 계좌 반토막 직격탄.',
];

// Evaluate Chart result (with Clear Headline, Outcome & 4-Quadrant Logic)
export function evaluateChartGame(
  scenario: ChartScenario,
  initialCash: number,
  finalAsset: number,
  trades: TradeAction[]
): ChartGameResult {
  const returnRate = Math.round(((finalAsset - initialCash) / initialCash) * 1000) / 10;

  let score = 50 + Math.round(returnRate * 0.8);
  score = Math.max(10, Math.min(99, score));

  let earnedExp = 35;
  let tierTitle = '🥈 평범한 개미 투자자';
  let verdictComment = '차트 흐름에 휩쓸려 무난한 수익률을 기록했습니다.';

  if (returnRate >= 50) {
    earnedExp = 65;
    tierTitle = '🔥 전설의 야수 월가 스캘퍼 (대승리)';
    verdictComment = '속보 찌라시와 세력의 낚시를 귀신같이 간파하고 최고점에서 익절했습니다.';
  } else if (returnRate >= 15) {
    earnedExp = 45;
    tierTitle = '🥇 날카로운 정보 스캘퍼 (승리)';
    verdictComment = '가짜뉴스에 흔들리지 않고 진짜 호재 파동만 골라 타는 실력파입니다.';
  } else if (returnRate >= 0) {
    earnedExp = 25;
    tierTitle = '🧘 멘탈 갑 생존 전문가 (원금 사수)';
    verdictComment = '험악한 찌라시 장세 속에서도 최소한 깡통은 안 차고 살아남았습니다.';
  } else if (returnRate > -20) {
    earnedExp = -15;
    tierTitle = '🗿 찌라시 팔랑귀 물타기러 (손실 경고)';
    verdictComment = '속보 뜰 때마다 뇌동매매로 고점에 물리고 공포에 투매했습니다.';
  } else {
    earnedExp = -35;
    tierTitle = '💀 영혼까지 털린 흑우 지표 (강등 위험)';
    verdictComment = '가짜뉴스엔 꼭대기 매수, 진짜 악재엔 기도 매매로 계좌가 반토막 났습니다.';
  }

  const autopsies: NewsAutopsy[] = scenario.events.map((evt, idx) => {
    const windowStart = evt.second - 1;
    const windowEnd = evt.second + evt.duration + 2;

    // Check user trades inside the event window
    const tradesInWindow = trades.filter((t) => t.second >= windowStart && t.second <= windowEnd);
    const boughtInWindow = tradesInWindow.some((t) => t.type === 'BUY');
    const soldInWindow = tradesInWindow.some((t) => t.type === 'SELL');

    // Check position held entering this event
    const tradesPrior = trades.filter((t) => t.second < windowStart);
    let sharesHeldPrior = 0;
    tradesPrior.forEach((t) => {
      if (t.type === 'BUY') sharesHeldPrior += 1;
      else if (t.type === 'SELL') sharesHeldPrior = 0;
    });
    const isHoldingStock = sharesHeldPrior > 0;

    let verdictType: 'GENIUS' | 'DEFENSE' | 'PASS' | 'BLACK_COW' = 'PASS';
    let verdictLabel = '👀 관망 패스';
    let userAction = '현금 100% 관망';
    let comment = '';

    if (evt.isBullish) {
      // Market Surged
      if (boughtInWindow) {
        verdictType = 'GENIUS';
        verdictLabel = '💎 신의 한 수';
        userAction = '속보 보고 과감한 풀매수 탑승';
        comment = BULL_WIN_BUY_COMMENTS[idx % BULL_WIN_BUY_COMMENTS.length];
      } else if (soldInWindow) {
        verdictType = 'BLACK_COW';
        verdictLabel = '💀 흑우 물림';
        userAction = '폭등 빔 직전에 쫄아서 전량 손절';
        comment = BULL_FAIL_SELL_COMMENTS[idx % BULL_FAIL_SELL_COMMENTS.length];
      } else if (isHoldingStock) {
        verdictType = 'GENIUS';
        verdictLabel = '💎 뚝심 홀딩';
        userAction = '흔들기에도 뚝심 홀딩 (수익 극대화)';
        comment = BULL_WIN_HOLD_COMMENTS[idx % BULL_WIN_HOLD_COMMENTS.length];
      } else {
        verdictType = 'PASS';
        verdictLabel = '👀 관망 패스';
        userAction = '현금 100% 상태로 관망 (매수 안 함)';
        comment = BULL_FAIL_PASS_COMMENTS[idx % BULL_FAIL_PASS_COMMENTS.length];
      }
    } else {
      // Market Crashed / Dropped
      if (soldInWindow) {
        verdictType = 'DEFENSE';
        verdictLabel = '🛡️ 칼손절 방어';
        userAction = '악재 속보 보고 1초 만에 비상탈출';
        comment = BEAR_WIN_SELL_COMMENTS[idx % BEAR_WIN_SELL_COMMENTS.length];
      } else if (boughtInWindow) {
        verdictType = 'BLACK_COW';
        verdictLabel = '💀 흑우 물림';
        userAction = '세력 낚시에 상투 잡고 풀매수';
        comment = BEAR_FAIL_BUY_COMMENTS[idx % BEAR_FAIL_BUY_COMMENTS.length];
      } else if (isHoldingStock) {
        verdictType = 'BLACK_COW';
        verdictLabel = '💀 기도매매 물림';
        userAction = '폭락 빔을 팔지 못하고 방치';
        comment = BEAR_FAIL_HOLD_COMMENTS[idx % BEAR_FAIL_HOLD_COMMENTS.length];
      } else {
        verdictType = 'DEFENSE';
        verdictLabel = '🛡️ 쿨한 관망 방어';
        userAction = '현금 쥐고 폭락장 팝콘 관망';
        comment = BEAR_WIN_PASS_COMMENTS[idx % BEAR_WIN_PASS_COMMENTS.length];
      }
    }

    return {
      second: evt.second,
      eventHeadline: evt.headline,
      marketOutcome: evt.outcomeTitle,
      userAction,
      verdictType,
      verdictLabel,
      comment: `“${comment}”`,
    };
  });

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    period: scenario.period,
    initialCash,
    finalAsset,
    totalReturnRate: returnRate,
    tradeCount: trades.length,
    trades,
    tierTitle,
    verdictComment,
    autopsies,
    score,
    earnedExp,
  };
}

export function evaluateCertificate(
  progress: UserProgress,
  chartScore: number,
  dartScore: number,
  financeScore: number
): AcademyCertificate {
  const avg = Math.round(chartScore * 0.4 + dartScore * 0.3 + financeScore * 0.3);

  const toGrade = (score: number) => {
    if (score >= 85) return 'S';
    if (score >= 70) return 'A';
    if (score >= 50) return 'B';
    if (score >= 35) return 'C';
    return 'F';
  };

  const chartGrade = toGrade(chartScore);
  const dartGrade = toGrade(dartScore);
  const financeGrade = toGrade(financeScore);

  let summaryComment = '차트 순발력, 공시 독해력, 재무 분석력까지 삼위일체를 완성한 괴물. 지금 즉시 실전 월가로 출진하십시오.';
  let recommendedStock = {
    ticker: 'NVDA',
    name: '엔비디아 (NVDA)',
    reason: '고난도 파동 속에서도 성장성을 꿰뚫는 참모총장 맞춤 주도주',
  };

  if (progress.level <= 2) {
    summaryComment = '가짜 공시에 낚이고 매매 타이밍이 흔들리는 신규 훈련병. 꾸준한 모의 훈련으로 경험치를 쌓으세요!';
    recommendedStock = {
      ticker: 'VOO',
      name: '뱅가드 S&P500 ETF',
      reason: '직접 매매 대신 미국 우량 500개 기업에 분산투자하는 부처 펀드',
    };
  } else if (progress.level <= 4) {
    summaryComment = '위험한 장세에서 살아남는 끈질긴 생명력 보유. 재무제표 옥석 가리기만 조금 더 보강하면 장군 진급 가능!';
    recommendedStock = {
      ticker: 'TSLA',
      name: '테슬라 (TSLA)',
      reason: '변동성을 온몸으로 즐기며 단련하는 국민 애증주',
    };
  }

  return {
    rankTitle: `Lv.${progress.level} ${progress.rankTitle}`,
    rankBadge: progress.rankBadge,
    level: progress.level,
    totalScore: avg,
    chartGrade,
    dartGrade,
    financeGrade,
    summaryComment,
    recommendedStock,
  };
}
