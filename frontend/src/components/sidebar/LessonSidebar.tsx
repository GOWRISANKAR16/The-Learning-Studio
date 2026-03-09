import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Course, Lesson } from '../../data/courses'
import { useAuthStore } from '../../store/authStore'
import { useProgressStore } from '../../store/progressStore'

type Props = {
  course: Course
  lessons: Lesson[]
}

function formatDurationShort(minutes?: number): string {
  if (minutes == null || minutes < 1) return ''
  if (minutes < 60) return `${Math.round(minutes)}min`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

function sectionDuration(lessons: Lesson[]): number {
  return lessons.reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0)
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M4 3.5a.5.5 0 0 1 .75-.45l7 4a.5.5 0 0 1 0 .9l-7 4A.5.5 0 0 1 4 12.5v-9Z" />
    </svg>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" />
    </svg>
  )
}

function ChevronUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z" />
    </svg>
  )
}

export function LessonSidebar({ course, lessons }: Props) {
  const params = useParams()
  const activeLessonId = params.lessonId ?? lessons[0]?.id
  const auth = useAuthStore()
  const getCourseProgress = useProgressStore((s) => s.getCourseProgress)
  const courseProgress = auth.user ? getCourseProgress(auth.user.id, course.id) : undefined

  const sections = course.sections?.length
    ? course.sections
    : [{ id: 'content', title: 'Content', order: 0, lessons }]

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const activeSection = sections.find((s) =>
      s.lessons.some((l) => l.id === activeLessonId),
    )
    return new Set(activeSection ? [activeSection.id] : [sections[0]?.id].filter(Boolean))
  })

  const toggleSection = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  let globalLessonIndex = 0

  return (
    <aside className="w-full rounded-xl border border-slate-200 bg-white shadow-sm md:border-slate-100">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Course
        </p>
        <h2 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">
          {course.title}
        </h2>
      </div>
      <div className="border-b border-slate-100 px-3 py-2">
        <p className="text-xs font-semibold text-slate-700">
          Course content
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {sections.length} section{sections.length !== 1 ? 's' : ''} · {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="max-h-[min(60vh,520px)] overflow-y-auto">
        {sections.map((section, sectionIndex) => {
          const isExpanded = expandedIds.has(section.id)
          const count = section.lessons.length
          const completedInSection = section.lessons.filter(
            (l) => courseProgress?.[l.id]?.isCompleted,
          ).length
          const totalMin = sectionDuration(section.lessons)
          const durationStr = totalMin > 0 ? formatDurationShort(totalMin) : ''
          const progressStr = `${completedInSection} / ${count}`
          const metaStr = durationStr ? `${progressStr} | ${durationStr}` : progressStr

          return (
            <div
              key={section.id}
              className="border-b border-slate-200 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full flex-col gap-0.5 px-4 py-3 text-left hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Section {sectionIndex + 1}: {section.title}
                  </span>
                  <span className="mt-0.5 flex-shrink-0 text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{metaStr}</span>
                </div>
              </button>
              {isExpanded && (
                <ul className="border-t border-slate-100 bg-slate-50/50">
                  {section.lessons.map((lesson) => {
                    globalLessonIndex += 1
                    const itemNumber = globalLessonIndex
                    const isActive = lesson.id === activeLessonId
                    const isCompleted = courseProgress?.[lesson.id]?.isCompleted ?? false
                    const duration = formatDurationShort(lesson.durationMinutes)

                    return (
                      <li key={lesson.id}>
                        <Link
                          to={`/learn/${course.id}/lesson/${lesson.id}`}
                          className={`flex items-start gap-3 px-4 py-2.5 ${
                            isActive
                              ? 'bg-sky-100/80 font-medium text-sky-900'
                              : 'text-slate-700 hover:bg-slate-100/80'
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
                              isCompleted
                                ? 'border-sky-600 bg-sky-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckIcon className="h-3 w-3" />
                            ) : null}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-snug">
                              {itemNumber}. {lesson.title}
                            </p>
                            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                              <PlayIcon className="h-3.5 w-3.5 text-slate-400" />
                              {duration ? <span>{duration}</span> : null}
                            </div>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
