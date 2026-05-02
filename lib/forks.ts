// OlympusDAO와 그 메이저 포크들의 운명.
// 정점 가격은 CMC와 CoinGecko 기준의 근사치이며, 결말은 공개 자료를 기준으로 정리했습니다.

import type { LocaleString } from "@/lib/i18n";

export type ForkStatus =
  | "alive"
  | "alive-pivoted"
  | "moribund"
  | "wound-down"
  | "abandoned"
  | "rugged";

export const STATUS_TONE: Record<ForkStatus, { label: string; color: string }> =
  {
    alive: { label: "Alive", color: "#3DDC97" },
    "alive-pivoted": { label: "Alive, Pivoted", color: "#C9CDD4" },
    moribund: { label: "Moribund", color: "#F4C756" },
    "wound-down": { label: "Wound-down", color: "#9AA0AB" },
    abandoned: { label: "Abandoned", color: "#FF6A4A" },
    rugged: { label: "Rugged", color: "#FF6A4A" },
  };

// 출시에서 정점까지 걸린 개월 수 계산
export function monthsToPeak(launched: string, peakDate: string): number {
  const [ly, lm] = launched.split("-").map(Number);
  const [py, pm] = peakDate.split("-").map(Number);
  return (py - ly) * 12 + (pm - lm);
}

// 출시 가격 대비 현재 가격 변화율
export function priceChangeFromLaunch(fork: Fork): number {
  return (fork.recentPriceUSD - fork.launchPriceUSD) / fork.launchPriceUSD;
}

// 정규화된 곡선. 출시(0d) → 정점 → 36개월 까지의 가격 궤적입니다.
export function normalizedCurve(
  peakDays: number,
  recentUSD: number,
  peakUSD: number,
  launchUSD: number,
): { x: number; y: number }[] {
  const recentY = Math.max(0.4, (recentUSD / peakUSD) * 100);
  const launchY = Math.max(0.4, Math.min(100, (launchUSD / peakUSD) * 100));

  const points: { x: number; y: number }[] = [];

  const preSamples = Math.max(6, Math.min(12, Math.ceil(peakDays / 7)));
  for (let i = 0; i <= preSamples; i++) {
    const t = i / preSamples;
    const x = peakDays * t;
    const y = launchY + (100 - launchY) * Math.pow(t, 1.6);
    points.push({ x, y });
  }

  const postMilestones = [
    { x: peakDays + 30, factor: 0.65 },
    { x: peakDays + 60, factor: 0.45 },
    { x: peakDays + 90, factor: 0.32 },
    { x: peakDays + 180, factor: 0.2 },
    { x: peakDays + 365, factor: 0.12 },
    { x: peakDays + 730, factor: 0.06 },
  ];
  for (const m of postMilestones) {
    const baselineY = Math.max(recentY, 100 * m.factor);
    points.push({ x: m.x, y: baselineY });
  }
  points.push({ x: 36 * 30, y: recentY });

  return points;
}

export type Fork = {
  id: string;
  ticker: string;
  name: string;
  chain: string;
  launched: string;
  peakDate: string;
  peakPrice: LocaleString;
  peakPriceUSD: number;
  launchPriceUSD: number;
  recentPriceUSD: number;
  drawdown: LocaleString;
  status: ForkStatus;
  hook: LocaleString;
  whyItGrew: LocaleString;
  whyItBroke: LocaleString;
  ending: LocaleString;
  signature?: LocaleString;
};

export const FORKS: Fork[] = [
  {
    id: "ohm",
    ticker: "OHM",
    name: "OlympusDAO",
    chain: "Ethereum",
    launched: "2021-03",
    peakDate: "2021-04",
    peakPrice: { ko: "약 $1,330", en: "~$1,330" },
    peakPriceUSD: 1330,
    launchPriceUSD: 4,
    recentPriceUSD: 19,
    drawdown: {
      ko: "정점 대비 약 98퍼센트 하락",
      en: "~98% drawdown from peak",
    },
    status: "alive",
    hook: {
      ko: "본드와 (3,3) staking, DAO treasury 패러다임을 만든 원조 프로토콜입니다.",
      en: "The original protocol that created the bond, (3,3) staking, and DAO treasury paradigm.",
    },
    whyItGrew: {
      ko: "고APY rebase, DAO treasury, (3,3) 셸링이 결합되어 6개월 만에 트레저리가 $4B 이상에 도달했습니다. 디파이 시즌 2의 상징이 되었습니다.",
      en: "High-APY rebase, DAO treasury, and (3,3) Schelling combined to push the treasury past $4B in six months. Became the symbol of DeFi Summer 2.",
    },
    whyItBroke: {
      ko: "(3,3)은 모두가 stake한다는 가정 위에 서있었습니다. 매도 한 번이 dilution 가속을 트리거하면서 데스 스파이럴이 시작되었고, 시장가가 RFV 위 100배에서 시작해 RFV 근처까지 98퍼센트 직행했습니다.",
      en: "(3,3) rested on the assumption that everyone stakes. A single sell triggered accelerated dilution, the death spiral started, and price went from 100× RFV down to near RFV, dropping 98%.",
    },
    ending: {
      ko: "프로토콜은 살아남았습니다. V2와 gOHM으로 전환했고, 트레저리는 여전히 가치를 보유하고 있습니다. 토큰 가격은 RFV 부근에서 안정화되었습니다.",
      en: "The protocol survived. Transitioned to V2 and gOHM, the treasury still holds value, and the token price stabilized near RFV.",
    },
    signature: {
      ko: "RFV 부근에서 결국 backing이 받쳐주었습니다. 메커니즘 자체는 유효했고, 시장가만 비합리적인 수준에서 시작했을 뿐입니다.",
      en: "Backing eventually held at RFV. The mechanism itself worked, the market price simply started at an irrational level.",
    },
  },
  {
    id: "time",
    ticker: "TIME",
    name: "Wonderland",
    chain: "Avalanche",
    launched: "2021-09",
    peakDate: "2021-11",
    peakPrice: { ko: "약 $10,000", en: "~$10,000" },
    peakPriceUSD: 10000,
    launchPriceUSD: 130,
    recentPriceUSD: 5,
    drawdown: {
      ko: "정점 대비 99퍼센트 이상 하락",
      en: "Over 99% drawdown from peak",
    },
    status: "rugged",
    hook: {
      ko: "Avalanche의 첫 OHM 포크입니다. Daniele Sestagalli의 후광으로 폭발적으로 성장했습니다.",
      en: "Avalanche's first OHM fork. Grew explosively on Daniele Sestagalli's halo.",
    },
    whyItGrew: {
      ko: "OHM 메커니즘에 AVAX 시즌과 카리스마 있는 리더십이 결합되었습니다. TVL이 $1.5B에 도달했고, 한때 시가총액이 OHM보다 컸습니다.",
      en: "OHM mechanism combined with the AVAX season and charismatic leadership. TVL reached $1.5B, and at one point market cap exceeded OHM's.",
    },
    whyItBroke: {
      ko: "2022년 1월, 트레저리 운영자였던 0xSifu가 QuadrigaCX 공동창립자 Michael Patryn 임이 폭로되었습니다. 신뢰가 붕괴되며 거버넌스 청산 표결로 이어졌고, 사실상 종료되었습니다.",
      en: "In January 2022, treasury operator 0xSifu was revealed to be QuadrigaCX co-founder Michael Patryn. Trust collapsed, a governance liquidation vote followed, and operations effectively ended.",
    },
    ending: {
      ko: "트레저리 청산 표결이 통과되며 운영이 사실상 중단되었습니다. OHM 포크 시즌의 가장 유명한 사망 사례입니다.",
      en: "Treasury liquidation vote passed, operations effectively halted. The most famous death case of the OHM-fork season.",
    },
    signature: {
      ko: "메커니즘은 작동했지만 결국 사람이 문제였습니다. 디파이의 신뢰 가정이 무엇을 의미하는지 보여주는 사례입니다.",
      en: "The mechanism worked, but people were the problem. A case study in what DeFi's trust assumptions actually mean.",
    },
  },
  {
    id: "klima",
    ticker: "KLIMA",
    name: "Klima DAO",
    chain: "Polygon",
    launched: "2021-10",
    peakDate: "2021-10",
    peakPrice: { ko: "약 $3,700", en: "~$3,700" },
    peakPriceUSD: 3700,
    launchPriceUSD: 70,
    recentPriceUSD: 1.5,
    drawdown: {
      ko: "정점 대비 99퍼센트 이상 하락",
      en: "Over 99% drawdown from peak",
    },
    status: "moribund",
    hook: {
      ko: "탄소 크레딧(BCT, MCO2) 백킹을 채택하여 기후 보호 내러티브로 차별화했습니다.",
      en: "Adopted carbon credit (BCT, MCO2) backing to differentiate on a climate-protection narrative.",
    },
    whyItGrew: {
      ko: "ESG 내러티브와 OHM 게임이론이 결합되었습니다. 탄소 가격이 오를수록 KLIMA가 오른다는 스토리가 통했습니다.",
      en: "ESG narrative combined with OHM game theory. The story that KLIMA rises as carbon prices rise resonated.",
    },
    whyItBroke: {
      ko: "백킹 자산인 토큰화 탄소 크레딧 자체의 유동성과 신뢰성이 약했습니다. 실제 카본 마켓이 OHM 게임이론의 속도를 따라가지 못해 backing이 무너졌고, 일반적인 OHM 데스 사이클이 겹쳐졌습니다.",
      en: "The tokenized carbon credit backing asset itself had weak liquidity and credibility. Real carbon markets could not keep up with the pace of OHM game theory, so backing fell apart on top of the standard OHM death cycle.",
    },
    ending: {
      ko: "운영은 유지되지만 거래량과 활동이 거의 없습니다. 카테고리 자체가 거의 사망 상태입니다.",
      en: "Operations continue but with almost no volume or activity. The category itself is essentially dead.",
    },
    signature: {
      ko: "내러티브가 좋아도 백킹 자산이 약하면 메커니즘이 작동하지 않습니다.",
      en: "Even with a strong narrative, the mechanism cannot work if the backing asset is weak.",
    },
  },
  {
    id: "hec",
    ticker: "HEC",
    name: "Hector Network",
    chain: "Fantom",
    launched: "2021-09",
    peakDate: "2021-12",
    peakPrice: { ko: "약 $155", en: "~$155" },
    peakPriceUSD: 155,
    launchPriceUSD: 6,
    recentPriceUSD: 0.4,
    drawdown: {
      ko: "정점 대비 약 99퍼센트 하락",
      en: "~99% drawdown from peak",
    },
    status: "wound-down",
    hook: {
      ko: "Fantom 생태계 통합과 derivatives, launchpad, 스테이블코인까지 시도한 확장형 포크입니다.",
      en: "An expansion-style fork that tried to integrate the Fantom ecosystem, plus derivatives, a launchpad, and even a stablecoin.",
    },
    whyItGrew: {
      ko: "Fantom 시즌의 주력 OHM 포크였습니다. 빠른 확장 시도로 한때 Fantom TVL 상위에 올랐습니다.",
      en: "The flagship OHM fork of the Fantom season. Aggressive expansion briefly took it to the top of Fantom TVL.",
    },
    whyItBroke: {
      ko: "확장이 흩어지면서 핵심 메커니즘은 OHM과 동일하게 무너졌습니다. 2023년 거버넌스가 wind-down을 결정했습니다.",
      en: "Expansion scattered focus, and the core mechanism broke in the same way as OHM. Governance voted to wind down in 2023.",
    },
    ending: {
      ko: "트레저리 잔여 자산을 토큰홀더에 redemption 형태로 분배한 뒤 정식 종료했습니다. OHM 포크 중 드물게 질서있는 종료 사례입니다.",
      en: "Distributed remaining treasury assets to holders as redemptions, then formally closed. A rare orderly shutdown among OHM forks.",
    },
    signature: {
      ko: "메커니즘이 깨졌을 때 어떻게 마무리하는지의 모범 사례입니다. 그래도 사용자 평균 진입가의 회수에는 미치지 못했습니다.",
      en: "A model for how to wind down when the mechanism breaks. Still, recovery did not reach the average user entry price.",
    },
  },
  {
    id: "btrfly",
    ticker: "BTRFLY",
    name: "Redacted Cartel",
    chain: "Ethereum",
    launched: "2021-12",
    peakDate: "2022-01",
    peakPrice: { ko: "약 $3,500", en: "~$3,500" },
    peakPriceUSD: 3500,
    launchPriceUSD: 1500,
    recentPriceUSD: 180,
    drawdown: {
      ko: "정점 대비 약 95퍼센트 하락",
      en: "~95% drawdown from peak",
    },
    status: "alive-pivoted",
    hook: {
      ko: "OHM 포크에서 시작했지만 Curve와 Convex의 메타거버넌스 어그리게이터로 피벗했습니다.",
      en: "Started as an OHM fork but pivoted to a meta-governance aggregator on Curve and Convex.",
    },
    whyItGrew: {
      ko: "OHM 게임이론에 Curve Wars 시즌의 bribe 어그리게이터 포지션이 결합되었습니다.",
      en: "OHM game theory paired with a bribe-aggregator position in the Curve Wars season.",
    },
    whyItBroke: {
      ko: "OHM 메커니즘으로는 결국 같은 사이클을 맞이했습니다. V1 토큰은 95퍼센트 하락했습니다.",
      en: "Under the OHM mechanism it hit the same cycle eventually. The V1 token dropped 95%.",
    },
    ending: {
      ko: "V2(rlBTRFLY)로 전환하면서 OHM 게임이론을 버리고 Convex와 Curve의 메타거버넌스 인프라로 카테고리를 변경했습니다. 살아남았습니다.",
      en: "Migrated to V2 (rlBTRFLY), abandoned OHM game theory, and changed category to Convex/Curve meta-governance infrastructure. Survived.",
    },
    signature: {
      ko: "OHM 포크였다는 사실보다 피벗에 성공한 OHM 포크로 기억됩니다. 거의 유일한 케이스입니다.",
      en: "Remembered less as an OHM fork and more as an OHM fork that successfully pivoted. Almost the only case.",
    },
  },
  {
    id: "snowbank",
    ticker: "SB",
    name: "Snowbank",
    chain: "Avalanche",
    launched: "2021-09",
    peakDate: "2021-11",
    peakPrice: { ko: "약 $1,500", en: "~$1,500" },
    peakPriceUSD: 1500,
    launchPriceUSD: 80,
    recentPriceUSD: 1,
    drawdown: {
      ko: "정점 대비 99퍼센트 이상 하락",
      en: "Over 99% drawdown from peak",
    },
    status: "abandoned",
    hook: {
      ko: "Avalanche의 두 번째 메이저 OHM 포크입니다.",
      en: "Avalanche's second major OHM fork.",
    },
    whyItGrew: {
      ko: "OHM 메커니즘 카피와 AVAX 시즌의 빠른 자금 유입이 결합되었습니다.",
      en: "Carbon-copy of OHM mechanism plus the AVAX season's fast capital inflow.",
    },
    whyItBroke: {
      ko: "차별점이 거의 없었습니다. 게임이론 셸링이 흔들리자 가장 먼저 무너졌습니다.",
      en: "Almost no differentiation. Was the first to break when game-theory Schelling wavered.",
    },
    ending: {
      ko: "거버넌스 활동이 정지되며 사실상 방치되었습니다.",
      en: "Governance activity halted and the project was effectively abandoned.",
    },
  },
  {
    id: "fhm",
    ticker: "FHM",
    name: "FantOHM",
    chain: "Fantom",
    launched: "2021-09",
    peakDate: "2021-11",
    peakPrice: { ko: "약 $60", en: "~$60" },
    peakPriceUSD: 60,
    launchPriceUSD: 3,
    recentPriceUSD: 0.05,
    drawdown: {
      ko: "정점 대비 99퍼센트 이상 하락",
      en: "Over 99% drawdown from peak",
    },
    status: "abandoned",
    hook: {
      ko: "Fantom의 OHM 카피캣 포크입니다.",
      en: "A Fantom-side OHM copycat fork.",
    },
    whyItGrew: {
      ko: "Fantom 시즌과 OHM 메커니즘이 결합되었습니다.",
      en: "Fantom season combined with the OHM mechanism.",
    },
    whyItBroke: {
      ko: "차별점이 없었고 메커니즘만 카피했습니다.",
      en: "No differentiation, just a copy of the mechanism.",
    },
    ending: {
      ko: "사용자가 이탈했고 운영이 정지되었습니다.",
      en: "Users left and operations stopped.",
    },
  },
];

export type Pattern = {
  code: string;
  title: LocaleString;
  detail: LocaleString;
  examples: LocaleString[];
};

export const COMMON_PATTERNS: Pattern[] = [
  {
    code: "P1",
    title: {
      ko: "(3,3) 게임이론 폰지 구조",
      en: "(3,3) game-theory ponzi shape",
    },
    detail: {
      ko: "모두가 stake하면 모두 이긴다는 셸링 포인트입니다. 한 번의 큰 매도가 dilution 가속을 트리거하면 그 자체가 매도 트리거가 되어 데스 스파이럴이 시작됩니다.",
      en: "The Schelling point is that if everyone stakes, everyone wins. One large sell triggers accelerated dilution, which itself becomes the next sell trigger, starting the death spiral.",
    },
    examples: [
      { ko: "OHM 약 98퍼센트 하락", en: "OHM down ~98%" },
      { ko: "TIME 약 99퍼센트 하락", en: "TIME down ~99%" },
      { ko: "SB 약 99퍼센트 하락", en: "SB down ~99%" },
    ],
  },
  {
    code: "P2",
    title: {
      ko: "백킹과 무관한 가격 폭주",
      en: "Price runs detached from backing",
    },
    detail: {
      ko: "시장가가 backing 위 50에서 100배에서 시작하여 결국 backing 부근까지 직행합니다. 백킹은 받쳐주었지만 사용자 평균 진입가는 훨씬 위에 있어 사용자 입장에서는 99퍼센트 손실로 끝납니다.",
      en: "Market starts 50 to 100× above backing and goes straight to near-backing. Backing held, but the average user entry sat far higher, so users still ended up with 99% losses.",
    },
    examples: [
      {
        ko: "OHM 정점 $1,330 vs RFV 약 $50",
        en: "OHM peak $1,330 vs RFV ~$50",
      },
      { ko: "TIME 정점 $10,000", en: "TIME peak $10,000" },
    ],
  },
  {
    code: "P3",
    title: { ko: "무한 rebase 인플레이션", en: "Unbounded rebase inflation" },
    detail: {
      ko: "APY 7,000퍼센트 이상을 유지하려면 발행이 폭주합니다. 가격이 인플레이션 속도를 따라가지 못하는 순간 실질 수익률이 음수로 전환됩니다.",
      en: "Sustaining 7,000%+ APY requires runaway issuance. The moment price stops keeping up with inflation, real return turns negative.",
    },
    examples: [
      {
        ko: "대부분의 OHM 포크가 셸링이 깨지자 모든 stake가 매도 압력으로 전환되었습니다",
        en: "In most OHM forks, every stake flipped into sell pressure once Schelling broke",
      },
    ],
  },
  {
    code: "P4",
    title: {
      ko: "토큰이 자산과 거버넌스를 겸하는 구조",
      en: "One token doubles as asset and governance",
    },
    detail: {
      ko: "OHM 하나가 트레저리 자산이자 거버넌스 토큰을 겸했습니다. 신뢰가 무너지면 둘 다 0이 되며, 거버넌스 결정으로 자산을 보호할 인센티브도 사라집니다.",
      en: "OHM was both treasury asset and governance token. If trust collapses, both go to zero, and the incentive to use governance to protect the asset disappears as well.",
    },
    examples: [
      {
        ko: "OHM, TIME, HEC 모두 토큰 하나에 결합되어 있었습니다",
        en: "OHM, TIME, and HEC all bundled both into a single token",
      },
    ],
  },
  {
    code: "P5",
    title: { ko: "변동성 큰 백킹 자산", en: "Volatile backing assets" },
    detail: {
      ko: "ETH, AVAX, MATIC, 탄소 크레딧 같은 백킹 자산이 시장 사이클과 함께 폭락하면 backing 자체가 무너져 하한선이 되지 못합니다.",
      en: "When backing assets like ETH, AVAX, MATIC, or carbon credits crash with the market cycle, backing itself collapses and stops acting as a floor.",
    },
    examples: [
      {
        ko: "KLIMA 의 탄소 크레딧 유동성 부족",
        en: "KLIMA's carbon credit liquidity gap",
      },
      {
        ko: "HEC 가 FTM 사이클과 동행 폭락",
        en: "HEC dropped together with the FTM cycle",
      },
    ],
  },
  {
    code: "P6",
    title: {
      ko: "Inverse bond 도입이 늦었습니다",
      en: "Inverse bonds came too late",
    },
    detail: {
      ko: "백킹 아래에서 매수하여 burn하는 메커니즘이 OHM 에서는 사이클 후반에 수동으로 도입되었습니다. 자동, 실시간 작동이 없어 시장가 폭주를 막지 못했습니다.",
      en: "OHM only introduced the buy-and-burn-below-backing mechanism manually, late in the cycle. With no automatic, real-time operation, it could not stop the price runup.",
    },
    examples: [
      {
        ko: "OHM 의 inverse bond 는 2022년에 도입되었고, 이미 90퍼센트 하락 후였습니다",
        en: "OHM introduced inverse bonds in 2022, after price had already fallen 90%",
      },
    ],
  },
  {
    code: "P7",
    title: { ko: "사람 리스크", en: "People risk" },
    detail: {
      ko: "익명 운영자의 신원 폭로, 핵심 인물 이탈, 자체 권력 집중 같은 사람과 관련된 리스크가 있었습니다. 메커니즘이 작동해도 운영 신뢰가 무너지면 끝입니다.",
      en: "Identity reveals of anonymous operators, key-person departures, and concentration of authority. The mechanism can work fine, but if trust in operations breaks, it is over.",
    },
    examples: [
      { ko: "TIME 의 0xSifu = M.Patryn", en: "TIME's 0xSifu = M.Patryn" },
      {
        ko: "여러 포크의 익명 팀 이슈",
        en: "Anonymous team issues across many forks",
      },
    ],
  },
];

export type Lesson = {
  pattern: LocaleString;
  blackhavenDoes: LocaleString;
  why: LocaleString;
};

export const LESSONS: Lesson[] = [
  {
    pattern: { ko: "P1, P3 차단", en: "Blocks P1, P3" },
    blackhavenDoes: {
      ko: "락업의 분배 cap (거버넌스가 정함, 선착순)",
      en: "Lock distribution cap (set by governance, first-come-first-served)",
    },
    why: {
      ko: "rebase 식 무한 발행이 없습니다. 분배는 거버넌스가 정한 cap 안에서만 이루어지며, 도달 시 신규 락업이 정지됩니다. 데스 스파이럴의 연료인 무한 dilution이 차단됩니다.",
      en: "No rebase-style unbounded issuance. Distribution stays inside a cap set by governance, and new locks pause once it is hit. The infinite dilution that fuels the death spiral is blocked.",
    },
  },
  {
    pattern: { ko: "P2, P6 차단", en: "Blocks P2, P6" },
    blackhavenDoes: {
      ko: "BAM, 자동, 양방향, 편차 비례, 쿨다운",
      en: "BAM: automatic, two-sided, deviation-proportional, with cooldown",
    },
    why: {
      ko: "OHM 이 수동으로 했던 inverse bond 를 자동, 양방향으로 확장했습니다. 시장가가 NAV 위로 폭주하면 즉시 매도하여 트레저리로 환류하고, 아래로 빠지면 매수하여 소각합니다. 가격 폭주가 시작되기 전에 흡수합니다.",
      en: "Extends OHM's manual inverse bond into an automatic, two-sided version. When price runs above NAV, it immediately sells back to treasury; when it falls below, it buys and burns. Absorbs the runup before it starts.",
    },
  },
  {
    pattern: { ko: "P4 차단", en: "Blocks P4" },
    blackhavenDoes: {
      ko: "RBT(자산)와 HVN(거버넌스)의 분리",
      en: "Separation of RBT (asset) and HVN (governance)",
    },
    why: {
      ko: "RBT 는 트레저리 백킹 자산이고, HVN 은 거버넌스 처분권입니다. 거버넌스 신뢰가 흔들려도 RBT 의 NAV 백킹은 영향을 받지 않습니다.",
      en: "RBT is the treasury-backed asset; HVN is the governance instrument. Even if governance trust wavers, RBT's NAV backing is not affected.",
    },
  },
  {
    pattern: { ko: "P5 차단", en: "Blocks P5" },
    blackhavenDoes: {
      ko: "USDm 스테이블 단일 백킹",
      en: "USDm stablecoin as the single backing asset",
    },
    why: {
      ko: "백킹 자산이 변동성 자산이 아닌 USDm 스테이블입니다. ETH 나 AVAX 사이클로 backing 이 동시에 무너지는 데스 스파이럴을 회피합니다.",
      en: "Backing is a USDm stablecoin, not a volatile asset. Avoids the death spiral where backing collapses together with an ETH or AVAX cycle.",
    },
  },
  {
    pattern: { ko: "P1, P2 보강", en: "Reinforces P1, P2" },
    blackhavenDoes: {
      ko: "본드 자본의 90퍼센트 트레저리, 10퍼센트 운영자금 하드코딩",
      en: "90% of bond capital to treasury, 10% to ops, hardcoded",
    },
    why: {
      ko: "OHM 포크들이 DAO 운영자금 명목으로 트레저리를 자의적으로 끌어다 쓴 패턴을 차단합니다. 부트스트랩 단계에서는 100퍼센트 POL과 운영으로 명시적으로 분리됩니다.",
      en: "Blocks the pattern where OHM forks tapped the treasury at will under the banner of DAO ops funding. During bootstrap, the split is explicitly 100% to POL and ops.",
    },
  },
  {
    pattern: { ko: "P2 보강", en: "Reinforces P2" },
    blackhavenDoes: {
      ko: "TOS 에 redemption right 미명시",
      en: "No redemption right stated in the TOS",
    },
    why: {
      ko: "사용자가 RFV 직접 redemption 을 기대하지 않게 합니다. OHM 포크들의 '백킹이 곧 환매가'라는 환상을 사전에 제거합니다.",
      en: "Stops users from expecting direct RFV redemption. Removes upfront the OHM-fork illusion that backing equals redemption price.",
    },
  },
  {
    pattern: { ko: "P7 보강", en: "Reinforces P7" },
    blackhavenDoes: {
      ko: "Zellic 감사와 time-locked admin",
      en: "Zellic audit and time-locked admin",
    },
    why: {
      ko: "운영자 권한에 time-lock 이 걸려 있고, 감사가 공개되어 있습니다. 익명 운영자가 일방적으로 결정할 수 있는 채널을 축소합니다.",
      en: "Operator authority is time-locked and the audit is public. Shrinks the channels through which anonymous operators can make unilateral decisions.",
    },
  },
];

// ===== 출시 이후 월별 종가 (CoinGecko / CMC 기반 근사치) =====
// 각 fork 의 launch 월부터 시작하는 월별 종가입니다 (USD).
// index 0 = launch month, ... 36 = launch+36 months.
// peak 월의 위치는 fork 마다 다릅니다 (monthsToPeak 로 계산).

export const PRICE_HISTORY: Record<string, number[]> = {
  // OHM, launch 2021-03, peak 2021-04 (m+1, $1,330).
  ohm: [
    480, 1330, 650, 350, 280, 640, 720, 1050, 950, 290, 195, 35, 32, 23, 13, 11,
    14, 16, 13, 12, 10, 11, 11.5, 13, 12, 11, 11, 10.5, 11, 11, 9.5, 9.8, 12,
    12.5, 12, 12, 14,
  ],
  // TIME (Wonderland), launch 2021-09, peak 2021-11 (m+2, $10,000).
  time: [
    1500, 4500, 10000, 4500, 1200, 350, 200, 180, 75, 28, 30, 35, 28, 22, 18,
    14, 12, 10, 8, 7, 6.5, 7, 6, 5.5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  ],
  // KLIMA, launch 2021-10, peak same month (m+0, $3,700).
  klima: [
    3700, 1500, 800, 350, 175, 110, 80, 40, 18, 14, 10, 7, 5, 3.5, 3, 2.5, 2.2,
    2, 1.8, 1.7, 1.6, 1.7, 1.8, 1.8, 1.7, 1.5, 1.5, 1.4, 1.4, 1.5, 1.5, 1.5,
    1.5, 1.5, 1.5, 1.5, 1.5,
  ],
  // HEC (Hector), launch 2021-09, peak 2021-12 (m+3, $155).
  hec: [
    6, 25, 90, 155, 55, 35, 15, 8, 5, 3, 2, 1.5, 1.2, 1.0, 0.8, 0.6, 0.5, 0.5,
    0.5, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
    0.4, 0.4, 0.4, 0.4,
  ],
  // BTRFLY (Redacted), launch 2021-12, peak 2022-01 (m+1, $3,500).
  btrfly: [
    1500, 3500, 1800, 950, 700, 450, 250, 200, 180, 200, 180, 200, 220, 200,
    180, 170, 180, 180, 175, 170, 175, 180, 175, 180, 185, 180, 180, 180, 180,
    180, 180, 180, 180, 180, 180, 180, 180,
  ],
  // SB (Snowbank), launch 2021-09, peak 2021-11 (m+2, $1,500).
  snowbank: [
    80, 400, 1500, 800, 100, 30, 10, 5, 3, 2, 1.5, 1.2, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ],
  // FHM (FantOHM), launch 2021-09, peak 2021-11 (m+2, $60).
  fhm: [
    3, 18, 60, 30, 8, 2, 1, 0.5, 0.3, 0.2, 0.15, 0.1, 0.08, 0.06, 0.05, 0.05,
    0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05,
    0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05,
  ],
};
