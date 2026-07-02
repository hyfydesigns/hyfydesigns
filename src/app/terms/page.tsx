import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { LegalLayout } from "@/components/legal/legal-layout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions for using the HyFy Designs website and purchasing our products.",
};

const EFFECTIVE_DATE = "July 2, 2026";

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <LegalLayout title="Terms of Service" effectiveDate={EFFECTIVE_DATE}>
          <p>
            These Terms of Service (&ldquo;<strong>Terms</strong>&rdquo;)
            govern your access to and use of{" "}
            <a href="https://hyfydesigns.com">hyfydesigns.com</a> (the
            &ldquo;<strong>Site</strong>&rdquo;), operated by HyFy Designs, a
            Houston, Texas custom apparel studio (&ldquo;
            <strong>we</strong>&rdquo;, &ldquo;<strong>us</strong>&rdquo;, or
            &ldquo;<strong>our</strong>&rdquo;).
          </p>
          <p>
            By using the Site, placing an order, or submitting a custom-order
            quote, you agree to these Terms. If you do not agree, please do
            not use the Site.
          </p>

          <h2>1. Eligibility</h2>
          <p>
            You must be at least 18 years old, or the age of legal majority
            in your jurisdiction, to purchase from the Site. By purchasing,
            you represent that you meet this requirement.
          </p>

          <h2>2. Products and services</h2>
          <p>We offer:</p>
          <ul>
            <li>
              <strong>Ready-to-order merchandise</strong> — apparel, drinkware,
              stickers, and accessories from our print-on-demand catalog.
              Each item is produced fresh when you order.
            </li>
            <li>
              <strong>Custom orders</strong> — bulk team apparel, event
              merchandise, engravings, and design services quoted per
              project.
            </li>
          </ul>
          <p>
            Product photos on the Site are mockups. Actual color, print
            placement, and fabric weight may vary slightly due to the
            print-on-demand production process, differences in monitor color
            reproduction, and normal manufacturing tolerance.
          </p>

          <h2>3. Ordering and payment</h2>
          <p>
            Orders are placed through Stripe&rsquo;s hosted checkout. When
            you complete checkout, you authorize us to charge your payment
            method for the total amount displayed, including product,
            shipping, and any applicable tax.
          </p>
          <p>
            We reserve the right to refuse or cancel any order for any
            reason, including suspected fraud, pricing errors, product
            unavailability, or misuse of promotional offers. If we cancel a
            paid order, we will refund your payment in full.
          </p>

          <h2>4. Pricing</h2>
          <p>
            All prices are displayed in United States Dollars (USD) and do
            not include applicable taxes unless stated. We may change prices
            at any time; the price you see at the moment you place an order
            is the price you pay for that order.
          </p>
          <p>
            If a product is listed at an incorrect price due to a typographical
            or system error, we may cancel any order placed at that price
            and issue a full refund, even if the order has been confirmed.
          </p>

          <h2>5. Shipping</h2>
          <p>
            Orders are fulfilled and shipped by{" "}
            <a
              href="https://www.printful.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Printful
            </a>{" "}
            from their fulfillment centers. Production typically takes 2–5
            business days after your order is placed. Shipping times shown at
            checkout are Printful&rsquo;s estimates after production and are
            not guaranteed.
          </p>
          <p>
            Risk of loss passes to you once the item is delivered by the
            carrier. If your order arrives damaged or is lost in transit,
            contact us within 30 days and we will work with Printful to
            resolve it.
          </p>
          <p>
            We currently ship only to addresses within the United States.
          </p>

          <h2>6. Returns and exchanges</h2>
          <p>
            Because every item is printed on demand for you specifically, we
            do not accept returns or exchanges for buyer&rsquo;s remorse
            (e.g. the wrong size selected, changed your mind). Please review
            the size chart and preview mockup before ordering.
          </p>
          <p>We will replace or refund items that are:</p>
          <ul>
            <li>
              <strong>Defective</strong> — misprinted, torn, or with
              manufacturing flaws
            </li>
            <li>
              <strong>Damaged in shipping</strong> — arrived broken or
              stained through no fault of the customer
            </li>
            <li>
              <strong>Not as ordered</strong> — wrong item, wrong size, or
              wrong color from what you selected
            </li>
          </ul>
          <p>
            Contact us at{" "}
            <a href={`mailto:${site.address.email}`}>{site.address.email}</a>{" "}
            within 30 days of delivery with your order number and photos of
            the issue. We will replace or refund the item at our discretion.
          </p>

          <h2>7. Custom orders</h2>
          <p>
            Custom orders are quoted individually. A written quote is valid
            for 30 days from the date issued. To proceed, a 50% deposit is
            required before production begins for orders over $500; balance
            due before shipment. Custom orders are non-refundable once
            production has started.
          </p>
          <p>
            You are responsible for approving digital proofs before we begin
            production. Once you approve a proof, we are not responsible for
            errors in the approved artwork (spelling, layout, colors, etc.).
          </p>

          <h2>8. Intellectual property</h2>

          <h3>Site content</h3>
          <p>
            All content on the Site — including the HyFy Designs name and
            logo, product designs we created, photography, copy, code, and
            layout — is our property or the property of our licensors and is
            protected by United States and international copyright and
            trademark laws. You may not copy, modify, or redistribute Site
            content without our written permission.
          </p>

          <h3>Your uploads</h3>
          <p>
            When you submit artwork, logos, or files through our custom-orders
            form, you represent and warrant that:
          </p>
          <ul>
            <li>You own the rights to the artwork, or</li>
            <li>
              You have permission from the rights holder to have it printed
              on merchandise
            </li>
          </ul>
          <p>
            You retain ownership of your artwork. By submitting it, you grant
            us a limited license to reproduce it solely for the purpose of
            producing your order. We will not use your artwork for other
            customers or in our marketing without your permission.
          </p>
          <p>
            <strong>We reserve the right to refuse any order</strong> that
            involves artwork that appears to infringe someone else&rsquo;s
            copyright or trademark, that promotes hatred or violence, or
            that we consider offensive.
          </p>

          <h2>9. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Site for any unlawful purpose</li>
            <li>
              Attempt to gain unauthorized access to any part of the Site,
              our servers, or accounts belonging to other users
            </li>
            <li>
              Scrape, harvest, or otherwise programmatically extract data
              from the Site without our permission
            </li>
            <li>
              Interfere with or disrupt the Site through denial-of-service
              attacks, malware, or similar means
            </li>
            <li>
              Submit false or misleading information in orders or contact
              forms
            </li>
          </ul>

          <h2>10. Disclaimers</h2>
          <p>
            The Site and all products are provided &ldquo;as is&rdquo; and
            &ldquo;as available&rdquo; without warranties of any kind,
            express or implied, including implied warranties of
            merchantability, fitness for a particular purpose, and
            non-infringement, except where such warranties cannot be
            disclaimed under applicable law.
          </p>
          <p>
            We do not warrant that the Site will be uninterrupted or
            error-free, that defects will be corrected, or that the Site is
            free of viruses or other harmful components.
          </p>

          <h2>11. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, HyFy Designs and its
            owners, employees, and contractors will not be liable for any
            indirect, incidental, consequential, special, or punitive
            damages arising out of or related to your use of the Site or
            purchase of any product, even if we have been advised of the
            possibility of such damages.
          </p>
          <p>
            Our total aggregate liability to you for any claim relating to
            an order will not exceed the amount you paid for the order in
            question.
          </p>

          <h2>12. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless HyFy Designs
            from any claims, losses, damages, liabilities, and expenses
            (including reasonable attorneys&rsquo; fees) arising out of your
            use of the Site, your violation of these Terms, your artwork
            infringing a third party&rsquo;s rights, or your violation of
            any applicable law.
          </p>

          <h2>13. Governing law and disputes</h2>
          <p>
            These Terms are governed by the laws of the State of Texas,
            without regard to its conflict of laws principles. Any dispute
            arising out of or related to these Terms or your use of the Site
            will be resolved in the state or federal courts located in
            Harris County, Texas, and you consent to their personal
            jurisdiction.
          </p>

          <h2>14. Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. The
            &ldquo;Effective&rdquo; date at the top will reflect the latest
            revision. Continued use of the Site after changes take effect
            constitutes acceptance of the revised Terms.
          </p>

          <h2>15. Contact us</h2>
          <ul>
            <li>
              Email:{" "}
              <a href={`mailto:${site.address.email}`}>{site.address.email}</a>
            </li>
            <li>Phone: {site.address.phone}</li>
            <li>Address: {site.address.line1}</li>
          </ul>

          <p className="mt-8">
            See also our{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </LegalLayout>
      </main>
      <Footer />
    </>
  );
}
