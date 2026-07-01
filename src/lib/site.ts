export const site = {
  name: "HyFy Designs",
  tagline: "Custom apparel and merch, printed in Houston since 2004.",
  address: {
    line1: "Houston, TX",
    hours: "Mon–Fri · 9am–6pm",
    email: "hello@hyfydesigns.com",
    phone: "(713) 555-0142",
  },
  social: {
    instagram: "https://instagram.com/hyfydesigns",
    facebook: "https://facebook.com/hyfydesigns",
  },
  nav: [
    { label: "Shop", href: "/shop" },
    { label: "Custom orders", href: "/custom-orders" },
    { label: "Portfolio", href: "/custom-orders#portfolio" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  trust: [
    { icon: "award", label: "20+ years of print experience" },
    { icon: "building-store", label: "Local Houston studio" },
    { icon: "shield-check", label: "Quality guarantee" },
    { icon: "package", label: "No minimums on print-on-demand" },
  ],
} as const;
