export default function AboutHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="chip">About</span>
      </div>
      <h1 className="text-[48px] md:text-[64px] headline text-ink-50">
        Blackhaven 이란
      </h1>
      <p className="mt-5 text-[15px] text-ink-300 max-w-xl">
        MegaETH 위 reserve-backed treasury.
      </p>
      <div className="mt-9 grid md:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden">
        {[
          { k: "체인", v: "MegaETH" },
          { k: "백킹", v: "USDm" },
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
