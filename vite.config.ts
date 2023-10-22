import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * @see https://vitejs.dev/config/
 */

export default defineConfig({
  css: {
    modules: {
      generateScopedName: '[local]--[hash:4]',
      localsConvention: 'camelCaseOnly',
    },
  },
  plugins: [
    /** @see https://vite-pwa-org.netlify.app/ */
    VitePWA({
      registerType: 'prompt',
      includeAssets: [
        // sounds
        'sounds/fxMetronome1.mp3',
        'sounds/fxMetronome2.mp3',
        'sounds/fxMetronome3.mp3',
      ],
      manifest: {
        name: 'Metronome',
        short_name: 'Metronome',
        description: 'just metronome',
        theme_color: '#121216',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),

    /** @see https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md */
    react(),
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    port: 3333,
  },
  preview: {
    port: 4444,
  },
});
