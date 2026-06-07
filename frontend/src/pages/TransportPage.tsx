// TransportPage.tsx
import { useState } from 'react'
import { transportAPI } from '../api/client'
import toast from 'react-hot-toast'

export function TransportPage() {
  const [form, setForm] = useState({ origin: '', destination: '', travel_date: '', type: '' })
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const search = async () => {
    if (!form.origin || !form.destination || !form.travel_date) { toast.error('Fill required fields'); return }
    setLoading(true)
    try {
      const res = await transportAPI.search(form)
      setResults(res.data.transports || [])
    } catch { toast.error('Search failed') } finally { setLoading(false) }
  }

  const TYPE_ICONS: Record<string,string> = { train:'train', bus:'directions_bus', taxi:'local_taxi', car_rental:'directions_car', bike:'pedal_bike', metro:'subway', ferry:'directions_boat' }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#2c70e2,#4d41df)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 22 }}>directions_bus</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Transport</h1>
      </div>
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e4e1ee', padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 16 }}>
          {[['origin','From','text'],['destination','To','text'],['travel_date','Date','date']].map(([k,p,t]) => (
            <div key={k}><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#464555' }}>{p}</label>
              <input type={t} value={(form as any)[k]} onChange={e => set(k, e.target.value)} placeholder={t==='text'?p:undefined} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} /></div>
          ))}
          <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#464555' }}>Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white' }}>
              <option value="">All types</option>
              {['train','bus','taxi','car_rental','bike','metro','ferry'].map(t => <option key={t}>{t}</option>)}
            </select></div>
        </div>
        <button onClick={search} disabled={loading} style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#2c70e2,#4d41df)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Searching…' : 'Search Transport'}
        </button>
      </div>
      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {results.map((t: any, i: number) => (
            <div key={i} style={{ background: 'white', borderRadius: 14, border: '1px solid #e4e1ee', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: '#f0f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined fill" style={{ color: '#2c70e2', fontSize: 22 }}>{TYPE_ICONS[t.type]||'directions_bus'}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{t.provider} <span style={{ fontSize: 12, color: '#777587', fontWeight: 400 }}>({t.type})</span></div>
                  <div style={{ fontSize: 13, color: '#464555' }}>{t.origin} → {t.destination}</div>
                  {t.departure_time && <div style={{ fontSize: 12, color: '#777587' }}>{new Date(t.departure_time).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}{t.duration_hours && ` · ${t.duration_hours}h`}</div>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>${t.price}</div>
                <button style={{ marginTop: 6, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#2c70e2', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Book</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TransportPage
