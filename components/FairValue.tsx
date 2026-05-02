"use client";

import { useMemo, useState } from "react";
import {
  computeFairValue,
  LIVE_BONDS,
  LIVE_COMMITS,
  STAKE_TVL_USD,
  estimateForwardYield,
  DEFAULT_PROTOCOL_FEE,
  DEFAULT_FWD_STAKE_APR,
  COMMIT_24W_REWARD,
} from "@/lib/fairValue";
import { formatRelative, useLiveMetrics } from "@/lib/useLiveMetrics";

const fmt = (n: number, digits = 2) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const pct = (n: number, digits = 1) =>
  `${n >= 0 ? "+" : ""}${(n * 100).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;

export default function FairValue() {
  const [yieldMode, setYieldMode] = useState<
    "conservative" | "base" | "aggressive"
  >("base");
  const live = useLiveMetrics(60_000);

  const fwdYield = useMemo(() => {
    if (yieldMode === "conservative") return DEFAULT_FWD_STAKE_APR;
    if (yieldMode === "aggressive")
      return estimateForwardYield(0.1, 24, COMMIT_24W_REWARD * 1.2);
    return estimateForwardYield();
  }, [yieldMode]);

  const fv = useMemo(
    () =>
      computeFairValue(live.metrics, LIVE_BONDS, {
        protocolFee: DEFAULT_PROTOCOL_FEE,
        forwardYield: fwdYield,
      }),
    [fwdYield, live.metrics],
  );

  // 가격 라인의 도메인: 0 ~ market×1.1 (헤드룸)
  const domainMax = fv.market * 1.1;
  const xPct = (v: number) => (v / domainMax) * 100;

  const layers = [
    {
      key: "floor",
      label: "Floor (NAV)",
      value: fv.floor,
      color: "#3DDC97",
      description:
        "Reserves per RBT. BAM이 이 아래로 빠지면 매수→burn으로 받쳐주는 하한선.",
    },
    {
      key: "yieldFair",
      label: "Yield-adjusted Fair",
      value: fv.yieldFair,
      color: "#7C6BFF",
      description: `NAV × (1 + ${pct(fwdYield)}). Stake/Commit으로 받을 1년치 forward yield의 NPV를 floor에 더한 보수적 공정가.`,
    },
    {
      key: "bondEffective",
      label: "Bond Effective",
      value: fv.bondEffective,
      color: "#FF6A1F",
      description: `시장가 × (1 − ${pct(fv.maxBondDiscount)}). 30d 본드로 들어가서 만기에 받게 되는 RBT 1개당 effective 비용.`,
    },
    {
      key: "market",
      label: "Market",
      value: fv.market,
      color: "#FFFFFF",
      description: "현재 RBT/USDm 시장가.",
    },
  ];

  const yieldButtons = [
    { id: "conservative" as const, label: "Conservative", sub: "stake APR만" },
    { id: "base" as const, label: "Base", sub: "commit 0.6× 가중" },
    { id: "aggressive" as const, label: "Aggressive", sub: "commit 1.2× 가중" },
  ];

  return (
    <section id="fair" className="max-w-6xl mx-auto px-6 pb-12">
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-jade-400 via-violet-500 to-ember-500" />

        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="chip">RBT Fair Value</span>
              <span className="chip">4-layer model</span>
              <span
                className="chip"
                style={{
                  color: live.error ? "#FF8A4C" : "#3DDC97",
                  borderColor: live.error ? "#FF8A4C40" : "#3DDC9740",
                }}
                title="60s polling on /api/metrics"
              >
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    live.error ? "bg-ember-500" : "bg-jade-400 animate-pulse",
                  ].join(" ")}
                />
                {live.error ? "stale" : "live · 60s"}
              </span>
            </div>
            <h2 className="mt-3 text-[22px] font-semibold tracking-tight text-white">
              RBT 공정가는 얼마인가?
            </h2>
            <p className="mt-1.5 text-[12.5px] text-mist-300 max-w-2xl leading-relaxed">
              하나의 ‘정답’ 가격이 아니라{" "}
              <span className="text-white">네 단계의 가격대</span>로 봅니다. 각
              단계는 다른 가정에서 나오는 다른 종류의 ‘공정함’.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-[11px]">
            <span className="text-mist-400 font-mono mr-2">Forward yield</span>
            {yieldButtons.map((b) => (
              <button
                key={b.id}
                onClick={() => setYieldMode(b.id)}
                className={[
                  "px-2.5 py-1 rounded-md font-mono transition-all",
                  yieldMode === b.id
                    ? "bg-ink-700/80 text-white shadow-ring"
                    : "text-mist-400 hover:text-white",
                ].join(" ")}
                title={b.sub}
              >
                {b.label}
              </button>
            ))}
          </div>
        </header>

        {/* 가격 라인 시각화 */}
        <div className="mt-6">
          <div className="relative h-32 rounded-lg bg-gradient-to-r from-jade-500/10 via-violet-500/10 to-ember-500/10 border border-white/5">
            {/* 배경 그리드 */}
            {[0, 25, 50, 75, 100].map((p) => (
              <div
                key={p}
                className="absolute top-0 bottom-0 w-px bg-white/5"
                style={{ left: `${p}%` }}
              />
            ))}

            {/* layer markers */}
            {layers.map((l, i) => (
              <div
                key={l.key}
                className="absolute"
                style={{
                  left: `${xPct(l.value)}%`,
                  top: 0,
                  bottom: 0,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="relative h-full">
                  <div
                    className="absolute top-0 bottom-0 w-px"
                    style={{ background: l.color, opacity: 0.55 }}
                  />
                  <div
                    className="absolute -translate-x-1/2 rounded-md px-2 py-1 text-[10.5px] font-mono shadow-glow whitespace-nowrap"
                    style={{
                      background: "#0B0D12",
                      border: `1px solid ${l.color}55`,
                      color: l.color,
                      top: i % 2 === 0 ? 4 : "auto",
                      bottom: i % 2 === 0 ? "auto" : 4,
                    }}
                  >
                    {l.label} · {fmt(l.value)}
                  </div>
                  <div
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full ring-2 ring-ink-900"
                    style={{ background: l.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-mist-500 font-mono">
            <span>0</span>
            <span>{fmt(domainMax / 4)}</span>
            <span>{fmt(domainMax / 2)}</span>
            <span>{fmt((domainMax * 3) / 4)}</span>
            <span>{fmt(domainMax)} USDm/RBT</span>
          </div>
        </div>

        {/* layer 분해 카드 */}
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {layers.map((l) => {
            const premium = (l.value - fv.floor) / fv.floor;
            return (
              <div
                key={l.key}
                className="rounded-lg p-4 border"
                style={{
                  background: `${l.color}08`,
                  borderColor: `${l.color}30`,
                }}
              >
                <div
                  className="text-[10.5px] uppercase tracking-wider font-mono"
                  style={{ color: l.color }}
                >
                  {l.label}
                </div>
                <div className="mt-1 text-[22px] font-semibold tracking-tight text-white">
                  {fmt(l.value)}{" "}
                  <span className="text-[12px] text-mist-400 font-mono">
                    USDm
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-mist-300 font-mono">
                  vs NAV{" "}
                  <span style={{ color: premium > 0 ? "#FF8A4C" : "#3DDC97" }}>
                    {pct(premium)}
                  </span>
                </div>
                <p className="mt-2 text-[11.5px] text-mist-300 leading-relaxed">
                  {l.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* 결론 박스 */}
        <div className="mt-6 grid md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-jade-500/20 bg-jade-500/5 p-4">
            <div className="text-[10.5px] uppercase tracking-wider font-mono text-jade-400 mb-1.5">
              ✓ 사용자 진입 결론
            </div>
            <ul className="space-y-1.5 text-[12.5px] text-mist-100 leading-relaxed">
              <li>
                <span className="text-mist-400">Floor: </span>NAV{" "}
                {fmt(fv.floor)} — <span className="text-white">절대 하한</span>
              </li>
              <li>
                <span className="text-mist-400">Fair: </span>Yield-adjusted{" "}
                {fmt(fv.yieldFair)} —{" "}
                <span className="text-white">합리적 진입 상한</span>
              </li>
              <li>
                <span className="text-mist-400">Bond: </span>Effective{" "}
                {fmt(fv.bondEffective)} —{" "}
                <span className="text-white">시장가 진입의 마지노선</span>
              </li>
              <li>
                <span className="text-mist-400">Market: </span>
                {fmt(fv.market)} —{" "}
                <span style={{ color: "#FF8A4C" }}>
                  현재 NAV의 {fmt(fv.market / fv.floor, 2)}×
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-ember-500/20 bg-ember-500/5 p-4">
            <div className="text-[10.5px] uppercase tracking-wider font-mono text-ember-400 mb-1.5">
              ⚠ 어떤 가격대에 진입하느냐
            </div>
            <ul className="space-y-1.5 text-[12.5px] text-mist-100 leading-relaxed">
              <li>
                <span className="text-white">≤ Floor</span>: BAM 매수 윈도우 —
                비대칭 최대
              </li>
              <li>
                <span className="text-white">Floor ~ Yield-fair</span>: 본드 안
                거치고 시장가로 OK
              </li>
              <li>
                <span className="text-white">Yield-fair ~ Bond</span>: 무조건
                본드를 통해서만
              </li>
              <li>
                <span className="text-white">Bond ~ Market</span>: 패스. 다음
                라운드 대기
              </li>
            </ul>
          </div>
        </div>

        {/* 가정 표 */}
        <div className="mt-5 pt-4 border-t hairline">
          <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono mb-2">
            계산에 쓴 가정
          </div>
          <div className="grid md:grid-cols-3 gap-2 text-[11.5px] font-mono">
            <div className="rounded-md bg-ink-700/40 p-2.5">
              <div className="text-mist-400">Forward yield</div>
              <div className="mt-0.5 text-white">
                {pct(fwdYield)} ({yieldMode})
              </div>
            </div>
            <div className="rounded-md bg-ink-700/40 p-2.5">
              <div className="text-mist-400">Max bond discount</div>
              <div className="mt-0.5 text-white">
                {pct(fv.maxBondDiscount, 0)} (30d bond)
              </div>
            </div>
            <div className="rounded-md bg-ink-700/40 p-2.5">
              <div className="text-mist-400">Protocol fee</div>
              <div className="mt-0.5 text-white">
                {pct(fv.protocolFee, 0)} (Genesis Phase 1)
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-mist-400 leading-relaxed">
            Live metrics: Reserves/RBT{" "}
            <span className="text-white font-mono">
              {live.metrics.reservesPerRBT} USDm
            </span>
            , Circulating{" "}
            <span className="text-white font-mono">
              {live.metrics.circulatingRBT.toLocaleString()} RBT
            </span>
            , Market{" "}
            <span className="text-white font-mono">
              {live.metrics.marketPriceUSDm.toFixed(2)} USDm
            </span>
            <span className="text-jade-400 ml-1" title="60s polling">
              ●
            </span>{" "}
            (updated {formatRelative(live.lastUpdated)}), Stake TVL{" "}
            <span className="text-white font-mono">
              ${STAKE_TVL_USD.toLocaleString()}
            </span>
            . Forward yield는 stake APR + commit annualized × 가중치. on-chain
            직접 검증 또는 attestation으로 갱신 가능.
          </p>
        </div>
      </div>
    </section>
  );
}
