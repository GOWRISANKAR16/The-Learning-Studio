import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LessonProgress {
  lastPositionSeconds: number
  isCompleted: boolean
  updatedAt: string
}

export interface CourseProgress {
  [lessonId: string]: LessonProgress
}

export interface UserProgress {
  [courseId: string]: CourseProgress
}

interface ProgressState {
  data: {
    [userId: string]: UserProgress
  }
  updateLessonProgress: (args: {
    userId: string
    courseId: string
    lessonId: string
    lastPositionSeconds: number
    isCompleted?: boolean
  }) => void
  getCourseProgress: (userId: string, courseId: string) => CourseProgress | undefined
  getLastWatchedLesson: (
    userId: string,
    courseId: string,
  ) => { lessonId: string; lastPositionSeconds: number } | null
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      data: {},
      updateLessonProgress({
        userId,
        courseId,
        lessonId,
        lastPositionSeconds,
        isCompleted,
      }) {
        if (!userId) return
        const current = structuredClone(get().data)
        const userProgress = current[userId] ?? {}
        const courseProgress = userProgress[courseId] ?? {}
        const existing = courseProgress[lessonId]

        const next: LessonProgress = {
          lastPositionSeconds: Math.max(0, lastPositionSeconds),
          isCompleted: isCompleted ?? existing?.isCompleted ?? false,
          updatedAt: new Date().toISOString(),
        }

        userProgress[courseId] = {
          ...courseProgress,
          [lessonId]: next,
        }
        current[userId] = userProgress
        set({ data: current })
      },
      getCourseProgress(userId: string, courseId: string) {
        return get().data[userId]?.[courseId]
      },
      getLastWatchedLesson(userId: string, courseId: string) {
        const courseProgress = get().data[userId]?.[courseId]
        if (!courseProgress) return null

        const entries = Object.entries(courseProgress)
        if (entries.length === 0) return null

        const [lessonId, progress] = entries.sort(
          (a, b) =>
            new Date(b[1].updatedAt).getTime() -
            new Date(a[1].updatedAt).getTime(),
        )[0]

        return {
          lessonId,
          lastPositionSeconds: progress.lastPositionSeconds,
        }
      },
    }),
    {
      name: 'lms-progress',
    },
  ),
)

