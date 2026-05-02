"use client";

import { useT } from "@/lib/locale-context";

export default function SiteFooter() {
  const t = useT();
  return (
    <footer className="border-t mt-24" style={{ borderColor: "var(--line)" }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div
          className="grid md:grid-cols-2 gap-6 text-[12px]"
          style={{ color: "var(--text-3)" }}
        >
          <div className="leading-relaxed">
            <div
              className="text-[13px] font-medium"
              style={{ color: "var(--text-1)" }}
            >
              Blackhaven
            </div>
            <p className="mt-2" style={{ color: "var(--text-2)" }}>
              {t("footer.about")}
            </p>
            <p className="mt-3" style={{ color: "var(--text-3)" }}>
              {t("footer.notice")}
            </p>
          </div>
          <div className="md:text-right space-y-2">
            <a
              className="block hover:text-[color:var(--text-1)]"
              href="https://docs.blackhaven.xyz/overview"
              target="_blank"
              rel="noreferrer"
            >
              docs.blackhaven.xyz
            </a>
            <a
              className="block hover:text-[color:var(--text-1)]"
              href="https://www.blackhaven.xyz"
              target="_blank"
              rel="noreferrer"
            >
              blackhaven.xyz
            </a>
            <a
              className="block hover:text-[color:var(--text-1)]"
              href="https://github.com/siwon-huh/blackhaven"
              target="_blank"
              rel="noreferrer"
            >
              github.com/siwon-huh/blackhaven
            </a>
          </div>
        </div>

        <div
          className="mt-8 pt-6 border-t text-right text-[11.5px]"
          style={{ borderColor: "var(--line)", color: "var(--text-4)" }}
        >
          <span className="font-mono">
            {t("footer.unofficial")}, © {t("footer.protocol")}
          </span>
        </div>
      </div>
    </footer>
  );
}
