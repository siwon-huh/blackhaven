"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLocale, Locale, LOCALES } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/locale-context";
import { useTheme } from "@/lib/theme";

const NAV: Array<{
  href: string;
  key: Parameters<ReturnType<typeof useT>>[0];
}> = [
  { href: "", key: "nav.live" },
  { href: "/about", key: "nav.about" },
  { href: "/playbook", key: "nav.playbook" },
  { href: "/forks", key: "nav.forks" },
  { href: "/risks", key: "nav.risks" },
];

const LOGO_URL =
  "https://pbs.twimg.com/profile_images/2014565643828277248/tQJgxJPb_400x400.jpg";

// 현재 path 에서 lang segment 를 분리합니다.
function splitPath(path: string | null): {
  locale: Locale | null;
  rest: string;
} {
  if (!path) return { locale: null, rest: "" };
  const seg = path.split("/").filter(Boolean);
  if (seg.length === 0) return { locale: null, rest: "" };
  if (isLocale(seg[0])) {
    return {
      locale: seg[0] as Locale,
      rest: seg.length > 1 ? "/" + seg.slice(1).join("/") : "",
    };
  }
  return { locale: null, rest: path };
}

export default function SiteHeader() {
  const path = usePathname();
  const ctxLocale = useLocale();
  const { theme, toggle } = useTheme();
  const t = useT();

  const { locale: pathLocale, rest } = splitPath(path);
  const locale: Locale = pathLocale ?? ctxLocale;
  const otherLocale: Locale = LOCALES.find((l) => l !== locale) ?? "ko";

  const langPrefix = `/${locale}`;
  const otherPrefix = `/${otherLocale}`;

  const isCurrent = (rel: string) => {
    if (rel === "") return rest === "" || rest === "/";
    return rest.startsWith(rel);
  };

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur"
      style={{
        borderColor: "var(--line)",
        background: "color-mix(in oklab, var(--bg) 85%, transparent)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href={langPrefix} className="flex items-center gap-3 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_URL}
            alt="Blackhaven"
            width={28}
            height={28}
            className="h-7 w-7 rounded-md object-cover ring-1"
            style={{ boxShadow: "0 0 0 1px var(--line)" }}
          />
          <div className="leading-tight min-w-0">
            <div
              className="text-[14px] font-medium tracking-tight truncate"
              style={{ color: "var(--text-1)" }}
            >
              Blackhaven
            </div>
            <div
              className="text-[10.5px] font-mono truncate"
              style={{ color: "var(--text-3)" }}
            >
              {t("header.subtitle")}
            </div>
          </div>
        </Link>

        <nav
          className="hidden md:flex items-center gap-6 text-[12.5px]"
          style={{ color: "var(--text-2)" }}
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={`${langPrefix}${n.href}`}
              className="nav-link hover:text-[color:var(--text-1)]"
              aria-current={isCurrent(n.href) ? "page" : undefined}
            >
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`${otherPrefix}${rest || ""}`}
            className="px-2 py-1 rounded-md text-[11px] font-mono border transition-colors"
            style={{
              borderColor: "var(--line)",
              color: "var(--text-2)",
              background: "transparent",
            }}
            title={`Switch to ${otherLocale.toUpperCase()}`}
          >
            <span style={{ color: "var(--text-1)" }}>
              {locale.toUpperCase()}
            </span>
            <span className="mx-1" style={{ color: "var(--text-4)" }}>
              /
            </span>
            <span>{otherLocale.toUpperCase()}</span>
          </Link>
          <button
            onClick={toggle}
            className="w-8 h-8 grid place-items-center rounded-md border transition-colors text-[14px]"
            style={{
              borderColor: "var(--line)",
              color: "var(--text-1)",
              background: "transparent",
            }}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-label="theme toggle"
          >
            {theme === "dark" ? "☀" : "🌙"}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className="md:hidden border-t px-6 py-2 flex items-center gap-5 text-[12px] overflow-x-auto scrollbar-none"
        style={{ borderColor: "var(--line)", color: "var(--text-2)" }}
      >
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={`${langPrefix}${n.href}`}
            className="nav-link hover:text-[color:var(--text-1)] shrink-0"
            aria-current={isCurrent(n.href) ? "page" : undefined}
          >
            {t(n.key)}
          </Link>
        ))}
      </div>
    </header>
  );
}
