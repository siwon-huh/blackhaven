"use client";

import type { LocaleString } from "@/lib/i18n";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

export default function StopSignals({ stop }: { stop: LocaleString[] }) {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="card p-5 border-warn/20">
      <div className="flex items-center gap-2 mb-3">
        <div>
          <div className="eyebrow text-warn">{t("stop.eyebrow")}</div>
          <div className="text-[14px] font-medium mt-0.5 text-ink-50">
            {t("stop.title")}
          </div>
        </div>
      </div>
      <ul className="space-y-2.5">
        {stop.map((s, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-[13px] text-ink-200 leading-relaxed"
          >
            <span className="mt-1.5 h-1 w-3 rounded-sm bg-warn shrink-0" />
            <span>{lc(s, locale)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
