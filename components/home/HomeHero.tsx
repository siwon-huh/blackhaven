import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-10">
      <div className="flex items-center gap-2 mb-6">
        <span className="chip-signal">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulseDot" />
          Live
        </span>
        <span className="chip">RBT / USDm</span>
      </div>
      <h1 className="text-[48px] md:text-[64px] headline text-ink-50">
        Blackhaven Live
      </h1>
      <p className="mt-5 text-[15px] text-ink-300 max-w-xl">
        RBT 시장가, NAV, 공정가.
      </p>
      <div className="mt-7 flex items-center gap-5 text-[13px] text-ink-300">
        <Link href="/about" className="hover:text-ink-50 inline-flex items-center gap-1.5">
          About <span className="font-mono text-[11px] text-ink-500">{"->"}</span>
        </Link>
        <Link href="/forks" className="hover:text-ink-50 inline-flex items-center gap-1.5">
          Forks <span className="font-mono text-[11px] text-ink-500">{"->"}</span>
        </Link>
      </div>
    </section>
  );
}
