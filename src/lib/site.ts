export const site = {
  name: "HyFy Designs",
  tagline: "Custom apparel and merch, printed in Houston since 2004.",
  address: {
    line1: "9898 Bissonnet St, STE 368",
    city: "Houston",
    state: "TX",
    zip: "77036",
    country: "US",
    full: "9898 Bissonnet St, STE 368, Houston, TX 77036",
    hours: "Mon–Fri · 9am–6pm",
    email: "sales@hyfydesigns.com",
    phone: "(832) 780-9924",
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
