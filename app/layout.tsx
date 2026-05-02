import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Blackhaven, Live Dashboard",
  description:
    "Reserve-Backed Treasury on MegaETH. Live metrics, fair value, playbook, and risks.",
};

const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem('bh-theme');
    if (t !== 'light' && t !== 'dark') t = 'dark';
    document.documentElement.dataset.theme = t;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-theme="dark">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen font-display antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
