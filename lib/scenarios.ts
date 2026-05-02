// Blackhaven 사용자 플레이북.
// 디파이 표준 용어 그대로(본드, 락업, NAV, POL, BAM).

export type Horizon = "short" | "early" | "mid";

export const MECHANICS = [
  {
    code: "BOND",
    title: "본드 (Bonds)",
    oneLine:
      "USDm을 디스카운트로 RBT와 교환합니다. 만기까지 선형으로 베스팅되며, 약정 자본의 90%는 트레저리, 10%는 운영비입니다.",
    analogy:
      "OHM 본드와 본질이 동일합니다. 디스카운트는 본드 수요가 적을 때 두꺼워집니다.",
    color: "#7C6BFF",
  },
  {
    code: "LOCK",
    title: "락업 (Locks)",
    oneLine:
      "RBT를 NFT로 기간 락업합니다. 만기에 정해진 추가 RBT가 분배되고, 활성 락은 본드에 추가 디스카운트를 가산합니다.",
    analogy:
      "stake와 rebase 대신 cap이 있는 정해진 분배 구조입니다. 선착순이며 NFT라 양도 불가입니다.",
    color: "#3DDC97",
  },
  {
    code: "BAM",
    title: "BAM (Backing Arbitrage Module)",
    oneLine:
      "RBT 시장가가 NAV에서 벗어나면 자동으로 양방향 차익거래를 수행합니다. 위쪽이면 매도하여 트레저리로 환류시키고, 아래쪽이면 매수하여 소각합니다.",
    analogy:
      "OHM의 inverse bond를 자동, 양방향으로 확장한 모듈입니다. 사용자 입장에서는 자동 페그 봇으로 이해해도 됩니다.",
    color: "#FF6A1F",
  },
  {
    code: "POL",
    title: "POL (Protocol-Owned Liquidity)",
    oneLine:
      "본드로 들어온 USDm 일부가 Liquidity Manager가 영구 보유하는 Uniswap V3 NFT가 됩니다. 거래 수수료는 트레저리로 환류됩니다.",
    analogy:
      "OlympusDAO와 동일합니다. 본드는 결국 POL을 사기 위한 메커니즘입니다.",
    color: "#9C8CFF",
  },
];

export const OHM_TLDR = [
  "본드와 POL은 OHM과 본질이 같습니다.",
  "OHM의 stake와 rebase는 여기에서는 락업 NFT입니다. cap이 있어 선착순이고, 늦으면 다음 충원까지 기다려야 합니다.",
  "OHM이 수동으로 했던 inverse bond는 BAM이 자동, 양방향으로 처리합니다. 사용자는 NAV 근처 매수만 신경 쓰면 됩니다.",
  "OHM은 토큰 하나가 자산과 거버넌스를 겸했지만, 여기서는 RBT(자산)와 HVN(거버넌스)이 분리됩니다. 거버넌스 플레이만 따로 잡을 수 있습니다.",
];

export type Play = {
  badge: string;
  title: string;
  why: string;
  steps: string[];
  reward: string;
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
    windowKR: "0~7일",
    state:
      "메인넷 출시 직후 7일 동안의 윈도우입니다. 본드 디스카운트가 가장 두꺼운 첫 구간이며, 락업 cap이 처음으로 풀리는 며칠입니다. BAM은 시동 단계라 NAV 이탈 폭이 큽니다.",
    ifPickThis:
      "회전이 아니라 시드 포지션을 한 번에 잡습니다. 1차 락업 cap, 첫 본드, NAV 근처 매수까지 첫 주 안에 끝내고 다음 시간축으로 넘깁니다.",
    hero: {
      badge: "1순위, 1차 락업 cap 즉시 진입",
      title: "Cap이 풀리는 순간 잡기",
      why: "1차 락업 cap 오픈은 보통 출시 첫 며칠 안에 풀립니다. 선착순이라 늦으면 다음 충원까지 들어가지 못합니다. 1차가 분배 곡선이 가장 가파르고, 활성 락은 같은 주에 약정하는 본드에도 추가 디스카운트를 얹어줍니다.",
      steps: [
        "출시 전 USDm을 준비하고, 락업 페이지에서 cap 일정과 UI를 미리 확인합니다.",
        "오픈 알림을 받자마자 30일 또는 90일 슬롯을 잡습니다. 90일이 분배 곡선이 더 가파릅니다.",
        "락이 활성화된 상태에서 곧바로 7일 또는 14일 본드를 약정합니다. 추가 디스카운트가 자동으로 가산됩니다.",
        "NFT를 보관하고, 회전은 다음 시간축에서 시작합니다.",
      ],
      reward:
        "1차 cap 분배에 활성 상태의 본드 추가 디스카운트가 더해져 시드 포지션의 베이스라인 수익을 만듭니다. 연환산 12에서 25퍼센트 수준입니다.",
      loss: "Cap이 즉시 마감되면 다음 충원까지 기다려야 합니다. 30일 미만으로 회수해야 하는 자본은 락업에 부적합합니다.",
      apr: "12에서 25퍼센트",
      effort: "보통",
    },
    extras: [
      {
        badge: "2순위, 출시 첫 며칠의 본드",
        title: "오프닝 디스카운트 진입",
        why: "본드 수요가 정착되기 전 처음 24에서 72시간이 디스카운트가 가장 두꺼운 구간입니다. 14일 본드를 한 번 잡으면 만기는 다음 시간축의 첫 주가 되어, 출시에서 시드를 만들고 그다음에서 회수하는 구조가 됩니다.",
        steps: [
          "출시 후 24시간 동안 본드 페이지의 디스카운트를 모니터링합니다.",
          "표시 디스카운트가 평균(3퍼센트 이상) 위에서 14일 본드를 약정합니다.",
          "USDm 일부만 투입합니다. 회전이 아니라 1회 시드입니다.",
          "만기 시점은 다음 시간축이며, 받은 RBT는 락업과 본드 콤보의 락 자본으로 굴립니다.",
        ],
        reward:
          "출시 직후 디스카운트 3에서 5퍼센트와 14일 만기가 결합되어, 다음 시간축 진입 시점에 RBT가 손에 들어옵니다.",
        loss: "베스팅 중 RBT 시장가가 급락하면 디스카운트 효과가 잠식됩니다. 다만 NAV 백킹은 잔존합니다.",
        apr: "30에서 80퍼센트",
        effort: "쉬움",
      },
      {
        badge: "3순위, NAV 근처 시드 매수",
        title: "BAM 시동 전 비대칭 진입",
        why: "BAM이 작은 규모로만 작동하는 첫 며칠은 RBT가 NAV 아래로 더 깊이 빠지는 윈도우가 자주 옵니다. NAV는 온체인으로 검증할 수 있는 하한선이라 비대칭이 큽니다.",
        steps: [
          "Backing ratio를 reserves 나누기 circulating으로 직접 계산하거나 attestation으로 확인합니다.",
          "시장가가 NAV의 플러스마이너스 1퍼센트 안쪽일 때만 매수합니다.",
          "BAM 쿨다운 직후가 진입 적기입니다.",
          "다음 시간축에서 NAV 위 5퍼센트 도달 시 일부를 익절합니다.",
        ],
        reward: "NAV의 우상향과 시장가 동반 상승의 비대칭 구조입니다.",
        loss: "NAV 위 3퍼센트보다 높은 가격에서 사면 본드보다 효율이 떨어집니다.",
        apr: "5에서 30퍼센트",
        effort: "보통",
      },
    ],
    allocation: [
      { label: "1차 cap 락업, 90일 권장", share: 45, color: "#3DDC97" },
      { label: "출시 직후 14일 시드 본드", share: 30, color: "#7C6BFF" },
      { label: "NAV 근처 시드 매수", share: 15, color: "#FF6A1F" },
      { label: "다음 시간축 진입용 현금 대기", share: 10, color: "#6B7589" },
    ],
    weekly: [
      {
        week: "D-1",
        action:
          "USDm을 사전 준비하고, 락업 cap 일정과 본드 라운치 시각을 확인합니다.",
        tag: "지켜보기",
      },
      {
        week: "D0",
        action: "메인넷 출시 후 24시간 동안 디스카운트를 모니터링합니다.",
        tag: "지켜보기",
      },
      {
        week: "D0~1",
        action: "디스카운트 평균 위에서 14일 시드 본드에 진입합니다.",
        tag: "본드",
      },
      {
        week: "D1~3",
        action: "락업 cap이 1차로 오픈되는 순간 90일 슬롯을 확보합니다.",
        tag: "락업",
      },
      {
        week: "D2~5",
        action: "BAM 쿨다운 직후 NAV 근처에서 시드 매수를 진행합니다.",
        tag: "트레이드",
      },
      {
        week: "D7",
        action:
          "다음 시간축으로 전환합니다. 14일 본드 만기 시 받은 RBT는 콤보의 락 자본으로 굴립니다.",
        tag: "클레임",
      },
    ],
    stop: [
      "출시 첫 24시간 동안 디스카운트가 1퍼센트 아래로 정착하면 본드 시드 진입을 보류하고 다음 시간축까지 기다립니다.",
      "1차 cap이 첫 주 안에 풀리지 않거나 즉시 마감되면 락업에 배정한 자본을 본드 또는 현금으로 재배치합니다.",
      "RBT 시장가가 첫 주 내내 NAV 위 5퍼센트 이상에서 정착하면 시드 매수는 패스하고, 다음 시간축에서 BAM 정착 후 재평가합니다.",
    ],
  },
  {
    id: "early",
    code: "T1",
    korean: "초기",
    english: "Compounding Lane",
    windowKR: "1주에서 6개월",
    state:
      "출시 첫 주 이후의 구간입니다. 본드와 락업 매개변수가 안정화되고, HVN TGE가 발생하며, RBT가 외부 lending에 담보로 화이트리스트됩니다. BAM이 활발하게 양방향으로 작동하고, 비본드 매출 비중이 30퍼센트에 진입합니다.",
    ifPickThis:
      "락업 활성과 본드 약정을 묶는 (3,3) 콤보가 핵심입니다. RBT의 외부 활용처가 켜지면 셀프 레버까지 확장합니다.",
    hero: {
      badge: "1순위, 락업과 본드 (3,3) 콤보",
      title: "락 활성 상태로 본드 회전",
      why: "활성 락이 본드에 추가 디스카운트를 가산합니다. 같은 USDm이 락업 분배, 본드 디스카운트, 받은 RBT의 가치라는 세 갈래로 동시에 일합니다. OHM (3,3) 게임이론의 Blackhaven 버전입니다.",
      steps: [
        "먼저 90일 락업에 진입하여 NFT를 활성화합니다.",
        "활성 상태에서 30일 본드를 약정하면 추가 디스카운트가 자동 적용됩니다.",
        "본드 만기에 받은 RBT를 다시 90일 락업으로 굴립니다.",
        "분기마다 락 곡선의 거버넌스 표결을 추적합니다.",
      ],
      reward:
        "락 분배에 본드 디스카운트와 베스팅 가속이 더해져 연환산 35에서 55퍼센트 수익을 만듭니다.",
      loss: "락 곡선 v2가 분배 축소 방향으로 가면 효율이 30에서 40퍼센트 하락합니다.",
      apr: "35에서 55퍼센트",
      effort: "보통",
    },
    extras: [
      {
        badge: "2순위, HVN TGE 시드",
        title: "거버넌스 토큰 진입",
        why: "HVN은 LP 수수료, BAM 스프레드, 트레저리 잉여의 거버넌스 처분권입니다. 바이백 발표가 가격 트리거이고, 초기 분배가 가장 두껍습니다.",
        steps: [
          "TGE 자격 조건을 확인합니다. 락업 보유와 본드 누적이 자격 요건일 가능성이 높습니다.",
          "TGE 직후 풀 깊이가 얕을 때 진입합니다.",
          "거버넌스 포럼에서 바이백 일정과 수수료 분배 안건을 모니터링합니다.",
          "바이백 발표 약 2주 전 비중을 확대합니다.",
        ],
        reward:
          "초기 평가와 바이백 라운드의 시장가 점프가 결합되어 마이너스 50퍼센트에서 플러스 200퍼센트의 비대칭 구조를 만듭니다.",
        loss: "거버넌스 토큰은 항상 실패할 수 있습니다. 자본의 20퍼센트를 상한으로 둡니다.",
        apr: "마이너스 50에서 플러스 200퍼센트",
        effort: "어려움",
      },
      {
        badge: "3순위, RBT 셀프 레버",
        title: "RBT 담보로 USDm 차입 후 본드",
        why: "RBT가 lending에 화이트리스트되면 RBT 담보를 두면서 차입한 USDm으로 본드를 추가로 회전시킬 수 있습니다. 자기참조 레버이며, 차입 APR이 본드 APR보다 낮을 때만 작동합니다.",
        steps: [
          "LTV를 보수적으로 40퍼센트 이하로 설정합니다.",
          "RBT 담보를 두고 USDm을 차입한 뒤 30일 본드를 약정합니다. 받은 RBT 일부는 다시 담보로 추가합니다.",
          "차입 APR과 본드 디스카운트 연환산을 매주 비교합니다.",
          "RBT 가격 급락 신호가 보이면 즉시 디레버리지합니다.",
        ],
        reward:
          "동일 자본 위에 1.4에서 1.7배의 본드 회전 효과를 만듭니다. 연환산 40에서 90퍼센트입니다.",
        loss: "RBT 가격 급락 시 청산이 발생합니다. POL과 BAM이 결국 받쳐주지만 청산은 즉시 발생합니다.",
        apr: "40에서 90퍼센트",
        effort: "어려움",
      },
    ],
    allocation: [
      { label: "락업과 본드 (3,3) 콤보", share: 50, color: "#7C6BFF" },
      { label: "HVN 거버넌스 시드", share: 20, color: "#9C8CFF" },
      { label: "RBT 담보 셀프 레버", share: 15, color: "#3DDC97" },
      { label: "현금 대기", share: 15, color: "#6B7589" },
    ],
    weekly: [
      {
        week: "W2",
        action:
          "이전 시간축의 14일 본드 만기를 클레임하고 받은 RBT를 90일 락업으로 굴립니다.",
        tag: "클레임",
      },
      {
        week: "W2~3",
        action: "활성 락 상태에서 첫 30일 본드를 약정합니다. 추가 디스카운트가 자동 적용됩니다.",
        tag: "본드",
      },
      {
        week: "M1~2",
        action: "본드 회전 패턴을 정착시킵니다. 디스카운트 평균 위에서만 진입합니다.",
        tag: "본드",
      },
      { week: "M2~3", action: "HVN TGE 자격을 점검하고 진입을 준비합니다.", tag: "지켜보기" },
      { week: "TGE", action: "HVN 시드에 진입합니다. 풀 깊이가 얕을 때를 활용합니다.", tag: "트레이드" },
      {
        week: "M4",
        action: "RBT lending 화이트리스트 등재 후 셀프 레버를 LTV 40퍼센트로 시작합니다.",
        tag: "트레이드",
      },
      {
        week: "M5",
        action: "락 곡선 v2 거버넌스 표결을 추적합니다. 축소 방향이면 신규 락을 정지합니다.",
        tag: "지켜보기",
      },
      { week: "M6", action: "두 번째 90일 락 롤과 다음 시간축 검토를 진행합니다.", tag: "락업" },
    ],
    stop: [
      "본드 디스카운트가 6주 평균 1.5퍼센트 아래로 떨어지면 콤보만 유지하고 신규 회전을 중단합니다.",
      "락 곡선 v2가 분배를 40퍼센트 이상 축소하는 방향이면 신규 락 진입을 정지합니다.",
      "RBT 담보의 LTV가 가격 변동만으로 50퍼센트에 도달하면 즉시 디레버리지를 진행합니다.",
    ],
  },
  {
    id: "mid",
    code: "T2",
    korean: "중기",
    english: "Reserve Layer Capture",
    windowKR: "6에서 18개월",
    state:
      "Blackhaven이 MegaETH의 reserve layer로 자리잡습니다. 짧은 본드 디스카운트는 거의 0에 수렴하고, 가치는 거버넌스와 RBT의 cross-protocol 활용에서 발생합니다. HVN의 첫 정식 바이백 라운드가 진행됩니다.",
    ifPickThis:
      "디스카운트 사냥은 끝났습니다. 365일 락업으로 코어 포지션을 잡고, RBT를 cross-protocol 워킹 캐피탈로 굴립니다.",
    hero: {
      badge: "1순위, 365일 락업과 365일 본드",
      title: "장기 코어 포지션",
      why: "이 단계에서는 짧은 본드의 디스카운트가 거의 0입니다. 365일 본드만 의미있는 디스카운트가 남고, 365일 락업의 분배 곡선이 가장 가파릅니다. 단순하지만 가장 강력한 구조입니다.",
      steps: [
        "자본 코어를 365일 락업으로 잠급니다.",
        "동시에 365일 본드를 약정합니다. 가장 큰 디스카운트가 적용됩니다.",
        "분기마다 일부 베스팅된 RBT를 새 365일 락으로 굴립니다.",
        "거버넌스에서 곡선 보호 표결에 참여합니다.",
      ],
      reward:
        "고정 분배 약 19퍼센트에 본드 디스카운트와 RBT 자체 가치 상승이 더해져 연환산 25에서 35퍼센트 수익을 안정적으로 만듭니다.",
      loss: "365일 동안 자본이 잠기는 기회비용이 있습니다. 다만 안정성이 가장 높습니다.",
      apr: "25에서 35퍼센트",
      effort: "쉬움",
    },
    extras: [
      {
        badge: "2순위, Cross-protocol RBT",
        title: "RBT를 워킹 캐피탈로 굴리기",
        why: "RBT가 12개 이상의 프로토콜에 페어 또는 담보로 등록되면 같은 RBT가 동시에 여러 곳에서 일합니다. lending 담보, perp 마진, LP를 동시에 운용할 수 있습니다.",
        steps: [
          "각 프로토콜의 RBT 사용처를 매핑합니다.",
          "lending 담보(LTV 40퍼센트)에서 차입한 USDm으로 perp 마진 또는 LP를 구성합니다.",
          "위험가중 수익률을 매주 비교하여 재배분합니다.",
          "한 곳의 청산 캐스케이드가 다른 라인으로 번지지 않도록 노출을 분산합니다.",
        ],
        reward:
          "동일 자본을 1.5에서 2.2배 활용하여 연환산 25에서 60퍼센트 수익을 만듭니다.",
        loss: "한 프로토콜의 청산이 RBT 시장가로 즉시 전파됩니다. 통합 프로토콜별 노출은 25퍼센트를 상한으로 둡니다.",
        apr: "25에서 60퍼센트",
        effort: "어려움",
      },
      {
        badge: "3순위, HVN 거버넌스와 바이백 사이클",
        title: "거버넌스 영향력으로 수익화",
        why: "이 단계의 트레저리는 거버넌스가 처분할 수 있습니다. HVN은 의사결정권이자 바이백 시 가격 점프 트리거입니다. 거버넌스 일정에 맞춘 포지션 빌드가 핵심입니다.",
        steps: [
          "HVN을 일정 비중으로 누적하고 활성 위임을 설정합니다.",
          "분기 거버넌스 어젠다에 맞춰 곡선, 수수료, 바이백 표결에 참여합니다.",
          "바이백 라운드 발표 약 2주 전 비중을 50퍼센트 확대합니다.",
          "라운드 종료 후 비중을 정상화합니다.",
        ],
        reward:
          "바이백 라운드별로 HVN 시장가가 20에서 60퍼센트 점프하며, 영향력도 함께 누적됩니다.",
        loss: "어젠다 부결이나 트레저리 우선순위 변경 시 손실이 발생할 수 있습니다.",
        apr: "마이너스 30에서 플러스 80퍼센트",
        effort: "어려움",
      },
    ],
    allocation: [
      { label: "365일 락업과 365일 본드", share: 40, color: "#7C6BFF" },
      { label: "Cross-protocol RBT", share: 30, color: "#3DDC97" },
      { label: "HVN 거버넌스", share: 20, color: "#9C8CFF" },
      { label: "현금 대기", share: 10, color: "#6B7589" },
    ],
    weekly: [
      { week: "M6", action: "365일 락업으로 코어 포지션을 구축합니다.", tag: "락업" },
      {
        week: "M7",
        action: "RBT가 4개 이상의 lending에 통합됩니다. cross-deploy를 시작합니다.",
        tag: "트레이드",
      },
      {
        week: "M9",
        action: "Sequencer 보상 vault 활성화 거버넌스에 참여합니다.",
        tag: "지켜보기",
      },
      {
        week: "M11",
        action: "락 곡선 자동조정 거버넌스 표결에 참여합니다.",
        tag: "지켜보기",
      },
      {
        week: "M12",
        action: "HVN 첫 정식 바이백 라운드를 앞두고 사전 비중을 확대합니다.",
        tag: "트레이드",
      },
      {
        week: "M18",
        action: "Reserve Layer SDK 출시로 RBT 활용처가 폭증합니다.",
        tag: "지켜보기",
      },
    ],
    stop: [
      "통합 프로토콜 한 곳에서 청산 캐스케이드가 발생하면 같은 라인의 노출을 모두 정리합니다.",
      "거버넌스 quorum이 분기 연속 미달하면 HVN 거버넌스 플레이를 회수합니다.",
      "Backing ratio가 1.02배 아래로 4주 이상 머무르면 365일 락의 신규 진입을 중단합니다.",
    ],
  },
];

export const findScenario = (id: Horizon) =>
  SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];

export { SCENARIOS };
