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
  REFLEXIVITY_DISCOUNT,
  type ReflexivityMode,
} from "@/lib/fairValue";
import { formatRelative, useLiveMetrics } from "@/lib/useLiveMetrics";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

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

const pctRaw = (n: number, digits = 0) =>
  `${(n * 100).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;

const LAYER_COLORS = {
  floor: "#3DDC97",
  yieldFair: "#C9CDD4",
  bondEffective: "#9AA0AB",
  market: "#F4C756",
};

export default function FairValue() {
  const [yieldMode, setYieldMode] = useState<
    "conservative" | "base" | "aggressive"
  >("base");
  const [reflexMode, setReflexMode] = useState<ReflexivityMode>("soft");
  const live = useLiveMetrics(1_000);
  const locale = useLocale();
  const t = useT();
  const isEN = locale === "en";

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
        reflexivity: reflexMode,
      }),
    [fwdYield, reflexMode, live.metrics],
  );

  const reflexInfo = REFLEXIVITY_DISCOUNT[reflexMode];

  const upperBoundYieldFair = useMemo(
    () =>
      computeFairValue(live.metrics, LIVE_BONDS, {
        protocolFee: DEFAULT_PROTOCOL_FEE,
        forwardYield: estimateForwardYield(0.1, 24, COMMIT_24W_REWARD * 1.2),
        reflexivity: "none",
      }).yieldFair,
    [live.metrics],
  );

  const domainMax = upperBoundYieldFair;
  const xPct = (v: number) => (v / domainMax) * 100;

  const yieldFairDescEN = `Forward yield ${pct(fwdYield)} reduced by reflexivity discount ${pct(fv.reflexivityFactor)} → adjusted yield ${pct(fwdYield * (1 - fv.reflexivityFactor))} added to NAV. NPV of one year of stake/commit distribution, risk-adjusted for Schelling weakening.`;
  const yieldFairDescKO = `forward yield ${pct(fwdYield)} 에 reflexivity 디스카운트 ${pct(fv.reflexivityFactor)} 를 적용한 ${pct(fwdYield * (1 - fv.reflexivityFactor))} 를 NAV 에 더한 값입니다. Stake 와 Commit 분배의 1 년치 NPV 에 셸링 약화 가능성을 반영한 위험조정 공정가입니다.`;
  const bondEffDescEN = `Market price × (1 − ${pct(fv.maxBondDiscount)}). The effective cost per RBT received at maturity through the 30-day bond.`;
  const bondEffDescKO = `시장가에 1 빼기 ${pct(fv.maxBondDiscount)} 를 곱한 값입니다. 30 일 본드로 들어가 만기에 받게 되는 RBT 1 개당 effective 비용입니다.`;

  const layers = [
    {
      key: "floor" as const,
      label: t("fv.layer.floor"),
      value: fv.floor,
      color: LAYER_COLORS.floor,
      description: t("fv.layer.floor.desc"),
    },
    {
      key: "yieldFair" as const,
      label: t("fv.layer.yieldFair"),
      value: fv.yieldFair,
      color: LAYER_COLORS.yieldFair,
      description: isEN ? yieldFairDescEN : yieldFairDescKO,
    },
    {
      key: "bondEffective" as const,
      label: t("fv.layer.bondEffective"),
      value: fv.bondEffective,
      color: LAYER_COLORS.bondEffective,
      description: isEN ? bondEffDescEN : bondEffDescKO,
    },
    {
      key: "market" as const,
      label: t("fv.layer.market"),
      value: fv.market,
      color: LAYER_COLORS.market,
      description: t("fv.layer.market.desc"),
    },
  ];

  const yieldButtons = [
    { id: "conservative" as const, label: "Conservative" },
    { id: "base" as const, label: "Base" },
    { id: "aggressive" as const, label: "Aggressive" },
  ];

  return (
    <section id="fair" className="max-w-6xl mx-auto px-6 pb-20">
      <div className="card p-6 md:p-8">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="chip">{t("fv.title")}</span>
              <span className="chip">{t("fv.layerModel")}</span>
              <span className={live.error ? "chip-warn" : "chip-signal"}>
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    live.error ? "bg-warn" : "bg-signal animate-pulseDot",
                  ].join(" ")}
                />
                {live.error ? t("common.stale") : t("live.polling")}
              </span>
            </div>
            <h2 className="mt-4 text-[26px] headline text-ink-50">
              {t("fv.heading")}
            </h2>
            <p className="mt-2 text-[13px] text-ink-300 max-w-2xl leading-relaxed">
              {t("fv.intro")}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-[11px]">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-ink-400 font-mono mr-2 w-[88px]">
                {t("fv.forwardYield")}
              </span>
              {yieldButtons.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setYieldMode(b.id)}
                  className={[
                    "px-2.5 py-1 rounded-md font-mono transition-colors",
                    yieldMode === b.id
                      ? "bg-ink-700 text-ink-50"
                      : "text-ink-400 hover:text-ink-50",
                  ].join(" ")}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span
                className="text-ink-400 font-mono mr-2 w-[88px]"
                title={t("fv.reflexivity.tooltip")}
              >
                {t("fv.reflexivity")}
              </span>
              {(["none", "soft", "hard"] as ReflexivityMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setReflexMode(m)}
                  className={[
                    "px-2.5 py-1 rounded-md font-mono transition-colors",
                    reflexMode === m
                      ? "bg-ink-700 text-ink-50"
                      : "text-ink-400 hover:text-ink-50",
                  ].join(" ")}
                  title={lc(REFLEXIVITY_DISCOUNT[m].detail, locale)}
                >
                  {REFLEXIVITY_DISCOUNT[m].label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Price ladder */}
        <div className="mt-8">
          <div className="relative h-36 rounded-lg bg-ink-900 border hairline">
            {[0, 25, 50, 75, 100].map((p) => (
              <div
                key={p}
                className="absolute top-0 bottom-0 w-px bg-white/4"
                style={{ left: `${p}%` }}
              />
            ))}

            {/* Spectrum baseline: 0 → rightmost layer value */}
            <div
              className="absolute top-1/2 h-px -translate-y-1/2 bg-white/15"
              style={{
                left: '0%',
                width: `${xPct(Math.max(...layers.map((l) => l.value)))}%`,
              }}
            />

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
                    className="absolute -translate-x-1/2 rounded-md px-2 py-1 text-[10.5px] font-mono whitespace-nowrap bg-ink-950 border"
                    style={{
                      borderColor: `${l.color}55`,
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
          <div className="flex justify-between mt-2 text-[10px] text-ink-500 font-mono">
            <span>0</span>
            <span>{fmt(domainMax / 4)}</span>
            <span>{fmt(domainMax / 2)}</span>
            <span>{fmt((domainMax * 3) / 4)}</span>
            <span>{fmt(domainMax)} USDm/RBT</span>
          </div>
        </div>

        {/* Layer cards */}
        <div className="mt-7 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden">
          {layers.map((l) => {
            const premium = (l.value - fv.floor) / fv.floor;
            return (
              <div key={l.key} className="bg-ink-950 p-5">
                <div
                  className="font-mono text-[10.5px] uppercase tracking-wider"
                  style={{ color: l.color }}
                >
                  {l.label}
                </div>
                <div className="mt-2 text-[24px] font-medium tracking-tightest text-ink-50 mono-num">
                  {fmt(l.value)}
                  <span className="ml-1 text-[12px] text-ink-500 font-mono">
                    USDm
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-ink-400 font-mono">
                  vs NAV{" "}
                  <span
                    style={{
                      color: premium > 0 ? "var(--warn)" : "var(--signal)",
                    }}
                  >
                    {pct(premium)}
                  </span>
                </div>
                <p className="mt-2.5 text-[11.5px] text-ink-300 leading-relaxed">
                  {l.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Conclusion */}
        <div className="mt-7 grid md:grid-cols-2 gap-3">
          <div className="card-2 p-5 border-signal/20">
            <div className="eyebrow text-signal">{t("fv.entryConclusion")}</div>
            <ul className="mt-3 space-y-1.5 text-[12.5px] text-ink-100 leading-relaxed">
              <li>
                <span className="text-ink-400">
                  {t("fv.entryConclusion.floor.label")}{" "}
                </span>
                {t("fv.entryConclusion.floor").replace("{x}", fmt(fv.floor))}
              </li>
              <li>
                <span className="text-ink-400">
                  {t("fv.entryConclusion.fair.label")}{" "}
                </span>
                {t("fv.entryConclusion.fair").replace("{x}", fmt(fv.yieldFair))}
              </li>
              <li>
                <span className="text-ink-400">
                  {t("fv.entryConclusion.bond.label")}{" "}
                </span>
                {t("fv.entryConclusion.bond").replace(
                  "{x}",
                  fmt(fv.bondEffective),
                )}
              </li>
              <li>
                <span className="text-ink-400">
                  {t("fv.entryConclusion.market.label")}{" "}
                </span>
                {isEN ? (
                  <>
                    {fmt(fv.market)},{" "}
                    <span className="text-warn">
                      {fmt(fv.market / fv.floor, 2)}× NAV
                    </span>
                    .
                  </>
                ) : (
                  <>
                    {fmt(fv.market)} 이며 NAV 의{" "}
                    <span className="text-warn">
                      {fmt(fv.market / fv.floor, 2)} 배
                    </span>{" "}
                    입니다.
                  </>
                )}
              </li>
            </ul>
          </div>
          <div className="card-2 p-5 border-warn/20">
            <div className="eyebrow text-warn">{t("fv.priceZones")}</div>
            <ul className="mt-3 space-y-1.5 text-[12.5px] text-ink-100 leading-relaxed">
              <li>{t("fv.zone.belowFloor")}</li>
              <li>{t("fv.zone.floorToFair")}</li>
              <li>{t("fv.zone.fairToBond")}</li>
              <li>{t("fv.zone.bondToMarket")}</li>
            </ul>
          </div>
        </div>

        {/* Reflexivity explanation */}
        <div className="mt-6 card-2 p-5 border-warn/20">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div className="eyebrow text-warn">
              {t("fv.reflex.title")}, {reflexInfo.label}
            </div>
            <span className="font-mono text-[11px] text-warn">
              {t("fv.reflex.factor").replace("{x}", pctRaw(reflexInfo.factor))}
            </span>
          </div>
          <p className="mt-2 text-[12.5px] text-ink-200 leading-relaxed">
            {lc(reflexInfo.detail, locale)}
          </p>
          <p className="mt-2 text-[11.5px] text-ink-400 leading-relaxed">
            {t("fv.reflex.body")}
          </p>
        </div>

        {/* Assumptions */}
        <div className="mt-6 pt-5 border-t hairline">
          <div className="eyebrow">{t("fv.assumptions")}</div>
          <div className="mt-3 grid md:grid-cols-4 gap-px bg-white/5 rounded-md overflow-hidden">
            <div className="bg-ink-950 px-4 py-3">
              <div className="text-[10.5px] text-ink-500 font-mono">
                {t("fv.assumption.forwardYield")}
              </div>
              <div className="mt-0.5 text-ink-50 font-mono mono-num">
                {pct(fwdYield)} {yieldMode}
              </div>
            </div>
            <div className="bg-ink-950 px-4 py-3">
              <div className="text-[10.5px] text-ink-500 font-mono">
                {t("fv.assumption.reflexivity")}
              </div>
              <div className="mt-0.5 text-ink-50 font-mono mono-num">
                −{pctRaw(fv.reflexivityFactor)} {reflexInfo.label}
              </div>
            </div>
            <div className="bg-ink-950 px-4 py-3">
              <div className="text-[10.5px] text-ink-500 font-mono">
                {t("fv.assumption.maxBondDiscount")}
              </div>
              <div className="mt-0.5 text-ink-50 font-mono mono-num">
                {pctRaw(fv.maxBondDiscount)},{" "}
                {t("fv.assumption.maxBondDiscount.bondLabel")}
              </div>
            </div>
            <div className="bg-ink-950 px-4 py-3">
              <div className="text-[10.5px] text-ink-500 font-mono">
                {t("fv.assumption.protocolFee")}
              </div>
              <div className="mt-0.5 text-ink-50 font-mono mono-num">
                {pctRaw(fv.protocolFee)},{" "}
                {t("fv.assumption.protocolFee.phaseLabel")}
              </div>
            </div>
          </div>
          {isEN ? (
            <p className="mt-4 text-[11px] text-ink-400 leading-relaxed">
              Live metrics: Reserves per RBT{" "}
              <span className="text-ink-50 font-mono">
                {live.metrics.reservesPerRBT} USDm
              </span>
              , Circulating{" "}
              <span className="text-ink-50 font-mono">
                {live.metrics.circulatingRBT.toLocaleString()} RBT
              </span>
              , Market{" "}
              <span className="text-ink-50 font-mono">
                {live.metrics.marketPriceUSDm.toFixed(2)} USDm
              </span>{" "}
              (last updated {formatRelative(live.lastUpdated)}), Stake TVL{" "}
              <span className="text-ink-50 font-mono">
                ${STAKE_TVL_USD.toLocaleString()}
              </span>
              . Forward yield is computed as a weighted sum of stake APR and
              annualized commit, refreshable via onchain or attestation.
            </p>
          ) : (
            <p className="mt-4 text-[11px] text-ink-400 leading-relaxed">
              Live metrics 은 Reserves per RBT{" "}
              <span className="text-ink-50 font-mono">
                {live.metrics.reservesPerRBT} USDm
              </span>
              , Circulating{" "}
              <span className="text-ink-50 font-mono">
                {live.metrics.circulatingRBT.toLocaleString()} RBT
              </span>
              , Market{" "}
              <span className="text-ink-50 font-mono">
                {live.metrics.marketPriceUSDm.toFixed(2)} USDm
              </span>{" "}
              (마지막 갱신 {formatRelative(live.lastUpdated)}), Stake TVL{" "}
              <span className="text-ink-50 font-mono">
                ${STAKE_TVL_USD.toLocaleString()}
              </span>{" "}
              입니다. Forward yield 는 stake APR 과 commit annualized 의
              가중합으로 계산하며, 온체인 또는 attestation 을 통해 갱신할 수
              있습니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
