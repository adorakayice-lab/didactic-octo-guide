/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com', 'cdn.pixabay.com'],
    formats: ['image/avif', 'image/webp'],
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  // Security headers are managed via middleware or platform; removed unsupported key.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;
