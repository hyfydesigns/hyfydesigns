import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/studio/",
          "/checkout",
          "/order-confirmation",
          "/account",
          "/unsubscribe",
        ],
      },
    ],
    sitemap: "https://hyfydesigns.com/sitemap.xml",
    host: "https://hyfydesigns.com",
  };
}
