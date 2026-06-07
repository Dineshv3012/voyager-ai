import { useState } from 'react'
import { flightsAPI } from '../api/client'
import toast from 'react-hot-toast'

export default function FlightsPage() {
  const [form, setForm] = useState({ origin: '', destination: '', departure_date: '', passengers: 1, cabin_class: 'economy' })
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [trackFlight, setTrackFlight] = useState('')
  const [trackResult, setTrackResult] = useState<any>(null)
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const search = async () => {
    if (!form.origin || !form.destination || !form.departure_date) { toast.error('Fill in all required fields'); return }
    setLoading(true)
    try {
      const res = await flightsAPI.search(form)
      setResults(res.data.flights || [])
      if (!res.data.flights?.length) toast('No flights found – showing mock data')
    } catch { toast.error('Search failed') } finally { setLoading(false) }
  }

  const track = async () => {
    if (!trackFlight.trim()) return
    try {
      const res = await flightsAPI.track(trackFlight)
      setTrackResult(res.data)
    } catch { toast.error('Flight not found') }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#0057c2,#2c70e2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 22 }}>flight</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Flight Search</h1>
      </div>

      {/* Search form */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e4e1ee', padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 16 }}>
          {[['origin','From (city/airport)','text'],['destination','To (city/airport)','text'],['departure_date','Departure Date','date']].map(([k,p,t]) => (
            <div key={k}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#464555' }}>{p}</label>
              <input type={t} value={(form as any)[k]} onChange={e => set(k, e.target.value)} placeholder={t === 'text' ? p : undefined}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#464555' }}>Cabin Class</label>
            <select value={form.cabin_class} onChange={e => set('cabin_class', e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white' }}>
              {['economy','premium_economy','business','first'].map(c => <option key={c} value={c}>{c.replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
            </select>
          </div>
        </div>
        <button onClick={search} disabled={loading} style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#0057c2,#2c70e2)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          {loading ? 'Searching…' : <><span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>search</span>Search Flights</>}
        </button>
      </div>

      {/* Flight tracker */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: 20, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="material-symbols-outlined fill" style={{ fontSize: 18, color: '#0057c2' }}>radar</span> Flight Tracker
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={trackFlight} onChange={e => setTrackFlight(e.target.value)} placeholder="Flight number e.g. AI302" style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          <button onClick={track} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0057c2', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Track</button>
        </div>
        {trackResult && (
          <div style={{ marginTop: 14, padding: '14px 16px', background: '#f0f6ff', borderRadius: 12, border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{trackResult.flight_number}</span>
              <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 99, background: trackResult.status === 'On Time' ? '#dcfce7' : '#fef3c7', color: trackResult.status === 'On Time' ? '#166534' : '#92400e', fontWeight: 600 }}>{trackResult.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <div><span style={{ color: '#777587', fontSize: 12 }}>Departure</span><br /><strong>{trackResult.departure.airport}</strong> {trackResult.departure.time}<br /><span style={{ fontSize: 12, color: '#464555' }}>Terminal {trackResult.departure.terminal} · Gate {trackResult.departure.gate}</span></div>
              <div style={{ textAlign: 'right' }}><span style={{ color: '#777587', fontSize: 12 }}>Arrival</span><br /><strong>{trackResult.arrival.airport}</strong> {trackResult.arrival.time}<br /><span style={{ fontSize: 12, color: '#464555' }}>Terminal {trackResult.arrival.terminal} · Gate {trackResult.arrival.gate}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>{results.length} Flights Found</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results.map((f: any) => (
              <div key={f.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: '#f0f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined fill" style={{ color: '#0057c2', fontSize: 22 }}>flight</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{f.airline} <span style={{ color: '#777587', fontSize: 13 }}>{f.flight_number}</span></div>
                    <div style={{ fontSize: 13, color: '#464555', marginTop: 2 }}>
                      {new Date(f.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → {new Date(f.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span style={{ color: '#777587', marginLeft: 10 }}>{Math.floor(f.duration_mins / 60)}h {f.duration_mins % 60}m</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#777587', marginTop: 2 }}>{f.stops === 0 ? 'Non-stop' : `${f.stops} stop`} · {f.cabin_class}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#1b1b24' }}>${f.price}</div>
                  <div style={{ fontSize: 12, color: '#777587' }}>{f.seats_available} seats left</div>
                  <button style={{ marginTop: 6, padding: '7px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#0057c2,#2c70e2)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
