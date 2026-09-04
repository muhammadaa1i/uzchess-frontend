import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { SiteShell } from "@/components/shared/layout/site-shell";
import { routing } from "@/i18n/routing";
import { StoreProvider } from "@/lib/store/provider";

import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "UzChess",
  description: "UzChess",
};

function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <StoreProvider>
            <SiteShell>{children}</SiteShell>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
export { generateStaticParams };
