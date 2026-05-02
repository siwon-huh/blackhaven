"use client";

import { USER_RISKS } from "@/lib/risks";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

export default function UserRisks() {
  const locale = useLocale();
  const t = useT();
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-6">
        <div className="eyebrow">{t("risks.user.eyebrow")}</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          {t("risks.user.heading")}
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          {t("risks.user.intro")}
        </p>
      </div>

      <div className="card divide-y divide-white/5 overflow-hidden">
        {USER_RISKS.map((r, i) => (
          <article
            key={lc(r.title, locale)}
            className="px-5 py-5 grid md:grid-cols-[1.2fr_2fr] gap-5"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10.5px] text-ink-500">
                  S{(i + 1).toString().padStart(2, "0")}
                </span>
                <h3 className="text-[14.5px] font-medium text-ink-50">
                  {lc(r.title, locale)}
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="eyebrow">{t("risks.user.trigger")}</div>
                <p className="mt-1 text-[12.5px] text-ink-200 leading-relaxed">
                  {lc(r.trigger, locale)}
                </p>
              </div>
              <div>
                <div className="eyebrow text-warn">
                  {t("risks.user.outcome")}
                </div>
                <p className="mt-1 text-[12.5px] text-ink-100 leading-relaxed">
                  {lc(r.outcome, locale)}
                </p>
              </div>
              <div>
                <div className="eyebrow text-signal">
                  {t("risks.user.guard")}
                </div>
                <p className="mt-1 text-[12.5px] text-ink-200 leading-relaxed">
                  {lc(r.guard, locale)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
