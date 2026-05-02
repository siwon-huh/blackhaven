"use client";

import { LAUNCH_SNAPSHOT } from "@/lib/launch";
import { formatRelative, useLiveMetrics } from "@/lib/useLiveMetrics";
import { useBondMetrics } from "@/lib/useBondMetrics";
import { useCommitMetrics } from "@/lib/useCommitMetrics";
import { useLocale, useT } from "@/lib/locale-context";

type Strength = "strong" | "moderate" | "weak";
type Tone = "signal" | "neutral" | "warn";

const TONE_COLOR: Record<Tone, string> = {
  signal: "var(--signal)",
  neutral: "#C9CDD4",
  warn: "var(--warn)",
};

const STRENGTH_KEY: Record<Strength, string> = {
  strong: "md.strength.strong",
  moderate: "md.strength.moderate",
  weak: "md.strength.weak",
};

const fmtUsdK = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${(n / 1_000).toFixed(0)}K`;
const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

export default function MarketDynamics() {
  const t = useT();
  const locale = useLocale();
  const isEN = locale === "en";
  const live = useLiveMetrics(1_000);
  const bond = useBondMetrics(1_000);
  const commit = useCommitMetrics(1_000);

  // NAV 는 onchain 응답이 있으면 라이브, 없으면 정적 fallback.
  const navLive = live.remote?.onchain?.navUSDm;
  const navIsLive = !!(navLive && navLive > 0);
  const nav = navIsLive ? navLive! : parseFloat(LAUNCH_SNAPSHOT.metrics.nav);
  const market = live.metrics.marketPriceUSDm || 0;
  const premiumMult = market > 0 ? market / nav : 0;
  const reservesUSDm = live.remote?.onchain?.reservesUSDm ?? null;

  const buys24 = live.remote?.flow.buys24h ?? 0;
  const sells24 = live.remote?.flow.sells24h ?? 0;
  const txnRatio = sells24 > 0 ? buys24 / sells24 : buys24 > 0 ? 99 : 1;
  const delta1h = live.remote?.delta.h1 ?? 0;

  const bondTotalUSDm = bond.snapshot.totalTVLUSDm;
  const bondOutstandingRBT = market > 0 ? bondTotalUSDm / market : 0;

  const stakeTVL = commit.snapshot?.stake.tvlUSD ?? 42_050;
  const fdv = live.remote?.market.fdvUSD ?? 1_160_000;
  const lockRatioPct = fdv > 0 ? (stakeTVL / fdv) * 100 : 0;

  // 시그널 분류 (단순 임계값)
  const navPump: { strength: Strength; tone: Tone; reasonKey: string } =
    (() => {
      if (bondTotalUSDm > 400_000 && premiumMult > 2.5) {
        return {
          strength: "strong",
          tone: "signal",
          reasonKey: "md.signal.navPump.strong",
        };
      }
      if (bondTotalUSDm > 150_000) {
        return {
          strength: "moderate",
          tone: "signal",
          reasonKey: "md.signal.navPump.moderate",
        };
      }
      return {
        strength: "weak",
        tone: "warn",
        reasonKey: "md.signal.navPump.weak",
      };
    })();

  const flowReasonEN = (label: string) =>
    label === "buy"
      ? `24h buys are ${txnRatio.toFixed(2)}× sells, 1h ${fmtPct(delta1h)}.`
      : label === "sell"
        ? `Sell tx ratio above buys (${txnRatio.toFixed(2)}). 1h ${fmtPct(delta1h)}.`
        : `Buys/sells near 1:1 (${txnRatio.toFixed(2)}). 1h ${fmtPct(delta1h)}.`;
  const flowReasonKO = (label: string) =>
    label === "buy"
      ? `24h 매수 트랜잭션이 매도의 ${txnRatio.toFixed(2)} 배, 1h 가격 ${fmtPct(delta1h)}.`
      : label === "sell"
        ? `매도 트랜잭션 비율이 매수보다 큽니다 (${txnRatio.toFixed(2)}). 1h ${fmtPct(delta1h)}.`
        : `매수/매도 거의 1:1 (${txnRatio.toFixed(2)}). 1h ${fmtPct(delta1h)}.`;

  const flow: { labelKey: string; tone: Tone; reason: string } = (() => {
    if (txnRatio > 1.15 && delta1h > 1) {
      return {
        labelKey: "md.flow.buyDominant",
        tone: "signal",
        reason: isEN ? flowReasonEN("buy") : flowReasonKO("buy"),
      };
    }
    if (txnRatio < 0.85 || delta1h < -2) {
      return {
        labelKey: "md.flow.sellDominant",
        tone: "warn",
        reason: isEN ? flowReasonEN("sell") : flowReasonKO("sell"),
      };
    }
    return {
      labelKey: "md.flow.balanced",
      tone: "neutral",
      reason: isEN ? flowReasonEN("balanced") : flowReasonKO("balanced"),
    };
  })();

  const lockReasonEN = (kind: string) =>
    kind === "expanding"
      ? `Stake TVL ${fmtUsdK(stakeTVL)} is ${lockRatioPct.toFixed(1)}% of FDV. A meaningful share of sellable RBT is locked.`
      : kind === "early"
        ? `Stake TVL ${fmtUsdK(stakeTVL)}. ${lockRatioPct.toFixed(1)}% of FDV, lock ratio is still small.`
        : `Stake TVL ${fmtUsdK(stakeTVL)}. ${lockRatioPct.toFixed(1)}% of FDV, sellable RBT share is large.`;
  const lockReasonKO = (kind: string) =>
    kind === "expanding"
      ? `Stake TVL ${fmtUsdK(stakeTVL)} 가 FDV 의 ${lockRatioPct.toFixed(1)}퍼센트. 매도 가능 RBT 가 의미있게 잠겨 있습니다.`
      : kind === "early"
        ? `Stake TVL ${fmtUsdK(stakeTVL)}. FDV 의 ${lockRatioPct.toFixed(1)}퍼센트로 lock 비율이 아직 작습니다.`
        : `Stake TVL ${fmtUsdK(stakeTVL)}. FDV 의 ${lockRatioPct.toFixed(1)}퍼센트. 유통 매도 가능 RBT 비중이 큽니다.`;

  const lock: { labelKey: string; tone: Tone; reason: string } = (() => {
    if (lockRatioPct > 5) {
      return {
        labelKey: "md.lock.expanding",
        tone: "signal",
        reason: isEN ? lockReasonEN("expanding") : lockReasonKO("expanding"),
      };
    }
    if (lockRatioPct > 1.5) {
      return {
        labelKey: "md.lock.early",
        tone: "neutral",
        reason: isEN ? lockReasonEN("early") : lockReasonKO("early"),
      };
    }
    return {
      labelKey: "md.lock.low",
      tone: "warn",
      reason: isEN ? lockReasonEN("low") : lockReasonKO("low"),
    };
  })();

  const waveReasonEN = (kind: string, n: number) =>
    kind === "large"
      ? `Outstanding ${n.toFixed(0)} RBT will distribute as bonds mature. Short-term sell pressure is possible on supply jumps.`
      : kind === "medium"
        ? `Outstanding ${n.toFixed(0)} RBT. Maturity distribution gradually grows circulating supply.`
        : `Outstanding ${n.toFixed(0)} RBT. Short-term sell pressure from bond maturity is small.`;
  const waveReasonKO = (kind: string, n: number) =>
    kind === "large"
      ? `outstanding ${n.toFixed(0)} RBT 가 본드 만기에 점진 분배됩니다. 유통량 점프 시 단기 매도 압력.`
      : kind === "medium"
        ? `outstanding ${n.toFixed(0)} RBT. 만기 분배가 점진적으로 유통량을 늘립니다.`
        : `outstanding ${n.toFixed(0)} RBT. 본드 만기 wave 의 단기 매도 압력은 작습니다.`;

  const wave: { labelKey: string; tone: Tone; reason: string } = (() => {
    if (bondOutstandingRBT > 25_000) {
      return {
        labelKey: "md.wave.large",
        tone: "warn",
        reason: isEN
          ? waveReasonEN("large", bondOutstandingRBT)
          : waveReasonKO("large", bondOutstandingRBT),
      };
    }
    if (bondOutstandingRBT > 8_000) {
      return {
        labelKey: "md.wave.medium",
        tone: "neutral",
        reason: isEN
          ? waveReasonEN("medium", bondOutstandingRBT)
          : waveReasonKO("medium", bondOutstandingRBT),
      };
    }
    return {
      labelKey: "md.wave.small",
      tone: "signal",
      reason: isEN
        ? waveReasonEN("small", bondOutstandingRBT)
        : waveReasonKO("small", bondOutstandingRBT),
    };
  })();

  // 종합 진단
  const score =
    (navPump.tone === "signal" ? 1 : navPump.tone === "warn" ? -1 : 0) +
    (flow.tone === "signal" ? 1 : flow.tone === "warn" ? -1 : 0) +
    (lock.tone === "signal" ? 1 : lock.tone === "warn" ? -1 : 0) +
    (wave.tone === "warn" ? -1 : 0);

  const outlook: { labelKey: string; tone: Tone; summaryKey: string } = (() => {
    if (score >= 2) {
      return {
        labelKey: "md.outlook.bullish",
        tone: "signal",
        summaryKey: "md.outlook.bullish.summary",
      };
    }
    if (score <= -2) {
      return {
        labelKey: "md.outlook.bearish",
        tone: "warn",
        summaryKey: "md.outlook.bearish.summary",
      };
    }
    return {
      labelKey: "md.outlook.balanced",
      tone: "neutral",
      summaryKey: "md.outlook.balanced.summary",
    };
  })();

  const triggers = [
    {
      done: lockRatioPct > 5,
      labelKey: "md.triggers.stake",
      detailKey: "md.triggers.stake.detail",
    },
    {
      done: bondTotalUSDm > 400_000,
      labelKey: "md.triggers.bondTotal",
      detailKey: "md.triggers.bondTotal.detail",
    },
    {
      done: txnRatio > 1.2 && delta1h > 0,
      labelKey: "md.triggers.flow",
      detailKey: "md.triggers.flow.detail",
    },
    {
      done: false,
      labelKey: "md.triggers.external",
      detailKey: "md.triggers.external.detail",
    },
  ];

  const bondTotalRBT = bondOutstandingRBT;

  return (
    <section id="dynamics" className="max-w-6xl mx-auto px-6 pb-14">
      <div className="card p-6 md:p-8">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="chip">{t("md.title")}</span>
              <span
                className="chip"
                style={{
                  color: TONE_COLOR[outlook.tone],
                  borderColor: `${TONE_COLOR[outlook.tone]}40`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulseDot"
                  style={{ background: TONE_COLOR[outlook.tone] }}
                />
                {t(outlook.labelKey)}
              </span>
            </div>
            <h2 className="mt-4 text-[26px] headline text-ink-50">
              {t("md.heading")}
            </h2>
            <p className="mt-2 text-[13px] text-ink-300 max-w-2xl leading-relaxed">
              {t("md.intro")}
            </p>
          </div>
          <span className="text-[10.5px] text-ink-500 font-mono">
            {t("common.updated")} {formatRelative(live.lastUpdated)}
          </span>
        </header>

        <div className="mt-7 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden">
          <SignalCard
            label={t("md.signals.navPump")}
            value={t(STRENGTH_KEY[navPump.strength])}
            tone={navPump.tone}
            sub={`NAV ${nav.toFixed(2)} USDm${reservesUSDm ? `, reserves ${fmtUsdK(reservesUSDm)}` : ""}, Premium ${premiumMult.toFixed(2)}×`}
            detail={t(navPump.reasonKey)}
            sourceLabel={bond.snapshot.source}
          />
          <SignalCard
            label={t("md.signals.flow")}
            value={t(flow.labelKey)}
            tone={flow.tone}
            sub={`24h Buy ${buys24.toLocaleString()} / Sell ${sells24.toLocaleString()}, ratio ${txnRatio.toFixed(2)}`}
            detail={flow.reason}
            sourceLabel={live.remote ? "live" : "stale"}
          />
          <SignalCard
            label={t("md.signals.lock")}
            value={`${lockRatioPct.toFixed(1)}%`}
            tone={lock.tone}
            sub={`Stake TVL ${fmtUsdK(stakeTVL)} / FDV ${fmtUsdK(fdv)}`}
            detail={lock.reason}
            sourceLabel={
              commit.snapshot?.source === "onchain" ? "live" : "static"
            }
          />
          <SignalCard
            label={t("md.signals.wave")}
            value={t(wave.labelKey)}
            tone={wave.tone}
            sub={
              isEN
                ? `outstanding ${bondTotalRBT.toFixed(0)} RBT pending`
                : `outstanding ${bondTotalRBT.toFixed(0)} RBT 분배 예정`
            }
            detail={wave.reason}
            sourceLabel={bond.snapshot.source}
          />
        </div>

        <div
          className="mt-6 card-2 p-5"
          style={{ borderColor: `${TONE_COLOR[outlook.tone]}30` }}
        >
          <div className="eyebrow" style={{ color: TONE_COLOR[outlook.tone] }}>
            {t("md.diagnosis")}, {t(outlook.labelKey)}
          </div>
          <p className="mt-2 text-[13.5px] text-ink-100 leading-relaxed">
            {t(outlook.summaryKey)}
          </p>
        </div>

        <div className="mt-5">
          <div className="eyebrow mb-2">{t("md.triggers.heading")}</div>
          <div className="grid md:grid-cols-2 gap-2">
            {triggers.map((tr) => (
              <div
                key={tr.labelKey}
                className="card-2 p-3 flex items-start gap-3"
                style={{
                  borderColor: tr.done
                    ? "rgba(61,220,151,0.3)"
                    : "rgba(255,255,255,0.06)",
                  background: tr.done ? "rgba(61,220,151,0.05)" : undefined,
                }}
              >
                <span
                  className="mt-0.5 inline-flex items-center justify-center h-4 w-4 rounded-sm border text-[10px] font-mono shrink-0"
                  style={{
                    color: tr.done ? "var(--signal)" : "var(--text-3, #9AA0AB)",
                    borderColor: tr.done
                      ? "rgba(61,220,151,0.5)"
                      : "rgba(255,255,255,0.15)",
                    background: tr.done
                      ? "rgba(61,220,151,0.1)"
                      : "transparent",
                  }}
                >
                  {tr.done ? "✓" : ""}
                </span>
                <div className="min-w-0">
                  <div className="text-[12.5px] text-ink-100 leading-snug">
                    {t(tr.labelKey)}
                  </div>
                  <div className="text-[11px] text-ink-400 mt-0.5 leading-relaxed">
                    {t(tr.detailKey)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 text-[11px] text-ink-400 leading-relaxed">
          {t("md.disclaimer")}
        </p>
      </div>
    </section>
  );
}

function SignalCard({
  label,
  value,
  tone,
  sub,
  detail,
  sourceLabel,
}: {
  label: string;
  value: string;
  tone: Tone;
  sub: string;
  detail: string;
  sourceLabel: string;
}) {
  return (
    <div className="bg-ink-950 px-5 py-5">
      <div className="flex items-center justify-between">
        <div className="eyebrow">{label}</div>
        <span
          className="text-[9px] font-mono"
          style={{ color: TONE_COLOR[tone] }}
        >
          {sourceLabel === "onchain" || sourceLabel === "live"
            ? "live"
            : sourceLabel}
        </span>
      </div>
      <div
        className="mt-2 text-[20px] font-medium tracking-tightest"
        style={{ color: TONE_COLOR[tone] }}
      >
        {value}
      </div>
      <div className="mt-1 text-[10.5px] text-ink-400 font-mono leading-snug">
        {sub}
      </div>
      <p className="mt-3 text-[11.5px] text-ink-300 leading-relaxed">
        {detail}
      </p>
    </div>
  );
}
