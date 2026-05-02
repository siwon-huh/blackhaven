import type { ScenarioDefinition } from "@/lib/scenarios";
import HeroPlay from "@/components/HeroPlay";
import ExtraPlays from "@/components/ExtraPlays";
import AllocBar from "@/components/AllocBar";
import WeekPlan from "@/components/WeekPlan";
import StopSignals from "@/components/StopSignals";

export default function ScenarioBoard({ scenario: s }: { scenario: ScenarioDefinition }) {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-12">
      <div className="mb-5">
        <div className="text-[11px] uppercase tracking-wider text-mist-400 font-mono">
          Step 2, {s.code}, {s.korean}
        </div>
        <h2 className="mt-1 text-2xl font-semibold">{s.korean}의 알파</h2>
        <p className="mt-2 text-[13.5px] text-mist-300 leading-relaxed max-w-3xl">
          {s.state}
        </p>
      </div>

      <div className="space-y-3">
        <HeroPlay play={s.hero} />

        <div>
          <div className="mt-2 mb-3 text-[11px] uppercase tracking-wider text-mist-400 font-mono">
            보조 플레이
          </div>
          <ExtraPlays plays={s.extras} />
        </div>

        <div className="grid lg:grid-cols-2 gap-3 mt-2">
          <AllocBar allocation={s.allocation} />
          <WeekPlan weekly={s.weekly} />
        </div>

        <StopSignals stop={s.stop} />
      </div>
    </section>
  );
}
