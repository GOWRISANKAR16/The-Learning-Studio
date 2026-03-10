import { Link } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { getFooterPage } from '../content/footerPages'

type StaticContentPageProps = {
  slug: string
}

export function StaticContentPage({ slug }: StaticContentPageProps) {
  const page = getFooterPage(slug)

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-4 inline-flex items-center text-sm font-medium text-sky-700 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded"
        >
          ← Home
        </Link>
        {!page ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">Page not found</h1>
            <p className="mt-2 text-sm text-slate-600">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
            >
              Back to dashboard
            </Link>
          </div>
        ) : (
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              {page.title}
            </h1>
            <div className="mt-6 space-y-4 text-slate-700 leading-relaxed">
              {page.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        )}
      </div>
    </AppShell>
  )
}
