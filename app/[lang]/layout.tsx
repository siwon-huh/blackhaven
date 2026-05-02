import { notFound } from "next/navigation";
import { isLocale, LOCALES, Locale } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/locale-context";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) {
    notFound();
  }
  const locale = params.lang as Locale;
  return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}
