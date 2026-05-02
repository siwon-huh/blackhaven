"use client";

import { useState } from "react";
import { AUDIT_FINDINGS, AuditFinding, Severity } from "@/lib/risks";

const SEVERITY_TONE: Record<Severity, { color: string; rank: number }> = {
  Medium: { color: "var(--warn)", rank: 1 },
  Low: { color: "#C9CDD4", rank: 2 },
  Informational: { color: "#9AA0AB", rank: 3 },
};

export default function AuditFindings() {
  const [openId, setOpenId] = useState<string | null>(AUDIT_FINDINGS[0]?.id ?? null);
  const sorted = [...AUDIT_FINDINGS].sort(
    (a, b) =>
      SEVERITY_TONE[a.severity].rank - SEVERITY_TONE[b.severity].rank,
  );

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-6">
        <div className="eyebrow">Audit, Zellic 2026-01</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          외부 감사 finding 11 건
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          Zellic 의 보고서 (2026 년 1 월 19 일) 가 명시한 모든 finding 입니다. Critical 또는 High 등급 영향은 없었으며, Medium 3 건과 Low 2 건, Informational 6 건이 발견되었습니다. 헤더를 클릭하면 상세가 펼쳐집니다.
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
  const tone = SEVERITY_TONE[finding.severity];
  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left px-5 py-4 hover:bg-ink-900 transition-colors"
      >
        <div className="grid grid-cols-[60px_120px_1fr_24px] gap-4 items-center">
          <span
            className="font-mono text-[10.5px] px-2 py-0.5 rounded text-center"
            style={{
              color: tone.color,
              background: `${tone.color}15`,
            }}
          >
            {finding.severity}
          </span>
          <span className="font-mono text-[11px] text-ink-400">
            {finding.target}
          </span>
          <span className="text-[13px] text-ink-100 font-medium leading-snug">
            {finding.title}
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
              <div className="eyebrow mb-1.5">설명</div>
              <p className="text-[13px] text-ink-200 leading-relaxed">
                {finding.summary}
              </p>
            </div>
            <div className="space-y-2">
              <div className="card-2 p-3">
                <div className="eyebrow">상태</div>
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
                    ? "수정 완료"
                    : "Acknowledged"}
                </div>
                {finding.remediation.commit && (
                  <div className="mt-1 text-[10.5px] font-mono text-ink-500">
                    commit {finding.remediation.commit}
                  </div>
                )}
                {finding.remediation.note && (
                  <div className="mt-2 text-[11.5px] text-ink-300 leading-relaxed">
                    {finding.remediation.note}
                  </div>
                )}
              </div>
              <div className="card-2 p-3">
                <div className="eyebrow">분류</div>
                <div className="mt-1 text-[12.5px] text-ink-100">
                  {finding.category}
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
