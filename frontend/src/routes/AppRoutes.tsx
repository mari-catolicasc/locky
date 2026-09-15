import { Navigate, Route, Routes } from 'react-router-dom'
import AdminRoute from '../components/AdminRoute'
import AppLayout from '../layouts/AppLayout'
import AdminLockers from '../pages/AdminLockers'
import Dashboard from '../pages/Dashboard'
import History from '../pages/History'
import Lockers from '../pages/Lockers'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Reservations from '../pages/Reservations'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lockers" element={<Lockers />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/history" element={<History />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin/lockers" element={<AdminLockers />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes