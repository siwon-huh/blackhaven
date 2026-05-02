"use client";

// 자금 흐름 SVG. 사용자 USDm 이 본드를 거쳐 트레저리/POL 로 가고,
// 트레저리에서 BAM 매수 burn, RBT 분배가 다시 사용자에게 흐른다.
// 그리드 정렬된 직각 라인으로 텍스트가 box 밖으로 벗어나지 않게 구성.

import { useT } from "@/lib/locale-context";

export default function FlowDiagram() {
  const t = useT();
  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="mb-6">
        <div className="eyebrow">{t("about.flow.eyebrow")}</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          {t("about.flow.heading")}
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          {t("about.flow.intro")}
        </p>
      </div>

      <div className="card p-6 md:p-10">
        <svg
          viewBox="0 0 1200 480"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Blackhaven fund flow"
        >
          <defs>
            <marker
              id="fdArrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 Z" className="arrowFill" />
            </marker>
            <marker
              id="fdArrowSignal"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 Z" className="arrowFillSignal" />
            </marker>
          </defs>

          <style>{`
            .nodeBox {
              fill: var(--surface-2);
              stroke: var(--line-strong);
              stroke-width: 1;
            }
            .nodeAccent {
              fill: var(--surface-2);
              stroke: rgb(var(--signal-rgb) / 0.45);
              stroke-width: 1;
            }
            .nodeLabel {
              fill: var(--text-1);
              font-family: Inter, ui-sans-serif, system-ui, sans-serif;
              font-size: 14px;
              font-weight: 500;
            }
            .nodeSub {
              fill: var(--text-4);
              font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
              font-size: 10px;
              letter-spacing: 0.14em;
              text-transform: uppercase;
            }
            .nodeSubSignal {
              fill: var(--signal);
              font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
              font-size: 10px;
              letter-spacing: 0.14em;
              text-transform: uppercase;
            }
            .nodeDesc {
              fill: var(--text-3);
              font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
              font-size: 10px;
              letter-spacing: 0.02em;
            }
            .flow {
              stroke: var(--text-4);
              stroke-width: 1.25;
              fill: none;
              opacity: 0.7;
            }
            .flowSignal {
              stroke: var(--signal);
              stroke-width: 1.4;
              fill: none;
            }
            .flowAnim {
              stroke-dasharray: 4 4;
              animation: dashFlow 2.4s linear infinite;
            }
            @keyframes dashFlow { to { stroke-dashoffset: -16; } }
            .flowCaption {
              fill: var(--text-3);
              font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
              font-size: 10.5px;
              letter-spacing: 0.04em;
            }
            .flowCaptionSignal {
              fill: var(--signal);
              font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
              font-size: 10.5px;
              letter-spacing: 0.04em;
            }
            .arrowFill { fill: var(--text-4); }
            .arrowFillSignal { fill: var(--signal); }
            .gridLine { stroke: var(--line); stroke-width: 1; opacity: 0.5; }
          `}</style>

          {/* User */}
          <g>
            <rect
              className="nodeBox"
              x="20"
              y="200"
              width="180"
              height="80"
              rx="12"
            />
            <text className="nodeSub" x="110" y="228" textAnchor="middle">
              User
            </text>
            <text className="nodeLabel" x="110" y="254" textAnchor="middle">
              USDm Holder
            </text>
          </g>

          {/* Bond */}
          <g>
            <rect
              className="nodeBox"
              x="270"
              y="50"
              width="200"
              height="80"
              rx="12"
            />
            <text className="nodeSub" x="370" y="78" textAnchor="middle">
              Bond
            </text>
            <text className="nodeLabel" x="370" y="104" textAnchor="middle">
              7d / 14d / 30d
            </text>
            <text className="nodeDesc" x="370" y="120" textAnchor="middle">
              linear vest, discount
            </text>
          </g>

          {/* RBT */}
          <g>
            <rect
              className="nodeBox"
              x="270"
              y="200"
              width="200"
              height="80"
              rx="12"
            />
            <text className="nodeSub" x="370" y="228" textAnchor="middle">
              RBT
            </text>
            <text className="nodeLabel" x="370" y="254" textAnchor="middle">
              Reserve-Backed Token
            </text>
            <text className="nodeDesc" x="370" y="270" textAnchor="middle">
              backing = reserves / supply
            </text>
          </g>

          {/* Lock */}
          <g>
            <rect
              className="nodeBox"
              x="270"
              y="350"
              width="200"
              height="80"
              rx="12"
            />
            <text className="nodeSub" x="370" y="378" textAnchor="middle">
              Lock
            </text>
            <text className="nodeLabel" x="370" y="404" textAnchor="middle">
              Time-locked NFT
            </text>
            <text className="nodeDesc" x="370" y="420" textAnchor="middle">
              extra RBT distribution
            </text>
          </g>

          {/* Treasury (accent) */}
          <g>
            <rect
              className="nodeAccent"
              x="540"
              y="50"
              width="200"
              height="80"
              rx="12"
            />
            <text className="nodeSubSignal" x="640" y="78" textAnchor="middle">
              Treasury
            </text>
            <text className="nodeLabel" x="640" y="104" textAnchor="middle">
              USDm Reserves
            </text>
            <text className="nodeDesc" x="640" y="120" textAnchor="middle">
              90% of bond
            </text>
          </g>

          {/* BAM (accent) */}
          <g>
            <rect
              className="nodeAccent"
              x="540"
              y="200"
              width="200"
              height="80"
              rx="12"
            />
            <text className="nodeSubSignal" x="640" y="228" textAnchor="middle">
              BAM
            </text>
            <text className="nodeLabel" x="640" y="254" textAnchor="middle">
              Auto two-way arb
            </text>
            <text className="nodeDesc" x="640" y="270" textAnchor="middle">
              above NAV sell, below burn
            </text>
          </g>

          {/* POL */}
          <g>
            <rect
              className="nodeBox"
              x="880"
              y="50"
              width="220"
              height="80"
              rx="12"
            />
            <text className="nodeSub" x="990" y="78" textAnchor="middle">
              POL
            </text>
            <text className="nodeLabel" x="990" y="104" textAnchor="middle">
              Liquidity Manager (V3)
            </text>
            <text className="nodeDesc" x="990" y="120" textAnchor="middle">
              fees redirected to treasury
            </text>
          </g>

          {/* Market */}
          <g>
            <rect
              className="nodeBox"
              x="880"
              y="200"
              width="220"
              height="80"
              rx="12"
            />
            <text className="nodeSub" x="990" y="228" textAnchor="middle">
              Market
            </text>
            <text className="nodeLabel" x="990" y="254" textAnchor="middle">
              RBT / USDm Pool
            </text>
            <text className="nodeDesc" x="990" y="270" textAnchor="middle">
              Kumbaya, MegaETH
            </text>
          </g>

          {/* === Flows === */}

          {/* User → Bond (USDm) */}
          <path
            className="flow flowAnim"
            d="M 200 220 H 235 V 90 H 270"
            markerEnd="url(#fdArrow)"
          />
          <text className="flowCaption" x="244" y="155" textAnchor="middle">
            USDm
          </text>

          {/* Bond → Treasury (USDm 90%) */}
          <path
            className="flowSignal flowAnim"
            d="M 470 90 H 540"
            markerEnd="url(#fdArrowSignal)"
          />
          <text
            className="flowCaptionSignal"
            x="505"
            y="82"
            textAnchor="middle"
          >
            USDm 90%
          </text>

          {/* Treasury → POL (seed) */}
          <path
            className="flow flowAnim"
            d="M 740 84 H 880"
            markerEnd="url(#fdArrow)"
          />
          <text className="flowCaption" x="810" y="76" textAnchor="middle">
            seed
          </text>

          {/* POL → Treasury (fees) */}
          <path
            className="flow flowAnim"
            d="M 880 110 Q 810 142 740 110"
            markerEnd="url(#fdArrow)"
          />
          <text className="flowCaption" x="810" y="144" textAnchor="middle">
            fees
          </text>

          {/* Bond → RBT (vest) */}
          <path
            className="flow flowAnim"
            d="M 370 130 V 200"
            markerEnd="url(#fdArrow)"
          />
          <text className="flowCaption" x="382" y="170">
            RBT vest
          </text>

          {/* RBT → User (claim) */}
          <path
            className="flow flowAnim"
            d="M 270 240 H 200"
            markerEnd="url(#fdArrow)"
          />
          <text className="flowCaption" x="235" y="232" textAnchor="middle">
            claim
          </text>

          {/* RBT → Lock (stake / lock) */}
          <path
            className="flow flowAnim"
            d="M 370 280 V 350"
            markerEnd="url(#fdArrow)"
          />
          <text className="flowCaption" x="382" y="320">
            stake / lock
          </text>

          {/* Lock → User (extra RBT, orthogonal under User) */}
          <path
            className="flow flowAnim"
            d="M 270 390 H 110 V 280"
            markerEnd="url(#fdArrow)"
          />
          <text className="flowCaption" x="190" y="382" textAnchor="middle">
            extra RBT
          </text>

          {/* Treasury → BAM (BAM funds) */}
          <path
            className="flowSignal"
            d="M 640 130 V 200"
            markerEnd="url(#fdArrowSignal)"
          />
          <text className="flowCaptionSignal" x="652" y="170">
            BAM funds
          </text>

          {/* BAM → Market (sell &gt; NAV) */}
          <path
            className="flowSignal flowAnim"
            d="M 740 230 H 880"
            markerEnd="url(#fdArrowSignal)"
          />
          <text
            className="flowCaptionSignal"
            x="810"
            y="222"
            textAnchor="middle"
          >
            sell &gt; NAV
          </text>

          {/* Market → BAM (buy &lt; NAV → burn) */}
          <path
            className="flowSignal flowAnim"
            d="M 880 260 H 740"
            markerEnd="url(#fdArrowSignal)"
          />
          <text
            className="flowCaptionSignal"
            x="810"
            y="276"
            textAnchor="middle"
          >
            buy &lt; NAV, burn
          </text>
        </svg>

        <div className="mt-8 grid md:grid-cols-3 gap-3 text-[12px] text-ink-300">
          <div className="card-2 p-4">
            <span className="eyebrow">{t("about.flow.usdmIn.eyebrow")}</span>
            <p className="mt-1.5 text-ink-200 leading-relaxed">
              {t("about.flow.usdmIn.body")}
            </p>
          </div>
          <div className="card-2 p-4">
            <span className="eyebrow">{t("about.flow.rbtDist.eyebrow")}</span>
            <p className="mt-1.5 text-ink-200 leading-relaxed">
              {t("about.flow.rbtDist.body")}
            </p>
          </div>
          <div className="card-2 p-4">
            <span className="eyebrow text-signal">
              {t("about.flow.bam.eyebrow")}
            </span>
            <p className="mt-1.5 text-ink-200 leading-relaxed">
              {t("about.flow.bam.body")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
