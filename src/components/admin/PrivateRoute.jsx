import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAdmin'
import { Loader2 } from 'lucide-react'

export default function PrivateRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/admin/login" replace />
}
