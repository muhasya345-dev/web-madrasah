/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // <--- INI KUNCINYA
  eslint: {
    ignoreDuringBuilds: true, // Biar gak error gara-gara warning sepele
  },
  images: {
    unoptimized: true, // Supaya gambar bisa muncul di mode export
  },
};

export default nextConfig;