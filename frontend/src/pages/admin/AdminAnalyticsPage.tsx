import { AdminLayout } from '../../components/layout/AdminLayout'
import { courses } from '../../data/courses'
import { useProgressStore } from '../../store/progressStore'

export function AdminAnalyticsPage() {
  const progress = useProgressStore()

  const totalCourses = courses.length
  const totalLearnerCourseEntries = Object.values(progress.data).reduce(
    (acc, userProgress) => acc + Object.keys(userProgress).length,
    0,
  )

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Total courses</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {totalCourses}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Active course enrollments
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {totalLearnerCourseEntries}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Completion rate (approx.)
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">--</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

