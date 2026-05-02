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

const EXPLORER = "https://mega.etherscan.io/address/";

type Entry = {
  name: string;
  address: string;
  description: string;
  certainty?: "verified" | "likely";
};

type Section = {
  title: string;
  eyebrow: string;
  description: string;
  entries: Entry[];
};

const SECTIONS: Section[] = [
  {
    eyebrow: "Tokens",
    title: "토큰",
    description:
      "RBT 와 sRBT 가 프로토콜 안에서 도는 두 자산입니다. USDm 은 외부 스테이블코인으로 본드 약정과 NAV backing 의 화폐입니다.",
    entries: [
      {
        name: "RBT",
        address: RBT_TOKEN,
        description:
          "Reserve Backed Token. 본드 베스팅, stake 입력, BAM 매수 burn 의 핵심 자산입니다.",
        certainty: "verified",
      },
      {
        name: "sRBT",
        address: SRBT_TOKEN,
        description:
          "Stacked RBT. RBT 를 stake 하면 1:1 로 발행되며, Commit 의 입력 자산이 됩니다. ERC20 (name=Stacked RBT, symbol=sRBT).",
        certainty: "verified",
      },
      {
        name: "USDm",
        address: USDM_TOKEN,
        description:
          "MegaUSD. 외부 스테이블코인이며 본드 약정과 트레저리 backing 의 단위 자산입니다.",
        certainty: "verified",
      },
    ],
  },
  {
    eyebrow: "Core components",
    title: "코어 컴포넌트",
    description:
      "Zellic 오딧 보고서가 명시한 7개 컴포넌트와 그에 부수된 컨트랙트입니다.",
    entries: [
      {
        name: "BackingCalculator",
        address: BACKING_CALCULATOR,
        description:
          "NAV(), FDV(), mNAV(), singleNAV(token) view 를 노출합니다. multi-token backing 도 정확히 합산하므로 앱이 표시하는 NAV 의 정식 소스입니다. 본 사이트가 이 컨트랙트를 라이브로 호출합니다.",
        certainty: "verified",
      },
      {
        name: "BAM (Backing Arbitrage Module)",
        address: BAM_CONTRACT,
        description:
          "시장가가 NAV 에서 벗어나면 자동 양방향 차익거래로 가격을 NAV 로 수렴시킵니다. 위쪽이면 매도해 트레저리로 환류, 아래쪽이면 매수해 burn 합니다.",
        certainty: "verified",
      },
      {
        name: "RBTNote (Commit lock NFT)",
        address: RBTNOTE_CONTRACT,
        description:
          "사용자 commit position 을 ERC721 NFT 로 발행합니다. sRBT 를 약정 기간 동안 잠그고 만기에 추가 RBT 를 분배합니다. 활성 commit 은 같은 주에 약정하는 본드의 디스카운트도 키웁니다.",
        certainty: "verified",
      },
      {
        name: "LiquidityManager",
        address: LIQUIDITY_MANAGER,
        description:
          "Uniswap V3 RBT/USDm NFT 를 영구 보유합니다. 본드 USDm 의 10퍼센트가 여기로 들어와 protocol-owned liquidity 가 되고, 거래 수수료는 트레저리로 환류됩니다.",
        certainty: "verified",
      },
      {
        name: "Stake",
        address: STAKE_CONTRACT,
        description:
          "RBT 를 sRBT 로 변환합니다. RBT 자본은 sRBT 컨트랙트가 escrow 로 보관합니다.",
        certainty: "likely",
      },
      {
        name: "Minter",
        address: MINTER_CONTRACT,
        description:
          "RBT 발행 권한을 가진 컨트랙트입니다. 자체 RBT/USDm 잔액은 0 입니다.",
        certainty: "likely",
      },
      {
        name: "Oracle",
        address: ORACLE_CONTRACT,
        description:
          "BAM 이 reference 하는 가격 피드입니다. BackingCalculator 의 NAV/FDV 계산도 이 oracle 에 의존합니다.",
        certainty: "verified",
      },
    ],
  },
  {
    eyebrow: "Bonds",
    title: "본드 컨트랙트",
    description:
      "USDm 을 디스카운트로 RBT 와 교환합니다. 만기까지 선형 베스팅이며 약정 자본의 90퍼센트가 트레저리, 10퍼센트가 LiquidityManager 로 분배됩니다.",
    entries: [
      {
        name: "Bond, 7 day (5% discount)",
        address: BOND_CONTRACTS.d7,
        description:
          "최단 만기 본드입니다. 디스카운트는 가장 작지만 자본 회전이 빠릅니다.",
        certainty: "verified",
      },
      {
        name: "Bond, 14 day (10% discount)",
        address: BOND_CONTRACTS.d14,
        description:
          "중간 만기 본드입니다. 풀 깊이가 7일 / 30일에 비해 얕은 편입니다.",
        certainty: "verified",
      },
      {
        name: "Bond, 30 day (15% discount)",
        address: BOND_CONTRACTS.d30,
        description:
          "현재 가장 큰 디스카운트와 가장 깊은 풀을 가진 본드입니다.",
        certainty: "verified",
      },
    ],
  },
  {
    eyebrow: "Treasury & infra",
    title: "트레저리와 인프라",
    description:
      "본드 자본이 흘러 들어가는 트레저리, 외부 거래 풀, deploy 관련 EOA 와 factory 입니다.",
    entries: [
      {
        name: "Treasury (backingStorage)",
        address: TREASURY_CONTRACT,
        description:
          "본드 USDm 의 90퍼센트가 누적되는 backing 컨트랙트입니다. BackingCalculator 의 backingStorage() 호출과 일치합니다.",
        certainty: "verified",
      },
      {
        name: "Kumbaya RBT/USDm pool",
        address: KUMBAYA_PAIR,
        description:
          "현재 RBT 의 메인 거래 페어입니다. dexscreener 라이브 시장가의 출처이기도 합니다.",
        certainty: "verified",
      },
      {
        name: "Proxy Factory",
        address: PROXY_FACTORY,
        description:
          "본드와 commit 류 컨트랙트의 proxy 인스턴스를 생성합니다.",
        certainty: "verified",
      },
      {
        name: "Initial deployer (EOA)",
        address: DEPLOYER_EOA,
        description:
          "최초 자금을 보낸 외부 소유 계정입니다. 코드는 없습니다.",
        certainty: "verified",
      },
      {
        name: "Admin (EOA)",
        address: ADMIN_EOA,
        description:
          "관리자 외부 소유 계정입니다. 본드와 commit, BAM 컨트랙트와 상호작용 한 흔적이 있습니다.",
        certainty: "verified",
      },
    ],
  },
];

const truncate = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export default function Contracts() {
  return (
    <section
      id="contracts"
      className="max-w-6xl mx-auto px-6 pb-20"
    >
      <div className="mb-6">
        <div className="eyebrow">Contracts</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          컨트랙트 매핑
        </h2>
        <p className="mt-2 subhead text-[13px] max-w-2xl">
          MegaETH 메인넷 (chain id 4326) 에 배포된 Blackhaven 컨트랙트 전체입니다. Zellic 오딧 보고서와 onchain selector probing 으로 매핑한 결과입니다. 주소를 클릭하면 explorer 가 열리고, 옆 버튼으로 복사할 수 있습니다.
        </p>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <div className="mb-3">
              <div className="eyebrow">{s.eyebrow}</div>
              <h3 className="mt-1 text-[18px] font-medium text-ink-50">
                {s.title}
              </h3>
              <p className="mt-1 text-[12.5px] text-ink-400 max-w-3xl leading-relaxed">
                {s.description}
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
        likely 표기 항목은 selector 응답이 표준 인터페이스에 매칭되지 않아
        오딧 보고서의 컴포넌트 이름과 1:1 단정이 어려운 컨트랙트입니다. 곧
        verified 메타데이터가 공개되면 갱신하겠습니다.
      </p>
    </section>
  );
}

function ContractRow({ entry }: { entry: Entry }) {
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
              likely
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
            aria-label="copy address"
          >
            {copied ? "copied" : "copy"}
          </button>
        </div>
      </div>
      <p className="text-[12.5px] text-ink-200 leading-relaxed">
        {entry.description}
      </p>
    </div>
  );
}
