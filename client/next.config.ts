import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // distDir: 'build',
  images: { unoptimized: false },
};

export default nextConfig;
