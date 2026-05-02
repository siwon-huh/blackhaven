import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blackhaven · Scenario Dashboard",
  description:
    "MegaETH 위 Reserve-Backed Treasury 프로토콜 Blackhaven의 초단기·초기·중기 최선 시나리오 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-display antialiased">{children}</body>
    </html>
  );
}
