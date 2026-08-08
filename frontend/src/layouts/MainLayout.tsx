import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

// Shell Apex: la sidebar è fixed (fuori dal flusso); .apex-content applica il
// margine sinistro pari a --sidebar-width su desktop (vedi src/index.css). Le
// rotte figlie vengono renderizzate dentro <main> via <Outlet />.
export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="apex-content flex min-h-screen flex-1 flex-col">
        <Header />
        <main id="main-content" className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
