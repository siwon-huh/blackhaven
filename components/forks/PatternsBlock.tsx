import { COMMON_PATTERNS } from "@/lib/forks";

export default function PatternsBlock() {
  return (
    <section id="patterns" className="max-w-6xl mx-auto px-6 pb-12">
      <div className="mb-5">
        <div className="text-[11px] uppercase tracking-wider text-mist-400 font-mono">
          Common failure modes
        </div>
        <h2 className="mt-1 text-2xl font-semibold">공통 실패 패턴 7개</h2>
        <p className="mt-1 text-[13px] text-mist-400">
          개별 포크가 깨진 이유는 다르지만, 거의 모든 포크가 이 7개 중 2~3개에 동시에 걸렸습니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {COMMON_PATTERNS.map((p) => (
          <div key={p.code} className="card p-5">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center h-8 w-8 rounded-md bg-ember-500/10 border border-ember-500/30 shrink-0">
                <span className="font-mono text-[11px] text-ember-400">{p.code}</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-white tracking-tight">
                  {p.title}
                </h3>
              </div>
            </div>
            <p className="mt-3 text-[13px] text-mist-200 leading-relaxed">{p.detail}</p>
            <div className="mt-4 pt-3 border-t hairline">
              <div className="text-[10.5px] uppercase tracking-wider font-mono text-mist-400 mb-1.5">
                실제 사례
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.examples.map((e) => (
                  <span
                    key={e}
                    className="text-[11px] font-mono text-mist-200 px-2 py-0.5 rounded bg-ink-700/60"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
