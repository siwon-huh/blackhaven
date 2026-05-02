import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="relative">
      {/* Banner backdrop, 자연 톤 살리되 모노톤과 충돌 안 하도록 보정 */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/haven-banner.png"
          alt=""
          aria-hidden
          className="w-full h-[460px] object-cover opacity-55"
          style={{ filter: "saturate(0.85) contrast(1.05) brightness(0.85)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/55 to-ink-950/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-950/55 to-ink-950" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-14">
        <div className="flex items-center gap-2 mb-6">
          <span className="chip-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulseDot" />
            Live
          </span>
          <span className="chip">RBT / USDm</span>
        </div>
        <h1 className="text-[48px] md:text-[68px] headline text-ink-50">
          Blackhaven Live
        </h1>
        <p className="mt-5 text-[15px] text-ink-200 max-w-xl">
          RBT 시장가, NAV, 공정가.
        </p>
        <div className="mt-8 flex items-center gap-5 text-[13px] text-ink-300">
          <Link
            href="/about"
            className="hover:text-ink-50 inline-flex items-center gap-1.5"
          >
            About
            <span className="font-mono text-[11px] text-ink-500">{"->"}</span>
          </Link>
          <Link
            href="/playbook"
            className="hover:text-ink-50 inline-flex items-center gap-1.5"
          >
            Playbook
            <span className="font-mono text-[11px] text-ink-500">{"->"}</span>
          </Link>
          <Link
            href="/forks"
            className="hover:text-ink-50 inline-flex items-center gap-1.5"
          >
            Forks
            <span className="font-mono text-[11px] text-ink-500">{"->"}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
