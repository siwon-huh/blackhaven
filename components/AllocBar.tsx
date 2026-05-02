import type { Allocation } from "@/lib/scenarios";

// 모노톤 + signal 강조. 가장 큰 비중 1개만 signal 컬러, 나머지는 ink 단계로.
const palette = ["#3DDC97", "#C9CDD4", "#6E7480", "#363A42"];

export default function AllocBar({ allocation }: { allocation: Allocation[] }) {
  const sorted = [...allocation].sort((a, b) => b.share - a.share);
  const colorMap = new Map(sorted.map((a, i) => [a.label, palette[Math.min(i, palette.length - 1)]]));
  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="eyebrow">Capital allocation</div>
          <div className="text-[14px] font-medium mt-1 text-ink-50">권장 자본 배분</div>
        </div>
        <div className="text-[11px] text-ink-400">합계 100퍼센트</div>
      </div>

      <div className="flex h-2.5 rounded-full overflow-hidden">
        {allocation.map((a) => (
          <div
            key={a.label}
            style={{ width: `${a.share}%`, background: colorMap.get(a.label) }}
            className="first:rounded-l-full last:rounded-r-full"
            title={`${a.label} ${a.share}%`}
          />
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {allocation.map((a) => (
          <div key={a.label} className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ background: colorMap.get(a.label) }}
            />
            <div className="flex-1 flex items-baseline justify-between gap-3">
              <span className="text-[12.5px] text-ink-200">{a.label}</span>
              <span className="font-mono text-[12.5px] text-ink-50 mono-num">
                {a.share}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t hairline text-[11px] text-ink-400 leading-relaxed">
        본인의 유동성과 리스크 허용에 맞춰 조정하시기 바랍니다. 락업에 들어간 자본은 만기까지 회수가 어려우므로 정말 사용하지 않을 자본만 배정하시기 바랍니다.
      </div>
    </div>
  );
}
