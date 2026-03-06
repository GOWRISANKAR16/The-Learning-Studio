/**
 * Backend API base URL. No trailing slash (avoids // in paths like /auth/login).
 * Dev: VITE_API_BASE_URL=http://localhost:4000
 * Prod: VITE_API_BASE_URL=https://learning-managment-platform-backend.onrender.com
 * Do not add /api – paths are under root: /auth, /courses, /users/.../progress, /chat.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  'https://learning-managment-platform-backend.onrender.com'
).replace(/\/$/, '')

/** When true, sign-in and all data use local mock only (no backend). Easy navigation. */
export const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === '1'
