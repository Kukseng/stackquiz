
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: __dirname, 
};

module.exports = nextConfig;
