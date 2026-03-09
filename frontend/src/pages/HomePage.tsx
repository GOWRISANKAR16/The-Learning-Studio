import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import type { Course } from '../data/courses'
import { CourseCard } from '../components/course/CourseCard'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { getCourses } from '../lib/apiClient'

export function HomePage() {
  const navigate = useNavigate()
  const auth = useAuthStore()
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchParams] = useSearchParams()
  const rawQuery = searchParams.get('q') ?? ''
  const query = rawQuery.trim().toLowerCase()

  const hasQuery = query.length > 0

  const searchResults = hasQuery
    ? allCourses.filter((course) => {
        const haystack = [
          course.title,
          course.instructor,
          course.category,
          course.description,
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(query)
      })
    : allCourses

  const editorPicks = allCourses.slice(0, 8)
  const recommended = allCourses.slice(8, 16)
  const aiCourses = allCourses.filter((c) =>
    c.id.startsWith('openai-') ||
    c.id.startsWith('claude-') ||
    c.id.startsWith('building-ai-') ||
    c.id.startsWith('generative-ai-') ||
    c.id.startsWith('ai-coding-'),
  )

  const [heroCourse, setHeroCourse] = useState<Course | null>(null)
  const [heroLessonTitle, setHeroLessonTitle] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const list = await getCourses()
        setAllCourses(list)
      } catch (err) {
        setError((err as Error).message ?? 'Failed to load courses')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  useEffect(() => {
    if (allCourses.length === 0) {
      setHeroCourse(null)
      setHeroLessonTitle(null)
      return
    }

    if (!auth.user) {
      setHeroCourse(allCourses[0] ?? null)
      setHeroLessonTitle(null)
      return
    }

    const progressState = useProgressStore.getState()
    const userProgress = progressState.data[auth.user.id]

    if (userProgress) {
      const [courseId] = Object.entries(userProgress).sort(
        (a, b) =>
          new Date(
            Object.values(b[1])[0]?.updatedAt ?? 0,
          ).getTime() -
          new Date(Object.values(a[1])[0]?.updatedAt ?? 0).getTime(),
      )[0] ?? [null, null]

      if (courseId) {
        const found = allCourses.find((c) => c.id === courseId) ?? null
        setHeroCourse(found)

        const firstLesson = found?.sections[0]?.lessons[0]
        if (firstLesson) setHeroLessonTitle(firstLesson.title)
        return
      }
    }

    setHeroCourse(allCourses[0] ?? null)
    setHeroLessonTitle(null)
  }, [auth.user, allCourses])

  const handleContinue = () => {
    if (!heroCourse) return
    navigate(`/learn/${heroCourse.id}`)
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <section className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Loading courses…</p>
          </section>
        )}
        <section className="rounded-xl bg-white p-4 shadow-sm md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              In progress
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">
              {heroCourse ? heroCourse.title : 'Start your first course'}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {heroLessonTitle
                ? `Resume: ${heroLessonTitle}`
                : 'Resume where you left off or start with an editor pick.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-700 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-800 md:mt-0"
          >
            {heroCourse ? 'Continue learning' : 'Browse courses'}
          </button>
        </section>

        {hasQuery && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Search results
              </h2>
              <p className="text-xs text-slate-500">
                {searchResults.length}{' '}
                {searchResults.length === 1 ? 'course' : 'courses'} matching \"{rawQuery.trim()}\"
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {searchResults.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {!hasQuery && editorPicks.length > 0 && (
          <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Editor&apos;s picks
            </h2>
            <button className="text-xs font-medium text-sky-700 hover:text-sky-900">
              Show all
            </button>
          </div>

            <div className="grid gap-4 md:grid-cols-4">
              {editorPicks.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {!hasQuery && recommended.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Recommended for you
              </h2>
              <button className="text-xs font-medium text-sky-700 hover:text-sky-900">
                Show more
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {recommended.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {!hasQuery && aiCourses.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                AI & LLM developer courses
              </h2>
              <button className="text-xs font-medium text-sky-700 hover:text-sky-900">
                Explore AI courses
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {aiCourses.slice(0, 8).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}

