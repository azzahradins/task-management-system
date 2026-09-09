import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function PublicLayout() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Navigate to="/tasks" replace /> : <Outlet />
}