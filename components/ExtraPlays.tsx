"use client";

import type { Play, Effort } from "@/lib/scenarios";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

const EFFORT_TONE: Record<Effort, string> = {
  easy: "var(--signal)",
  moderate: "var(--warn)",
  hard: "var(--critical)",
};

const EFFORT_KEY: Record<Effort, string> = {
  easy: "effort.easy",
  moderate: "effort.moderate",
  hard: "effort.hard",
};

export default function ExtraPlays({ plays }: { plays: Play[] }) {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {plays.map((p) => (
        <article key={lc(p.title, locale)} className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col items-start gap-1.5 min-w-0">
              <span className="chip text-[10.5px]">{lc(p.badge, locale)}</span>
              <h4 className="text-[15px] font-medium text-ink-50 leading-tight">
                {lc(p.title, locale)}
              </h4>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[18px] font-medium text-ink-50 mono-num">
                {lc(p.apr, locale)}
              </div>
              <div
                className="text-[10.5px] font-mono"
                style={{ color: EFFORT_TONE[p.effort] }}
              >
                {t(EFFORT_KEY[p.effort])}
              </div>
            </div>
          </div>

          <p className="mt-3 text-[12.5px] text-ink-300 leading-relaxed">
            {lc(p.why, locale)}
          </p>

          <details className="mt-3 group">
            <summary className="cursor-pointer text-[11px] text-ink-400 font-mono select-none hover:text-ink-50">
              {t("extras.expandSteps")}
            </summary>
            <ol className="mt-3 space-y-1.5 pl-1">
              {p.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] text-ink-200">
                  <span className="font-mono text-ink-500 shrink-0">
                    {i + 1}.
                  </span>
                  <span>{lc(s, locale)}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
              <div className="rounded-md border border-signal/20 bg-signal/5 p-2.5">
                <span className="text-signal font-mono mr-1">
                  {t("extras.up")}
                </span>
                <span className="text-ink-200">
                  {lc(p.reward, locale).replace(/\*\*/g, "")}
                </span>
              </div>
              <div className="rounded-md border border-warn/20 bg-warn/5 p-2.5">
                <span className="text-warn font-mono mr-1">
                  {t("extras.down")}
                </span>
                <span className="text-ink-200">{lc(p.loss, locale)}</span>
              </div>
            </div>
          </details>
        </article>
      ))}
    </div>
  );
}
