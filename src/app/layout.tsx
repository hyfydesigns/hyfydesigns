import { Suspense } from "react";
import type { Metadata } from "next";
import { Space_Grotesk, Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { sanityFetch } from "@/sanity/client";
import { SEO_SETTINGS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import type { SeoSettingsDoc } from "@/sanity/types";
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

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
  process.env.GOOGLE_SITE_VERIFICATION;

const DEFAULT_TITLE = "HyFy Designs — Custom apparel and merch in Houston";
const DEFAULT_DESCRIPTION =
  "Houston's custom apparel studio since 2004. T-shirts, mugs, stickers, engravings, and print-on-demand merch. No minimums, quality guaranteed.";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await sanityFetch<SeoSettingsDoc | null>(
    SEO_SETTINGS_QUERY,
    {},
    null,
  );
  const title = seo?.siteTitle?.trim() || DEFAULT_TITLE;
  const description = seo?.siteDescription?.trim() || DEFAULT_DESCRIPTION;
  const ogImageUrl = seo?.ogImage
    ? urlFor(seo.ogImage).width(1200).height(630).url()
    : "/hyfy-logo-2026-Dark.png";

  return {
    title: { default: title, template: "%s · HyFy Designs" },
    description,
    metadataBase: new URL("https://hyfydesigns.com"),
    openGraph: {
      type: "website",
      title,
      description,
      url: "https://hyfydesigns.com",
      siteName: "HyFy Designs",
      images: [{ url: ogImageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    verification: googleVerification ? { google: googleVerification } : undefined,
  };
}

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
