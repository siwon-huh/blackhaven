export default function ForksHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-14">
      <div className="flex items-center gap-2 mb-6">
        <span className="chip">Postmortem</span>
        <span className="chip">2021 ~ 2024</span>
      </div>
      <h1 className="text-[44px] md:text-[60px] headline text-ink-50">
        OHM 과 그 포크들은
        <br />
        어떻게 됐을까요.
      </h1>
      <p className="mt-7 subhead text-[16px] max-w-2xl">
        Bond, (3,3) staking, DAO treasury 패러다임은 2021 년 디파이를 흔들었지만, 거의 모든 포크가 2022 년에 95 에서 99 퍼센트로 무너졌습니다. 어떤 포크가 어떻게 깨졌는지, 공통 실패 패턴은 무엇이었는지, Blackhaven 은 그 위에서 무엇을 다르게 했는지 정리합니다.
      </p>
      <div className="mt-10 grid md:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden">
        {[
          { k: "샘플", v: "메이저 포크 일곱 개" },
          { k: "살아남은 비율", v: "7 개 중 2 개" },
          { k: "평균 드로우다운", v: "정점 대비 약 98%" },
        ].map((m) => (
          <div key={m.k} className="bg-ink-950 px-5 py-5">
            <div className="eyebrow">{m.k}</div>
            <div className="mt-1 text-[18px] font-medium text-ink-50">{m.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
