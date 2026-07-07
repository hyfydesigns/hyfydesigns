import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/badge";
import { OrderLookup } from "@/components/account/order-lookup";

export const metadata: Metadata = {
  title: "Your account",
  description:
    "Look up an order from HyFy Designs or get in touch with the studio.",
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <section className="py-12 sm:py-16 bg-cream-warm/40 border-b border-hairline">
          <Container>
            <Eyebrow>Account</Eyebrow>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              Your orders and inbox.
            </h1>
            <p className="mt-4 text-ink-600 text-base sm:text-lg max-w-xl leading-relaxed">
              We don&rsquo;t require sign-in yet. Look up any past order below
              with the email and reference from your checkout receipt.
            </p>
          </Container>
        </section>

        <section className="py-12 sm:py-16">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
              <div className="bg-white border border-hairline rounded-2xl p-5 sm:p-7">
                <div className="flex items-center gap-2 mb-5">
                  <span className="h-6 w-6 rounded-full bg-navy text-cream text-xs font-medium inline-flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-lg">Look up an order</h2>
                </div>
                <OrderLookup />
              </div>

              <aside className="space-y-4">
                <div className="bg-white border border-hairline rounded-2xl p-5 sm:p-6">
                  <div className="h-9 w-9 rounded-lg bg-blue-tint text-navy inline-flex items-center justify-center mb-3">
                    <Mail className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-medium text-navy">
                    Where&rsquo;s my order reference?
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">
                    Every purchase gets a Stripe receipt by email at the
                    address you used at checkout. The reference starts with
                    <code className="font-mono text-xs mx-1 px-1 py-0.5 bg-blue-tint text-navy rounded">
                      cs_
                    </code>
                    and it&rsquo;s the &ldquo;Payment ID&rdquo; on that
                    receipt.
                  </p>
                </div>

                <div className="bg-white border border-hairline rounded-2xl p-5 sm:p-6">
                  <div className="h-9 w-9 rounded-lg bg-red-tint text-red-deep inline-flex items-center justify-center mb-3">
                    <MessageCircle className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-medium text-navy">
                    Something else?
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">
                    Wrong item, missing package, or a question we
                    haven&rsquo;t thought of yet?{" "}
                    <Link
                      href="/contact"
                      className="text-navy underline hover:text-blue"
                    >
                      Send us a message
                    </Link>{" "}
                    and we&rsquo;ll get back within one business day.
                  </p>
                </div>
              </aside>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
