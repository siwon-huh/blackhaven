import { FORKS, STATUS_TONE } from "@/lib/forks";

const TIMELINE_START = "2021-01";
const TIMELINE_END = "2024-12";

const monthsBetween = (a: string, b: string) => {
  const [ay, am] = a.split("-").map(Number);
  const [by, bm] = b.split("-").map(Number);
  return (by - ay) * 12 + (bm - am);
};

const TOTAL_MONTHS = monthsBetween(TIMELINE_START, TIMELINE_END);

const monthsToPct = (date: string) =>
  Math.max(0, Math.min(100, (monthsBetween(TIMELINE_START, date) / TOTAL_MONTHS) * 100));

const ESTIMATED_END: Record<string, string> = {
  rugged: "2022-02",
  abandoned: "2022-06",
  "wound-down": "2024-01",
  moribund: "2024-12",
  "alive-pivoted": "2024-12",
  alive: "2024-12",
};

export default function ForkTimeline() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-12">
      <div className="mb-5">
        <div className="text-[11px] uppercase tracking-wider text-mist-400 font-mono">
          Timeline
        </div>
        <h2 className="mt-1 text-2xl font-semibold">출시부터 결말까지</h2>
        <p className="mt-1 text-[13px] text-mist-400">
          2021년 출시 후 2022년 1분기에 거의 모든 포크가 무너지는 패턴이 공통적으로 나타났습니다. 살아남은 사례는 메커니즘이 아니라 피벗에 가깝습니다.
        </p>
      </div>

      <div className="card p-5">
        <div className="space-y-2.5">
          {FORKS.map((f) => {
            const startPct = monthsToPct(f.launched);
            const endPct = monthsToPct(ESTIMATED_END[f.status]);
            const peakPct = monthsToPct(f.peakDate);
            const tone = STATUS_TONE[f.status];
            return (
              <div key={f.id} className="grid grid-cols-[88px_1fr_140px] items-center gap-3">
                <div className="font-mono text-[12px] text-white">
                  {f.ticker}
                  <span className="ml-1 text-mist-400">{f.chain.slice(0, 3)}</span>
                </div>
                <div className="relative h-6 rounded-md bg-ink-700/40 overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-md"
                    style={{
                      left: `${startPct}%`,
                      width: `${Math.max(2, endPct - startPct)}%`,
                      background: `linear-gradient(90deg, ${tone.color}80, ${tone.color}30)`,
                    }}
                    title={`${f.name} ${f.launched} 부터 ${ESTIMATED_END[f.status]}`}
                  />
                  <div
                    className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full ring-2 ring-ink-900"
                    style={{ left: `${peakPct}%`, background: "#F4C756" }}
                    title={`Peak ${f.peakDate} ${f.peakPrice}`}
                  />
                </div>
                <div className="text-right">
                  <span
                    className="chip text-[10.5px]"
                    style={{ color: tone.color, borderColor: `${tone.color}40` }}
                  >
                    {tone.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t hairline grid grid-cols-4 text-[10px] font-mono text-mist-400">
          <span>2021</span>
          <span>2022</span>
          <span>2023</span>
          <span className="text-right">2024 이후</span>
        </div>

        <div className="mt-4 pt-3 border-t hairline flex flex-wrap gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-mist-300">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            정점
          </span>
          {Object.entries(STATUS_TONE).map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-mist-300">
              <span className="h-1.5 w-3 rounded-sm" style={{ background: v.color }} />
              {v.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
