import { Outlet } from 'react-router-dom'
import Header from '../component/Header/Header'

export default function MainLayout() {
  return (
    <div>
      <Header />

      <main className="app-content">
        {/* The matched page is rendered here */}
        <Outlet />
      </main>
    </div>
  )
}
