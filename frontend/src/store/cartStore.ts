import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Course } from '../data/courses'

export interface CartItem {
  courseId: string
  title: string
  priceInr: number
  thumbnailUrl: string
}

interface CartState {
  items: CartItem[]
  addItem: (course: Course, priceInr: number) => void
  removeItem: (courseId: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem(course, priceInr) {
        const existing = get().items
        if (existing.some((i) => i.courseId === course.id)) return
        const next: CartItem = {
          courseId: course.id,
          title: course.title,
          priceInr,
          thumbnailUrl: course.thumbnailUrl,
        }
        set({ items: [...existing, next] })
      },
      removeItem(courseId) {
        set({ items: get().items.filter((i) => i.courseId !== courseId) })
      },
      clear() {
        set({ items: [] })
      },
    }),
    {
      name: 'lms-cart',
    },
  ),
)

