// Gestione del tema — porting TypeScript di apex-dashboard/src/lib/theme.js.
// Persiste su localStorage, applica `.dark` su <html>, supporta la modalità
// "system" e notifica i cambi (utile per ri-tematizzare i grafici).
//
// NOTA: il tema *iniziale* è applicato dallo script inline in <head>
// (vedi index.html) per evitare il flash del tema sbagliato prima che il
// bundle sia caricato. Questo modulo gestisce i cambi a runtime.

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'apex-theme'
const THEME_CHANGE_EVENT = 'apex:themechange'

const media = window.matchMedia('(prefers-color-scheme: dark)')

export function getStoredTheme(): Theme {
  return (localStorage.getItem(STORAGE_KEY) as Theme) || 'system'
}

export function getResolvedTheme(): ResolvedTheme {
  const stored = getStoredTheme()
  if (stored === 'system') return media.matches ? 'dark' : 'light'
  return stored
}

function apply(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.style.colorScheme = resolved
  document.dispatchEvent(
    new CustomEvent(THEME_CHANGE_EVENT, { detail: { resolved } }),
  )
}

export function setTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme)
  apply(getResolvedTheme())
}

export function toggleTheme() {
  setTheme(getResolvedTheme() === 'dark' ? 'light' : 'dark')
}

/** Registra un listener sui cambi di tema; ritorna la funzione di cleanup
 *  (pensata per essere restituita da un useEffect). */
export function onThemeChange(handler: EventListener) {
  document.addEventListener(THEME_CHANGE_EVENT, handler)
  return () => document.removeEventListener(THEME_CHANGE_EVENT, handler)
}

/** Notifica un cambio senza toccare light/dark — serve quando cambia solo
 *  l'accento, così chi legge le CSS variable si aggiorna. */
export function notifyThemeChange() {
  document.dispatchEvent(
    new CustomEvent(THEME_CHANGE_EVENT, {
      detail: { resolved: getResolvedTheme() },
    }),
  )
}

export function initTheme() {
  // Tiene allineati gli utenti in modalità "system" quando l'OS cambia tema.
  media.addEventListener('change', () => {
    if (getStoredTheme() === 'system') apply(getResolvedTheme())
  })
  apply(getResolvedTheme())
}
