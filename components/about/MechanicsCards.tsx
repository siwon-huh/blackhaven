"use client";

import { MECHANICS, OHM_TLDR } from "@/lib/scenarios";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

export default function MechanicsCards() {
  const t = useT();
  const locale = useLocale();
  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="mb-6">
        <div className="eyebrow">{t("about.mech.eyebrow")}</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          {t("about.mech.heading")}
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          {t("about.mech.intro")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-white/5 rounded-xl overflow-hidden">
        {MECHANICS.map((m) => (
          <div key={m.code} className="bg-ink-950 p-6">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[11px] tracking-wider text-ink-400">
                {m.code}
              </span>
              <span className="font-mono text-[10px] text-ink-500">
                {t("about.mech.vsOhm")}
              </span>
            </div>
            <h3 className="mt-2 text-[18px] font-medium text-ink-50">
              {lc(m.title, locale)}
            </h3>
            <p className="mt-3 text-[13.5px] text-ink-200 leading-relaxed">
              {lc(m.oneLine, locale)}
            </p>
            <p className="mt-3 text-[12.5px] text-ink-400 leading-relaxed italic">
              {lc(m.analogy, locale)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <div className="eyebrow">{t("about.mech.diff")}</div>
        <ul className="mt-4 space-y-2.5">
          {OHM_TLDR.map((line, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="font-mono text-[11px] text-ink-500 shrink-0 w-5 pt-0.5">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="text-[13px] text-ink-200 leading-relaxed">
                {lc(line, locale)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
