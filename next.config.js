/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
  },
  async headers() {
    const allowedOrigin = process.env.ALLOWED_ORIGINS?.trim();
    if (!allowedOrigin) return [];
    const parsed = new URL(allowedOrigin);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== allowedOrigin) {
      throw new Error('ALLOWED_ORIGINS must be one exact HTTP(S) origin, without a path or trailing slash.');
    }
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: allowedOrigin },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
