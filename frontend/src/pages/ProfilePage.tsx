import { useState } from 'react'
import { useAuthStore } from '../store'
import { useQuery } from '@tanstack/react-query'
import { tripsAPI, expenseAPI, gamificationAPI } from '../api/client'
import api from '../api/client'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ full_name: user?.full_name || '', bio: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const { data: trips } = useQuery({ queryKey: ['trips'], queryFn: () => tripsAPI.list().then(r => r.data) })
  const { data: summary } = useQuery({ queryKey: ['expense-summary'], queryFn: () => expenseAPI.summary().then(r => r.data) })
  const { data: badgesData } = useQuery({ queryKey: ['badges'], queryFn: () => gamificationAPI.badges().then(r => r.data) })
  const { data: leaderboard } = useQuery({ queryKey: ['leaderboard'], queryFn: () => gamificationAPI.leaderboard().then(r => r.data) })

  const allTrips: any[] = trips || []
  const badges: any[] = badgesData?.badges || []
  const lb: any[] = leaderboard?.leaderboard || []

  const saveProfile = async () => {
    try {
      await api.put('/auth/me', form)
      updateUser(form)
      toast.success('Profile updated!')
      setEditing(false)
    } catch { toast.error('Failed to update') }
  }

  const xpToNextLevel = ((user?.travel_level || 1) * 500) - (user?.xp_points || 0)
  const xpProgress = Math.min(100, ((user?.xp_points || 0) % 500) / 5)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px' }}>

      {/* Hero card */}
      <div style={{ background: 'linear-gradient(135deg,#1a1440,#0d2a5c)', borderRadius: 24, padding: '32px 28px', marginBottom: 24, color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=40)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg,#4d41df,#675df9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: 'white', flexShrink: 0, boxShadow: '0 4px 20px rgba(103,93,249,0.5)' }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{user?.full_name || user?.username}</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: '4px 0 10px', fontSize: 14 }}>@{user?.username} · {user?.role}</p>

            {/* XP bar */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 5 }}>
                <span>Level {user?.travel_level} Explorer</span>
                <span>{user?.xp_points} XP · {xpToNextLevel} to next level</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${xpProgress}%`, background: 'linear-gradient(90deg,#675df9,#c4c0ff)', borderRadius: 99, transition: 'width 1s ease' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {[['flight_takeoff', allTrips.length, 'Trips'], ['account_balance_wallet', `$${(summary?.total_usd || 0).toFixed(0)}`, 'Spent'], ['bolt', user?.xp_points || 0, 'XP'], ['star', user?.travel_level || 1, 'Level']].map(([icon, val, label]) => (
                <div key={label as string} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined fill" style={{ fontSize: 18, color: '#c4c0ff' }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setEditing(v => !v)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>Edit
          </button>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: 22, marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: 700 }}>Edit Profile</h3>
          <div style={{ display: 'grid', gap: 14 }}>
            {[['full_name','Full Name','text'],['bio','Bio','text']].map(([k,l,t]) => (
              <div key={k}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{l}</label>
                <input type={t} value={(form as any)[k]} onChange={e => set(k, e.target.value)} placeholder={l} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={saveProfile} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
              <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1px solid #e4e1ee', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Badges */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined fill" style={{ fontSize: 18, color: '#b65c00' }}>military_tech</span>Badges
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(70px,1fr))', gap: 10 }}>
            {badges.map((b: any, i: number) => (
              <div key={b.id} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 12, background: i < 2 ? '#fef3e7' : '#f6f2ff', border: `1px solid ${i < 2 ? '#f0c27a' : '#e3dfff'}` }}>
                <div style={{ fontSize: 24 }}>{b.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 600, marginTop: 4, color: '#464555' }}>{b.name}</div>
                <div style={{ fontSize: 10, color: '#777587' }}>+{b.xp} XP</div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined fill" style={{ fontSize: 18, color: '#4d41df' }}>leaderboard</span>Leaderboard
          </h3>
          {lb.length === 0 ? (
            <p style={{ color: '#777587', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No users ranked yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lb.slice(0, 5).map((u: any) => (
                <div key={u.rank} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: u.username === user?.username ? '#e3dfff' : 'transparent' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 99, background: u.rank <= 3 ? ['#ffd700','#c0c0c0','#cd7f32'][u.rank-1] : '#f0ecf9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: u.rank <= 3 ? 'white' : '#777587' }}>
                    {u.rank <= 3 ? ['🥇','🥈','🥉'][u.rank-1] : u.rank}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{u.username}</div>
                    <div style={{ fontSize: 11, color: '#777587' }}>Level {u.level}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: '#4d41df' }}>{u.xp} XP</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent trips */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="material-symbols-outlined fill" style={{ fontSize: 18, color: '#0057c2' }}>flight_takeoff</span>Recent Trips
        </h3>
        {allTrips.length === 0 ? (
          <p style={{ color: '#777587', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No trips yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allTrips.slice(0, 4).map((t: any) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: '#f6f2ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="material-symbols-outlined fill" style={{ fontSize: 18, color: '#4d41df' }}>flight_takeoff</span>
                  <div><div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div><div style={{ fontSize: 12, color: '#777587' }}>{t.destination}</div></div>
                </div>
                <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 99, background: 'white', border: '1px solid #e4e1ee', color: '#464555', fontWeight: 600 }}>{t.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
