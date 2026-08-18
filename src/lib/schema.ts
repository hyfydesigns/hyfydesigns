import { site } from "@/lib/site";

function e164(phone: string): string {
  return `+1${phone.replace(/\D/g, "")}`;
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": "https://hyfydesigns.com/#business",
    name: site.name,
    description:
      "Custom t-shirt printing, screen printing, and print-on-demand apparel studio in Houston, TX. Team merch, event tees, and personal projects — no minimums.",
    url: "https://hyfydesigns.com",
    telephone: e164(site.address.phone),
    email: site.address.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: site.address.country,
    },
    areaServed: {
      "@type": "City",
      name: "Houston",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: [site.social.instagram, site.social.facebook],
  };
}

export function tshirtPrintingServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Custom T-Shirt Printing",
    name: "Custom T-Shirt Printing in Houston, TX",
    description:
      "Custom t-shirt printing, screen printing, and merch production for teams, events, and businesses in Houston. Upload your art and get a free quote within 24 hours.",
    url: "https://hyfydesigns.com/custom-orders",
    areaServed: {
      "@type": "City",
      name: "Houston",
    },
    provider: {
      "@type": "ClothingStore",
      "@id": "https://hyfydesigns.com/#business",
      name: site.name,
      telephone: e164(site.address.phone),
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.line1,
        addressLocality: site.address.city,
        addressRegion: site.address.state,
        postalCode: site.address.zip,
        addressCountry: site.address.country,
      },
    },
  };
}
