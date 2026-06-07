import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'
import { useQuery } from '@tanstack/react-query'
import { tripsAPI, notificationsAPI } from '../api/client'

const QUICK_ACTIONS = [
  { icon: 'auto_awesome', label: 'AI Planner',  path: '/planner',   color: '#4d41df' },
  { icon: 'flight',       label: 'Flights',      path: '/flights',   color: '#0057c2' },
  { icon: 'hotel',        label: 'Hotels',       path: '/hotels',    color: '#914800' },
  { icon: 'navigation',   label: 'Maps',         path: '/maps',      color: '#2c70e2' },
  { icon: 'account_balance_wallet', label: 'Wallet', path: '/expense', color: '#008b5e' },
  { icon: 'smart_toy',    label: 'AI Chat',      path: '/chat',      color: '#675df9' },
  { icon: 'translate',    label: 'Translate',    path: '/translate', color: '#b65c00' },
  { icon: 'emergency',    label: 'Emergency',    path: '/emergency', color: '#ba1a1a' },
]

const POPULAR_DESTINATIONS = [
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80', tag: '🏖️ Beach' },
  { name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80', tag: '🏙️ City' },
  { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80', tag: '🗼 Culture' },
  { name: 'Maldives', country: 'Maldives', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80', tag: '🌊 Luxury' },
  { name: 'New York', country: 'USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80', tag: '🗽 Iconic' },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80', tag: '🏛️ Scenic' },
]

export default function HomePage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data: tripsData } = useQuery({ queryKey: ['trips'], queryFn: () => tripsAPI.list().then(r => r.data) })
  const trips: any[] = tripsData || []

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1100, margin: '0 auto' }}>

      {/* ── HERO GREETING ── */}
      <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 28, position: 'relative', background: 'linear-gradient(135deg,#1a1440,#0d2a5c)', padding: '32px 32px', color: 'white' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{greeting},</p>
          <h1 style={{ margin: '4px 0 12px', fontSize: 30, fontWeight: 800, fontFamily: "'Playfair Display',serif" }}>{user?.full_name || user?.username} ✈️</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 20 }}>Where are you exploring next?</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/planner')} style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>auto_awesome</span> Plan with AI
            </button>
            <button onClick={() => navigate('/flights')} style={{ padding: '10px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 14, backdropFilter: 'blur(10px)' }}>
              Search Flights
            </button>
          </div>
        </div>
        {/* Stats */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Trips', value: trips.length || 0, icon: 'flight_takeoff' },
            { label: 'Level', value: user?.travel_level || 1, icon: 'star' },
            { label: 'XP Points', value: user?.xp_points || 0, icon: 'bolt' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: 18, color: '#c4c0ff' }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12, marginBottom: 32 }}>
        {QUICK_ACTIONS.map(a => (
          <button key={a.path} onClick={() => navigate(a.path)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 8px', borderRadius: 14, border: '1px solid #e4e1ee', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as any).style.transform = 'translateY(-3px)'; (e.currentTarget as any).style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)' }}
            onMouseLeave={e => { (e.currentTarget as any).style.transform = 'none'; (e.currentTarget as any).style.boxShadow = 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: a.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: 22, color: a.color }}>{a.icon}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1b1b24', textAlign: 'center' }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* ── MY TRIPS ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>My Trips</h2>
        <button onClick={() => navigate('/planner')} style={{ fontSize: 13, color: '#4d41df', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>+ New Trip</button>
      </div>
      {trips.length === 0 ? (
        <div style={{ border: '2px dashed #e4e1ee', borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 32 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#c7c4d8', display: 'block', marginBottom: 8 }}>flight_takeoff</span>
          <p style={{ color: '#777587', margin: 0 }}>No trips yet. Let AI plan your next adventure!</p>
          <button onClick={() => navigate('/planner')} style={{ marginTop: 14, padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Plan with AI</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginBottom: 32 }}>
          {trips.slice(0, 6).map((trip: any) => (
            <div key={trip.id} onClick={() => navigate(`/itinerary/${trip.id}`)} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #e4e1ee', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as any).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; (e.currentTarget as any).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as any).style.boxShadow = 'none'; (e.currentTarget as any).style.transform = 'none' }}>
              <div style={{ height: 100, background: 'linear-gradient(135deg,#4d41df,#2c70e2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined fill" style={{ fontSize: 36, color: 'rgba(255,255,255,0.5)' }}>flight_takeoff</span>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{trip.title}</div>
                <div style={{ color: '#777587', fontSize: 13, marginTop: 3 }}>{trip.destination}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 99, background: '#e3dfff', color: '#4d41df', fontWeight: 600 }}>{trip.status}</span>
                  {trip.ai_generated && <span style={{ fontSize: 12, color: '#675df9' }}>✨ AI</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── POPULAR DESTINATIONS ── */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Popular Destinations</h2>
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
        {POPULAR_DESTINATIONS.map(dest => (
          <div key={dest.name} onClick={() => navigate(`/planner?destination=${dest.name}`)} style={{ flexShrink: 0, width: 180, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '1px solid #e4e1ee', position: 'relative', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as any).style.transform = 'scale(1.02)' }}
            onMouseLeave={e => { (e.currentTarget as any).style.transform = 'none' }}>
            <div style={{ height: 120, backgroundImage: `url(${dest.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ padding: '10px 12px', background: 'white' }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{dest.name}</div>
              <div style={{ fontSize: 12, color: '#777587' }}>{dest.country}</div>
              <div style={{ fontSize: 11, marginTop: 4, color: '#4d41df', fontWeight: 600 }}>{dest.tag}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
