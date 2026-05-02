"use client";

import { COMMON_PATTERNS } from "@/lib/forks";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

export default function PatternsBlock() {
  const t = useT();
  const locale = useLocale();
  return (
    <section id="patterns" className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-6">
        <div className="eyebrow">{t("forks.patterns.eyebrow")}</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          {t("forks.patterns.heading")}
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          {t("forks.patterns.intro")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-white/5 rounded-xl overflow-hidden">
        {COMMON_PATTERNS.map((p) => (
          <div key={p.code} className="bg-ink-950 p-6">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center h-7 w-7 rounded-sm border border-warn/40 bg-warn/5 shrink-0">
                <span className="font-mono text-[10.5px] text-warn">
                  {p.code}
                </span>
              </div>
              <h3 className="text-[15px] font-medium text-ink-50 leading-snug pt-0.5">
                {lc(p.title, locale)}
              </h3>
            </div>
            <p className="mt-3 text-[13px] text-ink-200 leading-relaxed">
              {lc(p.detail, locale)}
            </p>
            <div className="mt-4 pt-3 border-t hairline">
              <div className="eyebrow mb-1.5">
                {t("forks.patterns.examples")}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.examples.map((e, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono text-ink-300 px-2 py-0.5 rounded bg-ink-800"
                  >
                    {lc(e, locale)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
