"use client";

import { LAUNCH_SNAPSHOT, VERDICT_TONE } from "@/lib/launch";
import { formatRelative, useLiveMetrics } from "@/lib/useLiveMetrics";

const SIGNAL_TONE = {
  warn: { color: "#F4C756", label: "Warn" },
  ok: { color: "#3DDC97", label: "OK" },
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
const fmtCount = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export default function LaunchSnapshot() {
  const s = LAUNCH_SNAPSHOT;
  const { remote, lastUpdated, loading, error } = useLiveMetrics(60_000);

  const price = remote ? fmtUsd(remote.market.priceUSD) : s.metrics.price;
  const priceUSDm = remote
    ? `${remote.market.priceUSDm.toFixed(2)} USDm`
    : s.metrics.priceUSDm;
  const liquidity = remote ? fmtCompactUsd(remote.market.liquidityUSD) : s.metrics.liquidity;
  const fdv = remote ? fmtCompactUsd(remote.market.fdvUSD) : s.metrics.fdv;
  const delta24h = remote ? fmtPct(remote.delta.h24) : s.metrics.delta24h;
  const delta6h = remote ? fmtPct(remote.delta.h6) : s.metrics.delta6h;
  const delta1h = remote ? fmtPct(remote.delta.h1) : s.metrics.delta1h;
  const volume = remote ? fmtCompactUsd(remote.flow.volume24h) : s.metrics.volume;
  const buys = remote ? fmtCount(remote.flow.buys24h) : s.metrics.buys.toString();
  const sells = remote ? fmtCount(remote.flow.sells24h) : s.metrics.sells.toString();
  const txns = remote ? fmtCount(remote.flow.txns24h) : s.metrics.txns.toString();
  const poolRBT = remote
    ? `${(remote.market.poolBase / 1000).toFixed(2)}K RBT`
    : s.metrics.poolRBT;
  const poolUSDm = remote
    ? `${(remote.market.poolQuote / 1000).toFixed(2)}K USDm`
    : s.metrics.poolUSDm;

  const navStatic = s.metrics.nav;
  const treasury = s.metrics.navTreasury;

  const navNumber = parseFloat(navStatic);
  const livePriceUSDm = remote?.market.priceUSDm ?? 18.66;
  const premiumNum = (livePriceUSDm - navNumber) / navNumber;
  const premiumLabel = `NAV 위 ${(premiumNum * 100).toFixed(1)}퍼센트, NAV의 ${(livePriceUSDm / navNumber).toFixed(2)}배`;

  return (
    <section id="live" className="max-w-6xl mx-auto px-6 pb-10">
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-jade-400 via-violet-500 to-ember-500" />

        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="chip"
                style={{
                  color: error ? "#FF8A4C" : "#3DDC97",
                  borderColor: error ? "#FF8A4C40" : "#3DDC9740",
                }}
              >
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    error ? "bg-ember-500" : "bg-jade-400 animate-pulse",
                  ].join(" ")}
                />
                {error ? "Live, stale" : "Live, 60s polling"}
              </span>
              <span className="chip">{s.venue}</span>
              <span className="chip">{s.asset}</span>
            </div>
            <h2 className="mt-3 text-[24px] font-semibold tracking-tight text-white">
              출시 직후 스냅샷
            </h2>
            <p className="mt-1 text-[12px] text-mist-400 font-mono">
              마지막 갱신 {formatRelative(lastUpdated)}
              {loading && !lastUpdated && ", loading"}
              {remote && `, source ${remote.source}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11.5px] font-mono">
            <a className="chip hover:text-white" href={s.appMetrics} target="_blank" rel="noreferrer">
              app
            </a>
            <a className="chip hover:text-white" href={s.dexscreener} target="_blank" rel="noreferrer">
              dexscreener
            </a>
            <a className="chip hover:text-white" href={s.poolUrl} target="_blank" rel="noreferrer">
              kumbaya
            </a>
          </div>
        </header>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Metric label="Market Price" value={price} sub={priceUSDm} live={!!remote} />
          <Metric
            label="NAV (Reserves per RBT)"
            value={navStatic}
            sub={treasury}
            tone="ok"
            staticHint
          />
          <Metric label="Liquidity" value={liquidity} sub={`FDV ${fdv}`} live={!!remote} />
          <Metric
            label="24h Δ"
            value={delta24h}
            sub={`정점 ${s.metrics.peakApprox}, ${s.metrics.drawdownFromPeak}`}
            tone="up"
            live={!!remote}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11.5px]">
          <SubMetric
            label="Circulating, Total"
            value={`${s.metrics.circulating}, ${s.metrics.totalSupply}`}
          />
          <SubMetric label="Pool Balance" value={`${poolRBT}, ${poolUSDm}`} live={!!remote} />
          <SubMetric label="Volume 24h" value={volume} live={!!remote} />
          <SubMetric label="6h, 1h" value={`${delta6h}, ${delta1h}`} live={!!remote} />
        </div>

        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11.5px]">
          <SubMetric label="TXNS 24h" value={txns} live={!!remote} />
          <SubMetric label="Buys, Sells" value={`${buys}, ${sells}`} live={!!remote} />
          <SubMetric label="Stake TVL" value={s.metrics.stakeTVL} />
          <SubMetric label="Commit 24w" value={s.metrics.commit24wReward} />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3 text-[11.5px]">
          <SubMetric label="7d Bond" value={s.metrics.bond7d} />
          <SubMetric label="14d Bond" value={s.metrics.bond14d} />
          <SubMetric label="30d Bond" value={s.metrics.bond30d} />
        </div>

        <div className="mt-6 grid lg:grid-cols-[1.2fr_1fr] gap-4">
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
            <div className="text-[10.5px] uppercase tracking-wider text-amber-400 font-mono mb-1.5">
              NAV Premium, 시장가 대 백킹
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-[20px] font-semibold text-white tracking-tight">
                {premiumLabel}
              </div>
            </div>
            <p className="mt-2 text-[12.5px] text-mist-200 leading-relaxed">
              {s.navAnalysis.interpretation}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="rounded-md bg-ink-700/60 p-2">
                <div className="text-mist-400">NAV (정적)</div>
                <div className="mt-0.5 text-jade-400">{navStatic}</div>
              </div>
              <div className="rounded-md bg-ink-700/60 p-2">
                <div className="text-mist-400">Market (live)</div>
                <div className="mt-0.5 text-white">
                  {livePriceUSDm.toFixed(2)} USDm
                </div>
              </div>
            </div>
            <p className="mt-3 text-[10.5px] text-mist-400 font-mono leading-relaxed">
              {s.navAnalysis.formula}
            </p>
          </div>

          <div className="space-y-2">
            {s.signals.map((sig, i) => {
              const tone = SIGNAL_TONE[sig.tone];
              return (
                <div
                  key={i}
                  className="rounded-lg border p-3"
                  style={{ borderColor: `${tone.color}30`, background: `${tone.color}08` }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ color: tone.color, background: `${tone.color}15` }}
                    >
                      {tone.label}
                    </span>
                    <span className="text-[12.5px] font-semibold text-white">{sig.label}</span>
                  </div>
                  <p className="mt-1.5 text-[11.5px] text-mist-300 leading-relaxed">
                    {sig.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono mb-2">
            지금 이 순간 플레이 우선순위
          </div>
          <div className="grid md:grid-cols-3 gap-2">
            {s.livePriority.map((p) => {
              const tone = VERDICT_TONE[p.verdict];
              return (
                <div
                  key={p.play}
                  className="rounded-lg border p-3"
                  style={{ borderColor: `${tone.color}30`, background: `${tone.color}06` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-semibold text-white">{p.play}</span>
                    <span
                      className="font-mono text-[11px] px-2 py-0.5 rounded"
                      style={{ color: tone.color, background: `${tone.color}15` }}
                    >
                      {tone.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11.5px] text-mist-300 leading-relaxed">{p.note}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t hairline text-[11px] text-mist-400 leading-relaxed">
          live 표시 메트릭은 60초 간격으로 갱신됩니다. NAV, Reserves, Stake, Commit 항목은 정적 fallback이며 앱 Metrics 페이지의 수치를 수기로 동기화합니다.
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  sub,
  tone,
  live,
  staticHint,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "up" | "down" | "ok";
  live?: boolean;
  staticHint?: boolean;
}) {
  const valueColor =
    tone === "up"
      ? "#3DDC97"
      : tone === "down"
        ? "#FF6A1F"
        : tone === "ok"
          ? "#3DDC97"
          : "#FFFFFF";
  return (
    <div className="card p-3 relative">
      <div className="flex items-center justify-between">
        <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono">
          {label}
        </div>
        {live && (
          <span className="text-[9px] font-mono text-jade-400">live</span>
        )}
        {staticHint && (
          <span className="text-[9px] font-mono text-mist-500">static</span>
        )}
      </div>
      <div
        className="mt-1 text-[20px] font-semibold tracking-tight"
        style={{ color: valueColor }}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[11px] text-mist-400 font-mono">{sub}</div>}
    </div>
  );
}

function SubMetric({
  label,
  value,
  live,
}: {
  label: string;
  value: string;
  live?: boolean;
}) {
  return (
    <div className="rounded-md bg-ink-700/40 px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider text-mist-400 font-mono">
          {label}
        </div>
        {live && <span className="text-[9px] text-jade-400 font-mono">live</span>}
      </div>
      <div className="mt-0.5 text-[12.5px] text-white font-mono">{value}</div>
    </div>
  );
}
