/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.fantasypros.com",
        port: "",
        pathname: "/images/players/nfl/*/headshot/70x70.png",
      },
      {
        protocol: "https",
        hostname: "cdn.footballdb.com",
        port: "",
        pathname: "/headshots/NFL/**",
      },
    ],
  },
};

module.exports = nextConfig;
