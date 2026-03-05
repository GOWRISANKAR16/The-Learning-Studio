# LMS Frontend Blueprint

This document describes the **React LMS frontend** only: structure, routes, data shapes, and how it talks to the backend. Use it as a reference. Do **not** implement backend logic from this file; use the Backend Handout for that.

---

## 1. Tech Stack

- **React** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **Zustand** (state + localStorage persist)
- **YouTube** (embed only; video URLs stored, no file upload)

---

## 2. Folder Structure (Frontend)

```
frontend/
├── public/
├── src/
│   ├── admin/                    # Admin panel (role === 'admin')
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminNavbar.tsx
│   │   ├── ManageCourses.tsx
│   │   ├── ManageUsers.tsx
│   │   └── ManageAssignments.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthGuard.tsx     # Protects routes; AdminRoute for /admin
│   │   ├── course/
│   │   │   └── CourseCard.tsx
│   │   ├── layout/
│   │   │   ├── AppShell.tsx      # Main navbar, search, user menu
│   │   │   ├── AdminLayout.tsx   # Admin sidebar + content
│   │   │   └── LearningLayout.tsx
│   │   ├── sidebar/
│   │   │   └── LessonSidebar.tsx
│   │   └── video/
│   │       └── VideoPlayer.tsx
│   ├── data/
│   │   └── courses.ts           # Mock course list + types (fallback when API fails)
│   ├── lib/
│   │   ├── config.ts            # API_BASE_URL (env: VITE_API_BASE_URL)
│   │   └── apiClient.ts         # All HTTP calls to backend + fallbacks
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── MessagesPage.tsx
│   │   ├── AssignmentsPage.tsx
│   │   ├── admin/
│   │   │   └── AdminLoginPage.tsx  # Same login; admin by email admin@lms.test
│   │   ├── courses/
│   │   │   └── CourseDetailsPage.tsx
│   │   ├── learn/
│   │   │   └── LearnPage.tsx
│   │   └── profile/
│   │       └── ProfilePage.tsx
│   ├── store/
│   │   ├── authStore.ts         # user, token, login, register, logout
│   │   ├── progressStore.ts     # lesson progress (local + sync to API)
│   │   ├── messagesStore.ts     # threads & messages (local mock)
│   │   └── assignmentsStore.ts  # assignments & submissions (local mock)
│   ├── App.tsx
│   ├── main.tsx
│   ├── router.tsx               # All routes
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Routes

| Path | Access | Page / Component |
|------|--------|-------------------|
| `/` | Public | HomePage (course listing, hero, editor's picks, recommended, AI courses) |
| `/login` | Public | LoginPage |
| `/register` | Public | RegisterPage |
| `/admin/login` | Public | AdminLoginPage (same form; admin if email = admin@lms.test) |
| `/courses/:courseId` | Public | CourseDetailsPage |
| `/learn/:courseId` | Auth | LearnPage (redirects to first or last-watched lesson) |
| `/learn/:courseId/lesson/:lessonId` | Auth | LearnPage (video + sidebar) |
| `/profile` | Auth | ProfilePage |
| `/messages` | Auth | MessagesPage |
| `/assignments` | Auth | AssignmentsPage |
| `/admin` | Admin | AdminDashboard |
| `/admin/courses` | Admin | ManageCourses |
| `/admin/users` | Admin | ManageUsers |
| `/admin/assignments` | Admin | ManageAssignments |

- **AuthGuard**: redirects unauthenticated users to `/login` for protected routes.
- **AdminRoute**: allows only `user.role === 'admin'`; else redirect away from `/admin/*`.

---

## 4. API Base URL

- **Config:** `src/lib/config.ts`
- **Value:** `import.meta.env.VITE_API_BASE_URL ?? 'https://learning-managment-platform-backend.onrender.com'`
- All requests go to `API_BASE_URL + path` (e.g. `/auth/login`, `/courses`). No `/api` prefix unless the backend uses it.

---

## 5. Data Shapes (TypeScript – Backend Must Match)

### User (auth)

```ts
interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'admin'   // admin UI also supports 'instructor'
}
```

### Course

```ts
type CourseCategory =
  | 'Programming' | 'Web Development' | 'Data Science & AI' | 'DevOps & Cloud'
  | 'Mobile Development' | 'Cybersecurity' | 'Computer Science'
  | 'Software Engineering' | 'Other'

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

interface Lesson {
  id: string
  title: string
  order: number
  youtubeUrl: string
  durationMinutes?: number
}

interface Section {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  slug: string
  category: CourseCategory
  difficulty: Difficulty
  description: string
  instructor: string
  thumbnailUrl: string
  totalMinutes?: number
  sections: Section[]
}
```

### Progress (per lesson)

```ts
interface LessonProgress {
  lastPositionSeconds: number
  isCompleted: boolean
  updatedAt: string   // ISO
}
```

### Messages (for future API)

```ts
interface ChatMessage {
  id: string
  from: 'student' | 'instructor'
  text: string
  createdAt: string
  isRead: boolean
}

interface Thread {
  id: string
  courseId: string
  courseTitle: string
  messages: ChatMessage[]
}
```

### Assignments (for future API)

```ts
type AssignmentStatus = 'pending' | 'submitted' | 'graded'

interface Assignment {
  id: string
  courseId: string
  title: string
  deadline: string   // ISO
  description: string
}

interface Submission {
  assignmentId: string
  userId: string
  submittedAt: string
  content: string
  status: AssignmentStatus
  grade?: string
  feedback?: string
}
```

---

## 6. Frontend Behavior Summary

- **Auth:** Login/register call backend; on network/CORS failure only, frontend falls back to mock auth (any email → demo user; admin@lms.test → admin). On 4xx, error is shown and user is not logged in.
- **Courses:** Fetched via `apiClient.getCourses()`, `getCourseDetails()`, `getCourseLessons()`, `getLessonById()`. On API failure, fallback to local `courses.ts` data.
- **Progress:** Stored in Zustand + localStorage; also sent to backend via `POST /users/:userId/progress`. If backend fails, progress stays local.
- **Messages / Assignments:** Currently 100% local (Zustand + localStorage). UI is ready for backend endpoints when you add them.

---

## 7. What the Frontend Does NOT Do

- Does not implement backend logic, database, or auth verification.
- Does not store video files; only uses YouTube URLs.
- Does not assume a specific `/api` prefix; paths are relative to `API_BASE_URL` (e.g. `/courses`, not `/api/courses` unless your backend uses that).

Use **BACKEND_HANDOUT.md** for the backend team (folder structure, endpoints, request/response formats, and instructions).
