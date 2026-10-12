// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import {
  drawCertificateToCanvas,
  generateCertificateDataUrl,
  downloadCertificateImage,
  CertificateCanvasOptions,
} from '../certificateUtils';

describe('certificateUtils', () => {
  const mockOptions: CertificateCanvasOptions = {
    serialNumber: '2026-TOSS-TEST',
    rankTitle: '1성 장군',
    rankBadge: '⚡ 실전 야전 사령관',
    totalScore: 92,
    chartGrade: 'S',
    dartGrade: 'A',
    financeGrade: 'S',
    userName: '김토스',
    summaryComment: '월가 세력의 심리를 꿰뚫어본 불세출의 투자 명장입니다.',
  };

  it('draws certificate onto canvas and sets expected dimensions', () => {
    const canvas = document.createElement('canvas');
    drawCertificateToCanvas(canvas, mockOptions);

    expect(canvas.width).toBe(600);
    expect(canvas.height).toBe(800);
  });

  it('accepts custom dimensions', () => {
    const canvas = document.createElement('canvas');
    drawCertificateToCanvas(canvas, { ...mockOptions, width: 800, height: 1000 });

    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(1000);
  });

  it('generates a valid data URL', () => {
    const canvas = document.createElement('canvas');
    const dataUrl = generateCertificateDataUrl(canvas, mockOptions);

    expect(typeof dataUrl).toBe('string');
    expect(dataUrl.startsWith('data:image/png')).toBe(true);
  });

  it('handles downloadCertificateImage click trigger safely', () => {
    const canvas = document.createElement('canvas');
    const clickSpy = vi.fn();
    const origCreateElement = document.createElement.bind(document);

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = origCreateElement(tagName);
      if (tagName.toLowerCase() === 'a') {
        el.click = clickSpy;
      }
      return el;
    });

    const success = downloadCertificateImage(canvas, 'test-cert.png');
    expect(success).toBe(true);
    expect(clickSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
