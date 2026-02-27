import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "zxeuto22j2svqapd.public.blob.vercel-storage.com",
        pathname: "/**",
      }
    ]
  }
};

export default nextConfig;
