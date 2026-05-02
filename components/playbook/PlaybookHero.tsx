export default function PlaybookHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="chip">Playbook</span>
      </div>
      <h1 className="text-[48px] md:text-[64px] headline text-ink-50">
        사용자 플레이
      </h1>
      <p className="mt-5 text-[15px] text-ink-300 max-w-xl">
        시간축별 메인 플레이와 자본 배분, 액션 시퀀스.
      </p>
      <div className="mt-7 card-2 p-4 max-w-3xl border-warn/20">
        <div className="eyebrow text-warn">참고</div>
        <p className="mt-1.5 text-[12.5px] text-ink-300 leading-relaxed">
          본 플레이북은 docs.blackhaven.xyz 의 메커니즘 설명을 기준으로 작성되었습니다. 만기 곡선, 락업 cap 같은 세부 매개변수는 docs 에서 모두 거버넌스 재량으로만 명시되어 있어, 일부 표현은 OHM 류 디파이의 일반 관습을 따릅니다. 현재 앱에 실제 배포된 옵션은 본드 7일, 14일, 30일과 Commit 2주에서 52주 슬라이더이며, 그 외 옵션이 등장하면 본문에 별도로 표시했습니다.
        </p>
      </div>
    </section>
  );
}
