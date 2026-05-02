"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Live" },
  { href: "/about", label: "About" },
  { href: "/playbook", label: "Playbook" },
  { href: "/forks", label: "Forks" },
  { href: "/risks", label: "Risks" },
];

const LOGO_URL =
  "https://pbs.twimg.com/profile_images/2014565643828277248/tQJgxJPb_400x400.jpg";

export default function SiteHeader() {
  const path = usePathname();
  const current = (href: string) =>
    href === "/" ? path === "/" : path?.startsWith(href);
  return (
    <header className="sticky top-0 z-30 border-b hairline backdrop-blur bg-ink-950/85">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_URL}
            alt="Blackhaven"
            width={28}
            height={28}
            className="h-7 w-7 rounded-md object-cover ring-1 ring-white/10"
          />
          <div className="leading-tight min-w-0">
            <div className="text-[14px] font-medium tracking-tight text-ink-50 truncate">
              Blackhaven
            </div>
            <div className="text-[10.5px] text-ink-400 font-mono truncate">
              Reserve-Backed Treasury, unofficial dashboard
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[12.5px] text-ink-300">
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

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:flex items-center gap-2 text-[11px] text-ink-400 font-mono">
            built by
            <a
              href="https://x.com/c4lvin"
              target="_blank"
              rel="noreferrer"
              className="text-ink-50 underline underline-offset-4 decoration-ink-600 hover:decoration-ink-100"
            >
              @c4lvin
            </a>
            <span className="text-ink-600">,</span>
            <a
              href="https://4pillars.io"
              target="_blank"
              rel="noreferrer"
              className="text-ink-300 hover:text-ink-50"
            >
              Four Pillars
            </a>
          </span>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t hairline px-6 py-2 flex items-center gap-5 text-[12px] text-ink-300 overflow-x-auto scrollbar-none">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="nav-link hover:text-ink-50 shrink-0"
            aria-current={current(n.href) ? "page" : undefined}
          >
            {n.label}
          </Link>
        ))}
        <span className="ml-auto text-[10.5px] text-ink-500 font-mono shrink-0">
          built by{" "}
          <a
            href="https://x.com/c4lvin"
            target="_blank"
            rel="noreferrer"
            className="text-ink-200 underline underline-offset-4"
          >
            @c4lvin
          </a>
        </span>
      </div>
    </header>
  );
}
