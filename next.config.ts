/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    domains: ['api.dicebear.com'], // allowed external image domains
  },
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: '/',            // When users visit root
        destination: '/join-room', // Redirect to join-room
        permanent: false,       // Temporary redirect (307)
      },
    ];
  },
};

module.exports = nextConfig;

