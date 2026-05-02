// 온체인/마켓 메트릭 server fetch — CORS 우회 + 30초 edge 캐싱.
// 원본: dexscreener API (Kumbaya RBT/USDm pool on MegaETH).
// NAV(reservesPerRBT)는 별도 소스 필요 — 현재는 정적 fallback.

import { NextResponse } from "next/server";

const PAIR = "0x3fa634c81ee8aa78c4f37364e6feccb8a89c0032";
const DEXSCREENER_URL = `https://api.dexscreener.com/latest/dex/pairs/megaeth/${PAIR}`;

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

export const revalidate = 30; // edge 캐시 30s — 클라이언트 폴링은 60s

export async function GET() {
  try {
    const res = await fetch(DEXSCREENER_URL, {
      headers: { accept: "application/json" },
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `dexscreener ${res.status}` },
        { status: 502 },
      );
    }
    const json = (await res.json()) as { pair?: DexPair; pairs?: DexPair[] };
    const pair: DexPair | undefined = json.pair ?? json.pairs?.[0];
    if (!pair) {
      return NextResponse.json({ ok: false, error: "no pair" }, { status: 502 });
    }

    const buys24 = pair.txns?.h24?.buys ?? 0;
    const sells24 = pair.txns?.h24?.sells ?? 0;
    const txns24 = buys24 + sells24;

    return NextResponse.json({
      ok: true,
      capturedAt: new Date().toISOString(),
      source: "dexscreener · megaeth",
      pair: PAIR,
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
        txns24h: txns24,
      },
      delta: {
        h24: pair.priceChange?.h24 ?? 0,
        h6: pair.priceChange?.h6 ?? 0,
        h1: pair.priceChange?.h1 ?? 0,
        m5: pair.priceChange?.m5 ?? 0,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "fetch failed" },
      { status: 502 },
    );
  }
}
