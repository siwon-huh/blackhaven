# Blackhaven Live

MegaETH 위 reserve-backed treasury 프로토콜인 **Blackhaven** 의 비공식 대시보드입니다.
실시간 시장 지표, RBT 공정가 모델, OHM 포크 부검, 사용자 플레이북, 외부 감사 리스크 정리를 한 곳에 담았습니다.

[@c4lvin](https://x.com/c4lvin), [Four Pillars](https://4pillars.io) 가 만들었습니다.

> English README: [../README.md](../README.md)
> 개발자 문서: [DEVELOPING.ko.md](./DEVELOPING.ko.md)

## Blackhaven 이란

Blackhaven 은 MegaETH 위에 자리잡은 reserve-backed treasury 프로토콜입니다. 사용자는 본드를 통해 USDm 을 약정하고 RBT (Reserve-Backed Token) 를 디스카운트로 받습니다. 받은 RBT 는 만기까지 선형으로 베스팅됩니다. 약정한 USDm 의 90 퍼센트는 트레저리로, 10 퍼센트는 LiquidityManager 의 protocol-owned liquidity 로 들어갑니다. RBT 는 stake 하면 sRBT 가 되고, sRBT 는 2 주에서 52 주까지 commit 으로 약정해 만기에 추가 RBT 분배를 받을 수 있습니다. Backing Arbitrage Module (BAM) 이 시장가를 자동으로 NAV 로 수렴시킵니다. 시장가가 NAV 위면 RBT 를 매도해 트레저리로 환류하고, 아래면 매수해 burn 합니다.

이 프로토콜은 OlympusDAO 설계를 구조적으로 재구성한 것입니다. rebase 루프를 제거하고, 단일 스테이블코인 (USDm) 백킹을 채택했습니다. OHM 이 수동으로 했던 inverse bond 는 BAM 이 자동, 양방향으로 처리합니다.

외부 감사: [Zellic, 2026 년 1 월 19 일](https://docs.blackhaven.xyz). 현재 상태: 메인넷 출시 후 Genesis Phase 1.

## 이 대시보드의 역할

- **/[lang]/** — 실시간 스냅샷. RBT 시장가, NAV, 프리미엄 배수, 본드 풀 깊이와 디스카운트, Stake / Commit TVL 을 보여주고, 4-layer 공정가 모델 기준의 진입 verdict (저평가 / 공정 / 본드 권장 / 고평가) 를 표시합니다. 데이터는 1 초 간격으로 갱신됩니다.
- **/[lang]/about** — 프로토콜 개요, 자금 흐름 다이어그램, 네 가지 코어 메커니즘 (Bond, Stake, Commit, BAM), 그리고 모든 컨트랙트 매핑과 익스플로러 링크.
- **/[lang]/playbook** — 자본 규모를 입력하면 라이브 본드 풀 깊이를 기준으로 권장 만기를 골라주는 가이드. 시간축별 (초단기, 초기, 중기) 메인 플레이와 자본 배분, 주차별 액션 시퀀스, 정지 신호.
- **/[lang]/forks** — OHM 과 메이저 포크 7 개 (OHM, TIME, KLIMA, HEC, BTRFLY, SB, FHM) 의 케이스 파일. 출시 이후 월별 정규화 가격 곡선, 공통 실패 패턴, Blackhaven 이 다르게 한 부분.
- **/[lang]/risks** — Zellic 오딧 finding 11 건 전체 (등급, 수정 상태, 상세 설명), 프로토콜 차원 리스크와 그 완화 장치, 사용자 진입 시나리오별 리스크와 가드레일.

`[lang]` 은 `ko` 또는 `en` 입니다. 두 언어 모두 빌드 시 정적으로 생성됩니다.

## 기술 스택

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS, CSS variable 기반 디자인 토큰으로 라이트 / 다크 모드 지원
- viem 으로 MegaETH (chain id 4326) 온체인 RPC 호출
- dexscreener 공개 API 로 라이브 시장 데이터
- 정적 SVG 차트 (외부 차트 라이브러리 없음)

## 라이브 데이터 출처

- **시장가**: dexscreener 페어 `0x3fa634c81ee8aa78c4f37364e6feccb8a89c0032` (Kumbaya RBT/USDm 풀)
- **백킹 / NAV**: BackingCalculator.NAV() 와 트레저리 reserves 잔액을 온체인에서 직접 호출
- **본드 TVL**: 각 본드 컨트랙트의 RBT 잔액과 라이브 시장가를 곱해 계산
- **Stake / Commit**: sRBT 잔액과 RBTNote 보상 풀을 온체인에서 직접 호출

RPC 가 실패하면 수기로 동기화한 정적 스냅샷으로 fallback 합니다.

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # /ko, /en 라우트 SSG
```

Node 20 이상. 공개 read-only 경로에는 환경 변수가 필요 없습니다.

## 안내

이 사이트의 수치는 forward-looking 시나리오와 라이브 데이터의 조합입니다. 투자 권유나 보장 수익이 아닙니다. NAV 와 reserves 는 RPC 가 사용 가능할 때 온체인에서 직접 읽으며, Stake 와 Commit 의 일부 항목은 온체인 데이터가 없을 때 수기로 동기화한 스냅샷으로 fallback 합니다. 공정가 모델은 Live 페이지의 Fair Value 섹션에 명시된 가정을 사용합니다.

## 라이선스

MIT.
