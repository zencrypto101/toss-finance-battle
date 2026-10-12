import React, { useRef, useEffect } from 'react';
import { AcademyCertificate } from './types';
import { Award, Share2, Copy, ExternalLink, Sparkles, ShieldCheck, Download } from 'lucide-react';
import { drawCertificateToCanvas, downloadCertificateImage } from './utils/certificateUtils';

interface CertificateProps {
  cert: AcademyCertificate;
  onShare: () => void;
  onCopyCommunity: () => void;
  onRestart: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({
  cert,
  onShare,
  onCopyCommunity,
  onRestart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawCertificateToCanvas(canvasRef.current, {
        serialNumber: '2026-TOSS-0892',
        rankTitle: cert.rankTitle,
        rankBadge: cert.rankBadge,
        totalScore: cert.totalScore,
        chartGrade: cert.chartGrade,
        dartGrade: cert.dartGrade,
        financeGrade: cert.financeGrade,
        userName: '대한민국 정예 사관생도',
        summaryComment: cert.summaryComment,
      });
    }
  }, [cert]);

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCertificateImage(canvasRef.current, `investment-academy-${cert.rankTitle}.png`);
    }
  };
  return (
    <div className="fade-in" style={{ paddingTop: 10 }}>
      {/* Official Certificate Card */}
      <div
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
          border: '2px solid #b8860b',
          borderRadius: 22,
          padding: '24px 20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        {/* Top Gold Header */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid #e5e8eb', paddingBottom: 14 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#b8860b', fontSize: 12, fontWeight: 900, letterSpacing: 1.5 }}>
            <Award size={16} /> REPUBLIC OF KOREA INVESTMENT ACADEMY
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#191f28', marginTop: 4 }}>
            투자사관학교 공식 임관장
          </h1>
          <div style={{ fontSize: 12, color: '#8b95a1', marginTop: 2 }}>
            제 2026-TOSS-0892호
          </div>
        </div>

        {/* Rank & Badge */}
        <div style={{ textAlign: 'center', margin: '20px 0 16px' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#feebee',
              color: '#f04452',
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 8,
              marginBottom: 6,
            }}
          >
            {cert.rankBadge}
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#191f28', letterSpacing: -0.5 }}>
            {cert.rankTitle}
          </h2>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#f04452', marginTop: 6 }}>
            종합 훈련 점수 {cert.totalScore}점
          </div>
        </div>

        {/* Detailed Report Card */}
        <div
          style={{
            backgroundColor: '#f9fafb',
            borderRadius: 14,
            padding: 14,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8,
            textAlign: 'center',
            border: '1px solid #e5e8eb',
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: '#8b95a1', fontWeight: 700 }}>차트 돌격력</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#f04452', marginTop: 2 }}>
              {cert.chartGrade}
            </div>
          </div>
          <div style={{ borderLeft: '1px solid #e5e8eb', borderRight: '1px solid #e5e8eb' }}>
            <div style={{ fontSize: 11, color: '#8b95a1', fontWeight: 700 }}>공시 분석력</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#3182f6', marginTop: 2 }}>
              {cert.dartGrade}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#8b95a1', fontWeight: 700 }}>재무 건전성</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#04b067', marginTop: 2 }}>
              {cert.financeGrade}
            </div>
          </div>
        </div>

        {/* Summary Comment */}
        <div
          style={{
            backgroundColor: '#f2f4f6',
            borderRadius: 12,
            padding: 12,
            fontSize: 13,
            color: '#333d4b',
            lineHeight: 1.5,
            fontStyle: 'italic',
            textAlign: 'center',
            marginBottom: 14,
          }}
        >
          “{cert.summaryComment}”
        </div>

        {/* Seal */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 11, color: '#8b95a1', fontWeight: 700 }}>
            대한민국 투자사관학교장 인
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: '2px solid #f04452',
              color: '#f04452',
              fontSize: 11,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            證
          </div>
        </div>
      </div>

      {/* Recommended Stock Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          padding: 16,
          border: '1px solid #e5e8eb',
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, color: '#8b95a1', marginBottom: 4 }}>
          🔥 사관학교장 추천 맞춤 종목 (토스증권 딥링크)
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (window.toss?.openURL) {
              window.toss.openURL(`supertoss://stock/${cert.recommendedStock.ticker}`);
            } else {
              window.open(`https://tossinvest.com/stocks/${cert.recommendedStock.ticker}`, '_blank');
            }
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#191f28' }}>
              {cert.recommendedStock.name}
            </div>
            <div style={{ fontSize: 12, color: '#4e5968', marginTop: 2 }}>
              {cert.recommendedStock.reason}
            </div>
          </div>
          <ExternalLink size={18} color="#8b95a1" />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Hidden Canvas for High-Res PNG Synthesis */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <button
          type="button"
          data-testid="download-cert-btn"
          onClick={handleDownload}
          className="btn-stock-red"
          style={{
            backgroundColor: '#191f28',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(25, 31, 40, 0.25)',
          }}
        >
          <Download size={18} style={{ marginRight: 8 }} />
          공식 임관장 고화질 이미지 다운로드 (PNG)
        </button>

        <button
          type="button"
          onClick={onShare}
          className="btn-stock-red"
        >
          <Share2 size={18} style={{ marginRight: 8 }} />
          내 계급장 공유하고 단톡방 서열 맞짱뜨기
        </button>

        <button
          type="button"
          onClick={onCopyCommunity}
          className="btn-ghost"
        >
          <Copy size={15} style={{ marginRight: 6 }} /> 토스증권 종목 토론방에 계급장 자랑하기 (복사)
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="btn-ghost"
        >
          사관학교 메인 로비로 돌아가기
        </button>
      </div>
    </div>
  );
};
