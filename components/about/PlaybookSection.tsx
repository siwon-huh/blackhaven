"use client";

import { useState } from "react";
import { findScenario, Horizon, SCENARIOS } from "@/lib/scenarios";
import HeroPlay from "@/components/HeroPlay";
import ExtraPlays from "@/components/ExtraPlays";
import AllocBar from "@/components/AllocBar";
import WeekPlan from "@/components/WeekPlan";
import StopSignals from "@/components/StopSignals";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

export default function PlaybookSection() {
  const t = useT();
  const locale = useLocale();
  const [active, setActive] = useState<Horizon>("short");
  const s = findScenario(active);

  return (
    <section className="max-w-6xl mx-auto px-6 pb-20" id="playbook">
      <div className="mb-6">
        <div className="eyebrow">{t("playbook.section.eyebrow")}</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          {t("playbook.section.heading")}
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          {t("playbook.section.intro")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden">
        {SCENARIOS.map((sc) => {
          const isActive = active === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setActive(sc.id)}
              aria-current={isActive ? "true" : undefined}
              className={[
                "text-left p-5 transition-colors",
                isActive ? "bg-ink-800" : "bg-ink-950 hover:bg-ink-900",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] text-ink-400">
                  {sc.code}
                </span>
                <span className="font-mono text-[10.5px] text-ink-400">
                  {lc(sc.window, locale)}
                </span>
              </div>
              <div className="mt-3 text-[16px] font-medium text-ink-50">
                {lc(sc.name, locale)}
              </div>
              <div className="text-[11.5px] text-ink-400 mt-0.5">
                {lc(sc.tagline, locale)}
              </div>
              <p className="mt-3 text-[12.5px] text-ink-300 leading-relaxed">
                {lc(sc.ifPickThis, locale)}
              </p>
              {isActive && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-[10.5px] text-signal font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  {t("playbook.scenario.selected")}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 card p-6 md:p-8 animate-revealUp">
        <div className="eyebrow">
          {s.code}, {lc(s.name, locale)}
        </div>
        <h3 className="mt-2 text-[22px] headline text-ink-50">
          {t("playbook.scenario.alpha").replace("{name}", lc(s.name, locale))}
        </h3>
        <p className="mt-3 text-[13.5px] text-ink-300 leading-relaxed max-w-3xl">
          {lc(s.state, locale)}
        </p>

        <div className="mt-6 space-y-4">
          <HeroPlay play={s.hero} />

          <div>
            <div className="eyebrow mb-3">{t("playbook.section.extras")}</div>
            <ExtraPlays plays={s.extras} />
          </div>

          <div className="grid lg:grid-cols-2 gap-3">
            <AllocBar allocation={s.allocation} />
            <WeekPlan weekly={s.weekly} />
          </div>

          <StopSignals stop={s.stop} />
        </div>
      </div>
    </section>
  );
}
