import Link from "next/link";

export default function CrossLink() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <Link
        href="/"
        className="card p-5 flex items-center justify-between gap-4 hover:border-violet-400/40 transition-colors"
      >
        <div>
          <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono">
            돌아가기
          </div>
          <div className="mt-1 text-[15px] font-semibold text-white">
            그래서 Blackhaven에서는 무엇을 플레이해야 할까요
          </div>
          <div className="mt-1 text-[12.5px] text-mist-300">
            초단기, 초기, 중기 시간축의 메인 플레이와 자본 배분, 액션 시퀀스를 정리한 페이지로 돌아갑니다.
          </div>
        </div>
        <div className="text-[18px] text-mist-300 font-mono">{"->"}</div>
      </Link>
    </section>
  );
}
