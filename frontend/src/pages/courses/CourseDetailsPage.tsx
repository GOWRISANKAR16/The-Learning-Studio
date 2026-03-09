import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import type { Course } from '../../data/courses'
import { getCourseDisplayPrice, formatPriceInr } from '../../data/courses'
import { getCourseDetails, getCourseProgressSummary } from '../../lib/apiClient'
import { CourseContentAccordion } from '../../components/course/CourseContentAccordion'
import { useCartStore } from '../../store/cartStore'

export function CourseDetailsPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const addToCart = useCartStore((s) => s.addItem)
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

  const handleAddToCart = () => {
    if (!course) return
    const price = getCourseDisplayPrice(course)
    addToCart(course, price)
    navigate('/cart')
  }

  return (
    <AppShell>
      <div className="space-y-6">
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
          <>
            {/* Hero section */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
              <div className="grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(0,1.1fr)]">
                <div className="px-5 py-6 md:px-8 md:py-8">
                  <nav className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                    <Link to="/" className="hover:text-sky-700">
                      Home
                    </Link>
                    <span>/</span>
                    <span className="text-slate-600">{course.category}</span>
                    <span>/</span>
                    <span className="line-clamp-1 text-slate-800">
                      {course.title}
                    </span>
                  </nav>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-sky-700">
                    {course.category}
                  </p>
                  <h1 className="mt-2 text-2xl font-bold leading-snug md:text-3xl">
                    {course.title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-slate-600">
                    {course.description}
                  </p>
                  <p className="mt-3 text-xs text-slate-500">
                    Created by{' '}
                    <span className="font-semibold text-slate-900">
                      {course.instructor}
                    </span>{' '}
                    • {course.difficulty} level • English
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-amber-300">4.7</span>
                      <span className="text-amber-300">★ ★ ★ ★ ★</span>
                      <span className="text-slate-500">
                        (250,000+ ratings)
                      </span>
                    </div>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>1M+ learners</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>Last updated 2026</span>
                  </div>
                </div>

                {/* Right purchase card inside hero */}
                <aside className="flex items-stretch bg-slate-50 px-5 py-6 md:px-6 md:py-8">
                  <div className="flex w-full flex-col rounded-2xl bg-white text-slate-900 shadow-lg">
                    <div className="h-32 w-full overflow-hidden rounded-t-2xl bg-slate-900">
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
                      />
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <div>
                          <span className="text-2xl font-bold text-slate-900">
                            {formatPriceInr(getCourseDisplayPrice(course))}
                          </span>
                          <div className="text-xs text-slate-500">
                            ₹
                            {(
                              getCourseDisplayPrice(course) * 1.6
                            ).toLocaleString('en-IN')}{' '}
                            <span className="line-through opacity-70">
                              original price
                            </span>
                          </div>
                        </div>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                          Bestseller
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleStart}
                        className="w-full rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
                      >
                        {progress && progress.percentComplete > 0
                          ? 'Continue learning'
                          : 'Start this course'}
                      </button>
                      <button
                        type="button"
                        className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        onClick={handleAddToCart}
                      >
                        Add to cart
                      </button>
                      <ul className="mt-2 space-y-1 text-xs text-slate-600">
                        <li>✔ Lifetime access to all lessons</li>
                        <li>✔ Certificate of completion</li>
                        <li>✔ Access on mobile, tablet and desktop</li>
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            </section>

            {/* Overview / progress and curriculum */}
            <div className="space-y-4">
              <section id="overview" className="rounded-xl bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">
                  Course overview
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {course.description}
                </p>

                {progress && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Your progress:{' '}
                        <span className="font-medium text-slate-800">
                          {progress.percentComplete}%
                        </span>
                      </span>
                      <span>
                        {progress.completedLessons}/{progress.totalLessons}{' '}
                        lessons completed
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-sky-600"
                        style={{ width: `${progress.percentComplete}%` }}
                      />
                    </div>
                  </div>
                )}
              </section>

              <CourseContentAccordion course={course} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}

