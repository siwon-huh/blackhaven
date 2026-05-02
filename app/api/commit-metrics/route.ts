// Commit 컨트랙트 메트릭.
// commit 자체는 sRBT 를 lock 하는 컨트랙트라, 정확한 commit TVL 을 보려면 sRBT 토큰 주소가 필요합니다.
// 현재는 정적 fallback 응답이며, sRBT 주소가 lib/contracts.ts:SRBT_TOKEN 에 채워지면 onchain fetch 로 자동 전환됩니다.

import { NextResponse } from "next/server";
import { createPublicClient, http, erc20Abi, defineChain } from "viem";
import {
  COMMIT_CONTRACT,
  MEGAETH_CHAIN_ID,
  MEGAETH_RPC,
  RBT_TOKEN,
  SRBT_TOKEN,
} from "@/lib/contracts";

export const dynamic = "force-dynamic";

const STATIC_STAKE_TVL_USD = 42_050;
const STATIC_COMMIT_24W_REWARD = 0.158;
const STATIC_COMMIT_TVL_SRBT: number | null = null;

const megaeth = defineChain({
  id: MEGAETH_CHAIN_ID,
  name: "MegaETH",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [MEGAETH_RPC] },
  },
});

const client = createPublicClient({
  chain: megaeth,
  transport: http(MEGAETH_RPC),
});

export async function GET() {
  const fallback = (reason?: string) =>
    NextResponse.json({
      ok: true,
      stake: { tvlUSD: STATIC_STAKE_TVL_USD },
      commit: {
        tvlSRBT: STATIC_COMMIT_TVL_SRBT,
        reward24w: STATIC_COMMIT_24W_REWARD,
      },
      capturedAt: new Date().toISOString(),
      source: "static",
      reason: reason ?? "no live source available",
    });

  // sRBT 주소가 알려지지 않은 경우 정적 fallback
  if (!SRBT_TOKEN) {
    return fallback("sRBT address not configured");
  }

  try {
    const lockedSRBT = (await client.readContract({
      address: SRBT_TOKEN as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [COMMIT_CONTRACT as `0x${string}`],
    })) as bigint;

    const SRBT_DECIMALS = 18;
    const tvlSRBT = Number(lockedSRBT) / 10 ** SRBT_DECIMALS;

    // RBT.balanceOf(commit) — commit 이 reward 분배용으로 보유 중인 RBT
    const rewardRBT = (await client.readContract({
      address: RBT_TOKEN as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [COMMIT_CONTRACT as `0x${string}`],
    })) as bigint;
    const rewardPoolRBT = Number(rewardRBT) / 10 ** 18;

    return NextResponse.json({
      ok: true,
      stake: { tvlUSD: STATIC_STAKE_TVL_USD },
      commit: {
        tvlSRBT,
        reward24w: STATIC_COMMIT_24W_REWARD,
        rewardPoolRBT,
      },
      capturedAt: new Date().toISOString(),
      source: "onchain",
      reference: {
        formula: "tvlSRBT = sRBT.balanceOf(commit), rewardPoolRBT = RBT.balanceOf(commit)",
      },
    });
  } catch (e) {
    return fallback(e instanceof Error ? e.message : "fetch failed");
  }
}
