/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'release',
  
    images: {
      domains: ["storage.googleapis.com", "lh3.googleusercontent.com", "firebasestorage.googleapis.com"], 
    },
    
     
    
    
  };
  
  export default nextConfig;