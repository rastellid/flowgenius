import { Link } from 'react-router-dom'

// Catch-all per le voci di Sidebar non ancora implementate: senza questa rotta
// un URL non mappato renderizza la shell con <main> vuoto.
export default function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Pagina non trovata</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Questa sezione non esiste (ancora).
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Torna alla dashboard
        </Link>
      </div>
    </div>
  )
}