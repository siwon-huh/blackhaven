"use client";

import type { ScenarioDefinition, WeekTag } from "@/lib/scenarios";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

const TAG_DOT: Record<WeekTag, string> = {
  bond: "#FFFFFF",
  commit: "#3DDC97",
  trade: "#C9CDD4",
  claim: "#F4C756",
  watch: "#6E7480",
};

const TAG_KEY: Record<WeekTag, string> = {
  bond: "tag.bond",
  commit: "tag.commit",
  trade: "tag.trade",
  claim: "tag.claim",
  watch: "tag.watch",
};

export default function WeekPlan({
  weekly,
}: {
  weekly: ScenarioDefinition["weekly"];
}) {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="card p-5">
      <div className="eyebrow">{t("week.eyebrow")}</div>
      <div className="text-[14px] font-medium mt-1 mb-4 text-ink-50">
        {t("week.title")}
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
                  {t(TAG_KEY[w.tag])}
                </span>
                <span className="text-[12.5px] text-ink-100 leading-relaxed">
                  {lc(w.action, locale)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
