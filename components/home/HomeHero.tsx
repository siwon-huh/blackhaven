import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="chip-signal">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulseDot" />
          Live
        </span>
        <span className="chip">RBT / USDm</span>
        <span className="chip">MegaETH</span>
      </div>
      <h1 className="text-[44px] md:text-[64px] headline">
        <span className="text-ink-50">RBT 의 시장가와</span>{" "}
        <span className="text-signal">공정가</span>
        <span className="text-ink-50">,</span>
        <br />
        <span className="text-ink-50">한 화면에서.</span>
      </h1>
      <p className="mt-7 subhead text-[16px] max-w-2xl">
        Kumbaya 풀의 라이브 시장가, 백킹과 비교한 NAV 프리미엄, 그리고 RBT 의 네 단계 공정가 모델을 1 분 간격으로 갱신합니다. 사용자가 어떤 가격대에서 진입해야 비대칭이 큰지 즉시 판단할 수 있습니다.
      </p>
      <div className="mt-7 flex flex-wrap gap-3 text-[12.5px]">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-ink-50 text-ink-950 font-medium hover:bg-ink-100"
        >
          프로토콜이 어떻게 작동하나요
          <span className="font-mono text-[11px]">{"->"}</span>
        </Link>
        <Link
          href="/forks"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border hairline text-ink-200 font-medium hover:text-ink-50 hover:border-ink-300"
        >
          OHM 포크들은 어떻게 됐나요
          <span className="font-mono text-[11px]">{"->"}</span>
        </Link>
      </div>
    </section>
  );
}
