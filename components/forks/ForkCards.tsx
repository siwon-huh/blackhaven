import { FORKS, STATUS_TONE } from "@/lib/forks";

export default function ForkCards() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-12">
      <div className="mb-5">
        <div className="text-[11px] uppercase tracking-wider text-mist-400 font-mono">
          Project files
        </div>
        <h2 className="mt-1 text-2xl font-semibold">프로젝트별 케이스</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {FORKS.map((f) => {
          const tone = STATUS_TONE[f.status];
          return (
            <article key={f.id} className="card p-5">
              <header className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[20px] font-semibold text-white tracking-tight">
                      {f.ticker}
                    </span>
                    <span className="text-[14px] text-mist-200">{f.name}</span>
                  </div>
                  <div className="mt-1 text-[11.5px] text-mist-400 font-mono">
                    {f.chain} · 출시 {f.launched}
                  </div>
                </div>
                <span
                  className="chip shrink-0"
                  style={{ color: tone.color, borderColor: `${tone.color}40` }}
                >
                  {tone.label}
                </span>
              </header>

              <div className="mt-4 grid grid-cols-2 gap-3 text-[11.5px]">
                <div className="rounded-md bg-ink-700/40 p-2.5">
                  <div className="text-mist-400 font-mono text-[10px] uppercase tracking-wider">
                    정점
                  </div>
                  <div className="mt-0.5 text-white font-mono">{f.peakPrice}</div>
                  <div className="text-mist-400 font-mono text-[10px]">{f.peakDate}</div>
                </div>
                <div className="rounded-md bg-ink-700/40 p-2.5">
                  <div className="text-mist-400 font-mono text-[10px] uppercase tracking-wider">
                    드로우다운
                  </div>
                  <div className="mt-0.5 text-ember-400 font-mono">{f.drawdown}</div>
                </div>
              </div>

              <p className="mt-4 text-[13px] text-mist-100 leading-relaxed">
                <span className="text-mist-400">차별점 · </span>
                {f.hook}
              </p>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-[10.5px] uppercase tracking-wider font-mono text-jade-400 mb-1">
                    잘 됐던 이유
                  </div>
                  <div className="text-[12.5px] text-mist-200 leading-relaxed">{f.whyItGrew}</div>
                </div>
                <div>
                  <div className="text-[10.5px] uppercase tracking-wider font-mono text-ember-400 mb-1">
                    깨진 이유
                  </div>
                  <div className="text-[12.5px] text-mist-200 leading-relaxed">{f.whyItBroke}</div>
                </div>
                <div>
                  <div className="text-[10.5px] uppercase tracking-wider font-mono text-mist-400 mb-1">
                    결말
                  </div>
                  <div className="text-[12.5px] text-mist-100 leading-relaxed">{f.ending}</div>
                </div>
                {f.signature && (
                  <div className="mt-3 pt-3 border-t hairline">
                    <p className="text-[12px] text-mist-300 italic leading-relaxed">
                      “ {f.signature} ”
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
