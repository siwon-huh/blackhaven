"use client";

import { useEffect, useRef, useState } from "react";

export type CommitSnapshot = {
  ok: boolean;
  stake: { tvlUSD: number };
  commit: {
    tvlSRBT: number | null;
    reward24w: number;
    rewardPoolRBT?: number;
  };
  capturedAt: string;
  source: "static" | "onchain";
  reason?: string;
  reference?: { formula: string };
};

export type CommitLiveState = {
  snapshot: CommitSnapshot | null;
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
};

const FALLBACK: CommitLiveState = {
  snapshot: null,
  lastUpdated: null,
  loading: true,
  error: null,
};

export function useCommitMetrics(intervalMs: number = 1_000): CommitLiveState {
  const [state, setState] = useState<CommitLiveState>(FALLBACK);
  const ranOnce = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const tick = async () => {
      try {
        const res = await fetch("/api/commit-metrics", { cache: "no-store" });
        if (!res.ok) throw new Error(`api ${res.status}`);
        const data = (await res.json()) as CommitSnapshot;
        if (cancelled) return;
        setState({
          snapshot: data,
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
