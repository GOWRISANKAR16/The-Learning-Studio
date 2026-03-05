import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function AdminNavbar() {
  const auth = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    auth.logout()
    navigate('/')
  }

  return (
    <div className="flex items-center justify-between gap-4 text-xs md:text-sm">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-800">
          Admin panel
        </span>
        <nav className="hidden items-center gap-3 md:flex">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              [
                'rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-50',
                isActive ? 'bg-sky-50 text-sky-700' : '',
              ]
                .filter(Boolean)
                .join(' ')
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/courses"
            className={({ isActive }) =>
              [
                'rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-50',
                isActive ? 'bg-sky-50 text-sky-700' : '',
              ]
                .filter(Boolean)
                .join(' ')
            }
          >
            Courses
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              [
                'rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-50',
                isActive ? 'bg-sky-50 text-sky-700' : '',
              ]
                .filter(Boolean)
                .join(' ')
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/assignments"
            className={({ isActive }) =>
              [
                'rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-50',
                isActive ? 'bg-sky-50 text-sky-700' : '',
              ]
                .filter(Boolean)
                .join(' ')
            }
          >
            Assignments
          </NavLink>
        </nav>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
      >
        Logout
      </button>
    </div>
  )
}

