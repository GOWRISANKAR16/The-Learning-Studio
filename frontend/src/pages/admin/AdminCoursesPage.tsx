import { AdminLayout } from '../../components/layout/AdminLayout'
import { courses } from '../../data/courses'

export function AdminCoursesPage() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">Courses</h1>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Difficulty</th>
                <th className="px-4 py-2">Lessons</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{course.title}</td>
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {course.category}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {course.difficulty}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {course.sections
                      .flatMap((s) => s.lessons)
                      .length.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

