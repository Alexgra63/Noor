import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.svg'],
          manifest: {
            name: 'Noor: Offline Dua & Zikr',
            short_name: 'Noor',
            description: 'A beautiful, offline Islamic Dua app that blends peace, simplicity, and personalization.',
            theme_color: '#0c1021',
            background_color: '#0c1021',
            display: 'standalone',
            icons: [
              {
                src: '/favicon.svg',
                sizes: '192x192',
                type: 'image/svg+xml'
              },
              {
                src: '/favicon.svg',
                sizes: '512x512',
                type: 'image/svg+xml'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
