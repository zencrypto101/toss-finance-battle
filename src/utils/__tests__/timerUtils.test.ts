import { describe, it, expect } from 'vitest';
import {
  DART_TIMER_CONFIG,
  calculateProgressPercentage,
  isTimerWarning,
  formatSecondsLeft,
} from '../timerUtils';

describe('timerUtils', () => {
  describe('calculateProgressPercentage', () => {
    it('returns 100% when full time remains', () => {
      expect(calculateProgressPercentage(10, 10)).toBe(100);
    });

    it('returns 50% at half time', () => {
      expect(calculateProgressPercentage(5, 10)).toBe(50);
    });

    it('returns 0% when time runs out', () => {
      expect(calculateProgressPercentage(0, 10)).toBe(0);
    });

    it('clamps negative values to 0%', () => {
      expect(calculateProgressPercentage(-2, 10)).toBe(0);
    });

    it('clamps overflow values to 100%', () => {
      expect(calculateProgressPercentage(15, 10)).toBe(100);
    });

    it('returns 0 if maxSeconds is 0 or negative', () => {
      expect(calculateProgressPercentage(5, 0)).toBe(0);
      expect(calculateProgressPercentage(5, -1)).toBe(0);
    });
  });

  describe('isTimerWarning', () => {
    it('returns false for time above threshold', () => {
      expect(isTimerWarning(4, 3)).toBe(false);
      expect(isTimerWarning(10, 3)).toBe(false);
    });

    it('returns true when time is at or below threshold', () => {
      expect(isTimerWarning(3, 3)).toBe(true);
      expect(isTimerWarning(1, 3)).toBe(true);
    });

    it('returns false when time reaches 0 (expired)', () => {
      expect(isTimerWarning(0, 3)).toBe(false);
    });
  });

  describe('formatSecondsLeft', () => {
    it('formats integer seconds with 초 suffix', () => {
      expect(formatSecondsLeft(10)).toBe('10초');
      expect(formatSecondsLeft(1)).toBe('1초');
    });

    it('ceils fractional seconds', () => {
      expect(formatSecondsLeft(2.4)).toBe('3초');
      expect(formatSecondsLeft(0.1)).toBe('1초');
    });

    it('clamps negative values to 0초', () => {
      expect(formatSecondsLeft(-1)).toBe('0초');
    });
  });
});
