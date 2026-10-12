# AUTOMATED MERGE & DEPLOYMENT POLICY (자동 머지 및 무중단 배포 규약)

> 본 문서는 SpaceXAI / GrokBot 팀의 20+ 에이전트 자율 머지 체계를 클라우드 환경에 적용하기 위한 브랜치 보호 규칙 및 자동 배포 가이드입니다.

---

## 1. 2단계 무결성 게이트 (Dual-Lock Merge Gates)

PR이 `main` 브랜치에 자동으로 머지되기 위해서는 반드시 아래 **2가지 게이트가 동시에 충족**되어야 합니다:

```text
[Dev 에이전트 작업]
       │
       ▼
┌────────────────────────┐      ┌────────────────────────┐
│ Gate 1: Cloud CI 검증  │  &&  │ Gate 2: Reviewer 승인  │
│ (verify-and-build.yml) │      │ (REVIEWER.md 루브릭)   │
└────────────────────────┘      └────────────────────────┘
       │                                     │
       └──────────────────┬──────────────────┘
                          ▼
              [GitHub Auto-Merge 발동]
                          │
                          ▼
             [Vercel 프로덕션 자동 배포]
```

### Gate 1: GitHub Actions CI 통과 (`verify-and-build.yml`)
1. `pnpm tsc --noEmit` exit 0 (타입 에러 0건)
2. `pnpm run build` exit 0 (Vite 번들링 무결성)
3. `pnpm test` exit 0 (70개 단위 테스트 전수 PASS)
4. `pnpm run test:smoke` exit 0 (Headless Chrome CDP 런타임 콘솔 에러 0건, 스크린샷 7종 아티팩트 업로드)

### Gate 2: 독립 심판 봇 승인 (`Reviewer APPROVED`)
1. `[Reviewer Verdict]: APPROVED` 판정
2. Evidence Artifact 실측 유효성 확인
3. Escape Hatch (`any`, `@ts-ignore`) 0건 확인
4. Blast Radius 격리 준수 확인

---

## 2. GitHub 레포지토리 Branch Protection 설정 가이드

GitHub 저장소의 `Settings` -> `Branches` -> `main` 보호 규칙:

1. **Require a pull request before merging** 체크
   - `Require approvals`: 1 (Reviewer 봇)
   - `Dismiss stale pull request approvals when new commits are pushed`: 체크
2. **Require status checks to pass before merging** 체크
   - 필수 상태 체크 등록: `4-Step Verification Ladder (SpaceX/GrokBot Protocol)`
   - `Require branches to be up to date before merging`: 체크
3. **Automatically merge pull requests** 활성화
   - GitHub 저장소 옵션에서 `Allow auto-merge` 활성화
   - 에이전트가 PR 생성 시 `--auto` 플래그로 자동 머지 예약

---

## 3. Vercel 무중단 배포 파이프라인

`vercel.json`을 통해 설정된 무중단 배포 동작 방식:

1. **PR 생성 시 (Preview Deployment)**:
   - 각 PR마다 고유한 Preview URL(`https://toss-finance-battle-git-*.vercel.app`) 자동 생성
   - Reviewer 및 인간 운영자가 실서버 런타임을 즉시 클릭해서 테스트 가능
2. **Main 브랜치 머지 시 (Production Deployment)**:
   - Gate 1 + Gate 2 통과 후 자동 머지 즉시 프로덕션 도메인으로 제로 다운타임 무중단 배포
   - Vite 정적 에셋의 1년 불변 캐싱(`Cache-Control: public, max-age=31536000, immutable`)과 SPA rewrite 적용
