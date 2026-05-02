import type { Play } from "@/lib/scenarios";

const EFFORT_TONE: Record<Play["effort"], string> = {
  쉬움: "#3DDC97",
  보통: "#F4C756",
  어려움: "#FF6A1F",
};

export default function ExtraPlays({ plays }: { plays: Play[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {plays.map((p) => (
        <article key={p.title} className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col items-start gap-1.5 min-w-0">
              <span className="chip text-[10.5px]" style={{ color: "#9AA4B5" }}>
                {p.badge}
              </span>
              <h4 className="text-[15px] font-semibold text-white leading-tight">
                {p.title}
              </h4>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[18px] font-semibold text-white tracking-tight">{p.apr}</div>
              <div
                className="text-[10.5px] font-mono"
                style={{ color: EFFORT_TONE[p.effort] }}
              >
                {p.effort}
              </div>
            </div>
          </div>

          <p className="mt-3 text-[12.5px] text-mist-300 leading-relaxed">{p.why}</p>

          <details className="mt-3 group">
            <summary className="cursor-pointer text-[11.5px] text-mist-400 font-mono select-none hover:text-white">
              실행 절차 ↓
            </summary>
            <ol className="mt-3 space-y-1.5 pl-1">
              {p.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] text-mist-200">
                  <span className="font-mono text-mist-500 shrink-0">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
              <div className="rounded-md bg-jade-500/8 border border-jade-500/15 p-2.5">
                <span className="text-jade-400">✓ </span>
                <span className="text-mist-200">{p.reward.replace(/\*\*/g, "")}</span>
              </div>
              <div className="rounded-md bg-ember-500/8 border border-ember-500/15 p-2.5">
                <span className="text-ember-400">✗ </span>
                <span className="text-mist-200">{p.loss}</span>
              </div>
            </div>
          </details>
        </article>
      ))}
    </div>
  );
}
