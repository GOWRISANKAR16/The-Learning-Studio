import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAdmin, useAuthStore } from '../../store/authStore'

type AuthGuardProps = {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const auth = useAuthStore()
  const location = useLocation()

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}

type AdminRouteProps = {
  children: ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const auth = useAuthStore()
  const location = useLocation()

  if (!auth.isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  if (!isAdmin(auth.user)) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}

