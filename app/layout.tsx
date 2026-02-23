import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

import type { Metadata, Viewport } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "white",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const TITLE = "API ENEM";
const DESCRIPTION = "API para consulta de provas e questões do ENEM";

export const metadata: Metadata = {
  title: TITLE,
  applicationName: TITLE,
  generator: "Next.js",
  description: DESCRIPTION,
  creator: "yunger7",
  keywords: ["ENEM", "API", "Open Source", "Provas", "Questões"],
  authors: [{ name: "yunger7", url: "https://github.com/yunger7" }],
  openGraph: {
    title: TITLE,
    siteName: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://enem.dev",
    locale: "pt_BR",
    countryName: "Brazil",
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background min-h-dvh font-sans antialiased",
          fontSans.variable,
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-neutral-900 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Pular para o conteúdo principal
        </a>
        <Analytics />
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div id="main-content">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
