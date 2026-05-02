import { USER_RISKS } from "@/lib/risks";

export default function UserRisks() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-6">
        <div className="eyebrow">User scenarios</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          사용자 진입 시나리오 리스크
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          프로토콜이 작동해도 사용자 자본이 줄어드는 구체적인 시나리오와 가드레일입니다.
        </p>
      </div>

      <div className="card divide-y divide-white/5 overflow-hidden">
        {USER_RISKS.map((r, i) => (
          <article key={r.title} className="px-5 py-5 grid md:grid-cols-[1.2fr_2fr] gap-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10.5px] text-ink-500">
                  S{(i + 1).toString().padStart(2, "0")}
                </span>
                <h3 className="text-[14.5px] font-medium text-ink-50">
                  {r.title}
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="eyebrow">트리거</div>
                <p className="mt-1 text-[12.5px] text-ink-200 leading-relaxed">
                  {r.trigger}
                </p>
              </div>
              <div>
                <div className="eyebrow text-warn">결과</div>
                <p className="mt-1 text-[12.5px] text-ink-100 leading-relaxed">
                  {r.outcome}
                </p>
              </div>
              <div>
                <div className="eyebrow text-signal">가드레일</div>
                <p className="mt-1 text-[12.5px] text-ink-200 leading-relaxed">
                  {r.guard}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
