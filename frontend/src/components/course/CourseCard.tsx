import { Link } from 'react-router-dom'
import type { Course } from '../../data/courses'

type Props = {
  course: Course
}

export function CourseCard({ course }: Props) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
    >
      <div
        className="h-28 w-full bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
      />
      <div className="flex flex-1 flex-col space-y-1 p-3">
        <span className="inline-flex w-fit rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
          {course.category}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-sky-700">
          {course.title}
        </h3>
        <p className="text-xs text-slate-500">By {course.instructor}</p>
        <p className="mt-1 text-[11px] text-slate-400">
          {course.difficulty} • 1 video
        </p>
      </div>
    </Link>
  )
}

