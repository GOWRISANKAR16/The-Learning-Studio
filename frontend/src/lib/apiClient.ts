import { courses, getCourseById, type Course, type CourseCategory, type Difficulty, type Lesson, type Section } from '../data/courses'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { API_BASE_URL, USE_MOCK } from './config'

type ApiRequestOptions = {
  method?: string
  path: string
  body?: unknown
  auth?: boolean
}

type RefreshResponse = {
  token: string
  // Backend may optionally return user; if not, keep existing user.
  user?: {
    id: string
    name: string
    email: string
    role: 'student' | 'admin' | 'instructor'
  }
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      // Session is no longer valid.
      useAuthStore.setState({ token: null, isAuthenticated: false })
      return false
    }

    let data: unknown = null
    try {
      data = await response.json()
    } catch {
      data = null
    }

    const { token, user } = (data ?? {}) as RefreshResponse
    if (!token) {
      useAuthStore.setState({ token: null, isAuthenticated: false })
      return false
    }

    useAuthStore.setState((state) => ({
      ...state,
      token,
      user: user ?? state.user,
      isAuthenticated: true,
    }))

    return true
  } catch (err) {
    console.error('Failed to refresh access token', err)
    useAuthStore.setState({ token: null, isAuthenticated: false })
    return false
  }
}

async function apiRequest<T>({
  method = 'GET',
  path,
  body,
  auth = false,
}: ApiRequestOptions): Promise<T> {
  const { token } = useAuthStore.getState()

  const makeFetch = async (): Promise<Response> => {
    const headers: Record<string, string> = {}
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }
    if (auth && token) {
      headers.Authorization = `Bearer ${token}`
    }

    return fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  let response: Response
  try {
    response = await makeFetch()
  } catch (err) {
    console.error('Network error when calling API', err)
    throw new Error('Service temporarily unavailable. Please try again.')
  }

  // Handle 401 for authenticated endpoints with a one-time refresh attempt.
  if (auth && response.status === 401) {
    const refreshed = await refreshAccessToken()
    if (!refreshed) {
      throw new Error('Your session has expired. Please sign in again.')
    }

    try {
      response = await makeFetch()
    } catch (err) {
      console.error('Network error after token refresh', err)
      throw new Error('Service temporarily unavailable. Please try again.')
    }
  }

  let data: unknown = null
  try {
    // Some endpoints may return no content (204); ignore parse errors.
    if (response.headers.get('content-type')?.includes('application/json')) {
      data = await response.json()
    }
  } catch {
    data = null
  }

  if (!response.ok) {
    const rawMessage =
      (data as { error?: { message?: string }; message?: string } | null)
        ?.error?.message ??
      (data as { message?: string } | null)?.message

    if (response.status >= 400 && response.status < 500 && rawMessage) {
      throw new Error(rawMessage)
    }
    if (rawMessage && typeof rawMessage === 'string') {
      throw new Error(rawMessage)
    }

    console.error('API error', {
      path,
      status: response.status,
      data,
    })
    throw new Error('Service temporarily unavailable. Please try again.')
  }

  return data as T
}

export async function getCourses(): Promise<Course[]> {
  if (USE_MOCK) return courses
  try {
    const response = await apiRequest<Course[] | unknown>({
      path: '/courses',
    })

    const items: unknown[] = Array.isArray(response) ? response : []

    if (items.length === 0) {
      throw new Error('Empty courses list')
    }

    return items.map((c) => mapBackendCourseToCourse(c as BackendCourse))
  } catch (err) {
    console.warn('Falling back to local courses:', (err as Error).message)
    return courses
  }
}

export async function getCourseDetails(courseId: string): Promise<Course> {
  if (USE_MOCK) {
    const course = getCourseById(courseId)
    if (!course) throw new Error('Course not found')
    return course
  }
  try {
    const course = await apiRequest<unknown>({
      path: `/courses/${encodeURIComponent(courseId)}`,
    })
    return mapBackendCourseToCourse(course as BackendCourse)
  } catch (err) {
    console.warn('Falling back to local course details:', (err as Error).message)
    const course = getCourseById(courseId)
    if (!course) {
      throw new Error('Course not found')
    }
    return course
  }
}

export async function getCourseLessons(
  courseId: string,
): Promise<{ course: Course; lessons: Lesson[] }> {
  if (USE_MOCK) {
    const course = getCourseById(courseId)
    if (!course) throw new Error('Course not found')
    const lessons = course.sections
      .flatMap((s) => s.lessons)
      .sort((a, b) => a.order - b.order)
    return { course, lessons }
  }
  try {
    const data = await apiRequest<{ course: BackendCourse; lessons: BackendLesson[] }>({
      path: `/courses/${encodeURIComponent(courseId)}/lessons`,
      auth: true,
    })
    const course = mapBackendCourseToCourse(data.course)
    const lessons: Lesson[] = (data.lessons ?? []).map(mapBackendLessonToLesson)
    if (course.sections.length === 0 && lessons.length > 0) {
      course.sections = [{ id: 'flat', title: 'Lessons', order: 0, lessons }]
    }
    return { course, lessons }
  } catch (err) {
    console.warn('Falling back to local lessons:', (err as Error).message)
    const course = getCourseById(courseId)
    if (!course) {
      throw new Error('Course not found')
    }

    const lessons = course.sections
      .flatMap((s) => s.lessons)
      .sort((a, b) => a.order - b.order)

    return { course, lessons }
  }
}

export async function getLessonById(
  courseId: string,
  lessonId: string,
): Promise<{ course: Course; lesson: Lesson; lessons: Lesson[] }> {
  if (!USE_MOCK) {
    try {
      const data = await apiRequest<{
        course: BackendCourse
        lesson: BackendLesson
        lessons: BackendLesson[]
      }>({
        path: `/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}`,
        auth: true,
      })
      const course = mapBackendCourseToCourse(data.course)
      const lessons = (data.lessons ?? []).map(mapBackendLessonToLesson)
      const lesson = data.lesson
        ? mapBackendLessonToLesson(data.lesson)
        : lessons.find((l) => l.id === lessonId) ?? lessons[0]
      if (!lesson) throw new Error('Lesson not found')
      return { course, lesson, lessons }
    } catch (err) {
      console.warn('Falling back to local lesson by id:', (err as Error).message)
    }
  }
  const { course, lessons } = await getCourseLessons(courseId)
  const found = lessons.find((l) => l.id === lessonId) ?? lessons[0]
  if (!found) throw new Error('Lesson not found')
  return { course, lesson: found, lessons }
}

export async function getFirstLessonForUser(
  courseId: string,
): Promise<{ course: Course; lesson: Lesson; lessons: Lesson[] }> {
  const auth = useAuthStore.getState()
  const { course, lessons } = await getCourseLessons(courseId)

  if (!auth.user) {
    return { course, lesson: lessons[0], lessons }
  }

  const last = useProgressStore
    .getState()
    .getLastWatchedLesson(auth.user.id, courseId)

  if (last) {
    const match = lessons.find((l) => l.id === last.lessonId)
    if (match) {
      return { course, lesson: match, lessons }
    }
  }

  return { course, lesson: lessons[0], lessons }
}

export async function updateLessonProgressApi(args: {
  courseId: string
  lessonId: string
  lastPositionSeconds: number
  isCompleted?: boolean
}): Promise<void> {
  const auth = useAuthStore.getState()
  if (!auth.user) return

  useProgressStore
    .getState()
    .updateLessonProgress({ userId: auth.user.id, ...args })

  if (USE_MOCK) return

  try {
    await apiRequest<{ success: boolean }>({
      path: `/users/${encodeURIComponent(auth.user.id)}/progress`,
      method: 'POST',
      body: {
        courseId: args.courseId,
        lessonId: args.lessonId,
        lastPositionSeconds: args.lastPositionSeconds,
        isCompleted: args.isCompleted ?? false,
      },
      auth: true,
    })
  } catch (err) {
    console.warn('Failed to sync progress to backend:', (err as Error).message)
  }
}

export async function getCourseProgressSummary(courseId: string): Promise<{
  totalLessons: number
  completedLessons: number
  percentComplete: number
}> {
  const auth = useAuthStore.getState()

  if (USE_MOCK) {
    const course = getCourseById(courseId)
    const totalLessons = (course?.sections ?? []).flatMap((s) => s.lessons).length
    if (!auth.user) {
      return { totalLessons, completedLessons: 0, percentComplete: 0 }
    }
    const courseProgress = useProgressStore
      .getState()
      .getCourseProgress(auth.user.id, courseId)
    if (!courseProgress) {
      return { totalLessons, completedLessons: 0, percentComplete: 0 }
    }
    const completedLessons = Object.values(courseProgress).filter(
      (p) => p.isCompleted,
    ).length
    const percentComplete =
      totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)
    return { totalLessons, completedLessons, percentComplete }
  }

  try {
    if (auth.user) {
      const summary = await apiRequest<{
        totalLessons: number
        completedLessons: number
        percentComplete: number
      }>({
        path: `/courses/${encodeURIComponent(courseId)}/progress-summary`,
        auth: true,
      })
      return {
        totalLessons: summary.totalLessons ?? 0,
        completedLessons: summary.completedLessons ?? 0,
        percentComplete: summary.percentComplete ?? 0,
      }
    }
  } catch (err) {
    console.warn(
      'Falling back to local progress summary:',
      (err as Error).message,
    )
  }

  const { lessons } = await getCourseLessons(courseId)
  const totalLessons = lessons.length

  if (!auth.user) {
    return { totalLessons, completedLessons: 0, percentComplete: 0 }
  }

  const courseProgress = useProgressStore
    .getState()
    .getCourseProgress(auth.user.id, courseId)

  if (!courseProgress) {
    return { totalLessons, completedLessons: 0, percentComplete: 0 }
  }

  const completedLessons = Object.values(courseProgress).filter(
    (p) => p.isCompleted,
  ).length
  const percentComplete =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)

  return { totalLessons, completedLessons, percentComplete }
}

/**
 * Send a message to the backend AI chat endpoint. Use this when the backend implements POST /chat.
 * Tries /chat then /api/chat. Accepts multiple response shapes (reply, content, message, response, text).
 * Throws on 4xx/5xx or when the backend is not available (caller can fall back to direct HF or show error).
 */
export async function getChatReply(
  message: string,
  history: Array<{ role: string; content: string }> = [],
): Promise<string> {
  const body = { message, history }
  const pathsToTry = ['/chat', '/api/chat'] as const
  let lastError: Error | null = null

  for (const path of pathsToTry) {
    try {
      const data = await apiRequest<Record<string, unknown>>({
        method: 'POST',
        path,
        body,
        auth: true,
      })
      const text = extractReplyFromResponse(data)
      if (text) return text
      lastError = new Error('Invalid chat response')
    } catch (err) {
      lastError = err as Error
      continue
    }
  }

  throw lastError ?? new Error('Invalid chat response')
}

function extractReplyFromResponse(data: Record<string, unknown> | null | undefined): string | null {
  if (!data || typeof data !== 'object') return null
  const keys = ['reply', 'content', 'message', 'response', 'text', 'result', 'output']
  for (const k of keys) {
    const v = data[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  const inner = data.data as Record<string, unknown> | undefined
  if (inner && typeof inner === 'object') {
    for (const k of keys) {
      const v = inner[k]
      if (typeof v === 'string' && v.trim()) return v.trim()
    }
    const str = typeof inner === 'string' ? inner : null
    if (str && str.trim()) return str.trim()
  }
  return null
}

/** Backend course/lesson shapes (current backend – no /api prefix) */
interface BackendLesson {
  id?: string
  title?: string
  order?: number
  youtubeUrl?: string
  durationMinutes?: number
}

interface BackendSection {
  id?: string
  title?: string
  order?: number
  lessons?: BackendLesson[]
}

interface BackendCourse {
  id?: string
  title?: string
  slug?: string
  category?: string
  difficulty?: string
  description?: string
  instructor?: string
  thumbnailUrl?: string
  totalMinutes?: number
  sections?: BackendSection[]
}

function mapBackendLessonToLesson(bl: BackendLesson | null | undefined): Lesson {
  const id = bl?.id ?? ''
  const title = bl?.title ?? 'Untitled lesson'
  const order = bl?.order ?? 0
  const youtubeUrl = bl?.youtubeUrl ?? ''
  const durationMinutes = bl?.durationMinutes
  return { id, title, order, youtubeUrl, durationMinutes }
}

function mapBackendCourseToCourse(bc: BackendCourse | null | undefined): Course {
  const local = bc?.id ? getCourseById(bc.id) : null
  const id = bc?.id ?? ''
  const title = bc?.title ?? local?.title ?? 'Untitled course'
  const slug = bc?.slug ?? local?.slug ?? id
  const description = bc?.description ?? local?.description ?? 'No description available.'
  const category = (bc?.category ?? local?.category ?? 'Other') as CourseCategory
  const difficulty = (bc?.difficulty ?? local?.difficulty ?? 'Beginner') as Difficulty
  const instructor = bc?.instructor ?? local?.instructor ?? 'Online Instructor'
  const thumbnailUrl = bc?.thumbnailUrl ?? local?.thumbnailUrl ?? 'https://img.youtube.com/vi/00000000000/maxresdefault.jpg'

  const sections: Section[] = Array.isArray(bc?.sections)
    ? bc.sections.map((sec: BackendSection) => ({
        id: sec.id ?? '',
        title: sec.title ?? 'Section',
        order: sec.order ?? 0,
        lessons: (sec.lessons ?? []).map(mapBackendLessonToLesson),
      }))
    : local?.sections ?? []

  return {
    id,
    title,
    slug,
    category,
    difficulty,
    description,
    instructor,
    thumbnailUrl,
    totalMinutes: bc?.totalMinutes ?? local?.totalMinutes,
    sections,
  }
}

