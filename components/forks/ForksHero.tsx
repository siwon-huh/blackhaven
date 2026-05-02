export default function ForksHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
      <div className="flex items-center gap-2 mb-5">
        <span className="chip">Postmortem</span>
        <span className="chip">2021–2024</span>
      </div>
      <h1 className="text-[40px] md:text-[56px] font-semibold tracking-tight leading-[1.05] gradient-text">
        OHM과 그 포크들은<br />
        어떻게 됐는가.
      </h1>
      <p className="mt-6 text-mist-300 text-[16px] leading-relaxed max-w-2xl">
        Bond + (3,3) staking + DAO treasury 패러다임은 2021년 디파이를 흔들었지만, 거의 모든 포크가
        2022년에 −95~99%로 무너졌습니다. 어떤 포크가 어떻게 깨졌는지, 공통 실패 패턴은 무엇인지,
        Blackhaven은 그 위에서 무엇을 다르게 했는지 정리합니다.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-[12px] text-mist-300 font-mono">
        <div className="card px-4 py-3">
          <div className="text-[10px] uppercase tracking-wider text-mist-400">샘플</div>
          <div className="mt-1 text-white">메이저 포크 7개</div>
        </div>
        <div className="card px-4 py-3">
          <div className="text-[10px] uppercase tracking-wider text-mist-400">살아남은 비율</div>
          <div className="mt-1 text-white">2 / 7 (피벗 포함)</div>
        </div>
        <div className="card px-4 py-3">
          <div className="text-[10px] uppercase tracking-wider text-mist-400">평균 드로우다운</div>
          <div className="mt-1 text-white">−98% (peak → trough)</div>
        </div>
      </div>
    </section>
  );
}
