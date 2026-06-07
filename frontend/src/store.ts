import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  username: string
  full_name?: string
  avatar_url?: string
  travel_level: number
  xp_points: number
  role: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      updateUser: (updates) => set(state => ({ user: state.user ? { ...state.user, ...updates } : null })),
    }),
    { name: 'voyager-auth' }
  )
)

interface AppState {
  sidebarOpen: boolean
  currentTrip: any | null
  setSidebarOpen: (open: boolean) => void
  setCurrentTrip: (trip: any) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  currentTrip: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
}))
