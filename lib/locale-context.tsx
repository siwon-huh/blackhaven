"use client";

import { createContext, useContext, ReactNode } from "react";
import { Locale, DEFAULT_LOCALE, t, TKey } from "@/lib/i18n";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
export const useT = () => {
  const locale = useLocale();
  return (key: TKey) => t(locale, key);
};
