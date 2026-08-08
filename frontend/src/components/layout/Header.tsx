// Header — porting React di apex-dashboard/src/components/apex-header.js.
// Barra superiore: trigger menu mobile, search (visuale), CTA nuovo ordine,
// toggle tema, customizer (placeholder) e menu utente.
// Il dropdown è gestito con stato React + chiusura su click-esterno/Escape.
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toggleTheme } from '@/lib/theme'
import { Icon } from './Icon'

type OpenMenu = 'user' | null

export default function Header() {
  const [open, setOpen] = useState<OpenMenu>(null)
  const rootRef = useRef<HTMLDivElement>(null)



  const toggle = (menu: Exclude<OpenMenu, null>) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen((cur) => (cur === menu ? null : menu))
  }

  const openSidebar = () => {
    document.documentElement.dataset.mobileOpen = 'true'
  }

  return (
    <div ref={rootRef} className="sticky top-0 z-30">
      <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openSidebar}
            aria-label="Open menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="relative hidden h-9 w-72 items-center rounded-lg border border-input bg-muted/40 ps-9 pe-4 text-start text-sm text-muted-foreground/50 transition-colors hover:bg-muted/60 sm:flex"
          >
            <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            Search...
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Icon name="moon" className="h-4 w-4 dark:hidden" />
            <Icon name="sun" className="hidden h-4 w-4 dark:block" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              onClick={toggle('user')}
              aria-label="User menu"
              aria-expanded={open === 'user'}
              className="ms-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              AS
            </button>
            {open === 'user' && (
              <div className="absolute end-0 mt-2 w-48 origin-top-right rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">Aigars S.</p>
                  <p className="text-xs text-muted-foreground">aigars@example.com</p>
                </div>
                <div className="my-1 h-px bg-border" />
                <Link to="/settings" className="flex items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent">
                  <Icon name="settings" className="me-2 h-4 w-4" /> Settings
                </Link>
                <Link to="/notifications" className="flex items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent">
                  <Icon name="bell" className="me-2 h-4 w-4" /> Notifications
                </Link>
                <div className="my-1 h-px bg-border" />
                <Link to="/login" className="flex items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent">
                  <Icon name="log-out" className="me-2 h-4 w-4" /> Log out
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}
