module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'], // Replace with your image domains
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:5001', // Backend API base URL
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ];
  },
};