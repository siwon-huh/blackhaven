"use client";

import { useT } from "@/lib/locale-context";

export default function PlaybookHero() {
  const t = useT();
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="chip">Playbook</span>
      </div>
      <h1
        className="text-[48px] md:text-[64px] headline"
        style={{ color: "var(--text-1)" }}
      >
        {t("playbook.hero.title")}
      </h1>
      <p
        className="mt-5 text-[15px] max-w-xl"
        style={{ color: "var(--text-2)" }}
      >
        {t("playbook.hero.subtitle")}
      </p>
      <div
        className="mt-7 card-2 p-4 max-w-3xl"
        style={{ borderColor: "rgba(244,199,86,0.2)" }}
      >
        <div className="eyebrow text-warn">Note</div>
        <p
          className="mt-1.5 text-[12.5px] leading-relaxed"
          style={{ color: "var(--text-3)" }}
        >
          {t("playbook.hero.note")}
        </p>
      </div>
    </section>
  );
}
