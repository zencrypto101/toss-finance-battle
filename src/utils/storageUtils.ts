export const STORAGE_KEYS = {
  EXP: 'toss_academy_exp',
} as const;

export const TOAST_STORAGE_MESSAGES = {
  RESET_SUCCESS: '훈련 및 계급 데이터가 초기화되었습니다.',
} as const;

/**
 * Safely retrieves stored EXP from localStorage
 */
export function getStoredExp(): number {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 0;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.EXP);
    if (!saved) return 0;
    const parsed = parseInt(saved, 10);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  } catch {
    return 0;
  }
}

/**
 * Safely saves EXP to localStorage
 */
export function saveStoredExp(exp: number): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const safeExp = Math.max(0, Math.floor(exp));
    localStorage.setItem(STORAGE_KEYS.EXP, safeExp.toString());
    return true;
  } catch {
    return false;
  }
}

/**
 * Resets academy progress data in localStorage
 */
export function resetStoredExp(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    localStorage.removeItem(STORAGE_KEYS.EXP);
    return true;
  } catch {
    return false;
  }
}
