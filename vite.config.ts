import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    open: true,
    host: true,
    hmr: {
      overlay: true
    }
  },
  build: {
    sourcemap: true,
  },
  logLevel: 'info'
});