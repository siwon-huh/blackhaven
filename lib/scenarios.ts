// Blackhaven 사용자 플레이북 — 디젠 톤.
// 표준 디파이 용어 그대로 (본드 / 락업 / NAV / POL / BAM), 비유는 한 번씩만.

export type Horizon = "short" | "early" | "mid";

// 4가지 핵심 메커니즘
export const MECHANICS = [
  {
    code: "BOND",
    title: "본드 (Bonds)",
    oneLine:
      "USDm을 디스카운트로 RBT와 교환. 만기까지 선형 베스팅, 90%는 트레저리 / 10%는 운영.",
    analogy: "OHM 본드와 동일. 디스카운트 ↑ = 본드 수요 ↓ 일 때 두꺼워짐.",
    color: "#7C6BFF",
  },
  {
    code: "LOCK",
    title: "락업 (Locks)",
    oneLine:
      "RBT를 NFT로 기간 락. 만기에 정해진 추가 RBT 분배 + 활성 락은 본드에 추가 디스카운트 가산.",
    analogy:
      "stake + rebase가 아니라 cap이 있는 정해진 분배. first-come, NFT라 양도 불가.",
    color: "#3DDC97",
  },
  {
    code: "BAM",
    title: "BAM · Backing Arbitrage Module",
    oneLine:
      "Blackhaven 전용. RBT 시장가가 NAV를 벗어나면 자동 양방향 arb — 위쪽은 매도→트레저리, 아래쪽은 매수→burn. 편차 비례 + 쿨다운.",
    analogy:
      "OHM inverse bond + Frax AMO + MakerDAO PSM의 사촌. 사용자 입장에선 자동 페그 봇으로 보면 됨.",
    color: "#FF6A1F",
  },
  {
    code: "POL",
    title: "POL",
    oneLine:
      "본드로 들어온 USDm 일부가 Liquidity Manager가 영구 보유하는 V3 NFT로. fee는 트레저리로 환류.",
    analogy: "OlympusDAO 그대로. 본드는 결국 POL을 사기 위한 메커니즘.",
    color: "#9C8CFF",
  },
];

// OHM과의 차이 — 디젠 한 줄
export const OHM_TLDR = [
  "본드 + POL은 OHM 그대로. 본질 같음.",
  "OHM의 stake+rebase → 여기선 락업 NFT. cap 있어서 first-come, 빨리 안 잡으면 다음 충원까지 못 들어감.",
  "OHM이 손으로 했던 inverse bond는 BAM이 자동·양방향으로. 사용자는 NAV 근처 매수만 신경 쓰면 됨.",
  "OHM은 토큰 1개가 자산+거버넌스. 여기선 RBT(자산) / HVN(거버넌스) 분리 — 거버넌스 플레이만 따로 잡을 수 있음.",
];

export type Play = {
  badge: string;
  title: string;
  why: string;
  steps: string[];
  reward: string; // 잘 됐을 때 (markdown **bold** 지원)
  loss: string;
  apr: string;
  effort: "쉬움" | "보통" | "어려움";
};

export type Allocation = { label: string; share: number; color: string };

export type WeekStep = {
  week: string;
  action: string;
  tag: "본드" | "락업" | "트레이드" | "클레임" | "지켜보기";
};

export type ScenarioDefinition = {
  id: Horizon;
  code: string;
  korean: string;
  english: string;
  windowKR: string;
  emoji: string;
  state: string;
  ifPickThis: string;
  hero: Play;
  extras: Play[];
  allocation: Allocation[];
  weekly: WeekStep[];
  stop: string[];
};

const SCENARIOS: ScenarioDefinition[] = [
  {
    id: "short",
    code: "T0",
    korean: "초단기",
    english: "Launch Week",
    windowKR: "0–7일",
    emoji: "🚀",
    state:
      "메인넷 출시 직후 7일. 본드 디스카운트가 가장 두꺼운 첫 윈도우, 락업 cap이 처음으로 풀리는 며칠. BAM은 시동 단계라 NAV 이탈 폭이 큼.",
    ifPickThis:
      "회전이 아니라 ‘시드 포지션 한 번 잡기’. 1차 락업 cap + 첫 본드 + NAV 근처 매수까지 첫 주 안에 끝내고 T1로 넘김.",
    hero: {
      badge: "1순위 · 1차 락업 cap 즉시 진입",
      title: "Cap이 풀리는 순간 잡기",
      why: "1차 락업 cap 오픈은 보통 출시 첫 며칠 안. first-come이라 늦으면 다음 충원(early-exit fee 환류)까지 못 들어감. 1차가 분배 곡선 가장 가파르고, active 락은 같은 주에 약정하는 본드에도 추가 디스카운트를 얹음.",
      steps: [
        "출시 전 USDm 준비 + Lock 페이지 cap 일정·UI 사전 트래킹",
        "오픈 알림 즉시 30d 또는 90d 슬롯 — 90d가 곡선 더 가파름",
        "락 active 상태에서 곧바로 7d 또는 14d 본드 약정 (추가 디스카운트 가산)",
        "NFT 보관, 회전은 T1에서",
      ],
      reward:
        "1차 cap 분배 + active 상태에서 본드 추가 디스카운트 = **연환산 12~25%의 시드 베이스라인**",
      loss: "Cap 즉시 마감되면 다음 충원까지 대기. 30d 미만 자본은 락업 부적합.",
      apr: "12~25%",
      effort: "보통",
    },
    extras: [
      {
        badge: "2순위 · 출시 첫 며칠의 본드",
        title: "오프닝 디스카운트 진입",
        why: "본드 수요가 정착되기 전 처음 24~72h가 디스카운트 가장 두꺼움. 14d 본드 한 번 진입하면 만기는 T1 첫 주 — T0에서 시드, T1에서 회수.",
        steps: [
          "출시 후 24h Bond 페이지 디스카운트 모니터",
          "표시 디스카운트가 평균(>3%) 위에서 14d 본드 약정",
          "USDm 일부만 (회전 X — 1회만 시드)",
          "만기 시점은 T1 — 받은 RBT는 (3,3) 콤보의 락 자본으로 롤",
        ],
        reward: "출시 직후 디스카운트 3~5% × 14d = T1 진입 시점에 RBT 손에",
        loss: "vest 중 RBT 시장가 급락 시 디스카운트 잠식. 단, NAV 백킹은 잔존.",
        apr: "30~80%",
        effort: "쉬움",
      },
      {
        badge: "3순위 · NAV 근처 시드 매수",
        title: "BAM 시동 전 비대칭 진입",
        why: "BAM이 작은 규모로만 작동하는 첫 며칠은 RBT가 NAV 아래로 더 깊이 미끌리는 윈도우가 자주 옴. NAV는 온체인 검증 가능한 하한선이라 비대칭.",
        steps: [
          "Backing ratio = reserves / circulating 직접 계산 또는 attestation",
          "시장가가 NAV ±1% 안쪽일 때만 매수",
          "BAM 쿨다운 직후가 진입 적기",
          "T1에서 NAV +5% 위 도달 시 일부 익절",
        ],
        reward: "NAV 우상향 + 시장가 동반 상승의 비대칭",
        loss: "NAV +3% 위에서 사면 본드보다 비효율.",
        apr: "5~30%",
        effort: "보통",
      },
    ],
    allocation: [
      { label: "1차 cap 락업 (90d 권장)", share: 45, color: "#3DDC97" },
      { label: "출시 직후 14d 시드 본드", share: 30, color: "#7C6BFF" },
      { label: "NAV 근처 시드 매수", share: 15, color: "#FF6A1F" },
      { label: "T1 진입용 현금 대기", share: 10, color: "#6B7589" },
    ],
    weekly: [
      {
        week: "D-1",
        action: "USDm 사전 준비, Lock cap 일정·Bond 라운치 시각 확인",
        tag: "지켜보기",
      },
      {
        week: "D0",
        action: "메인넷 출시 — 24h 동안 디스카운트 모니터",
        tag: "지켜보기",
      },
      {
        week: "D0~1",
        action: "디스카운트 평균 위에서 14d 시드 본드 진입",
        tag: "본드",
      },
      {
        week: "D1~3",
        action: "락업 cap 1차 오픈 즉시 90d 슬롯 확보",
        tag: "락업",
      },
      {
        week: "D2~5",
        action: "BAM 쿨다운 직후 NAV 근처 시드 매수",
        tag: "트레이드",
      },
      {
        week: "D7",
        action: "T1로 전환 — 14d 본드 만기 시 (3,3) 콤보의 락 자본으로 롤",
        tag: "클레임",
      },
    ],
    stop: [
      "출시 첫 24h 디스카운트가 1% 아래로 정착 → 본드 시드 진입 보류, T1까지 대기",
      "1차 cap이 첫 주 안에 안 풀리거나 즉시 마감 → 락업 자본을 본드/현금으로 재배치",
      "RBT 시장가가 첫 주 내내 NAV +5% 위 → 시드 매수는 패스, T1에서 BAM 정착 후 재평가",
    ],
  },
  {
    id: "early",
    code: "T1",
    korean: "초기",
    english: "Compounding Lane",
    windowKR: "1주–6개월",
    emoji: "🧱",
    state:
      "출시 첫 주 이후. 본드/락업 매개변수 안정화, HVN TGE, RBT가 외부 lending에 담보 화이트리스트. BAM이 활발하게 양방향 작동, 비-본드 매출 비중 30% 진입.",
    ifPickThis:
      "락업 활성 → 본드 약정 (3,3)식 콤보가 핵심. RBT의 외부 활용처 켜지면 셀프 레버까지.",
    hero: {
      badge: "1순위 · 락업 + 본드 (3,3) 콤보",
      title: "락 활성 상태로 본드 회전",
      why: "활성 락이 본드에 추가 디스카운트 가산. 같은 USDm이 ① 락업 분배 + ② 본드 디스카운트 + ③ 받은 RBT 가치, 3중으로 일함. OHM (3,3)의 Blackhaven 버전.",
      steps: [
        "먼저 90d 락업 진입 → NFT active",
        "active 상태에서 30d 본드 약정 (추가 디스카운트 자동 적용)",
        "본드 만기 → 받은 RBT를 다시 90d 락업으로 롤",
        "분기마다 락 곡선 거버넌스 표결 추적",
      ],
      reward: "락 분배 + 본드 디스카운트 + 베스팅 가속 = **연환산 35~55%**",
      loss: "락 곡선 v2가 분배 축소 방향이면 효율 30~40% 하락.",
      apr: "35~55%",
      effort: "보통",
    },
    extras: [
      {
        badge: "2순위 · HVN TGE 시드",
        title: "거버넌스 토큰 진입",
        why: "HVN은 LP fee + BAM 스프레드 + 트레저리 잉여의 거버넌스 처분권. 바이백 발표가 가격 트리거. 초기 분배가 가장 두꺼움.",
        steps: [
          "TGE 자격 조건 확인 (락업 보유 + 본드 누적 가능성 큼)",
          "TGE 직후 풀 깊이 얕을 때 진입",
          "거버넌스 포럼 모니터링 — 바이백 일정/수수료 분배",
          "바이백 발표 ~2주 전 비중 확대",
        ],
        reward:
          "초기 평가 + 바이백 라운드 시 시장가 점프 = **−50%~+200% 비대칭**",
        loss: "거버넌스 토큰은 항상 NGMI 가능. 자본 20% 상한.",
        apr: "−50~+200%",
        effort: "어려움",
      },
      {
        badge: "3순위 · RBT 셀프 레버",
        title: "RBT 담보 → USDm 차입 → 본드",
        why: "RBT가 lending 화이트리스트되면 RBT 담보 두면서 차입한 USDm으로 본드 추가 회전. 자기참조 레버. 차입 APR < 본드 APR일 때만 작동.",
        steps: [
          "LTV 보수적으로 (≤40%)",
          "RBT 담보 → USDm 차입 → 30d 본드 → 받은 RBT 일부 다시 담보",
          "차입 APR vs 본드 디스카운트 연환산 매주 비교",
          "RBT 가격 급락 신호엔 즉시 deleverage",
        ],
        reward: "동일 자본 위 1.4–1.7배 본드 회전 = **연환산 40~90%**",
        loss: "RBT 가격 급락 시 청산. POL/BAM이 결국 받쳐주지만 청산은 즉시 발생.",
        apr: "40~90%",
        effort: "어려움",
      },
    ],
    allocation: [
      { label: "락업 + 본드 (3,3) 콤보", share: 50, color: "#7C6BFF" },
      { label: "HVN 거버넌스 시드", share: 20, color: "#9C8CFF" },
      { label: "RBT 담보 셀프 레버", share: 15, color: "#3DDC97" },
      { label: "현금 대기", share: 15, color: "#6B7589" },
    ],
    weekly: [
      {
        week: "W2",
        action: "T0 14d 본드 만기 클레임 → 받은 RBT를 90d 락업으로 롤",
        tag: "클레임",
      },
      {
        week: "W2~3",
        action: "active 락 상태에서 첫 30d 본드 (추가 디스카운트)",
        tag: "본드",
      },
      {
        week: "M1~2",
        action: "본드 회전 패턴 정착 — 디스카운트 평균 위에서만",
        tag: "본드",
      },
      { week: "M2~3", action: "HVN TGE 자격 점검, 진입 준비", tag: "지켜보기" },
      { week: "TGE", action: "HVN 시드 진입 (얕은 풀)", tag: "트레이드" },
      {
        week: "M4",
        action: "RBT lending 화이트리스트 → 셀프 레버 LTV 40%",
        tag: "트레이드",
      },
      {
        week: "M5",
        action: "락 곡선 v2 거버넌스 표결 — 축소 방향이면 신규 락 정지",
        tag: "지켜보기",
      },
      { week: "M6", action: "두 번째 90d 락 롤 + T2 검토", tag: "락업" },
    ],
    stop: [
      "본드 디스카운트 6주 평균 1.5% 아래 → 콤보만 유지, 신규 회전 중단",
      "락 곡선 v2가 분배 -40% 이상 축소 → 신규 락 진입 정지",
      "RBT 담보 LTV가 가격 변동만으로 50% 도달 → 즉시 deleverage",
    ],
  },
  {
    id: "mid",
    code: "T2",
    korean: "중기",
    english: "Reserve Layer Capture",
    windowKR: "6–18개월",
    emoji: "🏛️",
    state:
      "Blackhaven이 MegaETH의 reserve layer로 자리잡음. 짧은 본드 디스카운트 거의 0, 가치는 거버넌스와 RBT의 cross-protocol 활용에서. HVN 첫 정식 바이백 라운드.",
    ifPickThis:
      "디스카운트 사냥은 끝. 365d 락업으로 코어 잡고, RBT를 cross-protocol 워킹 캐피탈로 굴리기.",
    hero: {
      badge: "1순위 · 365d 락업 + 365d 본드",
      title: "장기 코어 포지션",
      why: "이 단계에선 짧은 본드 디스카운트가 거의 0. 365d 본드만 의미있는 디스카운트가 남고, 365d 락업 분배 곡선이 가장 가파름. 단순하지만 가장 강력.",
      steps: [
        "자본 코어를 365d 락업으로 잠금",
        "동시에 365d 본드 약정 (가장 큰 디스카운트)",
        "분기마다 일부 vest된 RBT를 새 365d 락으로 롤",
        "거버넌스에서 곡선 보호 표결",
      ],
      reward:
        "고정 분배 ~19% + 본드 디스카운트 + RBT 자체 가치 상승 = **연환산 25~35% 안정**",
      loss: "365d 자본 잠김 — 기회비용. 단, 안정성 가장 높음.",
      apr: "25~35%",
      effort: "쉬움",
    },
    extras: [
      {
        badge: "2순위 · Cross-protocol RBT",
        title: "RBT를 워킹 캐피탈로",
        why: "RBT가 12+ 프로토콜에 페어/담보로 등록되면 같은 RBT가 동시에 여러 곳에서 일함. lending 담보 + perp 마진 + LP 동시 운용.",
        steps: [
          "각 프로토콜 RBT 사용처 매핑",
          "lending 담보(40% LTV) → 차입 USDm → perp 마진 또는 LP",
          "위험가중 수익률 매주 재배분",
          "한 곳 청산 캐스케이드가 다른 라인으로 번지지 않게 노출 분산",
        ],
        reward: "동일 자본 1.5–2.2배 활용 = **연환산 25~60%**",
        loss: "한 프로토콜 청산이 RBT 시장가로 즉시 전파. 통합 프로토콜별 25% 상한.",
        apr: "25~60%",
        effort: "어려움",
      },
      {
        badge: "3순위 · HVN 거버넌스 + 바이백 사이클",
        title: "거버넌스 영향력으로 수익화",
        why: "이 단계 트레저리는 거버넌스 처분 가능. HVN은 의사결정권 + 바이백 시 가격 점프. 거버넌스 일정에 맞춘 포지션 빌드가 핵심.",
        steps: [
          "HVN 일정 비중 누적, 활성 위임",
          "분기 거버넌스 어젠다에 맞춰 표결 (곡선·수수료·바이백)",
          "바이백 라운드 발표 ~2주 전 비중 +50%",
          "라운드 종료 후 정상화",
        ],
        reward: "바이백 라운드별 HVN 시장가 +20–60% 점프 + 영향력",
        loss: "어젠다 부결 또는 트레저리 우선순위 다른 곳으로.",
        apr: "−30~+80%",
        effort: "어려움",
      },
    ],
    allocation: [
      { label: "365d 락업 + 365d 본드", share: 40, color: "#7C6BFF" },
      { label: "Cross-protocol RBT", share: 30, color: "#3DDC97" },
      { label: "HVN 거버넌스", share: 20, color: "#9C8CFF" },
      { label: "현금 대기", share: 10, color: "#6B7589" },
    ],
    weekly: [
      { week: "M6", action: "365d 락업 코어 포지션 구축", tag: "락업" },
      {
        week: "M7",
        action: "RBT가 4+ lending에 통합 → cross-deploy 시작",
        tag: "트레이드",
      },
      {
        week: "M9",
        action: "Sequencer-yield vault 활성화 거버넌스 참여",
        tag: "지켜보기",
      },
      {
        week: "M11",
        action: "락 곡선 자동조정 거버넌스 표결",
        tag: "지켜보기",
      },
      {
        week: "M12",
        action: "HVN 첫 정식 바이백 라운드 — 사전 비중 확대",
        tag: "트레이드",
      },
      {
        week: "M18",
        action: "Reserve Layer SDK 출시 → RBT 활용처 폭증",
        tag: "지켜보기",
      },
    ],
    stop: [
      "통합 프로토콜 한 곳에서 청산 캐스케이드 → 같은 라인 노출 모두 정리",
      "거버넌스 quorum 분기 연속 미달 → HVN 거버넌스 플레이 회수",
      "Backing ratio 1.02x 아래 4주 이상 → 365d 락 신규 진입 중단",
    ],
  },
];

export const findScenario = (id: Horizon) =>
  SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];

export { SCENARIOS };
