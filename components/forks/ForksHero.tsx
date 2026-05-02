export default function ForksHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="chip">Postmortem</span>
      </div>
      <h1 className="text-[48px] md:text-[64px] headline text-ink-50">
        OHM 포크들
      </h1>
      <p className="mt-5 text-[15px] text-ink-300 max-w-xl">
        2021 년 출시 후 거의 모든 포크가 무너졌습니다.
      </p>
      <div className="mt-9 grid md:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden">
        {[
          { k: "샘플", v: "메이저 7 개" },
          { k: "살아남은 비율", v: "2 / 7" },
          { k: "평균 드로우다운", v: "약 −98%" },
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
