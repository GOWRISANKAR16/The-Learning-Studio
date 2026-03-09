import { AppShell } from '../components/layout/AppShell'
import { useCartStore } from '../store/cartStore'
import { formatPriceInr } from '../data/courses'
import { Link } from 'react-router-dom'

export function CartPage() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const clear = useCartStore((s) => s.clear)

  const total = items.reduce((sum, i) => sum + i.priceInr, 0)

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Shopping cart</h1>
            <p className="mt-1 text-sm text-slate-500">
              {items.length === 0
                ? 'Your cart is empty. Browse courses to start learning.'
                : `${items.length} course${items.length !== 1 ? 's' : ''} in your cart.`}
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="text-xs font-semibold text-slate-500 hover:text-red-600"
            >
              Clear cart
            </button>
          )}
        </div>

        {items.length === 0 && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <Link
              to="/"
              className="text-sm font-medium text-sky-700 hover:text-sky-900"
            >
              Browse courses →
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(260px,1fr)]">
            <section className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
              {items.map((item) => (
                <div
                  key={item.courseId}
                  className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="h-16 w-28 overflow-hidden rounded bg-slate-100">
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/courses/${item.courseId}`}
                      className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-sky-700"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatPriceInr(item.priceInr)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.courseId)}
                    className="text-xs font-semibold text-slate-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </section>

            <aside className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">
                  Total
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {formatPriceInr(total)}
                </span>
              </div>
              <button
                type="button"
                className="w-full rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
              >
                Proceed to checkout
              </button>
              <p className="text-xs text-slate-500">
                Checkout is a placeholder in this demo. In a real app, this would
                take learners to a secure payment page.
              </p>
            </aside>
          </div>
        )}
      </div>
    </AppShell>
  )
}

