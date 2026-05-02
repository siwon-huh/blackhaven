"use client";

import { useMemo, useState } from "react";
import { CAPITAL_TIERS, recommendBond } from "@/lib/bondMetrics";
import { useBondMetrics } from "@/lib/useBondMetrics";
import { formatRelative } from "@/lib/useLiveMetrics";

const QUICK_AMOUNTS = [500, 2_500, 10_000, 50_000];

const fmtUsd = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
      ? `$${(n / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}K`
      : `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export default function CapitalGuide() {
  const live = useBondMetrics(5_000);
  const [capital, setCapital] = useState<number>(2_500);

  const recommendation = useMemo(
    () => recommendBond(capital, live.snapshot.bonds),
    [capital, live.snapshot.bonds],
  );

  return (
    <section className="max-w-6xl mx-auto px-6 pb-12">
      <div className="mb-5">
        <div className="eyebrow">Capital sizing</div>
        <h2 className="mt-2 text-[26px] headline text-ink-50">
          자본 규모와 본드 풀 깊이 매칭
        </h2>
        <p className="mt-2 text-[13px] text-ink-300 max-w-2xl leading-relaxed">
          본드 풀 깊이 (TVL) 의 5퍼센트를 권장 max 로 봅니다. 그 이상이 들어가면 디스카운트가 빠르게 잠식됩니다. 자본 규모를 입력하면 라이브 본드 데이터로 권장 만기를 골라줍니다.
        </p>
      </div>

      <div className="card p-6 md:p-8">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div className="eyebrow">진입 자본</div>
          <span className="text-[10px] font-mono text-ink-500">
            {live.snapshot.source === "static" ? "static, manual sync" : "onchain"}
            {live.lastUpdated && `, 갱신 ${formatRelative(live.lastUpdated)}`}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            type="number"
            min={0}
            step={100}
            value={capital}
            onChange={(e) => setCapital(Math.max(0, Number(e.target.value)))}
            className="bg-ink-900 border hairline rounded-md px-3 py-2 text-[14px] text-ink-50 font-mono mono-num w-40 focus:border-ink-300 focus:outline-none"
          />
          <span className="text-[12px] text-ink-400 font-mono">USDm</span>
          <div className="flex flex-wrap items-center gap-1 ml-2">
            {QUICK_AMOUNTS.map((q) => (
              <button
                key={q}
                onClick={() => setCapital(q)}
                className={[
                  "px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors",
                  capital === q
                    ? "bg-ink-700 text-ink-50"
                    : "text-ink-400 hover:text-ink-50",
                ].join(" ")}
              >
                {fmtUsd(q)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid md:grid-cols-3 gap-px bg-white/5 rounded-md overflow-hidden">
          {live.snapshot.bonds.map((b) => {
            const fits = capital <= b.recommendedMaxUSDm;
            const ratio = b.recommendedMaxUSDm > 0 ? capital / b.recommendedMaxUSDm : 0;
            const isPicked = recommendation.picked.days === b.days;
            const tone = fits
              ? "var(--signal)"
              : ratio < 2
                ? "var(--warn)"
                : "var(--critical)";
            const fitLabel = fits ? "fits" : ratio < 2 ? "tight" : "over";
            return (
              <div
                key={b.days}
                className="bg-ink-950 px-4 py-3 relative"
                style={{
                  outline: isPicked ? "1px solid var(--signal)" : "none",
                  outlineOffset: "-1px",
                }}
              >
                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-[12px] text-ink-50">
                    {b.days}일 본드
                  </div>
                  <span
                    className="font-mono text-[9.5px] px-1.5 py-0.5 rounded"
                    style={{
                      color: tone,
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    {fitLabel}
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-[16px] font-medium text-ink-50 mono-num">
                    {b.discountPct}%
                  </span>
                  <span className="text-[10.5px] text-ink-400 font-mono">
                    TVL {fmtUsd(b.tvlUSDm)}
                  </span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-ink-800 overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(100, ratio * 100)}%`,
                      background: tone,
                    }}
                  />
                </div>
                <div className="mt-1.5 text-[10.5px] text-ink-500 font-mono">
                  {fmtUsd(capital)} / 권장 {fmtUsd(b.recommendedMaxUSDm)} ={" "}
                  {(ratio * 100).toFixed(0)}%
                </div>
                {isPicked && (
                  <div className="mt-2 text-[10.5px] font-mono text-signal">
                    ✓ 추천 만기
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 card-2 p-4 border-signal/20">
          <div className="eyebrow text-signal">권장</div>
          <p className="mt-1.5 text-[13px] text-ink-100 leading-relaxed">
            <span className="text-ink-50 font-medium">
              {recommendation.picked.days}일 본드 (디스카운트{" "}
              {recommendation.picked.discountPct}%)
            </span>
            {". "}
            {recommendation.reason}
          </p>
        </div>
      </div>

      <div className="mt-5 grid md:grid-cols-3 gap-3">
        {CAPITAL_TIERS.map((t) => (
          <div key={t.tier} className="card-2 p-5">
            <div className="eyebrow">{t.label}</div>
            <div className="mt-1 text-[14px] font-medium text-ink-50">
              {t.range}
            </div>
            <p className="mt-2 text-[12.5px] text-ink-300 leading-relaxed">
              {t.guidance}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
