import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import Dashboard from '../pages/Dashboard'
import History from '../pages/History'
import Lockers from '../pages/Lockers'
import Login from '../pages/Login'
import Reservations from '../pages/Reservations'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lockers" element={<Lockers />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/history" element={<History />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes