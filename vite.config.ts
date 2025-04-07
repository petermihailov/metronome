import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

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
        // fonts
        'fonts/SFNS.woff2',
        'fonts/DSEG7Classic.woff2',
        // images
        'apple-touch-icon.png',
        'favicon.png',
        'og.jpg',
        'pwa-192.png',
        'pwa-512.png',
        'sprite.svg',
        'robots.txt',
      ],
      manifest: {
        name: 'Metronome',
        short_name: 'Metronome',
        description: 'just metronome',
        theme_color: '#000',
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
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
    APP_BUILD_TIME: JSON.stringify(new Date().getTime()),
  },
  server: {
    port: 3333,
  },
  preview: {
    port: 4444,
  },
})
