export const DART_TIMER_CONFIG = {
  MAX_SECONDS: 10,
  WARNING_THRESHOLD_SECONDS: 3,
} as const;

/**
 * Calculates remaining percentage (0-100%) for countdown gauge bar
 */
export function calculateProgressPercentage(
  timeLeft: number,
  maxSeconds: number = DART_TIMER_CONFIG.MAX_SECONDS
): number {
  if (maxSeconds <= 0) return 0;
  const clamped = Math.max(0, Math.min(timeLeft, maxSeconds));
  return Math.round((clamped / maxSeconds) * 100);
}

/**
 * Checks whether timer has entered critical warning zone (<= 3s)
 */
export function isTimerWarning(
  timeLeft: number,
  threshold: number = DART_TIMER_CONFIG.WARNING_THRESHOLD_SECONDS
): boolean {
  return timeLeft <= threshold && timeLeft > 0;
}

/**
 * Formats seconds left for user display
 */
export function formatSecondsLeft(seconds: number): string {
  const clamped = Math.max(0, Math.ceil(seconds));
  return `${clamped}초`;
}
