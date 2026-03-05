import { AppShell } from '../../components/layout/AppShell'
import { courses } from '../../data/courses'
import { useAuthStore } from '../../store/authStore'
import { useProgressStore } from '../../store/progressStore'

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
            Course progress
          </h2>
          {courseEntries.length === 0 && (
            <p className="text-sm text-slate-500">
              You have not started any courses yet.
            </p>
          )}
          <div className="space-y-3">
            {courseEntries.map(([courseId, courseProgress]) => {
              const course = courses.find((c) => c.id === courseId)
              if (!course) return null
              const totalLessons = course.sections
                .flatMap((s) => s.lessons)
                .length
              const completedLessons = Object.values(courseProgress).filter(
                (p) => p.isCompleted,
              ).length
              const percent =
                totalLessons === 0
                  ? 0
                  : Math.round((completedLessons / totalLessons) * 100)

              return (
                <div
                  key={courseId}
                  className="rounded-lg border border-slate-100 p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">
                      {course.title}
                    </p>
                    <p className="text-xs text-slate-500">{percent}% complete</p>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-sky-600"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
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

