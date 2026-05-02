import type { Play } from "@/lib/scenarios";

const EFFORT_TONE: Record<Play["effort"], string> = {
  쉬움: "#3DDC97",
  보통: "#F4C756",
  어려움: "#FF6A1F",
};

export default function HeroPlay({ play }: { play: Play }) {
  return (
    <article className="card p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-ember-500 to-violet-500" />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip" style={{ color: "#7C6BFF", borderColor: "#7C6BFF40" }}>
              {play.badge}
            </span>
            <span
              className="chip"
              style={{ color: EFFORT_TONE[play.effort], borderColor: `${EFFORT_TONE[play.effort]}40` }}
            >
              난이도 {play.effort}
            </span>
          </div>
          <h3 className="mt-4 text-[28px] font-semibold tracking-tight text-white">
            {play.title}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono">
            Best-case APR
          </div>
          <div className="mt-1 text-[36px] font-semibold text-white tracking-tight">
            {play.apr}
          </div>
          <div className="text-[11px] text-mist-400">연환산, 베스트케이스 가정입니다</div>
        </div>
      </div>

      <p className="mt-5 text-[14.5px] text-mist-200 leading-relaxed max-w-3xl">
        <span className="text-mist-400">왜 지금 이 플레이가 우세한가. </span>
        {play.why}
      </p>

      <div className="mt-6 grid md:grid-cols-[1.4fr_1fr] gap-5">
        <div>
          <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono mb-3">
            실행 절차
          </div>
          <ol className="space-y-2.5">
            {play.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid place-items-center h-6 w-6 rounded-full bg-ink-700/70 shadow-ring shrink-0 font-mono text-[11px] text-mist-200">
                  {i + 1}
                </span>
                <span className="text-[13.5px] text-mist-100 leading-relaxed pt-0.5">
                  {s}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-jade-500/20 bg-jade-500/5 p-4">
            <div className="text-[10.5px] uppercase tracking-wider font-mono text-jade-400 mb-1.5">
              Upside
            </div>
            <div
              className="text-[13px] text-mist-100 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: play.reward.replace(
                  /\*\*(.*?)\*\*/g,
                  '<span class="text-white font-semibold">$1</span>',
                ),
              }}
            />
          </div>
          <div className="rounded-xl border border-ember-500/20 bg-ember-500/5 p-4">
            <div className="text-[10.5px] uppercase tracking-wider font-mono text-ember-400 mb-1.5">
              Downside
            </div>
            <div className="text-[13px] text-mist-100 leading-relaxed">{play.loss}</div>
          </div>
        </div>
      </div>
    </article>
  );
}
