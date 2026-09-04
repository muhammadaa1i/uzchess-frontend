import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Backend asset storage (Cloudflare R2 public bucket) — see
        // ../backend/src/core/configs/r2/r2.config.ts. News/banner/course/book
        // images come back from the API as full URLs on this host.
        protocol: "https",
        hostname: "pub-83d44d477896463e9c27188da6d489de.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
