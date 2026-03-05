import { create } from 'zustand'

type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
  toggle: () => void
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  mode: 'light',
  toggle() {
    set({ mode: get().mode === 'light' ? 'dark' : 'light' })
  },
  setMode(mode: ThemeMode) {
    set({ mode })
  },
}))


