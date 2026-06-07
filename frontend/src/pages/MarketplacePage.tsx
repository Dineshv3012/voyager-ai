import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { marketplaceAPI } from '../api/client'

const TYPES = ['All','tour','guide','experience','package']

export default function MarketplacePage() {
  const [type, setType] = useState('')
  const [location, setLocation] = useState('')

  const { data, refetch } = useQuery({
    queryKey: ['marketplace', type, location],
    queryFn: () => marketplaceAPI.list(type || undefined, location || undefined).then(r => r.data),
  })
  const listings: any[] = Array.isArray(data) ? data : []

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#b65c00,#e07b20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 22 }}>storefront</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Travel Marketplace</h1>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Search by location…" style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
        <button onClick={() => refetch()} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: '#b65c00', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Search</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        {TYPES.map(t => <button key={t} onClick={() => setType(t === 'All' ? '' : t)} style={{ padding: '7px 14px', borderRadius: 99, border: `1.5px solid ${(type===t||(t==='All'&&!type))?'#b65c00':'#e4e1ee'}`, background: (type===t||(t==='All'&&!type))?'#fef3e7':'white', color: (type===t||(t==='All'&&!type))?'#b65c00':'#464555', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t}</button>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {listings.map((l: any) => (
          <div key={l.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', overflow: 'hidden', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as any).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; (e.currentTarget as any).style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { (e.currentTarget as any).style.boxShadow = 'none'; (e.currentTarget as any).style.transform = 'none' }}>
            <div style={{ height: 150, background: 'linear-gradient(135deg,#b65c00,#e07b20)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }}>storefront</span>
              <div style={{ position: 'absolute', top: 10, right: 10, background: 'white', borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 700, color: '#b65c00' }}>{l.type}</div>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{l.title}</div>
              <div style={{ fontSize: 13, color: '#777587', marginBottom: 8 }}>📍 {l.location}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <span style={{ background: '#166534', color: 'white', padding: '2px 7px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>★ {l.rating?.toFixed(1)}</span>
                <span style={{ fontSize: 12, color: '#777587' }}>{l.review_count} reviews</span>
                {l.duration && <span style={{ fontSize: 12, color: '#777587' }}>· {l.duration}</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><span style={{ fontSize: 20, fontWeight: 800 }}>${l.price}</span><span style={{ fontSize: 12, color: '#777587' }}>/person</span></div>
                <button style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#b65c00,#e07b20)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Book</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
