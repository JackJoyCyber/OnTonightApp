/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
