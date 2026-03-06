# LMS Backend Handout – Folder Structure, Endpoints & Instructions

Give this document to the backend team (or use it in the backend repo). It defines the **folder structure**, **endpoints**, **request/response formats**, and **instructions** so the backend supports the existing React LMS frontend.

---

## 1. Backend Folder Structure

Use a structure like this (Node.js + Express + TypeScript). Adapt if you use NestJS or another framework.

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts             # DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN, PORT
│   │   ├── db.ts              # Database client singleton (e.g. connection pool, ORM)
│   │   └── security.ts        # CORS options, cookie options, JWT config
│   ├── middleware/
│   │   ├── authMiddleware.ts  # Verify JWT, set req.user = { id, email, role }
│   │   ├── roleMiddleware.ts  # requireRole('admin') for /admin/*
│   │   ├── errorHandler.ts    # Central error → JSON { error: { message } }
│   │   └── requestLogger.ts
│   ├── types/
│   │   └── express.d.ts       # Extend Request with user
│   ├── utils/
│   │   ├── jwt.ts             # sign/verify access token
│   │   ├── password.ts        # hash/compare (bcrypt or argon2)
│   │   └── date.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validator.ts
│   │   ├── users/             # user model helpers
│   │   ├── courses/
│   │   │   ├── course.controller.ts
│   │   │   ├── course.service.ts
│   │   │   ├── course.repository.ts
│   │   │   └── course.routes.ts
│   │   ├── progress/
│   │   │   ├── progress.controller.ts
│   │   │   ├── progress.service.ts
│   │   │   └── progress.routes.ts
│   │   ├── messages/          # optional for phase 2
│   │   ├── assignments/       # optional for phase 2
│   │   ├── admin/             # admin-only routes or wiring
│   │   └── health/
│   │       └── health.routes.ts
│   ├── app.ts                 # Express app, middleware, mount routes
│   └── server.ts              # createServer, listen(PORT)
├── .env                       # Do not commit; DATABASE_URL, CORS_ORIGIN, JWT_*, etc.
├── package.json
├── tsconfig.json
└── README.md
```

---

## 2. Base URL and CORS

- **Base URL:** Frontend calls `https://your-backend.onrender.com` (no `/api` in the base; add in app if you want e.g. `/api/auth`).
- **CORS:** Allow the frontend origin(s):
  - Development: `http://localhost:5173`, `http://localhost:4173`
  - Production: `https://your-frontend-domain.com`
- Use **credentials: true** so cookies and `Authorization: Bearer` work.
- Set **CORS_ORIGIN** in env (single origin or comma-separated list) and use it in the CORS middleware.

---

## 3. Authentication Endpoints

All auth responses must return JSON. Use the exact shapes below so the frontend does not break.

### POST `/auth/register`

- **Request body:**
  ```json
  { "name": "string", "email": "string", "password": "string" }
  ```
- **Success (200):**
  ```json
  {
    "token": "<JWT access token>",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "student"
    }
  }
  ```
- **Error (400):** e.g. email already exists, validation failed.
  ```json
  { "error": { "message": "Email already registered" } }
  ```
  or
  ```json
  { "message": "Email already registered" }
  ```

### POST `/auth/login`

- **Request body:**
  ```json
  { "email": "string", "password": "string" }
  ```
- **Success (200):**
  ```json
  {
    "token": "<JWT access token>",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "student" | "admin"
    }
  }
  ```
- **Error (400 or 401):** Invalid credentials or blocked user.
  ```json
  { "error": { "message": "Invalid email or password" } }
  ```

### POST `/auth/logout`

- **Request:** Optional Cookie (refresh token) and/or Authorization header. Frontend clears local state regardless.
- **Success (200):** Even when no/invalid token, return:
  ```json
  { "success": true }
  ```
- Do not return 401 for logout; the frontend ignores failures but a 200 avoids console errors.

### GET `/auth/me` (optional)

- **Headers:** `Authorization: Bearer <token>`
- **Success (200):** Same `user` object as login/register.
- **Error (401):** Invalid or missing token.

---

## 4. Courses & Lessons Endpoints

Frontend expects these paths and shapes. Return **200** with JSON; on server error return **500** with `{ "error": { "message": "..." } }` and log the real error.

### GET `/courses`

- **Auth:** Optional (public listing).
- **Success (200):** Array of courses, each matching the **Course** shape below (include `sections` with `lessons`).

**Course shape (each item):**
```json
{
  "id": "string",
  "title": "string",
  "slug": "string",
  "category": "Programming | Web Development | Data Science & AI | DevOps & Cloud | Mobile Development | Cybersecurity | Computer Science | Software Engineering | Other",
  "difficulty": "Beginner | Intermediate | Advanced",
  "description": "string",
  "instructor": "string",
  "thumbnailUrl": "string",
  "totalMinutes": 0,
  "sections": [
    {
      "id": "string",
      "title": "string",
      "order": 0,
      "lessons": [
        {
          "id": "string",
          "title": "string",
          "order": 0,
          "youtubeUrl": "string",
          "durationMinutes": 0
        }
      ]
    }
  ]
}
```

### GET `/courses/:courseId`

- **Success (200):** Single course object (same shape as above).
- **Error (404):** `{ "error": { "message": "Course not found" } }`.

### GET `/courses/:courseId/lessons`

- **Success (200):**
  ```json
  {
    "course": { "<Course object>" },
    "lessons": [
      {
        "id": "string",
        "title": "string",
        "order": 0,
        "youtubeUrl": "string",
        "durationMinutes": 0
      }
    ]
  }
  ```
  `lessons` must be **flattened** and **sorted by order** (all sections combined).

### GET `/courses/:courseId/lessons/:lessonId`

- **Success (200):**
  ```json
  {
    "course": { "<Course object>" },
    "lesson": { "<Lesson object>" },
    "lessons": [ "<same flattened list as above>" ]
  }
  ```

### GET `/courses/:courseId/progress-summary`

- **Auth:** Required. Use `req.user.id` (from JWT).
- **Success (200):**
  ```json
  {
    "totalLessons": 0,
    "completedLessons": 0,
    "percentComplete": 0
  }
  ```
- If no progress, return zeros.

---

## 5. Progress Endpoint

### POST `/users/:userId/progress`

- **Auth:** Required. Verify `req.user.id === userId` (or allow admin).
- **Request body:**
  ```json
  {
    "courseId": "string",
    "lessonId": "string",
    "lastPositionSeconds": 0,
    "isCompleted": false
  }
  ```
- **Success (200):**
  ```json
  { "success": true }
  ```
- **Behavior:** Upsert one row per (userId, lessonId). Clamp `lastPositionSeconds` >= 0. Optionally cap at video duration if stored.

---

## 6. Health

### GET `/health`

- **Success (200):**
  ```json
  { "status": "ok" }
  ```
- Use for Render (or other) health checks. Ensure DB connection is ready before returning 200 if you want a true readiness check.

---

## 7. Error Response Format

Use a consistent JSON error shape so the frontend can show messages:

- **4xx/5xx:** 
  ```json
  { "error": { "message": "Human-readable message" } }
  ```
  or
  ```json
  { "message": "Human-readable message" }
  ```
- Frontend reads `error.message` or `message` and displays it in the UI. Do not expose stack traces or internal details in the response.

---

## 8. Database / Connection

- **Connection pool:** Configure a small pool (e.g. max 5–10) and a **connection timeout** (e.g. 5–10 seconds) so the app does not hang. On pool timeout or DB errors, return **503** with `{ "error": { "message": "Database temporarily unavailable" } }` and log the real error.
- **GET /courses:** Must not throw unhandled exceptions. Use try/catch; on failure return 500/503 with the JSON error shape above.
- **SSL:** If using Aiven MySQL (or similar), enable SSL in the connection URL or client config (`ssl-mode=REQUIRED` or equivalent).

---

## 9. Optional (Phase 2) – Messages

- **GET** `/users/:userId/threads` → list threads (id, courseId, courseTitle, messages).
- **POST** `/users/:userId/threads` → body `{ courseId }` (and optional initial text); create or return existing thread.
- **GET** `/threads/:threadId/messages` → list messages.
- **POST** `/threads/:threadId/messages` → body `{ text }`; create message (from = student or instructor from req.user.role).
- **PATCH** `/threads/:threadId/read` → mark instructor messages as read.

---

## 10. Optional (Phase 2) – Assignments

- **GET** `/users/:userId/assignments` → list assignments (id, courseId, title, deadline, description).
- **GET** `/assignments/:assignmentId` → assignment details.
- **GET** `/assignments/:assignmentId/submissions/:userId` → user’s submission (if any).
- **POST** `/assignments/:assignmentId/submissions` → body `{ userId, content }` or use req.user.id; create/update submission, status `submitted`.

---

## 11. Optional (Phase 2) – Admin

- **GET** `/admin/courses` – list all courses.
- **POST** `/admin/courses` – create course (body: course fields + optional sections/lessons).
- **PUT** `/admin/courses/:courseId` – update course.
- **DELETE** `/admin/courses/:courseId` – delete course.
- **GET** `/admin/users` – list users (id, name, email, role, status).
- **PUT** `/admin/users/:userId` – body `{ role?, status? }`.
- **DELETE** `/admin/users/:userId` – delete or deactivate user.
- **GET/POST/PUT/DELETE** `/admin/assignments` – CRUD assignments.

All admin routes must be protected with **roleMiddleware('admin')** (or equivalent).

---

## 13. AI Chatbot (Learning Studio in-app assistant)

The frontend has an **AI Assistant** chat panel. To support it from your backend (recommended: avoids CORS and keeps HF token on server), implement:

**POST `/chat`**

- **Auth:** Required (same JWT as other routes).
- **Request body:**
  ```json
  { "message": "user message text", "history": [] }
  ```
- **Success (200):**
  ```json
  { "reply": "AI reply text" }
  ```
  or `{ "content": "AI reply text" }`.
- **Errors:** 401 (unauthorized), 400 (validation), 502/503 (AI service down), 500 (generic), with JSON `error.message` or `message`.

The backend should call the Hugging Face Space (or another AI API) **server-side** and return the reply. See **BACKEND_CHATBOT_PROMPT.md** for the full implementation prompt (HF proxy steps, payloads, checklist).

---

## 14. Checklist for Backend Team

- [ ] CORS allows frontend origin(s) and `credentials: true`.
- [ ] POST `/auth/register` and POST `/auth/login` accept the body shapes above and return `{ token, user }` on success.
- [ ] POST `/auth/logout` returns 200 with `{ success: true }` even when no/invalid token.
- [ ] GET `/courses` returns 200 with array of courses (with sections and lessons). No unhandled exceptions; on DB failure return 500/503 with JSON error.
- [ ] GET `/courses/:courseId`, GET `/courses/:courseId/lessons`, GET `/courses/:courseId/lessons/:lessonId` return the shapes above.
- [ ] GET `/courses/:courseId/progress-summary` uses authenticated user id and returns totalLessons, completedLessons, percentComplete.
- [ ] POST `/users/:userId/progress` upserts progress and returns `{ success: true }`.
- [ ] GET `/health` returns `{ status: "ok" }`.
- [ ] All errors return JSON with `error.message` or `message`.
- [ ] Database connection uses SSL if required and has a connection timeout and small pool to avoid pool timeout errors.
- [ ] **(Optional)** POST `/chat` for AI Assistant: auth required, body `{ message, history }`, response `{ reply }` or `{ content }`. See **BACKEND_CHATBOT_PROMPT.md**.

Use **FRONTEND_BLUEPRINT.md** for frontend-only reference (routes, data shapes, no backend logic).
