"use client";

import { useEffect, useRef, useState } from "react";
import { BondSnapshot, buildBondSnapshot } from "@/lib/bondMetrics";

export type BondLiveState = {
  snapshot: BondSnapshot;
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
};

const FALLBACK: BondLiveState = {
  snapshot: buildBondSnapshot(),
  lastUpdated: null,
  loading: true,
  error: null,
};

export function useBondMetrics(intervalMs: number = 5_000): BondLiveState {
  const [state, setState] = useState<BondLiveState>(FALLBACK);
  const ranOnce = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const tick = async () => {
      try {
        const res = await fetch("/api/bond-metrics", { cache: "no-store" });
        if (!res.ok) throw new Error(`api ${res.status}`);
        const data = await res.json();
        if (data.ok === false) throw new Error(data.error ?? "bond fetch failed");
        if (cancelled) return;
        setState({
          snapshot: data as BondSnapshot,
          lastUpdated: new Date(),
          loading: false,
          error: null,
        });
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
