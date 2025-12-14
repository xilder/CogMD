import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // distDir: 'build',
  images: { unoptimized: false },
};

export default nextConfig;
