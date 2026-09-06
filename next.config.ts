import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Next.js walks up from this file looking for a lockfile to infer the
  // Turbopack workspace root, and stops at a stray package-lock.json in
  // C:\Users\muham (outside this repo) before reaching this project's own —
  // pin the root explicitly instead of relying on that inference.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        // Backend asset storage (Cloudflare R2 public bucket) — see
        // ../backend/src/core/configs/r2/r2.config.ts. News/banner/course/book
        // images come back from the API as full URLs on this host.
        protocol: "https",
        hostname: "pub-83d44d477896463e9c27188da6d489de.r2.dev",
        pathname: "/**"
      },
      {
        // YouTube's static thumbnail CDN — see
        // src/features/home/model/home-schemas.ts's toYoutubeThumbnailUrl,
        // used as a reliable poster image for the Game of the Day widget.
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**"
      },
      {
        // Lorem Picsum — local-dev-only placeholder photo service used by
        // ../backend/seed-local.js for news/banner/course/book imagery so
        // local seed data has real, distinct images instead of one reused
        // broken R2 URL. Not used by any production data path.
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**"
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

export default withNextIntl(nextConfig);
