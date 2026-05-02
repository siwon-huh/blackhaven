import Link from "next/link";

export default function CrossLink() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <Link
        href="/about"
        className="card p-5 flex items-center justify-between gap-4 hover:border-signal/30 transition-colors"
      >
        <div>
          <div className="eyebrow">다음 페이지</div>
          <div className="mt-1 text-[15px] font-medium text-ink-50">
            그래서 Blackhaven 에서는 무엇을 플레이해야 할까요
          </div>
          <div className="mt-1 text-[12.5px] text-ink-300">
            초단기, 초기, 중기 시간축의 메인 플레이와 자본 배분, 액션 시퀀스로 이동합니다.
          </div>
        </div>
        <div className="text-[14px] text-ink-300 font-mono">{"->"}</div>
      </Link>
    </section>
  );
}
