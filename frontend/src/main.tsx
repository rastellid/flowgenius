import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
// index-custom.css importa index.css (il base) e vi applica gli override.
import './index-custom.css'
import { initTheme } from './lib/theme'
import { router } from './router.tsx'

// Lo script inline in index.html ha già applicato il tema prima del primo
// paint; qui agganciamo i cambi a runtime (es. l'OS che passa a dark mode).
initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
