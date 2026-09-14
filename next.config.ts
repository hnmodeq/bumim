import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // Required so app/global-not-found.tsx handles unmatched URLs (our root
    // layout lives under the dynamic [locale] segment, which prevents Next
    // from composing a locale-aware 404 from layout + not-found alone).
    globalNotFound: true,
  },
  images: {
    // Allow avatars/covers/thumbnails served from Supabase Storage.
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
    ],
  },
};

export default withNextIntl(nextConfig);
