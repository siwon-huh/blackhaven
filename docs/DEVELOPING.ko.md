# Blackhaven Live, 개발자 문서

이 문서는 `blackhaven-dashboard` 저장소의 코드 구조, 라이브 데이터 흐름, i18n 시스템, 디자인 토큰, 그리고 흔한 개발 작업을 한글로 정리한 자료입니다. 자주 손볼 부분 (수치 갱신, 새 본드 추가, locale 추가) 의 가이드를 포함합니다.

영문 README: [../README.md](../README.md)
한글 README: [./README.ko.md](./README.ko.md)

## 1. 디렉터리 구조

```
app/
  [lang]/                  # ko 또는 en 동적 라우트, generateStaticParams 로 정적 prerender
    layout.tsx             # LocaleProvider 주입, invalid locale 시 notFound
    page.tsx               # /[lang] = Live 스냅샷 (LaunchSnapshot, MarketDynamics, FairValue)
    about/page.tsx         # AboutHero, FlowDiagram, MechanicsCards, Contracts
    playbook/page.tsx      # PlaybookHero, CapitalGuide, PlaybookSection
    forks/page.tsx         # ForksHero, ForkTimeline, PriceCurveChart, ForkCards, PatternsBlock, LessonsBlock, CrossLink
    risks/page.tsx         # RisksHero, AuditFindings, UserRisks, ProtocolRisks, RisksFooter
  api/
    metrics/route.ts       # dexscreener + 온체인 RBT 시장 지표
    bond-metrics/route.ts  # 각 본드 컨트랙트 잔액 -> TVL 환산
    commit-metrics/route.ts# Stake (sRBT 컨트랙트), Commit (RBTNote) 잔액
  layout.tsx               # ThemeProvider, body 폰트
  page.tsx                 # / -> /ko 리다이렉트
  globals.css              # CSS 변수 정의 (ink scale, signal/warn/critical, light/dark inversion)

components/
  SiteHeader.tsx           # nav, 언어 토글, 테마 토글, 헤더 brand 영역
  SiteFooter.tsx
  LaunchSnapshot.tsx       # /live 메인 카드: 시장가, NAV, premium, bond pool, signals, priority plays
  MarketDynamics.tsx       # NAV pump, flow, lock ratio, bond wave 4 가지 다이내믹스 + 트리거 체크리스트
  FairValue.tsx            # 4-layer 공정가 모델 (Floor / Yield-fair / Bond Effective / Market) + Reflexivity 토글
  HeroPlay.tsx, ExtraPlays.tsx, AllocBar.tsx, WeekPlan.tsx, StopSignals.tsx
                           # /playbook 의 시간축별 콘텐츠 블록
  about/                   # AboutHero, FlowDiagram (SVG), MechanicsCards, Contracts (컨트랙트 매핑), PlaybookSection
  forks/                   # ForksHero, ForkTimeline, ForkCards, PriceCurveChart (월별 정규화 곡선), MiniCurve, PatternsBlock, LessonsBlock, CrossLink
  risks/                   # RisksHero, AuditFindings, ProtocolRisks, UserRisks, RisksFooter
  playbook/                # PlaybookHero, CapitalGuide

lib/
  contracts.ts             # MegaETH 메인넷 (chain id 4326) 의 모든 Blackhaven 컨트랙트 주소
  i18n.ts                  # ko / en 사전 + LocaleString 타입과 lc() 헬퍼
  locale-context.tsx       # LocaleProvider, useLocale, useT 훅
  theme.tsx                # ThemeProvider, useTheme (localStorage 'bh-theme')
  fairValue.ts             # computeFairValue, entryVerdict, REFLEXIVITY_DISCOUNT, 라이브 정적 fallback (LIVE_METRICS, LIVE_BONDS)
  bondMetrics.ts           # 본드 풀 깊이 등급, 권장 max, recommendBond 함수
  launch.ts                # 출시 직후 캡처한 메트릭 + signals + livePriority 시드
  scenarios.ts             # MECHANICS, OHM_TLDR, SCENARIOS (시간축별 hero/extras/allocation/weekly/stop)
  forks.ts                 # FORKS, COMMON_PATTERNS, LESSONS, PRICE_HISTORY (월별 종가)
  risks.ts                 # AUDIT_FINDINGS, PROTOCOL_RISKS, USER_RISKS
  useLiveMetrics.ts        # /api/metrics 1 초 폴링 훅
  useBondMetrics.ts        # /api/bond-metrics 1 초 폴링 훅
  useCommitMetrics.ts      # /api/commit-metrics 1 초 폴링 훅

docs/
  README.ko.md             # 한글 README
  DEVELOPING.ko.md         # 이 문서
```

## 2. i18n

### 2.1 사전 기반 (UI 라벨)

`lib/i18n.ts` 의 `ko`, `en` 객체에 키 / 값 형태로 정의합니다. 컴포넌트에서는 `useT()` 훅으로 호출합니다.

```tsx
import { useT } from "@/lib/locale-context";

function MyComponent() {
  const t = useT();
  return <h2>{t("live.title")}</h2>;
}
```

키는 `area.section.detail` 형태의 점-구분 문자열입니다. ko 와 en 양쪽에 같은 키를 등록하지 않으면 ko fallback 이 사용됩니다.

### 2.2 데이터 객체 안의 LocaleString (콘텐츠)

긴 문장 데이터 (signal description, fork hook, audit summary 등) 는 `LocaleString` 타입으로 데이터 파일에 직접 넣습니다.

```ts
import type { LocaleString } from "@/lib/i18n";

export const SIGNAL = {
  label: { ko: "OHM 포크 패턴 P2", en: "OHM-fork pattern P2" } as LocaleString,
  detail: { ko: "...", en: "..." } as LocaleString,
};
```

컴포넌트에서 `lc(value, locale)` 로 렌더합니다.

```tsx
import { lc } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-context";

const locale = useLocale();
return <p>{lc(SIGNAL.detail, locale)}</p>;
```

string 그대로 두면 어느 locale 에서든 같은 문자열이 출력됩니다. 마이그레이션이 점진적으로 가능합니다.

### 2.3 새 locale 추가

1. `lib/i18n.ts` 의 `LOCALES` 배열에 코드를 추가합니다.
2. 새 사전 객체를 만들고 `DICTIONARIES` 에 등록합니다. ko 의 모든 키를 채우는 것이 안전합니다.
3. 데이터 파일의 `LocaleString` 객체에 새 locale 키를 추가합니다 (`{ ko, en, ja }` 등). 누락 키는 ko fallback.
4. `app/[lang]/layout.tsx` 의 `generateStaticParams` 가 자동으로 모든 locale 을 prerender 합니다.

## 3. 디자인 토큰과 라이트 / 다크 모드

`app/globals.css` 에 ink-0 부터 ink-950 까지의 RGB CSS 변수 12 단계를 정의합니다. 다크 모드에서는 ink-50 이 밝은 텍스트, ink-950 이 어두운 배경입니다. 라이트 모드에서는 같은 변수를 inversion 한 값으로 재정의합니다 (`:root[data-theme="light"]` 블록).

`tailwind.config.ts` 의 ink, signal, warn, critical 컬러 토큰은 모두 `rgb(var(--ink-NN) / <alpha-value>)` 패턴으로 매핑되어 있어, Tailwind 클래스 (`bg-ink-950`, `text-ink-50`, `text-signal` 등) 가 자동으로 모드 inversion 됩니다. 따라서 컴포넌트 스타일은 일반적인 ink-* 토큰을 그대로 쓰면 됩니다.

테마 토글은 `lib/theme.tsx` 의 `useTheme()` 훅으로 접근합니다. 값은 localStorage `bh-theme` 에 저장되고, 초기 로드 시 `app/layout.tsx` 의 인라인 스크립트가 깜빡임 없이 적용합니다.

SVG 안에서도 CSS 변수가 inherit 되므로 `fill: var(--surface-2)` 같은 식으로 쓰면 두 모드 모두 자동 대응됩니다 (`components/about/FlowDiagram.tsx` 참고).

## 4. 라이브 데이터 흐름

- **`/api/metrics`** — dexscreener 공개 API 와 viem 으로 BackingCalculator.NAV(), 트레저리 reserves 를 동시에 호출. RPC 실패 시 dexscreener 응답만 반환.
- **`/api/bond-metrics`** — 각 본드 컨트랙트의 RBT 잔액을 viem 으로 읽어 라이브 시장가와 곱해 TVL 산출.
- **`/api/commit-metrics`** — sRBT 컨트랙트의 RBT escrow 잔액과 RBTNote 의 reward pool RBT 잔액을 읽어 Stake TVL, Commit TVL 을 산출.

각 라우트는 `dynamic = "force-dynamic"` 이 아닌 일반 fetch 라 Next.js 가 캐시할 수 있지만 폴링이 1 초 간격이라 실효적으로는 매번 새 응답을 받습니다.

훅 (`useLiveMetrics`, `useBondMetrics`, `useCommitMetrics`) 은 `setInterval` 로 1 초마다 fetch 하고, 응답을 React state 로 노출합니다. 응답 실패 시 마지막 성공 값을 유지하고 `error` 플래그를 세웁니다.

## 5. 자주 하는 작업

### 5.1 본드 만기 추가

1. `lib/contracts.ts` 의 `BOND_CONTRACTS` 객체에 새 만기 키와 주소 추가.
2. `lib/contracts.ts` 의 `BOND_DISCOUNT_BY_DAYS` 에 만기와 디스카운트 매핑 추가.
3. `lib/fairValue.ts` 의 `LIVE_BONDS` 에 fallback 정적 항목 추가.
4. `app/api/bond-metrics/route.ts` 가 `BOND_CONTRACTS` 를 순회하므로 자동으로 새 만기를 라이브 호출에 포함합니다.
5. UI 는 `useBondMetrics().snapshot.bonds` 가 자동으로 새 항목을 포함하므로 추가 작업이 필요 없습니다.

### 5.2 라이브 데이터 fallback 갱신

`lib/launch.ts` 의 `LAUNCH_SNAPSHOT.metrics` 와 `lib/fairValue.ts` 의 `LIVE_METRICS`, `LIVE_BONDS` 가 RPC 실패 시 fallback 입니다. Capture 시점이 표시되는 `capturedAt` 도 함께 갱신하시기 바랍니다.

### 5.3 새 OHM 포크 추가

1. `lib/forks.ts` 의 `FORKS` 배열에 새 항목 추가. `Fork` 타입의 모든 필드를 채웁니다 (LocaleString 객체 사용).
2. `PRICE_HISTORY` 객체에 같은 `id` 키로 출시 월부터 36 개월까지의 월별 종가 배열을 추가합니다.
3. UI 는 자동으로 새 토큰을 ForkTimeline, ForkCards, PriceCurveChart 에 포함합니다.

### 5.4 새 audit finding 추가

`lib/risks.ts` 의 `AUDIT_FINDINGS` 배열에 새 항목 추가. severity 필드는 Critical / High 까지 확장 가능하지만 현재 SEVERITY_TONE 은 Medium / Low / Informational 만 매핑되어 있으므로 `components/risks/AuditFindings.tsx` 의 `SEVERITY_TONE` 도 확장이 필요합니다.

### 5.5 시나리오 (플레이북) 추가

`lib/scenarios.ts` 의 `SCENARIOS` 배열에 새 시간축을 추가합니다. `Horizon` 타입 (`"short" | "early" | "mid"`) 을 확장한 뒤, `PlaybookSection` 의 탭 UI 가 자동으로 새 시나리오 버튼을 보여줍니다.

## 6. 빌드와 배포

```bash
npm run build   # /ko 와 /en 라우트 SSG, 모든 페이지 정적 prerender
npm start       # 빌드 결과를 production 모드로 서빙
```

페이지는 모두 정적 (SSG) 이며 클라이언트 측에서 1 초 폴링으로 라이브 메트릭을 채웁니다. 따라서 정적 호스팅 (Vercel, Cloudflare Pages 등) 어디든 배포할 수 있습니다.

## 7. 외부 구두점 규칙

본문 카피 (UI, SVG caption, 데이터 파일의 LocaleString 등) 에서 emdash 와 가운뎃점은 사용하지 않습니다. 콤마, 마침표, 슬래시, "and / or" 같은 일반 구두점으로 대체합니다.

## 8. 알려진 한계

- NAV pump 강도 신호는 본드 onchain TVL 합과 premium multiple 만으로 추정합니다. 실제 NAV 의 시간 변화율을 직접 측정하려면 BackingCalculator.NAV() 를 시계열로 저장해야 합니다.
- HVN 토큰은 아직 TGE 전이라 가격 / 거버넌스 라이브 데이터가 없습니다. 시나리오 본문에는 추정값으로 등장합니다.
- 라이트 모드에서 일부 SVG 는 dark fixed (예: ink-950 배경) 클래스로 작성되어 있어 읽힘이 떨어질 수 있습니다. CSS 변수 기반 (`var(--surface-2)` 등) 으로 점진적으로 마이그레이션 중입니다.

## 9. 컨택트

- 코드 이슈: [github.com/siwon-huh/blackhaven](https://github.com/siwon-huh/blackhaven) Issues
- 작성자: [@c4lvin](https://x.com/c4lvin), researcher at [Four Pillars](https://4pillars.io)
