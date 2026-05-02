"use client";

import { useMemo, useState } from "react";
import { FORKS, STATUS_TONE } from "@/lib/forks";

// 정점 100 으로 정규화한 사용자 평균 진입 가정의 단순 곡선.
// 정점 -> 6개월 후 -50% -> 12개월 후 -85% -> 현재값으로 수렴하는 형태로 보간.
// peakDate 부터 36 개월 까지 표시.

type Series = {
  id: string;
  ticker: string;
  name: string;
  color: string;
  points: { x: number; y: number }[]; // x: months from peak, y: % of peak
};

const monthsBetween = (a: string, b: string) => {
  const [ay, am] = a.split("-").map(Number);
  const [by, bm] = b.split("-").map(Number);
  return (by - ay) * 12 + (bm - am);
};

const buildPoints = (peakUSD: number, recentUSD: number): { x: number; y: number }[] => {
  const recentY = Math.max(0.4, (recentUSD / peakUSD) * 100);
  // 핵심 곡선: peak (0,100) -> 1m (-25%) -> 3m (-55%) -> 6m (-75%) -> 12m (-90%) -> 24m -> 36m
  // 마지막 두 포인트는 recent 값으로 부드럽게 수렴
  const a12 = Math.max(recentY, 8);
  const a24 = Math.max(recentY, recentY * 1.4);
  const x: number[] = [0, 0.5, 1, 2, 3, 6, 9, 12, 18, 24, 30, 36];
  const y: number[] = [
    100,
    92,
    78,
    62,
    44,
    24,
    14,
    a12,
    Math.max(recentY, a12 * 0.8),
    a24 * 0.7 + recentY * 0.3,
    recentY * 1.05,
    recentY,
  ];
  return x.map((xi, i) => ({ x: xi, y: y[i] }));
};

export default function PriceCurveChart() {
  const series: Series[] = useMemo(
    () =>
      FORKS.map((f) => ({
        id: f.id,
        ticker: f.ticker,
        name: f.name,
        color: STATUS_TONE[f.status].color,
        points: buildPoints(f.peakPriceUSD, f.recentPriceUSD),
      })),
    [],
  );

  const [active, setActive] = useState<string | null>(null);

  const W = 1100;
  const H = 380;
  const PAD_L = 56;
  const PAD_R = 24;
  const PAD_T = 28;
  const PAD_B = 36;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const xMax = 36; // months
  const yMax = 100;

  const sx = (x: number) => PAD_L + (x / xMax) * innerW;
  const sy = (y: number) => PAD_T + (1 - Math.min(y, yMax) / yMax) * innerH;

  const yTicks = [0, 25, 50, 75, 100];
  const xTicks = [0, 6, 12, 18, 24, 30, 36];

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-6">
        <div className="eyebrow">Price normalized</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">정점 이후 가격 곡선</h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          모든 토큰을 정점 가격을 100 으로 두고 정규화했습니다. 가로축은 정점 이후 경과 개월, 세로축은 정점 대비 잔여 가격입니다. 한 토큰만 강조해서 보려면 아래 범례를 누르세요.
        </p>
      </div>

      <div className="card p-5 md:p-7">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="OHM forks normalized price curves"
        >
          {/* y grid */}
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={sy(t)}
                y2={sy(t)}
                stroke="rgba(255,255,255,0.06)"
              />
              <text
                x={PAD_L - 8}
                y={sy(t) + 4}
                textAnchor="end"
                fill="#6E7480"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
              >
                {t}%
              </text>
            </g>
          ))}

          {/* x ticks */}
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line
                x1={sx(t)}
                x2={sx(t)}
                y1={PAD_T}
                y2={H - PAD_B}
                stroke="rgba(255,255,255,0.04)"
              />
              <text
                x={sx(t)}
                y={H - PAD_B + 18}
                textAnchor="middle"
                fill="#6E7480"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
              >
                {t}m
              </text>
            </g>
          ))}

          {/* curves */}
          {series.map((s) => {
            const isActive = active === s.id;
            const isDim = active && active !== s.id;
            const d = s.points
              .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x)} ${sy(p.y)}`)
              .join(" ");
            return (
              <g key={s.id} opacity={isDim ? 0.18 : 1}>
                <path
                  d={d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={isActive ? 2.4 : 1.4}
                  strokeLinejoin="round"
                />
                {isActive &&
                  s.points.map((p, i) => (
                    <circle
                      key={i}
                      cx={sx(p.x)}
                      cy={sy(p.y)}
                      r={2.5}
                      fill={s.color}
                    />
                  ))}
                {/* end label */}
                <text
                  x={sx(s.points[s.points.length - 1].x) + 6}
                  y={sy(s.points[s.points.length - 1].y) + 4}
                  fill={s.color}
                  fontSize="11"
                  fontFamily="ui-monospace, monospace"
                  opacity={isDim ? 0 : 1}
                >
                  {s.ticker}
                </text>
              </g>
            );
          })}

          {/* axis label */}
          <text
            x={W - PAD_R}
            y={PAD_T - 12}
            textAnchor="end"
            fill="#9AA0AB"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
          >
            % of peak
          </text>
        </svg>

        <div className="mt-5 pt-4 border-t hairline flex flex-wrap gap-2">
          {series.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(isActive ? null : s.id)}
                className={[
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[11.5px] font-mono transition-colors",
                  isActive
                    ? "bg-ink-700 text-ink-50"
                    : "bg-ink-900 text-ink-300 hover:text-ink-50",
                ].join(" ")}
              >
                <span
                  className="h-1.5 w-3 rounded-sm"
                  style={{ background: s.color }}
                />
                {s.ticker}
                <span className="text-ink-500">{s.name}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-[11.5px] text-ink-400 leading-relaxed">
          가격 데이터는 CMC 와 CoinGecko 의 공개 정보 기반 근사치이며, 곡선은 정점에서 현재값까지 보간한 모형입니다. 실제 구간별 가격과 차이가 있을 수 있습니다.
        </p>
      </div>
    </section>
  );
}
