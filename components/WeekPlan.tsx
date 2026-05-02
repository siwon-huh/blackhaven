import type { ScenarioDefinition } from "@/lib/scenarios";

const TAG_DOT: Record<ScenarioDefinition["weekly"][number]["tag"], string> = {
  본드: "#FFFFFF",
  Commit: "#3DDC97",
  트레이드: "#C9CDD4",
  클레임: "#F4C756",
  지켜보기: "#6E7480",
};

export default function WeekPlan({
  weekly,
}: {
  weekly: ScenarioDefinition["weekly"];
}) {
  return (
    <div className="card p-5">
      <div className="eyebrow">Action sequence</div>
      <div className="text-[14px] font-medium mt-1 mb-4 text-ink-50">
        주차별 실행 순서
      </div>

      <ol className="relative pl-6 space-y-3">
        <span className="absolute left-2 top-1 bottom-1 w-px bg-white/10" />
        {weekly.map((w, i) => {
          const dot = TAG_DOT[w.tag];
          return (
            <li key={i} className="relative">
              <span
                className="absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-ink-950"
                style={{ background: dot }}
              />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] text-ink-400 shrink-0 w-16">
                  {w.week}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 border border-white/10 text-ink-300">
                  {w.tag}
                </span>
                <span className="text-[12.5px] text-ink-100 leading-relaxed">
                  {w.action}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
