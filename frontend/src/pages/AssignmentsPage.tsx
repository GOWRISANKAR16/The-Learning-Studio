import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { getCourses } from '../lib/apiClient'
import type { Course } from '../data/courses'
import { useAuthStore } from '../store/authStore'
import {
  useAssignmentsStore,
  type Assignment,
  type AssignmentStatus,
  type MCQQuestion,
} from '../store/assignmentsStore'
import { submitAssignmentAnswers } from '../lib/apiClient'

function statusLabel(status: AssignmentStatus): string {
  switch (status) {
    case 'submitted':
      return 'Submitted'
    case 'graded':
      return 'Graded'
    default:
      return 'Pending'
  }
}

function statusClass(status: AssignmentStatus): string {
  switch (status) {
    case 'graded':
      return 'bg-emerald-50 text-emerald-700'
    case 'submitted':
      return 'bg-sky-50 text-sky-700'
    default:
      return 'bg-amber-50 text-amber-700'
  }
}

export function AssignmentsPage() {
  const auth = useAuthStore()
  const assignmentsStore = useAssignmentsStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [searchParams] = useSearchParams()
  const initialCourseId = searchParams.get('courseId') ?? undefined

  useEffect(() => {
    let cancelled = false
    getCourses()
      .then((list) => {
        if (!cancelled) setCourses(list)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  if (!auth.user) {
    return (
      <AppShell>
        <div className="rounded-xl bg-white p-6 text-sm text-slate-600 shadow-sm">
          Please sign in to view assignments.
        </div>
      </AppShell>
    )
  }

  const userId = auth.user.id
  const allAssignments = assignmentsStore.getAssignmentsForUser(userId)

  const filteredAssignments = useMemo(() => {
    // Only show assignments when a courseId is provided (navigated from a course)
    if (!initialCourseId) return []
    return allAssignments.filter((a) => a.courseId === initialCourseId)
  }, [allAssignments, initialCourseId])

  // Group assignments by course (courses they are taking that have assignments)
  const byCourse = filteredAssignments.reduce<Record<string, Assignment[]>>((acc, a) => {
    if (!acc[a.courseId]) acc[a.courseId] = []
    acc[a.courseId].push(a)
    return acc
  }, {})

  const handleOptionChange = (questionId: string, idx: number) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: idx }))
  }

  const handleSubmit = async () => {
    if (!activeAssignment) return
    const questions = activeAssignment.questions ?? []
    if (questions.length === 0) return
    const answers = questions.map((q) => ({
      questionId: q.id,
      selectedIndex: selectedOptions[q.id] ?? -1,
    }))

    setSubmitting(true)
    try {
      await submitAssignmentAnswers({
        assignmentId: activeAssignment.id,
        userId,
        answers,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Assignments</h1>
          <p className="mt-1 text-sm text-slate-500">
            Assignments for the courses you are taking. Complete the questions and submit your work.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
          {/* Left: assignments grouped by course */}
          <div className="space-y-6">
            {filteredAssignments.length === 0 && (
              <section className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  {initialCourseId
                    ? 'There are no assignments configured yet for this course.'
                    : 'No assignments to show yet. Open a course and use the Assignments tab or button to view its quizzes here.'}
                </p>
                {!initialCourseId && (
                  <Link
                    to="/"
                    className="mt-3 inline-block text-sm font-medium text-sky-700 hover:text-sky-900"
                  >
                    Browse courses →
                  </Link>
                )}
              </section>
            )}

            {Object.entries(byCourse).map(([courseId, assignments]) => {
              const course = courses.find((c) => c.id === courseId) ?? null
              const courseTitle = course?.title ?? courseId

              return (
                <section
                  key={courseId}
                  className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                >
                  <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                    <h2 className="text-sm font-semibold text-slate-900">
                      {courseTitle}
                    </h2>
                    {course && (
                      <Link
                        to={`/courses/${course.id}`}
                        className="text-xs text-sky-700 hover:text-sky-900"
                      >
                        View course →
                      </Link>
                    )}
                  </div>
                  <div className="divide-y divide-slate-100">
                    {assignments.map((assignment) => {
                      const submission = assignmentsStore.getSubmission(
                        assignment.id,
                        userId,
                      )
                      const status: AssignmentStatus = submission?.status ?? 'pending'
                      const isActive = activeAssignment?.id === assignment.id

                      return (
                        <div
                          key={assignment.id}
                          className="p-4"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveAssignment(assignment)
                            }}
                            className={`flex w-full items-start justify-between gap-3 text-left rounded-lg p-3 transition-colors ${
                              isActive
                                ? 'bg-sky-50 border border-sky-200'
                                : 'hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-900">
                                {assignment.title}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                Due: {new Date(assignment.deadline).toLocaleDateString(undefined, {
                                  dateStyle: 'medium',
                                })}
                              </p>
                              {assignment.questions && assignment.questions.length > 0 && (
                                <p className="mt-1 text-xs text-slate-600">
                                  {assignment.questions.length} question{assignment.questions.length !== 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                            <span
                              className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(status)}`}
                            >
                              {statusLabel(status)}
                            </span>
                          </button>

                          {/* Assignment questions (always visible in list for this assignment) */}
                          <div className="mt-3 ml-3 pl-3 border-l-2 border-slate-200 space-y-2">
                            {assignment.questions && assignment.questions.length > 0 ? (
                              <ul className="list-none space-y-1.5 text-sm text-slate-700">
                                {assignment.questions.map((q: MCQQuestion, idx: number) => (
                                  <li key={q.id} className="flex flex-col gap-1.5">
                                    <span className="flex items-start gap-2">
                                      <span className="font-medium text-slate-500 shrink-0">
                                        {idx + 1}.
                                      </span>
                                      <span>{q.text}</span>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-slate-600">
                                {assignment.description}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>

          {/* Right: quiz panel */}
          <aside className="lg:sticky lg:top-24 self-start rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Course quiz
            </h2>
            {!activeAssignment && (
              <p className="mt-3 text-sm text-slate-500">
                Select an assignment on the left to view its questions and submit your answers.
              </p>
            )}
            {activeAssignment && (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {activeAssignment.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    Due: {new Date(activeAssignment.deadline).toLocaleString()}
                  </p>
                </div>
                {activeAssignment.questions && activeAssignment.questions.length > 0 && (
                  <div className="space-y-4">
                    {activeAssignment.questions.map((q) => {
                      const selected = selectedOptions[q.id]
                      const submission = assignmentsStore.getSubmission(
                        activeAssignment.id,
                        userId,
                      )
                      const isGraded = submission?.status === 'graded'
                      const correctSelected =
                        isGraded &&
                        submission.answers.find((a) => a.questionId === q.id)
                          ?.selectedIndex === q.correctIndex

                      return (
                        <div
                          key={q.id}
                          className="rounded-lg bg-slate-50 p-3 text-sm"
                        >
                          <p className="font-medium text-slate-800">
                            {q.text}
                          </p>
                          <div className="mt-2 space-y-1.5">
                            {q.options.map((opt, idx) => (
                              <label
                                key={idx}
                                className="flex cursor-pointer items-center gap-2 text-xs text-slate-700"
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  className="h-3 w-3 border-slate-300 text-sky-600 focus:ring-sky-600"
                                  checked={selected === idx}
                                  onChange={() =>
                                    handleOptionChange(q.id, idx)
                                  }
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                          {isGraded && (
                            <p
                              className={`mt-2 text-xs font-semibold ${
                                correctSelected
                                  ? 'text-emerald-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {correctSelected
                                ? 'Correct'
                                : `Correct answer: ${
                                    q.options[q.correctIndex]
                                  }`}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {(!activeAssignment.questions ||
                  activeAssignment.questions.length === 0) && (
                  <p className="text-sm text-slate-600">
                    {activeAssignment.description}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Submit answers'}
                </button>
                {activeAssignment && (
                  <div className="text-xs text-slate-600">
                    {(() => {
                      const submission = assignmentsStore.getSubmission(
                        activeAssignment.id,
                        userId,
                      )
                      if (!submission) return null
                      return (
                        <p className="mt-1">
                          Score:{' '}
                          <span className="font-semibold text-slate-800">
                            {submission.score}/{submission.maxScore}
                          </span>
                          {submission.score === submission.maxScore && (
                            <span className="ml-1 text-emerald-700">
                              · Full marks!
                            </span>
                          )}
                        </p>
                      )
                    })()}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </AppShell>
  )
}
