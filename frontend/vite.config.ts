import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import symfonyPlugin from 'vite-plugin-symfony'

// Sourcemap per ciascun valore di APP_ENV. L'output è sempre ../public/build
// (dove nginx serve e dove pentatrion/vite-bundle legge manifest + entrypoints).
const SOURCEMAP_BY_ENV = {
  dev: true,
  staging: true,
  production: false,
} as const

type AppEnv = keyof typeof SOURCEMAP_BY_ENV

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // `mode` seleziona il file d'ambiente caricato da Vite:
  //   vite build --mode staging     -> .env.staging     (APP_ENV=staging)
  //   vite build [--mode production]-> .env.production   (APP_ENV=production, default build)
  //   vite (dev server)             -> nessun file .env.*, si usa il fallback 'dev'.
  const env = loadEnv(mode, process.cwd(), '')
  const appEnv = (env.APP_ENV ?? 'dev') as AppEnv
  const sourcemap = SOURCEMAP_BY_ENV[appEnv] ?? false

  return {
    // Gli asset buildati sono serviti da nginx sotto /build/.
    base: '/build/',
    // Tailwind v4 non usa più tailwind.config.js / postcss.config.js: la
    // configurazione sta nelle direttive @theme / @custom-variant di src/index.css.
    plugins: [
      react(),
      tailwindcss(),
      // Genera public/build/.vite/entrypoints.json (letto dal bundle Symfony).
      symfonyPlugin(),
    ],
    // Espone al client, oltre alle VITE_*, anche le variabili APP_*.
    envPrefix: ['VITE_', 'APP_'],
    build: {
      // La build finisce nel public/ di Symfony (nginx root = public/).
      outDir: '../public/build',
      emptyOutDir: true,
      // Necessario al bundle per risolvere nome-entry -> file hashato.
      manifest: true,
      sourcemap,
      rollupOptions: {
        // Entry 'main' -> in Twig: vite_entry_*_tags('main'). Non più index.html.
        input: {
          main: fileURLToPath(new URL('./src/main.tsx', import.meta.url)),
        },
      },
    },
    server: {
      // Il dev server gira sull'host; il browser (sull'host) carica gli asset da
      // qui mentre l'HTML arriva da Symfony su :8080.
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      origin: 'http://localhost:5173',
      // Vite 8 blocca il CORS di default: autorizza l'origine :8080 a fetchare gli asset.
      cors: {
        origin: /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
      },
    },
    resolve: {
      // Alias "@" → "src" (deve combaciare con paths in tsconfig.app.json).
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
