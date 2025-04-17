/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // This is required for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/shade-master' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/shade-master/' : '',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Ensure static export
  distDir: 'out',
}

module.exports = nextConfig 