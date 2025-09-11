/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  theme: {
  extend: {
    fontFamily: {
      dmsan: ["DM Sans", "sans-serif"],
      kh: ["Kantumruy Pro", "sans-serif"],
    },
  },
},
};

module.exports = nextConfig;