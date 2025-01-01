// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */ 

//   images: {
//     domains: ["storage.googleapis.com", "lh3.googleusercontent.com", "firebasestorage.googleapis.com"], 
//   }
// };

// export default nextConfig;



// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["storage.googleapis.com", "lh3.googleusercontent.com", "firebasestorage.googleapis.com"],
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
};

export default nextConfig;