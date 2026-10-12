/// <reference types="vite/client" />

interface TossBridge {
  openURL?: (url: string) => void;
}

interface Window {
  toss?: TossBridge;
  __SET_VIEW__?: (view: 'LOBBY' | 'ROADMAP' | 'COURSE_CHART' | 'CHART_RESULT' | 'COURSE_DART' | 'COURSE_FINANCE' | 'CERTIFICATE' | 'BATTLE_VIEW') => void;
  __OPEN_RESET_MODAL__?: () => void;
}
