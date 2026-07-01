import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M13.5 21v-8H16l.5-3.5h-3v-2c0-1 .3-1.7 1.8-1.7H17V3h-2.6c-2.6 0-4 1.4-4 4v2.5H8V13h2.4v8h3.1z" />
    </svg>
  );
}

const groups = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "T-shirts", href: "/shop?type=t-shirt" },
      { label: "Mugs", href: "/shop?type=mug" },
      { label: "Stickers", href: "/shop?type=sticker" },
      { label: "Best sellers", href: "/shop?sort=best" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Custom orders", href: "/custom-orders" },
      { label: "Bulk & team orders", href: "/custom-orders#bulk" },
      { label: "Design services", href: "/custom-orders#design" },
      { label: "Engravings", href: "/custom-orders#engraving" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "About", href: "/about" },
      { label: "Portfolio", href: "/custom-orders#portfolio" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 sm:mt-24 bg-navy text-cream">
      <Container>
        <div className="py-12 sm:py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl font-medium tracking-tight text-cream">
              Hy<span className="text-blue-light">Fy</span> Designs
            </p>
            <p className="mt-3 text-sm text-cream/75 leading-relaxed max-w-sm">
              {site.tagline}
            </p>
            <form
              action="/api/newsletter"
              method="post"
              className="mt-6 max-w-sm"
              aria-label="Subscribe to the newsletter"
            >
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-cream/60 mb-2">
                New drops in your inbox
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@studio.com"
                  className="flex-1 min-h-11 rounded-lg bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/50 px-3 text-sm focus:outline-none focus:border-red"
                />
                <button
                  type="submit"
                  className="min-h-11 px-4 rounded-lg bg-red text-cream text-sm font-medium hover:bg-red-deep tap"
                >
                  Join
                </button>
              </div>
            </form>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <h4 className="text-cream text-sm font-medium mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/70 hover:text-cream transition-colors tap"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-cream/10 py-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-xs text-cream/60">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
              {site.address.line1}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" strokeWidth={2} />
              {site.address.phone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" strokeWidth={2} />
              {site.address.email}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={site.social.instagram}
              aria-label="Instagram"
              className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-cream/10 tap"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramGlyph />
            </a>
            <a
              href={site.social.facebook}
              aria-label="Facebook"
              className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-cream/10 tap"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookGlyph />
            </a>
            <span>© {new Date().getFullYear()} HyFy Designs</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
