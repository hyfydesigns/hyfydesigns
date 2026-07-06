import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/badge";
import { ContactForm } from "@/components/contact/contact-form";
import { site } from "@/lib/site";
import { sanityFetch } from "@/sanity/client";
import { CONTACT_PAGE_QUERY } from "@/sanity/queries";
import type { ContactPageDoc } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the HyFy Designs studio in Houston. Custom orders, questions, or just to say hi.",
};

const DEFAULT_MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221730.6!2d-95.577!3d29.7604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX!5e0!3m2!1sen!2sus!4v1700000000";

export default async function ContactPage() {
  const cms = await sanityFetch<ContactPageDoc | null>(
    CONTACT_PAGE_QUERY,
    {},
    null,
  );

  const eyebrow = cms?.eyebrow ?? "Contact";
  const headline = cms?.headline ?? "Let's talk shop.";
  const intro =
    cms?.intro ??
    "Whether it's a one-off tee or 500 pieces for an event — we're around and always excited to talk print.";
  const formHeading = cms?.formHeading ?? "Send us a message.";
  const address = cms?.studioAddress?.trim() || site.address.line1;
  const hours = cms?.studioHours?.trim() || site.address.hours;
  const phone = cms?.studioPhone?.trim() || site.address.phone;
  const email = cms?.studioEmail?.trim() || site.address.email;
  const mapSrc = cms?.mapEmbedSrc ?? DEFAULT_MAP_SRC;
  const subjects = cms?.subjects?.filter((s) => s.trim().length > 0);

  return (
    <>
      <NavBar />
      <main className="flex-1">
        <section className="py-12 sm:py-16 bg-cream-warm/40 border-b border-hairline">
          <Container>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              {headline}
            </h1>
            <p className="mt-4 text-ink-600 text-base sm:text-lg max-w-xl leading-relaxed whitespace-pre-line">
              {intro}
            </p>
          </Container>
        </section>

        <section className="py-12 sm:py-16">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
              <div>
                <h2 className="text-2xl sm:text-3xl mb-6">{formHeading}</h2>
                <ContactForm subjects={subjects} />
              </div>

              <div className="space-y-6">
                <InfoRow
                  icon={<MapPin className="h-4 w-4" strokeWidth={2} />}
                  title="Studio"
                >
                  <span className="whitespace-pre-line">{address}</span>
                </InfoRow>
                <InfoRow
                  icon={<Clock className="h-4 w-4" strokeWidth={2} />}
                  title="Hours"
                >
                  {hours}
                </InfoRow>
                <InfoRow
                  icon={<Phone className="h-4 w-4" strokeWidth={2} />}
                  title="Phone"
                >
                  <a href={`tel:${phone.replace(/\D/g, "")}`}>{phone}</a>
                </InfoRow>
                <InfoRow
                  icon={<Mail className="h-4 w-4" strokeWidth={2} />}
                  title="Email"
                >
                  <a href={`mailto:${email}`}>{email}</a>
                </InfoRow>

                {mapSrc && (
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border border-hairline">
                    <iframe
                      title="HyFy Designs studio location"
                      src={mapSrc}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

function InfoRow({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="h-9 w-9 rounded-lg bg-blue-tint text-navy inline-flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-ink-400">{title}</p>
        <p className="mt-0.5 text-sm sm:text-base text-navy">{children}</p>
      </div>
    </div>
  );
}
