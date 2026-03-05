import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { API_BASE_URL } from '../lib/config'

export type Role = 'student' | 'admin' | 'instructor'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

async function postJson<T>(
  path: string,
  body: unknown,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  })

  let data: unknown
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message =
      (data as { error?: { message?: string }; message?: string } | null)
        ?.error?.message ??
      (data as { message?: string } | null)?.message ??
      'Authentication failed'
    throw new Error(message)
  }

  return data as T
}

type AuthResponse = {
  token: string
  user: User
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      async login(email: string, password: string) {
        const trimmedEmail = email.trim()
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email: trimmedEmail, password }),
          })

          let data: unknown = null
          try {
            data = await response.json()
          } catch {
            // non-JSON or empty body
          }

          // Use HTTP status to decide success vs error. Do NOT set token/user on 4xx.
          if (!response.ok) {
            const rawMessage =
              (data as { error?: { message?: string }; message?: string } | null)
                ?.error?.message ??
              (data as { message?: string } | null)?.message
            throw new Error(
              rawMessage ?? 'Invalid email or password',
            )
          }

          // Only on 200: save token and user
          const { token, user } = data as AuthResponse
          set({ user, token, isAuthenticated: true })
        } catch (err) {
          const error = err as Error
          // Only use demo auth when backend is unreachable (network/CORS), and only in dev.
          const isNetworkError =
            error.name === 'TypeError' || /Failed to fetch/i.test(error.message)
          const allowDemoFallback = import.meta.env.DEV && isNetworkError
          if (isNetworkError && allowDemoFallback) {
            console.warn(
              'Backend unreachable, using demo auth (dev only):',
              error.message,
            )
            const normalized = trimmedEmail.toLowerCase()
            const isAdminEmail = normalized === 'admin@lms.test'
            const fallbackUser: User = {
              id: isAdminEmail ? 'admin-1' : 'student-1',
              name: isAdminEmail ? 'Admin User' : 'Demo Learner',
              email: normalized,
              role: isAdminEmail ? 'admin' : 'student',
            }
            set({ user: fallbackUser, token: null, isAuthenticated: true })
            return
          }
          throw error
        }
      },
      async register(name: string, email: string, password: string) {
        const trimmedEmail = email.trim()
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, email: trimmedEmail, password }),
          })

          let data: unknown = null
          try {
            data = await response.json()
          } catch {
            // non-JSON or empty body
          }

          // Use HTTP status to decide success vs error. Do NOT set token/user on 4xx.
          if (!response.ok) {
            const rawMessage =
              (data as { error?: { message?: string }; message?: string } | null)
                ?.error?.message ??
              (data as { message?: string } | null)?.message
            throw new Error(
              rawMessage ?? 'Registration failed. Please try again.',
            )
          }

          // Only on 200: save token and user
          const { token, user } = data as AuthResponse
          set({ user, token, isAuthenticated: true })
        } catch (err) {
          const error = err as Error
          const isNetworkError =
            error.name === 'TypeError' || /Failed to fetch/i.test(error.message)
          const allowDemoFallback = import.meta.env.DEV && isNetworkError
          if (isNetworkError && allowDemoFallback) {
            console.warn(
              'Backend unreachable, using demo registration (dev only):',
              error.message,
            )
            const fallbackUser: User = {
              id: 'student-1',
              name: name || 'New Learner',
              email: trimmedEmail.toLowerCase(),
              role: 'student',
            }
            set({ user: fallbackUser, token: null, isAuthenticated: true })
            return
          }
          throw error
        }
      },
      logout() {
        const current = get()
        if (!current.user) return
        set({ user: null, token: null, isAuthenticated: false })
        void (async () => {
          try {
            await postJson<{ success: boolean }>('/auth/logout', {})
          } catch {
            // Ignore logout failures; local state is already cleared.
          }
        })()
      },
    }),
    {
      name: 'lms-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin'
}
