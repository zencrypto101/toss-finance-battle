# FEATURE MAP: toss-finance-battle (대한민국 투자사관학교)

> **용도**: 에이전트(Dev, Reviewer 등)가 UI 버그 리포트나 스크린샷만 받아도 즉시 해당 코드 위치와 렌더링 경로, DOM 셀렉터를 역추적할 수 있도록 돕는 기능 구조 지도입니다.

---

## 1. 애플리케이션 개요 (Architecture Overview)
- **프레임워크**: React 19 + TypeScript + Vite
- **화면 전환 모델**: `App.tsx`의 내부 `view` 상태 기반 단일 페이지 뷰 스위칭 (Router 미사용)
- **상태 영속화**: `localStorage.getItem('toss_academy_exp')` (누적 경험치 관리)
- **주요 테마**: 토스 스타일의 모바일 퍼스트 인터랙티브 금융 교육 시뮬레이션

---

## 2. 뷰 라우팅 및 뷰 상태 맵 (View State Hierarchy)

| View State | 사용자 화면명 | 진입 컴포넌트 / 섹션 | 주요 인터랙션 및 역할 |
|---|---|---|---|
| `LOBBY` | 메인 로비 | `App.tsx` (Lobby Section) | 과목 선택 (차트, DART, 재무), 현재 계급 요약 카드, 임관장 발급 버튼 |
| `ROADMAP` | 성장 현황 / 승강제 계급표 | `src/RankRoadmap.tsx` | 훈련병~사령관 계급 로드맵, 티어 진행률(%), 잔여 판수 표시 |
| `COURSE_CHART` | [과목 1] 블라인드 차트 단타 훈련 | `App.tsx` + `src/ChartCanvas.tsx` | 3초 카운트다운 후 차트 틱 진행, 매수/매도/관망 주문, 실시간 속보 뉴스 대응 |
| `CHART_RESULT` | 단타 훈련 결과 | `App.tsx` (Chart Result Section) | 최종 수익률(%), 세력 승패 평가, 차트 복기, EXP 지급, 결과 링크 클립보드 복사(토스트 피드백) |
| `COURSE_DART` | [과목 2] DART 공시 판별 훈련 | `src/CourseDart.tsx` | 상폐/작전주 감별 퀴즈, 속보 판별 타이머 훈련 |
| `COURSE_FINANCE`| [과목 3] 재무제표 옥석 가리기 | `src/CourseFinancials.tsx` | 10배 텐배거/적자 기업 재무제표 비교 분석 훈련 |
| `CERTIFICATE` | 종합 임관장 & 계급장 발급 | `src/Certificate.tsx` | 3과목 수료 종합 계급장, 수수료 할인 혜택, 공유 카드 발급 |
| `BATTLE_VIEW` | 미러 배틀 모드 | `App.tsx` (Battle Section) | AI 고수/타 유저와의 실시간 미러 수익률 대결 |

---

## 3. 핵심 파일 및 모듈 맵 (File Directory Map)

```text
toss-finance-battle/
├── src/
│   ├── App.tsx                  # 메인 오케스트레이터, LOBBY/CHART 엔진/상태 관리
│   ├── ChartCanvas.tsx          # HTML5 Canvas 캔들스틱/라인 차트 및 매매 마커 렌더러
│   ├── CourseDart.tsx           # DART 공시 훈련 UI 및 판별 인터랙션
│   ├── CourseFinancials.tsx     # 재무제표 옥석 가리기 훈련 UI
│   ├── RankRoadmap.tsx          # 계급 로드맵, EXP 티어 세그먼트, 영웅 카드
│   ├── Certificate.tsx          # 수료 임관장 및 계급증 캔버스/DOM 카드
│   ├── data.ts                  # 과거 주가 시나리오(SCENARIOS), 공시 DB, 평가 로직
│   ├── types.ts                 # View, Scenario, Progress, TradeAction 등 타입 정의
│   ├── utils/
│   │   ├── rankUtils.ts         # 계급 진행률(%), 잔여 EXP, 전술 배지, 수수료 할인 유틸
│   │   ├── shareUtils.ts        # 결과 공유 URL, 텍스트 포맷터, 클립보드 복사 유틸
│   │   ├── storageUtils.ts      # localStorage 관리 및 초기화 유틸
│   │   ├── timerUtils.ts        # 10초 타이머 진행률, 경고 임계치, 초 단위 포맷 유틸
│   │   ├── financeUtils.ts      # 3개년 재무제표 텐배거 비교 분석 및 점수 산출 엔진
│   │   ├── certificateUtils.ts  # HTML5 Canvas 임관장 그래픽 합성 및 이미지 다운로드 유틸
│   │   ├── gameEngine.ts        # 3과목 완수 상태 머신, 가중치 종합 점수, 사령관 승급 판정
│   │   └── __tests__/
│   │       ├── rankUtils.test.ts # 계급 및 수수료 할인 단위 테스트 슈트 (Vitest)
│   │       ├── shareUtils.test.ts# 공유 및 클립보드 단위 테스트 슈트 (Vitest)
│   │       ├── storageUtils.test.ts# 스토리지 및 초기화 단위 테스트 슈트 (Vitest)
│   │       ├── timerUtils.test.ts # 10초 타이머 게이지 단위 테스트 슈트 (Vitest)
│   │       ├── financeUtils.test.ts# 텐배거 재무 분석 알고리즘 단위 테스트 슈트 (Vitest)
│   │       ├── certificateUtils.test.ts# 임관장 캔버스 합성 단위 테스트 슈트 (Vitest)
│   │       └── gameEngine.test.ts # 종합 승급 판정 엔진 단위 테스트 슈트 (Vitest)
│   ├── main.tsx                 # React 루트 마운트
│   └── index.css                # 테일윈드/토스 스타일 토큰 및 애니메이션
├── scripts/
│   └── smoke-test.cjs           # Headless Chrome CDP 런타임/콘솔 무결성 검증 스크립트
└── package.json                 # 스크립트: build, test, test:smoke
```

---

## 4. 핵심 DOM 셀렉터 & 테스트 앵커 (Selector Reference)

에이전트가 자동 검증이나 E2E/CDP 디버깅 시 참조할 핵심 셀렉터:

### 로비 화면 (`LOBBY`)
- **계급 요약 카드**: `div[class*="rounded-3xl"]` 내 `Lv.1 훈련병` 텍스트
- **계급표 이동 버튼**: `button` 또는 텍스트 `"성장 현황 보기"`, `"승강제 계급표 탭 >"`
- **과목 1 카드**: 텍스트 `"[과목 1] 블라인드 차트 단타 훈련"`을 포함하는 버튼
- **과목 2 카드**: 텍스트 `"[과목 2] DART 공시 속보 판별 훈련"`을 포함하는 버튼
- **과목 3 카드**: 텍스트 `"[과목 3] 재무제표 옥석 가리기 훈련"`을 포함하는 버튼
- **임관장 발급 CTA**: 텍스트 `"종합 임관장 & 계급장 발급받기"`를 가진 버튼
- **데이터 초기화 버튼**: `button[data-testid="reset-data-btn"]`
- **초기화 확인 모달**: `div[data-testid="reset-confirm-modal"]`
- **초기화 취소 버튼**: `button[data-testid="cancel-reset-btn"]`
- **초기화 실행 버튼**: `button[data-testid="confirm-reset-btn"]`

### 차트 게임 화면 (`COURSE_CHART`)
- **차트 캔버스**: `<canvas>` 엘리먼트 (`ChartCanvas.tsx`)
- **전탄 매수 버튼**: 텍스트 `"매수"` 또는 `"풀매수"` 버튼
- **전량 매도 버튼**: 텍스트 `"매도"` 또는 `"익절/손절"` 버튼
- **속보 뉴스 팝업**: `activeNews` 발생 시 화면 상단 경고 오버레이
- **나가기 버튼**: 우측 상단 `X` 아이콘 버튼

### DART 공시 판별 화면 (`COURSE_DART`)
- **10초 타이머 게이지 바**: `div[data-testid="dart-timer-gauge"]`
- **타이머 카운트다운 텍스트**: `span[data-testid="dart-timer-countdown"]`
- **호재/악재 버튼**: `🚨 악재 / 폭락`, `🔥 떡상 호재!` 선택 버튼

### 계급 로드맵 (`ROADMAP`)
- **뒤로가기**: 상단 좌측 뒤로가기 버튼
- **현재 티어 진행 바**: `rankUtils.calculateTierProgress` 기반 게이지 바
- **전술 편제 배지**: `getRankDivision` 결과 배지 라벨 (`기초 입교생`, `실전 야전병` 등)
- **수수료 우대 배지 버튼 (상단)**: `button[data-testid="hero-fee-perk-btn"]`
- **계급별 수수료 할인 버튼**: `button[data-testid="fee-perk-btn-{level}"]`
- **계급별 수수료 할인 툴팁**: `div[data-testid="fee-discount-tooltip-{level}"]`

### 차트 결과 화면 (`CHART_RESULT`)
- **결과 링크 클립보드 복사 버튼**: `button[data-testid="copy-chart-result-btn"]` 또는 텍스트 `"결과 링크 클립보드 복사"`
- **토스트 피드백 알림**: 상단 토스트 오버레이 내 `"결과 링크가 클립보드에 복사되었습니다!"` 텍스트
- **재도전 버튼**: 텍스트 `"새로운 랜덤 차트로 즉시 재도전하기"` 버튼
- **로비 복귀 버튼**: 텍스트 `"사관학교 로비로 복귀하기"` 버튼

### 재무제표 옥석 가리기 화면 (`COURSE_FINANCE`)
- **알짜 진주 선택 버튼**: `button[data-testid="finance-gem-btn"]`
- **상폐 위험 선택 버튼**: `button[data-testid="finance-trap-btn"]`

### 종합 임관장 발급 화면 (`CERTIFICATE`)
- **임관장 고화질 이미지 다운로드 버튼**: `button[data-testid="download-cert-btn"]`
- **단톡방 공유 버튼**: `button` 텍스트 `"내 계급장 공유하고 단톡방 서열 맞짱뜨기"`

### 종합 승급 축하 모달 (`PROMOTION_CELEBRATION`)
- **축하 모달 컨테이너**: `div[data-testid="promotion-celebration-modal"]`
- **임관장 이동 CTA 버튼**: `button[data-testid="close-celebration-btn"]`

---

## 5. 자동 검증 명령어 (Quick Verification Run)

에이전트가 코드 수정 후 무결성을 증명하기 위해 실행할 명령어:

```bash
cd toss-finance-battle

# 1. 정적 타입 검사
pnpm tsc --noEmit

# 2. 프로덕션 빌드
pnpm run build

# 3. 단위 테스트
pnpm test

# 4. CDP 기반 런타임 콘솔 무결성 및 스크린샷 검증
pnpm run test:smoke
```
