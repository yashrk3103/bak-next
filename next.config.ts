import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl) : null;
const supabaseProtocol = (supabaseOrigin?.protocol.replace(":", "") || "https") as "http" | "https";

const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = supabaseOrigin
  ? [
      {
        protocol: supabaseProtocol,
        hostname: supabaseOrigin.hostname,
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: supabaseProtocol,
        hostname: supabaseOrigin.hostname,
        pathname: "/storage/v1/object/sign/**",
      },
    ]
  : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
