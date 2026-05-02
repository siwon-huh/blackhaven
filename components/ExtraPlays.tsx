import type { Play } from "@/lib/scenarios";

const EFFORT_TONE: Record<Play["effort"], string> = {
  쉬움: "var(--signal)",
  보통: "var(--warn)",
  어려움: "var(--critical)",
};

export default function ExtraPlays({ plays }: { plays: Play[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {plays.map((p) => (
        <article key={p.title} className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col items-start gap-1.5 min-w-0">
              <span className="chip text-[10.5px]">{p.badge}</span>
              <h4 className="text-[15px] font-medium text-ink-50 leading-tight">
                {p.title}
              </h4>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[18px] font-medium text-ink-50 mono-num">
                {p.apr}
              </div>
              <div
                className="text-[10.5px] font-mono"
                style={{ color: EFFORT_TONE[p.effort] }}
              >
                {p.effort}
              </div>
            </div>
          </div>

          <p className="mt-3 text-[12.5px] text-ink-300 leading-relaxed">{p.why}</p>

          <details className="mt-3 group">
            <summary className="cursor-pointer text-[11px] text-ink-400 font-mono select-none hover:text-ink-50">
              실행 절차 펼치기
            </summary>
            <ol className="mt-3 space-y-1.5 pl-1">
              {p.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] text-ink-200">
                  <span className="font-mono text-ink-500 shrink-0">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
              <div className="rounded-md border border-signal/20 bg-signal/5 p-2.5">
                <span className="text-signal font-mono mr-1">Up</span>
                <span className="text-ink-200">{p.reward.replace(/\*\*/g, "")}</span>
              </div>
              <div className="rounded-md border border-warn/20 bg-warn/5 p-2.5">
                <span className="text-warn font-mono mr-1">Down</span>
                <span className="text-ink-200">{p.loss}</span>
              </div>
            </div>
          </details>
        </article>
      ))}
    </div>
  );
}
