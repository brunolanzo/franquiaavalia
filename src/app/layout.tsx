import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Franquia Avalia — Avalie antes de investir",
    template: "%s | Franquia Avalia",
  },
  description:
    "Pesquise a reputação de franquias antes de investir. Avaliações reais de franqueados brasileiros.",
  keywords: [
    "franquias",
    "avaliação de franquias",
    "investir em franquias",
    "franqueado",
    "franqueadora",
    "reputação franquia",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Franquia Avalia",
    title: "Franquia Avalia — Avalie antes de investir",
    description:
      "Pesquise a reputação de franquias antes de investir. Avaliações reais de franqueados brasileiros.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Franquia Avalia — Avalie antes de investir",
    description:
      "Pesquise a reputação de franquias antes de investir. Avaliações reais de franqueados brasileiros.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
