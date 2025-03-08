
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {



   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'quixxle.appspot.com',
        pathname: '/**',
      },
      
    ],
  },
};
export default nextConfig;




  // async headers() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       headers: [
  //         { 
  //           key: 'Access-Control-Allow-Credentials', 
  //           value: 'true' 
  //         },
  //         { 
  //           key: 'Access-Control-Allow-Origin', 
  //           value: 'http://localhost:3000' 
  //         },
  //       ],
  //     },
  //   ];
  // },