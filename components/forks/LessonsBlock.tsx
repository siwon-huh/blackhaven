import { LESSONS } from "@/lib/forks";

export default function LessonsBlock() {
  return (
    <section id="lessons" className="max-w-6xl mx-auto px-6 pb-20">
      <div className="mb-6">
        <div className="eyebrow">What Blackhaven does differently</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          Blackhaven 이 이 실패들에서 다르게 한 것
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          아래 항목은 모두 docs.blackhaven.xyz 에 명시된 실제 메커니즘입니다.
          마케팅이 아니라 컨트랙트와 TOS 에 구현된 설계입니다.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden md:grid grid-cols-[120px_1fr_2fr] px-6 py-3 eyebrow border-b hairline">
          <div>차단</div>
          <div>Blackhaven 메커니즘</div>
          <div>왜 그게 막아주는가</div>
        </div>
        <ul className="divide-y divide-white/5">
          {LESSONS.map((l, i) => (
            <li
              key={i}
              className="grid md:grid-cols-[120px_1fr_2fr] px-6 py-4 gap-3 items-start"
            >
              <div className="font-mono text-[11px] text-warn">{l.pattern}</div>
              <div className="text-[13.5px] text-ink-50 font-medium leading-relaxed">
                {l.blackhavenDoes}
              </div>
              <div className="text-[12.5px] text-ink-300 leading-relaxed">
                {l.why}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 card p-6 md:p-8">
        <div className="eyebrow">Bottom line</div>
        <p className="mt-3 text-[14.5px] text-ink-100 leading-relaxed max-w-3xl">
          OHM 메커니즘 자체는 백킹 부근까지 사용자 자본을 지켰습니다. 깨진 것은
          메커니즘이 아니라{" "}
          <span className="text-ink-50 font-medium">
            게임이론의 외피, 무한 인플레이션, 자산과 거버넌스의 결합, 사람
            리스크
          </span>
          였습니다. Blackhaven 은 그 외피들을 차례로 제거하고 본질인 트레저리,
          본드, POL 만 남겨, 사용자가 backing 한참 위에서 진입할 동기를
          구조적으로 줄입니다.
        </p>
      </div>
    </section>
  );
}
