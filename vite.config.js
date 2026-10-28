import { defineConfig } from 'vite';

export default defineConfig({ 
  base: '/put_k_uspehy/', // 👈 ЭТА СТРОЧКА ОБЯЗАТЕЛЬНА ДЛЯ GITHUB PAGES
  esbuild: { jsx: 'automatic' }, 
  server: { host: '0.0.0.0', allowedHosts: true } 
});