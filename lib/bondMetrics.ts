// 본드 TVL 메트릭과 권장 진입 사이즈 계산.
// 현재 데이터는 앱 Bonds 페이지에서 수기로 동기화한 정적 값입니다.
// 컨트랙트 주소가 확보되면 useBondMetrics hook 내부만 onchain fetch 로 교체하면 됩니다.

import { BondTerm, LIVE_BONDS } from "@/lib/fairValue";

export type BondMetric = BondTerm & {
  // TVL 의 5퍼센트 — 큰 자본 진입 시 디스카운트가 빠르게 잠식되는 임계점입니다.
  recommendedMaxUSDm: number;
  // 디스카운트 1퍼센트당 풀 깊이 (USDm). 작을수록 풀이 얕아 변동성이 큽니다.
  depthPerDiscountPoint: number;
  // 본드 풀 깊이 등급. 작은 풀은 selecting 시 사용자에게 경고로 표시합니다.
  depthTier: "deep" | "medium" | "shallow";
};

export type BondSnapshot = {
  bonds: BondMetric[];
  totalTVLUSDm: number;
  capturedAt: string;
  source: "static" | "onchain";
};

const RECOMMEND_RATIO = 0.05; // TVL 의 5퍼센트 권장
const SHALLOW_THRESHOLD = 50_000; // $50K 미만은 shallow
const DEEP_THRESHOLD = 150_000; // $150K 이상은 deep

export function computeBondMetrics(bonds: BondTerm[]): BondMetric[] {
  return bonds.map((b) => {
    const recommendedMaxUSDm = b.tvlUSDm * RECOMMEND_RATIO;
    const depthPerDiscountPoint =
      b.discountPct > 0 ? b.tvlUSDm / b.discountPct : 0;
    const depthTier: BondMetric["depthTier"] =
      b.tvlUSDm >= DEEP_THRESHOLD
        ? "deep"
        : b.tvlUSDm >= SHALLOW_THRESHOLD
          ? "medium"
          : "shallow";
    return {
      ...b,
      recommendedMaxUSDm,
      depthPerDiscountPoint,
      depthTier,
    };
  });
}

export function buildBondSnapshot(
  bonds: BondTerm[] = LIVE_BONDS,
  source: BondSnapshot["source"] = "static",
): BondSnapshot {
  const computed = computeBondMetrics(bonds);
  return {
    bonds: computed,
    totalTVLUSDm: bonds.reduce((s, b) => s + b.tvlUSDm, 0),
    capturedAt: new Date().toISOString(),
    source,
  };
}

// 자본 규모별 추천 본드.
export type CapitalTier = "small" | "medium" | "large";

export type CapitalRange = {
  tier: CapitalTier;
  label: string;
  range: string;
  guidance: string;
};

export function recommendBond(
  capitalUSDm: number,
  bonds: BondMetric[],
): { picked: BondMetric; reason: string } {
  // 가장 큰 디스카운트부터 보면서 capitalUSDm 이 recommendedMaxUSDm 이내인 본드 선택
  const sorted = [...bonds].sort((a, b) => b.discountPct - a.discountPct);
  for (const b of sorted) {
    if (capitalUSDm <= b.recommendedMaxUSDm) {
      return {
        picked: b,
        reason: `${b.days} 일 본드의 풀 ($${(b.tvlUSDm / 1000).toFixed(1)}K) 깊이 안에서 디스카운트 ${b.discountPct}퍼센트가 보전되는 사이즈입니다.`,
      };
    }
  }
  // 모든 본드의 권장 max 를 초과하는 자본 — 가장 깊은 풀로 분산 권장
  const deepest = bonds.reduce((p, c) => (c.tvlUSDm > p.tvlUSDm ? c : p), bonds[0]);
  return {
    picked: deepest,
    reason: `자본이 모든 본드의 권장 max 를 초과합니다. 가장 깊은 풀인 ${deepest.days} 일 본드로 분산하거나 여러 본드에 나누어 진입하세요.`,
  };
}

export const CAPITAL_TIERS: CapitalRange[] = [
  {
    tier: "small",
    label: "Small",
    range: "1K USDm 이하",
    guidance:
      "모든 만기 본드를 자유롭게 사용할 수 있습니다. 14 일 본드의 디스카운트 10퍼센트가 underrated 입니다.",
  },
  {
    tier: "medium",
    label: "Medium",
    range: "1K ~ 10K USDm",
    guidance:
      "30 일 본드를 메인으로, 14 일은 풀 깊이 안에서만 보조로 사용합니다. 7 일은 짧은 회전용입니다.",
  },
  {
    tier: "large",
    label: "Large",
    range: "10K USDm 이상",
    guidance:
      "30 일과 7 일에 분산합니다. 14 일은 풀 깊이가 얕아 디스카운트 잠식 위험이 큽니다.",
  },
];
