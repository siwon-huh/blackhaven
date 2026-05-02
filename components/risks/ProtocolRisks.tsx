import { PROTOCOL_RISKS } from "@/lib/risks";

export default function ProtocolRisks() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-6">
        <div className="eyebrow">Protocol risks</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          프로토콜 리스크
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          docs.blackhaven.xyz 가 명시한 프로토콜 차원의 리스크와 그에 대한 완화 장치입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-white/5 rounded-xl overflow-hidden">
        {PROTOCOL_RISKS.map((r) => (
          <div key={r.title} className="bg-ink-950 p-6">
            <h3 className="text-[16px] font-medium text-ink-50">{r.title}</h3>
            <p className="mt-2 text-[12.5px] text-ink-200 leading-relaxed">
              {r.detail}
            </p>
            <div className="mt-4">
              <div className="eyebrow text-signal mb-2">완화 장치</div>
              <ul className="space-y-1.5">
                {r.mitigations.map((m, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[12px] text-ink-200 leading-relaxed"
                  >
                    <span className="mt-1.5 h-1 w-1.5 rounded-sm bg-signal shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
