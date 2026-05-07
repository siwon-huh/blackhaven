// Blackhaven 사용자 플레이북.
// 실제 앱(blackhaven.xyz) 옵션을 기준으로 합니다.
// 본드: 7일, 14일, 30일. Stake: RBT → sRBT. Commit: 2주에서 52주 슬라이더.
// docs 의 만기와 곡선 매개변수는 모두 거버넌스 재량으로 명시되어 있어 구체값은 추정입니다.

import type { LocaleString } from "@/lib/i18n";

export type Horizon = "short" | "early" | "mid";
export type Effort = "easy" | "moderate" | "hard";
export type WeekTag = "bond" | "commit" | "trade" | "claim" | "watch";

export const MECHANICS: Array<{
  code: string;
  title: LocaleString;
  oneLine: LocaleString;
  analogy: LocaleString;
  color: string;
}> = [
  {
    code: "BOND",
    title: { ko: "본드 (Bonds)", en: "Bonds" },
    oneLine: {
      ko: "USDm을 디스카운트로 RBT와 교환합니다. 만기까지 선형으로 베스팅되며, 약정 자본의 90 퍼센트는 트레저리, 10 퍼센트는 운영비입니다.",
      en: "Swap USDm for RBT at a discount. Vests linearly to maturity. 90% of committed capital goes to treasury, 10% to ops.",
    },
    analogy: {
      ko: "OHM 본드와 본질이 동일합니다. 디스카운트는 본드 수요가 적을 때 커집니다.",
      en: "Same mechanism as OHM bonds. The discount widens when bond demand is low.",
    },
    color: "#7C6BFF",
  },
  {
    code: "STAKE",
    title: { ko: "Stake (sRBT)", en: "Stake (sRBT)" },
    oneLine: {
      ko: "RBT를 예치하면 sRBT를 받습니다. sRBT 는 commit 의 입력 자산이며 거버넌스에 따라 별도 보상이 라우팅될 수 있습니다.",
      en: "Deposit RBT and receive sRBT. sRBT is the input asset for Commit, and governance can route additional rewards to it.",
    },
    analogy: {
      ko: "OHM 의 sOHM 과 비슷한 위치이지만, rebase 자동 보상 대신 commit 단계로 명시 분리되어 있습니다.",
      en: "Similar role to OHM's sOHM, but instead of automatic rebase rewards it is explicitly separated into the Commit step.",
    },
    color: "#3DDC97",
  },
  {
    code: "COMMIT",
    title: { ko: "Commit", en: "Commit" },
    oneLine: {
      ko: "sRBT 를 2주에서 52주까지 약정합니다. 만기에 추가 RBT가 분배되고, 활성 commit 은 본드에 추가 디스카운트를 가산합니다.",
      en: "Lock sRBT for 2 to 52 weeks. Extra RBT is distributed at maturity, and an active commit adds an additional discount on top of bond pricing.",
    },
    analogy: {
      ko: "약정 길이에 비례해 분배가 가팔라집니다. cap, 곡선, 분배 비율은 거버넌스가 정하며 docs 에는 구체값이 명시되지 않습니다.",
      en: "Distribution steepens with commit length. Cap, curve, and distribution ratio are set by governance; the docs do not specify concrete values.",
    },
    color: "#9C8CFF",
  },
  {
    code: "BAM",
    title: {
      ko: "BAM (Backing Arbitrage Module)",
      en: "BAM (Backing Arbitrage Module)",
    },
    oneLine: {
      ko: "RBT 시장가가 NAV 에서 벗어나면 자동으로 양방향 차익거래를 수행합니다. 위쪽이면 매도하여 트레저리로 환류하고, 아래쪽이면 매수하여 소각합니다.",
      en: "Runs automatic two-sided arbitrage when RBT market price drifts from NAV. Above NAV it sells back to treasury, below NAV it buys and burns.",
    },
    analogy: {
      ko: "OHM 의 inverse bond 를 자동, 양방향으로 확장한 모듈입니다. 사용자 입장에서는 자동 페그 봇으로 이해해도 됩니다.",
      en: "An automatic, two-sided extension of OHM's inverse bond. From a user perspective, treat it as an automatic peg-bot.",
    },
    color: "#FF6A1F",
  },
  {
    code: "POL",
    title: {
      ko: "POL (Protocol-Owned Liquidity)",
      en: "POL (Protocol-Owned Liquidity)",
    },
    oneLine: {
      ko: "본드로 들어온 USDm 일부가 Liquidity Manager 가 영구 보유하는 Uniswap V3 NFT 가 됩니다. 거래 수수료는 트레저리로 환류됩니다.",
      en: "A portion of bond USDm becomes a Uniswap V3 NFT held permanently by the Liquidity Manager. Trading fees flow back to the treasury.",
    },
    analogy: {
      ko: "OlympusDAO 와 동일합니다. 본드는 결국 POL 을 확보하기 위한 메커니즘입니다.",
      en: "Same as OlympusDAO. Bonds are ultimately the mechanism to acquire POL.",
    },
    color: "#F4C756",
  },
];

export const OHM_TLDR: LocaleString[] = [
  {
    ko: "본드와 POL 은 OHM 과 본질이 같습니다.",
    en: "Bonds and POL are mechanically the same as OHM.",
  },
  {
    ko: "OHM 의 stake 와 rebase 는 여기에서는 Stake 와 Commit 두 단계로 명시 분리됩니다. 자동 복리 대신 약정 길이로 보상이 결정됩니다.",
    en: "OHM's stake and rebase are explicitly split into Stake and Commit here. Reward is set by commit length instead of automatic compounding.",
  },
  {
    ko: "OHM 이 수동으로 했던 inverse bond 는 BAM 이 자동, 양방향으로 처리합니다. 사용자는 NAV 근처 매수만 신경 쓰면 됩니다.",
    en: "BAM handles, automatically and on both sides, the inverse bond OHM did manually. Users only need to focus on buying near NAV.",
  },
];

export type Play = {
  badge: LocaleString;
  title: LocaleString;
  why: LocaleString;
  steps: LocaleString[];
  reward: LocaleString;
  loss: LocaleString;
  apr: LocaleString;
  effort: Effort;
};

export type Allocation = {
  label: LocaleString;
  share: number;
  color: string;
};

export type WeekStep = {
  week: string;
  action: LocaleString;
  tag: WeekTag;
};

export type ScenarioDefinition = {
  id: Horizon;
  code: string;
  name: LocaleString;
  tagline: LocaleString;
  window: LocaleString;
  state: LocaleString;
  ifPickThis: LocaleString;
  hero: Play;
  extras: Play[];
  allocation: Allocation[];
  weekly: WeekStep[];
  stop: LocaleString[];
};

const SCENARIOS: ScenarioDefinition[] = [
  {
    id: "short",
    code: "T0",
    name: { ko: "초단기", en: "Launch Week" },
    tagline: { ko: "Launch Week", en: "Day 0 to 7" },
    window: { ko: "0~7일", en: "0~7d" },
    state: {
      ko: "메인넷 출시 직후 7일의 윈도우입니다. 30일 본드 디스카운트가 가장 두껍게 표시되어 있고, BAM 은 시동 단계라 NAV 이탈 폭이 큽니다. Stake 는 활성화되어 있지만 Commit 은 available yield 가 채워지기 전이라 아직 라이브되지 않았습니다. Commit 이 라이브되는 시점이 트리거입니다.",
      en: "The 7-day window right after mainnet launch. The 30-day bond discount is at its widest, BAM is still spinning up so deviation from NAV runs large. Stake is live, but Commit is not yet live, it waits for available yield to fill. The moment Commit goes live is the trigger.",
    },
    ifPickThis: {
      ko: "회전이 아니라 시드 포지션을 한 번에 잡습니다. 30일 본드 진입과 Stake 까지 첫 주 안에 끝내고, Commit 은 라이브되는 즉시 약정해 다음 시간축에서 회수합니다.",
      en: "Build a seed position once, not on a rotation. Finish the 30-day bond entry and Stake within the first week, and commit the moment Commit goes live so you can harvest in the next horizon.",
    },
    hero: {
      badge: {
        ko: "1순위, 30일 본드 (디스카운트 15퍼센트)",
        en: "Top pick, 30-day bond (15% discount)",
      },
      title: {
        ko: "출시 직후 두꺼운 본드 진입",
        en: "Enter the deep bond right after launch",
      },
      why: {
        ko: "본드 수요가 정착되기 전 첫 며칠이 디스카운트가 가장 두꺼운 구간입니다. 30일 본드는 현재 앱에서 가장 가파른 디스카운트 (15퍼센트) 를 보여주며 TVL 도 가장 큽니다. 만기는 다음 시간축으로 넘어가 Stake 와 Commit 의 입력 자산이 됩니다.",
        en: "Bond demand has not stabilized in the first few days, so the discount is at its widest. The 30-day bond shows the steepest discount in the app today (15%) and has the largest TVL. Maturity rolls into the next horizon and feeds Stake and Commit.",
      },
      steps: [
        {
          ko: "출시 후 24시간 동안 본드 페이지의 디스카운트와 TVL 흐름을 모니터링합니다.",
          en: "Monitor bond discount and TVL flow on the bond page for the first 24 hours after launch.",
        },
        {
          ko: "표시 디스카운트가 평균 위로 두꺼워졌을 때 30일 본드를 약정합니다. USDm 의 90퍼센트는 트레저리로, 10퍼센트는 운영비로 분리됩니다.",
          en: "Commit the 30-day bond when the displayed discount is above its running average. 90% of USDm goes to treasury, 10% to operations.",
        },
        {
          ko: "베스팅이 시작되면 받는 RBT 를 우선 Stake 로 sRBT 화합니다. Commit 은 라이브 전이라 sRBT 만 확보해 둡니다.",
          en: "Once vesting starts, stake the received RBT into sRBT first. Commit is not yet live, so just hold sRBT in reserve.",
        },
        {
          ko: "Commit 페이지에서 available yield 가 채워져 라이브되는 즉시 24주 슬라이더로 sRBT 를 약정합니다.",
          en: "The moment Commit goes live (available yield is filled), commit the staged sRBT for 24 weeks.",
        },
        {
          ko: "30일 본드 만기 도래 시 즉시 클레임합니다.",
          en: "Claim the 30-day bond immediately on maturity.",
        },
      ],
      reward: {
        ko: "디스카운트 15퍼센트와 30일 만기를 결합한 진입가는 시장가 직매수보다 약 15퍼센트 낮습니다. 만기 시점의 RBT 가치와 Stake/Commit 진입을 동시에 확보할 수 있습니다.",
        en: "A 15% discount combined with a 30-day vest puts your entry about 15% below spot. You secure RBT value at maturity and a Stake/Commit entry at the same time.",
      },
      loss: {
        ko: "베스팅 중 RBT 시장가가 NAV 부근으로 빠르게 수렴하면 디스카운트 효과가 줄어듭니다. 본드 자본은 만기까지 회수가 어렵습니다.",
        en: "If RBT market price converges to NAV during vesting, the discount edge shrinks. Bond capital is hard to recover before maturity.",
      },
      apr: { ko: "30 ~ 80퍼센트", en: "30 ~ 80%" },
      effort: "easy",
    },
    extras: [
      {
        badge: {
          ko: "2순위, Stake 우선, Commit 라이브 시 즉시 약정",
          en: "2nd pick, Stake first, commit the moment Commit goes live",
        },
        title: {
          ko: "Commit 라이브 트리거 대기",
          en: "Wait for the Commit-live trigger",
        },
        why: {
          ko: "Commit 은 available yield 가 채워질 때까지 라이브되지 않습니다. 그동안에는 RBT 를 미리 sRBT 로 stake 해 두고 Commit 페이지에서 라이브 여부를 매일 확인합니다. 라이브되는 즉시 24주 슬라이더 (앱에서 reward 가 약 15.8 퍼센트로 표시되는 두꺼운 구간) 로 약정해야 활성 commit 가 본드 디스카운트에 가산됩니다. 만기 곡선과 cap 같은 매개변수는 docs 에 거버넌스 재량으로만 명시되어 있어 앱 슬라이더 표시값이 기준입니다.",
          en: "Commit stays inactive until available yield fills. While you wait, stake RBT into sRBT in advance and check the Commit page daily for the live state. The moment it goes live, set the slider to 24 weeks (where the app shows ~15.8% reward, the deep band) so the active commit can stack on bond discounts. Curve and cap parameters are governance-discretionary in the docs, so the app slider readings are the reference.",
        },
        steps: [
          {
            ko: "보유 RBT 를 Stake 페이지에서 sRBT 로 교환합니다 (지금 가능).",
            en: "Convert your RBT to sRBT on the Stake page (available now).",
          },
          {
            ko: "Commit 페이지의 available yield 와 라이브 상태를 매일 점검합니다.",
            en: "Check the Commit page for available yield and live state daily.",
          },
          {
            ko: "Commit 이 라이브되는 즉시 sRBT 를 24주 슬라이더로 설정하고 Commit 을 실행합니다.",
            en: "The moment Commit goes live, set the slider to 24 weeks and execute the commit.",
          },
          {
            ko: "활성 commit 상태에서 본드를 약정하면 추가 디스카운트가 자동 적용됩니다.",
            en: "With an active commit, committing a bond automatically adds the bonus discount.",
          },
          {
            ko: "만기 도래 시 RBT 보상을 클레임하고 다음 라운드 commit 으로 굴립니다.",
            en: "Claim the RBT reward at maturity and roll into the next commit round.",
          },
        ],
        reward: {
          ko: "Commit 24주 약 15.8퍼센트의 RBT 분배와 본드 추가 디스카운트가 결합되어 시드 베이스라인을 만듭니다. Commit 라이브 시점에 가장 먼저 진입한 자본일수록 분배 큐 위치가 유리합니다.",
          en: "About 15.8% RBT distribution at 24-week commit combined with the bond bonus discount creates the seed baseline. Capital that enters at the moment Commit goes live gets a better queue position in the distribution.",
        },
        loss: {
          ko: "Commit 자본은 약정 기간 동안 회수가 어렵습니다. 중도 해지 페널티가 docs 에 명시되어 있습니다. 또한 Commit 라이브 일정은 거버넌스 재량이므로 늦어질 수 있습니다.",
          en: "Committed capital is hard to recover during the lock. The early-exit penalty is documented. Also, the Commit-live schedule is governance-discretionary and can slip.",
        },
        apr: { ko: "12 ~ 25퍼센트", en: "12 ~ 25%" },
        effort: "moderate",
      },
      {
        badge: {
          ko: "3순위, NAV 근처 시드 매수",
          en: "3rd pick, near-NAV seed buy",
        },
        title: {
          ko: "BAM 시동 전 비대칭 진입",
          en: "Asymmetric entry before BAM warms up",
        },
        why: {
          ko: "BAM 이 작은 규모로만 작동하는 첫 며칠은 RBT 가 NAV 아래로 더 깊이 빠지는 윈도우가 자주 옵니다. NAV 는 온체인으로 검증할 수 있는 하한선이라 비대칭이 큽니다.",
          en: "In the first few days while BAM only operates at small size, RBT often dips well below NAV. NAV is an on-chain verifiable floor, so the asymmetry is large.",
        },
        steps: [
          {
            ko: "Backing ratio 를 reserves 를 circulating supply 로 나누어 직접 계산하거나 attestation 으로 확인합니다.",
            en: "Compute backing ratio directly as reserves / circulating supply, or verify via attestation.",
          },
          {
            ko: "시장가가 NAV 의 ±1 퍼센트 안쪽일 때만 매수합니다.",
            en: "Only buy when market price is within ±1% of NAV.",
          },
          {
            ko: "BAM 쿨다운 직후가 진입 적기입니다.",
            en: "Entry windows are best right after a BAM cooldown.",
          },
          {
            ko: "다음 시간축에서 NAV 위 5퍼센트에 도달하면 일부를 익절합니다.",
            en: "Take some profit when price reaches NAV+5% in the next horizon.",
          },
        ],
        reward: {
          ko: "NAV 의 우상향과 시장가 동반 상승의 비대칭 구조입니다.",
          en: "Asymmetric structure where NAV trends up and market price rises with it.",
        },
        loss: {
          ko: "NAV 위 3퍼센트보다 높은 가격에서 사면 본드보다 효율이 떨어집니다.",
          en: "Buying above NAV+3% is less efficient than going through a bond.",
        },
        apr: { ko: "5 ~ 30퍼센트", en: "5 ~ 30%" },
        effort: "moderate",
      },
    ],
    allocation: [
      {
        label: {
          ko: "30일 본드 (15퍼센트 디스카운트)",
          en: "30-day bond (15% discount)",
        },
        share: 50,
        color: "#7C6BFF",
      },
      {
        label: {
          ko: "Stake 후 24주 Commit 셋업",
          en: "Stake plus 24-week Commit setup",
        },
        share: 25,
        color: "#3DDC97",
      },
      {
        label: { ko: "NAV 근처 시드 매수", en: "Near-NAV seed buy" },
        share: 15,
        color: "#FF6A1F",
      },
      {
        label: {
          ko: "다음 시간축 진입용 현금 대기",
          en: "Cash for next-horizon entry",
        },
        share: 10,
        color: "#6B7589",
      },
    ],
    weekly: [
      {
        week: "D-1",
        action: {
          ko: "USDm을 사전 준비하고, 본드 출시 시각과 Commit 슬라이더 옵션을 확인합니다.",
          en: "Pre-fund USDm and check the bond launch time and Commit slider options.",
        },
        tag: "watch",
      },
      {
        week: "D0",
        action: {
          ko: "메인넷 출시 후 24시간 동안 디스카운트와 TVL 흐름을 모니터링합니다.",
          en: "Monitor discount and TVL flow for 24h after mainnet launch.",
        },
        tag: "watch",
      },
      {
        week: "D0~1",
        action: {
          ko: "본드별 TVL 깊이를 확인하고 자본 규모에 맞는 만기를 선택합니다. 디스카운트 평균 위에서 진입합니다.",
          en: "Check bond pool depth, pick a tenor sized to your capital, and enter when the discount is above its running average.",
        },
        tag: "bond",
      },
      {
        week: "D1~3",
        action: {
          ko: "보유 RBT 를 Stake 로 sRBT 화해 둡니다. Commit 은 available yield 가 채워지기 전이라 라이브 여부를 매일 점검합니다.",
          en: "Stake any held RBT into sRBT. Commit is not live yet (available yield is still filling), so check the Commit page daily for live state.",
        },
        tag: "commit",
      },
      {
        week: "Commit live",
        action: {
          ko: "Commit 이 라이브되는 즉시 sRBT 를 24주 슬라이더로 약정합니다. 라이브 트리거가 가장 중요한 분배 큐 진입 시점입니다.",
          en: "The moment Commit goes live, commit the staged sRBT for 24 weeks. The live trigger is the most important entry point for the distribution queue.",
        },
        tag: "commit",
      },
      {
        week: "D2~5",
        action: {
          ko: "BAM 쿨다운 직후 NAV 근처에서 시드 매수를 진행합니다.",
          en: "Run the seed buy near NAV right after a BAM cooldown.",
        },
        tag: "trade",
      },
      {
        week: "D7",
        action: {
          ko: "다음 시간축으로 전환합니다. 본드 만기에 받은 RBT 를 Commit 으로 굴립니다.",
          en: "Roll into the next horizon. Take the RBT from bond maturity into a Commit.",
        },
        tag: "claim",
      },
    ],
    stop: [
      {
        ko: "출시 첫 24시간 동안 디스카운트가 1퍼센트 아래로 정착하면 본드 시드 진입을 보류하고 다음 시간축까지 기다립니다.",
        en: "If discount settles below 1% in the first 24 hours, hold the seed bond entry and wait for the next horizon.",
      },
      {
        ko: "본드 풀 TVL 이 자본의 20배 이하가 되면 (자본 진입 시 풀의 5퍼센트 초과) 다른 만기로 옮기거나 자본을 분산합니다.",
        en: "If bond pool TVL drops below 20× your capital (you would exceed 5% of the pool), switch tenor or split your capital.",
      },
      {
        ko: "Commit 라이브가 2 주 이상 지연되면 sRBT 보유분을 일부 Stake 만 유지하고 일부는 시장 매도 기회를 검토합니다. 분배 큐 진입의 시간 가치가 줄어듭니다.",
        en: "If Commit-live is delayed for more than 2 weeks, keep part of the sRBT in Stake and consider selling another part. The time value of getting an early queue position shrinks.",
      },
      {
        ko: "Commit 분배 곡선이 거버넌스로 축소되거나 신규 commit 이 정지되면 시드 자본을 본드 또는 현금으로 재배치합니다.",
        en: "If the Commit distribution curve is reduced by governance or new commits are paused, reallocate seed capital to bonds or cash.",
      },
      {
        ko: "RBT 시장가가 첫 주 내내 NAV 위 5퍼센트 이상에서 정착하면 시드 매수는 패스하고, 다음 시간축에서 BAM 정착 후 재평가합니다.",
        en: "If RBT market price stays above NAV+5% for the entire first week, skip the seed buy and re-evaluate after BAM stabilizes in the next horizon.",
      },
    ],
  },
  {
    id: "early",
    code: "T1",
    name: { ko: "초기", en: "Compounding Lane" },
    tagline: { ko: "Compounding Lane", en: "Week 1 to month 6" },
    window: { ko: "1주 ~ 6개월", en: "1w ~ 6mo" },
    state: {
      ko: "출시 첫 주 이후의 구간입니다. 본드와 Commit 매개변수가 안정화되고, RBT 가 외부 lending 에 담보로 화이트리스트됩니다. BAM 이 활발하게 양방향으로 작동하고, 비본드 매출 비중이 30퍼센트 안팎까지 상승합니다. 이 시간축의 hero 는 Commit 이 라이브된 이후를 가정합니다, 라이브 전이라면 T0 에 머무르며 Stake 만 미리 셋업해 둡니다.",
      en: "The window after launch week. Bond and Commit parameters stabilize, and RBT gets whitelisted as collateral on external lending. BAM is actively running both sides, and non-bond revenue share climbs to around 30%. This horizon's hero assumes Commit has gone live; if it has not yet, stay in T0 and pre-stage with Stake.",
    },
    ifPickThis: {
      ko: "활성 commit 과 본드 약정을 묶는 콤보가 핵심입니다. 동시에 시장가의 4-layer 위치를 보고 매수와 매도 트레이딩으로 RBT 를 굴립니다.",
      en: "The active-commit plus bond-commit combo is the core. In parallel, watch the 4-layer position of market price and rotate RBT through buy/sell trading.",
    },
    hero: {
      badge: {
        ko: "1순위, Commit 과 본드 콤보",
        en: "Top pick, Commit and bond combo",
      },
      title: {
        ko: "활성 Commit 상태로 본드 회전",
        en: "Rotate bonds while keeping Commit active",
      },
      why: {
        ko: "활성 commit 이 본드에 추가 디스카운트를 가산합니다. 같은 USDm 이 commit 분배와 본드 디스카운트, 받은 RBT 의 가치라는 세 갈래로 동시에 일합니다. OHM (3,3) 게임이론의 Blackhaven 버전입니다.",
        en: "An active commit adds an extra discount to bonds. The same USDm works in three places at once: commit distribution, bond discount, and the value of the RBT received. The Blackhaven version of OHM's (3,3).",
      },
      steps: [
        {
          ko: "Stake 후 24주 Commit 으로 sRBT 를 약정해 활성 상태를 만듭니다.",
          en: "Stake, then commit sRBT for 24 weeks to keep the active state.",
        },
        {
          ko: "활성 commit 상태에서 30일 본드를 약정하면 추가 디스카운트가 자동 적용됩니다.",
          en: "While the commit is active, committing a 30-day bond auto-applies the bonus discount.",
        },
        {
          ko: "본드 만기에 받은 RBT 의 일부를 다시 Stake 와 Commit 으로 굴려 commit 큐를 유지합니다.",
          en: "Roll part of the RBT received at bond maturity back through Stake and Commit to keep the commit queue alive.",
        },
        {
          ko: "분기마다 Commit 곡선과 cap 의 거버넌스 표결을 추적합니다.",
          en: "Track the governance votes on the Commit curve and cap each quarter.",
        },
      ],
      reward: {
        ko: "Commit 분배에 본드 디스카운트와 베스팅 가속이 더해져 연환산 35 ~ 55퍼센트 수익을 만듭니다.",
        en: "Commit distribution plus bond discount plus vesting acceleration produces 35 ~ 55% annualized.",
      },
      loss: {
        ko: "Commit 곡선이 분배 축소 쪽으로 결정되면 효율이 30 ~ 40퍼센트 하락합니다.",
        en: "If the Commit curve is decided toward distribution reduction, efficiency drops 30 ~ 40%.",
      },
      apr: { ko: "35 ~ 55퍼센트", en: "35 ~ 55%" },
      effort: "moderate",
    },
    extras: [
      {
        badge: {
          ko: "2순위, RBT 매수와 매도 사이클",
          en: "2nd pick, RBT buy/sell cycle",
        },
        title: {
          ko: "Verdict 기반 시장 진입과 익절",
          en: "Verdict-driven entry and take-profit",
        },
        why: {
          ko: "RBT 시장가는 4-layer 모델 (Floor, Yield-fair, Bond Effective, Market) 사이를 오갑니다. 저평가 구간에서 매수해 본드 effective 부근에서 익절하는 사이클을 잡으면, Commit 자본 외 별도의 트레이딩 수익을 만들 수 있습니다. BAM 의 자동 양방향 작동이 가격을 NAV 근처로 끌어당기는 평균 회귀 압력을 활용합니다.",
          en: "RBT price oscillates across the 4-layer model (Floor, Yield-fair, Bond Effective, Market). Buy in the undervalued zone and take profit near Bond Effective for trading income on top of Commit capital. Uses BAM's automatic two-sided pull toward NAV as a mean-reversion force.",
        },
        steps: [
          {
            ko: "Live 페이지의 verdict 가 저평가 또는 공정 구간에 들어왔을 때 매수합니다.",
            en: "Buy when the Live verdict reads undervalued or fair.",
          },
          {
            ko: "verdict 가 본드 권장 구간 위로 올라오면 1차 익절합니다.",
            en: "Take first profit when the verdict moves above bond-only.",
          },
          {
            ko: "고평가 구간에 진입하면 추가 매수를 중단하고 보유분도 점진적으로 매도합니다.",
            en: "Stop adding when overvalued and gradually sell down the position.",
          },
          {
            ko: "BAM 쿨다운 직후가 가격 변동성이 가장 크므로 진입과 청산 모두 그 윈도우를 활용합니다.",
            en: "Use the post-BAM-cooldown window for both entry and exit, when price volatility is highest.",
          },
        ],
        reward: {
          ko: "사이클당 5 ~ 15퍼센트의 스프레드를 잡으면 월 1 ~ 2회 회전으로 연환산 30 ~ 90퍼센트가 만들어집니다.",
          en: "Capturing 5 ~ 15% spread per cycle and rotating 1 ~ 2 times per month yields 30 ~ 90% annualized.",
        },
        loss: {
          ko: "BAM 이 자동으로 가격을 끌어당기지만 셸링이 깨질 가능성도 있습니다. 매수 후 매도 신호가 한참 안 나오면 Commit 으로 전환해 분배 보상으로 회수합니다.",
          en: "BAM automatically pulls price back, but Schelling can still break. If the sell signal does not come for a long time after buying, convert into Commit to recover via distribution.",
        },
        apr: { ko: "30 ~ 90퍼센트", en: "30 ~ 90%" },
        effort: "moderate",
      },
      {
        badge: {
          ko: "3순위, RBT 셀프 레버",
          en: "3rd pick, RBT self-leverage",
        },
        title: {
          ko: "RBT 담보로 USDm 차입 후 본드",
          en: "Borrow USDm against RBT, then bond",
        },
        why: {
          ko: "RBT 가 lending 에 화이트리스트되면 RBT 담보를 두면서 차입한 USDm 으로 본드를 추가로 회전시킬 수 있습니다. 자기참조 레버이며, 차입 APR 이 본드 APR 보다 낮을 때만 작동합니다.",
          en: "Once RBT is whitelisted for lending, you can post RBT as collateral and use the borrowed USDm to roll more bonds. It is a self-referential leverage and only works while borrow APR is below bond APR.",
        },
        steps: [
          {
            ko: "LTV 를 보수적으로 40퍼센트 이하로 설정합니다.",
            en: "Set LTV conservatively, under 40%.",
          },
          {
            ko: "RBT 담보를 두고 USDm 을 차입한 뒤 30일 본드를 약정합니다. 받은 RBT 일부는 다시 담보로 추가합니다.",
            en: "Post RBT as collateral, borrow USDm, commit a 30-day bond, and add part of the received RBT back to collateral.",
          },
          {
            ko: "차입 APR 과 본드 디스카운트 연환산을 매주 비교합니다.",
            en: "Compare borrow APR to annualized bond discount weekly.",
          },
          {
            ko: "RBT 가격 급락 신호가 보이면 즉시 디레버리지합니다.",
            en: "Deleverage immediately when RBT shows sharp drop signals.",
          },
        ],
        reward: {
          ko: "동일 자본 위에 1.4 ~ 1.7배의 본드 회전 효과를 만듭니다. 연환산 40 ~ 90퍼센트입니다.",
          en: "Creates 1.4 ~ 1.7× bond rotation on the same capital. 40 ~ 90% annualized.",
        },
        loss: {
          ko: "RBT 가격 급락 시 청산이 발생합니다. POL 과 BAM 이 결국 받쳐주지만 청산은 즉시 발생합니다.",
          en: "Sharp RBT drops trigger liquidation. POL and BAM eventually defend price, but liquidation is immediate.",
        },
        apr: { ko: "40 ~ 90퍼센트", en: "40 ~ 90%" },
        effort: "hard",
      },
    ],
    allocation: [
      {
        label: { ko: "Commit 과 본드 콤보", en: "Commit and bond combo" },
        share: 50,
        color: "#7C6BFF",
      },
      {
        label: { ko: "RBT 매수/매도 사이클", en: "RBT buy/sell cycle" },
        share: 25,
        color: "#F4C756",
      },
      {
        label: { ko: "RBT 셀프 레버", en: "RBT self-leverage" },
        share: 15,
        color: "#3DDC97",
      },
      {
        label: { ko: "현금 대기", en: "Cash on hand" },
        share: 10,
        color: "#6B7589",
      },
    ],
    weekly: [
      {
        week: "W2",
        action: {
          ko: "이전 시간축의 30일 본드 만기를 클레임하고 받은 RBT 를 Stake 후 Commit 으로 굴립니다.",
          en: "Claim the previous horizon's 30-day bond and roll the RBT through Stake plus Commit.",
        },
        tag: "claim",
      },
      {
        week: "W2~3",
        action: {
          ko: "활성 commit 상태에서 다음 30일 본드를 약정합니다. 추가 디스카운트가 자동 적용됩니다.",
          en: "Commit the next 30-day bond while the commit is active. The bonus discount applies automatically.",
        },
        tag: "bond",
      },
      {
        week: "M1~2",
        action: {
          ko: "본드 풀 TVL 변화율을 매주 점검하고 회전 빈도와 만기 분산을 조정합니다.",
          en: "Check bond-pool TVL change weekly and adjust rotation frequency and tenor split.",
        },
        tag: "watch",
      },
      {
        week: "M1~2",
        action: {
          ko: "Live verdict 가 저평가 또는 공정으로 떨어지면 시장가 매수, 본드 권장 위로 회복하면 1차 익절을 진행합니다.",
          en: "Buy spot when the Live verdict drops to undervalued or fair; take first profit when it recovers above bond-only.",
        },
        tag: "trade",
      },
      {
        week: "M4",
        action: {
          ko: "RBT lending 화이트리스트 등재 후 셀프 레버를 LTV 40퍼센트로 시작합니다.",
          en: "After RBT lending whitelisting, start self-leverage at 40% LTV.",
        },
        tag: "trade",
      },
      {
        week: "M5",
        action: {
          ko: "Commit 곡선의 거버넌스 표결을 추적합니다. 축소 쪽으로 결정되면 신규 commit 을 정지합니다.",
          en: "Track governance votes on the Commit curve. Pause new commits if the decision is to shrink it.",
        },
        tag: "watch",
      },
      {
        week: "M6",
        action: {
          ko: "두 번째 24주 Commit 롤과 다음 시간축 검토를 진행합니다.",
          en: "Roll the second 24-week Commit and review the next horizon.",
        },
        tag: "commit",
      },
    ],
    stop: [
      {
        ko: "본드 디스카운트가 6주 평균 1.5퍼센트 아래로 떨어지면 콤보만 유지하고 신규 회전을 중단합니다.",
        en: "If 6-week average bond discount falls below 1.5%, hold only the combo and stop new rotations.",
      },
      {
        ko: "Verdict 가 한 달 이상 고평가 구간에 머무르면 매수/매도 사이클을 중단합니다.",
        en: "If verdict stays overvalued for more than a month, stop the buy/sell cycle.",
      },
      {
        ko: "RBT 담보의 LTV 가 가격 변동만으로 50퍼센트에 도달하면 즉시 디레버리지를 진행합니다.",
        en: "If RBT-collateral LTV reaches 50% from price moves alone, deleverage immediately.",
      },
    ],
  },
  {
    id: "mid",
    code: "T2",
    name: { ko: "중기", en: "Reserve Layer Capture" },
    tagline: { ko: "Reserve Layer Capture", en: "Month 6 to 18" },
    window: { ko: "6 ~ 18개월", en: "6 ~ 18mo" },
    state: {
      ko: "Blackhaven 이 MegaETH 의 reserve layer 로 자리잡습니다. 짧은 본드 디스카운트는 거의 0 에 수렴하고, 가치는 RBT 의 cross-protocol 활용과 트레저리 잉여에서 발생합니다. 더 긴 만기 본드와 Commit 곡선이 거버넌스로 도입될 수 있는 구간이며, 본문에서 명시한 만기는 현재 앱 옵션을 기준으로 합니다.",
      en: "Blackhaven settles in as the reserve layer of MegaETH. Short bond discounts converge to near zero, and value comes from cross-protocol use of RBT and treasury surplus. Longer-tenor bonds and Commit curves may be introduced by governance; tenors mentioned here reflect current app options.",
    },
    ifPickThis: {
      ko: "디스카운트 사냥은 끝났습니다. 52주 Commit 으로 코어 포지션을 잡고, RBT 를 cross-protocol 워킹 캐피탈로 굴립니다.",
      en: "The discount hunt is over. Build a core position with a 52-week Commit and run RBT as cross-protocol working capital.",
    },
    hero: {
      badge: {
        ko: "1순위, 52주 Commit 과 30일 본드 회전",
        en: "Top pick, 52-week Commit plus 30-day bond rotation",
      },
      title: {
        ko: "장기 코어와 단기 회전",
        en: "Long-term core, short-term rotation",
      },
      why: {
        ko: "이 단계에서는 짧은 본드의 디스카운트가 거의 0 에 수렴합니다. 거버넌스로 더 긴 만기 본드가 도입되지 않은 상태에서는 30일 본드의 잔존 디스카운트로 회전하고, 코어 자본은 현재 앱의 최대 commit 인 52주 슬라이더로 잠가 가장 가파른 분배 곡선을 확보합니다.",
        en: "Short bond discounts have converged to near zero. Until governance adds longer tenors, rotate on the residual 30-day bond discount and lock core capital with the current 52-week max Commit for the steepest distribution curve.",
      },
      steps: [
        {
          ko: "코어 자본을 Stake 후 52주 Commit 으로 잠급니다.",
          en: "Lock core capital with Stake plus a 52-week Commit.",
        },
        {
          ko: "30일 본드를 회전시키며 디스카운트가 평균 위인 시점에만 약정합니다.",
          en: "Rotate the 30-day bond, only committing when discount is above average.",
        },
        {
          ko: "분기마다 일부 받은 RBT 를 새 commit 으로 굴려 분배 큐를 유지합니다.",
          en: "Each quarter, roll some of the received RBT into a new commit to keep the distribution queue alive.",
        },
        {
          ko: "거버넌스에서 곡선 보호와 더 긴 만기 본드 옵션 도입 표결에 참여합니다.",
          en: "Vote in governance to protect the curve and to add longer-tenor bond options.",
        },
      ],
      reward: {
        ko: "Commit 52주의 가파른 분배에 본드 디스카운트와 RBT 자체 가치 상승이 더해져 연환산 25 ~ 35퍼센트 수익을 안정적으로 만듭니다.",
        en: "Steep 52-week Commit distribution plus bond discount plus RBT appreciation produces a stable 25 ~ 35% annualized.",
      },
      loss: {
        ko: "52주 동안 코어 자본이 잠기는 기회비용이 있습니다. 다만 안정성이 가장 높습니다.",
        en: "There is opportunity cost from locking core capital for 52 weeks, but stability is highest.",
      },
      apr: { ko: "25 ~ 35퍼센트", en: "25 ~ 35%" },
      effort: "easy",
    },
    extras: [
      {
        badge: {
          ko: "2순위, Cross-protocol RBT",
          en: "2nd pick, Cross-protocol RBT",
        },
        title: {
          ko: "RBT 를 워킹 캐피탈로 굴리기",
          en: "Use RBT as working capital",
        },
        why: {
          ko: "RBT 가 12 개 이상의 프로토콜에 페어 또는 담보로 등록되면 같은 RBT 가 동시에 여러 곳에서 일합니다. lending 담보, perp 마진, LP 를 동시에 운용할 수 있습니다.",
          en: "When RBT is listed as a pair or collateral across more than 12 protocols, the same RBT works in several places at once: lending collateral, perp margin, and LP simultaneously.",
        },
        steps: [
          {
            ko: "각 프로토콜의 RBT 사용처를 매핑합니다.",
            en: "Map RBT usage across each protocol.",
          },
          {
            ko: "lending 담보 (LTV 40퍼센트) 에서 차입한 USDm 으로 perp 마진 또는 LP 를 구성합니다.",
            en: "Borrow USDm against RBT collateral (40% LTV) and use it for perp margin or LP.",
          },
          {
            ko: "위험가중 수익률을 매주 비교하여 재배분합니다.",
            en: "Compare risk-weighted returns weekly and rebalance.",
          },
          {
            ko: "한 곳의 청산 캐스케이드가 다른 라인으로 번지지 않도록 노출을 분산합니다.",
            en: "Spread exposure so a liquidation cascade in one venue does not propagate to others.",
          },
        ],
        reward: {
          ko: "동일 자본을 1.5 ~ 2.2배 활용하여 연환산 25 ~ 60퍼센트 수익을 만듭니다.",
          en: "Activates the same capital at 1.5 ~ 2.2× for 25 ~ 60% annualized.",
        },
        loss: {
          ko: "한 프로토콜의 청산이 RBT 시장가로 즉시 전파됩니다. 통합 프로토콜별 노출은 25퍼센트를 상한으로 둡니다.",
          en: "A single-protocol liquidation propagates to RBT market price immediately. Cap per-protocol exposure at 25%.",
        },
        apr: { ko: "25 ~ 60퍼센트", en: "25 ~ 60%" },
        effort: "hard",
      },
    ],
    allocation: [
      {
        label: {
          ko: "52주 Commit 과 30일 본드 회전",
          en: "52-week Commit plus 30-day bond rotation",
        },
        share: 50,
        color: "#7C6BFF",
      },
      {
        label: { ko: "Cross-protocol RBT", en: "Cross-protocol RBT" },
        share: 35,
        color: "#3DDC97",
      },
      {
        label: { ko: "현금 대기", en: "Cash on hand" },
        share: 15,
        color: "#6B7589",
      },
    ],
    weekly: [
      {
        week: "M6",
        action: {
          ko: "52주 Commit 으로 코어 포지션을 구축합니다.",
          en: "Build the core position with a 52-week Commit.",
        },
        tag: "commit",
      },
      {
        week: "M7",
        action: {
          ko: "RBT 가 4 개 이상의 lending 에 통합됩니다. cross-deploy 를 시작합니다.",
          en: "RBT is integrated into 4+ lending venues. Start cross-deploy.",
        },
        tag: "trade",
      },
      {
        week: "M9",
        action: {
          ko: "Sequencer 보상 vault 활성화 거버넌스에 참여합니다.",
          en: "Vote in the governance proposal to activate the Sequencer reward vault.",
        },
        tag: "watch",
      },
      {
        week: "M11",
        action: {
          ko: "Commit 곡선 자동조정과 더 긴 만기 본드 도입 표결에 참여합니다.",
          en: "Vote on Commit curve auto-adjustment and longer-tenor bond introduction.",
        },
        tag: "watch",
      },
      {
        week: "M18",
        action: {
          ko: "Reserve Layer SDK 출시로 RBT 활용처가 폭증합니다.",
          en: "Reserve Layer SDK launches, RBT use-cases expand sharply.",
        },
        tag: "watch",
      },
    ],
    stop: [
      {
        ko: "통합 프로토콜 한 곳에서 청산 캐스케이드가 발생하면 같은 라인의 노출을 모두 정리합니다.",
        en: "If a liquidation cascade hits one integrated protocol, clean out all exposure on that line.",
      },
      {
        ko: "Backing ratio 가 1.02 배 아래로 4주 이상 머무르면 52주 Commit 신규 진입을 중단합니다.",
        en: "If backing ratio stays below 1.02× for 4+ weeks, stop new 52-week Commit entries.",
      },
    ],
  },
];

export const findScenario = (id: Horizon) =>
  SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];

export { SCENARIOS };
