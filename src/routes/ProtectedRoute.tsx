import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import type { StaffRole } from '../types/auth'

type ProtectedRouteProps = {
  allowedRoles?: StaffRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading, hasFirebaseConfig } = useAuth()
  const location = useLocation()

  if (!hasFirebaseConfig) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return <div className="screen">Loading session...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!profile?.active) {
    return <Navigate to="/unauthorized" replace state={{ reason: 'Your account is inactive.' }} />
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace state={{ reason: 'Your role cannot access this page.' }} />
  }

  return <Outlet />
}
