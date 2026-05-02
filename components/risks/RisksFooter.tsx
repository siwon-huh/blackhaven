"use client";

import Link from "next/link";
import { useLocale, useT } from "@/lib/locale-context";

export default function RisksFooter() {
  const locale = useLocale();
  const t = useT();
  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="grid md:grid-cols-2 gap-3">
        <Link
          href={`/${locale}/forks`}
          className="card p-5 hover:border-warn/30 transition-colors"
        >
          <div className="eyebrow">{t("risks.footer.systemic.eyebrow")}</div>
          <div className="mt-1 text-[15px] font-medium text-ink-50">
            {t("risks.footer.systemic.title")}
          </div>
          <div className="mt-1 text-[12.5px] text-ink-300 leading-relaxed">
            {t("risks.footer.systemic.desc")}
          </div>
        </Link>
        <Link
          href={`/${locale}/playbook`}
          className="card p-5 hover:border-signal/30 transition-colors"
        >
          <div className="eyebrow">{t("risks.footer.playbook.eyebrow")}</div>
          <div className="mt-1 text-[15px] font-medium text-ink-50">
            {t("risks.footer.playbook.title")}
          </div>
          <div className="mt-1 text-[12.5px] text-ink-300 leading-relaxed">
            {t("risks.footer.playbook.desc")}
          </div>
        </Link>
      </div>

      <p className="mt-6 text-[11px] text-ink-500 leading-relaxed">
        {t("risks.footer.notice")}
      </p>
    </section>
  );
}
