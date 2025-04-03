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
}

module.exports = nextConfig