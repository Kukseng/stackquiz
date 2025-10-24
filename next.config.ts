/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    domains: ['api.dicebear.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      // Redirect www to non-www (permanent 301)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.stackquiz-two.vercel.app',
          },
        ],
        destination: 'https://www.stackquiz.me/:path*',
        permanent: true, // 301 permanent redirect
      },
      // Redirect root to join-room (temporary 307)
      {
        source: '/',
        destination: '/join-room',
        permanent: false, // 307 temporary redirect
      },
    ];
  },
};

module.exports = nextConfig;

