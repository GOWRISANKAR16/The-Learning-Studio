import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LearningLayout } from '../../components/layout/LearningLayout'
import { LessonSidebar } from '../../components/sidebar/LessonSidebar'
import { VideoPlayer } from '../../components/video/VideoPlayer'
import type { Course, Lesson } from '../../data/courses'
import { getFirstLessonForUser, getLessonById, updateLessonProgressApi } from '../../lib/apiClient'
import { useAuthStore } from '../../store/authStore'

export function LearnPage() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const auth = useAuthStore()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    if (!courseId) return
    try {
      setLoading(true)
      setError(null)

      if (lessonId) {
        const { course, lesson, lessons } = await getLessonById(
          courseId,
          lessonId,
        )
        setCourse(course)
        setLessons(lessons)
        setCurrentLesson(lesson)
      } else {
        const { course, lesson, lessons } = await getFirstLessonForUser(
          courseId,
        )
        setCourse(course)
        setLessons(lessons)
        setCurrentLesson(lesson)
        navigate(`/learn/${course.id}/lesson/${lesson.id}`, { replace: true })
      }
    } catch (err) {
      setError((err as Error).message ?? 'Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lessonId])

  const handleProgress = (seconds: number) => {
    if (!course || !currentLesson || !auth.user) return
    void updateLessonProgressApi({
      courseId: course.id,
      lessonId: currentLesson.id,
      lastPositionSeconds: seconds,
    })
  }

  const handleCompleted = () => {
    if (!course || !currentLesson || !auth.user) return
    void updateLessonProgressApi({
      courseId: course.id,
      lessonId: currentLesson.id,
      lastPositionSeconds: 0,
      isCompleted: true,
    })

    // Auto-advance to next lesson if available
    const idx = lessons.findIndex((l) => l.id === currentLesson.id)
    const next = lessons[idx + 1]
    if (next) {
      navigate(`/learn/${course.id}/lesson/${next.id}`)
    }
  }

  if (!courseId) {
    return null
  }

  return (
    <LearningLayout
      sidebar={
        course && lessons.length > 0 ? (
          <LessonSidebar course={course} lessons={lessons} />
        ) : null
      }
    >
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <div className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <button
              type="button"
              onClick={load}
              className="text-xs font-semibold text-red-700 underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading lesson…</p>
        </div>
      )}

      {!loading && course && currentLesson && (
        <section className="space-y-4">
          <VideoPlayer
            youtubeUrl={currentLesson.youtubeUrl}
            onProgress={handleProgress}
            onCompleted={handleCompleted}
          />
          <div className="space-y-1 rounded-xl bg-white p-4 shadow-sm">
            <h1 className="text-lg font-semibold text-slate-900">
              {currentLesson.title}
            </h1>
            <p className="text-xs text-slate-500">
              {course.title} • {course.category}
            </p>
          </div>
        </section>
      )}
    </LearningLayout>
  )
}

