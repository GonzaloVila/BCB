import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import Layout from './components/layout/Layout'
import PrivateRoute from './components/admin/PrivateRoute'

const HomePage = lazy(() => import('./pages/HomePage'))
const CatalogPage = lazy(() => import('./pages/CatalogPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontFamily: 'var(--font-sans)', fontSize: '14px' },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes with shared layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/producto/:id" element={<ProductDetailPage />} />
          </Route>

          {/* Admin auth */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected admin routes */}
          <Route path="/admin" element={<PrivateRoute />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            {/* Redirect /admin → /admin/dashboard */}
            <Route index element={<AdminDashboardPage />} />
          </Route>

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <p className="text-6xl font-extrabold mb-4" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>404</p>
                <h1 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'var(--font-display)' }}>Página no encontrada</h1>
                <a href="/" className="text-sm mt-4 underline" style={{ color: 'var(--color-secondary)' }}>Volver al inicio</a>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
