"use client";

// 자금 흐름 SVG. 사용자 USDm 이 본드를 거쳐 트레저리/POL 로 가고,
// 트레저리에서 BAM 매수 burn, RBT 분배가 다시 사용자에게 흐른다.
// dasharray 애니메이션으로 흐름을 시각화.

export default function FlowDiagram() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="mb-6">
        <div className="eyebrow">Flow</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">자금이 어떻게 흐르는가</h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          본드, 락업, BAM, POL 이 트레저리 안에서 어떻게 맞물리는지 정리한 다이어그램입니다. 화살표는 USDm 이나 RBT 의 이동 방향을 나타냅니다.
        </p>
      </div>

      <div className="card p-6 md:p-10">
        <svg
          viewBox="0 0 1100 460"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 Z" fill="#9AA0AB" />
            </marker>
            <marker
              id="arrow-signal"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 Z" fill="#3DDC97" />
            </marker>
          </defs>

          <style>{`
            .nodeLabel { fill: #F4F5F7; font-family: Inter, sans-serif; font-size: 14px; font-weight: 500; }
            .nodeSub { fill: #9AA0AB; font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; }
            .nodeBox { fill: #15171C; stroke: rgba(255,255,255,0.1); stroke-width: 1; }
            .nodeAccent { fill: #15171C; stroke: rgba(61,220,151,0.4); stroke-width: 1; }
            .flow { stroke: #4D525B; stroke-width: 1.5; fill: none; }
            .flow-signal { stroke: #3DDC97; stroke-width: 1.5; fill: none; }
            .flow-anim { stroke-dasharray: 4 4; animation: dashFlow 2s linear infinite; }
            @keyframes dashFlow { to { stroke-dashoffset: -16; } }
            .flowCaption { fill: #6E7480; font-family: ui-monospace, monospace; font-size: 10px; }
          `}</style>

          {/* User */}
          <g>
            <rect className="nodeBox" x="40" y="180" width="170" height="80" rx="10" />
            <text className="nodeSub" x="125" y="208" textAnchor="middle">User</text>
            <text className="nodeLabel" x="125" y="234" textAnchor="middle">USDm Holder</text>
          </g>

          {/* Bond */}
          <g>
            <rect className="nodeBox" x="290" y="60" width="180" height="80" rx="10" />
            <text className="nodeSub" x="380" y="88" textAnchor="middle">Bond</text>
            <text className="nodeLabel" x="380" y="114" textAnchor="middle">7d / 14d / 30d</text>
            <text className="flowCaption" x="380" y="130" textAnchor="middle">linear vest, discount</text>
          </g>

          {/* Treasury */}
          <g>
            <rect className="nodeAccent" x="560" y="60" width="180" height="80" rx="10" />
            <text className="nodeSub" x="650" y="88" textAnchor="middle" style={{ fill: "#3DDC97" }}>Treasury</text>
            <text className="nodeLabel" x="650" y="114" textAnchor="middle">USDm Reserves</text>
            <text className="flowCaption" x="650" y="130" textAnchor="middle">90% of bond</text>
          </g>

          {/* POL */}
          <g>
            <rect className="nodeBox" x="830" y="60" width="220" height="80" rx="10" />
            <text className="nodeSub" x="940" y="88" textAnchor="middle">POL</text>
            <text className="nodeLabel" x="940" y="114" textAnchor="middle">Liquidity Manager (V3)</text>
            <text className="flowCaption" x="940" y="130" textAnchor="middle">fees redirected to treasury</text>
          </g>

          {/* BAM */}
          <g>
            <rect className="nodeAccent" x="560" y="200" width="180" height="80" rx="10" />
            <text className="nodeSub" x="650" y="228" textAnchor="middle" style={{ fill: "#3DDC97" }}>BAM</text>
            <text className="nodeLabel" x="650" y="254" textAnchor="middle">Auto two-way arb</text>
            <text className="flowCaption" x="650" y="270" textAnchor="middle">above NAV: sell, below: burn</text>
          </g>

          {/* RBT */}
          <g>
            <rect className="nodeBox" x="290" y="200" width="180" height="80" rx="10" />
            <text className="nodeSub" x="380" y="228" textAnchor="middle">RBT</text>
            <text className="nodeLabel" x="380" y="254" textAnchor="middle">Reserve-Backed Token</text>
            <text className="flowCaption" x="380" y="270" textAnchor="middle">backing = reserves / supply</text>
          </g>

          {/* Lock */}
          <g>
            <rect className="nodeBox" x="290" y="340" width="180" height="80" rx="10" />
            <text className="nodeSub" x="380" y="368" textAnchor="middle">Lock</text>
            <text className="nodeLabel" x="380" y="394" textAnchor="middle">Time-locked NFT</text>
            <text className="flowCaption" x="380" y="410" textAnchor="middle">extra RBT distribution</text>
          </g>

          {/* Market (DEX) */}
          <g>
            <rect className="nodeBox" x="830" y="200" width="220" height="80" rx="10" />
            <text className="nodeSub" x="940" y="228" textAnchor="middle">Market</text>
            <text className="nodeLabel" x="940" y="254" textAnchor="middle">RBT/USDm Pool</text>
            <text className="flowCaption" x="940" y="270" textAnchor="middle">Kumbaya, MegaETH</text>
          </g>

          {/* Flows */}
          {/* User -> Bond (USDm) */}
          <path className="flow flow-anim" d="M210 200 C 240 200 250 100 290 100" markerEnd="url(#arrow)" />
          <text className="flowCaption" x="240" y="155">USDm</text>

          {/* Bond -> Treasury */}
          <path className="flow-signal flow-anim" d="M470 100 L 560 100" markerEnd="url(#arrow-signal)" />
          <text className="flowCaption" x="495" y="92" style={{ fill: "#3DDC97" }}>USDm 90%</text>

          {/* Treasury -> POL (seed) */}
          <path className="flow flow-anim" d="M740 100 L 830 100" markerEnd="url(#arrow)" />
          <text className="flowCaption" x="760" y="92">seed</text>

          {/* POL -> Treasury (fees) */}
          <path className="flow flow-anim" d="M830 120 C 800 150 770 150 740 120" markerEnd="url(#arrow)" />
          <text className="flowCaption" x="775" y="155">fees</text>

          {/* Bond -> RBT (vest) */}
          <path className="flow flow-anim" d="M380 140 L 380 200" markerEnd="url(#arrow)" />
          <text className="flowCaption" x="390" y="172">RBT vest</text>

          {/* RBT -> User (claim) */}
          <path className="flow flow-anim" d="M290 240 L 210 240" markerEnd="url(#arrow)" />
          <text className="flowCaption" x="225" y="232">claim</text>

          {/* RBT -> Lock */}
          <path className="flow flow-anim" d="M380 280 L 380 340" markerEnd="url(#arrow)" />
          <text className="flowCaption" x="390" y="312">stake / lock</text>

          {/* Lock -> User (extra RBT) */}
          <path className="flow flow-anim" d="M290 380 C 200 380 100 320 125 260" markerEnd="url(#arrow)" />
          <text className="flowCaption" x="155" y="345">extra RBT</text>

          {/* Treasury -> BAM */}
          <path className="flow-signal" d="M650 140 L 650 200" markerEnd="url(#arrow-signal)" />
          <text className="flowCaption" x="660" y="172" style={{ fill: "#3DDC97" }}>BAM funds</text>

          {/* BAM -> Market (sell above NAV) */}
          <path className="flow-signal flow-anim" d="M740 230 L 830 230" markerEnd="url(#arrow-signal)" />
          <text className="flowCaption" x="755" y="222" style={{ fill: "#3DDC97" }}>sell &gt; NAV</text>

          {/* Market -> BAM (buy below NAV) */}
          <path className="flow-signal flow-anim" d="M830 250 L 740 250" markerEnd="url(#arrow-signal)" />
          <text className="flowCaption" x="755" y="265" style={{ fill: "#3DDC97" }}>buy &lt; NAV burn</text>
        </svg>

        <div className="mt-6 grid md:grid-cols-3 gap-3 text-[12px] text-ink-300">
          <div className="card-2 p-3">
            <span className="eyebrow">USDm 인입</span>
            <p className="mt-1.5 text-ink-200 leading-relaxed">
              사용자의 USDm 이 본드를 거쳐 트레저리와 POL 에 영구 적재됩니다. 90퍼센트는 트레저리, 10퍼센트는 운영비입니다.
            </p>
          </div>
          <div className="card-2 p-3">
            <span className="eyebrow">RBT 분배</span>
            <p className="mt-1.5 text-ink-200 leading-relaxed">
              본드는 만기까지 RBT 를 선형으로 분배합니다. 락업한 RBT 는 만기에 추가 RBT 분배를 받습니다.
            </p>
          </div>
          <div className="card-2 p-3">
            <span className="eyebrow text-signal">BAM 가격 보정</span>
            <p className="mt-1.5 text-ink-200 leading-relaxed">
              시장가가 NAV 위면 트레저리가 RBT 를 매도해 USDm 을 회수하고, 아래면 USDm 으로 RBT 를 사서 소각합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
