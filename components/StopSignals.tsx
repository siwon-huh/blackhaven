export default function StopSignals({ stop }: { stop: string[] }) {
  return (
    <div className="card p-5 border-ember-500/20">
      <div className="flex items-center gap-2 mb-3">
        <div>
          <div className="text-[10.5px] uppercase tracking-wider text-mist-400 font-mono">
            Stop signals
          </div>
          <div className="text-[14px] font-semibold mt-0.5">
            이 신호가 보이면 플레이를 정지합니다
          </div>
        </div>
      </div>
      <ul className="space-y-2.5">
        {stop.map((s, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-[13px] text-mist-200 leading-relaxed"
          >
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-ember-500 shrink-0" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
