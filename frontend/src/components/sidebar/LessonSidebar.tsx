import { Link, useParams } from 'react-router-dom'
import type { Course, Lesson } from '../../data/courses'

type Props = {
  course: Course
  lessons: Lesson[]
}

export function LessonSidebar({ course, lessons }: Props) {
  const params = useParams()
  const activeLessonId = params.lessonId ?? lessons[0]?.id

  return (
    <aside className="w-full border-b border-slate-200 bg-white md:w-72 md:flex-shrink-0 md:border-b-0 md:border-r">
      <div className="px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Course
        </p>
        <h2 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">
          {course.title}
        </h2>
      </div>
      <div className="border-t border-slate-100">
        <ul className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto text-sm">
          {lessons.map((lesson) => {
            const isActive = lesson.id === activeLessonId
            return (
              <li key={lesson.id}>
                <Link
                  to={`/learn/${course.id}/lesson/${lesson.id}`}
                  className={`flex items-start gap-2 px-4 py-3 ${
                    isActive
                      ? 'bg-sky-50 text-sky-800'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span
                    className={`mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border text-[10px] ${
                      isActive
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-slate-300 text-slate-400'
                    }`}
                  >
                    ▶
                  </span>
                  <span className="line-clamp-2">{lesson.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}

