"use client";

import { LESSONS } from "@/lib/forks";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

export default function LessonsBlock() {
  const t = useT();
  const locale = useLocale();
  return (
    <section id="lessons" className="max-w-6xl mx-auto px-6 pb-20">
      <div className="mb-6">
        <div className="eyebrow">{t("forks.lessons.eyebrow")}</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          {t("forks.lessons.heading")}
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          {t("forks.lessons.intro")}
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden md:grid grid-cols-[120px_1fr_2fr] px-6 py-3 eyebrow border-b hairline">
          <div>{t("forks.lessons.col.pattern")}</div>
          <div>{t("forks.lessons.col.mechanism")}</div>
          <div>{t("forks.lessons.col.why")}</div>
        </div>
        <ul className="divide-y divide-white/5">
          {LESSONS.map((l, i) => (
            <li
              key={i}
              className="grid md:grid-cols-[120px_1fr_2fr] px-6 py-4 gap-3 items-start"
            >
              <div className="font-mono text-[11px] text-warn">
                {lc(l.pattern, locale)}
              </div>
              <div className="text-[13.5px] text-ink-50 font-medium leading-relaxed">
                {lc(l.blackhavenDoes, locale)}
              </div>
              <div className="text-[12.5px] text-ink-300 leading-relaxed">
                {lc(l.why, locale)}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 card p-6 md:p-8">
        <div className="eyebrow">{t("forks.lessons.bottom")}</div>
        <p className="mt-3 text-[14.5px] text-ink-100 leading-relaxed max-w-3xl">
          {t("forks.lessons.bottomBody.before")}
          <span className="text-ink-50 font-medium">
            {t("forks.lessons.bottomBody.bold")}
          </span>
          {t("forks.lessons.bottomBody.after")}
        </p>
      </div>
    </section>
  );
}
