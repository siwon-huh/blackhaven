"use client";

import { Fork, normalizedCurve, STATUS_TONE } from "@/lib/forks";

type Props = { fork: Fork };

export default function MiniCurve({ fork }: Props) {
  const points = normalizedCurve(fork.peakPriceUSD, fork.recentPriceUSD);
  const color = STATUS_TONE[fork.status].color;

  const W = 360;
  const H = 140;
  const PAD_L = 32;
  const PAD_R = 12;
  const PAD_T = 16;
  const PAD_B = 22;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const xMax = 36;
  const yMax = 100;
  const sx = (x: number) => PAD_L + (x / xMax) * innerW;
  const sy = (y: number) => PAD_T + (1 - Math.min(y, yMax) / yMax) * innerH;

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x)} ${sy(p.y)}`)
    .join(" ");

  // area path (가벼운 fill)
  const dArea = `${d} L ${sx(points[points.length - 1].x)} ${sy(0)} L ${sx(0)} ${sy(0)} Z`;

  const yTicks = [0, 50, 100];
  const xTicks = [0, 12, 24, 36];

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
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

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

      {xTicks.map((t) => (
        <text
          key={`x${t}`}
          x={sx(t)}
          y={H - PAD_B + 13}
          textAnchor="middle"
          fill="#6E7480"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
        >
          {t}m
        </text>
      ))}

      <path d={dArea} fill={`url(#grad-${fork.id})`} />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />

      {/* peak marker */}
      <circle cx={sx(0)} cy={sy(100)} r={2.5} fill="#F4C756" />
      <text
        x={sx(0) + 6}
        y={sy(100) + 9}
        fill="#F4C756"
        fontSize="9"
        fontFamily="ui-monospace, monospace"
      >
        peak
      </text>

      {/* recent marker */}
      <circle
        cx={sx(36)}
        cy={sy(points[points.length - 1].y)}
        r={2.5}
        fill={color}
      />
      <text
        x={sx(36) - 6}
        y={sy(points[points.length - 1].y) - 6}
        textAnchor="end"
        fill={color}
        fontSize="9"
        fontFamily="ui-monospace, monospace"
      >
        recent
      </text>
    </svg>
  );
}
