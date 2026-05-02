// RBT 공정가 계산기.
// 4-layer 모델: Floor(NAV) / Yield-adjusted Fair / Bond Effective / Market.
// 사용자가 metric을 직접 입력하면 즉시 재계산. 메가에쓰 RPC 직접 호출 가능 hook은 후속 작업.

export type LiveMetrics = {
  reservesPerRBT: number; // USDm per RBT (앱 Metrics 페이지의 'Reserves per RBT')
  circulatingRBT: number; // RBT
  totalReservesUSDm: number; // = reservesPerRBT × circulatingRBT
  marketPriceUSDm: number; // RBT/USDm DEX 시장가
  liquidityUSD: number; // POL/풀 합산 깊이
  poolRBT: number; // 풀 안 RBT
  poolUSDm: number; // 풀 안 USDm
  capturedAt: string;
  source: string;
};

export type BondTerm = {
  days: number;
  discountPct: number; // 5 / 10 / 15
  tvlUSDm: number;
};

export type CommitTerm = {
  weeks: number;
  rewardPct: number; // ~15.8% for 24w
};

export type FairValueModel = {
  floor: number; // NAV (BAM이 지키는 하한)
  yieldFair: number; // NAV × (1 + forward yield)
  bondEffective: number; // 시장가에서 본드 디스카운트 + protocol fee 반영
  market: number;
  premiumToNAV: number; // %
  bondPremiumToNAV: number; // %
  yieldFairPremiumToNAV: number; // %
  poolImpliedFloor: number; // 풀 안 USDm / 풀 RBT (단순)
  forwardYieldUsed: number; // 계산에 쓴 yield rate
  protocolFee: number;
  maxBondDiscount: number;
};

// 진입 verdict — 시장가가 어느 구간에 있는지에 따른 권고.
export type EntryZone = "undervalued" | "fair" | "bond-only" | "overvalued";

export type EntryVerdict = {
  zone: EntryZone;
  label: string;
  detail: string;
  color: string;
};

export function entryVerdict(fv: FairValueModel): EntryVerdict {
  if (fv.market <= fv.floor) {
    return {
      zone: "undervalued",
      label: "저평가",
      detail:
        "시장가가 NAV 이하입니다. BAM 매수 윈도우가 열린 비대칭 진입 구간입니다.",
      color: "#3DDC97",
    };
  }
  if (fv.market <= fv.yieldFair) {
    return {
      zone: "fair",
      label: "공정",
      detail:
        "Yield-adjusted Fair 이하입니다. 본드를 거치지 않고 스팟 매수가 합리적인 구간입니다.",
      color: "#3DDC97",
    };
  }
  if (fv.market <= fv.bondEffective) {
    return {
      zone: "bond-only",
      label: "본드 권장",
      detail:
        "Bond Effective 이하입니다. 시장가 직매수보다 본드를 통한 진입이 효율적입니다.",
      color: "#F4C756",
    };
  }
  return {
    zone: "overvalued",
    label: "고평가",
    detail:
      "Bond Effective 위입니다. 본드도 비효율이며 다음 라운드를 기다리는 구간입니다.",
    color: "#FF6A4A",
  };
}

// 기본 가정 — 거버넌스나 데이터에 따라 갱신
export const DEFAULT_PROTOCOL_FEE = 0.1; // Genesis Phase 1: 10% fee at bond issuance
export const DEFAULT_FWD_STAKE_APR = 0.05; // 보수적 — 실제 stake reward rate 활성화 전
export const COMMIT_24W_REWARD = 0.158; // 앱 표시값

// 24w commit 15.8% → annualized 단순 환산 (복리 X, 보수적)
export const annualizeCommit = (weekRate: number, weeks: number) =>
  (weekRate / weeks) * 52;

// 보수적 forward yield: stake APR + commit 연환산을 평균
export const estimateForwardYield = (
  stakeApr: number = DEFAULT_FWD_STAKE_APR,
  commitWeeks: number = 24,
  commitRate: number = COMMIT_24W_REWARD,
) => {
  const commitAnnual = annualizeCommit(commitRate, commitWeeks);
  // commit은 잠금 비용이 있어 risk-adjusted: 0.6 가중
  return stakeApr + commitAnnual * 0.6;
};

export function computeFairValue(
  m: LiveMetrics,
  bonds: BondTerm[],
  opts?: {
    protocolFee?: number;
    forwardYield?: number;
  },
): FairValueModel {
  const protocolFee = opts?.protocolFee ?? DEFAULT_PROTOCOL_FEE;
  const fwdYield = opts?.forwardYield ?? estimateForwardYield();

  const floor = m.reservesPerRBT;

  // Yield-adjusted: 미래 1년치 yield의 NPV를 NAV에 더함 (단순화: 할인율 0)
  const yieldFair = floor * (1 + fwdYield);

  // Bond effective: 시장가에 본드 디스카운트 적용. fee는 트레저리에 가서 NAV에 환류
  // 사용자 입장 effective = market × (1 - discount). 그게 만기 때 받는 RBT 1개의 비용 베이스라인.
  const maxBondDiscount = Math.max(0, ...bonds.map((b) => b.discountPct)) / 100;
  const bondEffective = m.marketPriceUSDm * (1 - maxBondDiscount);

  const premiumToNAV = (m.marketPriceUSDm - floor) / floor;
  const bondPremiumToNAV = (bondEffective - floor) / floor;
  const yieldFairPremiumToNAV = (yieldFair - floor) / floor;

  // pool 단순 implied (RBT 다 던졌을 때 평균 흡수가): 풀 USDm / 풀 RBT
  const poolImpliedFloor =
    m.poolRBT > 0 ? m.poolUSDm / (m.poolRBT + m.circulatingRBT * 0.01) : 0;

  return {
    floor,
    yieldFair,
    bondEffective,
    market: m.marketPriceUSDm,
    premiumToNAV,
    bondPremiumToNAV,
    yieldFairPremiumToNAV,
    poolImpliedFloor,
    forwardYieldUsed: fwdYield,
    protocolFee,
    maxBondDiscount,
  };
}

// ===== T+1day 라이브 데이터 (2026-05-02, 앱 직접 캡처) =====

export const LIVE_METRICS: LiveMetrics = {
  reservesPerRBT: 5.23,
  circulatingRBT: 61_995,
  totalReservesUSDm: 5.23 * 61_995, // 324,234.85
  marketPriceUSDm: 18.66,
  liquidityUSD: 320_000,
  poolRBT: 8_460,
  poolUSDm: 162_590,
  capturedAt: "2026-05-02 ~05:00 KST (Metrics) · ~14:43 (Pool)",
  source: "Blackhaven Metrics + Kumbaya pool",
};

export const LIVE_BONDS: BondTerm[] = [
  { days: 7, discountPct: 5.0, tvlUSDm: 140_980 },
  { days: 14, discountPct: 10.0, tvlUSDm: 25_740 },
  { days: 30, discountPct: 15.0, tvlUSDm: 165_040 },
];

export const LIVE_COMMITS: CommitTerm[] = [
  { weeks: 2, rewardPct: 1.3 },
  { weeks: 12, rewardPct: 7.9 },
  { weeks: 24, rewardPct: 15.8 }, // 앱에서 확인된 값
  { weeks: 52, rewardPct: 34.0 }, // 24w 곡선 보수적 외삽
];

export const STAKE_TVL_USD = 42_050; // Stake 페이지 TVL
