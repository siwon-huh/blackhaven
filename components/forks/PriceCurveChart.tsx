"use client";

import { useMemo, useState } from "react";
import {
  FORKS,
  PRICE_HISTORY,
  STATUS_TONE,
  monthsToPeak,
} from "@/lib/forks";
import { useT } from "@/lib/locale-context";

// 출시 후 월별 가격 곡선. 각 fork 의 peak 가격을 100 으로 정규화.
// x = 출시 후 월수, y = 정점 대비 잔여 가격 (퍼센트).
// peak 까지 도달하는 시간이 fork 마다 다르므로 곡선 시작이 100 이 아닙니다.

type Series = {
  id: string;
  ticker: string;
  name: string;
  color: string;
  peakIndex: number;
  points: { x: number; y: number }[];
};

const buildPoints = (
  history: number[] | undefined,
  peakUSD: number,
): { x: number; y: number }[] => {
  if (!history || history.length === 0 || peakUSD <= 0) return [];
  return history.map((usd, i) => ({
    x: i,
    y: Math.max(0.4, (usd / peakUSD) * 100),
  }));
};

export default function PriceCurveChart() {
  const t = useT();
  const series: Series[] = useMemo(
    () =>
      FORKS.map((f) => ({
        id: f.id,
        ticker: f.ticker,
        name: f.name,
        color: STATUS_TONE[f.status].color,
        peakIndex: monthsToPeak(f.launched, f.peakDate),
        points: buildPoints(PRICE_HISTORY[f.id], f.peakPriceUSD),
      })).filter((s) => s.points.length > 0),
    [],
  );

  const [active, setActive] = useState<string | null>(null);
  const [logScale, setLogScale] = useState<boolean>(true);

  const W = 1100;
  const H = 420;
  const PAD_L = 60;
  const PAD_R = 56;
  const PAD_T = 32;
  const PAD_B = 40;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const xMax = 36; // months from launch
  const yMax = 100;
  const yMinLog = 0.1;
  const logMin = Math.log10(yMinLog);
  const logMax = Math.log10(yMax);

  const sx = (x: number) => PAD_L + (Math.min(x, xMax) / xMax) * innerW;
  const sy = (y: number) => {
    if (logScale) {
      const v = Math.max(yMinLog, Math.min(y, yMax));
      const tt = (Math.log10(v) - logMin) / (logMax - logMin);
      return PAD_T + (1 - tt) * innerH;
    }
    return PAD_T + (1 - Math.min(y, yMax) / yMax) * innerH;
  };

  const yTicks = logScale ? [0.1, 1, 10, 100] : [0, 25, 50, 75, 100];
  const xTicks = [0, 3, 6, 9, 12, 18, 24, 30, 36];

  // 끝점 라벨 분산: 같은 위치에 겹치지 않도록 y 미세 조정.
  const lastPoints = series
    .map((s) => ({
      id: s.id,
      ticker: s.ticker,
      color: s.color,
      x: s.points[s.points.length - 1].x,
      y: s.points[s.points.length - 1].y,
    }))
    .sort((a, b) => b.y - a.y);

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">Price normalized</div>
          <h2 className="mt-2 text-[28px] headline text-ink-50">
            {t("forks.priceCurve.heading")}
          </h2>
          <p className="mt-2 subhead text-[13px] max-w-2xl">
            {t("forks.priceCurve.intro")}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="text-ink-500 mr-2">scale</span>
          <button
            onClick={() => setLogScale(false)}
            className={[
              "px-2.5 py-1 rounded-md transition-colors",
              !logScale
                ? "bg-ink-700 text-ink-50"
                : "text-ink-400 hover:text-ink-50",
            ].join(" ")}
          >
            linear
          </button>
          <button
            onClick={() => setLogScale(true)}
            className={[
              "px-2.5 py-1 rounded-md transition-colors",
              logScale
                ? "bg-ink-700 text-ink-50"
                : "text-ink-400 hover:text-ink-50",
            ].join(" ")}
          >
            log
          </button>
        </div>
      </div>

      <div className="card p-5 md:p-7">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="OHM forks normalized price curves from launch"
        >
          {/* y grid */}
          {yTicks.map((tk) => (
            <g key={`y${tk}`}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={sy(tk)}
                y2={sy(tk)}
                stroke="rgba(255,255,255,0.06)"
              />
              <text
                x={PAD_L - 8}
                y={sy(tk) + 4}
                textAnchor="end"
                fill="#6E7480"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
              >
                {tk}%
              </text>
            </g>
          ))}

          {/* x ticks */}
          {xTicks.map((tk) => (
            <g key={`x${tk}`}>
              <line
                x1={sx(tk)}
                x2={sx(tk)}
                y1={PAD_T}
                y2={H - PAD_B}
                stroke={
                  tk % 12 === 0 && tk > 0
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.04)"
                }
              />
              <text
                x={sx(tk)}
                y={H - PAD_B + 18}
                textAnchor="middle"
                fill="#6E7480"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
              >
                {tk}m
              </text>
            </g>
          ))}

          {/* 100% baseline */}
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={sy(100)}
            y2={sy(100)}
            stroke="rgba(255,255,255,0.18)"
            strokeDasharray="2 4"
          />

          {/* curves */}
          {series.map((s) => {
            const isActive = active === s.id;
            const isDim = !!active && active !== s.id;
            const d = s.points
              .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x)} ${sy(p.y)}`)
              .join(" ");
            const peakPoint = s.points[s.peakIndex];
            return (
              <g key={s.id} opacity={isDim ? 0.14 : 1}>
                <path
                  d={d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={isActive ? 2.4 : 1.4}
                  strokeLinejoin="round"
                />
                {/* peak diamond */}
                {peakPoint && (
                  <g
                    transform={`translate(${sx(peakPoint.x)} ${sy(peakPoint.y)}) rotate(45)`}
                  >
                    <rect
                      x={-3}
                      y={-3}
                      width={6}
                      height={6}
                      fill={s.color}
                      opacity={isActive ? 1 : 0.85}
                    />
                  </g>
                )}
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
              </g>
            );
          })}

          {/* end labels (sorted to reduce overlap) */}
          {lastPoints.map((p, i) => {
            const isDim = !!active && active !== p.id;
            const offsetY =
              i > 0 && Math.abs(lastPoints[i - 1].y - p.y) < 6
                ? (i % 2 === 0 ? -1 : 1) * 6
                : 0;
            return (
              <text
                key={p.id}
                x={sx(p.x) + 6}
                y={sy(p.y) + 4 + offsetY}
                fill={p.color}
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                opacity={isDim ? 0 : 1}
              >
                {p.ticker}
              </text>
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
          <text
            x={PAD_L}
            y={PAD_T - 12}
            fill="#9AA0AB"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
          >
            ◆ {t("forks.priceCurve.peakMarker")}
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
                <span className="text-ink-600">
                  {t("forks.priceCurve.toPeak").replace(
                    "{n}",
                    String(s.peakIndex),
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-[11.5px] text-ink-400 leading-relaxed">
          {t("forks.priceCurve.disclaimer")}
        </p>
      </div>
    </section>
  );
}
