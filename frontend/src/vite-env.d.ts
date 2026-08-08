/// <reference types="vite/client" />

// Tipizza le variabili d'ambiente esposte al client (envPrefix in
// vite.config.ts: VITE_* e APP_*). Dà autocompletamento e type-check su
// import.meta.env.
interface ImportMetaEnv {
  /** Ambiente applicativo, guidato da APP_ENV in .env.staging / .env.production. */
  readonly APP_ENV: 'dev' | 'staging' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}