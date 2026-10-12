// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateChartResultShareUrl,
  generateChartResultShareText,
  copyToClipboard,
  TOAST_MESSAGES,
} from '../shareUtils';

describe('generateChartResultShareUrl', () => {
  it('generates valid url with encoded query parameters', () => {
    const mockResult = {
      scenarioId: 'gme-2021',
      score: 85,
      tierTitle: '전설의 야수 사령관',
      totalReturnRate: 24.5,
    };

    const urlString = generateChartResultShareUrl(mockResult, 'https://test.toss.im/battle');
    const url = new URL(urlString);

    expect(url.origin).toBe('https://test.toss.im');
    expect(url.pathname).toBe('/battle');
    expect(url.searchParams.get('score')).toBe('85');
    expect(url.searchParams.get('rank')).toBe('전설의 야수 사령관');
    expect(url.searchParams.get('returnRate')).toBe('24.5');
    expect(url.searchParams.get('scenario')).toBe('gme-2021');
    expect(url.searchParams.get('host')).toBe('차트사관생도');
  });

  it('uses default toss battle baseUrl when not provided', () => {
    const mockResult = {
      scenarioId: 'tsla-2020',
      score: 90,
      tierTitle: '대령 (연대장)',
      totalReturnRate: -5.2,
    };

    const urlString = generateChartResultShareUrl(mockResult);
    expect(urlString).toContain('https://toss.im/battle');
    expect(urlString).toContain('returnRate=-5.2');
  });
});

describe('generateChartResultShareText', () => {
  it('formats positive return rate with + sign', () => {
    const mockResult = {
      scenarioName: '게임스탑 (GME)',
      totalReturnRate: 15.5,
      score: 92,
      tierTitle: '수석 참모총장',
    };

    const shareUrl = 'https://toss.im/battle?score=92';
    const text = generateChartResultShareText(mockResult, shareUrl);

    expect(text).toContain('📊 종목: 게임스탑 (GME)');
    expect(text).toContain('📈 수익률: +15.5%');
    expect(text).toContain('🎖️ 계급: 수석 참모총장 (92점)');
    expect(text).toContain(`도전 링크: ${shareUrl}`);
  });

  it('formats negative return rate without extra + sign', () => {
    const mockResult = {
      scenarioName: '에코프로 (2023)',
      totalReturnRate: -12.4,
      score: 45,
      tierTitle: '훈련병',
    };

    const shareUrl = 'https://toss.im/battle?score=45';
    const text = generateChartResultShareText(mockResult, shareUrl);

    expect(text).toContain('📈 수익률: -12.4%');
    expect(text).toContain('🎖️ 계급: 훈련병 (45점)');
  });
});

describe('copyToClipboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true when navigator.clipboard.writeText succeeds', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    const result = await copyToClipboard('test copy content');
    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('test copy content');
  });

  it('falls back to document.execCommand when navigator.clipboard fails', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Clipboard permission denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    const execCommandMock = vi.fn().mockReturnValue(true);
    document.execCommand = execCommandMock;

    const result = await copyToClipboard('fallback copy content');
    expect(result).toBe(true);
    expect(execCommandMock).toHaveBeenCalledWith('copy');
  });

  it('returns false when both clipboard methods fail', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('Fail')) },
      configurable: true,
      writable: true,
    });
    document.execCommand = vi.fn().mockReturnValue(false);

    const result = await copyToClipboard('failing copy content');
    expect(result).toBe(false);
  });
});

describe('TOAST_MESSAGES', () => {
  it('contains expected standard feedback strings', () => {
    expect(TOAST_MESSAGES.COPY_SUCCESS).toContain('클립보드에 복사되었습니다');
    expect(TOAST_MESSAGES.COPY_FAIL).toContain('실패했습니다');
  });
});
