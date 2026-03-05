import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ChatMessage {
  id: string
  from: 'student' | 'instructor'
  text: string
  createdAt: string
  isRead: boolean
}

export interface Thread {
  id: string
  courseId: string
  courseTitle: string
  messages: ChatMessage[]
}

interface MessagesState {
  threadsByUser: Record<string, Thread[]>
  getThreadsForUser: (userId: string) => Thread[]
  sendMessage: (args: {
    userId: string
    threadId: string
    text: string
  }) => void
  ensureThread: (args: {
    userId: string
    courseId: string
    courseTitle: string
  }) => Thread
  markThreadRead: (args: { userId: string; threadId: string }) => void
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      threadsByUser: {},
      getThreadsForUser(userId) {
        return get().threadsByUser[userId] ?? []
      },
      ensureThread({ userId, courseId, courseTitle }) {
        const state = structuredClone(get().threadsByUser)
        const existing = state[userId]?.find((t) => t.courseId === courseId)
        if (existing) return existing

        const newThread: Thread = {
          id: `${courseId}-thread`,
          courseId,
          courseTitle,
          messages: [
            {
              id: 'welcome',
              from: 'instructor',
              text: `Welcome to ${courseTitle}. Feel free to ask any questions about this course here.`,
              createdAt: new Date().toISOString(),
              isRead: false,
            },
          ],
        }

        state[userId] = [...(state[userId] ?? []), newThread]
        set({ threadsByUser: state })
        return newThread
      },
      sendMessage({ userId, threadId, text }) {
        if (!text.trim()) return
        const state = structuredClone(get().threadsByUser)
        const threads = state[userId]
        if (!threads) return
        const thread = threads.find((t) => t.id === threadId)
        if (!thread) return

        thread.messages.push({
          id: `msg-${Date.now()}`,
          from: 'student',
          text: text.trim(),
          createdAt: new Date().toISOString(),
          isRead: true,
        })

        // Simulate instructor reply
        thread.messages.push({
          id: `reply-${Date.now()}`,
          from: 'instructor',
          text: 'Thanks for your message. An instructor will review and respond in more detail soon.',
          createdAt: new Date().toISOString(),
          isRead: false,
        })

        set({ threadsByUser: state })
      },
      markThreadRead({ userId, threadId }) {
        const state = structuredClone(get().threadsByUser)
        const threads = state[userId]
        if (!threads) return
        const thread = threads.find((t) => t.id === threadId)
        if (!thread) return
        thread.messages.forEach((m) => {
          m.isRead = true
        })
        set({ threadsByUser: state })
      },
    }),
    {
      name: 'lms-messages',
    },
  ),
)

