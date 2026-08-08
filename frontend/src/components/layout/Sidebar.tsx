
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
      { icon: 'bar-chart-3', label: 'Analytics', to: '/analytics' },
      { icon: 'store', label: 'eCommerce', to: '/ecommerce' },
      { icon: 'handshake', label: 'CRM', to: '/crm' },
      { icon: 'rocket', label: 'SaaS', to: '/saas' },
      { icon: 'chart-no-axes-combined', label: 'Charts', to: '/charts' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { icon: 'shopping-cart', label: 'Orders', to: '/orders', badge: '12' },
      { icon: 'package', label: 'Products', to: '/products' },
      { icon: 'users', label: 'Customers', to: '/customers' },
      { icon: 'file-text', label: 'Invoices', to: '/invoices' },
    ],
  },
  {
    label: 'Apps',
    items: [
      { icon: 'mail', label: 'Mail', to: '/mail' },
      { icon: 'message-circle', label: 'Chat', to: '/chat' },
      { icon: 'folder-open', label: 'Files', to: '/files' },
      { icon: 'kanban', label: 'Kanban', to: '/kanban' },
      { icon: 'calendar', label: 'Calendar', to: '/calendar' },
      { icon: 'list-checks', label: 'Wizard', to: '/wizard' },
      { icon: 'file-input', label: 'Forms', to: '/forms' },
    ],
  },
  {
    label: 'Finance',
    items: [{ icon: 'credit-card', label: 'Billing', to: '/billing' }],
  },
]

const systemNav: NavGroupData = {
  label: 'System',
  items: [
    { icon: 'user-cog', label: 'Users', to: '/users' },
    { icon: 'bell', label: 'Notifications', to: '/notifications', badge: '3' },
    { icon: 'settings', label: 'Settings', to: '/settings' },
    { icon: 'help-circle', label: 'Help & Support', to: '/support' },
  ],
}

const docsNav: NavItemData = { icon: 'book-open', label: 'Documentation', to: '/docs' }

const COLLAPSE_KEY = 'apex-sidebar-collapsed'

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
  const [collapsed, setCollapsed] = useState(
    () => document.documentElement.dataset.sidebarCollapsed === 'true',
  )

  const toggleCollapse = () => {
    const next = !collapsed
    document.documentElement.dataset.sidebarCollapsed = String(next)
    localStorage.setItem(COLLAPSE_KEY, String(next))
    setCollapsed(next)
  }

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
          <div className="my-2 border-t border-sidebar-border" />
          <NavGroup group={systemNav} />
          <div className="my-2 border-t border-sidebar-border" />
          <NavItem item={docsNav} />
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
              className="sidebar-logout rounded-md p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground/70"
            >
              <Icon name="log-out" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          type="button"
          onClick={toggleCollapse}
          aria-label="Toggle sidebar"
          className="apex-collapse-btn absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon
            name="chevron-left"
            className={`apex-collapse-icon h-3.5 w-3.5 mx-auto transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </aside>
    </>
  )
}
