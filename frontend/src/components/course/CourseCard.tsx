import { Link } from 'react-router-dom'
import type { Course } from '../../data/courses'
import { getCourseDisplayPrice, formatPriceInr } from '../../data/courses'

type Props = {
  course: Course
}

export function CourseCard({ course }: Props) {
  const price = getCourseDisplayPrice(course)
  const lessonCount = (course?.sections ?? []).reduce(
    (sum, s) => sum + s.lessons.length,
    0,
  )

  const isBestseller =
    course.id.includes('java') ||
    course.id.includes('python') ||
    course.id.includes('react')

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
    >
      <div
        className="relative h-32 w-full overflow-hidden bg-slate-900"
      >
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
        />
        {isBestseller && (
          <span className="absolute left-2 top-2 rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-900 shadow-sm">
            Bestseller
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-1 p-3">
        <span className="inline-flex w-fit rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
          {course.category}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-sky-700">
          {course.title}
        </h3>
        <p className="text-xs text-slate-500">By {course.instructor}</p>
        <p className="mt-1 text-[11px] text-slate-400">
          {course.difficulty} • {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-slate-900">
            {formatPriceInr(price)}
          </span>
          <span className="text-xs text-slate-400">course price</span>
        </div>
      </div>
    </Link>
  )
}

