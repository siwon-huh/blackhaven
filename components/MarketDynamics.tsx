"use client";

import { LAUNCH_SNAPSHOT } from "@/lib/launch";
import { formatRelative, useLiveMetrics } from "@/lib/useLiveMetrics";
import { useBondMetrics } from "@/lib/useBondMetrics";
import { useCommitMetrics } from "@/lib/useCommitMetrics";

type Strength = "strong" | "moderate" | "weak";
type Tone = "signal" | "neutral" | "warn";

const TONE_COLOR: Record<Tone, string> = {
  signal: "var(--signal)",
  neutral: "#C9CDD4",
  warn: "var(--warn)",
};

const STRENGTH_LABEL: Record<Strength, string> = {
  strong: "강함",
  moderate: "보통",
  weak: "약함",
};

const fmtUsdK = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${(n / 1_000).toFixed(0)}K`;
const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

export default function MarketDynamics() {
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
  const navPump: { strength: Strength; tone: Tone; reason: string } = (() => {
    // Treasury 빠르게 차오를수록 강함. 라이브로는 본드 outstanding 합계 + Premium 둘 다 큰 것이 강한 펌프 신호.
    if (bondTotalUSDm > 400_000 && premiumMult > 2.5) {
      return {
        strength: "strong",
        tone: "signal",
        reason:
          "Premium 이 큰 상태에서 본드 inflow 도 빠릅니다. BAM 위쪽 매도와 신규 본드가 함께 reserves 를 빠르게 채우는 중.",
      };
    }
    if (bondTotalUSDm > 150_000) {
      return {
        strength: "moderate",
        tone: "signal",
        reason:
          "본드 풀에 의미있는 자본이 누적 중입니다. NAV 가 안정적으로 추격합니다.",
      };
    }
    return {
      strength: "weak",
      tone: "warn",
      reason: "본드 inflow 가 둔화되어 있습니다. NAV 추격 페이스가 떨어집니다.",
    };
  })();

  const flow: { label: string; tone: Tone; reason: string } = (() => {
    if (txnRatio > 1.15 && delta1h > 1) {
      return {
        label: "매수 우세",
        tone: "signal",
        reason: `24h 매수 트랜잭션이 매도의 ${txnRatio.toFixed(2)} 배, 1h 가격 ${fmtPct(delta1h)}.`,
      };
    }
    if (txnRatio < 0.85 || delta1h < -2) {
      return {
        label: "매도 우세",
        tone: "warn",
        reason: `매도 트랜잭션 비율이 매수보다 큽니다 (${txnRatio.toFixed(2)}). 1h ${fmtPct(delta1h)}.`,
      };
    }
    return {
      label: "균형",
      tone: "neutral",
      reason: `매수/매도 거의 1:1 (${txnRatio.toFixed(2)}). 1h ${fmtPct(delta1h)}.`,
    };
  })();

  const lock: { label: string; tone: Tone; reason: string } = (() => {
    if (lockRatioPct > 5) {
      return {
        label: "확장 중",
        tone: "signal",
        reason: `Stake TVL ${fmtUsdK(stakeTVL)} 가 FDV 의 ${lockRatioPct.toFixed(1)}퍼센트. 매도 가능 RBT 가 의미있게 잠겨 있습니다.`,
      };
    }
    if (lockRatioPct > 1.5) {
      return {
        label: "성장 초기",
        tone: "neutral",
        reason: `Stake TVL ${fmtUsdK(stakeTVL)}. FDV 의 ${lockRatioPct.toFixed(1)}퍼센트로 lock 비율이 아직 작습니다.`,
      };
    }
    return {
      label: "낮음",
      tone: "warn",
      reason: `Stake TVL ${fmtUsdK(stakeTVL)}. FDV 의 ${lockRatioPct.toFixed(1)}퍼센트. 유통 매도 가능 RBT 비중이 큽니다.`,
    };
  })();

  const wave: { label: string; tone: Tone; reason: string } = (() => {
    // 본드 outstanding 의 absolute 값. 클수록 만기 도래 시 유통량 점프 wave.
    if (bondOutstandingRBT > 25_000) {
      return {
        label: "큰 wave 가능",
        tone: "warn",
        reason: `outstanding ${bondOutstandingRBT.toFixed(0)} RBT 가 본드 만기에 점진 분배됩니다. 유통량 점프 시 단기 매도 압력.`,
      };
    }
    if (bondOutstandingRBT > 8_000) {
      return {
        label: "중간",
        tone: "neutral",
        reason: `outstanding ${bondOutstandingRBT.toFixed(0)} RBT. 만기 분배가 점진적으로 유통량을 늘립니다.`,
      };
    }
    return {
      label: "작음",
      tone: "signal",
      reason: `outstanding ${bondOutstandingRBT.toFixed(0)} RBT. 본드 만기 wave 의 단기 매도 압력은 작습니다.`,
    };
  })();

  // 종합 진단
  const score =
    (navPump.tone === "signal" ? 1 : navPump.tone === "warn" ? -1 : 0) +
    (flow.tone === "signal" ? 1 : flow.tone === "warn" ? -1 : 0) +
    (lock.tone === "signal" ? 1 : lock.tone === "warn" ? -1 : 0) +
    (wave.tone === "warn" ? -1 : 0);

  const outlook: { label: string; tone: Tone; summary: string } = (() => {
    if (score >= 2) {
      return {
        label: "우상향 가능",
        tone: "signal",
        summary:
          "NAV 가 빠르게 차오르고 매수 우세에 lock 비율도 받쳐주는 상태. Premium 이 유지되며 시장가가 NAV 를 따라 절대 가격이 상승합니다.",
      };
    }
    if (score <= -2) {
      return {
        label: "하방 압력",
        tone: "warn",
        summary:
          "NAV 펌프 페이스가 약하고 매도 우세 또는 본드 만기 wave 가 임박해 있습니다. Premium 가 빠르게 NAV 부근까지 축소될 수 있습니다.",
      };
    }
    return {
      label: "균형",
      tone: "neutral",
      summary:
        "NAV 추격과 매도 압력이 균형 상태. BAM 이 가격을 NAV 위 일정 배율에서 진동시키는 구간입니다. 다음 큰 움직임은 Stake/Commit lock 증가, HVN TGE, 외부 등재 같은 외생 트리거에 달려 있습니다.",
    };
  })();

  const triggers = [
    {
      done: lockRatioPct > 5,
      label: "Stake TVL 가 FDV 의 5퍼센트 이상으로 차오름",
      detail: "유통 매도 가능 RBT 감소 → Premium 안정",
    },
    {
      done: bondTotalUSDm > 400_000,
      label: "본드 풀 합계 $400K 이상 도달",
      detail: "NAV 펌프 가속, Treasury 우상향 명확",
    },
    {
      done: txnRatio > 1.2 && delta1h > 0,
      label: "Buy/Sell 비율 1.2 이상에서 1h 양수 흐름 지속",
      detail: "외부 수요 유입 또는 신규 등재 사이클 시작",
    },
    {
      done: false,
      label: "RBT 가 외부 lending 또는 perp 에 담보로 등재",
      detail: "수요 다각화로 Premium buoy",
    },
  ];

  const bondTotalRBT = bondOutstandingRBT;

  return (
    <section id="dynamics" className="max-w-6xl mx-auto px-6 pb-14">
      <div className="card p-6 md:p-8">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="chip">Market Dynamics</span>
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
                {outlook.label}
              </span>
            </div>
            <h2 className="mt-4 text-[26px] headline text-ink-50">
              어떤 움직임이 보여야 RBT 가 오를까
            </h2>
            <p className="mt-2 text-[13px] text-ink-300 max-w-2xl leading-relaxed">
              가격은 <span className="text-ink-50">NAV × Premium 배수</span> 로
              분해됩니다. NAV 펌프와 매도 압력, 락업 비율, 본드 만기 wave 네
              가지 동력을 1초 단위로 갱신합니다.
            </p>
          </div>
          <span className="text-[10.5px] text-ink-500 font-mono">
            updated {formatRelative(live.lastUpdated)}
          </span>
        </header>

        <div className="mt-7 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden">
          <SignalCard
            label="NAV Pump"
            value={STRENGTH_LABEL[navPump.strength]}
            tone={navPump.tone}
            sub={`NAV ${nav.toFixed(2)} USDm${reservesUSDm ? `, reserves ${fmtUsdK(reservesUSDm)}` : ""}, Premium ${premiumMult.toFixed(2)}×`}
            detail={navPump.reason}
            sourceLabel={bond.snapshot.source}
          />
          <SignalCard
            label="Buy / Sell Pressure"
            value={flow.label}
            tone={flow.tone}
            sub={`24h Buy ${buys24.toLocaleString()} / Sell ${sells24.toLocaleString()}, ratio ${txnRatio.toFixed(2)}`}
            detail={flow.reason}
            sourceLabel={live.remote ? "live" : "stale"}
          />
          <SignalCard
            label="Lock Ratio"
            value={`${lockRatioPct.toFixed(1)}%`}
            tone={lock.tone}
            sub={`Stake TVL ${fmtUsdK(stakeTVL)} / FDV ${fmtUsdK(fdv)}`}
            detail={lock.reason}
            sourceLabel={
              commit.snapshot?.source === "onchain" ? "live" : "static"
            }
          />
          <SignalCard
            label="Bond Maturity Wave"
            value={wave.label}
            tone={wave.tone}
            sub={`outstanding ${bondTotalRBT.toFixed(0)} RBT 분배 예정`}
            detail={wave.reason}
            sourceLabel={bond.snapshot.source}
          />
        </div>

        <div
          className="mt-6 card-2 p-5"
          style={{ borderColor: `${TONE_COLOR[outlook.tone]}30` }}
        >
          <div className="eyebrow" style={{ color: TONE_COLOR[outlook.tone] }}>
            진단, {outlook.label}
          </div>
          <p className="mt-2 text-[13.5px] text-ink-100 leading-relaxed">
            {outlook.summary}
          </p>
        </div>

        <div className="mt-5">
          <div className="eyebrow mb-2">우상향 트리거 체크리스트</div>
          <div className="grid md:grid-cols-2 gap-2">
            {triggers.map((t) => (
              <div
                key={t.label}
                className="card-2 p-3 flex items-start gap-3"
                style={{
                  borderColor: t.done
                    ? "rgba(61,220,151,0.3)"
                    : "rgba(255,255,255,0.06)",
                  background: t.done ? "rgba(61,220,151,0.05)" : undefined,
                }}
              >
                <span
                  className="mt-0.5 inline-flex items-center justify-center h-4 w-4 rounded-sm border text-[10px] font-mono shrink-0"
                  style={{
                    color: t.done ? "var(--signal)" : "var(--text-3, #9AA0AB)",
                    borderColor: t.done
                      ? "rgba(61,220,151,0.5)"
                      : "rgba(255,255,255,0.15)",
                    background: t.done ? "rgba(61,220,151,0.1)" : "transparent",
                  }}
                >
                  {t.done ? "✓" : ""}
                </span>
                <div className="min-w-0">
                  <div className="text-[12.5px] text-ink-100 leading-snug">
                    {t.label}
                  </div>
                  <div className="text-[11px] text-ink-400 mt-0.5 leading-relaxed">
                    {t.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 text-[11px] text-ink-400 leading-relaxed">
          NAV 자체는 정적 fallback (앱 Metrics 페이지 수기 sync) 이라 NAV 가
          천천히 차오르는 추세 자체는 이 패널에서 직접 측정되지 않습니다.
          시그널은 본드 onchain 잔액과 dexscreener 라이브 데이터, Stake 정적 TVL
          의 조합으로 추정합니다.
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
