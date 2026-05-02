// 출시 직후 라이브 스냅샷 — 앱 Metrics + Kumbaya pool에서 직접 캡처.
// (T+1day, 2026-05-02 캡처) — 숫자가 변하면 이 파일과 fairValue.ts:LIVE_METRICS만 업데이트.

export const LAUNCH_SNAPSHOT = {
  asset: "RBT/USDm",
  venue: "Kumbaya · MegaETH",
  pair: "0x3fa634c81ee8aa78c4f37364e6feccb8a89c0032",
  dexscreener: "https://dexscreener.com/megaeth/0x3fa634c81ee8aa78c4f37364e6feccb8a89c0032",
  poolUrl: "https://www.kumbaya.xyz/#/pool/0x3fa634c81Ee8aa78C4f37364e6FECcB8a89c0032-4326",
  appMetrics: "https://www.blackhaven.xyz",
  timeSinceLaunch: "T+~33h",
  capturedAt: "2026-05-02 KST",

  metrics: {
    // 시장가
    price: "$18.66",
    priceUSDm: "18.66 USDm",
    // 공식 NAV (앱 Metrics 페이지)
    nav: "5.23 USDm",
    navTreasury: "$324K USDm in reserves",
    circulating: "61,995 RBT",
    totalSupply: "61,995 RBT",
    // FDV / MCap
    fdv: "$1.16M",
    mcap: "$1.16M",
    // 풀
    liquidity: "$320K",
    poolRBT: "8.46K RBT",
    poolUSDm: "162.59K USDm",
    // 변화
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
    peakApprox: "~$60",
    drawdownFromPeak: "−69%",
    // 본드 TVL (앱 Bonds 페이지)
    bond7d: "5% disc · $141K TVL",
    bond14d: "10% disc · $25.7K TVL",
    bond30d: "15% disc · $165K TVL",
    bondTotalTVL: "$331.76K",
    // Stake / Commit (앱 Stake / Commit 페이지)
    stakeTVL: "$42.05K",
    commit24wReward: "~15.8%",
  },

  // NAV 분석 — 이제 정확한 수치
  navAnalysis: {
    formula: "Reserves per RBT = USDm in treasury ÷ circulating RBT",
    nav: "5.23 USDm / RBT",
    market: "18.66 USDm / RBT",
    premium: "+256.8% (3.57× NAV)",
    interpretation:
      "공식 backing은 RBT 1개당 5.23 USDm. 시장가 18.66은 NAV의 3.57배 — peak ~$60에서 −69% 빠졌지만 여전히 NAV 위 큰 프리미엄. BAM이 가격을 NAV로 끌어내리는 수렴 압력이 작동 중.",
  },

  signals: [
    {
      tone: "warn" as const,
      label: "OHM 포크 패턴 P2 신호 켜짐",
      detail:
        "시장가 18.66 vs NAV 5.23 — 정확히 2021 OHM 포크 출시 직후 패턴. 시간이 갈수록 BAM + 본드 매도가 가격을 NAV로 끌어내릴 가능성 큼.",
    },
    {
      tone: "warn" as const,
      label: "본드 백킹 ≠ 1:1",
      detail:
        "Genesis Phase 1: 본드 약정 시 10% protocol fee. 사용자가 받는 RBT의 백킹은 1:1보다 낮음 (docs Risks 명시).",
    },
    {
      tone: "ok" as const,
      label: "30d 본드에 디스카운트 누적",
      detail:
        "30d 본드 TVL $165K — 가장 두꺼움. 만기 긴 본드 수요가 단기보다 큼 = 시장이 장기 holder 쪽으로.",
    },
    {
      tone: "ok" as const,
      label: "Treasury 우상향",
      detail: "$28K (May 1, 8PM) → $324K (현재). 24h 만에 11배 증가. NAV 자체가 빠르게 상승 중.",
    },
  ],

  livePriority: [
    {
      play: "30d Bond (15% 디스카운트)",
      verdict: "GO+" as const,
      note: "최대 디스카운트. effective entry = $15.86 USDm/RBT — 시장가 $18.66 대비 −15%.",
    },
    {
      play: "Stake → 24w Commit",
      verdict: "GO" as const,
      note: "RBT 받은 뒤 sRBT로 stake → 24w commit (~15.8% 수익). 본드 만기 후 자연스러운 다음 단계.",
    },
    {
      play: "NAV 근처 시드 매수",
      verdict: "WAIT" as const,
      note: "시장가 NAV의 3.57배. 비대칭 사라짐. 시장가가 ~$8 (NAV 위 50%) 아래로 빠지면 재평가.",
    },
  ],
};

export type LaunchSignalTone = "warn" | "ok";
export type LaunchVerdict = "GO" | "GO+" | "WAIT";

export const VERDICT_TONE: Record<LaunchVerdict, { color: string; label: string }> = {
  GO: { color: "#3DDC97", label: "GO" },
  "GO+": { color: "#7C6BFF", label: "GO ++" },
  WAIT: { color: "#F4C756", label: "WAIT" },
};
