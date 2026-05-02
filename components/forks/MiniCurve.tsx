"use client";

import {
  Fork,
  monthsToPeak,
  normalizedCurve,
  STATUS_TONE,
} from "@/lib/forks";

type Props = { fork: Fork };

// 정점까지 일수를 개월 단위에서 일 단위로 환산 (개월 × 30).
const peakDays = (fork: Fork) => Math.max(1, monthsToPeak(fork.launched, fork.peakDate) * 30);

export default function MiniCurve({ fork }: Props) {
  const pDays = peakDays(fork);
  const points = normalizedCurve(
    pDays,
    fork.recentPriceUSD,
    fork.peakPriceUSD,
    fork.launchPriceUSD,
  );
  const color = STATUS_TONE[fork.status].color;

  const W = 540;
  const H = 200;
  const PAD_L = 44;
  const PAD_R = 60;
  const PAD_T = 22;
  const PAD_B = 28;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  // x 도메인: 0 부터 36개월 (1080일) 까지. 단, peakDays 가 1080 보다 크면 확장.
  const xMaxDays = Math.max(1080, pDays + 730);
  const yMax = 100;

  const sx = (xDays: number) => PAD_L + (xDays / xMaxDays) * innerW;
  const sy = (y: number) => PAD_T + (1 - Math.min(y, yMax) / yMax) * innerH;

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x)} ${sy(p.y)}`)
    .join(" ");
  const dArea = `${d} L ${sx(points[points.length - 1].x)} ${sy(0)} L ${sx(points[0].x)} ${sy(0)} Z`;

  // x ticks: 출시, peak, 30d, 90d, 180d, 365d, 730d, 1080d
  const xTicks = [
    { x: 0, label: "0d" },
    { x: pDays, label: `peak ${pDays}d`, isPeak: true },
    { x: pDays + 30, label: "+30d" },
    { x: pDays + 90, label: "+90d" },
    { x: pDays + 180, label: "+180d" },
    { x: pDays + 365, label: "+1y" },
    { x: pDays + 730, label: "+2y" },
  ].filter((t) => t.x <= xMaxDays);

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${fork.ticker} normalized price curve`}
    >
      <defs>
        <linearGradient id={`grad-${fork.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* y grid */}
      {yTicks.map((t) => (
        <g key={`y${t}`}>
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={sy(t)}
            y2={sy(t)}
            stroke="rgba(255,255,255,0.05)"
          />
          <text
            x={PAD_L - 6}
            y={sy(t) + 3}
            textAnchor="end"
            fill="#6E7480"
            fontSize="9"
            fontFamily="ui-monospace, monospace"
          >
            {t}%
          </text>
        </g>
      ))}

      {/* peak vertical guide */}
      <line
        x1={sx(pDays)}
        x2={sx(pDays)}
        y1={PAD_T}
        y2={H - PAD_B}
        stroke="#F4C75660"
        strokeDasharray="2 3"
      />

      {/* x ticks */}
      {xTicks.map((t, i) => (
        <g key={`x${i}`}>
          <line
            x1={sx(t.x)}
            x2={sx(t.x)}
            y1={H - PAD_B}
            y2={H - PAD_B + 3}
            stroke="rgba(255,255,255,0.15)"
          />
          <text
            x={sx(t.x)}
            y={H - PAD_B + 14}
            textAnchor="middle"
            fill={t.isPeak ? "#F4C756" : "#6E7480"}
            fontSize="9"
            fontFamily="ui-monospace, monospace"
          >
            {t.label}
          </text>
        </g>
      ))}

      {/* area + line */}
      <path d={dArea} fill={`url(#grad-${fork.id})`} />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />

      {/* peak marker */}
      <circle cx={sx(pDays)} cy={sy(100)} r={3} fill="#F4C756" stroke="#06070A" strokeWidth={1} />

      {/* launch marker */}
      <circle
        cx={sx(0)}
        cy={sy((fork.launchPriceUSD / fork.peakPriceUSD) * 100)}
        r={2.5}
        fill="#9AA0AB"
        stroke="#06070A"
        strokeWidth={1}
      />

      {/* recent marker */}
      <circle
        cx={sx(points[points.length - 1].x)}
        cy={sy(points[points.length - 1].y)}
        r={2.5}
        fill={color}
        stroke="#06070A"
        strokeWidth={1}
      />
      <text
        x={sx(points[points.length - 1].x) + 6}
        y={sy(points[points.length - 1].y) + 3}
        fill={color}
        fontSize="9"
        fontFamily="ui-monospace, monospace"
      >
        recent
      </text>

      {/* days-to-peak callout */}
      <g>
        <rect
          x={sx(pDays) - 32}
          y={PAD_T - 18}
          width={64}
          height={16}
          rx={3}
          fill="#06070A"
          stroke="#F4C75660"
        />
        <text
          x={sx(pDays)}
          y={PAD_T - 7}
          textAnchor="middle"
          fill="#F4C756"
          fontSize="9.5"
          fontFamily="ui-monospace, monospace"
        >
          peak {pDays}d
        </text>
      </g>
    </svg>
  );
}
