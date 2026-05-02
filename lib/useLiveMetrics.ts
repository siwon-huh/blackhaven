"use client";

import { useEffect, useRef, useState } from "react";
import { LIVE_METRICS, LiveMetrics } from "@/lib/fairValue";

export type RemoteMetrics = {
  ok: true;
  capturedAt: string;
  source: string;
  pair: string;
  base: string;
  quote: string;
  market: {
    priceUSD: number;
    priceUSDm: number;
    liquidityUSD: number;
    poolBase: number;
    poolQuote: number;
    fdvUSD: number;
    marketCapUSD: number;
  };
  flow: {
    volume24h: number;
    volume6h: number;
    volume1h: number;
    buys24h: number;
    sells24h: number;
    txns24h: number;
  };
  delta: { h24: number; h6: number; h1: number; m5: number };
};

export type LiveState = {
  metrics: LiveMetrics; // fairValue.ts 모델과 동일 타입 (계산기 직접 입력 가능)
  remote: RemoteMetrics | null;
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
};

const FALLBACK: LiveState = {
  metrics: LIVE_METRICS,
  remote: null,
  lastUpdated: null,
  loading: true,
  error: null,
};

export function useLiveMetrics(intervalMs: number = 1_000): LiveState {
  const [state, setState] = useState<LiveState>(FALLBACK);
  const ranOnce = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const tick = async () => {
      try {
        const res = await fetch("/api/metrics", { cache: "no-store" });
        if (!res.ok) throw new Error(`api ${res.status}`);
        const data = (await res.json()) as
          | RemoteMetrics
          | { ok: false; error: string };
        if ("ok" in data && data.ok === false) throw new Error(data.error);
        const remote = data as RemoteMetrics;
        if (cancelled) return;
        setState((prev) => ({
          metrics: {
            ...prev.metrics, // NAV/reserves는 정적 유지
            marketPriceUSDm:
              remote.market.priceUSDm || prev.metrics.marketPriceUSDm,
            liquidityUSD:
              remote.market.liquidityUSD || prev.metrics.liquidityUSD,
            poolRBT: remote.market.poolBase || prev.metrics.poolRBT,
            poolUSDm: remote.market.poolQuote || prev.metrics.poolUSDm,
            capturedAt: remote.capturedAt,
            source: remote.source,
          },
          remote,
          lastUpdated: new Date(),
          loading: false,
          error: null,
        }));
      } catch (e) {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: e instanceof Error ? e.message : "fetch failed",
        }));
      }
    };

    if (!ranOnce.current) {
      ranOnce.current = true;
      tick();
    }
    timer = setInterval(tick, intervalMs);
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [intervalMs]);

  return state;
}

export function formatRelative(date: Date | null): string {
  if (!date) return "—";
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}
