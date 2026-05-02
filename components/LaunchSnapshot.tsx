"use client";

import { LAUNCH_SNAPSHOT, VERDICT_TONE } from "@/lib/launch";
import {
  computeFairValue,
  entryVerdict,
  LIVE_BONDS,
  type EntryZone,
} from "@/lib/fairValue";
import { formatRelative, useLiveMetrics } from "@/lib/useLiveMetrics";
import { useBondMetrics } from "@/lib/useBondMetrics";
import { useCommitMetrics } from "@/lib/useCommitMetrics";
import type { BondMetric } from "@/lib/bondMetrics";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

const SIGNAL_TONE = {
  warn: { color: "var(--warn)", label: "Warn" },
  ok: { color: "var(--signal)", label: "OK" },
};

const VERDICT_KEY: Record<EntryZone, { label: string; detail: string }> = {
  undervalued: {
    label: "verdict.undervalued.label",
    detail: "verdict.undervalued.detail",
  },
  fair: { label: "verdict.fair.label", detail: "verdict.fair.detail" },
  "bond-only": {
    label: "verdict.bondOnly.label",
    detail: "verdict.bondOnly.detail",
  },
  overvalued: {
    label: "verdict.overvalued.label",
    detail: "verdict.overvalued.detail",
  },
};

const fmtUsd = (n: number, digits = 2) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
const fmtCompactUsd = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
};
const fmtPct = (n: number) =>
  `${n >= 0 ? "+" : ""}${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;
const fmtCount = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export default function LaunchSnapshot() {
  const s = LAUNCH_SNAPSHOT;
  const locale = useLocale();
  const t = useT();
  const { remote, lastUpdated, loading, error, metrics } =
    useLiveMetrics(1_000);
  const bondLive = useBondMetrics(1_000);
  const commitLive = useCommitMetrics(1_000);
  const fv = computeFairValue(metrics, LIVE_BONDS);
  const verdict = entryVerdict(fv);
  const verdictLabel = t(VERDICT_KEY[verdict.zone].label);
  const verdictDetail = t(VERDICT_KEY[verdict.zone].detail);

  const price = remote ? fmtUsd(remote.market.priceUSD) : s.metrics.price;
  const priceUSDm = remote
    ? `${remote.market.priceUSDm.toFixed(2)} USDm`
    : s.metrics.priceUSDm;
  const liquidity = remote
    ? fmtCompactUsd(remote.market.liquidityUSD)
    : s.metrics.liquidity;
  const fdv = remote ? fmtCompactUsd(remote.market.fdvUSD) : s.metrics.fdv;
  const delta24h = remote ? fmtPct(remote.delta.h24) : s.metrics.delta24h;
  const delta6h = remote ? fmtPct(remote.delta.h6) : s.metrics.delta6h;
  const delta1h = remote ? fmtPct(remote.delta.h1) : s.metrics.delta1h;
  const volume = remote
    ? fmtCompactUsd(remote.flow.volume24h)
    : s.metrics.volume;
  const buys = remote
    ? fmtCount(remote.flow.buys24h)
    : s.metrics.buys.toString();
  const sells = remote
    ? fmtCount(remote.flow.sells24h)
    : s.metrics.sells.toString();
  const txns = remote
    ? fmtCount(remote.flow.txns24h)
    : s.metrics.txns.toString();
  const poolRBT = remote
    ? `${(remote.market.poolBase / 1000).toFixed(2)}K RBT`
    : s.metrics.poolRBT;
  const poolUSDm = remote
    ? `${(remote.market.poolQuote / 1000).toFixed(2)}K USDm`
    : s.metrics.poolUSDm;

  // NAV 는 onchain 응답이 있으면 라이브, 없으면 정적 fallback.
  const navLive = remote?.onchain?.navUSDm;
  const navNumber =
    navLive && navLive > 0 ? navLive : parseFloat(s.metrics.nav);
  const navDisplay = `${navNumber.toFixed(2)} USDm`;
  const navIsLive = !!(navLive && navLive > 0);
  const reservesUSDm = remote?.onchain?.reservesUSDm;
  const totalSupplyRBT = remote?.onchain?.totalSupplyRBT;
  const livePriceUSDm = remote?.market.priceUSDm ?? 18.66;
  const premiumNum = (livePriceUSDm - navNumber) / navNumber;
  const premiumLabel = `${(premiumNum * 100).toFixed(1)}%`;
  const navTreasuryFallback = lc(s.metrics.navTreasury, locale);

  return (
    <section id="live" className="max-w-6xl mx-auto px-6 pb-14">
      <div className="card p-6 md:p-8">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={error ? "chip-warn" : "chip-signal"}>
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    error ? "bg-warn" : "bg-signal animate-pulseDot",
                  ].join(" ")}
                />
                {error ? t("live.stale") : t("live.polling")}
              </span>
              <span className="chip">{s.venue}</span>
            </div>
            <h2 className="mt-4 text-[26px] headline text-ink-50">
              {t("live.title")}
            </h2>
            <p className="mt-1.5 text-[12px] text-ink-400 font-mono">
              {t("live.lastUpdated")} {formatRelative(lastUpdated)}
              {loading && !lastUpdated && `, ${t("live.loading")}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11.5px] font-mono">
            <a
              className="chip hover:text-ink-50"
              href={s.appMetrics}
              target="_blank"
              rel="noreferrer"
            >
              app
            </a>
            <a
              className="chip hover:text-ink-50"
              href={s.dexscreener}
              target="_blank"
              rel="noreferrer"
            >
              dexscreener
            </a>
            <a
              className="chip hover:text-ink-50"
              href={s.poolUrl}
              target="_blank"
              rel="noreferrer"
            >
              kumbaya
            </a>
          </div>
        </header>

        {/* Hero metric: Market vs NAV */}
        <div className="mt-7 grid md:grid-cols-[2fr_1.4fr_1fr] gap-px bg-white/5 rounded-xl overflow-hidden">
          <div className="bg-ink-950 px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="eyebrow">{t("live.market.label")}</div>
              <span className="text-[10px] font-mono text-signal">
                {t("common.live")}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-3 flex-wrap">
              <span className="text-[40px] font-medium tracking-tightest text-ink-50 mono-num">
                {price}
              </span>
              <span className="text-[14px] text-ink-300 font-mono">
                {priceUSDm}
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border"
                style={{
                  color: verdict.color,
                  background: `${verdict.color}12`,
                  borderColor: `${verdict.color}40`,
                }}
                title={verdictDetail}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: verdict.color }}
                />
                {verdictLabel}
              </span>
            </div>
            <div className="mt-1 text-[12px] text-ink-400 font-mono">
              24h {delta24h}, 6h {delta6h}, 1h {delta1h}
            </div>
            <div className="mt-2 text-[11.5px] text-ink-300 leading-relaxed">
              {verdictDetail}
            </div>
          </div>
          <div className="bg-ink-950 px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="eyebrow text-signal">{t("live.nav.label")}</div>
              <span
                className="text-[10px] font-mono"
                style={{
                  color: navIsLive ? "var(--signal)" : "var(--text-3, #9AA0AB)",
                }}
              >
                {navIsLive ? t("common.live") : t("common.static")}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[32px] font-medium tracking-tightest text-signal mono-num">
                {navDisplay}
              </span>
            </div>
            <div className="mt-1 text-[12px] text-ink-400 font-mono">
              {navIsLive && reservesUSDm && totalSupplyRBT
                ? `reserves $${(reservesUSDm / 1000).toFixed(1)}K / supply ${totalSupplyRBT.toFixed(0)} RBT`
                : navTreasuryFallback}
            </div>
          </div>
          <div className="bg-ink-950 px-6 py-6">
            <div className="eyebrow text-warn">{t("live.premium.label")}</div>
            <div className="mt-2 text-[28px] font-medium tracking-tightest text-warn mono-num">
              {premiumLabel}
            </div>
            <div className="mt-1 text-[12px] text-ink-400 font-mono">
              {t("live.premium.multipleOfNAV").replace(
                "{x}",
                (livePriceUSDm / navNumber).toFixed(2),
              )}
            </div>
          </div>
        </div>

        {/* Sub metrics */}
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11.5px]">
          <SubMetric
            label={t("live.liquidity")}
            value={liquidity}
            sub={`FDV ${fdv}`}
            live
          />
          <SubMetric
            label={t("live.volume24")}
            value={volume}
            sub={`Buy ${buys}, Sell ${sells}`}
            live
          />
          <SubMetric
            label={t("live.pool")}
            value={poolRBT}
            sub={poolUSDm}
            live
          />
          <SubMetric
            label={t("live.supply")}
            value={s.metrics.circulating}
            sub={t("live.supply.sub")}
          />
        </div>

        {/* Bond TVL with live recommendations */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-2">
            <div className="eyebrow">{t("live.bondPools")}</div>
            <span className="text-[10px] font-mono text-ink-500">
              {bondLive.snapshot.source === "static"
                ? t("live.source.staticManual")
                : t("live.source.onchain")}
              {bondLive.lastUpdated &&
                `, ${t("common.updated")} ${formatRelative(bondLive.lastUpdated)}`}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {bondLive.snapshot.bonds.map((b) => (
              <BondPoolCard key={b.days} bond={b} />
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11.5px]">
          <SubMetric
            label={t("live.stake.tvl")}
            value={(() => {
              const backingRBT = commitLive.snapshot?.stake.backingRBT;
              if (
                backingRBT !== undefined &&
                backingRBT > 0 &&
                livePriceUSDm > 0
              ) {
                const usd = backingRBT * livePriceUSDm;
                return usd >= 1000
                  ? `$${(usd / 1000).toFixed(1)}K`
                  : `$${usd.toFixed(0)}`;
              }
              return s.metrics.stakeTVL;
            })()}
            sub={(() => {
              const backingRBT = commitLive.snapshot?.stake.backingRBT;
              if (backingRBT !== undefined && backingRBT > 0) {
                return t("live.stake.staked").replace(
                  "{n}",
                  backingRBT.toFixed(0),
                );
              }
              return commitLive.snapshot?.source === "onchain"
                ? t("live.source.onchain")
                : t("live.source.staticManual");
            })()}
            live={
              commitLive.snapshot?.source === "onchain" &&
              (commitLive.snapshot?.stake.backingRBT ?? 0) > 0
            }
          />
          <SubMetric
            label={t("live.commit.tvl")}
            value={(() => {
              const tvlSRBT = commitLive.snapshot?.commit.tvlSRBT;
              if (
                tvlSRBT !== null &&
                tvlSRBT !== undefined &&
                tvlSRBT > 0 &&
                livePriceUSDm > 0
              ) {
                const usd = tvlSRBT * livePriceUSDm;
                return usd >= 1000
                  ? `$${(usd / 1000).toFixed(1)}K`
                  : `$${usd.toFixed(0)}`;
              }
              return "...";
            })()}
            sub={(() => {
              const tvlSRBT = commitLive.snapshot?.commit.tvlSRBT;
              if (tvlSRBT !== null && tvlSRBT !== undefined && tvlSRBT > 0) {
                return t("live.commit.locked").replace(
                  "{n}",
                  tvlSRBT.toFixed(0),
                );
              }
              return t("live.commit.noCommits");
            })()}
            live={commitLive.snapshot?.source === "onchain"}
          />
          <SubMetric
            label={t("live.commit.reward")}
            value={
              commitLive.snapshot
                ? `${(commitLive.snapshot.commit.reward24w * 100).toFixed(1)}%`
                : lc(s.metrics.commit24wReward, locale)
            }
            sub={
              commitLive.snapshot?.commit.rewardPoolRBT !== undefined
                ? t("live.commit.pool").replace(
                    "{n}",
                    commitLive.snapshot.commit.rewardPoolRBT.toFixed(0),
                  )
                : t("common.static")
            }
            live={commitLive.snapshot?.source === "onchain"}
          />
          <SubMetric label={t("live.txns24")} value={txns} live />
        </div>

        <div className="mt-3 text-[11px] text-ink-400 leading-relaxed">
          {t("live.disclaimer.bond")}
        </div>

        {/* Signals + Live priority */}
        <div className="mt-7 grid lg:grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="eyebrow mb-1">{t("live.signals")}</div>
            {s.signals.map((sig, i) => {
              const tone = SIGNAL_TONE[sig.tone];
              return (
                <div
                  key={i}
                  className="rounded-lg border p-3"
                  style={{
                    borderColor: `${tone.color === "var(--warn)" ? "rgba(244,199,86,0.25)" : "rgba(61,220,151,0.25)"}`,
                    background: `${tone.color === "var(--warn)" ? "rgba(244,199,86,0.04)" : "rgba(61,220,151,0.04)"}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{
                        color: tone.color,
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      {tone.label}
                    </span>
                    <span className="text-[12.5px] font-medium text-ink-50">
                      {lc(sig.label, locale)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11.5px] text-ink-300 leading-relaxed">
                    {lc(sig.detail, locale)}
                  </p>
                </div>
              );
            })}
          </div>

          <div>
            <div className="eyebrow mb-1">{t("live.priority")}</div>
            <div className="space-y-2">
              {s.livePriority.map((p) => {
                let dynVerdict = p.verdict;
                let dynNote = lc(p.note, locale);

                if (p.kind === "bond30d") {
                  const discPct = fv.maxBondDiscount * 100;
                  const savedPct = (1 - fv.bondEffective / fv.market) * 100;
                  dynNote =
                    locale === "en"
                      ? `Largest discount available. Bond effective entry is ~${fv.bondEffective.toFixed(2)} USDm, ~${savedPct.toFixed(1)}% below live market ${fv.market.toFixed(2)} USDm (discount ${discPct.toFixed(0)}%).`
                      : `최대 디스카운트입니다. 본드의 effective entry 는 약 ${fv.bondEffective.toFixed(2)} USDm 으로, 라이브 시장가 ${fv.market.toFixed(2)} USDm 대비 약 ${savedPct.toFixed(1)}퍼센트 낮습니다 (디스카운트 ${discPct.toFixed(0)} 퍼센트).`;
                } else if (p.kind === "navSeed") {
                  const ratio = fv.market / fv.floor;
                  const reentry = fv.floor * 1.5;
                  dynVerdict =
                    verdict.zone === "undervalued"
                      ? "GO+"
                      : verdict.zone === "fair"
                        ? "GO"
                        : verdict.zone === "bond-only"
                          ? "GO"
                          : "WAIT";
                  if (ratio <= 1.5) {
                    dynNote =
                      locale === "en"
                        ? `Market is ${ratio.toFixed(2)}× NAV, close to the asymmetric entry zone. For follow-on buys, time it just after the BAM cooldown.`
                        : `시장가가 NAV 의 ${ratio.toFixed(2)} 배입니다. 비대칭 진입 구간에 가까워졌습니다. 추가 매수 시 BAM 쿨다운 직후를 활용하세요.`;
                  } else {
                    dynNote =
                      locale === "en"
                        ? `Market sits at ${ratio.toFixed(2)}× NAV with no asymmetry. Re-evaluate when price falls under ~${reentry.toFixed(2)} USDm (50% above NAV).`
                        : `시장가가 NAV 의 ${ratio.toFixed(2)} 배에 머무릅니다. 비대칭이 사라진 상태이며, 시장가가 약 ${reentry.toFixed(2)} USDm (NAV 위 50퍼센트) 아래로 빠지면 재평가합니다.`;
                  }
                }

                const tone = VERDICT_TONE[dynVerdict];
                return (
                  <div
                    key={lc(p.play, locale)}
                    className="rounded-lg border p-3 hairline"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-medium text-ink-50">
                        {lc(p.play, locale)}
                      </span>
                      <span
                        className="font-mono text-[10.5px] px-2 py-0.5 rounded"
                        style={{
                          color: tone.color,
                          background: `${tone.color}15`,
                        }}
                      >
                        {tone.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11.5px] text-ink-300 leading-relaxed">
                      {dynNote}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SubMetric({
  label,
  value,
  sub,
  live,
}: {
  label: string;
  value: string;
  sub?: string;
  live?: boolean;
}) {
  const t = useT();
  return (
    <div className="card-2 px-3 py-2.5">
      <div className="flex items-center justify-between">
        <div className="eyebrow">{label}</div>
        {live && (
          <span className="text-[9px] text-signal font-mono">
            {t("common.live")}
          </span>
        )}
      </div>
      <div className="mt-1 text-[13px] text-ink-50 font-mono mono-num">
        {value}
      </div>
      {sub && (
        <div className="text-[10.5px] text-ink-500 font-mono mt-0.5">{sub}</div>
      )}
    </div>
  );
}

function fmtCompact(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

const DEPTH_TONE: Record<
  BondMetric["depthTier"],
  { color: string; label: string }
> = {
  deep: { color: "var(--signal)", label: "deep" },
  medium: { color: "#C9CDD4", label: "medium" },
  shallow: { color: "var(--warn)", label: "shallow" },
};

function BondPoolCard({ bond }: { bond: BondMetric }) {
  const t = useT();
  const tone = DEPTH_TONE[bond.depthTier];
  return (
    <div className="card-2 px-4 py-3">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[12px] text-ink-50">
          {t("live.bond.dayLabel").replace("{n}", String(bond.days))}
        </div>
        <span
          className="font-mono text-[10px] px-1.5 py-0.5 rounded"
          style={{ color: tone.color, background: "rgba(255,255,255,0.04)" }}
        >
          {tone.label}
        </span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-[18px] font-medium text-ink-50 mono-num">
          {bond.discountPct}%
        </span>
        <span className="text-[11px] text-ink-400 font-mono">
          TVL {fmtCompact(bond.tvlUSDm)}
        </span>
      </div>
      <div className="mt-2 pt-2 border-t hairline text-[11px] font-mono text-ink-400">
        {t("live.bond.recommendedMax")}{" "}
        <span style={{ color: tone.color }}>
          {fmtCompact(bond.recommendedMaxUSDm)}
        </span>
      </div>
    </div>
  );
}
