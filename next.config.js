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
      {
        protocol: 'https',
        hostname: 'dajajhtpbblfaocsaeyp.supabase.co',
      },
    ],
  },
  // Прокси для API - решает проблему с cookies на localhost
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
