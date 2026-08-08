import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import AssessmentPage from './pages/AssessmentPage'
import NotFoundPage from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    // MainLayout is the shared shell; child routes render inside its <Outlet />
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/assessment', element: <AssessmentPage /> },
      // Catch-all dentro il layout: le voci di Sidebar non ancora implementate
      // mostrano il 404 mantenendo shell e navigazione.
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])