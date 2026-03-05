import { AdminLayout } from '../../components/layout/AdminLayout'

export function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Total learners</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">1,248</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Active courses</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">52</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Avg. completion
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">64%</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Daily watch time
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">312h</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

