import { LAUNCH_SNAPSHOT, VERDICT_TONE } from "@/lib/launch";

const SIGNAL_TONE = {
  warn: { color: "#F4C756", icon: "⚠" },
  ok: { color: "#3DDC97", icon: "✓" },
};

export default function LaunchSnapshot() {
  const s = LAUNCH_SNAPSHOT;
  return (
    <section id="live" className="max-w-6xl mx-auto px-6 pb-10">
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-jade-400 via-violet-500 to-ember-500" />

        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="chip" style={{ color: "#3DDC97", borderColor: "#3DDC9740" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-jade-400 animate-pulse" />
                Live · {s.timeSinceLaunch}
              </span>
              <span className="chip">{s.venue}</span>
              <span className="chip">{s.asset}</span>
            </div>
            <h2 className="mt-3 text-[24px] font-semibold tracking-tight text-white">
              출시 직후 스냅샷
            </h2>
            <p className="mt-1 text-[12px] text-mist-400 font-mono">{s.capturedAt}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11.5px] font-mono">
            <a className="chip hover:text-white" href={s.appMetrics} target="_blank" rel="noreferrer">
              app ↗
            </a>
            <a className="chip hover:text-white" href={s.dexscreener} target="_blank" rel="noreferrer">
              dexscreener ↗
            </a>
            <a className="chip hover:text-white" href={s.poolUrl} target="_blank" rel="noreferrer">
              kumbaya ↗
            </a>
          </div>
        </header>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Metric label="Market Price" value={s.metrics.price} sub={s.metrics.priceUSDm} />
          <Metric
            label="NAV (Reserves/RBT)"
            value={s.metrics.nav}
            sub={s.metrics.navTreasury}
            tone="ok"
          />
          <Metric label="Liquidity" value={s.metrics.liquidity} sub={`FDV ${s.metrics.fdv}`} />
          <Metric
            label="24h Δ"
            value={s.metrics.delta24h}
            sub={`peak ${s.metrics.peakApprox} · ${s.metrics.drawdownFromPeak}`}
            tone="up"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11.5px]">
          <SubMetric label="Circulating / Total" value={`${s.metrics.circulating} / ${s.metrics.totalSupply}`} />
          <SubMetric label="Pool Balance" value={`${s.metrics.poolRBT} · ${s.metrics.poolUSDm}`} />
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
              NAV premium · 시장가 vs 백킹
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-[24px] font-semibold text-white tracking-tight">
                {s.navAnalysis.premium}
              </div>
            </div>
            <p className="mt-2 text-[12.5px] text-mist-200 leading-relaxed">
              {s.navAnalysis.interpretation}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="rounded-md bg-ink-700/60 p-2">
                <div className="text-mist-400">NAV (공식)</div>
                <div className="mt-0.5 text-jade-400">{s.navAnalysis.nav}</div>
              </div>
              <div className="rounded-md bg-ink-700/60 p-2">
                <div className="text-mist-400">Market</div>
                <div className="mt-0.5 text-white">{s.navAnalysis.market}</div>
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
                    <span className="font-mono text-[11px]" style={{ color: tone.color }}>
                      {tone.icon}
                    </span>
                    <span className="text-[12.5px] font-semibold text-white">{sig.label}</span>
                  </div>
                  <p className="mt-1 ml-5 text-[11.5px] text-mist-300 leading-relaxed">
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
          모든 수치는 앱 Metrics 페이지 + Kumbaya pool에서 직접 캡처. NAV는 공식 on-chain 값.
          숫자가 변하면 <span className="font-mono text-mist-300">lib/launch.ts</span>와
          <span className="font-mono text-mist-300"> lib/fairValue.ts</span>만 업데이트.
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
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "up" | "down" | "ok";
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
    <div className="card p-3">
      <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono">
        {label}
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

function SubMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-ink-700/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-mist-400 font-mono">
        {label}
      </div>
      <div className="mt-0.5 text-[12.5px] text-white font-mono">{value}</div>
    </div>
  );
}
