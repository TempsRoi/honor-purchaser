/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["firebase", "@firebase/auth", "undici"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      undici: false, // undiciをバンドルから除外
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**', // Googleユーザーコンテンツの全てのパスを許可
      },
    ],
  },
};

module.exports = nextConfig;
