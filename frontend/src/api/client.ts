import axios from 'axios'
import { useAuthStore } from '../store'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) useAuthStore.getState().logout()
    return Promise.reject(err)
  }
)

export default api

// ── Auth ──
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (email: string, password: string) => api.post('/auth/login', new URLSearchParams({ username: email, password }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }),
  me: () => api.get('/auth/me'),
}

// ── Trips ──
export const tripsAPI = {
  list: () => api.get('/trips/'),
  create: (data: any) => api.post('/trips/', data),
  get: (id: string) => api.get(`/trips/${id}`),
  update: (id: string, data: any) => api.put(`/trips/${id}`, data),
  delete: (id: string) => api.delete(`/trips/${id}`),
  generate: (data: any) => api.post('/trips/generate', data),
  explore: () => api.get('/trips/public/explore'),
}

// ── Flights ──
export const flightsAPI = {
  search: (data: any) => api.post('/flights/search', data),
  track: (flightNumber: string) => api.get(`/flights/track/${flightNumber}`),
  airports: (q: string) => api.get(`/flights/airports/search?q=${q}`),
}

// ── Hotels ──
export const hotelsAPI = {
  search: (data: any) => api.post('/hotels/search', data),
  get: (id: string) => api.get(`/hotels/${id}`),
  aiRecommend: (dest: string, budget?: number) => api.get(`/hotels/recommendations/ai?destination=${dest}${budget ? `&budget=${budget}` : ''}`),
}

// ── Transport ──
export const transportAPI = {
  search: (data: any) => api.post('/transport/search', data),
  metro: (city: string) => api.get(`/transport/metro/${city}`),
  nearbyServices: (lat: number, lng: number, type: string) => api.get(`/transport/nearby-services?lat=${lat}&lng=${lng}&type=${type}`),
}

// ── Expense ──
export const expenseAPI = {
  list: (tripId?: string) => api.get('/expense/' + (tripId ? `?trip_id=${tripId}` : '')),
  add: (data: any) => api.post('/expense/', data),
  delete: (id: string) => api.delete(`/expense/${id}`),
  summary: (tripId?: string) => api.get('/expense/summary' + (tripId ? `?trip_id=${tripId}` : '')),
  convert: (amount: number, from: string, to: string) => api.get(`/expense/convert?amount=${amount}&from_currency=${from}&to_currency=${to}`),
  currencies: () => api.get('/expense/currencies'),
}

// ── Chatbot ──
export const chatbotAPI = {
  chat: (messages: any[], tripContext?: any) => api.post('/chatbot/chat', { messages, trip_context: tripContext }),
  suggestions: (destination?: string) => api.get('/chatbot/suggestions' + (destination ? `?destination=${destination}` : '')),
}

// ── Translate ──
export const translateAPI = {
  text: (text: string, targetLang: string, sourceLang?: string) => api.post('/translate/text', { text, target_lang: targetLang, source_lang: sourceLang }),
  languages: () => api.get('/translate/languages'),
}

// ── Social ──
export const socialAPI = {
  feed: (limit = 20, offset = 0) => api.get(`/social/feed?limit=${limit}&offset=${offset}`),
  createPost: (data: any) => api.post('/social/posts', data),
  likePost: (id: string) => api.post(`/social/posts/${id}/like`),
}

// ── Maps ──
export const mapsAPI = {
  geocode: (address: string) => api.get(`/maps/geocode?address=${encodeURIComponent(address)}`),
  directions: (origin: string, dest: string, mode = 'driving') => api.get(`/maps/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&mode=${mode}`),
  pois: (lat: number, lng: number, category = 'all') => api.get(`/maps/pois?lat=${lat}&lng=${lng}&category=${category}`),
}

// ── Chatbot / Content ──
export const contentAPI = {
  blog: (destination: string, highlights: string[]) => api.post('/content/blog', { destination, trip_highlights: highlights }),
  caption: (destination: string, mood?: string, platform?: string) => api.post('/content/social-caption', { destination, mood, platform }),
  packingList: (destination: string, days: number, activities?: string[]) => api.post('/content/packing-list', { destination, duration_days: days, activities }),
}

// ── Marketplace ──
export const marketplaceAPI = {
  list: (type?: string, location?: string) => api.get(`/marketplace/${type ? `?type=${type}` : ''}${location ? `&location=${location}` : ''}`),
}

// ── Emergency ──
export const emergencyAPI = {
  contacts: (countryCode: string) => api.get(`/emergency/contacts/${countryCode}`),
  sos: (lat: number, lng: number, message?: string) => api.post(`/emergency/sos?lat=${lat}&lng=${lng}${message ? `&message=${message}` : ''}`),
  hospitals: (lat: number, lng: number) => api.get(`/emergency/nearby-hospitals?lat=${lat}&lng=${lng}`),
}

// ── Gamification ──
export const gamificationAPI = {
  badges: () => api.get('/gamification/badges'),
  leaderboard: () => api.get('/gamification/leaderboard'),
}

// ── Notifications ──
export const notificationsAPI = {
  list: (unreadOnly?: boolean) => api.get('/notifications/' + (unreadOnly ? '?unread_only=true' : '')),
  markRead: (id: string) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/mark-all-read'),
}
