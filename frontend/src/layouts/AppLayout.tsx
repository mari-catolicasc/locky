import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AppLayout.css'

function AppLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <main className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">LOCKY</div>

        <nav className="sidebar-menu">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/lockers"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            Armários
          </NavLink>

          <NavLink
            to="/reservations"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            Reservas
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            Histórico
          </NavLink>

          {user?.role === 'admin' && (
            <>
              <div className="sidebar-section-label">
                Administração
              </div>

              <NavLink
                to="/admin/lockers"
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
              >
                Gerenciar armários
              </NavLink>
            </>
          )}
        </nav>

        <button
          className="sidebar-logout"
          type="button"
          onClick={handleLogout}
        >
          Sair
        </button>
      </aside>

      <section className="app-content">
        <Outlet />
      </section>
    </main>
  )
}

export default AppLayout