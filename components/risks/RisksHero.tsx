import { AUDIT_FINDINGS } from "@/lib/risks";

export default function RisksHero() {
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
      <h1 className="text-[48px] md:text-[64px] headline text-ink-50">
        리스크
      </h1>
      <p className="mt-5 text-[15px] text-ink-300 max-w-xl">
        오딧 finding, 프로토콜 리스크, 사용자 진입 시나리오.
      </p>
      <div className="mt-9 grid md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden">
        <div className="bg-ink-950 px-5 py-5">
          <div className="eyebrow">Audit findings</div>
          <div className="mt-1 text-[18px] font-medium text-ink-50">
            {AUDIT_FINDINGS.length} 건
          </div>
        </div>
        <div className="bg-ink-950 px-5 py-5">
          <div className="eyebrow">Medium 등급</div>
          <div className="mt-1 text-[18px] font-medium text-warn">
            {counts.Medium ?? 0} 건
          </div>
        </div>
        <div className="bg-ink-950 px-5 py-5">
          <div className="eyebrow">Critical 또는 High</div>
          <div className="mt-1 text-[18px] font-medium text-signal">0 건</div>
        </div>
        <div className="bg-ink-950 px-5 py-5">
          <div className="eyebrow">수정 완료</div>
          <div className="mt-1 text-[18px] font-medium text-ink-50">
            {fixed} / {AUDIT_FINDINGS.length}
          </div>
        </div>
      </div>
    </section>
  );
}
