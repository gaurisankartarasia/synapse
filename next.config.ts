import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/socket.io/:path*',
        destination: 'http://localhost:3001/socket.io/:path*',
      },
    ];
  },
  images: {
    domains: ["storage.googleapis.com", "lh3.googleusercontent.com", "firebasestorage.googleapis.com"], 
  }
};

export default nextConfig;

