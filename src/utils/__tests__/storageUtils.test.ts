// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  STORAGE_KEYS,
  TOAST_STORAGE_MESSAGES,
  getStoredExp,
  saveStoredExp,
  resetStoredExp,
} from '../storageUtils';

describe('storageUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getStoredExp', () => {
    it('returns 0 when nothing is stored', () => {
      expect(getStoredExp()).toBe(0);
    });

    it('returns parsed positive number from localStorage', () => {
      localStorage.setItem(STORAGE_KEYS.EXP, '350');
      expect(getStoredExp()).toBe(350);
    });

    it('returns 0 for negative stored values', () => {
      localStorage.setItem(STORAGE_KEYS.EXP, '-50');
      expect(getStoredExp()).toBe(0);
    });

    it('returns 0 for corrupt non-numeric strings', () => {
      localStorage.setItem(STORAGE_KEYS.EXP, 'corrupted_string');
      expect(getStoredExp()).toBe(0);
    });
  });

  describe('saveStoredExp', () => {
    it('saves valid experience to localStorage', () => {
      const success = saveStoredExp(500);
      expect(success).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.EXP)).toBe('500');
    });

    it('clamps negative values to 0 before saving', () => {
      const success = saveStoredExp(-100);
      expect(success).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.EXP)).toBe('0');
    });

    it('floats are floored to integers', () => {
      const success = saveStoredExp(123.7);
      expect(success).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.EXP)).toBe('123');
    });
  });

  describe('resetStoredExp', () => {
    it('removes stored EXP from localStorage', () => {
      localStorage.setItem(STORAGE_KEYS.EXP, '1200');
      expect(localStorage.getItem(STORAGE_KEYS.EXP)).toBe('1200');

      const success = resetStoredExp();
      expect(success).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.EXP)).toBeNull();
      expect(getStoredExp()).toBe(0);
    });
  });

  describe('TOAST_STORAGE_MESSAGES', () => {
    it('contains informative reset confirmation message', () => {
      expect(TOAST_STORAGE_MESSAGES.RESET_SUCCESS).toContain('초기화되었습니다');
    });
  });
});
