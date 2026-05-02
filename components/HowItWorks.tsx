import { MECHANICS, OHM_TLDR } from "@/lib/scenarios";

export default function HowItWorks() {
  return (
    <section id="how" className="max-w-6xl mx-auto px-6 pb-12">
      <div className="mb-5">
        <div className="text-[11px] uppercase tracking-wider text-mist-400 font-mono">
          Mechanics
        </div>
        <h2 className="mt-1 text-2xl font-semibold">네 개의 레버</h2>
        <p className="mt-1 text-[13px] text-mist-400">
          본드, 락업, BAM, POL입니다. 시간축마다 어떤 조합이 우세한지가 플레이의 차이를 만듭니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {MECHANICS.map((m) => (
          <div
            key={m.code}
            className="card p-5 relative overflow-hidden"
            style={{
              background: `linear-gradient(180deg, ${m.color}10, transparent 60%)`,
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: m.color }}
            />
            <div
              className="font-mono text-[11px] tracking-wider"
              style={{ color: m.color }}
            >
              {m.code}
            </div>
            <div className="mt-1.5 text-[16px] font-semibold text-white">{m.title}</div>
            <p className="mt-3 text-[13px] text-mist-200 leading-relaxed">{m.oneLine}</p>
            <div className="mt-4 pt-3 border-t hairline">
              <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono mb-1">
                vs OHM
              </div>
              <p className="text-[12.5px] text-mist-300 leading-relaxed italic">
                {m.analogy}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 card p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] uppercase tracking-wider text-mist-400 font-mono">
            OlympusDAO와의 차이 한눈에 보기
          </span>
        </div>
        <ul className="space-y-2">
          {OHM_TLDR.map((line, i) => (
            <li key={i} className="flex items-start gap-3 text-[13px] text-mist-200">
              <span className="font-mono text-mist-500 shrink-0 w-5">{i + 1}.</span>
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
