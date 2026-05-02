"use client";

import { AUDIT_FINDINGS } from "@/lib/risks";
import { useT } from "@/lib/locale-context";

export default function RisksHero() {
  const t = useT();
  const counts = AUDIT_FINDINGS.reduce(
    (acc, f) => {
      acc[f.severity] = (acc[f.severity] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const fixed = AUDIT_FINDINGS.filter(
    (f) => f.remediation.status === "fixed",
  ).length;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="chip">Risks</span>
      </div>
      <h1
        className="text-[48px] md:text-[64px] headline"
        style={{ color: "var(--text-1)" }}
      >
        {t("risks.hero.title")}
      </h1>
      <p
        className="mt-5 text-[15px] max-w-xl"
        style={{ color: "var(--text-2)" }}
      >
        {t("risks.hero.subtitle")}
      </p>
      <div className="mt-9 grid md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden">
        <Stat label={t("risks.hero.findings")} value={`${AUDIT_FINDINGS.length}`} />
        <Stat
          label={t("risks.hero.medium")}
          value={`${counts.Medium ?? 0}`}
          tone="warn"
        />
        <Stat
          label={t("risks.hero.criticalHigh")}
          value="0"
          tone="signal"
        />
        <Stat
          label={t("risks.hero.fixed")}
          value={`${fixed} / ${AUDIT_FINDINGS.length}`}
        />
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warn" | "signal";
}) {
  const color =
    tone === "warn"
      ? "var(--warn)"
      : tone === "signal"
        ? "var(--signal)"
        : "var(--text-1)";
  return (
    <div className="px-5 py-5" style={{ background: "var(--surface)" }}>
      <div className="eyebrow">{label}</div>
      <div className="mt-1 text-[18px] font-medium" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
