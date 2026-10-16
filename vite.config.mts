import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const API_PORT = process.env.API_PORT || '3740';
// 5182: 5173 é do Ockto/Upfunnels e 5180 do Kanban.
const WEB_PORT = Number(process.env.WEB_PORT) || 5182;

// Em dev, o Vite serve a interface e repassa /api à API NestJS (mesma origem: o cookie funciona sem CORS).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  server: {
    port: WEB_PORT,
    strictPort: true,
    proxy: {
      '/api': { target: `http://127.0.0.1:${API_PORT}`, changeOrigin: false },
    },
  },
  build: { outDir: 'dist', emptyOutDir: true },
});
