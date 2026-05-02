import { LESSONS } from "@/lib/forks";

export default function LessonsBlock() {
  return (
    <section id="lessons" className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-5 flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-mist-400 font-mono">
            What Blackhaven does differently
          </div>
          <h2 className="mt-1 text-2xl font-semibold">
            Blackhaven이 그 실패에서 다르게 한 것
          </h2>
          <p className="mt-1 text-[13px] text-mist-400 max-w-2xl">
            아래 항목들은 전부 docs.blackhaven.xyz의 실제 메커니즘. 마케팅이 아니라
            컨트랙트·TOS에 박힌 설계입니다.
          </p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden md:grid grid-cols-[120px_1fr_2fr] px-5 py-3 text-[10.5px] uppercase tracking-wider text-mist-400 font-mono border-b hairline">
          <div>차단</div>
          <div>Blackhaven 메커니즘</div>
          <div>왜 그게 막아주는가</div>
        </div>
        <ul className="divide-y divide-white/5">
          {LESSONS.map((l, i) => (
            <li
              key={i}
              className="grid md:grid-cols-[120px_1fr_2fr] px-5 py-4 gap-3 items-start"
            >
              <div className="font-mono text-[11px] text-ember-400">{l.pattern}</div>
              <div className="text-[13.5px] text-white font-medium leading-relaxed">
                {l.blackhavenDoes}
              </div>
              <div className="text-[12.5px] text-mist-200 leading-relaxed">{l.why}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 card p-5 bg-gradient-to-br from-violet-500/8 to-ember-500/5">
        <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono">
          Bottom line
        </div>
        <p className="mt-2 text-[14px] text-mist-100 leading-relaxed max-w-3xl">
          OHM 메커니즘 자체는 백킹 부근까지는 사용자 자본을 지켰습니다. 깨진 건 메커니즘이 아니라
          <span className="text-white"> 게임이론의 외피와 무한 인플레이션, 자산/거버넌스 결합, 사람 리스크</span>.
          Blackhaven은 그 외피들을 차례로 제거하고 본질(treasury + bond + POL)만 남겨,
          사용자가 backing 한참 위에서 진입할 동기를 구조적으로 줄입니다.
        </p>
      </div>
    </section>
  );
}
