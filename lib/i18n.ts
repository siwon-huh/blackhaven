// 다국어 지원. 라우트가 /ko/* 또는 /en/* 으로 분리됩니다.
// 사전이 비어있으면 한국어 기본값으로 fallback.

export const LOCALES = ["ko", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ko";

// 데이터 객체 안의 한국어 텍스트를 영어로 마이그레이션 할 때 쓰는 헬퍼.
// string 그대로 두면 legacy 한국어 유지, { ko, en } 객체로 바꾸면 locale 별 렌더.
export type LocaleString = string | { ko: string; en?: string };

export const lc = (s: LocaleString | undefined, locale: Locale): string => {
  if (!s) return "";
  if (typeof s === "string") return s;
  return s[locale] ?? s.ko;
};

export const isLocale = (s: string | undefined): s is Locale =>
  !!s && (LOCALES as readonly string[]).includes(s);

type Dict = Record<string, string>;

const ko: Dict = {
  // nav / header / footer
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
  "footer.about":
    "MegaETH 위에 자리잡은 reserve-backed treasury 입니다. 본드, 락업, BAM, POL 의 결합으로 동작합니다.",

  // home hero
  "home.hero.live": "Live",
  "home.hero.title": "Blackhaven Live",
  "home.hero.subtitle": "RBT 시장가, NAV, 공정가.",

  // about hero
  "about.hero.title": "Blackhaven 이란",
  "about.hero.subtitle": "MegaETH 위 reserve-backed treasury.",
  "about.meta.chain": "체인",
  "about.meta.backing": "백킹",
  "about.meta.audit": "감사",
  "about.flow.eyebrow": "Flow",
  "about.flow.heading": "자금이 어떻게 흐르는가",
  "about.flow.intro":
    "본드, 락업, BAM, POL 이 트레저리 안에서 어떻게 맞물려 작동하는지 정리한 다이어그램입니다. 화살표는 USDm 이나 RBT 의 이동 방향을 나타냅니다.",
  "about.flow.usdmIn.eyebrow": "USDm 유입",
  "about.flow.usdmIn.body":
    "사용자의 USDm 이 본드를 거쳐 트레저리와 POL 에 영구적으로 쌓입니다. 90퍼센트는 트레저리, 10퍼센트는 운영자금입니다.",
  "about.flow.rbtDist.eyebrow": "RBT 분배",
  "about.flow.rbtDist.body":
    "본드는 만기까지 RBT 를 선형으로 분배합니다. 락업한 RBT 는 만기에 추가 RBT 분배를 받습니다.",
  "about.flow.bam.eyebrow": "BAM 가격 보정",
  "about.flow.bam.body":
    "시장가가 NAV 위면 트레저리가 RBT 를 매도해 USDm 을 회수하고, 아래면 USDm 으로 RBT 를 사서 소각합니다.",
  "about.mech.eyebrow": "Mechanics",
  "about.mech.heading": "네 개의 레버",
  "about.mech.intro":
    "본드, 락업, BAM, POL 의 네 가지가 Blackhaven 의 동작을 만듭니다. 시간축마다 어떤 조합이 우세한지가 사용자 플레이의 차이를 만듭니다.",
  "about.mech.vsOhm": "vs OHM",
  "about.mech.diff": "OlympusDAO 와의 차이",
  "about.contracts.eyebrow": "Contracts",
  "about.contracts.heading": "컨트랙트 매핑",
  "about.contracts.intro":
    "MegaETH 메인넷 (chain id 4326) 에 배포된 Blackhaven 컨트랙트 전체입니다. Zellic 오딧 보고서와 onchain selector probing 으로 매핑한 결과입니다. 주소를 클릭하면 explorer 가 열리고, 옆 버튼으로 복사할 수 있습니다.",
  "about.contracts.likelyNote":
    "likely 표기 항목은 selector 응답이 표준 인터페이스에 매칭되지 않아 오딧 보고서의 컴포넌트 이름과 1:1 단정이 어려운 컨트랙트입니다. 곧 verified 메타데이터가 공개되면 갱신하겠습니다.",
  "about.contracts.likelyChip": "likely",
  "about.contracts.copyAria": "copy address",
  "about.contracts.tokens.eyebrow": "Tokens",
  "about.contracts.tokens.title": "토큰",
  "about.contracts.tokens.desc":
    "RBT 와 sRBT 가 프로토콜 안에서 도는 두 자산입니다. USDm 은 외부 스테이블코인으로 본드 약정과 NAV backing 의 화폐입니다.",
  "about.contracts.core.eyebrow": "Core components",
  "about.contracts.core.title": "코어 컴포넌트",
  "about.contracts.core.desc":
    "Zellic 오딧 보고서가 명시한 7개 컴포넌트와 그에 부수된 컨트랙트입니다.",
  "about.contracts.bonds.eyebrow": "Bonds",
  "about.contracts.bonds.title": "본드 컨트랙트",
  "about.contracts.bonds.desc":
    "USDm 을 디스카운트로 RBT 와 교환합니다. 만기까지 선형 베스팅이며 약정 자본의 90퍼센트가 트레저리, 10퍼센트가 LiquidityManager 로 분배됩니다.",
  "about.contracts.treasury.eyebrow": "Treasury & infra",
  "about.contracts.treasury.title": "트레저리와 인프라",
  "about.contracts.treasury.desc":
    "본드 자본이 흘러 들어가는 트레저리, 외부 거래 풀, deploy 관련 EOA 와 factory 입니다.",

  // playbook hero
  "playbook.hero.title": "플레이북",
  "playbook.hero.subtitle": "시간축별 메인 플레이와 자본 배분, 액션 시퀀스.",
  "playbook.hero.note":
    "본 플레이북은 docs.blackhaven.xyz 의 메커니즘 설명을 기준으로 작성되었습니다. 만기 곡선, 락업 cap 같은 세부 매개변수는 docs 에서 모두 거버넌스 재량으로만 명시되어 있어, 일부 표현은 OHM 류 디파이의 일반 관습을 따릅니다. 현재 앱에 실제 배포된 옵션은 본드 7일, 14일, 30일과 Commit 2주에서 52주 슬라이더이며, 그 외 옵션이 등장하면 본문에 별도로 표시했습니다.",
  "forks.hero.stat.sample.label": "샘플",
  "forks.hero.stat.sample.value": "메이저 7 개",
  "forks.hero.stat.survived.label": "살아남은 비율",
  "forks.hero.stat.survived.value": "2 / 7",
  "forks.hero.stat.drawdown.label": "평균 드로우다운",
  "forks.hero.stat.drawdown.value": "약 −98%",
  "playbook.section.eyebrow": "Playbook",
  "playbook.section.heading": "어떤 플레이를 할 수 있을까",
  "playbook.section.intro":
    "시간축 하나만 고르면 그 시기의 메인 플레이와 보조 플레이, 자본 배분, 주차별 액션, 정지 신호까지 한 화면에 정리합니다.",
  "playbook.scenario.selected": "selected",
  "playbook.scenario.alpha": "{name} 의 알파",
  "playbook.section.extras": "보조 플레이",
  "play.bestApr": "Best-case APR",
  "play.aprNote": "연환산, 베스트케이스",
  "play.whyLabel": "왜 지금 이 플레이가 우세한가. ",
  "play.steps": "실행 절차",
  "play.upside": "Upside",
  "play.downside": "Downside",
  "play.difficulty": "난이도 {x}",
  "effort.easy": "쉬움",
  "effort.moderate": "보통",
  "effort.hard": "어려움",
  "extras.expandSteps": "실행 절차 펼치기",
  "extras.up": "Up",
  "extras.down": "Down",
  "alloc.eyebrow": "Capital allocation",
  "alloc.title": "권장 자본 배분",
  "alloc.total": "합계 100퍼센트",
  "alloc.disclaimer":
    "본인의 유동성과 리스크 허용에 맞춰 조정하시기 바랍니다. 락업에 들어간 자본은 만기까지 회수가 어려우므로 정말 사용하지 않을 자본만 배정하시기 바랍니다.",
  "week.eyebrow": "Action sequence",
  "week.title": "주차별 실행 순서",
  "stop.eyebrow": "Stop signals",
  "stop.title": "이 신호가 보이면 플레이를 중단하세요",
  "tag.bond": "본드",
  "tag.commit": "Commit",
  "tag.trade": "트레이드",
  "tag.claim": "클레임",
  "tag.watch": "지켜보기",

  // forks hero
  "forks.hero.title": "OHM 포크들",
  "forks.hero.subtitle": "2021 년 출시 후 거의 모든 포크가 무너졌습니다.",
  "forks.timeline.eyebrow": "Timeline",
  "forks.timeline.heading": "출시부터 결말까지",
  "forks.timeline.intro":
    "2021 년 출시 후 2022 년 1 분기에 거의 모든 포크가 무너지는 패턴이 공통적으로 나타났습니다. 살아남은 사례는 메커니즘이 아니라 피벗에 가깝습니다.",
  "forks.timeline.peak": "정점",
  "forks.timeline.afterFinal": "2024 이후",
  "forks.cards.eyebrow": "Project files",
  "forks.cards.heading": "프로젝트별 케이스",
  "forks.cards.intro":
    "헤더를 클릭해 정렬할 수 있고, row 를 클릭하면 정규화된 곡선과 상세 분석을 펼쳐볼 수 있습니다.",
  "forks.cards.col.ticker": "Ticker",
  "forks.cards.col.chain": "Chain",
  "forks.cards.col.status": "Status",
  "forks.cards.col.launch": "Launch",
  "forks.cards.col.toPeak": "to Peak",
  "forks.cards.col.peak": "Peak",
  "forks.cards.col.recent": "Recent",
  "forks.cards.col.vsLaunch": "vs Launch",
  "forks.cards.col.vsPeak": "vs Peak",
  "forks.cards.curve": "Normalized price curve",
  "forks.cards.launchPrice": "출시가",
  "forks.cards.peakPrice": "정점가",
  "forks.cards.recentPrice": "현재가",
  "forks.cards.peakAtDays": "{date}, {n}일",
  "forks.cards.hook": "차별점",
  "forks.cards.whyItGrew": "잘 됐던 이유",
  "forks.cards.whyItBroke": "깨진 이유",
  "forks.cards.ending": "결말",
  "forks.cards.aliveNote": "참고",
  "forks.cards.aliveBody":
    "Alive 군은 정점 대비 {peak} 하락했지만 출시 가격 대비는 {launch} 입니다. 사용자 평균 진입가는 두 값 사이 어딘가에 있습니다.",
  "forks.patterns.eyebrow": "Common failure modes",
  "forks.patterns.heading": "공통 실패 패턴 일곱 가지",
  "forks.patterns.intro":
    "개별 포크가 깨진 이유는 다르지만, 거의 모든 포크가 이 일곱 가지 중 두세 가지에 동시에 걸려 있었습니다.",
  "forks.patterns.examples": "실제 사례",
  "forks.lessons.eyebrow": "What Blackhaven does differently",
  "forks.lessons.heading": "Blackhaven이 이전의 실패들과 다르게 구현한 것",
  "forks.lessons.intro":
    "아래 항목은 모두 docs.blackhaven.xyz 에 명시된 실제 메커니즘입니다. 마케팅이 아니라 컨트랙트와 TOS 에 구현된 설계입니다.",
  "forks.lessons.col.pattern": "차단",
  "forks.lessons.col.mechanism": "Blackhaven 메커니즘",
  "forks.lessons.col.why": "왜 그게 막아주는가",
  "forks.lessons.bottom": "Bottom line",
  "forks.lessons.bottomBody.before":
    "OHM 메커니즘 자체는 백킹 부근까지 사용자 자본을 지켰습니다. 깨진 것은 메커니즘이 아니라 ",
  "forks.lessons.bottomBody.bold":
    "게임이론의 외피, 무한 인플레이션, 자산과 거버넌스의 결합, 사람 리스크",
  "forks.lessons.bottomBody.after":
    " 였습니다. Blackhaven 은 그 외피들을 차례로 제거하고 본질인 트레저리, 본드, POL 만 남겨, 사용자가 backing 한참 위에서 진입할 동기를 구조적으로 줄입니다.",
  "forks.crosslink.eyebrow": "다음 페이지",
  "forks.crosslink.title": "그래서 Blackhaven 에서는 무엇을 플레이해야 할까요",
  "forks.crosslink.desc":
    "초단기, 초기, 중기 시간축의 메인 플레이와 자본 배분, 액션 시퀀스로 이동합니다.",
  "forks.priceCurve.heading": "출시 이후 월별 가격 곡선",
  "forks.priceCurve.intro":
    "각 토큰의 정점가를 100 으로 두고 출시부터의 월별 종가를 정규화했습니다. 가로축은 출시 이후 경과 개월, 세로축은 정점 대비 잔여 가격 (퍼센트) 입니다. 다이아몬드 표시가 각 토큰의 정점이며, 정점 도달까지 걸린 시간이 토큰마다 다릅니다.",
  "forks.priceCurve.disclaimer":
    "월별 종가는 CoinGecko 와 CMC 의 공개 정보 기반 근사치이며, 실제 일중 가격과 차이가 있을 수 있습니다.",
  "forks.priceCurve.peakMarker": "정점",
  "forks.priceCurve.toPeak": "{n}개월에 정점",

  // risks hero
  "risks.hero.title": "리스크",
  "risks.hero.subtitle": "오딧 finding, 프로토콜 리스크, 사용자 진입 시나리오.",
  "risks.hero.findings": "Audit findings",
  "risks.hero.medium": "Medium 등급",
  "risks.hero.criticalHigh": "Critical 또는 High",
  "risks.hero.fixed": "수정 완료",

  // risks audit
  "risks.audit.eyebrow": "Audit, Zellic 2026-01",
  "risks.audit.heading": "외부 감사 finding 11 건",
  "risks.audit.intro":
    "Zellic 보고서 (2026 년 1 월 19 일) 가 명시한 모든 finding 입니다. Critical 또는 High 등급 영향은 없었으며, Medium 3 건과 Low 2 건, Informational 6 건이 발견되었습니다. 헤더를 클릭하면 상세가 펼쳐집니다.",
  "risks.audit.summary": "설명",
  "risks.audit.statusLabel": "상태",
  "risks.audit.status.fixed": "수정 완료",
  "risks.audit.status.acknowledged": "Acknowledged",
  "risks.audit.commit": "commit",
  "risks.audit.category": "분류",

  // risks protocol
  "risks.protocol.eyebrow": "Protocol risks",
  "risks.protocol.heading": "프로토콜 리스크",
  "risks.protocol.intro":
    "docs.blackhaven.xyz 가 명시한 프로토콜 차원의 리스크와 그에 대한 완화 장치입니다.",
  "risks.protocol.mitigations": "완화 장치",

  // risks user scenarios
  "risks.user.eyebrow": "User scenarios",
  "risks.user.heading": "사용자 진입 시나리오 리스크",
  "risks.user.intro":
    "프로토콜이 작동해도 사용자 자본이 줄어드는 구체적인 시나리오와 가드레일입니다.",
  "risks.user.trigger": "트리거",
  "risks.user.outcome": "결과",
  "risks.user.guard": "가드레일",

  // risks footer cross-link
  "risks.footer.systemic.eyebrow": "시스템적 리스크",
  "risks.footer.systemic.title": "OHM 류 시스템 리스크 패턴 일곱 가지",
  "risks.footer.systemic.desc":
    "(3,3) 셸링 붕괴, 백킹 무관 가격 폭주, 무한 인플레이션 등 OHM 포크들이 깨진 패턴과 Blackhaven 이 다르게 한 것을 정리한 페이지로 이동합니다.",
  "risks.footer.playbook.eyebrow": "대응 플레이",
  "risks.footer.playbook.title": "시간축별 사용자 플레이북",
  "risks.footer.playbook.desc":
    "각 리스크에 대응하는 구체 플레이와 자본 배분, 정지 신호로 이동합니다.",
  "risks.footer.notice":
    "본 페이지는 Zellic 의 공개 보고서와 docs.blackhaven.xyz 의 Risks 섹션을 정리한 자료이며 최종 권고가 아닙니다. 실제 자본 배분 전 docs 와 보고서 원문, 현재 컨트랙트 상태를 직접 확인하시기 바랍니다.",

  // common
  "common.copy": "copy",
  "common.copied": "copied",
  "common.live": "live",
  "common.static": "static",
  "common.stale": "stale",
  "common.fixed": "fixed",
  "common.acknowledged": "ack",
  "common.updated": "updated",

  // live snapshot
  "live.title": "실시간 현황",
  "live.lastUpdated": "마지막 갱신",
  "live.loading": "loading",
  "live.polling": "Live, 1초 간격 업데이트",
  "live.stale": "Live, stale",
  "live.market.label": "RBT Market Price",
  "live.nav.label": "NAV",
  "live.premium.label": "Premium",
  "live.premium.multipleOfNAV": "NAV 의 {x} 배",
  "live.liquidity": "Liquidity",
  "live.volume24": "Volume 24h",
  "live.pool": "Pool",
  "live.supply": "Supply",
  "live.supply.sub": "circulating, total",
  "live.bondPools": "Bond pools",
  "live.bond.dayLabel": "{n}일 본드",
  "live.bond.recommendedMax": "권장 max",
  "live.stake.tvl": "Stake TVL",
  "live.stake.staked": "{n} RBT staked",
  "live.commit.tvl": "Commit TVL",
  "live.commit.locked": "{n} sRBT locked",
  "live.commit.noCommits": "no commits",
  "live.commit.reward": "Commit 24w reward",
  "live.commit.pool": "pool {n} RBT",
  "live.txns24": "TXNS 24h",
  "live.disclaimer.bond":
    "본드 풀, Stake, Commit 모두 onchain 라이브입니다. 본드별 권장 max 는 풀 깊이의 5퍼센트로 그 이상 들어가면 디스카운트가 빠르게 잠식되고, shallow 등급 (TVL ≤ $50K) 풀은 작은 자본 외에는 비효율입니다.",
  "live.signals": "Signals",
  "live.priority": "지금 이 순간 플레이 우선순위",
  "live.source.onchain": "onchain",
  "live.source.staticManual": "static, manual sync",

  // verdict labels
  "verdict.undervalued.label": "저평가",
  "verdict.undervalued.detail":
    "시장가가 NAV 이하입니다. BAM 매수 윈도우가 열린 비대칭 진입 구간입니다.",
  "verdict.fair.label": "공정",
  "verdict.fair.detail":
    "Yield-adjusted Fair 이하입니다. 본드를 거치지 않고 스팟 매수가 합리적인 구간입니다.",
  "verdict.bondOnly.label": "본드 권장",
  "verdict.bondOnly.detail":
    "Bond Effective 이하입니다. 시장가 직매수보다 본드를 통한 진입이 효율적입니다.",
  "verdict.overvalued.label": "고평가",
  "verdict.overvalued.detail":
    "Bond Effective 위입니다. 본드도 비효율이며 다음 라운드를 기다리는 구간입니다.",

  // market dynamics
  "md.title": "Market Dynamics",
  "md.heading": "어떤 움직임이 보여야 RBT 가 오를까",
  "md.intro":
    "가격은 NAV × Premium 배수 로 분해됩니다. NAV 펌프와 매도 압력, 락업 비율, 본드 만기 wave 네 가지 동력을 1초 단위로 갱신합니다.",
  "md.outlook.bullish": "우상향 가능",
  "md.outlook.balanced": "균형",
  "md.outlook.bearish": "하방 압력",
  "md.outlook.bullish.summary":
    "NAV 가 빠르게 차오르고 매수 우세에 lock 비율도 받쳐주는 상태. Premium 이 유지되며 시장가가 NAV 를 따라 절대 가격이 상승합니다.",
  "md.outlook.balanced.summary":
    "NAV 추격과 매도 압력이 균형 상태. BAM 이 가격을 NAV 위 일정 배율에서 진동시키는 구간입니다. 다음 큰 움직임은 Stake/Commit lock 증가나 외부 등재 같은 외생 트리거에 달려 있습니다.",
  "md.outlook.bearish.summary":
    "NAV 펌프 페이스가 약하고 매도 우세 또는 본드 만기 wave 가 임박해 있습니다. Premium 가 빠르게 NAV 부근까지 축소될 수 있습니다.",
  "md.diagnosis": "진단",
  "md.signals.navPump": "NAV Pump",
  "md.signals.flow": "Buy / Sell Pressure",
  "md.signals.lock": "Lock Ratio",
  "md.signals.wave": "Bond Maturity Wave",
  "md.strength.strong": "강함",
  "md.strength.moderate": "보통",
  "md.strength.weak": "약함",
  "md.flow.buyDominant": "매수 우세",
  "md.flow.balanced": "균형",
  "md.flow.sellDominant": "매도 우세",
  "md.lock.expanding": "확장 중",
  "md.lock.early": "성장 초기",
  "md.lock.low": "낮음",
  "md.wave.large": "큰 wave 가능",
  "md.wave.medium": "중간",
  "md.wave.small": "작음",
  "md.triggers.heading": "우상향 트리거 체크리스트",
  "md.triggers.stake": "Stake TVL 가 FDV 의 5퍼센트 이상으로 차오름",
  "md.triggers.stake.detail": "유통 매도 가능 RBT 감소 → Premium 안정",
  "md.triggers.bondTotal": "본드 풀 합계 $400K 이상 도달",
  "md.triggers.bondTotal.detail": "NAV 펌프 가속, Treasury 우상향 명확",
  "md.triggers.flow": "Buy/Sell 비율 1.2 이상에서 1h 양수 흐름 지속",
  "md.triggers.flow.detail": "외부 수요 유입 또는 신규 등재 사이클 시작",
  "md.triggers.external": "RBT 가 외부 lending 또는 perp 에 담보로 등재",
  "md.triggers.external.detail": "수요 다각화로 Premium buoy",
  "md.disclaimer":
    "NAV 자체는 정적 fallback (앱 Metrics 페이지 수기 sync) 이라 NAV 가 천천히 차오르는 추세 자체는 이 패널에서 직접 측정되지 않습니다. 시그널은 본드 onchain 잔액과 dexscreener 라이브 데이터, Stake 정적 TVL 의 조합으로 추정합니다.",
  "md.signal.navPump.strong":
    "Premium 이 큰 상태에서 본드 inflow 도 빠릅니다. BAM 위쪽 매도와 신규 본드가 함께 reserves 를 빠르게 채우는 중.",
  "md.signal.navPump.moderate":
    "본드 풀에 의미있는 자본이 누적 중입니다. NAV 가 안정적으로 추격합니다.",
  "md.signal.navPump.weak":
    "본드 inflow 가 둔화되어 있습니다. NAV 추격 페이스가 떨어집니다.",

  // fair value
  "fv.title": "Fair Value",
  "fv.layerModel": "4-layer model",
  "fv.heading": "RBT 공정가는 얼마일까요",
  "fv.intro":
    "하나의 정답 가격이 아니라 네 단계의 가격대 로 봅니다. 각 단계는 서로 다른 가정에서 나오는 다른 종류의 공정함입니다.",
  "fv.intro.boldSegment": "네 단계의 가격대",
  "fv.layer.floor": "Floor (NAV)",
  "fv.layer.floor.desc":
    "Reserves per RBT 입니다. 시장가가 이 아래로 빠지면 BAM 이 매수와 소각으로 받쳐주는 절대 하한선입니다.",
  "fv.layer.yieldFair": "Yield-adjusted Fair",
  "fv.layer.bondEffective": "Bond Effective",
  "fv.layer.market": "Market",
  "fv.layer.market.desc": "현재 RBT 와 USDm 의 시장가입니다.",
  "fv.forwardYield": "Forward yield",
  "fv.reflexivity": "Reflexivity",
  "fv.reflexivity.tooltip":
    "OHM 류 게임이론의 셸링이 깨질 가능성에 대한 디스카운트",
  "fv.entryConclusion": "사용자 진입 결론",
  "fv.entryConclusion.floor": "NAV {x} 이며 절대 하한입니다.",
  "fv.entryConclusion.fair": "Yield-adjusted {x} 이며 합리적 진입 상한입니다.",
  "fv.entryConclusion.bond": "Effective {x} 이며 시장가 진입의 마지노선입니다.",
  "fv.entryConclusion.market": "{x} 이며 NAV 의 {ratio} 배 입니다.",
  "fv.priceZones": "어떤 가격대에 진입하느냐",
  "fv.zone.belowFloor":
    "Floor 이하 의 가격에서는 BAM 매수 윈도우가 열려 비대칭이 가장 큽니다.",
  "fv.zone.floorToFair":
    "Floor 와 Yield-fair 사이 에서는 본드를 거치지 않고 시장가 진입이 가능합니다.",
  "fv.zone.fairToBond":
    "Yield-fair 와 Bond Effective 사이 에서는 본드를 통해서만 진입합니다.",
  "fv.zone.bondToMarket":
    "Bond Effective 와 Market 사이 는 패스하고 다음 라운드를 기다립니다.",
  "fv.reflex.title": "Reflexivity discount",
  "fv.reflex.factor": "forward yield 에서 {x} 차감",
  "fv.reflex.body":
    "OHM 류 게임이론은 (3,3) 셸링이 깨지는 순간 매도가 매도를 부르는 데스 스파이럴로 전환되었습니다. Blackhaven 은 BAM 의 자동 양방향 차익거래로 이 패턴을 구조적으로 완화하지만, 사용자 행동의 불확실성은 남아 있습니다. Reflexivity 디스카운트는 그 불확실성을 forward yield 에서 깎는 보수적 가정입니다. NAV (Floor) 자체는 트레저리 백킹이 받쳐주므로 영향을 받지 않습니다.",
  "fv.assumptions": "계산에 쓴 가정",
  "fv.assumption.forwardYield": "Forward yield",
  "fv.assumption.reflexivity": "Reflexivity",
  "fv.assumption.maxBondDiscount": "Max bond discount",
  "fv.assumption.protocolFee": "Protocol fee",
  "fv.assumption.maxBondDiscount.bondLabel": "30 일 본드",
  "fv.assumption.protocolFee.phaseLabel": "Genesis Phase 1",
  "fv.assumption.lastUpdated": "마지막 갱신",
  "fv.assumptions.body":
    "Live metrics 은 Reserves per RBT, Circulating, Market, Stake TVL 입니다. Forward yield 는 stake APR 과 commit annualized 의 가중합으로 계산하며, 온체인 또는 attestation 을 통해 갱신할 수 있습니다.",
  "fv.entryConclusion.floor.label": "Floor",
  "fv.entryConclusion.fair.label": "Fair",
  "fv.entryConclusion.bond.label": "Bond",
  "fv.entryConclusion.market.label": "Market",
  "fv.times": "배",

  // capital guide
  "cap.eyebrow": "Capital sizing",
  "cap.heading": "자본 규모와 본드 풀 깊이 매칭",
  "cap.intro":
    "본드 풀 깊이 (TVL) 의 5퍼센트를 권장 max 로 봅니다. 그 이상이 들어가면 디스카운트가 빠르게 잠식됩니다. 자본 규모를 입력하면 라이브 본드 데이터로 권장 만기를 골라줍니다.",
  "cap.input": "진입 자본",
  "cap.fits": "fits",
  "cap.tight": "tight",
  "cap.over": "over",
  "cap.recommendedPick": "추천 만기",
  "cap.recommended": "권장",
  "cap.tier.small.label": "Small",
  "cap.tier.small.range": "1K USDm 이하",
  "cap.tier.small.guidance":
    "모든 만기 본드를 자유롭게 사용할 수 있습니다. 14 일 본드의 디스카운트 10퍼센트가 의외로 저평가된 옵션입니다.",
  "cap.tier.medium.label": "Medium",
  "cap.tier.medium.range": "1K ~ 10K USDm",
  "cap.tier.medium.guidance":
    "30 일 본드를 메인으로, 14 일은 풀 깊이 안에서만 보조로 사용합니다. 7 일은 짧은 회전용입니다.",
  "cap.tier.large.label": "Large",
  "cap.tier.large.range": "10K USDm 이상",
  "cap.tier.large.guidance":
    "30 일과 7 일에 분산합니다. 14 일은 풀 깊이가 얕아 디스카운트 잠식 위험이 큽니다.",
  "cap.bondLabel": "{n}일 본드",
  "cap.recommendation.fits":
    "{days} 일 본드의 풀 ({tvl}) 깊이 안에서 디스카운트 {pct}퍼센트가 보전되는 사이즈입니다.",
  "cap.recommendation.over":
    "자본이 모든 본드의 권장 max 를 초과합니다. 가장 깊은 풀인 {days} 일 본드로 분산하거나 여러 본드에 나누어 진입하세요.",
};

const en: Dict = {
  // nav / header / footer
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
  "footer.about":
    "A reserve-backed treasury on MegaETH. It runs on bonds, lockups, BAM, and POL combined.",

  // home hero
  "home.hero.live": "Live",
  "home.hero.title": "Blackhaven Live",
  "home.hero.subtitle": "RBT market price, NAV, and fair value.",

  // about hero
  "about.hero.title": "What is Blackhaven",
  "about.hero.subtitle": "A reserve-backed treasury on MegaETH.",
  "about.meta.chain": "Chain",
  "about.meta.backing": "Backing",
  "about.meta.audit": "Audit",
  "about.flow.eyebrow": "Flow",
  "about.flow.heading": "How funds flow",
  "about.flow.intro":
    "A diagram of how bonds, lockups, BAM, and POL interlock inside the treasury. Arrows show the direction USDm or RBT moves.",
  "about.flow.usdmIn.eyebrow": "USDm inflow",
  "about.flow.usdmIn.body":
    "User USDm flows through bonds and accumulates permanently in treasury and POL. 90% to treasury, 10% to ops.",
  "about.flow.rbtDist.eyebrow": "RBT distribution",
  "about.flow.rbtDist.body":
    "Bonds distribute RBT linearly to maturity. Locked RBT receives additional RBT distribution at maturity.",
  "about.flow.bam.eyebrow": "BAM price correction",
  "about.flow.bam.body":
    "When market price is above NAV, treasury sells RBT to recover USDm. When below, it buys RBT with USDm and burns it.",
  "about.mech.eyebrow": "Mechanics",
  "about.mech.heading": "The four levers",
  "about.mech.intro":
    "Bonds, lockups, BAM, and POL together drive Blackhaven. Which combination dominates per horizon defines the user play.",
  "about.mech.vsOhm": "vs OHM",
  "about.mech.diff": "Differences from OlympusDAO",
  "about.contracts.eyebrow": "Contracts",
  "about.contracts.heading": "Contract mapping",
  "about.contracts.intro":
    "Every Blackhaven contract deployed on MegaETH mainnet (chain id 4326). Mapped from the Zellic audit report and on-chain selector probing. Click an address to open the explorer; use the side button to copy.",
  "about.contracts.likelyNote":
    "Items marked likely are contracts whose selector responses do not match a standard interface, so a 1:1 match to audit-report component names is uncertain. Will be updated once verified metadata is public.",
  "about.contracts.likelyChip": "likely",
  "about.contracts.copyAria": "copy address",
  "about.contracts.tokens.eyebrow": "Tokens",
  "about.contracts.tokens.title": "Tokens",
  "about.contracts.tokens.desc":
    "RBT and sRBT are the two protocol-internal assets. USDm is an external stablecoin that serves as the unit of account for bond commits and NAV backing.",
  "about.contracts.core.eyebrow": "Core components",
  "about.contracts.core.title": "Core components",
  "about.contracts.core.desc":
    "The 7 components named in the Zellic audit and their adjacent contracts.",
  "about.contracts.bonds.eyebrow": "Bonds",
  "about.contracts.bonds.title": "Bond contracts",
  "about.contracts.bonds.desc":
    "Swap USDm for RBT at a discount. Linear vesting to maturity, with 90% of committed capital flowing to treasury and 10% to LiquidityManager.",
  "about.contracts.treasury.eyebrow": "Treasury & infra",
  "about.contracts.treasury.title": "Treasury and infrastructure",
  "about.contracts.treasury.desc":
    "Treasury that absorbs bond capital, external trading pool, and deploy-related EOAs and factory.",

  // playbook hero
  "playbook.hero.title": "Playbook",
  "playbook.hero.subtitle":
    "Hero plays per horizon, capital allocation, action sequence.",
  "playbook.hero.note":
    "This playbook follows the mechanism descriptions in docs.blackhaven.xyz. Detailed parameters like maturity curves and lock caps are all listed as governance-discretionary, so some wording leans on common OHM-style DeFi conventions. The options actually deployed in the app today are the 7/14/30-day bonds and the 2 to 52 week Commit slider; anything beyond that is flagged inline.",
  "forks.hero.stat.sample.label": "Sample",
  "forks.hero.stat.sample.value": "7 majors",
  "forks.hero.stat.survived.label": "Survival rate",
  "forks.hero.stat.survived.value": "2 / 7",
  "forks.hero.stat.drawdown.label": "Average drawdown",
  "forks.hero.stat.drawdown.value": "~ -98%",
  "playbook.section.eyebrow": "Playbook",
  "playbook.section.heading": "What plays are available to users",
  "playbook.section.intro":
    "Pick a horizon and the main play, secondary plays, capital allocation, weekly actions, and stop signals all line up on one screen.",
  "playbook.scenario.selected": "selected",
  "playbook.scenario.alpha": "{name} alpha",
  "playbook.section.extras": "Other plays",
  "play.bestApr": "Best-case APR",
  "play.aprNote": "Annualized, best case",
  "play.whyLabel": "Why this play is dominant right now. ",
  "play.steps": "Execution steps",
  "play.upside": "Upside",
  "play.downside": "Downside",
  "play.difficulty": "Difficulty {x}",
  "effort.easy": "Easy",
  "effort.moderate": "Moderate",
  "effort.hard": "Hard",
  "extras.expandSteps": "Expand execution steps",
  "extras.up": "Up",
  "extras.down": "Down",
  "alloc.eyebrow": "Capital allocation",
  "alloc.title": "Recommended capital allocation",
  "alloc.total": "Total 100%",
  "alloc.disclaimer":
    "Adjust to your own liquidity and risk tolerance. Locked capital is hard to recover before maturity, so only allocate capital you genuinely will not need.",
  "week.eyebrow": "Action sequence",
  "week.title": "Weekly action sequence",
  "stop.eyebrow": "Stop signals",
  "stop.title": "If you see these signals, stop the play",
  "tag.bond": "Bond",
  "tag.commit": "Commit",
  "tag.trade": "Trade",
  "tag.claim": "Claim",
  "tag.watch": "Watch",

  // forks hero
  "forks.hero.title": "OHM forks",
  "forks.hero.subtitle":
    "Most forks collapsed within a year of their 2021 launch.",
  "forks.timeline.eyebrow": "Timeline",
  "forks.timeline.heading": "From launch to ending",
  "forks.timeline.intro":
    "Most forks broke in Q1 2022, less than a year after launching in 2021. The few survivors are pivots more than mechanism wins.",
  "forks.timeline.peak": "Peak",
  "forks.timeline.afterFinal": "2024 onward",
  "forks.cards.eyebrow": "Project files",
  "forks.cards.heading": "Per-project case files",
  "forks.cards.intro":
    "Click headers to sort. Click a row to open the normalized curve and detail.",
  "forks.cards.col.ticker": "Ticker",
  "forks.cards.col.chain": "Chain",
  "forks.cards.col.status": "Status",
  "forks.cards.col.launch": "Launch",
  "forks.cards.col.toPeak": "to Peak",
  "forks.cards.col.peak": "Peak",
  "forks.cards.col.recent": "Recent",
  "forks.cards.col.vsLaunch": "vs Launch",
  "forks.cards.col.vsPeak": "vs Peak",
  "forks.cards.curve": "Normalized price curve",
  "forks.cards.launchPrice": "Launch",
  "forks.cards.peakPrice": "Peak",
  "forks.cards.recentPrice": "Recent",
  "forks.cards.peakAtDays": "{date}, {n}d",
  "forks.cards.hook": "Hook",
  "forks.cards.whyItGrew": "Why it grew",
  "forks.cards.whyItBroke": "Why it broke",
  "forks.cards.ending": "Ending",
  "forks.cards.aliveNote": "Note",
  "forks.cards.aliveBody":
    "Alive cohort is down {peak} from peak but {launch} versus launch. The average user entry sits somewhere between the two.",
  "forks.patterns.eyebrow": "Common failure modes",
  "forks.patterns.heading": "Seven common failure patterns",
  "forks.patterns.intro":
    "Each fork broke for slightly different reasons, but almost all hit two or three of these seven at the same time.",
  "forks.patterns.examples": "Real cases",
  "forks.lessons.eyebrow": "What Blackhaven does differently",
  "forks.lessons.heading":
    "What Blackhaven does differently from these failures",
  "forks.lessons.intro":
    "Every item below is a real mechanism documented on docs.blackhaven.xyz. Not marketing, but design implemented in contracts and the TOS.",
  "forks.lessons.col.pattern": "Blocks",
  "forks.lessons.col.mechanism": "Blackhaven mechanism",
  "forks.lessons.col.why": "Why it blocks the failure",
  "forks.lessons.bottom": "Bottom line",
  "forks.lessons.bottomBody.before":
    "OHM's mechanism itself defended user capital down to backing. What broke was not the mechanism but ",
  "forks.lessons.bottomBody.bold":
    "the game-theory shell, runaway inflation, the asset-and-governance combo, and people risk",
  "forks.lessons.bottomBody.after":
    ". Blackhaven strips those shells one by one and keeps only the core (treasury, bonds, POL), structurally reducing the incentive to enter far above backing.",
  "forks.crosslink.eyebrow": "Next page",
  "forks.crosslink.title": "So what should you actually play on Blackhaven?",
  "forks.crosslink.desc":
    "Goes to the main plays per horizon (early, near-term, mid), capital allocation, and the action sequence.",
  "forks.priceCurve.heading": "Monthly price curve from launch",
  "forks.priceCurve.intro":
    "Each token's peak price is normalized to 100, with monthly closes from launch plotted as percent of peak. X-axis is months from launch, Y-axis is percent of peak. The diamond marks each token's peak, and time to peak differs per token.",
  "forks.priceCurve.disclaimer":
    "Monthly closes are approximations based on CoinGecko and CMC public data, and may differ from intraday prices.",
  "forks.priceCurve.peakMarker": "peak",
  "forks.priceCurve.toPeak": "peak in {n}m",

  // risks hero
  "risks.hero.title": "Risks",
  "risks.hero.subtitle":
    "Audit findings, protocol risks, and user entry scenarios.",
  "risks.hero.findings": "Audit findings",
  "risks.hero.medium": "Medium severity",
  "risks.hero.criticalHigh": "Critical or High",
  "risks.hero.fixed": "Fixed",

  // risks audit
  "risks.audit.eyebrow": "Audit, Zellic 2026-01",
  "risks.audit.heading": "11 audit findings",
  "risks.audit.intro":
    "Every finding from the Zellic report (Jan 19, 2026). No Critical or High severity issues. 3 Medium, 2 Low, and 6 Informational. Click a row to expand.",
  "risks.audit.summary": "Description",
  "risks.audit.statusLabel": "Status",
  "risks.audit.status.fixed": "Fixed",
  "risks.audit.status.acknowledged": "Acknowledged",
  "risks.audit.commit": "commit",
  "risks.audit.category": "Category",

  // risks protocol
  "risks.protocol.eyebrow": "Protocol risks",
  "risks.protocol.heading": "Protocol risks",
  "risks.protocol.intro":
    "Protocol-level risks listed on docs.blackhaven.xyz, with the mitigations in place.",
  "risks.protocol.mitigations": "Mitigations",

  // risks user scenarios
  "risks.user.eyebrow": "User scenarios",
  "risks.user.heading": "User entry risk scenarios",
  "risks.user.intro":
    "Concrete scenarios where user capital can shrink even when the protocol works as designed, and the guardrails for each.",
  "risks.user.trigger": "Trigger",
  "risks.user.outcome": "Outcome",
  "risks.user.guard": "Guardrail",

  // risks footer cross-link
  "risks.footer.systemic.eyebrow": "Systemic risk",
  "risks.footer.systemic.title": "Seven systemic risk patterns of OHM forks",
  "risks.footer.systemic.desc":
    "Goes to the page summarizing the OHM-fork failure patterns ((3,3) Schelling break, price runs detached from backing, runaway inflation) and what Blackhaven does differently.",
  "risks.footer.playbook.eyebrow": "Response play",
  "risks.footer.playbook.title": "User playbook by horizon",
  "risks.footer.playbook.desc":
    "Goes to the concrete plays, capital allocation, and stop signals that match each risk.",
  "risks.footer.notice":
    "This page summarizes Zellic's public report and the Risks section of docs.blackhaven.xyz. It is not a final recommendation. Please verify the docs, the original report, and the current contract state directly before allocating capital.",

  // common
  "common.copy": "copy",
  "common.copied": "copied",
  "common.live": "live",
  "common.static": "static",
  "common.stale": "stale",
  "common.fixed": "fixed",
  "common.acknowledged": "ack",
  "common.updated": "updated",

  // live snapshot
  "live.title": "Live snapshot",
  "live.lastUpdated": "last updated",
  "live.loading": "loading",
  "live.polling": "Live, 1s polling",
  "live.stale": "Live, stale",
  "live.market.label": "RBT Market Price",
  "live.nav.label": "NAV",
  "live.premium.label": "Premium",
  "live.premium.multipleOfNAV": "{x}× NAV",
  "live.liquidity": "Liquidity",
  "live.volume24": "Volume 24h",
  "live.pool": "Pool",
  "live.supply": "Supply",
  "live.supply.sub": "circulating, total",
  "live.bondPools": "Bond pools",
  "live.bond.dayLabel": "{n}-day bond",
  "live.bond.recommendedMax": "rec. max",
  "live.stake.tvl": "Stake TVL",
  "live.stake.staked": "{n} RBT staked",
  "live.commit.tvl": "Commit TVL",
  "live.commit.locked": "{n} sRBT locked",
  "live.commit.noCommits": "no commits",
  "live.commit.reward": "Commit 24w reward",
  "live.commit.pool": "pool {n} RBT",
  "live.txns24": "TXNS 24h",
  "live.disclaimer.bond":
    "Bond pools, Stake, and Commit are all onchain live. Recommended max per bond is 5% of pool depth. Beyond that, the discount is eaten quickly, and shallow tier (TVL ≤ $50K) pools are inefficient for anything but small capital.",
  "live.signals": "Signals",
  "live.priority": "Live priority plays",
  "live.source.onchain": "onchain",
  "live.source.staticManual": "static, manual sync",

  // verdict labels
  "verdict.undervalued.label": "Undervalued",
  "verdict.undervalued.detail":
    "Market is below NAV. BAM buy window is open and the asymmetric entry zone is active.",
  "verdict.fair.label": "Fair",
  "verdict.fair.detail":
    "Below Yield-adjusted Fair. Spot buying without a bond is reasonable here.",
  "verdict.bondOnly.label": "Bond only",
  "verdict.bondOnly.detail":
    "Below Bond Effective. Going through a bond is more efficient than buying spot.",
  "verdict.overvalued.label": "Overvalued",
  "verdict.overvalued.detail":
    "Above Bond Effective. Even bonds are inefficient, wait for the next round.",

  // market dynamics
  "md.title": "Market Dynamics",
  "md.heading": "What needs to move for RBT to go up",
  "md.intro":
    "Price decomposes into NAV × Premium multiple. Four drivers (NAV pump, sell pressure, lock ratio, bond maturity wave) refresh every second.",
  "md.outlook.bullish": "Upside",
  "md.outlook.balanced": "Balanced",
  "md.outlook.bearish": "Downside",
  "md.outlook.bullish.summary":
    "NAV is filling fast, buy pressure dominates, and lock ratio supports it. Premium holds while market price rises with NAV in absolute terms.",
  "md.outlook.balanced.summary":
    "NAV catch-up and sell pressure are balanced. BAM oscillates price at a fixed multiple above NAV. The next big move depends on exogenous triggers like Stake/Commit lock growth or external listings.",
  "md.outlook.bearish.summary":
    "NAV pump pace is weak, with sell pressure dominating or a bond maturity wave imminent. Premium can compress quickly toward NAV.",
  "md.diagnosis": "Diagnosis",
  "md.signals.navPump": "NAV Pump",
  "md.signals.flow": "Buy / Sell Pressure",
  "md.signals.lock": "Lock Ratio",
  "md.signals.wave": "Bond Maturity Wave",
  "md.strength.strong": "Strong",
  "md.strength.moderate": "Moderate",
  "md.strength.weak": "Weak",
  "md.flow.buyDominant": "Buy dominant",
  "md.flow.balanced": "Balanced",
  "md.flow.sellDominant": "Sell dominant",
  "md.lock.expanding": "Expanding",
  "md.lock.early": "Early growth",
  "md.lock.low": "Low",
  "md.wave.large": "Large wave possible",
  "md.wave.medium": "Medium",
  "md.wave.small": "Small",
  "md.triggers.heading": "Upside trigger checklist",
  "md.triggers.stake": "Stake TVL crosses 5% of FDV",
  "md.triggers.stake.detail":
    "Sellable RBT supply shrinks → Premium stabilizes",
  "md.triggers.bondTotal": "Bond pool total reaches $400K+",
  "md.triggers.bondTotal.detail":
    "NAV pump accelerates, treasury growth becomes clear",
  "md.triggers.flow":
    "Buy/Sell ratio above 1.2 with sustained positive 1h flow",
  "md.triggers.flow.detail":
    "External demand inflow or new listing cycle starts",
  "md.triggers.external":
    "RBT listed as collateral on external lending or perps",
  "md.triggers.external.detail": "Demand diversification buoys Premium",
  "md.disclaimer":
    "NAV itself is a static fallback (manually synced from the app's Metrics page), so the slow NAV-fill trend is not directly measured here. Signals are inferred from onchain bond balances, dexscreener live data, and static Stake TVL.",
  "md.signal.navPump.strong":
    "Premium is high while bond inflow is fast. BAM-side selling and new bonds are filling reserves quickly together.",
  "md.signal.navPump.moderate":
    "Meaningful capital is accumulating in bond pools. NAV is catching up steadily.",
  "md.signal.navPump.weak":
    "Bond inflow has slowed. NAV catch-up pace is weakening.",

  // fair value
  "fv.title": "Fair Value",
  "fv.layerModel": "4-layer model",
  "fv.heading": "What is RBT's fair value",
  "fv.intro":
    "Not a single right price, but four price layers. Each layer is a different kind of fair, derived from different assumptions.",
  "fv.intro.boldSegment": "four price layers",
  "fv.layer.floor": "Floor (NAV)",
  "fv.layer.floor.desc":
    "Reserves per RBT. If market price falls below this, BAM defends with buybacks and burns. The absolute floor.",
  "fv.layer.yieldFair": "Yield-adjusted Fair",
  "fv.layer.bondEffective": "Bond Effective",
  "fv.layer.market": "Market",
  "fv.layer.market.desc": "Current RBT/USDm market price.",
  "fv.forwardYield": "Forward yield",
  "fv.reflexivity": "Reflexivity",
  "fv.reflexivity.tooltip":
    "Discount for the chance OHM-style game theory Schelling breaks",
  "fv.entryConclusion": "User entry conclusion",
  "fv.entryConclusion.floor": "NAV {x}, the absolute floor.",
  "fv.entryConclusion.fair":
    "Yield-adjusted {x}, the reasonable upper bound for entry.",
  "fv.entryConclusion.bond": "Effective {x}, the last line for spot entry.",
  "fv.entryConclusion.market": "{x}, {ratio}× NAV.",
  "fv.priceZones": "Where you enter matters",
  "fv.zone.belowFloor":
    "Below Floor: BAM buy window is open and asymmetry is at its largest.",
  "fv.zone.floorToFair":
    "Between Floor and Yield-fair: spot buying without a bond is fine.",
  "fv.zone.fairToBond":
    "Between Yield-fair and Bond Effective: enter only through a bond.",
  "fv.zone.bondToMarket":
    "Between Bond Effective and Market: pass and wait for the next round.",
  "fv.reflex.title": "Reflexivity discount",
  "fv.reflex.factor": "{x} cut from forward yield",
  "fv.reflex.body":
    "OHM-style game theory flipped to a death spiral the moment (3,3) Schelling broke, sells begat sells. Blackhaven structurally softens this with BAM's automatic two-sided arbitrage, but user behavior uncertainty remains. The reflexivity discount is a conservative cut to forward yield to price that uncertainty in. NAV (Floor) is unaffected since treasury backing supports it.",
  "fv.assumptions": "Assumptions used",
  "fv.assumption.forwardYield": "Forward yield",
  "fv.assumption.reflexivity": "Reflexivity",
  "fv.assumption.maxBondDiscount": "Max bond discount",
  "fv.assumption.protocolFee": "Protocol fee",
  "fv.assumption.maxBondDiscount.bondLabel": "30-day bond",
  "fv.assumption.protocolFee.phaseLabel": "Genesis Phase 1",
  "fv.assumption.lastUpdated": "last updated",
  "fv.assumptions.body":
    "Live metrics: Reserves per RBT, Circulating, Market, Stake TVL. Forward yield is computed as a weighted sum of stake APR and annualized commit, refreshable via onchain or attestation.",
  "fv.entryConclusion.floor.label": "Floor",
  "fv.entryConclusion.fair.label": "Fair",
  "fv.entryConclusion.bond.label": "Bond",
  "fv.entryConclusion.market.label": "Market",
  "fv.times": "×",

  // capital guide
  "cap.eyebrow": "Capital sizing",
  "cap.heading": "Match your capital to bond pool depth",
  "cap.intro":
    "5% of bond pool depth (TVL) is the recommended max. Beyond that, the discount gets eaten quickly. Enter your capital and the live bond data picks the right tenor.",
  "cap.input": "Entry capital",
  "cap.fits": "fits",
  "cap.tight": "tight",
  "cap.over": "over",
  "cap.recommendedPick": "Recommended",
  "cap.recommended": "Recommendation",
  "cap.tier.small.label": "Small",
  "cap.tier.small.range": "Up to 1K USDm",
  "cap.tier.small.guidance":
    "Any tenor works freely. The 14-day bond's 10% discount is an underrated option at this size.",
  "cap.tier.medium.label": "Medium",
  "cap.tier.medium.range": "1K ~ 10K USDm",
  "cap.tier.medium.guidance":
    "Use the 30-day bond as your main; the 14-day only as backup within pool depth. The 7-day is for short rotations.",
  "cap.tier.large.label": "Large",
  "cap.tier.large.range": "10K USDm and above",
  "cap.tier.large.guidance":
    "Split between 30-day and 7-day. The 14-day pool is too shallow, so discount erosion risk is high.",
  "cap.bondLabel": "{n}-day bond",
  "cap.recommendation.fits":
    "Sized to keep the {pct}% discount intact within the {days}-day bond's pool depth ({tvl}).",
  "cap.recommendation.over":
    "Capital exceeds the recommended max for every bond. Spread into the deepest pool ({days}-day) or split across multiple bonds.",
};

export const DICTIONARIES: Record<Locale, Dict> = { ko, en };

export type TKey = keyof typeof ko;

export function t(locale: Locale, key: string): string {
  return DICTIONARIES[locale][key] ?? DICTIONARIES.ko[key] ?? key;
}
