import type { Metadata } from "next";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

export default function OrderConfirmationPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <Container size="narrow">
          <div className="py-16 sm:py-24 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-navy text-cream inline-flex items-center justify-center mb-6">
              <Check className="h-7 w-7" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl sm:text-4xl">Order placed. We&apos;re on it.</h1>
            <p className="mt-4 text-ink-600 text-base max-w-md mx-auto leading-relaxed">
              You&apos;ll get tracking within 48 hours. We&apos;ve sent a
              receipt to your inbox.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="min-h-12 px-6 rounded-lg bg-navy text-cream text-sm font-medium inline-flex items-center justify-center gap-1.5 tap"
              >
                Keep shopping
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link
                href="/"
                className="min-h-12 px-6 rounded-lg border border-navy text-navy text-sm font-medium inline-flex items-center justify-center tap"
              >
                Back to home
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
