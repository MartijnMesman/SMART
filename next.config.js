/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Simplified config for WebContainer compatibility
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig