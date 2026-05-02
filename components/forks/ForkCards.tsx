"use client";

import { useState } from "react";
import {
  FORKS,
  monthsToPeak,
  priceChangeFromLaunch,
  STATUS_TONE,
} from "@/lib/forks";
import MiniCurve from "@/components/forks/MiniCurve";

const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${(n * 100).toFixed(1)}%`;
const fmtPrice = (n: number) =>
  n >= 100
    ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
    : n >= 1
      ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
      : `$${n.toLocaleString("en-US", { maximumFractionDigits: 4 })}`;

export default function ForkCards() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-6">
        <div className="eyebrow">Project files</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          프로젝트별 케이스
        </h2>
        <p className="mt-2 text-[12.5px] text-ink-400">
          카드를 클릭하면 정규화 곡선을 확장해서 볼 수 있습니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-white/5 rounded-xl overflow-hidden">
        {FORKS.map((f) => {
          const tone = STATUS_TONE[f.status];
          const months = monthsToPeak(f.launched, f.peakDate);
          const launchChange = priceChangeFromLaunch(f);
          const isOpen = openId === f.id;
          const isAlive = f.status === "alive" || f.status === "alive-pivoted";
          return (
            <article key={f.id} className="bg-ink-950 p-6">
              <button
                onClick={() => setOpenId(isOpen ? null : f.id)}
                aria-expanded={isOpen}
                className="w-full text-left"
              >
                <header className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[20px] font-medium text-ink-50">
                        {f.ticker}
                      </span>
                      <span className="text-[14px] text-ink-200">{f.name}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-ink-500 font-mono">
                      {f.chain}, 출시 {f.launched}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="chip"
                      style={{
                        color: tone.color,
                        borderColor: `${tone.color}40`,
                      }}
                    >
                      {tone.label}
                    </span>
                    <span className="text-[11px] text-ink-400 font-mono">
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                </header>

                <div className="mt-5 grid grid-cols-3 gap-3 text-[11.5px]">
                  <div className="card-2 p-3">
                    <div className="eyebrow">정점</div>
                    <div className="mt-1 text-ink-50 font-mono mono-num">
                      {f.peakPrice}
                    </div>
                    <div className="text-ink-500 font-mono text-[10.5px]">
                      {f.peakDate}
                    </div>
                  </div>
                  <div className="card-2 p-3">
                    <div className="eyebrow">정점까지</div>
                    <div className="mt-1 text-ink-50 font-mono mono-num">
                      약 {months}개월
                    </div>
                    <div className="text-ink-500 font-mono text-[10.5px]">
                      출시 후 도달
                    </div>
                  </div>
                  <div className="card-2 p-3">
                    <div className="eyebrow">
                      {isAlive ? "출시 대비" : "정점 대비"}
                    </div>
                    {isAlive ? (
                      <div
                        className="mt-1 font-mono mono-num"
                        style={{
                          color: launchChange >= 0 ? "#3DDC97" : "#FF6A4A",
                        }}
                      >
                        {fmtPct(launchChange)}
                      </div>
                    ) : (
                      <div className="mt-1 text-warn font-mono mono-num">
                        {f.drawdown}
                      </div>
                    )}
                    <div className="text-ink-500 font-mono text-[10.5px]">
                      {isAlive
                        ? `${fmtPrice(f.launchPriceUSD)} → ${fmtPrice(f.recentPriceUSD)}`
                        : `정점 ${fmtPrice(f.peakPriceUSD)}`}
                    </div>
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="mt-5 pt-5 border-t hairline animate-revealUp">
                  <MiniCurve fork={f} />
                  <div className="mt-3 grid grid-cols-3 gap-3 text-[11px] font-mono">
                    <div className="card-2 px-3 py-2">
                      <div className="text-ink-500">출시가</div>
                      <div className="mt-0.5 text-ink-50">
                        {fmtPrice(f.launchPriceUSD)}
                      </div>
                    </div>
                    <div className="card-2 px-3 py-2">
                      <div className="text-ink-500">정점가</div>
                      <div className="mt-0.5 text-warn">
                        {fmtPrice(f.peakPriceUSD)}
                      </div>
                    </div>
                    <div className="card-2 px-3 py-2">
                      <div className="text-ink-500">현재가</div>
                      <div
                        className="mt-0.5"
                        style={{ color: STATUS_TONE[f.status].color }}
                      >
                        {fmtPrice(f.recentPriceUSD)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p className="mt-5 text-[13px] text-ink-100 leading-relaxed">
                <span className="text-ink-400">차별점. </span>
                {f.hook}
              </p>

              <div className="mt-5 space-y-3">
                <div>
                  <div className="eyebrow text-signal">잘 됐던 이유</div>
                  <div className="mt-1 text-[12.5px] text-ink-200 leading-relaxed">
                    {f.whyItGrew}
                  </div>
                </div>
                <div>
                  <div className="eyebrow text-warn">깨진 이유</div>
                  <div className="mt-1 text-[12.5px] text-ink-200 leading-relaxed">
                    {f.whyItBroke}
                  </div>
                </div>
                <div>
                  <div className="eyebrow">결말</div>
                  <div className="mt-1 text-[12.5px] text-ink-100 leading-relaxed">
                    {f.ending}
                  </div>
                </div>
                {f.signature && (
                  <div className="mt-3 pt-3 border-t hairline">
                    <p className="text-[12px] text-ink-400 italic leading-relaxed">
                      {f.signature}
                    </p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
