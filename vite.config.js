import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expose on all network interfaces
    port: 5173,
    https: process.env.NODE_ENV === 'development' ? {
      key: resolve(__dirname, 'localhost-key.pem'),
      cert: resolve(__dirname, 'localhost-cert.pem'),
    } : undefined, // Enable HTTPS for local development (generate certs if needed)
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://coffee-ordering-backend1-production.up.railway.app',
        changeOrigin: true,
        secure: process.env.NODE_ENV === 'production', // Disable secure check in dev if using HTTP
        cookieDomainRewrite: '', // Preserve cookie domain
        cookiePathRewrite: '', // Preserve cookie path
        headers: {
          Connection: 'keep-alive',
        },
      },
    },
    hmr: {
      host: '192.168.1.7', // Match your PC's IP
      port: 5173,
      protocol: process.env.NODE_ENV === 'development' ? 'wss' : 'ws', // Use wss with HTTPS
    },
  },
  define: {
    'process.env': process.env,
  },
});