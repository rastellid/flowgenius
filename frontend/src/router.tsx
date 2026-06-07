import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import AssessmentPage from './pages/AssessmentPage'

export const router = createBrowserRouter([
  {
    // MainLayout is the shared shell; child routes render inside its <Outlet />
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/assessment', element: <AssessmentPage /> },
    ],
  },
])