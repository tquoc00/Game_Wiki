import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === 'true' || process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" } : {}),
  basePath: isExport ? "/Game_Wiki" : "",
  assetPrefix: isExport ? "/Game_Wiki/" : undefined,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  ...(!isExport
    ? {
        async rewrites() {
          return [
            {
              source: "/api/:path*",
              destination: "http://localhost:5000/api/:path*",
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
