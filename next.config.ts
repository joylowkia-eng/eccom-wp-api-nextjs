import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecommerce.local',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'ecommerce.local',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.local',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**.local',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'securepay.sslcommerz.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
