export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'https://learning-managment-platform-backend.onrender.com'

/** When true, sign-in and all data use local mock only (no backend). Easy navigation. */
export const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === '1'
