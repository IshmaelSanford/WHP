import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/WHP",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
