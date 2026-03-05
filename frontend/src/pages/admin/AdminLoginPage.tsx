import type { FormEvent } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { useAuthStore } from '../../store/authStore'

export default function AdminLoginPage() {
  const auth = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('admin@lms.test')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from =
    (location.state as { from?: Location })?.from?.pathname ?? '/admin'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await auth.login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError((err as Error).message ?? 'Failed to sign in as admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Admin sign in</h1>
        <p className="mt-1 text-sm text-slate-500">
          Access the admin dashboard to manage courses, users, and
          assignments.
        </p>

        {error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1 text-sm">
            <label className="block text-slate-700" htmlFor="admin-email">
              Admin email
            </label>
            <input
              id="admin-email"
              type="email"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1 text-sm">
            <label className="block text-slate-700" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in as admin'}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-500">
          For this demo, use <span className="font-mono">admin@lms.test</span>{' '}
          to sign in with admin privileges.
        </p>
      </div>
    </AppShell>
  )
}

