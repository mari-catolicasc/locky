import { Navigate, Outlet } from 'react-router-dom'
import { isAdmin } from '../services/authService'

function AdminRoute() {
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default AdminRoute