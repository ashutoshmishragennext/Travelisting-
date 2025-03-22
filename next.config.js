/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

const nextConfig = {
  experimental: {
    distDir: "build",
    reactStrictMode: true,
    useCache: true,
    swcMinify: true,
    compiler: {
      removeConsole: process.env.NODE_ENV !== "development",
    }
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})(nextConfig);