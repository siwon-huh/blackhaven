export default function AboutHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
      <div className="flex items-center gap-2 mb-6">
        <span className="chip">About</span>
        <span className="chip">Reserve Layer</span>
      </div>
      <h1 className="text-[44px] md:text-[60px] headline text-ink-50">
        Blackhaven 은
        <br />
        무엇을 만드는가.
      </h1>
      <p className="mt-7 subhead text-[16px] max-w-2xl">
        Blackhaven 은 MegaETH 위의{" "}
        <span className="text-ink-50">reserve-backed treasury</span> 입니다. 사용자 예치를 시간이 지나도 사라지지 않는 영구 유동성으로 전환하고, 시장가가 백킹에서 벗어나면 자동으로 차익거래를 수행해 가격을 백킹 가까이로 수렴시킵니다.
      </p>
      <div className="mt-10 grid md:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden">
        {[
          { k: "체인", v: "MegaETH" },
          { k: "백킹 자산", v: "USDm" },
          { k: "감사", v: "Zellic, 2025-05" },
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
