export interface CertificateCanvasOptions {
  width?: number;
  height?: number;
  serialNumber: string;
  rankTitle: string;
  rankBadge: string;
  totalScore: number;
  chartGrade: string;
  dartGrade: string;
  financeGrade: string;
  userName?: string;
  summaryComment: string;
}

/**
 * Renders an official certificate onto an HTML5 Canvas element
 */
export function drawCertificateToCanvas(
  canvas: HTMLCanvasElement,
  options: CertificateCanvasOptions
): void {
  const w = options.width || 600;
  const h = options.height || 800;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // Border (Gold decorative double border)
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  ctx.strokeStyle = '#191f28';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  // Header
  ctx.fillStyle = '#b8860b';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('REPUBLIC OF KOREA INVESTMENT ACADEMY', w / 2, 70);

  ctx.fillStyle = '#191f28';
  ctx.font = '900 28px sans-serif';
  ctx.fillText('투자사관학교 공식 임관장', w / 2, 115);

  ctx.fillStyle = '#8b95a1';
  ctx.font = '500 13px sans-serif';
  ctx.fillText(`발급번호: ${options.serialNumber}`, w / 2, 140);

  // Divider line
  ctx.strokeStyle = '#e5e8eb';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 165);
  ctx.lineTo(w - 60, 165);
  ctx.stroke();

  // User & Rank
  const displayName = options.userName || '정예 사관생도';
  ctx.fillStyle = '#4e5968';
  ctx.font = '600 15px sans-serif';
  ctx.fillText(`수료자: ${displayName}`, w / 2, 205);

  ctx.fillStyle = '#f04452';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(options.rankBadge, w / 2, 238);

  ctx.fillStyle = '#191f28';
  ctx.font = '900 34px sans-serif';
  ctx.fillText(options.rankTitle, w / 2, 280);

  ctx.fillStyle = '#f04452';
  ctx.font = '900 22px sans-serif';
  ctx.fillText(`종합 훈련 점수: ${options.totalScore}점`, w / 2, 320);

  // Report Card Box
  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(60, 350, w - 120, 105);
  ctx.strokeStyle = '#e5e8eb';
  ctx.strokeRect(60, 350, w - 120, 105);

  // 3 Subjects
  const colW = (w - 120) / 3;
  const labels = ['차트 돌격력', '공시 분석력', '재무 건전성'];
  const grades = [options.chartGrade, options.dartGrade, options.financeGrade];
  const colors = ['#f04452', '#3182f6', '#04b067'];

  for (let i = 0; i < 3; i++) {
    const colX = 60 + colW * i + colW / 2;
    ctx.fillStyle = '#8b95a1';
    ctx.font = '700 13px sans-serif';
    ctx.fillText(labels[i], colX, 385);

    ctx.fillStyle = colors[i];
    ctx.font = '900 24px sans-serif';
    ctx.fillText(grades[i], colX, 425);
  }

  // Summary Comment Box
  ctx.fillStyle = '#f2f4f6';
  ctx.fillRect(60, 480, w - 120, 75);
  ctx.fillStyle = '#333d4b';
  ctx.font = 'italic 500 13px sans-serif';
  ctx.fillText(`"${options.summaryComment}"`, w / 2, 525);

  // Seal / Sign
  ctx.textAlign = 'right';
  ctx.fillStyle = '#8b95a1';
  ctx.font = '700 14px sans-serif';
  ctx.fillText('대한민국 투자사관학교장 인', w - 125, 680);

  // Red Seal stamp
  ctx.strokeStyle = '#f04452';
  ctx.lineWidth = 3;
  ctx.strokeRect(w - 110, 650, 44, 44);
  ctx.fillStyle = '#f04452';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('證', w - 88, 680);
}

/**
 * Synthesizes canvas and exports PNG data URL
 */
export function generateCertificateDataUrl(
  canvas: HTMLCanvasElement,
  options: CertificateCanvasOptions
): string {
  drawCertificateToCanvas(canvas, options);
  return canvas.toDataURL('image/png');
}

/**
 * Triggers native image download in browser
 */
export function downloadCertificateImage(
  canvas: HTMLCanvasElement,
  fileName = 'investment-academy-certificate.png'
): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch {
    return false;
  }
}
