<<<<<<< HEAD
# Learning Management System (LMS)

A production-ready LMS SaaS frontend (React + Vite + Tailwind) that connects to the LMS backend API.

## Quick start

From the **project root**:

```bash
npm install
npm run dev    # Start dev server (frontend)
npm run build  # Production build
npm run preview # Preview production build
npm run lint   # Run ESLint
```

Or from the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

## Environment

Copy `frontend/.env.example` to `frontend/.env`.

- **Backend mode:** Set `VITE_API_BASE_URL` to your backend URL.
- **Local-only (no backend/Prisma):** Set `VITE_USE_MOCK=true` for easy sign-in and navigation using local mock data.

## Features

- **Student**: Browse courses, watch lessons (YouTube), track progress, profile, messages, assignments
- **Admin**: Dashboard, manage courses, users, assignments (sign in with `admin@lms.test`)
- **Auth**: Login/register against backend; token refresh; graceful fallback if backend is unavailable

## Build & deploy

- `npm run build` produces `frontend/dist/`. Serve with any static host (Vercel, Netlify, etc.).
- Ensure the backend allows your frontend origin in CORS.
=======
# The-Learning-Studio-
A modern, LinkedIn Learning–style LMS for browsing courses, watching lessons, tracking progress, and managing student assignments.
>>>>>>> f77cdce8487f647615a5293bb0339c5098388423
