import { AdminLayout } from '../../components/layout/AdminLayout'

export function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
        <div className="space-y-3 rounded-xl bg-white p-5 shadow-sm text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Site name</p>
              <p className="text-xs text-slate-500">
                Displayed in the header and emails.
              </p>
            </div>
            <input
              defaultValue="Learning LMS"
              className="w-48 rounded-md border border-slate-200 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Email notifications</p>
              <p className="text-xs text-slate-500">
                Mock toggle for learner reminder emails.
              </p>
            </div>
            <button className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
              Enabled
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

