import { Link } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'

export function FeatureUnavailablePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">
          Feature not available
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This feature is not available in the current version. It may be added in a future update.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
        >
          Back to dashboard
        </Link>
      </div>
    </AppShell>
  )
}
