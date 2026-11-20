import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig, loadEnv } from 'vite'

// Saat `npm run dev`, jalankan fungsi api/tanya.js seperti di Vercel agar
// pembimbing AI bisa dicoba di komputer. Kunci dibaca dari .env (tanpa VITE_).
function apiLokal(env) {
  return {
    name: 'api-lokal',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const nama = (req.url || '').split('?')[0].replace(/^\//, '')
        if (!['tanya', 'chat', 'status'].includes(nama)) return next()
        for (const k of ['GEMINI_API_KEY', 'GEMINI_MODEL', 'KAKAI_MODE']) {
          process.env[k] = env[k] || ''
        }
        const modul = await server.ssrLoadModule(`/api/${nama}.js`)
        await modul.default(req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    apiLokal(loadEnv(mode, process.cwd(), '')),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Belajar Eksponen',
        short_name: 'Eksponen',
        description: 'Belajar bilangan berpangkat langkah demi langkah.',
        lang: 'id',
        theme_color: '#1E3A8A',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
}))
