import { useState } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'
import { courses as initialCourses, type Course } from '../data/courses'

type EditableCourse = Pick<
  Course,
  'id' | 'title' | 'instructor' | 'difficulty' | 'thumbnailUrl'
>

export function ManageCourses() {
  const [courses, setCourses] = useState<EditableCourse[]>(
    initialCourses.map((c) => ({
      id: c.id,
      title: c.title,
      instructor: c.instructor,
      difficulty: c.difficulty,
      thumbnailUrl: c.thumbnailUrl,
    })),
  )
  const [form, setForm] = useState<EditableCourse>({
    id: '',
    title: '',
    instructor: '',
    difficulty: 'Beginner',
    thumbnailUrl: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!form.title.trim()) return
    if (editingId) {
      setCourses((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...form } : c)),
      )
    } else {
      const id = form.id || form.title.toLowerCase().replace(/\s+/g, '-')
      setCourses((prev) => [...prev, { ...form, id }])
    }
    setForm({
      id: '',
      title: '',
      instructor: '',
      difficulty: 'Beginner',
      thumbnailUrl: '',
    })
    setEditingId(null)
  }

  const handleEdit = (course: EditableCourse) => {
    setForm(course)
    setEditingId(course.id)
  }

  const handleDelete = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">
            Manage courses
          </h1>
          <button
            type="button"
            onClick={() => {
              setForm({
                id: '',
                title: '',
                instructor: '',
                difficulty: 'Beginner',
                thumbnailUrl: '',
              })
              setEditingId(null)
            }}
            className="rounded-md bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-800"
          >
            Add course
          </button>
        </div>

        <section className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            {editingId ? 'Edit course' : 'New course'}
          </h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="space-y-1 text-sm">
              <label className="text-slate-700">Title</label>
              <input
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1 text-sm">
              <label className="text-slate-700">Instructor</label>
              <input
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                value={form.instructor}
                onChange={(e) =>
                  setForm((f) => ({ ...f, instructor: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1 text-sm">
              <label className="text-slate-700">Difficulty</label>
              <select
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                value={form.difficulty}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    difficulty: e.target.value as EditableCourse['difficulty'],
                  }))
                }
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="space-y-1 text-sm md:col-span-2">
              <label className="text-slate-700">Thumbnail URL</label>
              <input
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                value={form.thumbnailUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))
                }
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-3 rounded-md bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-800"
          >
            {editingId ? 'Save changes' : 'Create course'}
          </button>
        </section>

        <section className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Instructor</th>
                <th className="px-4 py-2">Difficulty</th>
                <th className="px-4 py-2">Thumbnail</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-t border-slate-100 text-xs"
                >
                  <td className="px-4 py-2">{course.title}</td>
                  <td className="px-4 py-2">{course.instructor}</td>
                  <td className="px-4 py-2">{course.difficulty}</td>
                  <td className="px-4 py-2">
                    <span className="line-clamp-1 text-slate-400">
                      {course.thumbnailUrl}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleEdit(course)}
                      className="mr-2 text-sky-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AdminLayout>
  )
}

export default ManageCourses


