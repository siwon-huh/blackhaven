import { FORKS, STATUS_TONE } from "@/lib/forks";

export default function ForkCards() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-6">
        <div className="eyebrow">Project files</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">프로젝트별 케이스</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-white/5 rounded-xl overflow-hidden">
        {FORKS.map((f) => {
          const tone = STATUS_TONE[f.status];
          return (
            <article key={f.id} className="bg-ink-950 p-6">
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
                <span
                  className="chip shrink-0"
                  style={{ color: tone.color, borderColor: `${tone.color}40` }}
                >
                  {tone.label}
                </span>
              </header>

              <div className="mt-5 grid grid-cols-2 gap-3 text-[11.5px]">
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
                  <div className="eyebrow">드로우다운</div>
                  <div className="mt-1 text-warn font-mono mono-num">
                    {f.drawdown}
                  </div>
                </div>
              </div>

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
