// Blackhaven Risks 데이터.
// 출처: Zellic Smart Contract Security Assessment (2026-01-19), docs.blackhaven.xyz Risks

import type { LocaleString } from "@/lib/i18n";

export type Severity = "Medium" | "Low" | "Informational";
export type FindingStatus = "fixed" | "acknowledged";

export type AuditFinding = {
  id: string;
  title: LocaleString;
  target: string;
  severity: Severity;
  category: LocaleString;
  summary: LocaleString;
  remediation: { status: FindingStatus; commit?: string; note?: LocaleString };
};

// Zellic 보고서가 명시한 11 findings.
export const AUDIT_FINDINGS: AuditFinding[] = [
  {
    id: "F1",
    title: {
      ko: "본드가 per-bond vesting 대신 전역 vestingTerm 을 사용",
      en: "Bonds used a global vestingTerm instead of per-bond vesting",
    },
    target: "Bond.sol",
    severity: "Medium",
    category: { ko: "Business Logic", en: "Business Logic" },
    summary: {
      ko: "redeem 과 redeemEarly, getBondInfo 가 전역 terms.vestingTerm 을 사용해 owner 가 값을 바꾸면 기존 본드의 만기와 early-exit 정산이 영향을 받을 수 있었습니다. per-bond vesting 으로 수정되었습니다.",
      en: "redeem, redeemEarly, and getBondInfo used the global terms.vestingTerm, so an owner change could retroactively shift maturity and early-exit settlement for existing bonds. Switched to per-bond vesting.",
    },
    remediation: { status: "fixed", commit: "7a9b7526" },
  },
  {
    id: "F2",
    title: {
      ko: "Oracle staleness 검증 누락",
      en: "Missing oracle staleness check",
    },
    target: "BackingCalculator.sol",
    severity: "Medium",
    category: { ko: "Business Logic", en: "Business Logic" },
    summary: {
      ko: "BackingCalculator 가 IOracle.getPrice 를 staleness check 없이 소비합니다. oracle 이 stale 응답을 주면 NAV 와 Bond 가격, BAM premium 캡처가 잘못된 데이터로 동작할 수 있습니다. Blackhaven 은 stale/zero 시 revert 하는 wrapper 를 사용하도록 docs 에 명시했습니다.",
      en: "BackingCalculator consumes IOracle.getPrice with no staleness check. A stale oracle reading would propagate to NAV, bond pricing, and BAM premium capture. The docs commit to using a wrapper that reverts on stale or zero responses.",
    },
    remediation: {
      status: "acknowledged",
      commit: "fd7f5a3a",
      note: {
        ko: "oracle wrapper 에 staleness check 적용 계획",
        en: "Plan to apply staleness checks in the oracle wrapper.",
      },
    },
  },
  {
    id: "F3",
    title: {
      ko: "Oracle 구현이 1e18 decimals 로 정규화되어야 함",
      en: "Oracle responses must be normalized to 1e18 decimals",
    },
    target: "BackingCalculator.sol",
    severity: "Medium",
    category: { ko: "Business Logic", en: "Business Logic" },
    summary: {
      ko: "BackingCalculator 가 oracle 응답을 1e18 단위로 가정합니다. Redstone 의 USDC/USD 같은 8 decimals 피드를 그대로 쓰면 NAV 가 10^10 단위로 어긋날 수 있습니다. 1e18 정규화 wrapper 를 사용하기로 했습니다.",
      en: "BackingCalculator assumes oracle output in 1e18 units. Feeding it an 8-decimal feed (e.g. Redstone USDC/USD) directly would skew NAV by a factor of 10^10. The team committed to a 1e18 normalization wrapper.",
    },
    remediation: {
      status: "acknowledged",
      commit: "8f4dcb6c",
      note: {
        ko: "wrapper 가 1e18 로 정규화하기로 명시",
        en: "Wrapper will normalize to 1e18.",
      },
    },
  },
  {
    id: "F4",
    title: {
      ko: "BAM 의 collectPremium 이 유동성 부족으로 실패할 수 있음",
      en: "BAM collectPremium can fail under thin liquidity",
    },
    target: "BAM.sol",
    severity: "Low",
    category: { ko: "Protocol Risks", en: "Protocol Risks" },
    summary: {
      ko: "BAM 이 RBT 를 Uniswap V3 에서 USDM 으로 swap 할 때 default 5퍼센트 슬리피지 허용을 씁니다. POL 깊이가 얕아지면 swap 이 revert 되어 premium 캡처가 일시적으로 멈출 수 있습니다.",
      en: "BAM swaps RBT to USDM on Uniswap V3 with a default 5% slippage tolerance. Thin POL depth can revert the swap, temporarily pausing premium capture.",
    },
    remediation: {
      status: "acknowledged",
      note: {
        ko: "maxSupplyPercentBps 로 swap 사이즈 제한, slippageToleranceBps 동적 조정 가능",
        en: "Swap size is bounded by maxSupplyPercentBps; slippageToleranceBps can be tuned dynamically.",
      },
    },
  },
  {
    id: "F5",
    title: {
      ko: "BAM 의 collectPremium 이 샌드위치 공격에 취약",
      en: "BAM collectPremium is exposed to sandwich attacks",
    },
    target: "BAM.sol",
    severity: "Low",
    category: { ko: "Protocol Risks", en: "Protocol Risks" },
    summary: {
      ko: "기본 5퍼센트 슬리피지 안에서 MEV 공격자가 collectPremium 거래를 샌드위치할 수 있습니다. swap 사이즈가 제한적이라 실 손실은 작지만 누적되면 backing 적립 효율이 떨어집니다.",
      en: "Within the 5% default slippage band, an MEV bot can sandwich collectPremium. Per-swap loss is bounded by swap size, but accumulated leakage reduces backing-fill efficiency.",
    },
    remediation: {
      status: "acknowledged",
      note: {
        ko: "MEV 모니터링 후 slippageToleranceBps 조정",
        en: "Will tune slippageToleranceBps after MEV monitoring.",
      },
    },
  },
  {
    id: "F6",
    title: {
      ko: "LiquidityManager 가 onERC721Received 콜백을 구현하지 않음",
      en: "LiquidityManager did not implement onERC721Received",
    },
    target: "LiquidityManager.sol",
    severity: "Informational",
    category: { ko: "Business Logic", en: "Business Logic" },
    summary: {
      ko: "Uniswap V3 LP NFT 를 safeTransferFrom 으로 보내면 revert 됩니다. ERC721 best practice 를 따라 onERC721Received 콜백을 추가했습니다.",
      en: "safeTransferFrom of a Uniswap V3 LP NFT would revert. Added the onERC721Received callback to follow ERC721 best practice.",
    },
    remediation: { status: "fixed", commit: "0d1f25ce" },
  },
  {
    id: "F7",
    title: {
      ko: "RBTNote dust 예치가 0 yield 를 만들 수 있음",
      en: "RBTNote dust deposits could mint 0-yield notes",
    },
    target: "RBTNote.sol",
    severity: "Informational",
    category: { ko: "Business Logic", en: "Business Logic" },
    summary: {
      ko: "calculateYield 의 정수 나눗셈 때문에 약 129 wei 이하의 본드는 yield 가 0 으로 잘립니다. 사용자가 RBT 를 묶어두지만 만기에 yield 가 없는 NFT 가 발행될 수 있었습니다.",
      en: "Integer division in calculateYield truncated yield to 0 for principals at or below ~129 wei. Users could lock RBT and end up with a zero-yield note at maturity.",
    },
    remediation: { status: "fixed", commit: "48e46f5a" },
  },
  {
    id: "F8",
    title: {
      ko: "RBTNote calculateSlash 의 정밀도 손실로 만기 직전 페널티 회피 가능",
      en: "RBTNote calculateSlash precision loss lets users skip penalty near maturity",
    },
    target: "RBTNote.sol",
    severity: "Informational",
    category: { ko: "Business Logic", en: "Business Logic" },
    summary: {
      ko: "만기 직전 매우 짧은 시간 (2주 약정 기준 약 2분, 52주 기준 약 52분) 안에 early exit 하면 슬래시 페널티가 0 으로 잘립니다. 다만 yield 도 함께 잃기에 경제적으로는 비합리적입니다.",
      en: "An early exit in a very short window before maturity (about 2 minutes for a 2-week commit, about 52 minutes for 52 weeks) truncates the slash penalty to 0. The user still forfeits yield, so it is economically irrational.",
    },
    remediation: { status: "acknowledged" },
  },
  {
    id: "F9",
    title: {
      ko: "BackingCalculator 의 사용되지 않는 lastBacking 변수",
      en: "Unused lastBacking variable in BackingCalculator",
    },
    target: "BackingCalculator.sol",
    severity: "Informational",
    category: { ko: "Coding Mistakes", en: "Coding Mistakes" },
    summary: {
      ko: "addBacking 이 lastBacking 을 저장하지만 어디에서도 읽지 않습니다. 가스 낭비 외 영향은 없습니다.",
      en: "addBacking writes lastBacking but it is never read. Wasted gas, no functional impact.",
    },
    remediation: { status: "fixed", commit: "b253a713" },
  },
  {
    id: "F10",
    title: {
      ko: "코드베이스 전반의 일관되지 않은 decimal 처리",
      en: "Inconsistent decimal handling across the codebase",
    },
    target: "Multiple contracts",
    severity: "Informational",
    category: { ko: "Coding Mistakes", en: "Coding Mistakes" },
    summary: {
      ko: "여러 컨트랙트가 18 decimals 를 가정하고 있어 다른 decimals 의 backing 토큰이 추가되면 계산이 어긋날 수 있습니다.",
      en: "Several contracts assume 18 decimals, so adding a backing token with a different decimals value would skew calculations.",
    },
    remediation: { status: "acknowledged" },
  },
  {
    id: "F11",
    title: {
      ko: "backing 토큰을 제거하는 메커니즘이 없음",
      en: "No mechanism to remove a backing token",
    },
    target: "BackingCalculator.sol",
    severity: "Informational",
    category: { ko: "Discussion", en: "Discussion" },
    summary: {
      ko: "backing 토큰을 추가하는 함수는 있지만 제거하는 함수가 없습니다. 잘못된 토큰을 추가하면 영구적으로 NAV 계산에 포함됩니다.",
      en: "There is a function to add backing tokens but none to remove them. A wrongly added token would stay in the NAV calculation permanently.",
    },
    remediation: { status: "acknowledged" },
  },
];

// docs.blackhaven.xyz/risks 의 Risk 섹션 정리.
export type ProtocolRisk = {
  title: LocaleString;
  detail: LocaleString;
  mitigations: LocaleString[];
};

export const PROTOCOL_RISKS: ProtocolRisk[] = [
  {
    title: { ko: "스마트 컨트랙트 리스크", en: "Smart contract risk" },
    detail: {
      ko: "모든 디파이 프로토콜이 가지는 컨트랙트 취약점 리스크가 있습니다. 외부 감사를 받았더라도 미발견 취약점이 남을 수 있습니다.",
      en: "Every DeFi protocol carries contract vulnerability risk. Even after an external audit, undiscovered issues can remain.",
    },
    mitigations: [
      {
        ko: "Zellic 의 외부 감사 (2026-01) 를 거쳤으며 모든 finding 이 fixed 또는 acknowledged 상태입니다.",
        en: "Audited by Zellic in Jan 2026. Every finding is either fixed or acknowledged.",
      },
      {
        ko: "관리자 권한과 업그레이드 함수에 time-lock 이 적용되어 사용자가 변경 전에 빠져나올 수 있습니다.",
        en: "Admin and upgrade functions are time-locked so users can exit before any change takes effect.",
      },
      {
        ko: "버그 바운티 프로그램으로 책임 있는 취약점 공개를 장려합니다.",
        en: "A bug bounty program encourages responsible vulnerability disclosure.",
      },
    ],
  },
  {
    title: { ko: "RBT backing 리스크", en: "RBT backing risk" },
    detail: {
      ko: "RBT 의 시장가가 backing 가치 (NAV) 보다 낮은 구간이 일시적으로 발생할 수 있습니다. 또한 Genesis Phase 1 에서는 본드 약정 시 10퍼센트 protocol fee 가 발생해 RBT 의 backing 은 1대 1 보다 낮을 수 있다고 docs 가 명시합니다.",
      en: "RBT market price can dip below backing value (NAV) for periods. The docs also note that Genesis Phase 1 charges a 10% protocol fee at bond commit, so RBT backing can run lower than 1-to-1.",
    },
    mitigations: [
      {
        ko: "트레저리는 온체인에서 검증 가능합니다.",
        en: "Treasury is verifiable on-chain.",
      },
      {
        ko: "Liquidity Manager 가 RBT/USDm 페어에 영구 LP 를 보유합니다.",
        en: "Liquidity Manager holds permanent LP for the RBT/USDm pair.",
      },
      {
        ko: "BAM 이 시장가가 NAV 아래로 빠지면 RBT 를 매수해 burn 합니다.",
        en: "BAM buys RBT and burns when market price drops below NAV.",
      },
    ],
  },
  {
    title: { ko: "Oracle 리스크", en: "Oracle risk" },
    detail: {
      ko: "프로토콜이 가격 oracle 에 의존하므로 oracle 조작이나 stale 응답이 NAV, Bond 가격, BAM premium 캡처에 영향을 줄 수 있습니다.",
      en: "The protocol relies on price oracles. Oracle manipulation or stale responses can affect NAV, bond pricing, and BAM premium capture.",
    },
    mitigations: [
      {
        ko: "여러 oracle 제공자를 사용해 리던던시를 확보합니다.",
        en: "Multiple oracle providers used for redundancy.",
      },
      {
        ko: "Wrapper 가 stale 또는 zero 응답에 revert 합니다.",
        en: "Wrapper reverts on stale or zero responses.",
      },
    ],
  },
  {
    title: { ko: "본드 상품 고유 리스크", en: "Bond-product specific risk" },
    detail: {
      ko: "본드는 fixed-term 상품이며 docs 에 다음 리스크가 명시되어 있습니다.",
      en: "Bonds are fixed-term products. The docs spell out the following risks.",
    },
    mitigations: [
      {
        ko: "스마트 컨트랙트는 실험적 소프트웨어이므로 미발견 취약점 가능성이 있습니다.",
        en: "Smart contracts are experimental software, so undiscovered vulnerabilities are possible.",
      },
      {
        ko: "Oracle 실패나 조작 가능성이 존재합니다.",
        en: "Oracle failure or manipulation is possible.",
      },
      {
        ko: "MegaETH 체인 자체의 운영 중단이나 reorg 가능성.",
        en: "MegaETH itself can halt or reorg.",
      },
      {
        ko: "USDm 디페그 또는 유동성 고갈 가능성.",
        en: "USDm can de-peg or run out of liquidity.",
      },
      {
        ko: "RBT 시장가 변동성과 가치가 0 이 되는 시나리오 가능성.",
        en: "RBT market price can be highly volatile and could go to zero.",
      },
      {
        ko: "거버넌스 의사결정이 기존 포지션에 영향.",
        en: "Governance decisions can affect existing positions.",
      },
      {
        ko: "규제 변화가 상품 이용가능성에 영향.",
        en: "Regulatory changes can affect product availability.",
      },
      {
        ko: "본드 자본 전액 손실 가능성을 docs 가 명시합니다.",
        en: "The docs state that total loss of bond principal is possible.",
      },
    ],
  },
];

// 사용자 진입 시 구체적 손실 시나리오.
export type UserRiskScenario = {
  title: LocaleString;
  trigger: LocaleString;
  outcome: LocaleString;
  guard: LocaleString;
};

export const USER_RISKS: UserRiskScenario[] = [
  {
    title: {
      ko: "시장가 매수 후 시장가가 NAV 로 수렴",
      en: "Spot buy followed by market converging to NAV",
    },
    trigger: {
      ko: "Premium 이 큰 구간 (현재 NAV 의 3배 안팎) 에서 시장가로 RBT 를 매수했을 때 BAM 이 가격을 NAV 부근까지 끌어내리는 시나리오입니다.",
      en: "You buy RBT spot while premium is large (around 3× NAV today) and BAM pulls price down to near-NAV.",
    },
    outcome: {
      ko: "시장가가 NAV 까지 수렴하면 평균 진입가 대비 큰 손실이 발생합니다. NAV 자체는 시간이 갈수록 우상향하지만, 사용자 진입가까지 회복하는 데에는 시간이 걸립니다.",
      en: "Convergence to NAV means a large loss versus your entry. NAV trends upward over time, but recovering to your entry takes a while.",
    },
    guard: {
      ko: "Live 페이지의 verdict 가 본드 권장 또는 고평가 구간일 때는 시장가 직매수를 피하고 본드 약정으로 진입합니다.",
      en: "When the Live page verdict reads bond-only or overvalued, avoid spot buys and enter through a bond instead.",
    },
  },
  {
    title: {
      ko: "본드 만기에 시장가가 effective entry 보다 낮음",
      en: "Market price at bond maturity below effective entry",
    },
    trigger: {
      ko: "본드 약정 후 베스팅 기간 동안 RBT 시장가가 본드의 effective entry 보다 더 빠르게 떨어지는 시나리오입니다.",
      en: "RBT market price falls faster than the bond's effective entry during the vesting window.",
    },
    outcome: {
      ko: "만기에 받은 RBT 의 시장가가 약정 시 USDm 비용보다 낮아 사용자 입장에서는 손실입니다. NAV 는 잔존하지만 시장가는 일시적으로 NAV 근처일 수 있습니다.",
      en: "RBT received at maturity is worth less in market price than the USDm cost at commit. NAV survives, but market price can temporarily sit near NAV.",
    },
    guard: {
      ko: "디스카운트가 평균 위인 시점에만 진입하고, 약정 후에는 시장가 변동을 매주 점검합니다.",
      en: "Only enter when the discount is above average, and check market price weekly while the bond is open.",
    },
  },
  {
    title: {
      ko: "Commit 자본 약정 기간 동안 회수 불가",
      en: "Commit capital cannot be withdrawn during the lock",
    },
    trigger: {
      ko: "sRBT 를 Commit 으로 약정하면 만기 전까지 자본을 빼낼 수 없고, 중도 해지 시 페널티가 발생합니다.",
      en: "Once sRBT is committed, you cannot pull capital out before maturity. Early exit incurs a penalty.",
    },
    outcome: {
      ko: "긴급 자금 수요가 생기면 페널티를 감수하고 빠져나오거나 만기를 기다려야 합니다.",
      en: "If an urgent cash need shows up, you either eat the penalty or wait until maturity.",
    },
    guard: {
      ko: "정말 사용하지 않을 자본만 Commit 합니다. 24주는 약 6개월, 52주는 1년 락이 됩니다.",
      en: "Only commit capital you genuinely will not need. 24 weeks is roughly 6 months, 52 weeks is 1 year.",
    },
  },
  {
    title: {
      ko: "RBT 담보 lending 의 청산",
      en: "Liquidation of RBT used as lending collateral",
    },
    trigger: {
      ko: "RBT 를 외부 lending 에 담보로 두고 USDm 을 차입한 상태에서 RBT 시장가가 급락하는 시나리오입니다.",
      en: "You post RBT as collateral on external lending and borrow USDm, then RBT market price drops sharply.",
    },
    outcome: {
      ko: "LTV 가 청산선을 넘으면 자동 청산되어 담보의 일부 또는 전부를 상실합니다. POL 과 BAM 이 결국 가격을 받쳐주지만 청산은 즉시 이루어집니다.",
      en: "If LTV crosses the liquidation threshold, you get auto-liquidated and lose part or all of the collateral. POL and BAM eventually defend price, but liquidation happens immediately.",
    },
    guard: {
      ko: "LTV 를 보수적으로 40 퍼센트 이하로 유지하고, 가격 변동만으로 50 퍼센트에 도달하면 즉시 디레버리지합니다.",
      en: "Keep LTV conservative under 40%. If price moves alone push it to 50%, deleverage immediately.",
    },
  },
  {
    title: {
      ko: "거버넌스 파라미터 변경",
      en: "Governance parameter changes",
    },
    trigger: {
      ko: "Lock 분배 곡선, 본드 디스카운트, BAM 슬리피지 같은 파라미터가 거버넌스로 변경되는 시나리오입니다.",
      en: "Parameters like the Lock distribution curve, bond discounts, or BAM slippage get changed by governance.",
    },
    outcome: {
      ko: "기존 약정 자본의 만기 보상이 줄어들거나, 새 라운드 진입 효율이 달라집니다. docs 는 모든 만기 곡선과 cap 을 거버넌스 재량으로 명시합니다.",
      en: "Reward at maturity for existing committed capital can shrink, or new-round entry efficiency can shift. The docs state every maturity curve and cap is at governance discretion.",
    },
    guard: {
      ko: "거버넌스 포럼을 분기마다 점검하고, 분배 축소 방향이 결정되면 신규 commit 을 정지합니다.",
      en: "Check the governance forum quarterly. If a distribution-reduction direction is decided, pause new commits.",
    },
  },
  {
    title: {
      ko: "HVN 거버넌스 토큰 시드 손실",
      en: "Loss on HVN governance token seed",
    },
    trigger: {
      ko: "HVN TGE 시드에 진입한 뒤 바이백 어젠다가 부결되거나 트레저리 우선순위가 다른 곳으로 가는 시나리오입니다.",
      en: "You join the HVN TGE seed but the buyback agenda fails to pass, or treasury priorities go elsewhere.",
    },
    outcome: {
      ko: "HVN 시장가가 진입가 아래로 떨어지고 거버넌스 영향력만 남습니다.",
      en: "HVN market price falls below your entry and only governance influence remains.",
    },
    guard: {
      ko: "거버넌스 토큰은 자본의 20 퍼센트 상한을 두고, 바이백 라운드 시점이 지나면 비중을 정상화합니다.",
      en: "Cap governance tokens at 20% of capital. After the buyback-round window, normalize the weight back down.",
    },
  },
];
