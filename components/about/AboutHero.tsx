"use client";

import { useT } from "@/lib/locale-context";

export default function AboutHero() {
  const t = useT();
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="chip">About</span>
      </div>
      <h1
        className="text-[48px] md:text-[64px] headline"
        style={{ color: "var(--text-1)" }}
      >
        {t("about.hero.title")}
      </h1>
      <p
        className="mt-5 text-[15px] max-w-xl"
        style={{ color: "var(--text-2)" }}
      >
        {t("about.hero.subtitle")}
      </p>
      <div className="mt-9 grid md:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden">
        <MetaCard k={t("about.meta.chain")} v="MegaETH" />
        <MetaCard k={t("about.meta.backing")} v="USDm" />
        <MetaCard k={t("about.meta.audit")} v="Zellic, 2025-05" />
      </div>
    </section>
  );
}

function MetaCard({ k, v }: { k: string; v: string }) {
  return (
    <div className="px-5 py-5" style={{ background: "var(--surface)" }}>
      <div className="eyebrow">{k}</div>
      <div
        className="mt-1 text-[18px] font-medium"
        style={{ color: "var(--text-1)" }}
      >
        {v}
      </div>
    </div>
  );
}
