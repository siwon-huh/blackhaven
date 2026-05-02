"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Live" },
  { href: "/about", label: "About" },
  { href: "/playbook", label: "Playbook" },
  { href: "/forks", label: "Forks" },
];

export default function SiteHeader() {
  const path = usePathname();
  const current = (href: string) =>
    href === "/" ? path === "/" : path?.startsWith(href);
  return (
    <header className="sticky top-0 z-30 border-b hairline backdrop-blur bg-ink-950/80">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-sm bg-ink-100 grid place-items-center">
            <span className="font-mono text-[10px] font-bold text-ink-950">BH</span>
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-medium tracking-tight text-ink-50">
              Blackhaven
            </div>
            <div className="text-[10.5px] text-ink-400 font-mono">
              Reserve-Backed Treasury
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-[12.5px] text-ink-300">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="nav-link hover:text-ink-50"
              aria-current={current(n.href) ? "page" : undefined}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
