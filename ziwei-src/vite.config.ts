import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'child_process'

const gitHash = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'dev';
  }
})();

const gitDate = (() => {
  try {
    return execSync('git log -1 --format=%ci HEAD').toString().trim().slice(0, 16);
  } catch {
    return '';
  }
})();

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,         // use existing public/manifest.json
      workbox: {
        navigateFallback: null,
        globPatterns: ['**/*.{js,css,png,svg,ico,woff2}'],
        runtimeCaching: [],
      },
    }),
  ],
  define: {
    __GIT_HASH__: JSON.stringify(gitHash),
    __GIT_DATE__: JSON.stringify(gitDate),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})