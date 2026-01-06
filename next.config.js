/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.cloudflare.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'images.contentstack.io',
      },
      {
        protocol: 'https',
        hostname: 'media.contentapi.ea.com',
      },
    ],
  },
};

module.exports = nextConfig;
