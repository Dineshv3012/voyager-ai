import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api/client'
import { useAuthStore } from '../store'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', username: '', full_name: '', password: '' })
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      const { access_token } = res.data
      const meRes = await (await import('../api/client')).default.get('/auth/me', { headers: { Authorization: `Bearer ${access_token}` } })
      login(access_token, meRes.data)
      toast.success('Account created! Welcome to Voyager AI!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    ['email', 'Email address', 'email'],
    ['username', 'Username', 'text'],
    ['full_name', 'Full name', 'text'],
    ['password', 'Password', 'password'],
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1a1440,#0d1a3a,#1a1440)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#4d41df,#675df9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 0 30px rgba(103,93,249,0.5)' }}>
            <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 30 }}>flight_takeoff</span>
          </div>
          <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0 }}>Create Account</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>Join the Voyager AI community</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)', padding: 28 }}>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {fields.map(([key, label, type]) => (
              <div key={key}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{label}</label>
                <input type={type} value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={label} required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 14, outline: 'none' }} />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 16, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            Already have an account? <Link to="/login" style={{ color: '#c4c0ff', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
