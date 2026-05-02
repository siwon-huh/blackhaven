import Link from "next/link";

export default function RisksFooter() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="grid md:grid-cols-2 gap-3">
        <Link
          href="/forks"
          className="card p-5 hover:border-warn/30 transition-colors"
        >
          <div className="eyebrow">시스템적 리스크</div>
          <div className="mt-1 text-[15px] font-medium text-ink-50">
            OHM 류 시스템 리스크 패턴 일곱 가지
          </div>
          <div className="mt-1 text-[12.5px] text-ink-300 leading-relaxed">
            (3,3) 셸링 붕괴, 백킹 무관 가격 폭주, 무한 인플레이션 등 OHM 포크들이 깨진 패턴과 Blackhaven 이 다르게 한 것을 정리한 페이지로 이동합니다.
          </div>
        </Link>
        <Link
          href="/playbook"
          className="card p-5 hover:border-signal/30 transition-colors"
        >
          <div className="eyebrow">대응 플레이</div>
          <div className="mt-1 text-[15px] font-medium text-ink-50">
            시간축별 사용자 플레이북
          </div>
          <div className="mt-1 text-[12.5px] text-ink-300 leading-relaxed">
            각 리스크에 대응하는 구체 플레이와 자본 배분, 정지 신호로 이동합니다.
          </div>
        </Link>
      </div>

      <p className="mt-6 text-[11px] text-ink-500 leading-relaxed">
        본 페이지는 Zellic 의 공개 보고서와 docs.blackhaven.xyz 의 Risks 섹션을 정리한 자료이며 최종 권고가 아닙니다. 실제 자본 배분 전 docs 와 보고서 원문, 현재 컨트랙트 상태를 직접 확인하시기 바랍니다.
      </p>
    </section>
  );
}
