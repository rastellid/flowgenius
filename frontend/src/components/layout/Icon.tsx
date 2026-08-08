// Mappa statica dei nomi icona (kebab-case, gli stessi usati nel template
// Apex vanilla) verso i componenti lucide-react. Import statici → nessun
// pop-in asincrono per la chrome sempre visibile (sidebar/header), e
// tree-shaking pulito. Aggiungi qui le icone nuove man mano che servono.
import {
  Zap, X, ChevronRight, ChevronLeft, LogOut,
  LayoutDashboard, BarChart3, Store, Handshake, Rocket, ChartNoAxesCombined,
  ShoppingCart, Package, Users, FileText,
  Mail, MessageCircle, FolderOpen, Kanban, Calendar, ListChecks, FileInput,
  CreditCard, UserCog, Bell, Settings, HelpCircle, BookOpen,
  Menu, Search, Plus, Moon, Sun, Palette, CheckCheck, ClipboardCheck,
  type LucideIcon,
} from 'lucide-react'

const ICONS = {
  'zap': Zap,
  'x': X,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'log-out': LogOut,
  'layout-dashboard': LayoutDashboard,
  'bar-chart-3': BarChart3,
  'store': Store,
  'handshake': Handshake,
  'rocket': Rocket,
  'chart-no-axes-combined': ChartNoAxesCombined,
  'shopping-cart': ShoppingCart,
  'package': Package,
  'users': Users,
  'file-text': FileText,
  'mail': Mail,
  'message-circle': MessageCircle,
  'folder-open': FolderOpen,
  'kanban': Kanban,
  'calendar': Calendar,
  'list-checks': ListChecks,
  'file-input': FileInput,
  'credit-card': CreditCard,
  'user-cog': UserCog,
  'bell': Bell,
  'settings': Settings,
  'help-circle': HelpCircle,
  'book-open': BookOpen,
  'menu': Menu,
  'search': Search,
  'plus': Plus,
  'moon': Moon,
  'sun': Sun,
  'palette': Palette,
  'check-check': CheckCheck,
  'clipboard-check': ClipboardCheck,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

type IconProps = {
  name: IconName
  className?: string
  size?: number | string
  'aria-hidden'?: boolean
}

export function Icon({ name, ...props }: IconProps) {
  const Cmp = ICONS[name]
  return <Cmp aria-hidden {...props} />
}