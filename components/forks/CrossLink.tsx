"use client";

import Link from "next/link";
import { useLocale, useT } from "@/lib/locale-context";

export default function CrossLink() {
  const locale = useLocale();
  const t = useT();
  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <Link
        href={`/${locale}/about`}
        className="card p-5 flex items-center justify-between gap-4 hover:border-signal/30 transition-colors"
      >
        <div>
          <div className="eyebrow">{t("forks.crosslink.eyebrow")}</div>
          <div className="mt-1 text-[15px] font-medium text-ink-50">
            {t("forks.crosslink.title")}
          </div>
          <div className="mt-1 text-[12.5px] text-ink-300">
            {t("forks.crosslink.desc")}
          </div>
        </div>
        <div className="text-[14px] text-ink-300 font-mono">{"->"}</div>
      </Link>
    </section>
  );
}
