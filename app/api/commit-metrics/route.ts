// Commit 컨트랙트 메트릭 (RBTNote 가 보유한 sRBT 합계 = commit lock 자본).
// sRBT.balanceOf(RBTNote) 로 onchain 라이브.

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

export async function GET() {
  try {
    // 병렬 호출:
    // 1) sRBT.balanceOf(RBTNote) — commit 락된 sRBT 합계
    // 2) sRBT.totalSupply() — 전체 sRBT 발행량 (= 전체 stake 합계)
    // 3) RBT.balanceOf(sRBT) — sRBT 컨트랙트가 보유하는 RBT (stake 자본)
    // 4) RBT.balanceOf(RBTNote) — commit 컨트랙트가 reward 풀로 보유하는 RBT
    const [committedSRBT, totalSRBT, stakeRBT, commitRewardPoolRBT] =
      await Promise.all([
        client.readContract({
          address: SRBT_TOKEN as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [COMMIT_CONTRACT as `0x${string}`],
        }) as Promise<bigint>,
        client.readContract({
          address: SRBT_TOKEN as `0x${string}`,
          abi: erc20Abi,
          functionName: "totalSupply",
        }) as Promise<bigint>,
        client.readContract({
          address: RBT_TOKEN as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [SRBT_TOKEN as `0x${string}`],
        }) as Promise<bigint>,
        client.readContract({
          address: RBT_TOKEN as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [COMMIT_CONTRACT as `0x${string}`],
        }) as Promise<bigint>,
      ]);

    const fac = 1e18;
    const tvlSRBT = Number(committedSRBT) / fac;
    const totalStakeSRBT = Number(totalSRBT) / fac;
    const stakeBackingRBT = Number(stakeRBT) / fac;
    const rewardPoolRBT = Number(commitRewardPoolRBT) / fac;

    return NextResponse.json({
      ok: true,
      stake: {
        totalSRBT: totalStakeSRBT,
        backingRBT: stakeBackingRBT,
      },
      commit: {
        tvlSRBT,
        reward24w: STATIC_COMMIT_24W_REWARD,
        rewardPoolRBT,
      },
      capturedAt: new Date().toISOString(),
      source: "onchain",
      addresses: {
        srbt: SRBT_TOKEN,
        rbtnote: COMMIT_CONTRACT,
        stake: STAKE_CONTRACT,
      },
      reference: {
        formula:
          "tvlSRBT = sRBT.balanceOf(RBTNote), totalSRBT = sRBT.totalSupply, stakeBackingRBT = RBT.balanceOf(sRBT)",
      },
    });
  } catch (e) {
    return NextResponse.json({
      ok: true,
      stake: { totalSRBT: 0, backingRBT: 0 },
      commit: { tvlSRBT: null, reward24w: STATIC_COMMIT_24W_REWARD },
      capturedAt: new Date().toISOString(),
      source: "static",
      reason: e instanceof Error ? e.message : "fetch failed",
    });
  }
}
