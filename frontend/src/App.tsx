import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store'
import AppLayout from './components/AppLayout'
import SplashScreen from './components/SplashScreen'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import PlannerPage from './pages/PlannerPage'
import ItineraryPage from './pages/ItineraryPage'
import FlightsPage from './pages/FlightsPage'
import HotelsPage from './pages/HotelsPage'
import TransportPage from './pages/TransportPage'
import ExpensePage from './pages/ExpensePage'
import MapsPage from './pages/MapsPage'
import SocialPage from './pages/SocialPage'
import MarketplacePage from './pages/MarketplacePage'
import ChatbotPage from './pages/ChatbotPage'
import EmergencyPage from './pages/EmergencyPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import TranslatePage from './pages/TranslatePage'
import ContentPage from './pages/ContentPage'
import { useState, useEffect } from 'react'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2200)
    return () => clearTimeout(t)
  }, [])

  if (showSplash) return <SplashScreen />

  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index                element={<HomePage />} />
        <Route path="planner"       element={<PlannerPage />} />
        <Route path="itinerary"     element={<ItineraryPage />} />
        <Route path="itinerary/:id" element={<ItineraryPage />} />
        <Route path="flights"       element={<FlightsPage />} />
        <Route path="hotels"        element={<HotelsPage />} />
        <Route path="transport"     element={<TransportPage />} />
        <Route path="expense"       element={<ExpensePage />} />
        <Route path="maps"          element={<MapsPage />} />
        <Route path="social"        element={<SocialPage />} />
        <Route path="marketplace"   element={<MarketplacePage />} />
        <Route path="chat"          element={<ChatbotPage />} />
        <Route path="emergency"     element={<EmergencyPage />} />
        <Route path="translate"     element={<TranslatePage />} />
        <Route path="content"       element={<ContentPage />} />
        <Route path="profile"       element={<ProfilePage />} />
        <Route path="settings"      element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
