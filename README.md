# Blackhaven · Scenario Dashboard

`docs.blackhaven.xyz` 메커니즘을 토대로 만든 **초단기 / 초기 / 중기** 베스트 케이스 시나리오 대시보드.

## 구성

- `app/` — Next.js 14 App Router (TypeScript)
- `components/` — Header, Hero, ScenarioTabs, ScenarioSection, charts/*, Timeline, CatalystGuards, MechanicsBlock, Objectives, CompareTable, Footer
- `lib/scenarios.ts` — 3개 시나리오의 KPI / 시계열 / 매출·트레저리 구성 / 본드·락·BAM 파라미터
- `tailwind.config.ts` — 다크 톤 디자인 시스템 (ink / mist / ember / jade / violet)

## 실행

```bash
npm install --cache /tmp/npm-cache-blackhaven
npm run dev    # http://localhost:3000
npm run build  # production build
```

## 시나리오 요약

| 코드 | 기간 | 슬로건 | 핵심 목표 |
|------|------|--------|-----------|
| T0 — 초단기 | 0–4주 | Bootstrap Sprint | 본드 1차 완판 + RBT/USDM POL 시드 |
| T1 — 초기 | 1–6개월 | Liquidity Anchor | RBT를 MegaETH DeFi 기본 페어로 정착, HVN TGE |
| T2 — 중기 | 6–18개월 | Reserve Layer | 본드 의존도 30% 이하, 자생적 트레저리 |

데이터는 forward-looking 시나리오이며 보장 수익이 아닙니다.
