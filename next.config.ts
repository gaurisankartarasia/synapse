import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["storage.googleapis.com", "lh3.googleusercontent.com", "firebasestorage.googleapis.com"], 
  }
};

export default nextConfig;
