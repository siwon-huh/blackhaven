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

const STATUS_ORDER = [
  "alive",
  "alive-pivoted",
  "moribund",
  "wound-down",
  "abandoned",
  "rugged",
];

export default function ForkCards() {
  const [openId, setOpenId] = useState<string | null>(null);
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
        <div className="eyebrow">Project files</div>
        <h2 className="mt-2 text-[28px] headline text-ink-50">
          프로젝트별 케이스
        </h2>
        <p className="mt-2 text-[12.5px] text-ink-400">
          헤더를 클릭해 정렬할 수 있고, row 를 클릭하면 정규화 곡선과 상세 분석을 펼쳐볼 수 있습니다.
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
                  Ticker
                </Th>
                <Th k={null} className="w-[10%]">
                  Chain
                </Th>
                <Th k={null} className="w-[14%]">
                  Status
                </Th>
                <Th
                  k="launched"
                  sort={sort}
                  onClick={handleSort}
                  className="w-[10%]"
                >
                  Launch
                </Th>
                <Th
                  k="peakDays"
                  sort={sort}
                  onClick={handleSort}
                  className="w-[10%]"
                  align="right"
                >
                  to Peak
                </Th>
                <Th
                  k="peakPriceUSD"
                  sort={sort}
                  onClick={handleSort}
                  className="w-[10%]"
                  align="right"
                >
                  Peak
                </Th>
                <Th
                  k="recentPriceUSD"
                  sort={sort}
                  onClick={handleSort}
                  className="w-[10%]"
                  align="right"
                >
                  Recent
                </Th>
                <Th
                  k="vsLaunch"
                  sort={sort}
                  onClick={handleSort}
                  className="w-[12%]"
                  align="right"
                >
                  vs Launch
                </Th>
                <Th
                  k="drawdownFromPeak"
                  sort={sort}
                  onClick={handleSort}
                  className="w-[12%] pr-5"
                  align="right"
                >
                  vs Peak
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
            {dir === "asc" ? "▲" : dir === "desc" ? "▼" : "·"}
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
                <div className="eyebrow mb-2">Normalized price curve</div>
                <MiniCurve fork={f} />
                <div className="mt-3 grid grid-cols-3 gap-3 text-[11px] font-mono">
                  <div className="card-2 px-3 py-2">
                    <div className="text-ink-500">출시가</div>
                    <div className="mt-0.5 text-ink-50">
                      {fmtPrice(f.launchPriceUSD)}
                    </div>
                    <div className="text-ink-500">{f.launched}</div>
                  </div>
                  <div className="card-2 px-3 py-2">
                    <div className="text-ink-500">정점가</div>
                    <div className="mt-0.5 text-warn">
                      {fmtPrice(f.peakPriceUSD)}
                    </div>
                    <div className="text-ink-500">
                      {f.peakDate}, {f.peakDays}일
                    </div>
                  </div>
                  <div className="card-2 px-3 py-2">
                    <div className="text-ink-500">현재가</div>
                    <div
                      className="mt-0.5"
                      style={{ color: tone.color }}
                    >
                      {fmtPrice(f.recentPriceUSD)}
                    </div>
                    <div className="text-ink-500">{tone.label}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="eyebrow">차별점</div>
                  <p className="mt-1 text-[12.5px] text-ink-100 leading-relaxed">
                    {f.hook}
                  </p>
                </div>
                <div>
                  <div className="eyebrow text-signal">잘 됐던 이유</div>
                  <p className="mt-1 text-[12.5px] text-ink-200 leading-relaxed">
                    {f.whyItGrew}
                  </p>
                </div>
                <div>
                  <div className="eyebrow text-warn">깨진 이유</div>
                  <p className="mt-1 text-[12.5px] text-ink-200 leading-relaxed">
                    {f.whyItBroke}
                  </p>
                </div>
                <div>
                  <div className="eyebrow">결말</div>
                  <p className="mt-1 text-[12.5px] text-ink-100 leading-relaxed">
                    {f.ending}
                  </p>
                </div>
                {f.signature && (
                  <p className="pt-2 border-t hairline text-[11.5px] text-ink-400 italic leading-relaxed">
                    {f.signature}
                  </p>
                )}
                {isAlive && (
                  <div className="card-2 p-3 border-signal/20">
                    <div className="eyebrow text-signal">참고</div>
                    <p className="mt-1 text-[11.5px] text-ink-200 leading-relaxed">
                      Alive 군은 정점 대비 {fmtPct(peakDrawdown)} 하락했지만 출시 가격 대비는 {fmtPct(launchChange)} 입니다. 사용자 평균 진입가는 두 값 사이 어딘가에 있습니다.
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
