import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expose on all network interfaces
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://coffee-ordering-backend1-production.up.railway.app',
        changeOrigin: true,
        secure: true, // Use true for HTTPS
      },
    },
    hmr: {
      host: '192.168.1.7', // Match your PC's IP
      port: 5173,
      protocol: 'ws',
    },
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://coffee-ordering-backend1-production.up.railway.app'),
  },
});