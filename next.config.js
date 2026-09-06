/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Suppress React 19 script tag warnings from third-party libraries
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
