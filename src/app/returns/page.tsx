import type { Metadata } from "next";
import Link from "next/link";
import { Check, RefreshCw, ShieldAlert, Truck } from "lucide-react";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/badge";
import { site } from "@/lib/site";
import { sanityFetch } from "@/sanity/client";
import { CONTACT_PAGE_QUERY } from "@/sanity/queries";
import type { ContactPageDoc } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Return policy",
  description:
    "HyFy Designs return and refund policy. Every item is printed on demand — here's what's covered and how to request a replacement.",
};

const covered = [
  {
    icon: ShieldAlert,
    title: "Defective",
    copy: "Misprinted, torn, or with a manufacturing flaw.",
  },
  {
    icon: Truck,
    title: "Damaged in shipping",
    copy: "Arrived broken, stained, or otherwise damaged in transit.",
  },
  {
    icon: RefreshCw,
    title: "Not as ordered",
    copy: "Wrong item, wrong size, or wrong color from what you selected.",
  },
];

export default async function ReturnsPage() {
  const cms = await sanityFetch<ContactPageDoc | null>(
    CONTACT_PAGE_QUERY,
    {},
    null,
  );
  const email = cms?.studioEmail?.trim() || site.address.email;

  return (
    <>
      <NavBar />
      <main className="flex-1">
        <section className="py-12 sm:py-16 bg-cream-warm/40 border-b border-hairline">
          <Container size="narrow">
            <Eyebrow>Return policy</Eyebrow>
            <h1 className="mt-4 text-4xl sm:text-5xl leading-[1.05]">
              Made for you. Made right.
            </h1>
            <p className="mt-4 text-ink-600 text-base sm:text-lg leading-relaxed">
              Every piece is printed on demand specifically for your order —
              here&rsquo;s what that means for returns, and what we&rsquo;ll
              always make right.
            </p>
          </Container>
        </section>

        <section className="py-12 sm:py-16">
          <Container size="narrow">
            <div className="bg-white border border-hairline rounded-2xl p-6 sm:p-8 mb-10">
              <h2 className="text-xl sm:text-2xl mb-2">
                No returns for buyer&rsquo;s remorse
              </h2>
              <p className="text-sm sm:text-base text-ink-600 leading-relaxed">
                Because each item is printed just for you, we can&rsquo;t
                accept returns or exchanges for things like an incorrect size
                selection or a change of mind. Please double-check the size
                chart and preview mockup before you order — reach out first
                if you&rsquo;re unsure, we&rsquo;re happy to help you pick.
              </p>
            </div>

            <h2 className="text-2xl sm:text-3xl mb-2">
              What we&rsquo;ll always replace or refund
            </h2>
            <p className="text-ink-600 mb-6">
              If something&rsquo;s genuinely wrong with your order, we&rsquo;ll
              make it right — no hassle.
            </p>
            <div className="grid gap-4 sm:grid-cols-3 mb-10">
              {covered.map((c) => (
                <div
                  key={c.title}
                  className="bg-white border border-hairline rounded-2xl p-5"
                >
                  <div className="h-10 w-10 rounded-lg bg-blue-tint text-navy inline-flex items-center justify-center mb-3">
                    <c.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-base font-medium text-navy">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-600 leading-relaxed">
                    {c.copy}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-navy rounded-2xl p-6 sm:p-8 text-cream">
              <h2 className="text-xl sm:text-2xl mb-3">
                How to request a replacement
              </h2>
              <ol className="space-y-3 text-sm sm:text-base leading-relaxed">
                <li className="flex gap-3">
                  <span className="h-6 w-6 rounded-full bg-cream/15 text-cream text-xs font-medium inline-flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Email{" "}
                    <a href={`mailto:${email}`} className="underline">
                      {email}
                    </a>{" "}
                    within 30 days of delivery.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="h-6 w-6 rounded-full bg-cream/15 text-cream text-xs font-medium inline-flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Include your order number and a photo of the issue.</span>
                </li>
                <li className="flex gap-3">
                  <span className="h-6 w-6 rounded-full bg-cream/15 text-cream text-xs font-medium inline-flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    We&rsquo;ll review and get back to you within one business
                    day with a replacement or refund.
                  </span>
                </li>
              </ol>
              <div className="mt-5 pt-5 border-t border-cream/15 flex items-center gap-2 text-sm text-cream/80">
                <Check className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
                Replacements ship at no extra cost to you.
              </div>
            </div>

            <p className="mt-8 text-sm text-ink-400">
              This return policy is part of our{" "}
              <Link href="/terms" className="underline hover:text-navy">
                Terms of Service
              </Link>
              . Have a question first?{" "}
              <Link href="/contact" className="underline hover:text-navy">
                Contact the studio
              </Link>
              .
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
