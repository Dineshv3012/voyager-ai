import { useState } from 'react'
import { mapsAPI } from '../api/client'
import toast from 'react-hot-toast'

export default function MapsPage() {
  const [tab, setTab] = useState<'directions'|'pois'|'geocode'>('directions')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [mode, setMode] = useState('driving')
  const [directions, setDirections] = useState<any>(null)
  const [address, setAddress] = useState('')
  const [geocodeResult, setGeocodeResult] = useState<any>(null)
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [poiCat, setPoiCat] = useState('all')
  const [pois, setPois] = useState<any[]>([])

  const getDirections = async () => {
    if (!origin || !destination) { toast.error('Enter origin and destination'); return }
    try {
      const res = await mapsAPI.directions(origin, destination, mode)
      setDirections(res.data)
    } catch { toast.error('Failed') }
  }

  const geocode = async () => {
    if (!address) return
    try {
      const res = await mapsAPI.geocode(address)
      setGeocodeResult(res.data)
    } catch { toast.error('Failed') }
  }

  const searchPOIs = async () => {
    if (!lat || !lng) { toast.error('Enter coordinates'); return }
    try {
      const res = await mapsAPI.pois(parseFloat(lat), parseFloat(lng), poiCat)
      setPois(res.data.pois || [])
    } catch { toast.error('Failed') }
  }

  const MODES = [['driving','directions_car'],['walking','directions_walk'],['transit','directions_transit'],['bicycling','pedal_bike']]
  const POI_CATS = ['all','restaurant','hotel','atm','hospital','pharmacy','tourist_attraction']

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#2c70e2,#0057c2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 22 }}>navigation</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Maps & Navigation</h1>
      </div>

      {/* Map placeholder */}
      <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 24, position: 'relative', height: 260, background: 'linear-gradient(135deg,#e3dfff,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e4e1ee' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="material-symbols-outlined fill" style={{ fontSize: 56, color: '#4d41df', display: 'block', marginBottom: 8 }}>map</span>
          <p style={{ color: '#4d41df', fontWeight: 600, margin: 0 }}>Interactive Map</p>
          <p style={{ color: '#777587', fontSize: 13, margin: '4px 0 0' }}>Connect Google Maps or Mapbox API key in .env for live maps</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['directions','Directions'],['geocode','Geocode'],['pois','Nearby Places']].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t as any)} style={{ padding: '8px 16px', borderRadius: 99, border: `1.5px solid ${tab===t?'#4d41df':'#e4e1ee'}`, background: tab===t?'#e3dfff':'white', color: tab===t?'#4d41df':'#464555', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{l}</button>
        ))}
      </div>

      {tab === 'directions' && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: 22 }}>
          <div style={{ display: 'grid', gap: 14, marginBottom: 16 }}>
            <input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="Origin (address or city)" style={{ padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Destination" style={{ padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {MODES.map(([m, icon]) => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '8px 4px', borderRadius: 10, border: `1.5px solid ${mode===m?'#4d41df':'#e4e1ee'}`, background: mode===m?'#e3dfff':'white', color: mode===m?'#4d41df':'#464555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                <span className="hidden-sm">{m}</span>
              </button>
            ))}
          </div>
          <button onClick={getDirections} style={{ padding: '11px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Get Directions</button>
          {directions && (
            <div style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                <div style={{ flex: 1, padding: '12px 14px', background: '#f6f2ff', borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: '#777587' }}>Distance</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{directions.distance_km} km</div>
                </div>
                <div style={{ flex: 1, padding: '12px 14px', background: '#f6f2ff', borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: '#777587' }}>Duration</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{directions.duration_mins} min</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {directions.steps?.map((s: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 99, background: '#4d41df', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i+1}</div>
                    <div><span style={{ fontWeight: 500 }}>{s.instruction}</span>{s.distance_m > 0 && <span style={{ color: '#777587', marginLeft: 8 }}>{s.distance_m}m</span>}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'geocode' && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: 22 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter address or place name" style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={geocode} style={{ padding: '11px 18px', borderRadius: 10, border: 'none', background: '#4d41df', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Search</button>
          </div>
          {geocodeResult && (
            <div style={{ padding: '14px 16px', background: '#f6f2ff', borderRadius: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{geocodeResult.formatted}</div>
              <div style={{ fontSize: 13, color: '#464555' }}>Lat: {geocodeResult.lat} · Lng: {geocodeResult.lng}</div>
              <div style={{ fontSize: 12, color: '#777587', marginTop: 2 }}>{geocodeResult.country}</div>
            </div>
          )}
        </div>
      )}

      {tab === 'pois' && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: 22 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, marginBottom: 14 }}>
            <input type="number" value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitude" style={{ padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            <input type="number" value={lng} onChange={e => setLng(e.target.value)} placeholder="Longitude" style={{ padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={searchPOIs} style={{ padding: '11px 16px', borderRadius: 10, border: 'none', background: '#4d41df', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Search</button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {POI_CATS.map(c => <button key={c} onClick={() => setPoiCat(c)} style={{ padding: '5px 12px', borderRadius: 99, border: `1.5px solid ${poiCat===c?'#4d41df':'#e4e1ee'}`, background: poiCat===c?'#e3dfff':'white', color: poiCat===c?'#4d41df':'#464555', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{c}</button>)}
          </div>
          {pois.map((p: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0ecf9' }}>
              <div><div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div><div style={{ fontSize: 12, color: '#777587' }}>{p.category}</div></div>
              <div style={{ textAlign: 'right' }}>
                {p.rating && <div style={{ fontWeight: 700, color: '#166534', fontSize: 13 }}>★ {p.rating}</div>}
                <div style={{ fontSize: 12, color: '#777587' }}>{p.distance_m}m</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
