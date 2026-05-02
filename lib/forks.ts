// OHM과 그 메이저 포크들의 운명.
// 정점 가격은 CMC/CG 기준 근사치, 결말은 공개 자료 기준 — 시장 데이터는 항상 변동 가능.

export type ForkStatus =
  | "alive" // 운영 중, 살아있음
  | "alive-pivoted" // 피벗 후 다른 카테고리로 생존
  | "moribund" // 운영은 하지만 거의 죽음
  | "wound-down" // 질서있는 종료
  | "abandoned" // 사실상 방치 / 종료
  | "rugged"; // 신뢰 붕괴 / 사실상 러그

export const STATUS_TONE: Record<ForkStatus, { label: string; color: string }> = {
  alive: { label: "Alive", color: "#3DDC97" },
  "alive-pivoted": { label: "Alive · Pivoted", color: "#9C8CFF" },
  moribund: { label: "Moribund", color: "#F4C756" },
  "wound-down": { label: "Wound-down", color: "#6B7589" },
  abandoned: { label: "Abandoned", color: "#FF6A1F" },
  rugged: { label: "Rugged", color: "#FF6A1F" },
};

export type Fork = {
  id: string;
  ticker: string;
  name: string;
  chain: string;
  launched: string; // YYYY-MM
  peakDate: string;
  peakPrice: string; // 표시용
  drawdown: string; // 정점 대비 표시
  status: ForkStatus;
  hook: string; // 한 줄 차별점
  whyItGrew: string;
  whyItBroke: string;
  ending: string; // 결말 한 줄
  signature?: string; // 인용할 만한 디테일 (옵션)
};

export const FORKS: Fork[] = [
  {
    id: "ohm",
    ticker: "OHM",
    name: "OlympusDAO",
    chain: "Ethereum",
    launched: "2021-03",
    peakDate: "2021-04",
    peakPrice: "≈ $1,330",
    drawdown: "−98% (peak → trough)",
    status: "alive",
    hook: "원조. Bond + (3,3) staking + DAO treasury 패러다임을 만든 프로토콜.",
    whyItGrew:
      "고APY rebase × DAO treasury × (3,3) 셸링이 결합돼 6개월 만에 treasury $4B+ 도달. 디파이 시즌 2의 상징.",
    whyItBroke:
      "(3,3)은 모두가 stake한다는 가정 위에 서있었음. 매도 한 번이 dilution 가속을 트리거 → 데스 스파이럴. 시장가가 RFV 위 100배에서 시작해 RFV 근처까지 −98% 직행.",
    ending:
      "프로토콜은 살아남음. V2/gOHM으로 전환, treasury는 여전히 가치 보유. 토큰 가격은 RFV 부근 안정.",
    signature: "RFV 부근에선 결국 backing이 받쳤음 — 메커니즘 자체는 유효, 시장가만 미친 가격에서 시작했을 뿐.",
  },
  {
    id: "time",
    ticker: "TIME",
    name: "Wonderland",
    chain: "Avalanche",
    launched: "2021-09",
    peakDate: "2021-11",
    peakPrice: "≈ $10,000",
    drawdown: "−99%+",
    status: "rugged",
    hook: "Avalanche 첫 OHM 포크. Daniele Sestagalli의 후광으로 폭발적 성장.",
    whyItGrew:
      "OHM 메커니즘 + AVAX 시즌 + 카리스마 있는 리더십. TVL $1.5B 도달, 한때 OHM보다 가격 표면이 컸음.",
    whyItBroke:
      "2022-01, 0xSifu(트레저리 운영자)가 QuadrigaCX 공동창립자 Michael Patryn으로 폭로됨. 신뢰 붕괴 → 거버넌스 청산 표결 → 사실상 종료.",
    ending:
      "트레저리 청산 표결 통과, 운영 사실상 중단. OHM 포크 시즌의 가장 유명한 사망 사례.",
    signature: "메커니즘은 작동했지만 사람이 결국 이슈였다 — 디파이의 'trust assumption'이 무엇을 의미하는지 보여줌.",
  },
  {
    id: "klima",
    ticker: "KLIMA",
    name: "Klima DAO",
    chain: "Polygon",
    launched: "2021-10",
    peakDate: "2021-10",
    peakPrice: "≈ $3,700",
    drawdown: "−99%+",
    status: "moribund",
    hook: "탄소 크레딧(BCT, MCO2) 백킹. ‘기후 보호’ 내러티브 차별화.",
    whyItGrew:
      "ESG 내러티브 + OHM 게임이론 결합. ‘탄소 가격이 오를수록 KLIMA가 오른다’는 스토리.",
    whyItBroke:
      "백킹 자산인 토큰화 탄소 크레딧 자체의 유동성·신뢰성이 약했음. 실제 카본 마켓이 OHM 게임이론 속도를 따라가지 못해 backing이 무너짐. 일반적 OHM 데스 사이클 추가.",
    ending: "운영은 유지되지만 거래량·활동 거의 없음. 카테고리 자체가 거의 사망.",
    signature: "내러티브가 좋아도 백킹 자산이 약하면 메커니즘이 작동하지 않는다.",
  },
  {
    id: "hec",
    ticker: "HEC",
    name: "Hector Network",
    chain: "Fantom",
    launched: "2021-09",
    peakDate: "2021-12",
    peakPrice: "≈ $155",
    drawdown: "−99%",
    status: "wound-down",
    hook: "Fantom 생태계 통합 + derivatives/launchpad/스테이블코인까지 확장 시도.",
    whyItGrew: "Fantom 시즌의 주력 OHM 포크. 빠른 확장 시도로 한때 Fantom TVL 상위.",
    whyItBroke:
      "확장이 다 흩어졌고 핵심 메커니즘은 OHM과 동일하게 무너짐. 2023 거버넌스가 wind-down 결정.",
    ending:
      "트레저리 잔여 자산을 토큰홀더에 redemption 형태로 분배 후 정식 종료. OHM 포크 중 드물게 ‘질서있는 종료’.",
    signature: "메커니즘이 깨졌을 때 어떻게 마무리하는지의 모범 — 그래도 사용자 평균 진입가 회수는 못함.",
  },
  {
    id: "btrfly",
    ticker: "BTRFLY",
    name: "Redacted Cartel",
    chain: "Ethereum",
    launched: "2021-12",
    peakDate: "2022-01",
    peakPrice: "≈ $3,500",
    drawdown: "−95%",
    status: "alive-pivoted",
    hook: "OHM 포크에서 시작했지만 Curve/Convex 메타거버넌스 어그리게이터로 피벗.",
    whyItGrew: "OHM 게임이론 + Curve Wars 시즌의 ‘bribe 어그리게이터’ 포지션.",
    whyItBroke:
      "OHM 메커니즘으로는 결국 같은 사이클. V1 토큰은 95% 폭락.",
    ending:
      "V2(rlBTRFLY)로 전환, OHM 게임이론 버리고 Convex/Curve 메타거버넌스 인프라로 카테고리 변경. 살아남음.",
    signature: "‘OHM 포크였다’는 사실보다 ‘피벗에 성공한 OHM 포크’로 기억됨 — 거의 유일한 케이스.",
  },
  {
    id: "snowbank",
    ticker: "SB",
    name: "Snowbank",
    chain: "Avalanche",
    launched: "2021-09",
    peakDate: "2021-11",
    peakPrice: "≈ $1,500",
    drawdown: "−99%+",
    status: "abandoned",
    hook: "Avalanche 두 번째 메이저 OHM 포크.",
    whyItGrew: "OHM 메커니즘 카피 + AVAX 시즌의 빠른 자금 유입.",
    whyItBroke:
      "차별점이 거의 없었음. 게임이론 셸링이 흔들리자 가장 먼저 무너짐.",
    ending: "거버넌스 활동 정지, 사실상 방치.",
  },
  {
    id: "fhm",
    ticker: "FHM",
    name: "FantOHM",
    chain: "Fantom",
    launched: "2021-09",
    peakDate: "2021-11",
    peakPrice: "≈ $60",
    drawdown: "−99%+",
    status: "abandoned",
    hook: "Fantom의 카피캣 OHM 포크.",
    whyItGrew: "Fantom 시즌 + OHM 메커니즘.",
    whyItBroke: "차별점 부재, 메커니즘만 카피.",
    ending: "사용자 이탈, 운영 정지.",
  },
];

// 공통 실패 패턴
export type Pattern = {
  code: string;
  title: string;
  detail: string;
  examples: string[];
};

export const COMMON_PATTERNS: Pattern[] = [
  {
    code: "P1",
    title: "(3,3) 게임이론 ponzi",
    detail:
      "‘모두가 stake하면 모두 이긴다’는 셸링 포인트. 한 번의 큰 매도가 dilution 가속을 트리거하면 그 자체가 매도 트리거가 되어 데스 스파이럴.",
    examples: ["OHM (-98%)", "TIME (-99%)", "SB (-99%)"],
  },
  {
    code: "P2",
    title: "백킹 무관 가격 폭주",
    detail:
      "시장가가 backing 위 50–100배에서 시작해 결국 backing 부근까지 직행. 백킹은 받쳐줬지만 사용자 평균 진입가는 훨씬 위 → 사용자 입장에서 99% 손실.",
    examples: ["OHM peak $1,330 vs RFV ~$50", "TIME peak $10,000"],
  },
  {
    code: "P3",
    title: "무한 rebase 인플레이션",
    detail:
      "APY 7,000%+를 유지하려면 발행이 폭주. 가격이 인플레이션 속도를 못 따라가는 순간 실질 수익률 음수.",
    examples: ["대부분 OHM 포크 — 셸링 깨지자 모든 stake가 매도 압력으로 전환"],
  },
  {
    code: "P4",
    title: "토큰 = 자산 + 거버넌스 결합",
    detail:
      "OHM 하나가 트레저리 자산이자 거버넌스 토큰. 신뢰 붕괴 시 둘 다 0이 되고, 거버넌스 결정으로 자산을 보호할 인센티브가 사라짐.",
    examples: ["OHM, TIME, HEC 모두 토큰 1개에 결합"],
  },
  {
    code: "P5",
    title: "변동성 큰 백킹 자산",
    detail:
      "ETH/AVAX/MATIC/탄소크레딧 등 백킹 자산이 시장 사이클과 함께 폭락하면 backing 자체가 무너져 ‘하한선’이 되지 못함.",
    examples: ["KLIMA (탄소크레딧 유동성 부족)", "HEC (FTM 사이클과 동행)"],
  },
  {
    code: "P6",
    title: "Inverse bond 늦었음",
    detail:
      "백킹 아래에서 매수해 burn하는 메커니즘이 OHM에서는 사이클 후반에 수동으로 도입. 자동·실시간 작동이 없어 시장가 폭주를 막지 못함.",
    examples: ["OHM의 inverse bond는 2022년 도입 — 이미 -90% 후"],
  },
  {
    code: "P7",
    title: "사람 리스크",
    detail:
      "익명 운영자의 신원 폭로, 핵심 인물 이탈, 자체 권력 집중. 메커니즘이 작동해도 운영 신뢰가 무너지면 끝.",
    examples: ["TIME (0xSifu = M.Patryn)", "여러 포크의 익명 팀"],
  },
];

// Blackhaven이 다르게 한 것
export type Lesson = {
  pattern: string; // 어떤 P를 차단하는지
  blackhavenDoes: string;
  why: string;
};

export const LESSONS: Lesson[] = [
  {
    pattern: "P1, P3 차단",
    blackhavenDoes: "Locks의 분배 cap (governance-set, first-come)",
    why:
      "rebase의 ‘무한 발행’이 없음. 분배는 거버넌스가 정한 cap 안에서만, 도달 시 신규 락 정지. 데스 스파이럴의 연료(무한 dilution)가 차단됨.",
  },
  {
    pattern: "P2, P6 차단",
    blackhavenDoes: "BAM — 자동·양방향·편차 비례·쿨다운",
    why:
      "OHM이 손으로 했던 inverse bond를 자동 양방향으로. 시장가가 NAV 위로 폭주하면 즉시 매도→트레저리, 아래로 빠지면 매수→burn. 가격 폭주가 시작되기 전에 흡수.",
  },
  {
    pattern: "P4 차단",
    blackhavenDoes: "RBT(자산) ↔ HVN(거버넌스) 분리",
    why:
      "RBT는 트레저리 백킹 자산, HVN은 거버넌스 처분권. 거버넌스 신뢰가 흔들려도 RBT의 NAV 백킹은 영향 없음.",
  },
  {
    pattern: "P5 차단",
    blackhavenDoes: "USDm(스테이블) 단일 백킹",
    why:
      "백킹 자산이 변동성 자산이 아닌 USDm 스테이블. ETH/AVAX 사이클로 backing이 동시에 무너지는 데스 스파이럴 회피.",
  },
  {
    pattern: "P1, P2 보강",
    blackhavenDoes: "본드 자본의 90% 트레저리 / 10% 운영 하드코딩",
    why:
      "OHM 포크들이 DAO 운영비 명목으로 트레저리를 자의적으로 끌어 쓴 패턴 차단. 부트스트랩 단계에선 100% POL/ops로 명시적 분리.",
  },
  {
    pattern: "P2 보강",
    blackhavenDoes: "TOS에 redemption right 명시 부재",
    why:
      "사용자가 RFV 직접 redemption을 기대하지 않게 함. OHM 포크들의 ‘백킹 = 환매가’ 환상을 사전에 제거.",
  },
  {
    pattern: "P7 보강",
    blackhavenDoes: "Zellic 감사 + time-locked admin",
    why:
      "운영자 권한에 time-lock, 감사 공개. 익명 운영자가 일방적으로 결정할 수 있는 채널 축소.",
  },
];
