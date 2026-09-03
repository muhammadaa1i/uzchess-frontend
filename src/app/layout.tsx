import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { StoreProvider } from "@/lib/store/provider";
import { SiteShell } from "@/components/shared/layout/site-shell";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "UzChess",
  description: "UzChess",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <SiteShell>{children}</SiteShell>
        </StoreProvider>
      </body>
    </html>
  );
}
