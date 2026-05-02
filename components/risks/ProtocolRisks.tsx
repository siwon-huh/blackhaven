"use client";

import { PROTOCOL_RISKS } from "@/lib/risks";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

export default function ProtocolRisks() {
  const locale = useLocale();
  const t = useT();
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-6">
        <div className="eyebrow">{t("risks.protocol.eyebrow")}</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          {t("risks.protocol.heading")}
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          {t("risks.protocol.intro")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-white/5 rounded-xl overflow-hidden">
        {PROTOCOL_RISKS.map((r) => (
          <div key={lc(r.title, locale)} className="bg-ink-950 p-6">
            <h3 className="text-[16px] font-medium text-ink-50">
              {lc(r.title, locale)}
            </h3>
            <p className="mt-2 text-[12.5px] text-ink-200 leading-relaxed">
              {lc(r.detail, locale)}
            </p>
            <div className="mt-4">
              <div className="eyebrow text-signal mb-2">
                {t("risks.protocol.mitigations")}
              </div>
              <ul className="space-y-1.5">
                {r.mitigations.map((m, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[12px] text-ink-200 leading-relaxed"
                  >
                    <span className="mt-1.5 h-1 w-1.5 rounded-sm bg-signal shrink-0" />
                    <span>{lc(m, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
