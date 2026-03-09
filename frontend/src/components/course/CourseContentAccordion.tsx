import { useState } from 'react'
import type { Course, Lesson, Section } from '../../data/courses'

type Props = {
  course: Course
}

function formatDurationTotal(minutes?: number): string {
  if (!minutes || minutes <= 0) return '0min'
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

function formatLessonDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) return ''
  const totalSeconds = Math.round(minutes * 60)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  const mm = m.toString()
  const ss = s.toString().padStart(2, '0')
  return `${mm}:${ss}`
}

function getAllSections(course: Course): Section[] {
  return course.sections ?? []
}

function getAllLessons(sections: Section[]): Lesson[] {
  return sections.flatMap((s) => s.lessons ?? [])
}

export function CourseContentAccordion({ course }: Props) {
  const sections = getAllSections(course)
  const allLessons = getAllLessons(sections)
  const totalMinutes = allLessons.reduce(
    (sum, l) => sum + (l.durationMinutes ?? 0),
    0,
  )

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(sections.length > 0 ? [sections[0].id] : []),
  )

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (sections.length === 0) {
    return null
  }

  return (
    <section id="curriculum" className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Course content
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {sections.length} section{sections.length !== 1 ? 's' : ''} ·{' '}
            {allLessons.length} lecture{allLessons.length !== 1 ? 's' : ''} ·{' '}
            {formatDurationTotal(totalMinutes)} total length
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-sky-700 hover:text-sky-900"
          onClick={() => {
            const allIds = sections.map((s) => s.id)
            const allExpanded =
              allIds.every((id) => expandedIds.has(id)) && allIds.length > 0
            setExpandedIds(
              allExpanded ? new Set<string>() : new Set<string>(allIds),
            )
          }}
        >
          {sections.every((s) => expandedIds.has(s.id))
            ? 'Collapse all sections'
            : 'Expand all sections'}
        </button>
      </div>

      <div className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200">
        {sections.map((section, index) => {
          const isOpen = expandedIds.has(section.id)
          const lectures = section.lessons ?? []
          const sectionMinutes = lectures.reduce(
            (sum, l) => sum + (l.durationMinutes ?? 0),
            0,
          )
          return (
            <div key={section.id}>
              <button
                type="button"
                onClick={() => toggle(section.id)}
                className="flex w-full items-center justify-between gap-2 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500">
                    Section {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {section.title}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-slate-500">
                  <span>
                    {lectures.length} lecture
                    {lectures.length !== 1 ? 's' : ''} ·{' '}
                    {formatDurationTotal(sectionMinutes)}
                  </span>
                  <span className="text-slate-400">
                    {isOpen ? '▴' : '▾'}
                  </span>
                </div>
              </button>
              {isOpen && (
                <ul className="bg-white text-sm text-slate-700">
                  {lectures.map((lesson, idx) => {
                    const duration = formatLessonDuration(
                      lesson.durationMinutes,
                    )
                    const showPreview =
                      index === 0 && (idx === 0 || idx === 1) && duration
                    return (
                      <li
                        key={lesson.id}
                        className="flex items-center justify-between gap-4 px-4 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[11px] text-slate-600">
                            ▷
                          </span>
                          <span className="text-sm">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          {showPreview && (
                            <span className="font-semibold text-sky-700">
                              Preview
                            </span>
                          )}
                          {duration && <span>{duration}</span>}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

