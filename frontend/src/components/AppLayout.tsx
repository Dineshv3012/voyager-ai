import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore, useAppStore } from '../store'

const NAV_ITEMS = [
  { path: '/',           icon: 'home',                  label: 'Home' },
  { path: '/planner',    icon: 'auto_awesome',           label: 'AI Planner' },
  { path: '/itinerary',  icon: 'map',                    label: 'Itinerary' },
  { path: '/flights',    icon: 'flight',                 label: 'Flights' },
  { path: '/hotels',     icon: 'hotel',                  label: 'Hotels' },
  { path: '/transport',  icon: 'directions_bus',         label: 'Transport' },
  { path: '/expense',    icon: 'account_balance_wallet', label: 'Expenses' },
  { path: '/maps',       icon: 'navigation',             label: 'Maps & GPS' },
  { path: '/social',     icon: 'rss_feed',               label: 'Social Feed' },
  { path: '/marketplace',icon: 'storefront',             label: 'Marketplace' },
  { path: '/chat',       icon: 'smart_toy',              label: 'AI Chatbot' },
  { path: '/translate',  icon: 'translate',              label: 'Translator' },
  { path: '/content',    icon: 'edit_note',              label: 'Content AI' },
  { path: '/emergency',  icon: 'emergency',              label: 'Emergency' },
  { path: '/profile',    icon: 'manage_accounts',        label: 'Profile' },
  { path: '/settings',   icon: 'settings',               label: 'Settings' },
]

const BOTTOM_TABS = [
  { path: '/',        icon: 'home',                  label: 'Home' },
  { path: '/planner', icon: 'auto_awesome',          label: 'Planner' },
  { path: '/maps',    icon: 'navigation',            label: 'Maps' },
  { path: '/expense', icon: 'account_balance_wallet',label: 'Wallet' },
  { path: '/profile', icon: 'person',                label: 'Profile' },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const isActive = (path: string) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const currentPage = NAV_ITEMS.find(n => isActive(n.path))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* ── TOP NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 60, display: 'flex', alignItems: 'center', padding: '0 20px',
        justifyContent: 'space-between',
        background: 'rgba(252,248,255,0.93)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(199,196,216,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 6, borderRadius: 8, color: '#464555' }}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <a href="/" onClick={e => { e.preventDefault(); navigate('/') }} style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#4d41df,#675df9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 18 }}>flight_takeoff</span>
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, background: 'linear-gradient(135deg,#4d41df,#2c70e2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Voyager AI</span>
          </a>
          {currentPage && (
            <span style={{ fontSize: 13, color: '#777587', marginLeft: 4 }}>/ {currentPage.label}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/chat')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 10, color: '#464555', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>smart_toy</span>
            <span className="hidden-mobile">AI Chat</span>
          </button>
          <button onClick={() => navigate('/planner')} style={{ padding: '7px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, boxShadow: '0 2px 8px rgba(77,65,223,0.25)' }}>
            <span className="material-symbols-outlined fill" style={{ fontSize: 16 }}>auto_awesome</span>
            <span className="hidden-mobile">Plan Trip</span>
          </button>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowUserMenu(v => !v)} style={{ width: 34, height: 34, borderRadius: 99, background: 'linear-gradient(135deg,#4d41df,#675df9)', border: 'none', cursor: 'pointer', color: 'white', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </button>
            {showUserMenu && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: 'white', borderRadius: 12, border: '1px solid #e4e1ee', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: 8, minWidth: 180, zIndex: 200 }}>
                <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid #e4e1ee', marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.full_name || user?.username}</div>
                  <div style={{ fontSize: 12, color: '#777587' }}>Level {user?.travel_level} · {user?.xp_points} XP</div>
                </div>
                {[['profile','manage_accounts','Profile'], ['settings','settings','Settings']].map(([path, icon, label]) => (
                  <button key={path} onClick={() => { navigate('/'+path); setShowUserMenu(false) }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: '#1b1b24' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>{label}
                  </button>
                ))}
                <button onClick={() => { logout(); navigate('/login') }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: '#ba1a1a' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div style={{ display: 'flex', flex: 1, marginTop: 60, overflow: 'hidden' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: sidebarOpen ? 240 : 0, flexShrink: 0,
          overflow: 'hidden', transition: 'width 0.25s ease',
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(199,196,216,0.4)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '12px 10px', overflowY: 'auto', flex: 1 }}>
            {NAV_ITEMS.map(item => {
              const active = isActive(item.path)
              return (
                <button key={item.path} onClick={() => navigate(item.path)} style={{
                  display: 'flex', alignItems: 'center', gap: 11, width: '100%',
                  padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: active ? '#e3dfff' : 'transparent',
                  color: active ? '#4d41df' : '#464555',
                  fontWeight: active ? 600 : 500, fontSize: 13.5, textAlign: 'left',
                  marginBottom: 2, transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}>
                  <span className={`material-symbols-outlined${active ? ' fill' : ''}`} style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                  {item.label}
                </button>
              )
            })}
          </div>
          <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(199,196,216,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
              <div style={{ width: 32, height: 32, borderRadius: 99, background: 'linear-gradient(135deg,#4d41df,#675df9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.full_name || user?.username}</div>
                <div style={{ fontSize: 11, color: '#777587' }}>Level {user?.travel_level}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
          <Outlet />
        </main>
      </div>

      {/* ── BOTTOM NAV (mobile) ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(252,248,255,0.95)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(199,196,216,0.4)',
        padding: '8px 0 14px', display: 'none',
      }} id="bottom-nav-bar">
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {BOTTOM_TABS.map(tab => {
            const active = isActive(tab.path)
            return (
              <button key={tab.path} onClick={() => navigate(tab.path)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '4px 12px', borderRadius: 12, border: 'none', background: 'none', cursor: 'pointer',
                color: active ? '#4d41df' : '#777587', fontSize: 11, fontWeight: active ? 600 : 500,
              }}>
                <div style={{ padding: '3px 14px', borderRadius: 16, background: active ? '#e3dfff' : 'transparent', transition: 'all 0.2s' }}>
                  <span className={`material-symbols-outlined${active ? ' fill' : ''}`} style={{ fontSize: 22, display: 'block' }}>{tab.icon}</span>
                </div>
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #bottom-nav-bar { display: block !important; }
          .hidden-mobile { display: none !important; }
          aside { display: none !important; }
        }
      `}</style>
    </div>
  )
}
