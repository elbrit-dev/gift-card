import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Your custom Webpack config (e.g., for SVG)
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
