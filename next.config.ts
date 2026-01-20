/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cf.bstatic.com",
        pathname: "/xdata/images/**"
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
        pathname: "/im/pictures/**"
      }
    ]
  }
};

export default nextConfig;
