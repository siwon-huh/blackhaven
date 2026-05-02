"use client";

import { LAUNCH_SNAPSHOT, VERDICT_TONE } from "@/lib/launch";
import { computeFairValue, entryVerdict, LIVE_BONDS } from "@/lib/fairValue";
import { formatRelative, useLiveMetrics } from "@/lib/useLiveMetrics";
import { useBondMetrics } from "@/lib/useBondMetrics";
import type { BondMetric } from "@/lib/bondMetrics";

const SIGNAL_TONE = {
  warn: { color: "var(--warn)", label: "Warn" },
  ok: { color: "var(--signal)", label: "OK" },
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
  const { remote, lastUpdated, loading, error, metrics } =
    useLiveMetrics(1_000);
  const bondLive = useBondMetrics(1_000);
  const fv = computeFairValue(metrics, LIVE_BONDS);
  const verdict = entryVerdict(fv);

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

  const navStatic = s.metrics.nav;
  const navNumber = parseFloat(navStatic);
  const livePriceUSDm = remote?.market.priceUSDm ?? 18.66;
  const premiumNum = (livePriceUSDm - navNumber) / navNumber;
  const premiumLabel = `${(premiumNum * 100).toFixed(1)}%`;

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
                {error ? "Live, stale" : "Live, 1초 간격 업데이트"}
              </span>
              <span className="chip">{s.venue}</span>
            </div>
            <h2 className="mt-4 text-[26px] headline text-ink-50">
              실시간 현황
            </h2>
            <p className="mt-1.5 text-[12px] text-ink-400 font-mono">
              마지막 갱신 {formatRelative(lastUpdated)}
              {loading && !lastUpdated && ", loading"}
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
              <div className="eyebrow">RBT Market Price</div>
              <span className="text-[10px] font-mono text-signal">live</span>
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
                title={verdict.detail}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: verdict.color }}
                />
                {verdict.label}
              </span>
            </div>
            <div className="mt-1 text-[12px] text-ink-400 font-mono">
              24h {delta24h}, 6h {delta6h}, 1h {delta1h}
            </div>
            <div className="mt-2 text-[11.5px] text-ink-300 leading-relaxed">
              {verdict.detail}
            </div>
          </div>
          <div className="bg-ink-950 px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="eyebrow text-signal">NAV</div>
              <span className="text-[10px] font-mono text-ink-500">static</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[32px] font-medium tracking-tightest text-signal mono-num">
                {navStatic}
              </span>
            </div>
            <div className="mt-1 text-[12px] text-ink-400 font-mono">
              {s.metrics.navTreasury}
            </div>
          </div>
          <div className="bg-ink-950 px-6 py-6">
            <div className="eyebrow text-warn">Premium</div>
            <div className="mt-2 text-[28px] font-medium tracking-tightest text-warn mono-num">
              {premiumLabel}
            </div>
            <div className="mt-1 text-[12px] text-ink-400 font-mono">
              NAV 의 {(livePriceUSDm / navNumber).toFixed(2)} 배
            </div>
          </div>
        </div>

        {/* Sub metrics */}
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11.5px]">
          <SubMetric
            label="Liquidity"
            value={liquidity}
            sub={`FDV ${fdv}`}
            live
          />
          <SubMetric
            label="Volume 24h"
            value={volume}
            sub={`Buy ${buys}, Sell ${sells}`}
            live
          />
          <SubMetric label="Pool" value={poolRBT} sub={poolUSDm} live />
          <SubMetric
            label="Supply"
            value={s.metrics.circulating}
            sub="circulating, total"
          />
        </div>

        {/* Bond TVL with live recommendations */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-2">
            <div className="eyebrow">Bond pools</div>
            <span className="text-[10px] font-mono text-ink-500">
              {bondLive.snapshot.source === "static"
                ? "static, manual sync"
                : "onchain"}
              {bondLive.lastUpdated &&
                `, 갱신 ${formatRelative(bondLive.lastUpdated)}`}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {bondLive.snapshot.bonds.map((b) => (
              <BondPoolCard key={b.days} bond={b} />
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3 text-[11.5px]">
          <SubMetric label="Stake TVL" value={s.metrics.stakeTVL} />
          <SubMetric label="Commit 24w" value={s.metrics.commit24wReward} />
          <SubMetric label="TXNS 24h" value={txns} live />
        </div>

        <div className="mt-3 text-[11px] text-ink-400 leading-relaxed">
          본드별 권장 max 는 풀 깊이 (TVL) 의 5퍼센트입니다. 그 이상이 들어가면
          디스카운트가 빠르게 잠식되고, shallow 등급 (TVL ≤ $50K) 풀은 작은 자본
          외에는 비효율입니다. 현재는 정적 fallback 이며 컨트랙트 주소 확보 시
          자동 라이브로 전환됩니다.
        </div>

        {/* Signals + Live priority */}
        <div className="mt-7 grid lg:grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="eyebrow mb-1">Signals</div>
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
                      {sig.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11.5px] text-ink-300 leading-relaxed">
                    {sig.detail}
                  </p>
                </div>
              );
            })}
          </div>

          <div>
            <div className="eyebrow mb-1">지금 이 순간 플레이 우선순위</div>
            <div className="space-y-2">
              {s.livePriority.map((p) => {
                const tone = VERDICT_TONE[p.verdict];
                return (
                  <div key={p.play} className="rounded-lg border p-3 hairline">
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-medium text-ink-50">
                        {p.play}
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
                      {p.note}
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
  return (
    <div className="card-2 px-3 py-2.5">
      <div className="flex items-center justify-between">
        <div className="eyebrow">{label}</div>
        {live && <span className="text-[9px] text-signal font-mono">live</span>}
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
  const tone = DEPTH_TONE[bond.depthTier];
  return (
    <div className="card-2 px-4 py-3">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[12px] text-ink-50">
          {bond.days}일 본드
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
        권장 max{" "}
        <span style={{ color: tone.color }}>
          {fmtCompact(bond.recommendedMaxUSDm)}
        </span>
      </div>
    </div>
  );
}
