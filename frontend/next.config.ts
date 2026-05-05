import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : 'opcdigtqxrmksmemnugs.supabase.co'

const nextConfig: NextConfig = {
  output: 'export',
  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
