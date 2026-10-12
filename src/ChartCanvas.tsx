import React from 'react';
import { CandlePoint, TradeAction, NewsEvent } from './types';

interface ChartCanvasProps {
  candles: CandlePoint[];
  currentTick: number; // 1 ~ 30
  userTrades: TradeAction[];
  events?: NewsEvent[];
  opponentTrades?: TradeAction[];
  isFinished?: boolean;
}

export const ChartCanvas: React.FC<ChartCanvasProps> = ({
  candles,
  currentTick,
  userTrades,
  events = [],
  opponentTrades,
  isFinished = false,
}) => {
  const visibleCandles = candles.slice(0, currentTick);
  if (visibleCandles.length === 0) return null;

  const width = 360;
  const height = 230;
  const padTop = 32;
  const padBottom = 32;
  const padLeft = 16;
  const padRight = 16;

  // Min and max price across full 30 candles
  const allPrices = candles.flatMap((c) => [c.low, c.high]);
  const minPrice = Math.min(...allPrices) * 0.94;
  const maxPrice = Math.max(...allPrices) * 1.06;
  const priceRange = maxPrice - minPrice || 1;

  const getX = (index: number) => {
    return padLeft + (index / (candles.length - 1)) * (width - padLeft - padRight);
  };

  const getY = (price: number) => {
    return height - padBottom - ((price - minPrice) / priceRange) * (height - padTop - padBottom);
  };

  // Line path
  const linePath = visibleCandles
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.close)}`)
    .join(' ');

  const areaPath = `${linePath} L ${getX(visibleCandles.length - 1)} ${height - padBottom} L ${getX(0)} ${height - padBottom} Z`;

  const lastCandle = visibleCandles[visibleCandles.length - 1];
  const lastX = getX(visibleCandles.length - 1);
  const lastY = getY(lastCandle.close);
  const isUp =
    lastCandle.close >=
    (visibleCandles.length > 1 ? visibleCandles[visibleCandles.length - 2].close : lastCandle.open);

  return (
    <div style={{ width: '100%', position: 'relative', overflow: 'hidden', borderRadius: 16 }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block', background: '#ffffff' }}
      >
        <defs>
          <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp ? '#f04452' : '#3182f6'} stopOpacity="0.2" />
            <stop offset="100%" stopColor={isUp ? '#f04452' : '#3182f6'} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={padLeft} y1={padTop} x2={width - padRight} y2={padTop} stroke="#f2f4f6" strokeDasharray="3 3" />
        <line x1={padLeft} y1={height / 2} x2={width - padRight} y2={height / 2} stroke="#f2f4f6" strokeDasharray="3 3" />
        <line x1={padLeft} y1={height - padBottom} x2={width - padRight} y2={height - padBottom} stroke="#e5e8eb" />

        {/* Event Markers (Vertical Dashed Lines) */}
        {events.map((evt, idx) => {
          if (evt.second > currentTick && !isFinished) return null;
          const ex = getX(evt.second - 1);
          return (
            <g key={`event-marker-${idx}`}>
              <line
                x1={ex}
                y1={padTop - 8}
                x2={ex}
                y2={height - padBottom}
                stroke="#ff8f00"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <rect x={ex - 18} y={padTop - 18} width="36" height="14" rx="4" fill="#fff3e0" stroke="#ff8f00" strokeWidth="1" />
              <text x={ex} y={padTop - 8} fill="#e65100" fontSize="8" fontWeight="800" textAnchor="middle">
                🚨속보
              </text>
            </g>
          );
        })}

        {/* Gradient Area */}
        <path d={areaPath} fill="url(#chartAreaGrad)" />

        {/* Candle sticks */}
        {visibleCandles.map((c, idx) => {
          const cx = getX(idx);
          const cyOpen = getY(c.open);
          const cyClose = getY(c.close);
          const cyHigh = getY(c.high);
          const cyLow = getY(c.low);
          const candleUp = c.close >= c.open;
          const color = candleUp ? '#f04452' : '#3182f6';
          const bodyTop = Math.min(cyOpen, cyClose);
          const bodyHeight = Math.max(2, Math.abs(cyClose - cyOpen));

          return (
            <g key={idx}>
              <line x1={cx} y1={cyHigh} x2={cx} y2={cyLow} stroke={color} strokeWidth="1.2" />
              <rect
                x={cx - 3.5}
                y={bodyTop}
                width="7"
                height={bodyHeight}
                fill={color}
                rx="1"
              />
            </g>
          );
        })}

        {/* Real-time Line */}
        <path d={linePath} fill="none" stroke={isUp ? '#f04452' : '#3182f6'} strokeWidth="2.4" strokeLinecap="round" />

        {/* Current Head Pulse */}
        <circle cx={lastX} cy={lastY} r="4.5" fill={isUp ? '#f04452' : '#3182f6'} />
        <circle cx={lastX} cy={lastY} r="8.5" fill={isUp ? '#f04452' : '#3182f6'} opacity="0.3">
          <animate attributeName="r" values="4.5;11;4.5" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.2s" repeatCount="indefinite" />
        </circle>

        {/* User Trades */}
        {userTrades.map((t, idx) => {
          if (t.second > currentTick) return null;
          const tx = getX(t.second - 1);
          const ty = getY(t.price);
          const isBuy = t.type === 'BUY';
          return (
            <g key={`user-trade-${idx}`}>
              <line
                x1={tx}
                y1={ty}
                x2={tx}
                y2={ty + (isBuy ? 18 : -18)}
                stroke={isBuy ? '#f04452' : '#3182f6'}
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle cx={tx} cy={ty} r="5" fill={isBuy ? '#f04452' : '#3182f6'} stroke="#fff" strokeWidth="1.5" />
              <rect
                x={tx - 18}
                y={ty + (isBuy ? 14 : -28)}
                width="36"
                height="15"
                rx="4"
                fill={isBuy ? '#f04452' : '#3182f6'}
              />
              <text
                x={tx}
                y={ty + (isBuy ? 25 : -17)}
                fill="#fff"
                fontSize="9"
                fontWeight="800"
                textAnchor="middle"
              >
                {isBuy ? '매수' : '매도'}
              </text>
            </g>
          );
        })}

        {/* Opponent Trades in Mirror Battle */}
        {opponentTrades &&
          opponentTrades.map((t, idx) => {
            const tx = getX(t.second - 1);
            const ty = getY(t.price);
            const isBuy = t.type === 'BUY';
            return (
              <g key={`opp-trade-${idx}`}>
                <circle cx={tx} cy={ty} r="4" fill="#8b95a1" stroke="#fff" strokeWidth="1.5" />
                <rect
                  x={tx - 20}
                  y={ty + (isBuy ? -26 : 14)}
                  width="40"
                  height="14"
                  rx="4"
                  fill="#4e5968"
                />
                <text
                  x={tx}
                  y={ty + (isBuy ? -16 : 24)}
                  fill="#fff"
                  fontSize="8"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  친구 {isBuy ? '매수' : '매도'}
                </text>
              </g>
            );
          })}
      </svg>
    </div>
  );
};
