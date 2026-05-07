// 시장 + 온체인 메트릭 server fetch.
// 1) dexscreener: 시장가, 유동성, 거래 흐름
// 2) onchain (viem):
//    - USDm.balanceOf(TREASURY) + aMegUSDm.balanceOf(TREASURY) → 라이브 reserves
//      (트레저리가 USDm 일부를 Aave 에 예치해 aMegUSDm 형태로 보유. 1:1 redeem 보장 + 이자 누적)
//    - RBT.totalSupply() → 라이브 circulating supply
//    - NAV = reserves / totalSupply
//
// 동시 요청은 합쳐서 (request coalescing) 한 번만 upstream 을 호출하고,
// 짧은 TTL 캐시로 폴링 주기 (1s) 안의 중복 호출을 흡수합니다.
// 라이브 호출이 실패하면 직전 성공값을 stale=true 로 반환합니다.

import { NextResponse } from "next/server";
import { createPublicClient, http, erc20Abi, defineChain } from "viem";
import {
  AMEG_USDM_TOKEN,
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

type OnchainSnapshot = {
  reservesUSDm: number;
  totalSupplyRBT: number;
  navUSDm: number;
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

// === Cache + coalescing ===
// 클라이언트 폴링이 1 초 간격이므로 dex 캐시는 같은 1 초 내 중복 호출만 흡수.
// 온체인 NAV 는 변동이 느리므로 더 길게.
const DEX_TTL_MS = 1_000;
const ONCHAIN_TTL_MS = 3_000;

let dexCache: { ts: number; data: DexPair } | null = null;
let dexInflight: Promise<DexPair | null> | null = null;

let onchainCache: { ts: number; data: OnchainSnapshot } | null = null;
let onchainInflight: Promise<OnchainSnapshot | null> | null = null;

async function fetchDex(): Promise<DexPair | null> {
  const now = Date.now();
  if (dexCache && now - dexCache.ts < DEX_TTL_MS) return dexCache.data;
  if (dexInflight) return dexInflight;

  const p = (async (): Promise<DexPair | null> => {
    try {
      const res = await fetch(DEXSCREENER_URL, {
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json = (await res.json()) as {
        pair?: DexPair;
        pairs?: DexPair[];
      };
      const pair = json.pair ?? json.pairs?.[0] ?? null;
      if (pair) dexCache = { ts: Date.now(), data: pair };
      return pair;
    } catch {
      return null;
    }
  })();

  dexInflight = p;
  p.finally(() => {
    if (dexInflight === p) dexInflight = null;
  });
  return p;
}

async function fetchOnchain(): Promise<OnchainSnapshot | null> {
  const now = Date.now();
  if (onchainCache && now - onchainCache.ts < ONCHAIN_TTL_MS)
    return onchainCache.data;
  if (onchainInflight) return onchainInflight;

  const p = (async (): Promise<OnchainSnapshot | null> => {
    try {
      const [usdmRaw, aUsdmRaw, supplyRaw] = await Promise.all([
        client.readContract({
          address: USDM_TOKEN as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [TREASURY_CONTRACT as `0x${string}`],
        }) as Promise<bigint>,
        client.readContract({
          address: AMEG_USDM_TOKEN as `0x${string}`,
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
      const reserves = Number(usdmRaw + aUsdmRaw) / 1e18;
      const supply = Number(supplyRaw) / 1e18;
      const nav = supply > 0 ? reserves / supply : 0;
      const data = {
        reservesUSDm: reserves,
        totalSupplyRBT: supply,
        navUSDm: nav,
      };
      onchainCache = { ts: Date.now(), data };
      return data;
    } catch {
      return null;
    }
  })();

  onchainInflight = p;
  p.finally(() => {
    if (onchainInflight === p) onchainInflight = null;
  });
  return p;
}

export async function GET() {
  const [pair, onchain] = await Promise.all([fetchDex(), fetchOnchain()]);

  // 라이브 fetch 실패 시 직전 캐시로 fallback. 캐시조차 없으면 502.
  const livePair = pair ?? dexCache?.data ?? null;
  const liveOnchain = onchain ?? onchainCache?.data ?? null;

  if (!livePair) {
    return NextResponse.json(
      { ok: false, error: "dexscreener fetch failed, no cache available" },
      { status: 502 },
    );
  }

  const dexStale = !pair;
  const onchainStale = !!liveOnchain && !onchain;

  const buys24 = livePair.txns?.h24?.buys ?? 0;
  const sells24 = livePair.txns?.h24?.sells ?? 0;

  return NextResponse.json(
    {
      ok: true,
      stale: dexStale || onchainStale,
      dexStale,
      onchainStale,
      capturedAt: new Date().toISOString(),
      source: liveOnchain
        ? dexStale
          ? "dexscreener stale + onchain"
          : "dexscreener + onchain"
        : dexStale
          ? "dexscreener stale, onchain stale"
          : "dexscreener, onchain stale",
      pair: KUMBAYA_PAIR,
      base: livePair.baseToken?.symbol ?? "RBT",
      quote: livePair.quoteToken?.symbol ?? "USDm",
      market: {
        priceUSD: parseFloat(livePair.priceUsd ?? "0"),
        priceUSDm: parseFloat(livePair.priceNative ?? "0"),
        liquidityUSD: livePair.liquidity?.usd ?? 0,
        poolBase: livePair.liquidity?.base ?? 0,
        poolQuote: livePair.liquidity?.quote ?? 0,
        fdvUSD: livePair.fdv ?? 0,
        marketCapUSD: livePair.marketCap ?? 0,
      },
      flow: {
        volume24h: livePair.volume?.h24 ?? 0,
        volume6h: livePair.volume?.h6 ?? 0,
        volume1h: livePair.volume?.h1 ?? 0,
        buys24h: buys24,
        sells24h: sells24,
        txns24h: buys24 + sells24,
      },
      delta: {
        h24: livePair.priceChange?.h24 ?? 0,
        h6: livePair.priceChange?.h6 ?? 0,
        h1: livePair.priceChange?.h1 ?? 0,
        m5: livePair.priceChange?.m5 ?? 0,
      },
      onchain: liveOnchain,
    },
    {
      headers: {
        // 동일 인스턴스의 동시 요청은 위 메모리 캐시가 흡수하지만,
        // edge / proxy 단의 microcache 도 1 초 정도 허용해서 폭주를 막는다.
        "Cache-Control":
          "public, s-maxage=1, stale-while-revalidate=10",
      },
    },
  );
}
