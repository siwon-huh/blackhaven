"use client";

import type { Allocation } from "@/lib/scenarios";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

const palette = ["#3DDC97", "#C9CDD4", "#6E7480", "#363A42"];

export default function AllocBar({ allocation }: { allocation: Allocation[] }) {
  const t = useT();
  const locale = useLocale();
  const sorted = [...allocation].sort((a, b) => b.share - a.share);
  const colorMap = new Map(
    sorted.map((a, i) => [
      lc(a.label, locale),
      palette[Math.min(i, palette.length - 1)],
    ]),
  );
  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="eyebrow">{t("alloc.eyebrow")}</div>
          <div className="text-[14px] font-medium mt-1 text-ink-50">
            {t("alloc.title")}
          </div>
        </div>
        <div className="text-[11px] text-ink-400">{t("alloc.total")}</div>
      </div>

      <div className="flex h-2.5 rounded-full overflow-hidden">
        {allocation.map((a) => {
          const label = lc(a.label, locale);
          return (
            <div
              key={label}
              style={{ width: `${a.share}%`, background: colorMap.get(label) }}
              className="first:rounded-l-full last:rounded-r-full"
              title={`${label} ${a.share}%`}
            />
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        {allocation.map((a) => {
          const label = lc(a.label, locale);
          return (
            <div key={label} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-sm shrink-0"
                style={{ background: colorMap.get(label) }}
              />
              <div className="flex-1 flex items-baseline justify-between gap-3">
                <span className="text-[12.5px] text-ink-200">{label}</span>
                <span className="font-mono text-[12.5px] text-ink-50 mono-num">
                  {a.share}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t hairline text-[11px] text-ink-400 leading-relaxed">
        {t("alloc.disclaimer")}
      </div>
    </div>
  );
}
