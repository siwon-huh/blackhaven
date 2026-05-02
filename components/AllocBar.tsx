import type { Allocation } from "@/lib/scenarios";

export default function AllocBar({ allocation }: { allocation: Allocation[] }) {
  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono">
            Capital allocation
          </div>
          <div className="text-[14px] font-semibold mt-1">권장 자본 배분</div>
        </div>
        <div className="text-[11px] text-mist-400">합계 100%</div>
      </div>

      <div className="flex h-3 rounded-full overflow-hidden">
        {allocation.map((a) => (
          <div
            key={a.label}
            style={{ width: `${a.share}%`, background: a.color }}
            className="first:rounded-l-full last:rounded-r-full"
            title={`${a.label} · ${a.share}%`}
          />
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {allocation.map((a) => (
          <div key={a.label} className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ background: a.color }}
            />
            <div className="flex-1 flex items-baseline justify-between gap-3">
              <span className="text-[12.5px] text-mist-200">{a.label}</span>
              <span className="font-mono text-[12.5px] text-white">{a.share}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t hairline text-[11px] text-mist-400 leading-relaxed">
        본인 유동성·리스크 허용에 맞춰 조정. 락업 자본은 만기까지 transfer 불가, 정말 안 쓸 자본만.
      </div>
    </div>
  );
}
