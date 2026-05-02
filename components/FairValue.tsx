"use client";

import { useMemo, useState } from "react";
import {
  computeFairValue,
  LIVE_BONDS,
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

  const domainMax = fv.market * 1.1;
  const xPct = (v: number) => (v / domainMax) * 100;

  const layers = [
    {
      key: "floor",
      label: "Floor (NAV)",
      value: fv.floor,
      color: "#3DDC97",
      description:
        "Reserves per RBT 입니다. 시장가가 이 아래로 빠지면 BAM이 매수와 소각으로 받쳐주는 하한선입니다.",
    },
    {
      key: "yieldFair",
      label: "Yield-adjusted Fair",
      value: fv.yieldFair,
      color: "#7C6BFF",
      description: `NAV에 1 더하기 ${pct(fwdYield)} 를 곱한 값입니다. Stake와 Commit으로 받을 1년치 forward yield 의 NPV를 floor 에 더한 보수적 공정가입니다.`,
    },
    {
      key: "bondEffective",
      label: "Bond Effective",
      value: fv.bondEffective,
      color: "#FF6A1F",
      description: `시장가에 1 빼기 ${pct(fv.maxBondDiscount)} 를 곱한 값입니다. 30일 본드로 들어가 만기에 받게 되는 RBT 1개당 effective 비용입니다.`,
    },
    {
      key: "market",
      label: "Market",
      value: fv.market,
      color: "#FFFFFF",
      description: "현재 RBT 와 USDm 의 시장가입니다.",
    },
  ];

  const yieldButtons = [
    { id: "conservative" as const, label: "Conservative", sub: "stake APR 만 반영합니다" },
    { id: "base" as const, label: "Base", sub: "commit 을 0.6배 가중합니다" },
    { id: "aggressive" as const, label: "Aggressive", sub: "commit 을 1.2배 가중합니다" },
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
              >
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    live.error ? "bg-ember-500" : "bg-jade-400 animate-pulse",
                  ].join(" ")}
                />
                {live.error ? "stale" : "live, 60s polling"}
              </span>
            </div>
            <h2 className="mt-3 text-[22px] font-semibold tracking-tight text-white">
              RBT 공정가는 얼마일까요
            </h2>
            <p className="mt-1.5 text-[12.5px] text-mist-300 max-w-2xl leading-relaxed">
              하나의 정답 가격이 아니라{" "}
              <span className="text-white">네 단계의 가격대</span>로 봅니다. 각 단계는 서로 다른 가정에서 나오는 다른 종류의 공정함입니다.
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

        <div className="mt-6">
          <div className="relative h-32 rounded-lg bg-gradient-to-r from-jade-500/10 via-violet-500/10 to-ember-500/10 border border-white/5">
            {[0, 25, 50, 75, 100].map((p) => (
              <div
                key={p}
                className="absolute top-0 bottom-0 w-px bg-white/5"
                style={{ left: `${p}%` }}
              />
            ))}

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
                    {l.label} {fmt(l.value)}
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
                  <span className="text-[12px] text-mist-400 font-mono">USDm</span>
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

        <div className="mt-6 grid md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-jade-500/20 bg-jade-500/5 p-4">
            <div className="text-[10.5px] uppercase tracking-wider font-mono text-jade-400 mb-1.5">
              사용자 진입 결론
            </div>
            <ul className="space-y-1.5 text-[12.5px] text-mist-100 leading-relaxed">
              <li>
                <span className="text-mist-400">Floor: </span>NAV {fmt(fv.floor)} 이며{" "}
                <span className="text-white">절대 하한</span>입니다.
              </li>
              <li>
                <span className="text-mist-400">Fair: </span>Yield-adjusted{" "}
                {fmt(fv.yieldFair)} 이며{" "}
                <span className="text-white">합리적 진입 상한</span>입니다.
              </li>
              <li>
                <span className="text-mist-400">Bond: </span>Effective{" "}
                {fmt(fv.bondEffective)} 이며{" "}
                <span className="text-white">시장가 진입의 마지노선</span>입니다.
              </li>
              <li>
                <span className="text-mist-400">Market: </span>
                {fmt(fv.market)} 이며 현재 NAV의{" "}
                <span style={{ color: "#FF8A4C" }}>
                  {fmt(fv.market / fv.floor, 2)}배
                </span>{" "}
                입니다.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-ember-500/20 bg-ember-500/5 p-4">
            <div className="text-[10.5px] uppercase tracking-wider font-mono text-ember-400 mb-1.5">
              어떤 가격대에 진입하느냐
            </div>
            <ul className="space-y-1.5 text-[12.5px] text-mist-100 leading-relaxed">
              <li>
                <span className="text-white">Floor 이하</span>의 가격에서는 BAM 매수 윈도우가 열려 비대칭이 가장 큽니다.
              </li>
              <li>
                <span className="text-white">Floor 와 Yield-fair 사이</span>에서는 본드를 거치지 않고 시장가 진입이 가능합니다.
              </li>
              <li>
                <span className="text-white">Yield-fair 와 Bond Effective 사이</span>에서는 본드를 통해서만 진입합니다.
              </li>
              <li>
                <span className="text-white">Bond Effective 와 Market 사이</span>는 패스하고 다음 라운드를 기다립니다.
              </li>
            </ul>
          </div>
        </div>

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
                {pct(fv.maxBondDiscount, 0)} (30일 본드)
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
            Live metrics 은 다음과 같습니다. Reserves per RBT{" "}
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
            </span>{" "}
            (마지막 갱신 {formatRelative(live.lastUpdated)}), Stake TVL{" "}
            <span className="text-white font-mono">
              ${STAKE_TVL_USD.toLocaleString()}
            </span>
            . Forward yield 는 stake APR 과 commit annualized 의 가중합으로 계산하며, 온체인 또는 attestation 을 통해 갱신할 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
