/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: {
    // Disable problematic features that can cause workStore issues
    serverComponentsExternalPackages: [],
  },
  // Force static generation to avoid runtime issues
  output: 'standalone',
  // Disable edge runtime for now
  runtime: 'nodejs',
}

module.exports = nextConfig