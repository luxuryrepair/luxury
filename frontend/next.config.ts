import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : 'opcdigtqxrmksmemnugs.supabase.co'

// In GitHub Actions keep /luxury as fallback for Pages; elsewhere default to root.
const defaultBasePath = process.env.GITHUB_ACTIONS === 'true' ? '/luxury' : ''
const rawBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? defaultBasePath).trim()
const normalizedBasePath = rawBasePath
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, '')}`
  : ''

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  ...(normalizedBasePath
    ? {
        basePath: normalizedBasePath,
        assetPrefix: `${normalizedBasePath}/`,
      }
    : {}),
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
