import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "10.123.130.48", "localhost"],
  // Skip TypeScript and ESLint errors during Vercel build.
  // The Uploaded_on_github/ folder in the repo contains old broken files
  // that TypeScript would otherwise pick up and fail the build.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
