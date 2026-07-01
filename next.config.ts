import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "files.cdn.printful.com" },
      { protocol: "https", hostname: "cdn.printful.com" },
    ],
  },
};

export default nextConfig;
