"use client";

import { useT } from "@/lib/locale-context";

export default function PlaybookHero() {
  const t = useT();
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="chip">Playbook</span>
      </div>
      <h1
        className="text-[48px] md:text-[64px] headline"
        style={{ color: "var(--text-1)" }}
      >
        {t("playbook.hero.title")}
      </h1>
      <p
        className="mt-5 text-[15px] max-w-xl"
        style={{ color: "var(--text-2)" }}
      >
        {t("playbook.hero.subtitle")}
      </p>
      <div
        className="mt-7 card-2 p-4 max-w-3xl"
        style={{ borderColor: "rgba(244,199,86,0.2)" }}
      >
        <div className="eyebrow text-warn">Note</div>
        <p
          className="mt-1.5 text-[12.5px] leading-relaxed"
          style={{ color: "var(--text-3)" }}
        >
          본 플레이북은 docs.blackhaven.xyz 의 메커니즘 설명을 기준으로 작성되었습니다. 만기 곡선, 락업 cap 같은 세부 매개변수는 docs 에서 모두 거버넌스 재량으로만 명시되어 있어, 일부 표현은 OHM 류 디파이의 일반 관습을 따릅니다. 현재 앱에 실제 배포된 옵션은 본드 7일, 14일, 30일과 Commit 2주에서 52주 슬라이더이며, 그 외 옵션이 등장하면 본문에 별도로 표시했습니다.
        </p>
      </div>
    </section>
  );
}
