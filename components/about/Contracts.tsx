"use client";

import { useState } from "react";
import {
  ADMIN_EOA,
  BACKING_CALCULATOR,
  BAM_CONTRACT,
  BOND_CONTRACTS,
  DEPLOYER_EOA,
  KUMBAYA_PAIR,
  LIQUIDITY_MANAGER,
  MINTER_CONTRACT,
  ORACLE_CONTRACT,
  PROXY_FACTORY,
  RBT_TOKEN,
  RBTNOTE_CONTRACT,
  SRBT_TOKEN,
  STAKE_CONTRACT,
  TREASURY_CONTRACT,
  USDM_TOKEN,
} from "@/lib/contracts";
import { lc, type LocaleString } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

const EXPLORER = "https://mega.etherscan.io/address/";

type Entry = {
  name: string;
  address: string;
  description: LocaleString;
  certainty?: "verified" | "likely";
};

type Section = {
  titleKey: string;
  eyebrowKey: string;
  descKey: string;
  entries: Entry[];
};

const SECTIONS: Section[] = [
  {
    eyebrowKey: "about.contracts.tokens.eyebrow",
    titleKey: "about.contracts.tokens.title",
    descKey: "about.contracts.tokens.desc",
    entries: [
      {
        name: "RBT",
        address: RBT_TOKEN,
        description: {
          ko: "Reserve Backed Token. 본드 베스팅, stake 입력, BAM 매수 burn 의 핵심 자산입니다.",
          en: "Reserve Backed Token. Core asset for bond vesting, stake input, and BAM buy/burn.",
        },
        certainty: "verified",
      },
      {
        name: "sRBT",
        address: SRBT_TOKEN,
        description: {
          ko: "Stacked RBT. RBT 를 stake 하면 1:1 로 발행되며, Commit 의 입력 자산이 됩니다. ERC20 (name=Stacked RBT, symbol=sRBT).",
          en: "Stacked RBT. Minted 1:1 when RBT is staked. Acts as the input asset for Commit. ERC20 (name=Stacked RBT, symbol=sRBT).",
        },
        certainty: "verified",
      },
      {
        name: "USDm",
        address: USDM_TOKEN,
        description: {
          ko: "MegaUSD. 외부 스테이블코인이며 본드 약정과 트레저리 backing 의 단위 자산입니다.",
          en: "MegaUSD. External stablecoin, the unit of account for bond commits and treasury backing.",
        },
        certainty: "verified",
      },
    ],
  },
  {
    eyebrowKey: "about.contracts.core.eyebrow",
    titleKey: "about.contracts.core.title",
    descKey: "about.contracts.core.desc",
    entries: [
      {
        name: "BackingCalculator",
        address: BACKING_CALCULATOR,
        description: {
          ko: "NAV(), FDV(), mNAV(), singleNAV(token) view 를 노출합니다. multi-token backing 도 정확히 합산하므로 앱이 표시하는 NAV 의 정식 소스입니다. 본 사이트가 이 컨트랙트를 라이브로 호출합니다.",
          en: "Exposes NAV(), FDV(), mNAV(), and singleNAV(token) views. Aggregates multi-token backing accurately, so this is the canonical source for the NAV the app displays. This site calls it live.",
        },
        certainty: "verified",
      },
      {
        name: "BAM (Backing Arbitrage Module)",
        address: BAM_CONTRACT,
        description: {
          ko: "시장가가 NAV 에서 벗어나면 자동 양방향 차익거래로 가격을 NAV 로 수렴시킵니다. 위쪽이면 매도해 트레저리로 환류, 아래쪽이면 매수해 burn 합니다.",
          en: "Runs automatic two-sided arbitrage to push price back toward NAV. Sells back to treasury when above, buys and burns when below.",
        },
        certainty: "verified",
      },
      {
        name: "RBTNote (Commit lock NFT)",
        address: RBTNOTE_CONTRACT,
        description: {
          ko: "사용자 commit position 을 ERC721 NFT 로 발행합니다. sRBT 를 약정 기간 동안 잠그고 만기에 추가 RBT 를 분배합니다. 활성 commit 은 같은 주에 약정하는 본드의 디스카운트도 키웁니다.",
          en: "Mints an ERC721 NFT for each commit position. Locks sRBT for the commit term and distributes extra RBT at maturity. An active commit also raises the discount for bonds committed the same week.",
        },
        certainty: "verified",
      },
      {
        name: "LiquidityManager",
        address: LIQUIDITY_MANAGER,
        description: {
          ko: "Uniswap V3 RBT/USDm NFT 를 영구 보유합니다. 본드 USDm 의 10퍼센트가 여기로 들어와 protocol-owned liquidity 가 되고, 거래 수수료는 트레저리로 환류됩니다.",
          en: "Permanently holds the Uniswap V3 RBT/USDm NFT. 10% of bond USDm flows here as protocol-owned liquidity, and trading fees flow back to treasury.",
        },
        certainty: "verified",
      },
      {
        name: "Stake",
        address: STAKE_CONTRACT,
        description: {
          ko: "RBT 를 sRBT 로 변환합니다. RBT 자본은 sRBT 컨트랙트가 escrow 로 보관합니다.",
          en: "Converts RBT into sRBT. The sRBT contract escrows the RBT capital.",
        },
        certainty: "likely",
      },
      {
        name: "Minter",
        address: MINTER_CONTRACT,
        description: {
          ko: "RBT 발행 권한을 가진 컨트랙트입니다. 자체 RBT/USDm 잔액은 0 입니다.",
          en: "The contract authorized to mint RBT. Holds zero RBT or USDm itself.",
        },
        certainty: "likely",
      },
      {
        name: "Oracle",
        address: ORACLE_CONTRACT,
        description: {
          ko: "BAM 이 reference 하는 가격 피드입니다. BackingCalculator 의 NAV/FDV 계산도 이 oracle 에 의존합니다.",
          en: "Price feed referenced by BAM. BackingCalculator's NAV/FDV calculations also rely on this oracle.",
        },
        certainty: "verified",
      },
    ],
  },
  {
    eyebrowKey: "about.contracts.bonds.eyebrow",
    titleKey: "about.contracts.bonds.title",
    descKey: "about.contracts.bonds.desc",
    entries: [
      {
        name: "Bond, 7 day (5% discount)",
        address: BOND_CONTRACTS.d7,
        description: {
          ko: "최단 만기 본드입니다. 디스카운트는 가장 작지만 자본 회전이 빠릅니다.",
          en: "Shortest tenor. Smallest discount, but capital rotates fastest.",
        },
        certainty: "verified",
      },
      {
        name: "Bond, 14 day (10% discount)",
        address: BOND_CONTRACTS.d14,
        description: {
          ko: "중간 만기 본드입니다. 풀 깊이가 7일 / 30일에 비해 얕은 편입니다.",
          en: "Mid tenor. Pool depth tends to be shallower than the 7-day or 30-day.",
        },
        certainty: "verified",
      },
      {
        name: "Bond, 30 day (15% discount)",
        address: BOND_CONTRACTS.d30,
        description: {
          ko: "현재 가장 큰 디스카운트와 가장 깊은 풀을 가진 본드입니다.",
          en: "Currently the largest discount and the deepest pool.",
        },
        certainty: "verified",
      },
    ],
  },
  {
    eyebrowKey: "about.contracts.treasury.eyebrow",
    titleKey: "about.contracts.treasury.title",
    descKey: "about.contracts.treasury.desc",
    entries: [
      {
        name: "Treasury (backingStorage)",
        address: TREASURY_CONTRACT,
        description: {
          ko: "본드 USDm 의 90퍼센트가 누적되는 backing 컨트랙트입니다. BackingCalculator 의 backingStorage() 호출과 일치합니다.",
          en: "The backing contract where 90% of bond USDm accumulates. Matches BackingCalculator's backingStorage() call.",
        },
        certainty: "verified",
      },
      {
        name: "Kumbaya RBT/USDm pool",
        address: KUMBAYA_PAIR,
        description: {
          ko: "현재 RBT 의 메인 거래 페어입니다. dexscreener 라이브 시장가의 출처이기도 합니다.",
          en: "The main trading pair for RBT today. Also the source for the live dexscreener price.",
        },
        certainty: "verified",
      },
      {
        name: "Proxy Factory",
        address: PROXY_FACTORY,
        description: {
          ko: "본드와 commit 류 컨트랙트의 proxy 인스턴스를 생성합니다.",
          en: "Creates proxy instances for bond and commit-style contracts.",
        },
        certainty: "verified",
      },
      {
        name: "Initial deployer (EOA)",
        address: DEPLOYER_EOA,
        description: {
          ko: "최초 자금을 보낸 외부 소유 계정입니다. 코드는 없습니다.",
          en: "Externally-owned account that sent the initial funding. No code.",
        },
        certainty: "verified",
      },
      {
        name: "Admin (EOA)",
        address: ADMIN_EOA,
        description: {
          ko: "관리자 외부 소유 계정입니다. 본드와 commit, BAM 컨트랙트와 상호작용 한 흔적이 있습니다.",
          en: "Admin externally-owned account. Has traces of interaction with bond, commit, and BAM contracts.",
        },
        certainty: "verified",
      },
    ],
  },
];

const truncate = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export default function Contracts() {
  const t = useT();
  return (
    <section id="contracts" className="max-w-6xl mx-auto px-6 pb-20">
      <div className="mb-6">
        <div className="eyebrow">{t("about.contracts.eyebrow")}</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          {t("about.contracts.heading")}
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          {t("about.contracts.intro")}
        </p>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <div key={s.titleKey}>
            <div className="mb-3">
              <div className="eyebrow">{t(s.eyebrowKey)}</div>
              <h3 className="mt-1 text-[18px] font-medium text-ink-50">
                {t(s.titleKey)}
              </h3>
              <p className="mt-1 text-[12.5px] text-ink-400 max-w-3xl leading-relaxed">
                {t(s.descKey)}
              </p>
            </div>
            <div className="card divide-y divide-white/5 overflow-hidden">
              {s.entries.map((e) => (
                <ContractRow key={e.address} entry={e} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[11px] text-ink-500 leading-relaxed">
        {t("about.contracts.likelyNote")}
      </p>
    </section>
  );
}

function ContractRow({ entry }: { entry: Entry }) {
  const t = useT();
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(entry.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-4 px-5 py-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-medium text-ink-50">
            {entry.name}
          </span>
          {entry.certainty === "likely" && (
            <span
              className="font-mono text-[10px] px-1.5 py-0.5 rounded"
              style={{
                color: "var(--warn)",
                background: "rgba(244,199,86,0.08)",
              }}
            >
              {t("about.contracts.likelyChip")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`${EXPLORER}${entry.address}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11.5px] text-ink-300 hover:text-ink-50 underline underline-offset-4 decoration-ink-600 hover:decoration-ink-300"
            title={entry.address}
          >
            {truncate(entry.address)}
          </a>
          <button
            onClick={onCopy}
            className="text-[10.5px] font-mono text-ink-500 hover:text-ink-50 px-1.5 py-0.5 rounded border hairline transition-colors"
            aria-label={t("about.contracts.copyAria")}
          >
            {copied ? t("common.copied") : t("common.copy")}
          </button>
        </div>
      </div>
      <p className="text-[12.5px] text-ink-200 leading-relaxed">
        {lc(entry.description, locale)}
      </p>
    </div>
  );
}
