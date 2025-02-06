// // next.config.ts
// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {

//   async headers() {
//     return [
//       {
//         source: '/api/:path*',
//         headers: [
//           { key: 'Access-Control-Allow-Credentials', value: 'true' },
//           { key: 'Access-Control-Allow-Origin', value: '*' },
//           { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
//           { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
//         ],
//       },
//     ];
//   },

//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'storage.googleapis.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'lh3.googleusercontent.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'firebasestorage.googleapis.com',
//         pathname: '/**',
//       },
//     ],
//   },
// };

// export default nextConfig;







import type { NextConfig } from 'next';
import type { webpack } from 'next/dist/compiled/webpack/webpack';

const nextConfig: NextConfig = {
  webpack: (config: webpack.Configuration, { isServer }) => {
    if (isServer) {
      config.externals?.push('socket.io-client');
    }
    return config;
  },

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
          // ... rest of headers
        ],
      },
    ];
  },

   images: {
    remotePatterns: [
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
    ],
  },
};
export default nextConfig;
