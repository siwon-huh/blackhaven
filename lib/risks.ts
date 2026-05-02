// Blackhaven Risks 데이터.
// 출처: Zellic Smart Contract Security Assessment (2026-01-19), docs.blackhaven.xyz Risks

export type Severity = "Medium" | "Low" | "Informational";
export type FindingStatus = "fixed" | "acknowledged";

export type AuditFinding = {
  id: string;
  title: string;
  target: string;
  severity: Severity;
  category: string;
  summary: string;
  remediation: { status: FindingStatus; commit?: string; note?: string };
};

// Zellic 보고서가 명시한 11 findings.
export const AUDIT_FINDINGS: AuditFinding[] = [
  {
    id: "F1",
    title: "Bond uses global vestingTerm instead of per-bond vesting",
    target: "Bond.sol",
    severity: "Medium",
    category: "Business Logic",
    summary:
      "redeem 과 redeemEarly, getBondInfo 가 전역 terms.vestingTerm 을 사용해 owner 가 값을 바꾸면 기존 본드의 만기와 early-exit 정산이 영향을 받을 수 있었습니다. per-bond vesting 으로 수정되었습니다.",
    remediation: { status: "fixed", commit: "7a9b7526" },
  },
  {
    id: "F2",
    title: "Missing oracle staleness validation",
    target: "BackingCalculator.sol",
    severity: "Medium",
    category: "Business Logic",
    summary:
      "BackingCalculator 가 IOracle.getPrice 를 staleness check 없이 소비합니다. oracle 이 stale 응답을 주면 NAV 와 Bond 가격, BAM premium 캡처가 잘못된 데이터로 동작할 수 있습니다. Blackhaven 은 stale/zero 시 revert 하는 wrapper 를 사용하도록 docs 에 명시했습니다.",
    remediation: {
      status: "acknowledged",
      commit: "fd7f5a3a",
      note: "oracle wrapper 에 staleness check 적용 계획",
    },
  },
  {
    id: "F3",
    title: "Oracle implementations must normalize to 1e18 decimals",
    target: "BackingCalculator.sol",
    severity: "Medium",
    category: "Business Logic",
    summary:
      "BackingCalculator 가 oracle 응답을 1e18 단위로 가정합니다. Redstone 의 USDC/USD 같은 8 decimals 피드를 그대로 쓰면 NAV 가 10^10 단위로 어긋날 수 있습니다. 1e18 정규화 wrapper 를 사용하기로 했습니다.",
    remediation: {
      status: "acknowledged",
      commit: "8f4dcb6c",
      note: "wrapper 가 1e18 로 정규화하기로 명시",
    },
  },
  {
    id: "F4",
    title: "BAM 의 collectPremium 이 유동성 부족으로 실패할 수 있음",
    target: "BAM.sol",
    severity: "Low",
    category: "Protocol Risks",
    summary:
      "BAM 이 RBT 를 Uniswap V3 에서 USDM 으로 swap 할 때 default 5퍼센트 슬리피지 허용을 씁니다. POL 깊이가 얕아지면 swap 이 revert 되어 premium 캡처가 일시적으로 멈출 수 있습니다.",
    remediation: {
      status: "acknowledged",
      note: "maxSupplyPercentBps 로 swap 사이즈 제한, slippageToleranceBps 동적 조정 가능",
    },
  },
  {
    id: "F5",
    title: "BAM 의 collectPremium 이 샌드위치 공격에 취약",
    target: "BAM.sol",
    severity: "Low",
    category: "Protocol Risks",
    summary:
      "기본 5퍼센트 슬리피지 안에서 MEV 공격자가 collectPremium 거래를 샌드위치할 수 있습니다. swap 사이즈가 제한적이라 실 손실은 작지만 누적되면 backing 적립 효율이 떨어집니다.",
    remediation: {
      status: "acknowledged",
      note: "MEV 모니터링 후 slippageToleranceBps 조정",
    },
  },
  {
    id: "F6",
    title: "LiquidityManager 가 onERC721Received 콜백을 구현하지 않음",
    target: "LiquidityManager.sol",
    severity: "Informational",
    category: "Business Logic",
    summary:
      "Uniswap V3 LP NFT 를 safeTransferFrom 으로 보내면 revert 됩니다. ERC721 best practice 를 따라 onERC721Received 콜백을 추가했습니다.",
    remediation: { status: "fixed", commit: "0d1f25ce" },
  },
  {
    id: "F7",
    title: "RBTNote dust 예치가 0 yield 를 만들 수 있음",
    target: "RBTNote.sol",
    severity: "Informational",
    category: "Business Logic",
    summary:
      "calculateYield 의 정수 나눗셈 때문에 약 129 wei 이하의 본드는 yield 가 0 으로 잘립니다. 사용자가 RBT 를 묶어두지만 만기에 yield 가 없는 NFT 가 발행될 수 있었습니다.",
    remediation: { status: "fixed", commit: "48e46f5a" },
  },
  {
    id: "F8",
    title: "RBTNote calculateSlash 의 정밀도 손실로 만기 직전 페널티 회피 가능",
    target: "RBTNote.sol",
    severity: "Informational",
    category: "Business Logic",
    summary:
      "만기 직전 매우 짧은 시간 (2주 약정 기준 약 2분, 52주 기준 약 52분) 안에 early exit 하면 슬래시 페널티가 0 으로 잘립니다. 다만 yield 도 함께 잃기에 경제적으로는 비합리적입니다.",
    remediation: { status: "acknowledged" },
  },
  {
    id: "F9",
    title: "BackingCalculator 의 사용되지 않는 lastBacking 변수",
    target: "BackingCalculator.sol",
    severity: "Informational",
    category: "Coding Mistakes",
    summary:
      "addBacking 이 lastBacking 을 저장하지만 어디에서도 읽지 않습니다. 가스 낭비 외 영향은 없습니다.",
    remediation: { status: "fixed", commit: "b253a713" },
  },
  {
    id: "F10",
    title: "코드베이스 전반의 일관되지 않은 decimal 처리",
    target: "Multiple contracts",
    severity: "Informational",
    category: "Coding Mistakes",
    summary:
      "여러 컨트랙트가 18 decimals 를 가정하고 있어 다른 decimals 의 backing 토큰이 추가되면 계산이 어긋날 수 있습니다.",
    remediation: { status: "acknowledged" },
  },
  {
    id: "F11",
    title: "backing 토큰을 제거하는 메커니즘이 없음",
    target: "BackingCalculator.sol",
    severity: "Informational",
    category: "Discussion",
    summary:
      "backing 토큰을 추가하는 함수는 있지만 제거하는 함수가 없습니다. 잘못된 토큰을 추가하면 영구적으로 NAV 계산에 포함됩니다.",
    remediation: { status: "acknowledged" },
  },
];

// docs.blackhaven.xyz/risks 의 Risk 섹션 정리.
export type ProtocolRisk = {
  title: string;
  detail: string;
  mitigations: string[];
};

export const PROTOCOL_RISKS: ProtocolRisk[] = [
  {
    title: "스마트 컨트랙트 리스크",
    detail:
      "모든 디파이 프로토콜이 가지는 컨트랙트 취약점 리스크가 있습니다. 외부 감사를 받았더라도 미발견 취약점이 남을 수 있습니다.",
    mitigations: [
      "Zellic 의 외부 감사 (2026-01) 를 거쳤으며 모든 finding 이 fixed 또는 acknowledged 상태입니다.",
      "관리자 권한과 업그레이드 함수에 time-lock 이 적용되어 사용자가 변경 전에 빠져나올 수 있습니다.",
      "버그 바운티 프로그램으로 책임 있는 취약점 공개를 장려합니다.",
    ],
  },
  {
    title: "RBT backing 리스크",
    detail:
      "RBT 의 시장가가 backing 가치 (NAV) 보다 낮은 구간이 일시적으로 발생할 수 있습니다. 또한 Genesis Phase 1 에서는 본드 약정 시 10퍼센트 protocol fee 가 발생해 RBT 의 backing 은 1대 1 보다 낮을 수 있다고 docs 가 명시합니다.",
    mitigations: [
      "트레저리는 온체인에서 검증 가능합니다.",
      "Liquidity Manager 가 RBT/USDm 페어에 영구 LP 를 보유합니다.",
      "BAM 이 시장가가 NAV 아래로 빠지면 RBT 를 매수해 burn 합니다.",
    ],
  },
  {
    title: "Oracle 리스크",
    detail:
      "프로토콜이 가격 oracle 에 의존하므로 oracle 조작이나 stale 응답이 NAV, Bond 가격, BAM premium 캡처에 영향을 줄 수 있습니다.",
    mitigations: [
      "여러 oracle 제공자를 사용해 리던던시를 확보합니다.",
      "Wrapper 가 stale 또는 zero 응답에 revert 합니다.",
    ],
  },
  {
    title: "본드 상품 고유 리스크",
    detail:
      "본드는 fixed-term 상품이며 docs 에 다음 리스크가 명시되어 있습니다.",
    mitigations: [
      "스마트 컨트랙트는 실험적 소프트웨어이므로 미발견 취약점 가능성이 있습니다.",
      "Oracle 실패나 조작 가능성이 존재합니다.",
      "MegaETH 체인 자체의 운영 중단이나 reorg 가능성.",
      "USDm 디페그 또는 유동성 고갈 가능성.",
      "RBT 시장가 변동성과 가치가 0 이 되는 시나리오 가능성.",
      "거버넌스 의사결정이 기존 포지션에 영향.",
      "규제 변화가 상품 이용가능성에 영향.",
      "본드 자본 전액 손실 가능성을 docs 가 명시합니다.",
    ],
  },
];

// 사용자 진입 시 구체적 손실 시나리오.
export type UserRiskScenario = {
  title: string;
  trigger: string;
  outcome: string;
  guard: string;
};

export const USER_RISKS: UserRiskScenario[] = [
  {
    title: "시장가 매수 후 시장가가 NAV 로 수렴",
    trigger:
      "Premium 이 큰 구간 (현재 NAV 의 3배 안팎) 에서 시장가로 RBT 를 매수했을 때 BAM 이 가격을 NAV 부근까지 끌어내리는 시나리오입니다.",
    outcome:
      "시장가가 NAV 까지 수렴하면 평균 진입가 대비 큰 손실이 발생합니다. NAV 자체는 시간이 갈수록 우상향하지만, 사용자 진입가까지 회복하는 데에는 시간이 걸립니다.",
    guard:
      "Live 페이지의 verdict 가 본드 권장 또는 고평가 구간일 때는 시장가 직매수를 피하고 본드 약정으로 진입합니다.",
  },
  {
    title: "본드 만기에 시장가가 effective entry 보다 낮음",
    trigger:
      "본드 약정 후 베스팅 기간 동안 RBT 시장가가 본드의 effective entry 보다 더 빠르게 떨어지는 시나리오입니다.",
    outcome:
      "만기에 받은 RBT 의 시장가가 약정 시 USDm 비용보다 낮아 사용자 입장에서는 손실입니다. NAV 는 잔존하지만 시장가는 일시적으로 NAV 근처일 수 있습니다.",
    guard:
      "디스카운트가 평균 위인 시점에만 진입하고, 약정 후에는 시장가 변동을 매주 점검합니다.",
  },
  {
    title: "Commit 자본 약정 기간 동안 회수 불가",
    trigger:
      "sRBT 를 Commit 으로 약정하면 만기 전까지 자본을 빼낼 수 없고, 중도 해지 시 페널티가 발생합니다.",
    outcome:
      "긴급 자금 수요가 생기면 페널티를 감수하고 빠져나오거나 만기를 기다려야 합니다.",
    guard:
      "정말 사용하지 않을 자본만 Commit 합니다. 24주는 약 6개월, 52주는 1년 락이 됩니다.",
  },
  {
    title: "RBT 담보 lending 의 청산",
    trigger:
      "RBT 를 외부 lending 에 담보로 두고 USDm 을 차입한 상태에서 RBT 시장가가 급락하는 시나리오입니다.",
    outcome:
      "LTV 가 청산선을 넘으면 자동 청산되어 담보의 일부 또는 전부를 상실합니다. POL 과 BAM 이 결국 가격을 받쳐주지만 청산은 즉시 이루어집니다.",
    guard:
      "LTV 를 보수적으로 40 퍼센트 이하로 유지하고, 가격 변동만으로 50 퍼센트에 도달하면 즉시 디레버리지합니다.",
  },
  {
    title: "거버넌스 파라미터 변경",
    trigger:
      "Lock 분배 곡선, 본드 디스카운트, BAM 슬리피지 같은 파라미터가 거버넌스로 변경되는 시나리오입니다.",
    outcome:
      "기존 약정 자본의 만기 보상이 줄어들거나, 새 라운드 진입 효율이 달라집니다. docs 는 모든 만기 곡선과 cap 을 거버넌스 재량으로 명시합니다.",
    guard:
      "거버넌스 포럼을 분기마다 점검하고, 분배 축소 방향이 결정되면 신규 commit 을 정지합니다.",
  },
  {
    title: "HVN 거버넌스 토큰 시드 손실",
    trigger:
      "HVN TGE 시드에 진입한 뒤 바이백 어젠다가 부결되거나 트레저리 우선순위가 다른 곳으로 가는 시나리오입니다.",
    outcome:
      "HVN 시장가가 진입가 아래로 떨어지고 거버넌스 영향력만 남습니다.",
    guard:
      "거버넌스 토큰은 자본의 20 퍼센트 상한을 두고, 바이백 라운드 시점이 지나면 비중을 정상화합니다.",
  },
];
