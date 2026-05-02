// 출시 직후 라이브 스냅샷.
// 앱 Metrics 페이지와 Kumbaya pool에서 직접 캡처한 수치입니다.

export const LAUNCH_SNAPSHOT = {
  asset: "RBT/USDm",
  venue: "Kumbaya, MegaETH",
  pair: "0x3fa634c81ee8aa78c4f37364e6feccb8a89c0032",
  dexscreener:
    "https://dexscreener.com/megaeth/0x3fa634c81ee8aa78c4f37364e6feccb8a89c0032",
  poolUrl:
    "https://www.kumbaya.xyz/#/pool/0x3fa634c81Ee8aa78C4f37364e6FECcB8a89c0032-4326",
  appMetrics: "https://www.blackhaven.xyz",
  timeSinceLaunch: "출시 후 약 33시간",
  capturedAt: "2026-05-02 KST 캡처",

  metrics: {
    price: "$18.66",
    priceUSDm: "18.66 USDm",
    nav: "5.23 USDm",
    navTreasury: "트레저리 USDm 약 32만 4천",
    circulating: "61,995 RBT",
    totalSupply: "61,995 RBT",
    fdv: "$1.16M",
    mcap: "$1.16M",
    liquidity: "$320K",
    poolRBT: "8.46K RBT",
    poolUSDm: "162.59K USDm",
    delta24h: "+1,715%",
    delta6h: "+10.45%",
    delta1h: "-0.34%",
    txns: 3353,
    buys: 1944,
    sells: 1409,
    volume: "$2.0M",
    buyVol: "$1.0M",
    sellVol: "$964K",
    traders: 596,
    peakApprox: "약 $60",
    drawdownFromPeak: "정점 대비 약 69퍼센트 하락",
    bond7d: "디스카운트 5퍼센트, TVL $141K",
    bond14d: "디스카운트 10퍼센트, TVL $25.7K",
    bond30d: "디스카운트 15퍼센트, TVL $165K",
    bondTotalTVL: "$331.76K",
    stakeTVL: "$42.05K",
    commit24wReward: "약 15.8퍼센트",
  },

  navAnalysis: {
    formula: "Reserves per RBT 는 트레저리의 USDm 합계를 RBT 유통량으로 나눈 값입니다.",
    nav: "5.23 USDm 당 RBT 1개",
    market: "18.66 USDm 당 RBT 1개",
    premium: "NAV 위 약 256.8퍼센트 (NAV의 3.57배)",
    interpretation:
      "공식 백킹은 RBT 1개당 5.23 USDm 입니다. 시장가 18.66은 NAV의 3.57배이며, 정점 약 60에서 69퍼센트 빠졌지만 여전히 NAV 위 큰 프리미엄에 머무릅니다. BAM이 가격을 NAV로 끌어내리는 수렴 압력이 작동 중입니다.",
  },

  signals: [
    {
      tone: "warn" as const,
      label: "OHM 포크 패턴 P2 신호 켜짐",
      detail:
        "시장가 18.66 대비 NAV 5.23 입니다. 2021년 OHM 포크 출시 직후 패턴과 같습니다. 시간이 지날수록 BAM과 본드 매도가 가격을 NAV로 끌어내릴 가능성이 큽니다.",
    },
    {
      tone: "warn" as const,
      label: "본드 백킹은 1대 1 이 아닙니다",
      detail:
        "Genesis Phase 1 에서는 본드 약정 시 10퍼센트 protocol fee 가 발생합니다. 사용자가 받는 RBT 의 백킹은 1대 1보다 낮습니다. docs Risks 에 명시되어 있습니다.",
    },
    {
      tone: "ok" as const,
      label: "30일 본드에 디스카운트가 누적되고 있습니다",
      detail:
        "30일 본드 TVL이 $165K로 가장 두껍습니다. 만기가 긴 본드 수요가 단기보다 큽니다. 시장이 장기 보유자 쪽으로 기울고 있음을 의미합니다.",
    },
    {
      tone: "ok" as const,
      label: "Treasury가 빠르게 우상향하고 있습니다",
      detail:
        "트레저리가 약 $28K (5월 1일 오후 8시)에서 약 $324K (현재)로 증가했습니다. 24시간 동안 11배 증가했고, NAV 자체가 빠르게 상승 중입니다.",
    },
  ],

  livePriority: [
    {
      play: "30일 본드 (디스카운트 15퍼센트)",
      verdict: "GO+" as const,
      note:
        "최대 디스카운트입니다. 본드의 effective entry는 약 15.86 USDm 으로, 시장가 18.66 대비 15퍼센트 낮습니다.",
    },
    {
      play: "Stake 후 24주 Commit",
      verdict: "GO" as const,
      note:
        "RBT를 받은 뒤 sRBT로 stake 하고 24주 commit (약 15.8퍼센트 수익)으로 굴립니다. 본드 만기 후 자연스러운 다음 단계입니다.",
    },
    {
      play: "NAV 근처 시드 매수",
      verdict: "WAIT" as const,
      note:
        "시장가가 NAV의 3.57배에 머무릅니다. 비대칭이 사라진 상태이며, 시장가가 약 8 USDm (NAV 위 50퍼센트) 아래로 빠지면 재평가합니다.",
    },
  ],
};

export type LaunchSignalTone = "warn" | "ok";
export type LaunchVerdict = "GO" | "GO+" | "WAIT";

export const VERDICT_TONE: Record<LaunchVerdict, { color: string; label: string }> = {
  GO: { color: "#3DDC97", label: "GO" },
  "GO+": { color: "#7C6BFF", label: "GO++" },
  WAIT: { color: "#F4C756", label: "WAIT" },
};
