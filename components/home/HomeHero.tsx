"use client";

import Link from "next/link";
import { useLocale, useT } from "@/lib/locale-context";

export default function HomeHero() {
  const locale = useLocale();
  const t = useT();
  const p = `/${locale}`;
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/haven-banner.png"
          alt=""
          aria-hidden
          className="w-full h-[460px] object-cover opacity-55"
          style={{ filter: "saturate(0.85) contrast(1.05) brightness(0.85)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--bg) 0%, color-mix(in oklab, var(--bg) 55%, transparent) 60%, color-mix(in oklab, var(--bg) 15%, transparent) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--bg) 40%, transparent) 0%, color-mix(in oklab, var(--bg) 55%, transparent) 50%, var(--bg) 100%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-14">
        <div className="flex items-center gap-2 mb-6">
          <span className="chip-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulseDot" />
            {t("home.hero.live")}
          </span>
          <span className="chip">RBT / USDm</span>
        </div>
        <h1
          className="text-[48px] md:text-[68px] headline"
          style={{ color: "var(--text-1)" }}
        >
          {t("home.hero.title")}
        </h1>
        <p
          className="mt-5 text-[15px] max-w-xl"
          style={{ color: "var(--text-2)" }}
        >
          {t("home.hero.subtitle")}
        </p>
        <div
          className="mt-8 flex items-center gap-5 text-[13px]"
          style={{ color: "var(--text-3)" }}
        >
          <Link href={`${p}/about`} className="inline-flex items-center gap-1.5 hover:text-[color:var(--text-1)]">
            {t("nav.about")}
            <span className="font-mono text-[11px]" style={{ color: "var(--text-4)" }}>
              {"->"}
            </span>
          </Link>
          <Link href={`${p}/playbook`} className="inline-flex items-center gap-1.5 hover:text-[color:var(--text-1)]">
            {t("nav.playbook")}
            <span className="font-mono text-[11px]" style={{ color: "var(--text-4)" }}>
              {"->"}
            </span>
          </Link>
          <Link href={`${p}/forks`} className="inline-flex items-center gap-1.5 hover:text-[color:var(--text-1)]">
            {t("nav.forks")}
            <span className="font-mono text-[11px]" style={{ color: "var(--text-4)" }}>
              {"->"}
            </span>
          </Link>
          <Link href={`${p}/risks`} className="inline-flex items-center gap-1.5 hover:text-[color:var(--text-1)]">
            {t("nav.risks")}
            <span className="font-mono text-[11px]" style={{ color: "var(--text-4)" }}>
              {"->"}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
