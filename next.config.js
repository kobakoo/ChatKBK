/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["kobakoo.com"],
  },
};

module.exports = nextConfig;
