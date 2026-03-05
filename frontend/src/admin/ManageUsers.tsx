import { useState } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'

type Role = 'student' | 'instructor' | 'admin'
type Status = 'active' | 'blocked'

interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  status: Status
}

const initialUsers: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@lms.test',
    role: 'admin',
    status: 'active',
  },
  {
    id: 'student-1',
    name: 'Demo Learner',
    email: 'student@example.com',
    role: 'student',
    status: 'active',
  },
]

export function ManageUsers() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)

  const updateUser = (id: string, changes: Partial<AdminUser>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...changes } : u)))
  }

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">Manage users</h1>

        <section className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-100 text-xs"
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2 text-sky-700">{user.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateUser(user.id, {
                          role: e.target.value as Role,
                        })
                      }
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {user.status === 'active' ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        updateUser(user.id, {
                          status: user.status === 'active' ? 'blocked' : 'active',
                        })
                      }
                      className="mr-2 text-sky-700 hover:underline"
                    >
                      {user.status === 'active' ? 'Block' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteUser(user.id)}
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

export default ManageUsers


