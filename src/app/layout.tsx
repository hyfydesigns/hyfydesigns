import { Suspense } from "react";
import type { Metadata } from "next";
import { Space_Grotesk, Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic", "normal"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HyFy Designs — Custom apparel and merch in Houston",
    template: "%s · HyFy Designs",
  },
  description:
    "Houston's custom apparel studio since 2004. T-shirts, mugs, stickers, engravings, and print-on-demand merch. No minimums, quality guaranteed.",
  metadataBase: new URL("https://hyfydesigns.com"),
  openGraph: {
    type: "website",
    title: "HyFy Designs — Custom apparel and merch in Houston",
    description:
      "Bold shirts, mugs, stickers, and print-on-demand pieces for creatives, teams, and Houston originals.",
    url: "https://hyfydesigns.com",
    siteName: "HyFy Designs",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <PostHogProvider>{children}</PostHogProvider>
        </Suspense>
        <CartDrawer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
