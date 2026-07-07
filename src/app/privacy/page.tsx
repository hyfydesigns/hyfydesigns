import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { LegalLayout } from "@/components/legal/legal-layout";
import { site } from "@/lib/site";
import { sanityFetch } from "@/sanity/client";
import { CONTACT_PAGE_QUERY } from "@/sanity/queries";
import type { ContactPageDoc } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How HyFy Designs collects, uses, and protects your personal information.",
};

const EFFECTIVE_DATE = "July 2, 2026";

export default async function PrivacyPage() {
  const cms = await sanityFetch<ContactPageDoc | null>(
    CONTACT_PAGE_QUERY,
    {},
    null,
  );
  const email = cms?.studioEmail?.trim() || site.address.email;
  const phone = cms?.studioPhone?.trim() || site.address.phone;
  const address = cms?.studioAddress?.trim() || site.address.line1;

  return (
    <>
      <NavBar />
      <main className="flex-1">
        <LegalLayout title="Privacy Policy" effectiveDate={EFFECTIVE_DATE}>
          <p>
            HyFy Designs (&ldquo;<strong>we</strong>&rdquo;, &ldquo;
            <strong>us</strong>&rdquo;, or &ldquo;<strong>our</strong>&rdquo;)
            operates <a href="https://hyfydesigns.com">hyfydesigns.com</a>{" "}
            (the &ldquo;<strong>Site</strong>&rdquo;) and sells custom apparel,
            drinkware, stickers, and print-on-demand goods. This Privacy
            Policy explains what personal information we collect, how we use
            it, who we share it with, and the choices you have.
          </p>
          <p>
            By using the Site or placing an order, you agree to the
            collection and use of information described here.
          </p>

          <h2>1. Information we collect</h2>

          <h3>Information you provide directly</h3>
          <ul>
            <li>
              <strong>Order information:</strong> name, email address,
              shipping address, phone number (optional), and the items you
              purchase. We collect this on our checkout page before you are
              redirected to Stripe.
            </li>
            <li>
              <strong>Payment information:</strong> your card number,
              expiration, CVC, and billing address are entered on Stripe&rsquo;s
              hosted checkout page and processed by Stripe. We never see or
              store full card numbers on our servers.
            </li>
            <li>
              <strong>Custom-order requests:</strong> the name, email, project
              details, and any artwork files you upload through our
              custom-orders form.
            </li>
            <li>
              <strong>Contact form submissions:</strong> your name, email,
              subject, and message.
            </li>
            <li>
              <strong>Newsletter signups:</strong> your email address.
            </li>
          </ul>

          <h3>Information collected automatically</h3>
          <ul>
            <li>
              <strong>Analytics data:</strong> pages visited, time on page,
              referrer, approximate location (city/region derived from IP),
              device type, browser, and interaction events (e.g. added an
              item to cart, initiated checkout, completed purchase). We use{" "}
              <a
                href="https://vercel.com/docs/analytics"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel Analytics
              </a>{" "}
              and{" "}
              <a
                href="https://posthog.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                PostHog
              </a>{" "}
              for this. Both anonymize IP addresses.
            </li>
            <li>
              <strong>Cookies and similar technologies:</strong> we use a small
              number of first-party cookies and localStorage entries to
              remember your cart contents between visits and to identify
              return visitors for analytics.
            </li>
            <li>
              <strong>Performance data:</strong> Core Web Vitals metrics
              (largest contentful paint, cumulative layout shift, input
              latency) via Vercel Speed Insights.
            </li>
          </ul>

          <h2>2. How we use your information</h2>
          <ul>
            <li>To process and fulfill your orders</li>
            <li>To send you order confirmations, shipping notifications, and receipts</li>
            <li>To reply to inquiries you send through the contact form</li>
            <li>To respond to custom-order quote requests</li>
            <li>To send our newsletter (only if you subscribed)</li>
            <li>To detect and prevent fraud</li>
            <li>To improve the Site&rsquo;s design, product mix, and user experience through aggregate analytics</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2>3. Who we share information with</h2>
          <p>
            We do not sell your personal information. We share it only with
            the service providers that make the Site work:
          </p>
          <ul>
            <li>
              <strong>
                <a
                  href="https://www.printful.com/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Printful
                </a>
              </strong>{" "}
              — our print-on-demand fulfillment partner. We share your
              shipping address, email, and order details so they can produce
              and ship your items.
            </li>
            <li>
              <strong>
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Stripe
                </a>
              </strong>{" "}
              — payment processor. Stripe collects your payment details
              directly and handles all card processing under PCI DSS Level 1
              compliance.
            </li>
            <li>
              <strong>
                <a
                  href="https://www.sanity.io/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sanity
                </a>
              </strong>{" "}
              — content management. Sanity stores our editorial content
              (product descriptions, imagery, testimonials); it does not
              receive customer order data.
            </li>
            <li>
              <strong>
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vercel
                </a>
              </strong>{" "}
              — hosting, analytics, and performance monitoring.
            </li>
            <li>
              <strong>
                <a
                  href="https://posthog.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PostHog
                </a>
              </strong>{" "}
              — product analytics.
            </li>
            <li>
              <strong>Government or law enforcement</strong> — if we&rsquo;re
              required by valid legal process (subpoena, court order).
            </li>
          </ul>

          <h2>4. Data retention</h2>
          <p>
            We retain order records for at least seven (7) years to satisfy
            tax and accounting requirements. Custom-order artwork and quote
            requests are retained for two (2) years so we can reference past
            work. Contact-form messages and newsletter subscriber lists are
            kept until you unsubscribe or request deletion. Anonymous
            analytics are retained on our providers&rsquo; standard
            schedules.
          </p>

          <h2>5. Your rights</h2>
          <p>
            Depending on where you live, you may have the following rights
            over your personal information:
          </p>
          <ul>
            <li>
              <strong>Access</strong> — request a copy of the personal
              information we hold about you
            </li>
            <li>
              <strong>Correction</strong> — ask us to fix inaccurate
              information
            </li>
            <li>
              <strong>Deletion</strong> — ask us to delete your information,
              subject to legal retention obligations
            </li>
            <li>
              <strong>Portability</strong> — receive a machine-readable copy
              of your information
            </li>
            <li>
              <strong>Opt-out of marketing</strong> — unsubscribe from
              newsletters at any time via the link in each email
            </li>
            <li>
              <strong>Do not sell or share</strong> — California residents
              can request that we not sell or share their personal
              information (we do not sell information regardless)
            </li>
          </ul>
          <p>
            To exercise any of these rights, email us at{" "}
            <a href={`mailto:${email}`}>{email}</a>. We will respond within
            30 days.
          </p>

          <h2>6. Cookies</h2>
          <p>
            The Site uses a small number of first-party cookies and
            localStorage entries:
          </p>
          <ul>
            <li>
              <strong>hyfy-cart</strong> — stores your cart contents in your
              browser so it persists between visits
            </li>
            <li>
              <strong>ph_*</strong> — PostHog analytics identifiers
              (anonymized)
            </li>
            <li>
              <strong>_vercel_*</strong> — Vercel Analytics
            </li>
          </ul>
          <p>
            You can clear these at any time from your browser settings.
            Disabling them will not prevent you from browsing or purchasing
            but may affect saved cart state.
          </p>

          <h2>7. Children&rsquo;s privacy</h2>
          <p>
            The Site is not directed at children under 13. We do not
            knowingly collect personal information from children. If you
            believe a child has provided us information, contact us and we
            will delete it.
          </p>

          <h2>8. International visitors</h2>
          <p>
            The Site is operated in the United States. If you access it from
            outside the US, your information will be transferred to,
            processed, and stored in the US.
          </p>

          <h2>9. Security</h2>
          <p>
            We take reasonable steps to protect your information, including
            HTTPS across the Site, PCI-compliant payment processing through
            Stripe, and least-privilege access for our team. No transmission
            over the internet is 100% secure, however, and we cannot
            guarantee absolute security.
          </p>

          <h2>10. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The
            &ldquo;Effective&rdquo; date at the top will reflect the latest
            revision. Material changes will be announced on the Site or via
            email to newsletter subscribers.
          </p>

          <h2>11. Contact us</h2>
          <p>
            Questions about this Privacy Policy or how we handle your
            information:
          </p>
          <ul>
            <li>
              Email: <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>Phone: {phone}</li>
            <li>
              Address:{" "}
              <span className="whitespace-pre-line">{address}</span>
            </li>
          </ul>

          <p className="mt-8">
            See also our{" "}
            <Link href="/terms">Terms of Service</Link>.
          </p>
        </LegalLayout>
      </main>
      <Footer />
    </>
  );
}
