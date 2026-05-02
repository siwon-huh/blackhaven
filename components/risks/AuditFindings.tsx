"use client";

import { useState } from "react";
import { AUDIT_FINDINGS, AuditFinding, Severity } from "@/lib/risks";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

const SEVERITY_TONE: Record<Severity, { color: string; rank: number }> = {
  Medium: { color: "var(--warn)", rank: 1 },
  Low: { color: "#C9CDD4", rank: 2 },
  Informational: { color: "#9AA0AB", rank: 3 },
};

export default function AuditFindings() {
  const [openId, setOpenId] = useState<string | null>(
    AUDIT_FINDINGS[0]?.id ?? null,
  );
  const t = useT();
  const sorted = [...AUDIT_FINDINGS].sort(
    (a, b) => SEVERITY_TONE[a.severity].rank - SEVERITY_TONE[b.severity].rank,
  );

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-6">
        <div className="eyebrow">{t("risks.audit.eyebrow")}</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          {t("risks.audit.heading")}
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          {t("risks.audit.intro")}
        </p>
      </div>

      <div className="card divide-y divide-white/5 overflow-hidden">
        {sorted.map((f) => (
          <FindingRow
            key={f.id}
            finding={f}
            open={openId === f.id}
            onToggle={() => setOpenId(openId === f.id ? null : f.id)}
          />
        ))}
      </div>
    </section>
  );
}

function FindingRow({
  finding,
  open,
  onToggle,
}: {
  finding: AuditFinding;
  open: boolean;
  onToggle: () => void;
}) {
  const locale = useLocale();
  const t = useT();
  const tone = SEVERITY_TONE[finding.severity];
  const isFixed = finding.remediation.status === "fixed";
  const statusColor = isFixed ? "var(--signal)" : "var(--warn)";
  const statusLabel = isFixed ? t("common.fixed") : t("common.acknowledged");
  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left px-5 py-4 hover:bg-ink-900 transition-colors"
      >
        <div className="grid grid-cols-[88px_minmax(0,180px)_1fr_88px_16px] gap-3 items-center">
          <span
            className="font-mono text-[10.5px] px-2 py-0.5 rounded text-center"
            style={{
              color: tone.color,
              background: `${tone.color}15`,
            }}
          >
            {finding.severity === "Informational" ? "Info" : finding.severity}
          </span>
          <span
            className="font-mono text-[11px] text-ink-400 truncate"
            title={finding.target}
          >
            {finding.target}
          </span>
          <span className="text-[13px] text-ink-100 font-medium leading-snug">
            {lc(finding.title, locale)}
          </span>
          <span
            className="font-mono text-[10.5px] px-2 py-0.5 rounded text-center"
            style={{
              color: statusColor,
              background: `${statusColor}15`,
            }}
          >
            {statusLabel}
          </span>
          <span className="text-[12px] font-mono text-ink-500 text-right">
            {open ? "−" : "+"}
          </span>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 animate-revealUp">
          <div className="grid md:grid-cols-[1fr_280px] gap-5">
            <div>
              <div className="eyebrow mb-1.5">{t("risks.audit.summary")}</div>
              <p className="text-[13px] text-ink-200 leading-relaxed">
                {lc(finding.summary, locale)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="card-2 p-3">
                <div className="eyebrow">{t("risks.audit.statusLabel")}</div>
                <div
                  className="mt-1 text-[13px] font-medium"
                  style={{
                    color:
                      finding.remediation.status === "fixed"
                        ? "var(--signal)"
                        : "var(--warn)",
                  }}
                >
                  {finding.remediation.status === "fixed"
                    ? t("risks.audit.status.fixed")
                    : t("risks.audit.status.acknowledged")}
                </div>
                {finding.remediation.commit && (
                  <div className="mt-1 text-[10.5px] font-mono text-ink-500">
                    {t("risks.audit.commit")} {finding.remediation.commit}
                  </div>
                )}
                {finding.remediation.note && (
                  <div className="mt-2 text-[11.5px] text-ink-300 leading-relaxed">
                    {lc(finding.remediation.note, locale)}
                  </div>
                )}
              </div>
              <div className="card-2 p-3">
                <div className="eyebrow">{t("risks.audit.category")}</div>
                <div className="mt-1 text-[12.5px] text-ink-100">
                  {lc(finding.category, locale)}
                </div>
                <div className="text-[11px] text-ink-500 font-mono mt-0.5">
                  {finding.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
