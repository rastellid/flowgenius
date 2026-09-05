
// Sidebar — porting React di apex-dashboard/src/components/apex-sidebar.js.
// Le classi CSS (.apex-sidebar-aside, .sidebar-nav-item, .nav-group-body …)
// vivono già in src/index.css. Differenze rispetto al vanilla:
//  - lo stato "attivo" arriva da react-router (<NavLink>), non dall'attributo.
//  - gruppi collassabili e collapse desktop gestiti con useState.
//  - drawer mobile e collasso desktop scrivono su <html> dataset + localStorage,
//    le stesse chiavi lette dallo script anti-flash in index.html e dal CSS.
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Icon, type IconName } from './Icon'

type NavItemData = { icon: IconName; label: string; to: string; badge?: string }
type NavGroupData = { label: string; items: NavItemData[] }

const navGroups: NavGroupData[] = [
  {
    label: 'Overview',
    items: [
      { icon: 'layout-dashboard', label: 'Dashboard', to: '/' },
      { icon: 'clipboard-check', label: 'Assessment', to: '/assessment' },
    ],
  },
]


/** Chiude il drawer mobile (usato da overlay, X e tap su un link). */
function closeMobile() {
  document.documentElement.dataset.mobileOpen = 'false'
}

function NavItem({ item }: { item: NavItemData }) {
  const base =
    'sidebar-nav-item group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200'
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      onClick={closeMobile}
      className={({ isActive }) =>
        `${base} ${
          isActive
            ? 'bg-sidebar-accent text-sidebar-primary'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            name={item.icon}
            className={`h-[18px] w-[18px] shrink-0 ${
              isActive
                ? 'text-sidebar-primary'
                : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80'
            }`}
          />
          <span className="sidebar-label flex-1">{item.label}</span>
          {item.badge && (
            <>
              <span className="sidebar-badge flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary/15 px-1.5 text-[10px] font-semibold text-sidebar-primary">
                {item.badge}
              </span>
              <span className="sidebar-badge-dot absolute right-2 top-1 h-2 w-2 rounded-full bg-sidebar-primary" />
            </>
          )}
        </>
      )}
    </NavLink>
  )
}

function NavGroup({ group }: { group: NavGroupData }) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="sidebar-group-toggle flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30 transition-colors hover:text-sidebar-foreground/50"
      >
        <span className="sidebar-group-label flex-1 text-start">{group.label}</span>
        <Icon
          name="chevron-right"
          className={`sidebar-group-chevron size-3 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      <div className="nav-group-body" hidden={!open}>
        <div>
          <div className="mt-1 space-y-0.5">
            {group.items.map((i) => (
              <NavItem key={i.to} item={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  return (
    <>
      <div
        className="apex-sidebar-overlay fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={closeMobile}
      />
      <aside className="apex-sidebar-aside h-screen border-e border-sidebar-border bg-sidebar">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <Icon name="zap" className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="sidebar-brand-text flex flex-col">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">FlowGenius</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/40">Dashboard</span>
          </div>
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close sidebar"
            className="ms-auto flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav aria-label="Main navigation" className="scrollbar-fade flex-1 space-y-3 overflow-y-auto px-3 py-4">
          {navGroups.map((g) => (
            <NavGroup key={g.label} group={g} />
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2">
            <NavLink
              to="/profile"
              onClick={closeMobile}
              className="flex flex-1 items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent/50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sidebar-primary/80 to-sidebar-primary text-[11px] font-bold text-sidebar-primary-foreground">
                AS
              </div>
              <div className="sidebar-user-info flex flex-1 flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">Aigars S.</span>
                <span className="text-[11px] text-sidebar-foreground/50">Admin</span>
              </div>
            </NavLink>
            <button
              type="button"
              aria-label="Log out"
              // Logout gestito da Symfony (rotta /logout, fuori dalla SPA):
              // navigazione full-page, non React Router.
              onClick={() => { window.location.href = '/logout' }}
              className="sidebar-logout rounded-md p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground/70"
            >
              <Icon name="log-out" className="h-4 w-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  )
}
