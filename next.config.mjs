/** @type {import('next').NextConfig} */
const nextConfig = {
    // ปรับค่า experimental.serverComponentsExternalPackages ให้รองรับแพ็คเกจที่ใช้ Node.js APIs
    experimental: {
      serverComponentsExternalPackages: ['pg', 'pg-promise', 'pg-native'],
    },
    // แก้ไข webpack configuration
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // ตั้งค่า fallback สำหรับโมดูล Node.js ที่จะไม่ทำงานในฝั่งไคลเอ็นต์
        config.resolve.fallback = {
          ...config.resolve.fallback,
          net: false,
          tls: false,
          fs: false,
          crypto: false,
          dns: false,
          stream: false,
          pg: false,
          'pg-native': false,
          'cloudflare:sockets': false,
        };
      }
      return config;
    },
  };
  

export default nextConfig;
