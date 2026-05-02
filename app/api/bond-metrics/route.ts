// 본드 TVL 메트릭 onchain fetch.
// 본드 컨트랙트의 RBT 잔액 (outstanding 분배 RBT) 을 RBT/USDm 라이브 시장가로 환산해 TVL 추정.
// 디스카운트 자체는 정적 fallback (앱 표시값 수기 sync).
// 매 요청마다 fresh capturedAt.

import { NextResponse } from "next/server";
import { createPublicClient, http, erc20Abi, defineChain } from "viem";
import {
  BOND_CONTRACTS,
  BOND_DISCOUNT_BY_DAYS,
  KUMBAYA_PAIR,
  MEGAETH_CHAIN_ID,
  MEGAETH_RPC,
  RBT_TOKEN,
} from "@/lib/contracts";
import { buildBondSnapshot, computeBondMetrics } from "@/lib/bondMetrics";

export const dynamic = "force-dynamic";

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

async function fetchMarketPriceUSDm(): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/megaeth/${KUMBAYA_PAIR}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      pair?: { priceNative?: string };
      pairs?: { priceNative?: string }[];
    };
    const pair = data.pair ?? data.pairs?.[0];
    return pair?.priceNative ? parseFloat(pair.priceNative) : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const fallback = () =>
    NextResponse.json({ ok: true, ...buildBondSnapshot(), reason: "fallback" });

  try {
    const [bal7, bal14, bal30, marketPriceUSDm] = await Promise.all([
      client.readContract({
        address: RBT_TOKEN as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [BOND_CONTRACTS.d7 as `0x${string}`],
      }) as Promise<bigint>,
      client.readContract({
        address: RBT_TOKEN as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [BOND_CONTRACTS.d14 as `0x${string}`],
      }) as Promise<bigint>,
      client.readContract({
        address: RBT_TOKEN as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [BOND_CONTRACTS.d30 as `0x${string}`],
      }) as Promise<bigint>,
      fetchMarketPriceUSDm(),
    ]);

    if (!marketPriceUSDm || marketPriceUSDm <= 0) return fallback();

    const RBT_DECIMALS = 18;
    const factor = 10 ** RBT_DECIMALS;
    const toRbt = (b: bigint) => Number(b) / factor;

    const rbt7 = toRbt(bal7);
    const rbt14 = toRbt(bal14);
    const rbt30 = toRbt(bal30);

    if (rbt7 === 0 && rbt14 === 0 && rbt30 === 0) return fallback();

    const bonds = [
      {
        days: 7,
        discountPct: BOND_DISCOUNT_BY_DAYS[7] ?? 5,
        tvlUSDm: rbt7 * marketPriceUSDm,
      },
      {
        days: 14,
        discountPct: BOND_DISCOUNT_BY_DAYS[14] ?? 10,
        tvlUSDm: rbt14 * marketPriceUSDm,
      },
      {
        days: 30,
        discountPct: BOND_DISCOUNT_BY_DAYS[30] ?? 15,
        tvlUSDm: rbt30 * marketPriceUSDm,
      },
    ];

    return NextResponse.json({
      ok: true,
      bonds: computeBondMetrics(bonds),
      totalTVLUSDm: bonds.reduce((s, b) => s + b.tvlUSDm, 0),
      capturedAt: new Date().toISOString(),
      source: "onchain",
      reference: {
        marketPriceUSDm,
        outstandingRBT: { d7: rbt7, d14: rbt14, d30: rbt30 },
        formula: "tvlUSDm = outstandingRBT × marketPriceUSDm",
      },
    });
  } catch {
    return fallback();
  }
}
