// 시장 + 온체인 메트릭 server fetch.
// 1) dexscreener: 시장가, 유동성, 거래 흐름
// 2) onchain (viem):
//    - USDm.balanceOf(TREASURY_CONTRACT) → 라이브 reserves
//    - RBT.totalSupply() → 라이브 circulating supply
//    - NAV = reserves / totalSupply
// 매 요청마다 fresh capturedAt.

import { NextResponse } from "next/server";
import { createPublicClient, http, erc20Abi, defineChain } from "viem";
import {
  KUMBAYA_PAIR,
  MEGAETH_CHAIN_ID,
  MEGAETH_RPC,
  RBT_TOKEN,
  TREASURY_CONTRACT,
  USDM_TOKEN,
} from "@/lib/contracts";

type DexPair = {
  priceUsd?: string;
  priceNative?: string;
  liquidity?: { usd?: number; base?: number; quote?: number };
  fdv?: number;
  marketCap?: number;
  volume?: { h24?: number; h6?: number; h1?: number };
  txns?: {
    h24?: { buys?: number; sells?: number };
    h6?: { buys?: number; sells?: number };
    h1?: { buys?: number; sells?: number };
  };
  priceChange?: { h24?: number; h6?: number; h1?: number; m5?: number };
  baseToken?: { address?: string; symbol?: string; name?: string };
  quoteToken?: { address?: string; symbol?: string; name?: string };
};

const DEXSCREENER_URL = `https://api.dexscreener.com/latest/dex/pairs/megaeth/${KUMBAYA_PAIR}`;

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

export const dynamic = "force-dynamic";

async function fetchDex(): Promise<DexPair | null> {
  try {
    const res = await fetch(DEXSCREENER_URL, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { pair?: DexPair; pairs?: DexPair[] };
    return json.pair ?? json.pairs?.[0] ?? null;
  } catch {
    return null;
  }
}

async function fetchOnchain(): Promise<{
  reservesUSDm: number;
  totalSupplyRBT: number;
  navUSDm: number;
} | null> {
  try {
    const [reservesRaw, supplyRaw] = await Promise.all([
      client.readContract({
        address: USDM_TOKEN as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [TREASURY_CONTRACT as `0x${string}`],
      }) as Promise<bigint>,
      client.readContract({
        address: RBT_TOKEN as `0x${string}`,
        abi: erc20Abi,
        functionName: "totalSupply",
      }) as Promise<bigint>,
    ]);
    const reserves = Number(reservesRaw) / 1e18;
    const supply = Number(supplyRaw) / 1e18;
    const nav = supply > 0 ? reserves / supply : 0;
    return {
      reservesUSDm: reserves,
      totalSupplyRBT: supply,
      navUSDm: nav,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const [pair, onchain] = await Promise.all([fetchDex(), fetchOnchain()]);

  if (!pair) {
    return NextResponse.json(
      { ok: false, error: "dexscreener fetch failed" },
      { status: 502 },
    );
  }

  const buys24 = pair.txns?.h24?.buys ?? 0;
  const sells24 = pair.txns?.h24?.sells ?? 0;

  return NextResponse.json({
    ok: true,
    capturedAt: new Date().toISOString(),
    source: onchain ? "dexscreener + onchain" : "dexscreener, onchain stale",
    pair: KUMBAYA_PAIR,
    base: pair.baseToken?.symbol ?? "RBT",
    quote: pair.quoteToken?.symbol ?? "USDm",
    market: {
      priceUSD: parseFloat(pair.priceUsd ?? "0"),
      priceUSDm: parseFloat(pair.priceNative ?? "0"),
      liquidityUSD: pair.liquidity?.usd ?? 0,
      poolBase: pair.liquidity?.base ?? 0,
      poolQuote: pair.liquidity?.quote ?? 0,
      fdvUSD: pair.fdv ?? 0,
      marketCapUSD: pair.marketCap ?? 0,
    },
    flow: {
      volume24h: pair.volume?.h24 ?? 0,
      volume6h: pair.volume?.h6 ?? 0,
      volume1h: pair.volume?.h1 ?? 0,
      buys24h: buys24,
      sells24h: sells24,
      txns24h: buys24 + sells24,
    },
    delta: {
      h24: pair.priceChange?.h24 ?? 0,
      h6: pair.priceChange?.h6 ?? 0,
      h1: pair.priceChange?.h1 ?? 0,
      m5: pair.priceChange?.m5 ?? 0,
    },
    onchain: onchain ?? null,
  });
}
