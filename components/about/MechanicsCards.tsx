import { MECHANICS, OHM_TLDR } from "@/lib/scenarios";

export default function MechanicsCards() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="mb-6">
        <div className="eyebrow">Mechanics</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">네 개의 레버</h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          본드, 락업, BAM, POL 의 네 가지가 Blackhaven 의 동작을 만듭니다. 시간축마다 어떤 조합이 우세한지가 사용자 플레이의 차이를 만듭니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-white/5 rounded-xl overflow-hidden">
        {MECHANICS.map((m) => (
          <div key={m.code} className="bg-ink-950 p-6">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[11px] tracking-wider text-ink-400">
                {m.code}
              </span>
              <span className="font-mono text-[10px] text-ink-500">vs OHM</span>
            </div>
            <h3 className="mt-2 text-[18px] font-medium text-ink-50">
              {m.title}
            </h3>
            <p className="mt-3 text-[13.5px] text-ink-200 leading-relaxed">
              {m.oneLine}
            </p>
            <p className="mt-3 text-[12.5px] text-ink-400 leading-relaxed italic">
              {m.analogy}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <div className="eyebrow">OlympusDAO 와의 차이</div>
        <ul className="mt-4 space-y-2.5">
          {OHM_TLDR.map((line, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="font-mono text-[11px] text-ink-500 shrink-0 w-5 pt-0.5">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="text-[13px] text-ink-200 leading-relaxed">
                {line}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
