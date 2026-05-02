import Link from "next/link";

export default function HomeForksLink() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <Link
        href="/forks"
        className="card p-5 flex items-center justify-between gap-4 hover:border-violet-400/40 transition-colors"
      >
        <div>
          <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono">
            Postmortem
          </div>
          <div className="mt-1 text-[15px] font-semibold text-white">
            OHM과 그 포크들은 어떻게 됐는가?
          </div>
          <div className="mt-1 text-[12.5px] text-mist-300">
            메이저 포크 7개의 결말, 공통 실패 패턴 7개, Blackhaven이 다르게 한 것 →
          </div>
        </div>
        <div className="text-[24px] text-mist-300">→</div>
      </Link>
    </section>
  );
}
