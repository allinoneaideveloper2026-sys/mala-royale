import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// One build = browser link + installable app (PWA) + Android/iOS shell (Capacitor).
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mala Royale',
        short_name: 'Mala Royale',
        description: 'Best sarees, Custom Kuchu Styles, premium boutique',
        theme_color: '#6e1a3a',
        background_color: '#fdf8f6',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  test: { environment: 'node' }
});
