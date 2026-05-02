import type { ScenarioDefinition } from "@/lib/scenarios";

const TAG_COLOR: Record<
  ScenarioDefinition["weekly"][number]["tag"],
  string
> = {
  본드: "#7C6BFF",
  락업: "#3DDC97",
  트레이드: "#FF6A1F",
  클레임: "#F4C756",
  지켜보기: "#9C8CFF",
};

export default function WeekPlan({
  weekly,
}: {
  weekly: ScenarioDefinition["weekly"];
}) {
  return (
    <div className="card p-5">
      <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono">
        Action sequence
      </div>
      <div className="text-[14px] font-semibold mt-1 mb-4">주차별 실행 순서</div>

      <ol className="relative pl-6 space-y-3">
        <span className="absolute left-2 top-1 bottom-1 w-px bg-white/10" />
        {weekly.map((w, i) => {
          const color = TAG_COLOR[w.tag];
          return (
            <li key={i} className="relative">
              <span
                className="absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-ink-900"
                style={{ background: color }}
              />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] text-mist-400 shrink-0 w-16">
                  {w.week}
                </span>
                <span
                  className="text-[10.5px] font-mono px-1.5 py-0.5 rounded shrink-0"
                  style={{ color, background: `${color}15` }}
                >
                  {w.tag}
                </span>
                <span className="text-[12.5px] text-mist-100 leading-relaxed">
                  {w.action}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 pt-3 border-t hairline flex flex-wrap gap-2 text-[11px]">
        {Object.entries(TAG_COLOR).map(([k, c]) => (
          <span key={k} className="inline-flex items-center gap-1 text-mist-300">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
