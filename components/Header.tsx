import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b hairline backdrop-blur sticky top-0 z-30 bg-ink-950/70">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-violet-500 to-ember-500 grid place-items-center shadow-glow">
            <span className="font-mono text-[11px] font-bold text-ink-950">BH</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Blackhaven</div>
            <div className="text-[11px] text-mist-400 font-mono">Player&apos;s Playbook</div>
          </div>
        </Link>
        <nav className="flex items-center gap-5 text-[12.5px] text-mist-200">
          <Link className="hover:text-white" href="/">
            Playbook
          </Link>
          <Link className="hover:text-white" href="/forks">
            OHM Forks
          </Link>
        </nav>
      </div>
    </header>
  );
}
