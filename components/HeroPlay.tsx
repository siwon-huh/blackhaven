import type { Play } from "@/lib/scenarios";

const EFFORT_TONE: Record<Play["effort"], string> = {
  쉬움: "var(--signal)",
  보통: "var(--warn)",
  어려움: "var(--critical)",
};

export default function HeroPlay({ play }: { play: Play }) {
  return (
    <article className="card p-6 md:p-8 relative">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip-signal">{play.badge}</span>
            <span
              className="chip"
              style={{ color: EFFORT_TONE[play.effort], borderColor: "rgba(255,255,255,0.1)" }}
            >
              난이도 {play.effort}
            </span>
          </div>
          <h3 className="mt-4 text-[26px] headline text-ink-50">{play.title}</h3>
        </div>
        <div className="text-right">
          <div className="eyebrow">Best-case APR</div>
          <div className="mt-1 text-[34px] font-medium tracking-tightest text-ink-50 mono-num">
            {play.apr}
          </div>
          <div className="text-[11px] text-ink-400">연환산, 베스트케이스</div>
        </div>
      </div>

      <p className="mt-6 text-[14px] text-ink-200 leading-relaxed max-w-3xl">
        <span className="text-ink-400">왜 지금 이 플레이가 우세한가. </span>
        {play.why}
      </p>

      <div className="mt-7 grid md:grid-cols-[1.4fr_1fr] gap-5">
        <div>
          <div className="eyebrow mb-3">실행 절차</div>
          <ol className="space-y-2.5">
            {play.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid place-items-center h-6 w-6 rounded-full bg-ink-700 shrink-0 font-mono text-[11px] text-ink-200">
                  {i + 1}
                </span>
                <span className="text-[13.5px] text-ink-100 leading-relaxed pt-0.5">
                  {s}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-signal/30 bg-signal/5 p-4">
            <div className="eyebrow text-signal mb-1.5">Upside</div>
            <div
              className="text-[13px] text-ink-100 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: play.reward.replace(
                  /\*\*(.*?)\*\*/g,
                  '<span class="text-ink-50 font-semibold">$1</span>',
                ),
              }}
            />
          </div>
          <div className="rounded-xl border border-warn/30 bg-warn/5 p-4">
            <div className="eyebrow text-warn mb-1.5">Downside</div>
            <div className="text-[13px] text-ink-100 leading-relaxed">{play.loss}</div>
          </div>
        </div>
      </div>
    </article>
  );
}
