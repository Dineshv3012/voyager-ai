import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api/client'
import { useAuthStore } from '../store'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.login(email, password)
      const { access_token, user_id, username } = res.data
      const meRes = await (await import('../api/client')).default.get('/auth/me', { headers: { Authorization: `Bearer ${access_token}` } })
      login(access_token, meRes.data)
      toast.success('Welcome back!')
      navigate('/')
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = async () => {
    setEmail('demo@voyager.ai'); setPassword('demo1234')
    setLoading(true)
    try {
      // Try login, if fails try register then login
      let res
      try {
        res = await authAPI.login('demo@voyager.ai', 'demo1234')
      } catch {
        await authAPI.register({ email: 'demo@voyager.ai', username: 'demo_traveler', full_name: 'Demo Traveler', password: 'demo1234' })
        res = await authAPI.login('demo@voyager.ai', 'demo1234')
      }
      const { access_token } = res.data
      const meRes = await (await import('../api/client')).default.get('/auth/me', { headers: { Authorization: `Bearer ${access_token}` } })
      login(access_token, meRes.data)
      toast.success('Welcome to Voyager AI!')
      navigate('/')
    } catch {
      toast.error('Demo login failed – is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1a1440,#0d1a3a,#1a1440)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#4d41df,#675df9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 40px rgba(103,93,249,0.5)' }}>
            <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 36 }}>flight_takeoff</span>
          </div>
          <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: 0 }}>Voyager AI</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>Sign in to your account</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)', padding: 28 }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[['email','Email address','email'],['password','Password','password']].map(([field,label,type]) => (
              <div key={field}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{label}</label>
                <input type={type} value={field === 'email' ? email : password}
                  onChange={e => field === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)}
                  placeholder={label} required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 14, outline: 'none' }} />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <div style={{ textAlign: 'center', margin: '16px 0', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>or</div>
          <button onClick={handleDemo} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>auto_awesome</span>
            Try Demo Account
          </button>
          <p style={{ textAlign: 'center', marginTop: 16, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            No account? <Link to="/register" style={{ color: '#c4c0ff', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
