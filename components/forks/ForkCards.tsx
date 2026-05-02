"use client";

import { useMemo, useState } from "react";
import {
  FORKS,
  Fork,
  monthsToPeak,
  priceChangeFromLaunch,
  STATUS_TONE,
} from "@/lib/forks";
import MiniCurve from "@/components/forks/MiniCurve";
import { lc } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";

const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${(n * 100).toFixed(1)}%`;
const fmtPrice = (n: number) =>
  n >= 100
    ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
    : n >= 1
      ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
      : `$${n.toLocaleString("en-US", { maximumFractionDigits: 4 })}`;

type SortKey =
  | "ticker"
  | "launched"
  | "peakDays"
  | "peakPriceUSD"
  | "recentPriceUSD"
  | "drawdownFromPeak"
  | "vsLaunch";

type SortState = { key: SortKey; dir: "asc" | "desc" };

type Row = Fork & {
  peakDays: number;
  vsLaunch: number;
  drawdownFromPeak: number;
};

export default function ForkCards() {
  const t = useT();
  const [openId, setOpenId] = useState<string | null>("ohm");
  const [sort, setSort] = useState<SortState>({ key: "peakDays", dir: "asc" });

  const rows: Row[] = useMemo(() => {
    return FORKS.map((f) => ({
      ...f,
      peakDays: monthsToPeak(f.launched, f.peakDate) * 30,
      vsLaunch: priceChangeFromLaunch(f),
      drawdownFromPeak: (f.recentPriceUSD - f.peakPriceUSD) / f.peakPriceUSD,
    }));
  }, []);

  const sorted = useMemo(() => {
    const out = [...rows];
    out.sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      switch (sort.key) {
        case "ticker":
          av = a.ticker;
          bv = b.ticker;
          break;
        case "launched":
          av = a.launched;
          bv = b.launched;
          break;
        case "peakDays":
          av = a.peakDays;
          bv = b.peakDays;
          break;
        case "peakPriceUSD":
          av = a.peakPriceUSD;
          bv = b.peakPriceUSD;
          break;
        case "recentPriceUSD":
          av = a.recentPriceUSD;
          bv = b.recentPriceUSD;
          break;
        case "drawdownFromPeak":
          av = a.drawdownFromPeak;
          bv = b.drawdownFromPeak;
          break;
        case "vsLaunch":
          av = a.vsLaunch;
          bv = b.vsLaunch;
          break;
      }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return out;
  }, [rows, sort]);

  const handleSort = (key: SortKey) => {
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="mb-6">
        <div className="eyebrow">{t("forks.cards.eyebrow")}</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          {t("forks.cards.heading")}
        </h2>
        <p className="mt-2 text-[12.5px] text-ink-400">
          {t("forks.cards.intro")}
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px] border-collapse">
            <thead>
              <tr className="text-left bg-ink-900 border-b hairline">
                <Th
                  k="ticker"
                  sort={sort}
                  onClick={handleSort}
                  className="pl-5 w-[12%]"
                >
                  {t("forks.cards.col.ticker")}
                </Th>
                <Th k={null} className="w-[10%]">
                  {t("forks.cards.col.chain")}
                </Th>
                <Th k={null} className="w-[14%]">
                  {t("forks.cards.col.status")}
                </Th>
                <Th
                  k="launched"
                  sort={sort}
                  onClick={handleSort}
                  className="w-[10%]"
                >
                  {t("forks.cards.col.launch")}
                </Th>
                <Th
                  k="peakDays"
                  sort={sort}
                  onClick={handleSort}
                  className="w-[10%]"
                  align="right"
                >
                  {t("forks.cards.col.toPeak")}
                </Th>
                <Th
                  k="peakPriceUSD"
                  sort={sort}
                  onClick={handleSort}
                  className="w-[10%]"
                  align="right"
                >
                  {t("forks.cards.col.peak")}
                </Th>
                <Th
                  k="recentPriceUSD"
                  sort={sort}
                  onClick={handleSort}
                  className="w-[10%]"
                  align="right"
                >
                  {t("forks.cards.col.recent")}
                </Th>
                <Th
                  k="vsLaunch"
                  sort={sort}
                  onClick={handleSort}
                  className="w-[12%]"
                  align="right"
                >
                  {t("forks.cards.col.vsLaunch")}
                </Th>
                <Th
                  k="drawdownFromPeak"
                  sort={sort}
                  onClick={handleSort}
                  className="w-[12%] pr-5"
                  align="right"
                >
                  {t("forks.cards.col.vsPeak")}
                </Th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((f) => {
                const tone = STATUS_TONE[f.status];
                const isOpen = openId === f.id;
                return (
                  <FragmentRow
                    key={f.id}
                    fork={f}
                    isOpen={isOpen}
                    onToggle={() => setOpenId(isOpen ? null : f.id)}
                    tone={tone}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Th({
  k,
  sort,
  onClick,
  className,
  align,
  children,
}: {
  k: SortKey | null;
  sort?: SortState;
  onClick?: (k: SortKey) => void;
  className?: string;
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  const active = k && sort?.key === k;
  const dir = active ? sort?.dir : null;
  const sortable = !!k && !!onClick;
  return (
    <th
      className={[
        "py-3 font-mono text-[10.5px] uppercase tracking-wider text-ink-400 select-none",
        align === "right" ? "text-right" : "text-left",
        sortable ? "cursor-pointer hover:text-ink-50" : "",
        className ?? "",
      ].join(" ")}
      onClick={() => sortable && onClick && k && onClick(k)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && (
          <span className="text-[8px] text-ink-500">
            {dir === "asc" ? "▲" : dir === "desc" ? "▼" : "◇"}
          </span>
        )}
      </span>
    </th>
  );
}

function FragmentRow({
  fork: f,
  isOpen,
  onToggle,
  tone,
}: {
  fork: Row;
  isOpen: boolean;
  onToggle: () => void;
  tone: { label: string; color: string };
}) {
  const t = useT();
  const locale = useLocale();
  const isAlive = f.status === "alive" || f.status === "alive-pivoted";
  const launchChange = f.vsLaunch;
  const peakDrawdown = f.drawdownFromPeak;
  return (
    <>
      <tr
        onClick={onToggle}
        className={[
          "border-b hairline cursor-pointer transition-colors",
          isOpen ? "bg-ink-800" : "hover:bg-ink-900",
        ].join(" ")}
        aria-expanded={isOpen}
      >
        <td className="pl-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-medium text-ink-50">
              {f.ticker}
            </span>
            <span className="text-[11px] text-ink-500">{f.name}</span>
          </div>
        </td>
        <td className="py-3.5 text-ink-300 font-mono text-[11.5px]">
          {f.chain}
        </td>
        <td className="py-3.5">
          <span
            className="font-mono text-[10.5px] px-2 py-0.5 rounded"
            style={{ color: tone.color, background: `${tone.color}15` }}
          >
            {tone.label}
          </span>
        </td>
        <td className="py-3.5 font-mono text-[11.5px] text-ink-200">
          {f.launched}
        </td>
        <td className="py-3.5 text-right font-mono mono-num text-ink-50">
          {f.peakDays}d
        </td>
        <td className="py-3.5 text-right font-mono mono-num text-warn">
          {fmtPrice(f.peakPriceUSD)}
        </td>
        <td className="py-3.5 text-right font-mono mono-num text-ink-100">
          {fmtPrice(f.recentPriceUSD)}
        </td>
        <td
          className="py-3.5 text-right font-mono mono-num"
          style={{ color: launchChange >= 0 ? "#3DDC97" : "#FF6A4A" }}
        >
          {fmtPct(launchChange)}
        </td>
        <td className="pr-5 py-3.5 text-right font-mono mono-num text-warn">
          {fmtPct(peakDrawdown)}
        </td>
      </tr>
      {isOpen && (
        <tr className="bg-ink-900">
          <td colSpan={9} className="px-5 py-6">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 animate-revealUp">
              <div>
                <div className="eyebrow mb-2">{t("forks.cards.curve")}</div>
                <MiniCurve fork={f} />
                <div className="mt-3 grid grid-cols-3 gap-3 text-[11px] font-mono">
                  <div className="card-2 px-3 py-2">
                    <div className="text-ink-500">
                      {t("forks.cards.launchPrice")}
                    </div>
                    <div className="mt-0.5 text-ink-50">
                      {fmtPrice(f.launchPriceUSD)}
                    </div>
                    <div className="text-ink-500">{f.launched}</div>
                  </div>
                  <div className="card-2 px-3 py-2">
                    <div className="text-ink-500">
                      {t("forks.cards.peakPrice")}
                    </div>
                    <div className="mt-0.5 text-warn">
                      {fmtPrice(f.peakPriceUSD)}
                    </div>
                    <div className="text-ink-500">
                      {t("forks.cards.peakAtDays")
                        .replace("{date}", f.peakDate)
                        .replace("{n}", String(f.peakDays))}
                    </div>
                  </div>
                  <div className="card-2 px-3 py-2">
                    <div className="text-ink-500">
                      {t("forks.cards.recentPrice")}
                    </div>
                    <div className="mt-0.5" style={{ color: tone.color }}>
                      {fmtPrice(f.recentPriceUSD)}
                    </div>
                    <div className="text-ink-500">{tone.label}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="eyebrow">{t("forks.cards.hook")}</div>
                  <p className="mt-1 text-[12.5px] text-ink-100 leading-relaxed">
                    {lc(f.hook, locale)}
                  </p>
                </div>
                <div>
                  <div className="eyebrow text-signal">
                    {t("forks.cards.whyItGrew")}
                  </div>
                  <p className="mt-1 text-[12.5px] text-ink-200 leading-relaxed">
                    {lc(f.whyItGrew, locale)}
                  </p>
                </div>
                <div>
                  <div className="eyebrow text-warn">
                    {t("forks.cards.whyItBroke")}
                  </div>
                  <p className="mt-1 text-[12.5px] text-ink-200 leading-relaxed">
                    {lc(f.whyItBroke, locale)}
                  </p>
                </div>
                <div>
                  <div className="eyebrow">{t("forks.cards.ending")}</div>
                  <p className="mt-1 text-[12.5px] text-ink-100 leading-relaxed">
                    {lc(f.ending, locale)}
                  </p>
                </div>
                {f.signature && (
                  <p className="pt-2 border-t hairline text-[11.5px] text-ink-400 italic leading-relaxed">
                    {lc(f.signature, locale)}
                  </p>
                )}
                {isAlive && (
                  <div className="card-2 p-3 border-signal/20">
                    <div className="eyebrow text-signal">
                      {t("forks.cards.aliveNote")}
                    </div>
                    <p className="mt-1 text-[11.5px] text-ink-200 leading-relaxed">
                      {t("forks.cards.aliveBody")
                        .replace("{peak}", fmtPct(peakDrawdown))
                        .replace("{launch}", fmtPct(launchChange))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
