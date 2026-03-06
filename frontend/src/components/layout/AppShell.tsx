import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ChatPanel } from '../chat/ChatPanel'
import { useAuthStore } from '../../store/authStore'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const auth = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  // Always force light theme by clearing any previous dark class
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  const handleAuthClick = () => {
    if (auth.isAuthenticated) {
      auth.logout()
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 bg-white/95 shadow-sm backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:py-4">
          <Link to="/" className="flex items-center gap-2 whitespace-nowrap">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-sky-600 text-sm font-bold text-white">
              T
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-slate-900">
                The Learning
              </div>
              <div className="text-xs text-slate-500">Studio</div>
            </div>
          </Link>

          <div className="hidden items-center gap-2 text-xs md:flex md:text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                [
                  'rounded-full px-3 py-1.5 font-medium',
                  isActive
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-700 hover:bg-sky-50',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                [
                  'rounded-full px-3 py-1.5',
                  isActive
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-700 hover:bg-sky-50',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              Progress
            </NavLink>
            <NavLink
              to="/assignments"
              className={({ isActive }) =>
                [
                  'rounded-full px-3 py-1.5',
                  isActive
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-700 hover:bg-sky-50',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              Assignments
            </NavLink>
          </div>

          <div className="flex-1 max-w-xs md:max-w-sm lg:max-w-lg">
            <input
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Search for skills, subjects or software"
            />
          </div>

          <div className="ml-auto flex items-center gap-3 text-xs md:text-sm">
            <button
              type="button"
              onClick={() => setChatOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              title="AI Assistant"
              aria-label="Open AI Assistant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 hover:bg-slate-200"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-[10px] font-semibold text-slate-700">
                  {auth.user ? auth.user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="hidden text-xs font-medium text-slate-700 md:inline">
                  {auth.user ? auth.user.name : 'Guest'}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-slate-200 bg-white text-xs shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 hover:bg-slate-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile & progress
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      handleAuthClick()
                    }}
                    className="block w-full px-3 py-2 text-left text-red-600 hover:bg-slate-50"
                  >
                    {auth.isAuthenticated ? 'Sign out' : 'Sign in'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* AI Chatbot – full page, Learning Studio theme */}
      {chatOpen && (
        <>
          <button
            type="button"
            onClick={() => setChatOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/30"
            aria-label="Close AI Assistant"
          />
          <div className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-white shadow-2xl">
            <ChatPanel
              userName={auth.user?.name ?? 'Guest'}
              onClose={() => setChatOpen(false)}
            />
          </div>
        </>
      )}

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">{children}</div>
      </main>
    </div>
  )
}

