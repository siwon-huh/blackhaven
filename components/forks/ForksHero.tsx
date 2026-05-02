"use client";

import { useT } from "@/lib/locale-context";

export default function ForksHero() {
  const t = useT();
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-14">
      <div className="flex items-center gap-2 mb-6">
        <span className="chip">Postmortem</span>
        <span className="chip">2021 ~ 2024</span>
      </div>
      <h1
        className="text-[48px] md:text-[64px] headline"
        style={{ color: "var(--text-1)" }}
      >
        {t("forks.hero.title")}
      </h1>
      <p
        className="mt-5 text-[15px] max-w-xl"
        style={{ color: "var(--text-2)" }}
      >
        {t("forks.hero.subtitle")}
      </p>
      <div className="mt-9 grid md:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden">
        {[
          {
            k: t("forks.hero.stat.sample.label"),
            v: t("forks.hero.stat.sample.value"),
          },
          {
            k: t("forks.hero.stat.survived.label"),
            v: t("forks.hero.stat.survived.value"),
          },
          {
            k: t("forks.hero.stat.drawdown.label"),
            v: t("forks.hero.stat.drawdown.value"),
          },
        ].map((m) => (
          <div
            key={m.k}
            className="px-5 py-5"
            style={{ background: "var(--surface)" }}
          >
            <div className="eyebrow">{m.k}</div>
            <div
              className="mt-1 text-[18px] font-medium"
              style={{ color: "var(--text-1)" }}
            >
              {m.v}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
