import { useState } from 'react'
import { hotelsAPI } from '../api/client'
import toast from 'react-hot-toast'

export default function HotelsPage() {
  const [form, setForm] = useState({ city: '', check_in: '', check_out: '', guests: 1, type: '', min_stars: '' })
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const search = async () => {
    if (!form.city || !form.check_in || !form.check_out) { toast.error('Fill in city and dates'); return }
    setLoading(true)
    try {
      const res = await hotelsAPI.search({ ...form, min_stars: form.min_stars ? parseInt(form.min_stars) : undefined, type: form.type || undefined })
      setResults(res.data.hotels || [])
    } catch { toast.error('Search failed') } finally { setLoading(false) }
  }

  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#914800,#c96e1c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 22 }}>hotel</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Hotel Search</h1>
      </div>

      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e4e1ee', padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 16 }}>
          <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#464555' }}>City / Destination *</label>
            <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Bali, Paris…" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} /></div>
          <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#464555' }}>Check-in *</label>
            <input type="date" value={form.check_in} onChange={e => set('check_in', e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} /></div>
          <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#464555' }}>Check-out *</label>
            <input type="date" value={form.check_out} onChange={e => set('check_out', e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} /></div>
          <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#464555' }}>Guests</label>
            <input type="number" min={1} value={form.guests} onChange={e => set('guests', parseInt(e.target.value))} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} /></div>
          <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#464555' }}>Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white' }}>
              <option value="">All types</option>
              {['hotel','resort','hostel','homestay'].map(t => <option key={t}>{t}</option>)}
            </select></div>
          <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#464555' }}>Min Stars</label>
            <select value={form.min_stars} onChange={e => set('min_stars', e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white' }}>
              <option value="">Any</option>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}★+</option>)}
            </select></div>
        </div>
        <button onClick={search} disabled={loading} style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#914800,#c96e1c)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          {loading ? 'Searching…' : <><span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>search</span>Search Hotels</>}
        </button>
      </div>

      {results.length > 0 && (
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>{results.length} Properties Found</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {results.map((h: any) => (
              <div key={h.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', overflow: 'hidden', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as any).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; (e.currentTarget as any).style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { (e.currentTarget as any).style.boxShadow = 'none'; (e.currentTarget as any).style.transform = 'none' }}>
                <div style={{ height: 160, backgroundImage: `url(${h.images?.[0] || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80`})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '3px 8px' }}>
                    <span style={{ color: '#fbbf24', fontSize: 11, fontWeight: 700 }}>{stars(h.stars || 3)}</span>
                  </div>
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'white', borderRadius: 8, padding: '3px 8px', fontSize: 12, fontWeight: 700, color: '#1b1b24' }}>
                    {h.type}
                  </div>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{h.name}</div>
                  <div style={{ fontSize: 13, color: '#777587', marginBottom: 8 }}>📍 {h.city}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <span style={{ background: '#166534', color: 'white', padding: '2px 7px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{h.rating}</span>
                    <span style={{ fontSize: 12, color: '#777587' }}>{h.review_count?.toLocaleString()} reviews</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    {h.amenities?.slice(0, 3).map((a: string) => <span key={a} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 99, background: '#f0ecf9', color: '#4d41df' }}>{a}</span>)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 20, fontWeight: 800 }}>${h.price_per_night}</span>
                      <span style={{ fontSize: 12, color: '#777587' }}>/night</span>
                    </div>
                    <button style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#914800,#c96e1c)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Book</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
