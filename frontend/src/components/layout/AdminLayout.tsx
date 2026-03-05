import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { AdminNavbar } from '../../admin/AdminNavbar'

type AdminLayoutProps = {
  children: ReactNode
}

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/settings', label: 'Settings' },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const auth = useAuthStore()

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-60 flex-shrink-0 border-r border-slate-200 bg-white/95 pt-4 md:flex md:flex-col">
        <Link to="/" className="flex items-center gap-2 px-4 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-sky-700 text-sm font-bold text-white">
            L
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">
              Learning
            </div>
            <div className="text-xs text-slate-500">Admin</div>
          </div>
        </Link>
        <nav className="mt-2 flex flex-1 flex-col gap-1 px-2 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-50',
                  isActive ? 'bg-sky-50 text-sky-700' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur">
          <AdminNavbar />
          <div className="hidden items-center gap-3 text-xs md:flex">
            <span className="text-slate-500">
              {auth.user?.email ?? 'Not signed in'}
            </span>
            <div className="h-8 w-8 rounded-full bg-slate-300" />
          </div>
        </header>
        <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
          {children}
        </main>
      </div>
    </div>
  )
}

