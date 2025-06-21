import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: process.env.NODE_ENV === 'development' ? {
      key: resolve(__dirname, 'localhost-key.pem'),
      cert: resolve(__dirname, 'localhost-cert.pem'),
    } : undefined,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://coffee-ordering-backend1-production.up.railway.app',
        changeOrigin: true,
        secure: process.env.NODE_ENV === 'production',
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Ensure /api prefix is preserved
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Proxy error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxying request to:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log('Proxy response:', proxyRes.statusCode, proxyRes.headers);
          });
        },
      },
    },
    hmr: {
      host: '192.168.1.7',
      port: 5173,
      protocol: process.env.NODE_ENV === 'development' ? 'wss' : 'ws',
    },
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://coffee-ordering-backend1-production.up.railway.app'),
  },
});