// 다국어 지원. 라우트가 /ko/* 또는 /en/* 으로 분리됩니다.
// 사전이 비어있으면 한국어 기본값으로 fallback.

export const LOCALES = ["ko", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ko";

export const isLocale = (s: string | undefined): s is Locale =>
  !!s && (LOCALES as readonly string[]).includes(s);

// 키 기반 얇은 사전. 본문 콘텐츠는 점진적으로 채웁니다.
type Dict = {
  // header / footer / nav
  "nav.live": string;
  "nav.about": string;
  "nav.playbook": string;
  "nav.forks": string;
  "nav.risks": string;
  "header.subtitle": string;
  "footer.notice": string;
  "footer.builtBy": string;
  "footer.researcherAt": string;
  "footer.unofficial": string;
  "footer.protocol": string;

  // home hero
  "home.hero.live": string;
  "home.hero.title": string;
  "home.hero.subtitle": string;

  // about hero
  "about.hero.title": string;
  "about.hero.subtitle": string;
  "about.meta.chain": string;
  "about.meta.backing": string;
  "about.meta.audit": string;

  // playbook hero
  "playbook.hero.title": string;
  "playbook.hero.subtitle": string;

  // forks hero
  "forks.hero.title": string;
  "forks.hero.subtitle": string;

  // risks hero
  "risks.hero.title": string;
  "risks.hero.subtitle": string;
  "risks.hero.findings": string;
  "risks.hero.medium": string;
  "risks.hero.criticalHigh": string;
  "risks.hero.fixed": string;

  // common
  "common.copy": string;
  "common.copied": string;
  "common.live": string;
  "common.static": string;
  "common.stale": string;
  "common.fixed": string;
  "common.acknowledged": string;
};

const ko: Dict = {
  "nav.live": "Live",
  "nav.about": "About",
  "nav.playbook": "Playbook",
  "nav.forks": "Forks",
  "nav.risks": "Risks",
  "header.subtitle": "Reserve-Backed Treasury, unofficial dashboard",
  "footer.notice":
    "본 페이지의 모든 수치는 forward-looking 시나리오와 라이브 데이터의 조합이며, 투자 권유나 보장 수익이 아닙니다.",
  "footer.builtBy": "built by",
  "footer.researcherAt": "researcher at",
  "footer.unofficial": "unofficial dashboard",
  "footer.protocol": "Adventale (protocol)",

  "home.hero.live": "Live",
  "home.hero.title": "Blackhaven Live",
  "home.hero.subtitle": "RBT 시장가, NAV, 공정가.",

  "about.hero.title": "Blackhaven 이란",
  "about.hero.subtitle": "MegaETH 위 reserve-backed treasury.",
  "about.meta.chain": "체인",
  "about.meta.backing": "백킹",
  "about.meta.audit": "감사",

  "playbook.hero.title": "플레이북",
  "playbook.hero.subtitle": "시간축별 메인 플레이와 자본 배분, 액션 시퀀스.",

  "forks.hero.title": "OHM 포크들",
  "forks.hero.subtitle": "2021 년 출시 후 거의 모든 포크가 무너졌습니다.",

  "risks.hero.title": "리스크",
  "risks.hero.subtitle": "오딧 finding, 프로토콜 리스크, 사용자 진입 시나리오.",
  "risks.hero.findings": "Audit findings",
  "risks.hero.medium": "Medium 등급",
  "risks.hero.criticalHigh": "Critical 또는 High",
  "risks.hero.fixed": "수정 완료",

  "common.copy": "copy",
  "common.copied": "copied",
  "common.live": "live",
  "common.static": "static",
  "common.stale": "stale",
  "common.fixed": "fixed",
  "common.acknowledged": "ack",
};

const en: Dict = {
  "nav.live": "Live",
  "nav.about": "About",
  "nav.playbook": "Playbook",
  "nav.forks": "Forks",
  "nav.risks": "Risks",
  "header.subtitle": "Reserve-Backed Treasury, unofficial dashboard",
  "footer.notice":
    "All numbers on this site mix forward-looking scenarios with live data. Not investment advice or a promise of returns.",
  "footer.builtBy": "built by",
  "footer.researcherAt": "researcher at",
  "footer.unofficial": "unofficial dashboard",
  "footer.protocol": "Adventale (protocol)",

  "home.hero.live": "Live",
  "home.hero.title": "Blackhaven Live",
  "home.hero.subtitle": "RBT market price, NAV, and fair value.",

  "about.hero.title": "What is Blackhaven",
  "about.hero.subtitle": "A reserve-backed treasury on MegaETH.",
  "about.meta.chain": "Chain",
  "about.meta.backing": "Backing",
  "about.meta.audit": "Audit",

  "playbook.hero.title": "Playbook",
  "playbook.hero.subtitle":
    "Hero plays per horizon, capital allocation, action sequence.",

  "forks.hero.title": "OHM forks",
  "forks.hero.subtitle":
    "Most forks collapsed within a year of their 2021 launch.",

  "risks.hero.title": "Risks",
  "risks.hero.subtitle":
    "Audit findings, protocol risks, and user entry scenarios.",
  "risks.hero.findings": "Audit findings",
  "risks.hero.medium": "Medium severity",
  "risks.hero.criticalHigh": "Critical or High",
  "risks.hero.fixed": "Fixed",

  "common.copy": "copy",
  "common.copied": "copied",
  "common.live": "live",
  "common.static": "static",
  "common.stale": "stale",
  "common.fixed": "fixed",
  "common.acknowledged": "ack",
};

export const DICTIONARIES: Record<Locale, Dict> = { ko, en };

export type TKey = keyof Dict;

export function t(locale: Locale, key: TKey): string {
  return DICTIONARIES[locale][key] ?? DICTIONARIES.ko[key];
}
