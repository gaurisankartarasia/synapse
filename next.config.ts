
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {


  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Credentials', 
            value: 'true' 
          },
          { 
            key: 'Access-Control-Allow-Origin', 
            value: '*' 
          },
        ],
      },
    ];
  },

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





// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   async headers() {
//     return [
//       {
//         source: '/api/:path*',
//         headers: [
//           { key: 'Access-Control-Allow-Credentials', value: 'true' },
//           { key: 'Access-Control-Allow-Origin', value: '*' },
//         ],
//       },
//     ];
//   },
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'http://localhost:5000/api/:path*', // Proxy to Express backend
//       },
//     ];
//   },
//   images: {
//     remotePatterns: [
//       { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
//       { protocol: 'https', hostname: 'storage.googleapis.com', pathname: '/**' },
//       { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
//       { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/**' },
//       { protocol: 'https', hostname: 'quixxle.appspot.com', pathname: '/**' },
//     ],
//   },
//   experimental: {
//     // viewTransition: true,

//     turbo: {
//       // Turbopack-specific configurations can be added here
//       // For example, to set up module aliases:
//       resolveAlias: {
//         '@components': './src/components',
//       },
      
//     },
//   },
// };

// export default nextConfig;
