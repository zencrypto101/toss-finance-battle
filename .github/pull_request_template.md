## 📌 Pull Request 개요
- **태스크명 / ID**: 
- **담당 에이전트**: Dev
- **심판 에이전트**: Reviewer

---

## 🛡️ [Verification Proof] 4단계 필수 검증 증거

> 본 레포지토리는 SpaceXAI / GrokBot 가드레일 규약을 따르며, 4단계 증거가 없는 PR은 머지될 수 없습니다.

- [ ] **Step 1: 정적 타입 검사 (`tsc --noEmit`)**
  - 결과: `exit 0` 확인 (에러 0건)
- [ ] **Step 2: 프로덕션 빌드 (`pnpm run build`)**
  - 결과: 번들 생성 성공 (`dist/` 생성)
- [ ] **Step 3: 단위 및 통합 테스트 (`pnpm test`)**
  - 결과: 70+ 테스트 전수 PASS (`exit 0`)
- [ ] **Step 4: CDP 런타임 스모크 & 콘솔 에러 0건 (`pnpm run test:smoke`)**
  - 브라우저 콘솔 에러: 0건
  - 런타임 스크린샷 아티팩트 첨부 여부: [x]

---

## 🚫 Escape Hatch 전수 점검
- [ ] `any`, `as any` 타입 단언 0건 준수
- [ ] `@ts-ignore`, `@ts-expect-error` 주석 0건 준수
- [ ] `eslint-disable` 규칙 우회 0건 준수
- [ ] 주석 처리되거나 스킵된 단위 테스트 0건 확인

---

## 📸 증거 아티팩트 (Verification Artifacts)
- 첨부된 스크린샷: (예: `lobby-reset-smoke.png`, `chart-result-smoke.png` 등)

---

## ⚖️ Reviewer 독립 심판 판정
- **[Verdict]**: `APPROVED` | `REJECTED`
- **심판 코멘트**: 
