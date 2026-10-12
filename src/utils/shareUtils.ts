import { ChartGameResult } from '../types';

export const TOAST_MESSAGES = {
  COPY_SUCCESS: '결과 링크가 클립보드에 복사되었습니다! 친구에게 배틀을 신청해보세요.',
  COPY_FALLBACK: '공유 링크가 생성되었습니다.',
  COPY_FAIL: '링크 복사에 실패했습니다. 브라우저 설정을 확인해주세요.',
} as const;

export type ToastMessageType = typeof TOAST_MESSAGES[keyof typeof TOAST_MESSAGES];

/**
 * Builds the battle challenge share URL for a chart game result
 */
export function generateChartResultShareUrl(
  result: Pick<ChartGameResult, 'scenarioId' | 'score' | 'tierTitle' | 'totalReturnRate'>,
  baseUrl = 'https://toss.im/battle'
): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('host', '차트사관생도');
    url.searchParams.set('score', String(result.score));
    url.searchParams.set('rank', result.tierTitle);
    url.searchParams.set('returnRate', String(result.totalReturnRate));
    if (result.scenarioId) {
      url.searchParams.set('scenario', result.scenarioId);
    }
    return url.toString();
  } catch {
    const searchParams = new URLSearchParams({
      host: '차트사관생도',
      score: String(result.score),
      rank: result.tierTitle,
      returnRate: String(result.totalReturnRate),
      ...(result.scenarioId ? { scenario: result.scenarioId } : {}),
    });
    return `${baseUrl}?${searchParams.toString()}`;
  }
}

/**
 * Builds share snippet text for messengers (e.g. KakaoTalk, SMS)
 */
export function generateChartResultShareText(
  result: Pick<ChartGameResult, 'scenarioName' | 'totalReturnRate' | 'score' | 'tierTitle'>,
  shareUrl: string
): string {
  const sign = result.totalReturnRate >= 0 ? '+' : '';
  return `[투자사관학교 차트 훈련 결과]\n📊 종목: ${result.scenarioName}\n📈 수익률: ${sign}${result.totalReturnRate}%\n🎖️ 계급: ${result.tierTitle} (${result.score}점)\n도전 링크: ${shareUrl}`;
}

/**
 * Safely copies text to clipboard with graceful fallbacks
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Proceed to fallback
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (success) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return false;
}
