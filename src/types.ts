export interface CandlePoint {
  time: number;
  price: number;
  open: number;
  close: number;
  high: number;
  low: number;
  newsMarker?: string;
}

export interface NewsEvent {
  second: number;
  duration: number;
  headline: string;
  category: '호재?' | '악재?' | '찌라시';
  badge: string;
  isBullish: boolean;
  isTrap: boolean;
  outcomeTitle: string;
  outcomeDetail: string;
}

export interface TradeAction {
  second: number;
  type: 'BUY' | 'SELL';
  price: number;
  newsContext?: string;
}

export interface ChartScenario {
  id: string;
  name: string;
  period: string;
  description: string;
  badge: string;
  basePrice: number;
  candles: CandlePoint[];
  events: NewsEvent[];
}

export interface NewsAutopsy {
  second: number;
  eventHeadline: string;
  marketOutcome: string;
  userAction: string;
  verdictType: 'GENIUS' | 'DEFENSE' | 'PASS' | 'BLACK_COW';
  verdictLabel: string;
  comment: string;
}

export interface ChartGameResult {
  scenarioId: string;
  scenarioName: string;
  period: string;
  initialCash: number;
  finalAsset: number;
  totalReturnRate: number;
  tradeCount: number;
  trades: TradeAction[];
  tierTitle: string;
  verdictComment: string;
  autopsies: NewsAutopsy[];
  score: number;
  earnedExp: number;
}

export interface DartQuestion {
  id: number;
  company: string;
  title: string;
  isGoodNews: boolean;
  explanation: string;
}

export interface FinancialQuestion {
  id: number;
  companyName: string;
  metrics: {
    per: string;
    pbr: string;
    debtRatio: string;
    operatingProfitGrowth: string;
    dividendYield?: string;
  };
  isGem: boolean;
  explanation: string;
}

export interface UserProgress {
  level: number;
  currentExp: number;
  maxExp: number;
  rankTitle: string;
  rankBadge: string;
  totalGamesPlayed: number;
  winCount: number;
}

export interface AcademyCertificate {
  rankTitle: string;
  rankBadge: string;
  level: number;
  totalScore: number;
  chartGrade: string;
  dartGrade: string;
  financeGrade: string;
  summaryComment: string;
  recommendedStock: {
    ticker: string;
    name: string;
    reason: string;
  };
}

export interface BattleMirrorData {
  hostName: string;
  hostRank: string;
  hostScore: number;
  hostReturnRate?: number;
}
