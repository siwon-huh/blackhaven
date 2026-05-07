// Commit 컨트랙트 메트릭 (RBTNote 가 보유한 sRBT 합계 = commit lock 자본).
// sRBT.balanceOf(RBTNote) 로 onchain 라이브.
//
// 모든 read 를 같은 blockNumber 에 핀닝해서 RPC 로드밸런서가 다른 높이의 노드로
// 라우팅해도 한 응답 내에서는 일관된 스냅샷을 보장합니다. 짧은 TTL 캐시 + coalescing
// 으로 1 초 폴링 간 진동도 흡수.

import { NextResponse } from "next/server";
import { createPublicClient, http, erc20Abi, defineChain } from "viem";
import {
  COMMIT_CONTRACT,
  MEGAETH_CHAIN_ID,
  MEGAETH_RPC,
  RBT_TOKEN,
  SRBT_TOKEN,
  STAKE_CONTRACT,
} from "@/lib/contracts";

export const dynamic = "force-dynamic";

const STATIC_COMMIT_24W_REWARD = 0.158;

const megaeth = defineChain({
  id: MEGAETH_CHAIN_ID,
  name: "MegaETH",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [MEGAETH_RPC] } },
});

const client = createPublicClient({
  chain: megaeth,
  transport: http(MEGAETH_RPC),
});

type Snapshot = {
  tvlSRBT: number;
  totalStakeSRBT: number;
  stakeBackingRBT: number;
  rewardPoolRBT: number;
  blockNumber: string;
};

const CACHE_TTL_MS = 3_000;
let cache: { ts: number; data: Snapshot } | null = null;
let inflight: Promise<Snapshot | null> | null = null;

async function fetchSnapshot(): Promise<Snapshot | null> {
  const now = Date.now();
  if (cache && now - cache.ts < CACHE_TTL_MS) return cache.data;
  if (inflight) return inflight;

  const p = (async (): Promise<Snapshot | null> => {
    try {
      // 1) latest block 을 한 번 받아와서 모든 read 를 같은 블록에 고정.
      const blockNumber = await client.getBlockNumber();
      const opts = { blockNumber };

      const [committedSRBT, totalSRBT, stakeRBT, commitRewardPoolRBT] =
        await Promise.all([
          client.readContract({
            address: SRBT_TOKEN as `0x${string}`,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [COMMIT_CONTRACT as `0x${string}`],
            ...opts,
          }) as Promise<bigint>,
          client.readContract({
            address: SRBT_TOKEN as `0x${string}`,
            abi: erc20Abi,
            functionName: "totalSupply",
            ...opts,
          }) as Promise<bigint>,
          client.readContract({
            address: RBT_TOKEN as `0x${string}`,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [SRBT_TOKEN as `0x${string}`],
            ...opts,
          }) as Promise<bigint>,
          client.readContract({
            address: RBT_TOKEN as `0x${string}`,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [COMMIT_CONTRACT as `0x${string}`],
            ...opts,
          }) as Promise<bigint>,
        ]);

      const fac = 1e18;
      const data: Snapshot = {
        tvlSRBT: Number(committedSRBT) / fac,
        totalStakeSRBT: Number(totalSRBT) / fac,
        stakeBackingRBT: Number(stakeRBT) / fac,
        rewardPoolRBT: Number(commitRewardPoolRBT) / fac,
        blockNumber: blockNumber.toString(),
      };
      cache = { ts: Date.now(), data };
      return data;
    } catch {
      return null;
    }
  })();

  inflight = p;
  p.finally(() => {
    if (inflight === p) inflight = null;
  });
  return p;
}

export async function GET() {
  const snapshot = await fetchSnapshot();
  const live = snapshot ?? cache?.data ?? null;

  if (!live) {
    return NextResponse.json({
      ok: true,
      stake: { totalSRBT: 0, backingRBT: 0 },
      commit: { tvlSRBT: null, reward24w: STATIC_COMMIT_24W_REWARD },
      capturedAt: new Date().toISOString(),
      source: "static",
      reason: "rpc fetch failed, no cache available",
    });
  }

  const stale = !snapshot;

  return NextResponse.json({
    ok: true,
    stale,
    stake: {
      totalSRBT: live.totalStakeSRBT,
      backingRBT: live.stakeBackingRBT,
    },
    commit: {
      tvlSRBT: live.tvlSRBT,
      reward24w: STATIC_COMMIT_24W_REWARD,
      rewardPoolRBT: live.rewardPoolRBT,
    },
    capturedAt: new Date().toISOString(),
    source: "onchain",
    blockNumber: live.blockNumber,
    addresses: {
      srbt: SRBT_TOKEN,
      rbtnote: COMMIT_CONTRACT,
      stake: STAKE_CONTRACT,
    },
    reference: {
      formula:
        "tvlSRBT = sRBT.balanceOf(RBTNote), totalSRBT = sRBT.totalSupply, stakeBackingRBT = RBT.balanceOf(sRBT)",
      consistency:
        "all reads pinned to the same blockNumber for cross-call consistency",
    },
  });
}
