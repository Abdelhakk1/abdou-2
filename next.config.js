/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Image optimization
  images: {
    domains: ['images.pexels.com', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  // Webpack configuration to handle Node.js modules in browser
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        dns: false,
        tls: false,
        net: false,
        pg: false,
        'pg-native': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;