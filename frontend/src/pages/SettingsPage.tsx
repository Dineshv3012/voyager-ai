import { useState } from 'react'
import { useAuthStore } from '../store'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [currency, setCurrency] = useState(user?.role ? 'USD' : 'USD')
  const [language, setLanguage] = useState('en')
  const [notifications, setNotifications] = useState({ email: true, push: true, deals: false })
  const [darkMode, setDarkMode] = useState(false)
  const [offline, setOffline] = useState(false)

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} style={{ width: 48, height: 26, borderRadius: 99, border: 'none', background: value ? 'linear-gradient(135deg,#4d41df,#675df9)' : '#e4e1ee', cursor: 'pointer', position: 'relative', transition: 'all 0.25s', padding: 0 }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: value ? 25 : 3, transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
    </button>
  )

  const Section = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0ecf9', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="material-symbols-outlined fill" style={{ fontSize: 18, color: '#4d41df' }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
      </div>
      <div style={{ padding: '4px 0' }}>{children}</div>
    </div>
  )

  const Row = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 20px', borderBottom: '1px solid #f9f8ff' }}>
      <div><div style={{ fontWeight: 500, fontSize: 14 }}>{label}</div>{desc && <div style={{ fontSize: 12, color: '#777587', marginTop: 1 }}>{desc}</div>}</div>
      {children}
    </div>
  )

  const handleLogout = () => { logout(); navigate('/login'); toast.success('Signed out') }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#464555,#777587)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 22 }}>settings</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Settings</h1>
      </div>

      <Section icon="person" title="Account">
        <Row label="Email" desc={user?.email}><span style={{ fontSize: 13, color: '#777587' }}>Verified</span></Row>
        <Row label="Username"><span style={{ fontSize: 13, color: '#777587' }}>@{user?.username}</span></Row>
        <Row label="Account Type"><span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 99, background: '#e3dfff', color: '#4d41df', fontWeight: 600 }}>{user?.role}</span></Row>
      </Section>

      <Section icon="language" title="Language & Region">
        <Row label="Default Currency">
          <select value={currency} onChange={e => { setCurrency(e.target.value); toast.success('Currency updated') }} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e4e1ee', fontSize: 13, outline: 'none', background: 'white', fontFamily: 'inherit' }}>
            {['USD','INR','EUR','GBP','JPY','AUD','SGD','AED','THB'].map(c => <option key={c}>{c}</option>)}
          </select>
        </Row>
        <Row label="Language">
          <select value={language} onChange={e => { setLanguage(e.target.value); toast.success('Language updated') }} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e4e1ee', fontSize: 13, outline: 'none', background: 'white', fontFamily: 'inherit' }}>
            {[['en','English'],['hi','Hindi'],['ta','Tamil'],['fr','French'],['de','German'],['ja','Japanese'],['ko','Korean'],['ar','Arabic']].map(([c,n]) => <option key={c} value={c}>{n}</option>)}
          </select>
        </Row>
      </Section>

      <Section icon="notifications" title="Notifications">
        <Row label="Email Notifications" desc="Trip updates and alerts"><Toggle value={notifications.email} onChange={() => { setNotifications(n => ({ ...n, email: !n.email })); toast.success('Updated') }} /></Row>
        <Row label="Push Notifications" desc="Real-time alerts on device"><Toggle value={notifications.push} onChange={() => { setNotifications(n => ({ ...n, push: !n.push })); toast.success('Updated') }} /></Row>
        <Row label="Travel Deals" desc="Flight and hotel deals"><Toggle value={notifications.deals} onChange={() => { setNotifications(n => ({ ...n, deals: !n.deals })); toast.success('Updated') }} /></Row>
      </Section>

      <Section icon="devices" title="App Preferences">
        <Row label="Dark Mode" desc="Switch to dark theme"><Toggle value={darkMode} onChange={() => { setDarkMode(v => !v); toast.success('Coming soon – Dark Mode') }} /></Row>
        <Row label="Offline Mode" desc="Download maps and data for offline use"><Toggle value={offline} onChange={() => { setOffline(v => !v); toast.success(offline ? 'Offline mode disabled' : 'Offline mode enabled') }} /></Row>
      </Section>

      <Section icon="lock" title="Privacy & Security">
        <Row label="Two-Factor Authentication"><button onClick={() => toast.success('MFA setup coming soon')} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e4e1ee', background: 'white', color: '#4d41df', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Enable</button></Row>
        <Row label="Connected Devices"><button onClick={() => toast('No other devices')} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e4e1ee', background: 'white', color: '#464555', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Manage</button></Row>
        <Row label="Delete Account"><button onClick={() => toast.error('Please contact support')} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', color: '#ba1a1a', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Delete</button></Row>
      </Section>

      <Section icon="info" title="About">
        <Row label="Version"><span style={{ fontSize: 13, color: '#777587' }}>Voyager AI v1.0.0</span></Row>
        <Row label="Backend API"><span style={{ fontSize: 13, color: '#008b5e' }}>FastAPI · Connected</span></Row>
        <Row label="AI Provider"><span style={{ fontSize: 13, color: '#777587' }}>Gemini / Groq / Mock</span></Row>
      </Section>

      <button onClick={handleLogout} style={{ width: '100%', padding: '14px', borderRadius: 14, border: '1px solid #fecaca', background: '#fef2f2', color: '#ba1a1a', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>Sign Out
      </button>
    </div>
  )
}
