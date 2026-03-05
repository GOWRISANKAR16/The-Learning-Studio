import { useState } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'
import {
  useAssignmentsStore,
  type Assignment,
} from '../store/assignmentsStore'
import { courses } from '../data/courses'

export function ManageAssignments() {
  const assignmentsStore = useAssignmentsStore()
  const [form, setForm] = useState<Assignment>({
    id: '',
    courseId: '',
    title: '',
    deadline: new Date().toISOString(),
    description: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!form.title.trim() || !form.courseId) return
    const id =
      editingId ??
      (form.id || form.title.toLowerCase().replace(/\s+/g, '-'))

    const updated: Assignment = {
      ...form,
      id,
    }

    const existing = assignmentsStore.assignments.filter(
      (a) => a.id !== id,
    )
    assignmentsStore.setAssignments([...existing, updated])
    setForm({
      id: '',
      courseId: '',
      title: '',
      deadline: new Date().toISOString(),
      description: '',
    })
    setEditingId(null)
  }

  const handleEdit = (assignment: Assignment) => {
    setForm(assignment)
    setEditingId(assignment.id)
  }

  const handleDelete = (id: string) => {
    assignmentsStore.setAssignments(
      assignmentsStore.assignments.filter((a) => a.id !== id),
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">
          Manage assignments
        </h1>

        <section className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            {editingId ? 'Edit assignment' : 'New assignment'}
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
              <label className="text-slate-700">Course</label>
              <select
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                value={form.courseId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, courseId: e.target.value }))
                }
              >
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1 text-sm">
              <label className="text-slate-700">Deadline</label>
              <input
                type="date"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                value={form.deadline.slice(0, 10)}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    deadline: new Date(e.target.value).toISOString(),
                  }))
                }
              />
            </div>
            <div className="space-y-1 text-sm md:col-span-2">
              <label className="text-slate-700">Description</label>
              <textarea
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-3 rounded-md bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-800"
          >
            {editingId ? 'Save changes' : 'Create assignment'}
          </button>
        </section>

        <section className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Deadline</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {assignmentsStore.assignments.map((assignment) => {
                const course = courses.find(
                  (c) => c.id === assignment.courseId,
                )
                return (
                  <tr
                    key={assignment.id}
                    className="border-t border-slate-100 text-xs"
                  >
                    <td className="px-4 py-2">{assignment.title}</td>
                    <td className="px-4 py-2">{course?.title ?? 'Course'}</td>
                    <td className="px-4 py-2">
                      {new Date(
                        assignment.deadline,
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleEdit(assignment)}
                        className="mr-2 text-sky-700 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(assignment.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      </div>
    </AdminLayout>
  )
}

export default ManageAssignments


