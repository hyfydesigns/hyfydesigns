import type { Metadata } from "next";
import Link from "next/link";
import { Check, AlertTriangle, ArrowRight } from "lucide-react";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { unsubscribeFromNewsletter } from "@/lib/email";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const params = await searchParams;
  const email = (params.email ?? "").trim().toLowerCase();
  const token = (params.token ?? "").trim();

  const result = await unsubscribeFromNewsletter(email, token);

  return (
    <>
      <NavBar />
      <main className="flex-1">
        <Container size="narrow">
          <div className="py-16 sm:py-24 text-center">
            {result.ok ? (
              <>
                <div className="mx-auto h-14 w-14 rounded-full bg-navy text-cream inline-flex items-center justify-center mb-6">
                  <Check className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl sm:text-4xl">You&rsquo;re unsubscribed.</h1>
                <p className="mt-4 text-ink-600 text-base max-w-md mx-auto leading-relaxed">
                  {email ? (
                    <>
                      We&rsquo;ll stop sending newsletter emails to{" "}
                      <span className="font-mono text-navy break-all">
                        {email}
                      </span>
                      .
                    </>
                  ) : (
                    "We'll stop sending newsletter emails."
                  )}{" "}
                  If this was a mistake, you can rejoin anytime from the site.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto h-14 w-14 rounded-full bg-red-tint text-red-deep inline-flex items-center justify-center mb-6">
                  <AlertTriangle className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl sm:text-4xl">
                  We couldn&rsquo;t verify that link.
                </h1>
                <p className="mt-4 text-ink-600 text-base max-w-md mx-auto leading-relaxed">
                  The unsubscribe link may have been edited or expired. Email
                  us and we&rsquo;ll take you off the list manually — no
                  hassle.
                </p>
              </>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="min-h-12 px-6 rounded-lg bg-navy text-cream text-sm font-medium inline-flex items-center justify-center gap-1.5 tap"
              >
                Back to home
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              {!result.ok && (
                <Link
                  href="/contact"
                  className="min-h-12 px-6 rounded-lg border border-navy text-navy text-sm font-medium inline-flex items-center justify-center tap"
                >
                  Contact the studio
                </Link>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
