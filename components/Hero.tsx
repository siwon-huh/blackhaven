export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
      <div className="flex items-center gap-2 mb-5">
        <span className="chip">Player&apos;s Playbook</span>
        <span className="chip">Motif: OlympusDAO</span>
        <span className="chip">MegaETH</span>
        <span className="chip">USDm</span>
      </div>
      <h1 className="text-[40px] md:text-[56px] font-semibold tracking-tight leading-[1.05] gradient-text">
        Blackhaven 플레이북
      </h1>
      <p className="mt-6 text-mist-300 text-[16px] leading-relaxed max-w-2xl">
        시간축 하나만 고르면 그 시기의{" "}
        <span className="text-white">메인 플레이 하나와 보조 플레이 두 개</span>,
        자본 배분, 주차별 액션, 그리고 언제 빠져나올지까지 한 화면에 정리합니다.
        본드, 락업, BAM, POL을 어떻게 조합하느냐에 따라 시간축마다 다른 흐름이 만들어집니다.
      </p>
    </section>
  );
}
