import { AdminLayout } from '../components/layout/AdminLayout'
import { courses } from '../data/courses'
import { useAssignmentsStore } from '../store/assignmentsStore'
import { useAuthStore } from '../store/authStore'

export function AdminDashboard() {
  const assignmentsStore = useAssignmentsStore()
  const auth = useAuthStore()

  const totalCourses = courses.length
  const totalAssignments = assignmentsStore.assignments.length
  const totalUsersMock = 1280
  const totalEnrollmentsMock = 4200

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome, {auth.user?.name ?? 'Admin'}
        </h1>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Total courses</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {totalCourses}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Total students (mock)
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {totalUsersMock.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Total enrollments (mock)
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {totalEnrollmentsMock.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Total assignments
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {totalAssignments}
            </p>
          </div>
        </div>

        <section className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Recent activity
          </h2>
          <ul className="space-y-1 text-xs text-slate-600">
            <li>New learners enrolled in Java and Python full courses.</li>
            <li>Assignments graded for Java Basics Quiz.</li>
            <li>New AI developer course series published.</li>
          </ul>
        </section>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard


