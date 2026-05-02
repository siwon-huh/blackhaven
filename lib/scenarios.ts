// Blackhaven 사용자 플레이북.
// 실제 앱(blackhaven.xyz) 옵션을 기준으로 합니다.
// 본드: 7일, 14일, 30일. Stake: RBT → sRBT. Commit: 2주에서 52주 슬라이더.
// docs 의 만기와 곡선 매개변수는 모두 거버넌스 재량으로 명시되어 있어 구체값은 추정입니다.

export type Horizon = "short" | "early" | "mid";

export const MECHANICS = [
  {
    code: "BOND",
    title: "본드 (Bonds)",
    oneLine:
      "USDm을 디스카운트로 RBT와 교환합니다. 만기까지 선형으로 베스팅되며, 약정 자본의 90 퍼센트는 트레저리, 10 퍼센트는 운영비입니다.",
    analogy:
      "OHM 본드와 본질이 동일합니다. 디스카운트는 본드 수요가 적을 때 두꺼워집니다.",
    color: "#7C6BFF",
  },
  {
    code: "STAKE",
    title: "Stake (sRBT)",
    oneLine:
      "RBT를 예치하면 sRBT를 받습니다. sRBT 는 commit 의 입력 자산이며 거버넌스에 따라 별도 보상이 라우팅될 수 있습니다.",
    analogy:
      "OHM 의 sOHM 과 비슷한 위치이지만, rebase 자동 보상 대신 commit 단계로 명시 분리되어 있습니다.",
    color: "#3DDC97",
  },
  {
    code: "COMMIT",
    title: "Commit",
    oneLine:
      "sRBT 를 2주에서 52주까지 약정합니다. 만기에 추가 RBT가 분배되고, 활성 commit 은 본드에 추가 디스카운트를 가산합니다.",
    analogy:
      "약정 길이에 비례해 분배가 가팔라집니다. cap, 곡선, 분배 비율은 거버넌스가 정하며 docs 에는 구체값이 명시되지 않습니다.",
    color: "#9C8CFF",
  },
  {
    code: "BAM",
    title: "BAM (Backing Arbitrage Module)",
    oneLine:
      "RBT 시장가가 NAV 에서 벗어나면 자동으로 양방향 차익거래를 수행합니다. 위쪽이면 매도하여 트레저리로 환류시키고, 아래쪽이면 매수하여 소각합니다.",
    analogy:
      "OHM 의 inverse bond 를 자동, 양방향으로 확장한 모듈입니다. 사용자 입장에서는 자동 페그 봇으로 이해해도 됩니다.",
    color: "#FF6A1F",
  },
  {
    code: "POL",
    title: "POL (Protocol-Owned Liquidity)",
    oneLine:
      "본드로 들어온 USDm 일부가 Liquidity Manager 가 영구 보유하는 Uniswap V3 NFT 가 됩니다. 거래 수수료는 트레저리로 환류됩니다.",
    analogy:
      "OlympusDAO 와 동일합니다. 본드는 결국 POL 을 사기 위한 메커니즘입니다.",
    color: "#F4C756",
  },
];

export const OHM_TLDR = [
  "본드와 POL 은 OHM 과 본질이 같습니다.",
  "OHM 의 stake 와 rebase 는 여기에서는 Stake 와 Commit 두 단계로 명시 분리됩니다. 자동 복리 대신 약정 길이로 보상이 결정됩니다.",
  "OHM 이 수동으로 했던 inverse bond 는 BAM 이 자동, 양방향으로 처리합니다. 사용자는 NAV 근처 매수만 신경 쓰면 됩니다.",
  "OHM 은 토큰 하나가 자산과 거버넌스를 겸했지만, 여기서는 RBT (자산) 와 HVN (거버넌스) 가 분리됩니다. 거버넌스 플레이만 따로 잡을 수 있습니다.",
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
  tag: "본드" | "Commit" | "트레이드" | "클레임" | "지켜보기";
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
      "메인넷 출시 직후 7일의 윈도우입니다. 30일 본드 디스카운트가 가장 두껍게 표시되어 있고, BAM 은 시동 단계라 NAV 이탈 폭이 큽니다. Stake 와 Commit 은 활성화되었지만 reward 곡선이 정착되기 전 구간입니다.",
    ifPickThis:
      "회전이 아니라 시드 포지션을 한 번에 잡습니다. 30일 본드 진입과 Stake 후 Commit 셋업, 시장가 매수까지 첫 주 안에 끝내고 다음 시간축에서 회수합니다.",
    hero: {
      badge: "1순위, 30일 본드 (디스카운트 15퍼센트)",
      title: "출시 직후 두꺼운 본드 진입",
      why: "본드 수요가 정착되기 전 첫 며칠이 디스카운트가 가장 두꺼운 구간입니다. 30일 본드는 현재 앱에서 가장 가파른 디스카운트 (15퍼센트) 를 보여주며 TVL 도 가장 큽니다. 만기는 다음 시간축으로 넘어가 Stake 와 Commit 의 입력 자산이 됩니다.",
      steps: [
        "출시 후 24시간 동안 본드 페이지의 디스카운트와 TVL 흐름을 모니터링합니다.",
        "표시 디스카운트가 평균 위로 두꺼워졌을 때 30일 본드를 약정합니다. USDm 의 90퍼센트는 트레저리로, 10퍼센트는 운영비로 분리됩니다.",
        "베스팅이 시작되면 받는 RBT 를 다음 시간축에서 Stake 와 Commit 으로 굴립니다.",
        "30일 본드 만기 도래 시 즉시 클레임합니다.",
      ],
      reward:
        "디스카운트 15퍼센트와 30일 만기를 결합한 진입가는 시장가 직매수보다 약 15퍼센트 낮습니다. 만기 시점의 RBT 가치와 Stake/Commit 진입을 동시에 확보할 수 있습니다.",
      loss: "베스팅 중 RBT 시장가가 NAV 부근으로 빠르게 수렴하면 디스카운트 효과가 잠식됩니다. 본드 자본은 만기까지 회수가 어렵습니다.",
      apr: "30 ~ 80퍼센트",
      effort: "쉬움",
    },
    extras: [
      {
        badge: "2순위, Stake 후 Commit 셋업",
        title: "활성 commit 으로 본드 디스카운트 가속",
        why: "활성 commit 은 같은 주에 약정하는 본드의 디스카운트를 가산합니다. 보유 RBT 를 sRBT 로 stake 한 뒤 Commit 슬라이더에서 24주 (앱에서 reward 가 약 15.8퍼센트로 표시되는 두꺼운 구간) 로 약정합니다. 만기 곡선과 cap 같은 매개변수는 docs 에 거버넌스 재량으로만 명시되어 있어 앱 슬라이더 표시값이 기준입니다.",
        steps: [
          "보유 RBT 를 Stake 페이지에서 sRBT 로 교환합니다.",
          "Commit 페이지에서 sRBT 를 24주 슬라이더로 설정하고 Commit 을 실행합니다.",
          "활성 commit 상태에서 본드를 약정하면 추가 디스카운트가 자동 적용됩니다.",
          "만기 도래 시 RBT 보상을 클레임하고 다음 라운드 commit 으로 굴립니다.",
        ],
        reward:
          "Commit 24주 약 15.8퍼센트의 RBT 분배와 본드 추가 디스카운트가 결합되어 시드 베이스라인을 만듭니다.",
        loss: "Commit 자본은 약정 기간 동안 회수가 어렵습니다. 만기 전 해지 패널티가 docs 에 명시되어 있습니다.",
        apr: "12 ~ 25퍼센트",
        effort: "보통",
      },
      {
        badge: "3순위, NAV 근처 시드 매수",
        title: "BAM 시동 전 비대칭 진입",
        why: "BAM 이 작은 규모로만 작동하는 첫 며칠은 RBT 가 NAV 아래로 더 깊이 빠지는 윈도우가 자주 옵니다. NAV 는 온체인으로 검증할 수 있는 하한선이라 비대칭이 큽니다.",
        steps: [
          "Backing ratio 를 reserves 나누기 circulating 으로 직접 계산하거나 attestation 으로 확인합니다.",
          "시장가가 NAV 의 플러스마이너스 1퍼센트 안쪽일 때만 매수합니다.",
          "BAM 쿨다운 직후가 진입 적기입니다.",
          "다음 시간축에서 NAV 위 5퍼센트 도달 시 일부를 익절합니다.",
        ],
        reward: "NAV 의 우상향과 시장가 동반 상승의 비대칭 구조입니다.",
        loss: "NAV 위 3퍼센트보다 높은 가격에서 사면 본드보다 효율이 떨어집니다.",
        apr: "5 ~ 30퍼센트",
        effort: "보통",
      },
    ],
    allocation: [
      { label: "30일 본드 (15퍼센트 디스카운트)", share: 50, color: "#7C6BFF" },
      { label: "Stake 후 24주 Commit 셋업", share: 25, color: "#3DDC97" },
      { label: "NAV 근처 시드 매수", share: 15, color: "#FF6A1F" },
      { label: "다음 시간축 진입용 현금 대기", share: 10, color: "#6B7589" },
    ],
    weekly: [
      {
        week: "D-1",
        action:
          "USDm을 사전 준비하고, 본드 라운치 시각과 Commit 슬라이더 옵션을 확인합니다.",
        tag: "지켜보기",
      },
      {
        week: "D0",
        action:
          "메인넷 출시 후 24시간 동안 디스카운트와 TVL 흐름을 모니터링합니다.",
        tag: "지켜보기",
      },
      {
        week: "D0~1",
        action:
          "본드별 TVL 깊이를 확인하고 자본 규모에 맞는 만기를 선택합니다. 디스카운트 평균 위에서 진입합니다.",
        tag: "본드",
      },
      {
        week: "D1~3",
        action:
          "보유 RBT 가 있다면 Stake 후 24주 Commit 으로 셋업해 활성 상태로 만듭니다.",
        tag: "Commit",
      },
      {
        week: "D2~5",
        action: "BAM 쿨다운 직후 NAV 근처에서 시드 매수를 진행합니다.",
        tag: "트레이드",
      },
      {
        week: "D7",
        action:
          "다음 시간축으로 전환합니다. 본드 만기에 받은 RBT 를 Commit 으로 굴립니다.",
        tag: "클레임",
      },
    ],
    stop: [
      "출시 첫 24시간 동안 디스카운트가 1퍼센트 아래로 정착하면 본드 시드 진입을 보류하고 다음 시간축까지 기다립니다.",
      "본드 풀 TVL 이 자본의 20배 이하가 되면 (자본 진입 시 풀의 5퍼센트 초과) 다른 만기로 옮기거나 자본을 분산합니다.",
      "Commit 분배 곡선이 거버넌스로 축소되거나 신규 commit 이 정지되면 시드 자본을 본드 또는 현금으로 재배치합니다.",
      "RBT 시장가가 첫 주 내내 NAV 위 5퍼센트 이상에서 정착하면 시드 매수는 패스하고, 다음 시간축에서 BAM 정착 후 재평가합니다.",
    ],
  },
  {
    id: "early",
    code: "T1",
    korean: "초기",
    english: "Compounding Lane",
    windowKR: "1주 ~ 6개월",
    state:
      "출시 첫 주 이후의 구간입니다. 본드와 Commit 매개변수가 안정화되고, HVN TGE 가 발생하며, RBT 가 외부 lending 에 담보로 화이트리스트됩니다. BAM 이 활발하게 양방향으로 작동하고, 비본드 매출 비중이 30퍼센트 안팎까지 상승합니다.",
    ifPickThis:
      "활성 commit 과 본드 약정을 묶는 콤보가 핵심입니다. 동시에 시장가의 4-layer 위치를 보고 매수와 매도 트레이딩으로 RBT 를 굴립니다.",
    hero: {
      badge: "1순위, Commit 과 본드 콤보",
      title: "활성 Commit 상태로 본드 회전",
      why: "활성 commit 이 본드에 추가 디스카운트를 가산합니다. 같은 USDm 이 commit 분배와 본드 디스카운트, 받은 RBT 의 가치라는 세 갈래로 동시에 일합니다. OHM (3,3) 게임이론의 Blackhaven 버전입니다.",
      steps: [
        "Stake 후 24주 Commit 으로 sRBT 를 약정해 활성 상태를 만듭니다.",
        "활성 commit 상태에서 30일 본드를 약정하면 추가 디스카운트가 자동 적용됩니다.",
        "본드 만기에 받은 RBT 의 일부를 다시 Stake 와 Commit 으로 굴려 commit 큐를 유지합니다.",
        "분기마다 Commit 곡선과 cap 의 거버넌스 표결을 추적합니다.",
      ],
      reward:
        "Commit 분배에 본드 디스카운트와 베스팅 가속이 더해져 연환산 35 ~ 55퍼센트 수익을 만듭니다.",
      loss: "Commit 곡선이 분배 축소 방향으로 가면 효율이 30 ~ 40퍼센트 하락합니다.",
      apr: "35 ~ 55퍼센트",
      effort: "보통",
    },
    extras: [
      {
        badge: "2순위, RBT 매수와 매도 사이클",
        title: "Verdict 기반 시장 진입과 익절",
        why: "RBT 시장가는 4-layer 모델 (Floor, Yield-fair, Bond Effective, Market) 사이를 오갑니다. 저평가 구간에서 매수해 본드 effective 부근에서 익절하는 사이클을 잡으면, Commit 자본 외 별도의 트레이딩 수익을 만들 수 있습니다. BAM 의 자동 양방향 작동이 가격을 NAV 근처로 끌어당기는 평균 회귀 압력을 활용합니다.",
        steps: [
          "Live 페이지의 verdict 가 저평가 또는 공정 구간에 들어왔을 때 매수합니다.",
          "verdict 가 본드 권장 구간 위로 올라오면 1차 익절합니다.",
          "고평가 구간에 진입하면 추가 매수를 중단하고 보유분도 점진 매도합니다.",
          "BAM 쿨다운 직후가 가격 변동성이 가장 크므로 진입과 청산 모두 그 윈도우를 활용합니다.",
        ],
        reward:
          "사이클당 5 ~ 15퍼센트의 스프레드를 잡으면 월 1 ~ 2회 회전으로 연환산 30 ~ 90퍼센트가 만들어집니다.",
        loss: "BAM 이 자동으로 가격을 끌어당기지만 셸링이 깨질 가능성도 있습니다. 매수 후 매도 신호가 한참 안 나오면 Commit 으로 전환해 분배 보상으로 회수합니다.",
        apr: "30 ~ 90퍼센트",
        effort: "보통",
      },
      {
        badge: "3순위, HVN TGE 시드",
        title: "거버넌스 토큰 진입",
        why: "HVN 은 LP 수수료, BAM 스프레드, 트레저리 잉여의 거버넌스 처분권입니다. 바이백 발표가 가격 트리거이고, 초기 분배가 가장 두껍습니다.",
        steps: [
          "TGE 자격 조건을 확인합니다. Commit 보유와 본드 누적이 자격 요건일 가능성이 높습니다.",
          "TGE 직후 풀 깊이가 얕을 때 진입합니다.",
          "거버넌스 포럼에서 바이백 일정과 수수료 분배 안건을 모니터링합니다.",
          "바이백 발표 약 2주 전 비중을 확대합니다.",
        ],
        reward:
          "초기 평가와 바이백 라운드의 시장가 점프가 결합되어 마이너스 50퍼센트에서 플러스 200퍼센트의 비대칭 구조를 만듭니다.",
        loss: "거버넌스 토큰은 항상 실패할 수 있습니다. 자본의 20퍼센트를 상한으로 둡니다.",
        apr: "−50 ~ +200퍼센트",
        effort: "어려움",
      },
      {
        badge: "4순위, RBT 셀프 레버",
        title: "RBT 담보로 USDm 차입 후 본드",
        why: "RBT 가 lending 에 화이트리스트되면 RBT 담보를 두면서 차입한 USDm 으로 본드를 추가로 회전시킬 수 있습니다. 자기참조 레버이며, 차입 APR 이 본드 APR 보다 낮을 때만 작동합니다.",
        steps: [
          "LTV 를 보수적으로 40퍼센트 이하로 설정합니다.",
          "RBT 담보를 두고 USDm 을 차입한 뒤 30일 본드를 약정합니다. 받은 RBT 일부는 다시 담보로 추가합니다.",
          "차입 APR 과 본드 디스카운트 연환산을 매주 비교합니다.",
          "RBT 가격 급락 신호가 보이면 즉시 디레버리지합니다.",
        ],
        reward:
          "동일 자본 위에 1.4 ~ 1.7배의 본드 회전 효과를 만듭니다. 연환산 40 ~ 90퍼센트입니다.",
        loss: "RBT 가격 급락 시 청산이 발생합니다. POL 과 BAM 이 결국 받쳐주지만 청산은 즉시 발생합니다.",
        apr: "40 ~ 90퍼센트",
        effort: "어려움",
      },
    ],
    allocation: [
      { label: "Commit 과 본드 콤보", share: 45, color: "#7C6BFF" },
      { label: "RBT 매수/매도 사이클", share: 20, color: "#F4C756" },
      { label: "HVN 거버넌스 시드", share: 15, color: "#9C8CFF" },
      { label: "RBT 셀프 레버", share: 10, color: "#3DDC97" },
      { label: "현금 대기", share: 10, color: "#6B7589" },
    ],
    weekly: [
      {
        week: "W2",
        action:
          "이전 시간축의 30일 본드 만기를 클레임하고 받은 RBT 를 Stake 후 Commit 으로 굴립니다.",
        tag: "클레임",
      },
      {
        week: "W2~3",
        action:
          "활성 commit 상태에서 다음 30일 본드를 약정합니다. 추가 디스카운트가 자동 적용됩니다.",
        tag: "본드",
      },
      {
        week: "M1~2",
        action:
          "본드 풀 TVL 변화율을 매주 점검하고 회전 빈도와 만기 분산을 조정합니다.",
        tag: "지켜보기",
      },
      {
        week: "M1~2",
        action:
          "Live verdict 가 저평가 또는 공정으로 떨어지면 시장가 매수, 본드 권장 위로 회복하면 1차 익절을 진행합니다.",
        tag: "트레이드",
      },
      {
        week: "M2~3",
        action: "HVN TGE 자격을 점검하고 진입을 준비합니다.",
        tag: "지켜보기",
      },
      {
        week: "TGE",
        action: "HVN 시드에 진입합니다. 풀 깊이가 얕을 때를 활용합니다.",
        tag: "트레이드",
      },
      {
        week: "M4",
        action:
          "RBT lending 화이트리스트 등재 후 셀프 레버를 LTV 40퍼센트로 시작합니다.",
        tag: "트레이드",
      },
      {
        week: "M5",
        action:
          "Commit 곡선의 거버넌스 표결을 추적합니다. 축소 방향이면 신규 commit 을 정지합니다.",
        tag: "지켜보기",
      },
      {
        week: "M6",
        action: "두 번째 24주 Commit 롤과 다음 시간축 검토를 진행합니다.",
        tag: "Commit",
      },
    ],
    stop: [
      "본드 디스카운트가 6주 평균 1.5퍼센트 아래로 떨어지면 콤보만 유지하고 신규 회전을 중단합니다.",
      "Verdict 가 한 달 이상 고평가 구간에 머무르면 매수/매도 사이클을 중단합니다.",
      "RBT 담보의 LTV 가 가격 변동만으로 50퍼센트에 도달하면 즉시 디레버리지를 진행합니다.",
    ],
  },
  {
    id: "mid",
    code: "T2",
    korean: "중기",
    english: "Reserve Layer Capture",
    windowKR: "6 ~ 18개월",
    state:
      "Blackhaven 이 MegaETH 의 reserve layer 로 자리잡습니다. 짧은 본드 디스카운트는 거의 0 에 수렴하고, 가치는 거버넌스와 RBT 의 cross-protocol 활용에서 발생합니다. HVN 의 첫 정식 바이백 라운드가 진행됩니다. 더 긴 만기 본드와 Commit 곡선이 거버넌스로 도입될 수 있는 구간이며, 본문에서 명시한 만기는 현재 앱 옵션을 기준으로 합니다.",
    ifPickThis:
      "디스카운트 사냥은 끝났습니다. 52주 Commit 으로 코어 포지션을 잡고, RBT 를 cross-protocol 워킹 캐피탈로 굴립니다.",
    hero: {
      badge: "1순위, 52주 Commit 과 30일 본드 회전",
      title: "장기 코어와 단기 회전",
      why: "이 단계에서는 짧은 본드의 디스카운트가 거의 0 에 수렴합니다. 거버넌스로 더 긴 만기 본드가 도입되지 않은 상태에서는 30일 본드의 잔존 디스카운트로 회전하고, 코어 자본은 현재 앱의 최대 commit 인 52주 슬라이더로 잠가 가장 가파른 분배 곡선을 확보합니다.",
      steps: [
        "코어 자본을 Stake 후 52주 Commit 으로 잠급니다.",
        "30일 본드를 회전시키며 디스카운트가 평균 위인 시점에만 약정합니다.",
        "분기마다 일부 받은 RBT 를 새 commit 으로 굴려 분배 큐를 유지합니다.",
        "거버넌스에서 곡선 보호와 더 긴 만기 본드 옵션 도입 표결에 참여합니다.",
      ],
      reward:
        "Commit 52주의 가파른 분배에 본드 디스카운트와 RBT 자체 가치 상승이 더해져 연환산 25 ~ 35퍼센트 수익을 안정적으로 만듭니다.",
      loss: "52주 동안 코어 자본이 잠기는 기회비용이 있습니다. 다만 안정성이 가장 높습니다.",
      apr: "25 ~ 35퍼센트",
      effort: "쉬움",
    },
    extras: [
      {
        badge: "2순위, Cross-protocol RBT",
        title: "RBT 를 워킹 캐피탈로 굴리기",
        why: "RBT 가 12 개 이상의 프로토콜에 페어 또는 담보로 등록되면 같은 RBT 가 동시에 여러 곳에서 일합니다. lending 담보, perp 마진, LP 를 동시에 운용할 수 있습니다.",
        steps: [
          "각 프로토콜의 RBT 사용처를 매핑합니다.",
          "lending 담보 (LTV 40퍼센트) 에서 차입한 USDm 으로 perp 마진 또는 LP 를 구성합니다.",
          "위험가중 수익률을 매주 비교하여 재배분합니다.",
          "한 곳의 청산 캐스케이드가 다른 라인으로 번지지 않도록 노출을 분산합니다.",
        ],
        reward:
          "동일 자본을 1.5 ~ 2.2배 활용하여 연환산 25 ~ 60퍼센트 수익을 만듭니다.",
        loss: "한 프로토콜의 청산이 RBT 시장가로 즉시 전파됩니다. 통합 프로토콜별 노출은 25퍼센트를 상한으로 둡니다.",
        apr: "25 ~ 60퍼센트",
        effort: "어려움",
      },
      {
        badge: "3순위, HVN 거버넌스와 바이백 사이클",
        title: "거버넌스 영향력으로 수익화",
        why: "이 단계의 트레저리는 거버넌스가 처분할 수 있습니다. HVN 은 의사결정권이자 바이백 시 가격 점프 트리거입니다. 거버넌스 일정에 맞춘 포지션 빌드가 핵심입니다.",
        steps: [
          "HVN 을 일정 비중으로 누적하고 활성 위임을 설정합니다.",
          "분기 거버넌스 어젠다에 맞춰 곡선과 수수료, 바이백 표결에 참여합니다.",
          "바이백 라운드 발표 약 2주 전 비중을 50퍼센트 확대합니다.",
          "라운드 종료 후 비중을 정상화합니다.",
        ],
        reward:
          "바이백 라운드별로 HVN 시장가가 20 ~ 60퍼센트 점프하며, 영향력도 함께 누적됩니다.",
        loss: "어젠다 부결이나 트레저리 우선순위 변경 시 손실이 발생할 수 있습니다.",
        apr: "−30 ~ +80퍼센트",
        effort: "어려움",
      },
    ],
    allocation: [
      { label: "52주 Commit 과 30일 본드 회전", share: 40, color: "#7C6BFF" },
      { label: "Cross-protocol RBT", share: 30, color: "#3DDC97" },
      { label: "HVN 거버넌스", share: 20, color: "#9C8CFF" },
      { label: "현금 대기", share: 10, color: "#6B7589" },
    ],
    weekly: [
      {
        week: "M6",
        action: "52주 Commit 으로 코어 포지션을 구축합니다.",
        tag: "Commit",
      },
      {
        week: "M7",
        action:
          "RBT 가 4 개 이상의 lending 에 통합됩니다. cross-deploy 를 시작합니다.",
        tag: "트레이드",
      },
      {
        week: "M9",
        action: "Sequencer 보상 vault 활성화 거버넌스에 참여합니다.",
        tag: "지켜보기",
      },
      {
        week: "M11",
        action:
          "Commit 곡선 자동조정과 더 긴 만기 본드 도입 표결에 참여합니다.",
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
      "거버넌스 quorum 이 분기 연속 미달하면 HVN 거버넌스 플레이를 회수합니다.",
      "Backing ratio 가 1.02 배 아래로 4주 이상 머무르면 52주 Commit 신규 진입을 중단합니다.",
    ],
  },
];

export const findScenario = (id: Horizon) =>
  SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];

export { SCENARIOS };
