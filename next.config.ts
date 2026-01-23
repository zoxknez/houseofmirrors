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
      },
      {
        protocol: "https",
        hostname: "m9h4hzq4wcfctg7d.public.blob.vercel-storage.com",
        pathname: "/gallery/**"
      }
    ]
  }
};

export default nextConfig;
