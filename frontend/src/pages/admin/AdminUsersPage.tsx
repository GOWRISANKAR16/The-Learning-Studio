import { AdminLayout } from '../../components/layout/AdminLayout'
import { useAuthStore } from '../../store/authStore'

const mockUsers = [
  { id: 'admin-1', name: 'Admin User', email: 'admin@lms.test', role: 'admin' },
  { id: 'student-1', name: 'Demo Learner', email: 'student@example.com', role: 'student' },
]

export function AdminUsersPage() {
  const auth = useAuthStore()

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Users</h1>
          <span className="text-xs text-slate-500">
            Signed in as {auth.user?.email ?? 'guest'}
          </span>
        </div>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2 text-sky-700">{user.email}</td>
                  <td className="px-4 py-2 text-xs uppercase text-slate-500">
                    {user.role}
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

