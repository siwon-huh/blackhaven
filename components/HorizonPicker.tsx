"use client";

import { Horizon, SCENARIOS } from "@/lib/scenarios";

type Props = { active: Horizon; onSelect: (id: Horizon) => void };

export default function HorizonPicker({ active, onSelect }: Props) {
  return (
    <section id="pick" className="max-w-6xl mx-auto px-6 pb-6">
      <div className="mb-5">
        <div className="text-[11px] uppercase tracking-wider text-mist-400 font-mono">
          Step 1, Horizon
        </div>
        <h2 className="mt-1 text-2xl font-semibold">언제 들어갈까요</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {SCENARIOS.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={[
                "text-left rounded-2xl p-6 transition-all border",
                isActive
                  ? "bg-gradient-to-br from-violet-500/10 to-ember-500/10 border-violet-400/40 shadow-glow"
                  : "card hover:border-white/15",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <div className="font-mono text-[11px] text-mist-400">{s.code}</div>
                <div className="text-[11px] text-mist-400 font-mono">{s.windowKR}</div>
              </div>
              <div className="mt-5">
                <div className="text-[20px] font-semibold tracking-tight text-white">
                  {s.korean}
                </div>
                <div className="text-[12px] text-mist-400 mt-0.5">{s.english}</div>
              </div>
              <p className="mt-4 text-[13px] text-mist-200 leading-relaxed">
                {s.ifPickThis}
              </p>
              {isActive && (
                <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-violet-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  selected
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
