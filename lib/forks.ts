// OlympusDAO와 그 메이저 포크들의 운명.
// 정점 가격은 CMC와 CoinGecko 기준의 근사치이며, 결말은 공개 자료를 기준으로 정리했습니다.

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
// 출시 (x = 0) 부터 정점 (x = peakDays) 까지를 정점까지의 일수에 맞춰 보간하고,
// 그 이후 36개월 까지를 점진적 하락 곡선으로 보간합니다.
export function normalizedCurve(
  peakDays: number,
  recentUSD: number,
  peakUSD: number,
  launchUSD: number,
): { x: number; y: number }[] {
  const recentY = Math.max(0.4, (recentUSD / peakUSD) * 100);
  const launchY = Math.max(0.4, Math.min(100, (launchUSD / peakUSD) * 100));

  // 출시 → 정점 구간을 곡선으로 보간 (가속 후 정점 도달).
  // x 단위는 day. peakDays = 정점까지 일수.
  // 정점 후 구간은 30일, 60일, 90일, 180일, 365일, 730일, 1095일 (3년) 까지.
  const points: { x: number; y: number }[] = [];

  // pre-peak: 0 부터 peakDays 까지 일정 간격
  const preSamples = Math.max(6, Math.min(12, Math.ceil(peakDays / 7)));
  for (let i = 0; i <= preSamples; i++) {
    const t = i / preSamples;
    const x = peakDays * t;
    // 가속 곡선: y = launchY + (peak - launchY) * t^1.6
    const y = launchY + (100 - launchY) * Math.pow(t, 1.6);
    points.push({ x, y });
  }

  // post-peak: 30일 간격에 가까운 milestone
  const postMilestones = [
    { x: peakDays + 30, factor: 0.65 }, // 정점 후 1개월
    { x: peakDays + 60, factor: 0.45 }, // 2개월
    { x: peakDays + 90, factor: 0.32 }, // 3개월
    { x: peakDays + 180, factor: 0.2 }, // 6개월
    { x: peakDays + 365, factor: 0.12 }, // 1년
    { x: peakDays + 730, factor: 0.06 }, // 2년
  ];
  for (const m of postMilestones) {
    const baselineY = Math.max(recentY, 100 * m.factor);
    points.push({ x: m.x, y: baselineY });
  }
  // 마지막 점: 36개월 (대략) recentY
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
  peakPrice: string;
  peakPriceUSD: number; // 정규화된 곡선 차트용
  launchPriceUSD: number; // 출시 직후 첫 거래가 근사
  recentPriceUSD: number; // 2024 이후 근사 가격
  drawdown: string;
  status: ForkStatus;
  hook: string;
  whyItGrew: string;
  whyItBroke: string;
  ending: string;
  signature?: string;
};

export const FORKS: Fork[] = [
  {
    id: "ohm",
    ticker: "OHM",
    name: "OlympusDAO",
    chain: "Ethereum",
    launched: "2021-03",
    peakDate: "2021-04",
    peakPrice: "약 $1,330",
    peakPriceUSD: 1330,
    launchPriceUSD: 4,
    recentPriceUSD: 25,
    drawdown: "정점 대비 약 98퍼센트 하락",
    status: "alive",
    hook: "본드와 (3,3) staking, DAO treasury 패러다임을 만든 원조 프로토콜입니다.",
    whyItGrew:
      "고APY rebase, DAO treasury, (3,3) 셸링이 결합되어 6개월 만에 트레저리가 $4B 이상에 도달했습니다. 디파이 시즌 2의 상징이 되었습니다.",
    whyItBroke:
      "(3,3)은 모두가 stake한다는 가정 위에 서있었습니다. 매도 한 번이 dilution 가속을 트리거하면서 데스 스파이럴이 시작되었고, 시장가가 RFV 위 100배에서 시작해 RFV 근처까지 98퍼센트 직행했습니다.",
    ending:
      "프로토콜은 살아남았습니다. V2와 gOHM으로 전환했고, 트레저리는 여전히 가치를 보유하고 있습니다. 토큰 가격은 RFV 부근에서 안정화되었습니다.",
    signature:
      "RFV 부근에서 결국 backing이 받쳐주었습니다. 메커니즘 자체는 유효했고, 시장가만 비합리적인 수준에서 시작했을 뿐입니다.",
  },
  {
    id: "time",
    ticker: "TIME",
    name: "Wonderland",
    chain: "Avalanche",
    launched: "2021-09",
    peakDate: "2021-11",
    peakPrice: "약 $10,000",
    peakPriceUSD: 10000,
    launchPriceUSD: 130,
    recentPriceUSD: 5,
    drawdown: "정점 대비 99퍼센트 이상 하락",
    status: "rugged",
    hook: "Avalanche의 첫 OHM 포크입니다. Daniele Sestagalli의 후광으로 폭발적으로 성장했습니다.",
    whyItGrew:
      "OHM 메커니즘에 AVAX 시즌과 카리스마 있는 리더십이 결합되었습니다. TVL이 $1.5B에 도달했고, 한때 시가총액이 OHM보다 컸습니다.",
    whyItBroke:
      "2022년 1월, 트레저리 운영자였던 0xSifu가 QuadrigaCX 공동창립자 Michael Patryn 임이 폭로되었습니다. 신뢰가 붕괴되며 거버넌스 청산 표결로 이어졌고, 사실상 종료되었습니다.",
    ending:
      "트레저리 청산 표결이 통과되며 운영이 사실상 중단되었습니다. OHM 포크 시즌의 가장 유명한 사망 사례입니다.",
    signature:
      "메커니즘은 작동했지만 결국 사람이 문제였습니다. 디파이의 신뢰 가정이 무엇을 의미하는지 보여주는 사례입니다.",
  },
  {
    id: "klima",
    ticker: "KLIMA",
    name: "Klima DAO",
    chain: "Polygon",
    launched: "2021-10",
    peakDate: "2021-10",
    peakPrice: "약 $3,700",
    peakPriceUSD: 3700,
    launchPriceUSD: 70,
    recentPriceUSD: 1.5,
    drawdown: "정점 대비 99퍼센트 이상 하락",
    status: "moribund",
    hook: "탄소 크레딧(BCT, MCO2) 백킹을 채택하여 기후 보호 내러티브로 차별화했습니다.",
    whyItGrew:
      "ESG 내러티브와 OHM 게임이론이 결합되었습니다. 탄소 가격이 오를수록 KLIMA가 오른다는 스토리가 통했습니다.",
    whyItBroke:
      "백킹 자산인 토큰화 탄소 크레딧 자체의 유동성과 신뢰성이 약했습니다. 실제 카본 마켓이 OHM 게임이론의 속도를 따라가지 못해 backing이 무너졌고, 일반적인 OHM 데스 사이클이 겹쳐졌습니다.",
    ending:
      "운영은 유지되지만 거래량과 활동이 거의 없습니다. 카테고리 자체가 거의 사망 상태입니다.",
    signature:
      "내러티브가 좋아도 백킹 자산이 약하면 메커니즘이 작동하지 않습니다.",
  },
  {
    id: "hec",
    ticker: "HEC",
    name: "Hector Network",
    chain: "Fantom",
    launched: "2021-09",
    peakDate: "2021-12",
    peakPrice: "약 $155",
    peakPriceUSD: 155,
    launchPriceUSD: 6,
    recentPriceUSD: 0.4,
    drawdown: "정점 대비 약 99퍼센트 하락",
    status: "wound-down",
    hook: "Fantom 생태계 통합과 derivatives, launchpad, 스테이블코인까지 시도한 확장형 포크입니다.",
    whyItGrew:
      "Fantom 시즌의 주력 OHM 포크였습니다. 빠른 확장 시도로 한때 Fantom TVL 상위에 올랐습니다.",
    whyItBroke:
      "확장이 흩어지면서 핵심 메커니즘은 OHM과 동일하게 무너졌습니다. 2023년 거버넌스가 wind-down을 결정했습니다.",
    ending:
      "트레저리 잔여 자산을 토큰홀더에 redemption 형태로 분배한 뒤 정식 종료했습니다. OHM 포크 중 드물게 질서있는 종료 사례입니다.",
    signature:
      "메커니즘이 깨졌을 때 어떻게 마무리하는지의 모범 사례입니다. 그래도 사용자 평균 진입가의 회수에는 미치지 못했습니다.",
  },
  {
    id: "btrfly",
    ticker: "BTRFLY",
    name: "Redacted Cartel",
    chain: "Ethereum",
    launched: "2021-12",
    peakDate: "2022-01",
    peakPrice: "약 $3,500",
    peakPriceUSD: 3500,
    launchPriceUSD: 1500,
    recentPriceUSD: 180,
    drawdown: "정점 대비 약 95퍼센트 하락",
    status: "alive-pivoted",
    hook: "OHM 포크에서 시작했지만 Curve와 Convex의 메타거버넌스 어그리게이터로 피벗했습니다.",
    whyItGrew:
      "OHM 게임이론에 Curve Wars 시즌의 bribe 어그리게이터 포지션이 결합되었습니다.",
    whyItBroke:
      "OHM 메커니즘으로는 결국 같은 사이클을 맞이했습니다. V1 토큰은 95퍼센트 하락했습니다.",
    ending:
      "V2(rlBTRFLY)로 전환하면서 OHM 게임이론을 버리고 Convex와 Curve의 메타거버넌스 인프라로 카테고리를 변경했습니다. 살아남았습니다.",
    signature:
      "OHM 포크였다는 사실보다 피벗에 성공한 OHM 포크로 기억됩니다. 거의 유일한 케이스입니다.",
  },
  {
    id: "snowbank",
    ticker: "SB",
    name: "Snowbank",
    chain: "Avalanche",
    launched: "2021-09",
    peakDate: "2021-11",
    peakPrice: "약 $1,500",
    peakPriceUSD: 1500,
    launchPriceUSD: 80,
    recentPriceUSD: 1,
    drawdown: "정점 대비 99퍼센트 이상 하락",
    status: "abandoned",
    hook: "Avalanche의 두 번째 메이저 OHM 포크입니다.",
    whyItGrew:
      "OHM 메커니즘 카피와 AVAX 시즌의 빠른 자금 유입이 결합되었습니다.",
    whyItBroke:
      "차별점이 거의 없었습니다. 게임이론 셸링이 흔들리자 가장 먼저 무너졌습니다.",
    ending: "거버넌스 활동이 정지되며 사실상 방치되었습니다.",
  },
  {
    id: "fhm",
    ticker: "FHM",
    name: "FantOHM",
    chain: "Fantom",
    launched: "2021-09",
    peakDate: "2021-11",
    peakPrice: "약 $60",
    peakPriceUSD: 60,
    launchPriceUSD: 3,
    recentPriceUSD: 0.05,
    drawdown: "정점 대비 99퍼센트 이상 하락",
    status: "abandoned",
    hook: "Fantom의 OHM 카피캣 포크입니다.",
    whyItGrew: "Fantom 시즌과 OHM 메커니즘이 결합되었습니다.",
    whyItBroke: "차별점이 없었고 메커니즘만 카피했습니다.",
    ending: "사용자가 이탈했고 운영이 정지되었습니다.",
  },
];

export type Pattern = {
  code: string;
  title: string;
  detail: string;
  examples: string[];
};

export const COMMON_PATTERNS: Pattern[] = [
  {
    code: "P1",
    title: "(3,3) 게임이론 폰지 구조",
    detail:
      "모두가 stake하면 모두 이긴다는 셸링 포인트입니다. 한 번의 큰 매도가 dilution 가속을 트리거하면 그 자체가 매도 트리거가 되어 데스 스파이럴이 시작됩니다.",
    examples: [
      "OHM 약 98퍼센트 하락",
      "TIME 약 99퍼센트 하락",
      "SB 약 99퍼센트 하락",
    ],
  },
  {
    code: "P2",
    title: "백킹과 무관한 가격 폭주",
    detail:
      "시장가가 backing 위 50에서 100배에서 시작하여 결국 backing 부근까지 직행합니다. 백킹은 받쳐주었지만 사용자 평균 진입가는 훨씬 위에 있어 사용자 입장에서는 99퍼센트 손실로 끝납니다.",
    examples: ["OHM 정점 $1,330 vs RFV 약 $50", "TIME 정점 $10,000"],
  },
  {
    code: "P3",
    title: "무한 rebase 인플레이션",
    detail:
      "APY 7,000퍼센트 이상을 유지하려면 발행이 폭주합니다. 가격이 인플레이션 속도를 따라가지 못하는 순간 실질 수익률이 음수로 전환됩니다.",
    examples: [
      "대부분의 OHM 포크가 셸링이 깨지자 모든 stake가 매도 압력으로 전환되었습니다",
    ],
  },
  {
    code: "P4",
    title: "토큰이 자산과 거버넌스를 겸하는 구조",
    detail:
      "OHM 하나가 트레저리 자산이자 거버넌스 토큰을 겸했습니다. 신뢰가 무너지면 둘 다 0이 되며, 거버넌스 결정으로 자산을 보호할 인센티브도 사라집니다.",
    examples: ["OHM, TIME, HEC 모두 토큰 하나에 결합되어 있었습니다"],
  },
  {
    code: "P5",
    title: "변동성 큰 백킹 자산",
    detail:
      "ETH, AVAX, MATIC, 탄소 크레딧 같은 백킹 자산이 시장 사이클과 함께 폭락하면 backing 자체가 무너져 하한선이 되지 못합니다.",
    examples: [
      "KLIMA 의 탄소 크레딧 유동성 부족",
      "HEC 가 FTM 사이클과 동행 폭락",
    ],
  },
  {
    code: "P6",
    title: "Inverse bond 도입이 늦었습니다",
    detail:
      "백킹 아래에서 매수하여 burn하는 메커니즘이 OHM 에서는 사이클 후반에 수동으로 도입되었습니다. 자동, 실시간 작동이 없어 시장가 폭주를 막지 못했습니다.",
    examples: [
      "OHM 의 inverse bond 는 2022년에 도입되었고, 이미 90퍼센트 하락 후였습니다",
    ],
  },
  {
    code: "P7",
    title: "사람 리스크",
    detail:
      "익명 운영자의 신원 폭로, 핵심 인물 이탈, 자체 권력 집중 같은 사람과 관련된 리스크가 있었습니다. 메커니즘이 작동해도 운영 신뢰가 무너지면 끝입니다.",
    examples: ["TIME 의 0xSifu = M.Patryn", "여러 포크의 익명 팀 이슈"],
  },
];

export type Lesson = {
  pattern: string;
  blackhavenDoes: string;
  why: string;
};

export const LESSONS: Lesson[] = [
  {
    pattern: "P1, P3 차단",
    blackhavenDoes: "락업의 분배 cap (거버넌스가 정함, 선착순)",
    why: "rebase 식 무한 발행이 없습니다. 분배는 거버넌스가 정한 cap 안에서만 이루어지며, 도달 시 신규 락업이 정지됩니다. 데스 스파이럴의 연료인 무한 dilution이 차단됩니다.",
  },
  {
    pattern: "P2, P6 차단",
    blackhavenDoes: "BAM, 자동, 양방향, 편차 비례, 쿨다운",
    why: "OHM 이 수동으로 했던 inverse bond 를 자동, 양방향으로 확장했습니다. 시장가가 NAV 위로 폭주하면 즉시 매도하여 트레저리로 환류하고, 아래로 빠지면 매수하여 소각합니다. 가격 폭주가 시작되기 전에 흡수합니다.",
  },
  {
    pattern: "P4 차단",
    blackhavenDoes: "RBT(자산)와 HVN(거버넌스)의 분리",
    why: "RBT 는 트레저리 백킹 자산이고, HVN 은 거버넌스 처분권입니다. 거버넌스 신뢰가 흔들려도 RBT 의 NAV 백킹은 영향을 받지 않습니다.",
  },
  {
    pattern: "P5 차단",
    blackhavenDoes: "USDm 스테이블 단일 백킹",
    why: "백킹 자산이 변동성 자산이 아닌 USDm 스테이블입니다. ETH 나 AVAX 사이클로 backing 이 동시에 무너지는 데스 스파이럴을 회피합니다.",
  },
  {
    pattern: "P1, P2 보강",
    blackhavenDoes: "본드 자본의 90퍼센트 트레저리, 10퍼센트 운영자금 하드코딩",
    why: "OHM 포크들이 DAO 운영자금 명목으로 트레저리를 자의적으로 끌어다 쓴 패턴을 차단합니다. 부트스트랩 단계에서는 100퍼센트 POL과 운영으로 명시적으로 분리됩니다.",
  },
  {
    pattern: "P2 보강",
    blackhavenDoes: "TOS 에 redemption right 미명시",
    why: "사용자가 RFV 직접 redemption 을 기대하지 않게 합니다. OHM 포크들의 '백킹이 곧 환매가'라는 환상을 사전에 제거합니다.",
  },
  {
    pattern: "P7 보강",
    blackhavenDoes: "Zellic 감사와 time-locked admin",
    why: "운영자 권한에 time-lock 이 걸려 있고, 감사가 공개되어 있습니다. 익명 운영자가 일방적으로 결정할 수 있는 채널을 축소합니다.",
  },
];
