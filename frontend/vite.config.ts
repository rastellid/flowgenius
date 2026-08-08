import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Output e sourcemap per ciascun valore di APP_ENV.
const BUILD_BY_ENV = {
  dev: { outDir: 'build-dev', sourcemap: true },
  staging: { outDir: 'build-staging', sourcemap: true },
  production: { outDir: 'build-prod', sourcemap: false },
} as const

type AppEnv = keyof typeof BUILD_BY_ENV

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // `mode` seleziona il file d'ambiente caricato da Vite:
  //   vite build --mode staging     -> .env.staging     (APP_ENV=staging)
  //   vite build [--mode production]-> .env.production   (APP_ENV=production, default build)
  //   vite (dev server)             -> nessun file .env.*, si usa il fallback 'dev'.
  // loadEnv con prefisso '' carica TUTTE le variabili del file, comprese quelle
  // senza prefisso VITE_ (come APP_ENV).
  const env = loadEnv(mode, process.cwd(), '')
  const appEnv = (env.APP_ENV ?? 'dev') as AppEnv
  const buildCfg = BUILD_BY_ENV[appEnv] ?? BUILD_BY_ENV.production

  return {
    // Tailwind v4 non usa più tailwind.config.js / postcss.config.js: la
    // configurazione sta nelle direttive @theme / @custom-variant di src/index.css.
    plugins: [react(), tailwindcss()],
    // Espone al client, oltre alle VITE_*, anche le variabili APP_* — così
    // APP_ENV è leggibile via import.meta.env.APP_ENV (sostituisce VITE_APP_ENV).
    envPrefix: ['VITE_', 'APP_'],
    build: {
      // Cartella di output in base ad APP_ENV (default di Vite sarebbe "dist").
      outDir: buildCfg.outDir,
      // Sourcemap in dev/staging per il debug; spente in produzione.
      sourcemap: buildCfg.sourcemap,
    },
    resolve: {
      // Alias "@" → "src" (deve combaciare con paths in tsconfig.app.json).
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})