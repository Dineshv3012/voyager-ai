// EmergencyPage.tsx
import { useState } from 'react'
import { emergencyAPI } from '../api/client'
import toast from 'react-hot-toast'

export function EmergencyPage() {
  const [country, setCountry] = useState('IN')
  const [contacts, setContacts] = useState<any>(null)
  const [sosLoading, setSosLoading] = useState(false)

  const getContacts = async () => {
    try { const res = await emergencyAPI.contacts(country); setContacts(res.data) } catch { toast.error('Failed') }
  }
  const triggerSOS = async () => {
    setSosLoading(true)
    try {
      await emergencyAPI.sos(13.0827, 80.2707, 'SOS from Voyager AI app')
      toast.success('SOS Alert Sent! Emergency contacts notified.')
    } catch { toast.error('SOS failed – check backend') } finally { setSosLoading(false) }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#ba1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 22 }}>emergency</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Emergency Center</h1>
      </div>

      <div style={{ background: '#fef2f2', borderRadius: 20, border: '2px solid #fecaca', padding: 28, marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#ba1a1a' }}>🚨 Emergency SOS</div>
        <p style={{ color: '#464555', margin: '0 0 18px', fontSize: 14 }}>Immediately alerts emergency contacts with your location</p>
        <button onClick={triggerSOS} disabled={sosLoading} style={{ padding: '14px 36px', borderRadius: 99, border: 'none', background: '#ba1a1a', color: 'white', fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(186,26,26,0.4)' }}>
          {sosLoading ? 'Sending SOS…' : '🆘 SEND SOS'}
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: 22, marginBottom: 18 }}>
        <h3 style={{ margin: '0 0 14px', fontWeight: 700 }}>Emergency Contacts by Country</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <select value={country} onChange={e => setCountry(e.target.value)} style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white' }}>
            {[['IN','India'],['US','United States'],['UK','United Kingdom'],['SG','Singapore'],['AE','UAE']].map(([c,n]) => <option key={c} value={c}>{n}</option>)}
          </select>
          <button onClick={getContacts} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: '#ba1a1a', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Get Contacts</button>
        </div>
        {contacts && (
          <div style={{ display: 'grid', gap: 10 }}>
            {Object.entries(contacts).filter(([k]) => k !== 'note').map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: '#fef2f2', borderRadius: 10, border: '1px solid #fecaca' }}>
                <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#464555' }}>{k.replace('_', ' ')}</span>
                <a href={`tel:${v}`} style={{ fontWeight: 800, color: '#ba1a1a', textDecoration: 'none', fontSize: 16 }}>{v as string}</a>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
        {[['local_hospital','Nearby Hospitals','#0057c2'],['local_police','Police Stations','#1a1440'],['flight_takeoff','Embassy Contacts','#008b5e'],['warning','Disaster Alerts','#914800']].map(([icon,label,color]) => (
          <button key={label} style={{ padding: '16px 12px', borderRadius: 14, border: '1px solid #e4e1ee', background: 'white', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined fill" style={{ fontSize: 28, color }}>{icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
export default EmergencyPage
