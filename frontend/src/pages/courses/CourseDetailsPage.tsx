import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import type { Course } from '../../data/courses'
import { getCourseDetails, getCourseProgressSummary } from '../../lib/apiClient'

export function CourseDetailsPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<{
    totalLessons: number
    completedLessons: number
    percentComplete: number
  } | null>(null)

  const load = async () => {
    if (!courseId) return
    try {
      setLoading(true)
      setError(null)
      const [details, summary] = await Promise.all([
        getCourseDetails(courseId),
        getCourseProgressSummary(courseId),
      ])
      setCourse(details)
      setProgress(summary)
    } catch (err) {
      setError((err as Error).message ?? 'Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  const handleStart = () => {
    if (!courseId) return
    navigate(`/learn/${courseId}`)
  }

  return (
    <AppShell>
      <div className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <div className="flex items-center justify-between gap-4">
              <span>{error}</span>
              <button
                type="button"
                onClick={load}
                className="text-xs font-semibold text-red-700 underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Loading course…</p>
          </div>
        )}

        {!loading && course && (
          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <section className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {course.category}
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {course.title}
              </h1>
              <p className="text-sm text-slate-600">{course.description}</p>
              <p className="text-xs text-slate-500">
                By {course.instructor} • {course.difficulty}
              </p>

              {progress && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Progress:{' '}
                      <span className="font-medium text-slate-700">
                        {progress.percentComplete}%
                      </span>
                    </span>
                    <span>
                      {progress.completedLessons}/{progress.totalLessons} lessons
                      completed
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-sky-600"
                      style={{ width: `${progress.percentComplete}%` }}
                    />
                  </div>
                </div>
              )}
            </section>

            <aside className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
              <button
                type="button"
                onClick={handleStart}
                className="w-full rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
              >
                {progress && progress.percentComplete > 0
                  ? 'Continue learning'
                  : 'Start learning'}
              </button>
              <p className="text-xs text-slate-500">
                Lessons:{' '}
                {course.sections
                  .flatMap((s) => s.lessons)
                  .length.toLocaleString()}
              </p>
            </aside>
          </div>
        )}
      </div>
    </AppShell>
  )
}

