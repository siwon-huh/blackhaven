"use client";

import { useMemo, useState } from "react";
import { CAPITAL_TIERS, recommendBond } from "@/lib/bondMetrics";
import { useBondMetrics } from "@/lib/useBondMetrics";
import { formatRelative } from "@/lib/useLiveMetrics";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

const QUICK_AMOUNTS = [500, 2_500, 10_000, 50_000];

const fmtUsd = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
      ? `$${(n / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}K`
      : `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export default function CapitalGuide() {
  const live = useBondMetrics(1_000);
  const locale = useLocale();
  const t = useT();
  const [capital, setCapital] = useState<number>(2_500);

  const recommendation = useMemo(
    () => recommendBond(capital, live.snapshot.bonds),
    [capital, live.snapshot.bonds],
  );

  const recommendationReason = (() => {
    const { reasonKey, reasonParams } = recommendation;
    const tvl = fmtUsd(reasonParams.tvlUSDm);
    if (reasonKey === "fits") {
      return t("cap.recommendation.fits")
        .replace("{days}", String(reasonParams.days))
        .replace("{tvl}", tvl)
        .replace("{pct}", String(reasonParams.discountPct));
    }
    return t("cap.recommendation.over").replace(
      "{days}",
      String(reasonParams.days),
    );
  })();

  return (
    <section className="max-w-6xl mx-auto px-6 pb-12">
      <div className="mb-5">
        <div className="eyebrow">{t("cap.eyebrow")}</div>
        <h2 className="mt-2 text-[26px] headline text-ink-50">
          {t("cap.heading")}
        </h2>
        <p className="mt-2 text-[13px] text-ink-300 max-w-2xl leading-relaxed">
          {t("cap.intro")}
        </p>
      </div>

      <div className="card p-6 md:p-8">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div className="eyebrow">{t("cap.input")}</div>
          <span className="text-[10px] font-mono text-ink-500">
            {live.snapshot.source === "static"
              ? t("live.source.staticManual")
              : t("live.source.onchain")}
            {live.lastUpdated &&
              `, ${t("common.updated")} ${formatRelative(live.lastUpdated)}`}
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
            const ratio =
              b.recommendedMaxUSDm > 0 ? capital / b.recommendedMaxUSDm : 0;
            const isPicked = recommendation.picked.days === b.days;
            const tone = fits
              ? "var(--signal)"
              : ratio < 2
                ? "var(--warn)"
                : "var(--critical)";
            const fitLabel = fits
              ? t("cap.fits")
              : ratio < 2
                ? t("cap.tight")
                : t("cap.over");
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
                    {t("cap.bondLabel").replace("{n}", String(b.days))}
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
                  {fmtUsd(capital)} / {t("cap.recommended")}{" "}
                  {fmtUsd(b.recommendedMaxUSDm)} = {(ratio * 100).toFixed(0)}%
                </div>
                {isPicked && (
                  <div className="mt-2 text-[10.5px] font-mono text-signal">
                    ✓ {t("cap.recommendedPick")}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 card-2 p-4 border-signal/20">
          <div className="eyebrow text-signal">{t("cap.recommended")}</div>
          <p className="mt-1.5 text-[13px] text-ink-100 leading-relaxed">
            <span className="text-ink-50 font-medium">
              {t("cap.bondLabel").replace(
                "{n}",
                String(recommendation.picked.days),
              )}{" "}
              ({recommendation.picked.discountPct}%)
            </span>
            {". "}
            {recommendationReason}
          </p>
        </div>
      </div>

      <div className="mt-5 grid md:grid-cols-3 gap-3">
        {CAPITAL_TIERS.map((tier) => (
          <div key={tier.tier} className="card-2 p-5">
            <div className="eyebrow">{lc(tier.label, locale)}</div>
            <div className="mt-1 text-[14px] font-medium text-ink-50">
              {lc(tier.range, locale)}
            </div>
            <p className="mt-2 text-[12.5px] text-ink-300 leading-relaxed">
              {lc(tier.guidance, locale)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
