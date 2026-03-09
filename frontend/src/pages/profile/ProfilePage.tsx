import { AppShell } from '../../components/layout/AppShell'
import { courses } from '../../data/courses'
import { useAuthStore } from '../../store/authStore'
import { useProgressStore } from '../../store/progressStore'

function formatLastActive(updatedAtList: string[]): string {
  if (updatedAtList.length === 0) return 'Not started'
  const latest = updatedAtList
    .map((d) => new Date(d).getTime())
    .filter((t) => !Number.isNaN(t))
    .sort((a, b) => b - a)[0]
  if (!latest) return 'Not started'
  const diffMs = Date.now() - latest
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks === 1) return '1 week ago'
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths === 1) return '1 month ago'
  if (diffMonths < 12) return `${diffMonths} months ago`
  const diffYears = Math.floor(diffDays / 365)
  if (diffYears === 1) return '1 year ago'
  return `${diffYears} years ago`
}

export function ProfilePage() {
  const auth = useAuthStore()
  const progressState = useProgressStore()

  if (!auth.user) {
    return (
      <AppShell>
        <div className="rounded-xl bg-white p-6 text-sm text-slate-600 shadow-sm">
          Please sign in to view your profile and progress.
        </div>
      </AppShell>
    )
  }

  const userProgress = progressState.data[auth.user.id] ?? {}
  const courseEntries = Object.entries(userProgress)

  const totals = courseEntries.reduce(
    (acc, [courseId, courseProgress]) => {
      const course = courses.find((c) => c.id === courseId)
      if (!course) return acc
      const lessons = course.sections.flatMap((s) => s.lessons)
      const totalLessons = lessons.length
      const completed = Object.values(courseProgress).filter(
        (p) => p.isCompleted,
      ).length
      acc.totalLessons += totalLessons
      acc.completedLessons += completed
      return acc
    },
    { totalLessons: 0, completedLessons: 0 },
  )

  const overallPercent =
    totals.totalLessons === 0
      ? 0
      : Math.round((totals.completedLessons / totals.totalLessons) * 100)

  const completedCourses = courseEntries.filter(([courseId, courseProgress]) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course) return false
    const totalLessons = course.sections.flatMap((s) => s.lessons).length
    const completed = Object.values(courseProgress).filter(
      (p) => p.isCompleted,
    ).length
    return totalLessons > 0 && completed === totalLessons
  })

  const inProgressCourses = courseEntries.filter(([courseId, courseProgress]) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course) return false
    const totalLessons = course.sections.flatMap((s) => s.lessons).length
    const completed = Object.values(courseProgress).filter(
      (p) => p.isCompleted,
    ).length
    return completed > 0 && completed < totalLessons
  })

  return (
    <AppShell>
      <div className="space-y-4">
        <section className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {auth.user.name}
            </h1>
            <p className="text-sm text-slate-500">{auth.user.email}</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-xs text-slate-500">Overall completion</p>
            <p className="text-lg font-semibold text-slate-900">
              {overallPercent}%
            </p>
          </div>
        </section>

        <section className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            {courseEntries.length > 0
              ? `${courseEntries.length} enrollment${
                  courseEntries.length !== 1 ? 's' : ''
                }`
              : 'Course progress'}
          </h2>
          {courseEntries.length === 0 && (
            <p className="text-sm text-slate-500">
              You have not started any courses yet.
            </p>
          )}
          {courseEntries.length > 0 && (
            <div className="mt-2 overflow-hidden rounded-lg border border-slate-100 text-sm">
              <div className="grid grid-cols-[minmax(0,2fr),minmax(0,1fr),minmax(0,1fr)] gap-2 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">
                <span>Course</span>
                <span>Last active</span>
                <span className="text-right">Progress</span>
              </div>
              <div>
                {courseEntries.map(([courseId, courseProgress]) => {
                  const course = courses.find((c) => c.id === courseId)
                  if (!course) return null
                  const lessons = course.sections.flatMap((s) => s.lessons)
                  const totalLessons = lessons.length
                  const progresses = Object.values(courseProgress)
                  const completedLessons = progresses.filter(
                    (p) => p.isCompleted,
                  ).length
                  const percent =
                    totalLessons === 0
                      ? 0
                      : Math.round((completedLessons / totalLessons) * 100)
                  const lastActive = formatLastActive(
                    progresses.map((p) => p.updatedAt),
                  )

                  return (
                    <div
                      key={courseId}
                      className="grid grid-cols-[minmax(0,2fr),minmax(0,1fr),minmax(0,1fr)] items-center gap-2 border-t border-slate-100 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-16 overflow-hidden rounded bg-slate-100">
                          <div
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {course.title}
                          </p>
                          <p className="truncate text-xs text-sky-700">
                            {course.instructor}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">{lastActive}</p>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          {percent}% complete
                        </p>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              Completed courses
            </h3>
            {completedCourses.length === 0 && (
              <p className="text-xs text-slate-500">
                Finish all lessons in a course to see it here.
              </p>
            )}
            <div className="space-y-2 text-sm">
              {completedCourses.map(([courseId]) => {
                const course = courses.find((c) => c.id === courseId)
                if (!course) return null
                return (
                  <div
                    key={courseId}
                    className="flex items-center justify-between rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2"
                  >
                    <span className="text-slate-900">{course.title}</span>
                    <span className="text-xs font-semibold text-emerald-700">
                      Completed
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              In-progress courses
            </h3>
            {inProgressCourses.length === 0 && (
              <p className="text-xs text-slate-500">
                Start watching a course to see it here.
              </p>
            )}
            <div className="space-y-2 text-sm">
              {inProgressCourses.map(([courseId]) => {
                const course = courses.find((c) => c.id === courseId)
                if (!course) return null
                return (
                  <div
                    key={courseId}
                    className="flex items-center justify-between rounded-md border border-sky-100 bg-sky-50 px-3 py-2"
                  >
                    <span className="text-slate-900">{course.title}</span>
                    <span className="text-xs font-semibold text-sky-700">
                      In progress
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}

