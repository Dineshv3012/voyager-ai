import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { tripsAPI } from '../api/client'
import toast from 'react-hot-toast'

const INTERESTS = ['Culture','History','Food','Adventure','Nature','Shopping','Nightlife','Beach','Museums','Photography','Sports','Wellness']
const STYLES = [
  { value: 'budget',   icon: '💰', label: 'Budget',   desc: 'Best value for money' },
  { value: 'balanced', icon: '⚖️', label: 'Balanced', desc: 'Comfort + value mix' },
  { value: 'luxury',   icon: '✨', label: 'Luxury',   desc: 'Premium experiences' },
]

export default function PlannerPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [step, setStep]         = useState(1)
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<any>(null)
  const [form, setForm] = useState({
    destination: params.get('destination') || '',
    origin: '',
    start_date: '',
    end_date: '',
    budget: '',
    currency: 'USD',
    travelers: 1,
    travel_style: 'balanced',
    interests: [] as string[],
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const toggleInterest = (i: string) => set('interests', form.interests.includes(i) ? form.interests.filter(x => x !== i) : [...form.interests, i])

  const handleGenerate = async () => {
    if (!form.destination.trim()) { toast.error('Enter a destination'); return }
    setLoading(true)
    try {
      const res = await tripsAPI.generate({
        destination: form.destination,
        origin: form.origin || undefined,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
        budget: form.budget ? parseFloat(form.budget) : undefined,
        currency: form.currency,
        travelers: form.travelers,
        travel_style: form.travel_style,
        interests: form.interests,
      })
      setResult(res.data)
      setStep(3)
      toast.success('AI trip generated!')
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Generation failed – check backend')
    } finally {
      setLoading(false)
    }
  }

  const CURRENCIES = ['USD','INR','EUR','GBP','JPY','AUD','SGD','AED','THB']

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#4d41df,#675df9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 22 }}>auto_awesome</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>AI Trip Planner</h1>
        </div>
        <p style={{ color: '#777587', margin: 0 }}>Tell AI where you want to go — get a complete itinerary in seconds</p>
      </div>

      {/* Step indicator */}
      {step < 3 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {['Destination','Preferences'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: 99, background: step > i + 1 ? '#008b5e' : step === i + 1 ? '#4d41df' : '#e4e1ee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step >= i + 1 ? 'white' : '#777587', fontSize: 12, fontWeight: 700 }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: step === i + 1 ? '#1b1b24' : '#777587' }}>{label}</span>
              {i < 1 && <span style={{ color: '#c7c4d8', margin: '0 4px' }}>›</span>}
            </div>
          ))}
        </div>
      )}

      {/* STEP 1 — Destination */}
      {step === 1 && (
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e4e1ee', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Where do you want to go? *</label>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#777587', fontSize: 20 }}>location_on</span>
              <input value={form.destination} onChange={e => set('destination', e.target.value)} placeholder="e.g. Bali, Paris, Tokyo…" style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1px solid #e4e1ee', fontSize: 15, outline: 'none', fontFamily: 'inherit' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Flying from? (optional)</label>
            <input value={form.origin} onChange={e => set('origin', e.target.value)} placeholder="e.g. Chennai, London…" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Start Date</label>
              <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>End Date</label>
              <input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Budget (optional)</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input type="number" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="e.g. 2000" style={{ flex: 1, padding: '11px 14px', borderRadius: 12, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                <select value={form.currency} onChange={e => set('currency', e.target.value)} style={{ padding: '11px 10px', borderRadius: 12, border: '1px solid #e4e1ee', fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'white' }}>
                  {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Travelers</label>
              <input type="number" min={1} max={20} value={form.travelers} onChange={e => set('travelers', parseInt(e.target.value))} style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            </div>
          </div>
          <button onClick={() => { if (!form.destination.trim()) { toast.error('Enter a destination'); return } setStep(2) }} style={{ padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Next: Preferences →
          </button>
        </div>
      )}

      {/* STEP 2 — Preferences */}
      {step === 2 && (
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e4e1ee', padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Travel Style</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {STYLES.map(s => (
                <button key={s.value} onClick={() => set('travel_style', s.value)} style={{ padding: '14px 10px', borderRadius: 14, border: `2px solid ${form.travel_style === s.value ? '#4d41df' : '#e4e1ee'}`, background: form.travel_style === s.value ? '#e3dfff' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: form.travel_style === s.value ? '#4d41df' : '#1b1b24' }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: '#777587', marginTop: 2 }}>{s.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Interests (select all that apply)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {INTERESTS.map(i => (
                <button key={i} onClick={() => toggleInterest(i)} style={{ padding: '7px 14px', borderRadius: 99, border: `1.5px solid ${form.interests.includes(i) ? '#4d41df' : '#e4e1ee'}`, background: form.interests.includes(i) ? '#e3dfff' : 'white', color: form.interests.includes(i) ? '#4d41df' : '#464555', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #e4e1ee', background: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
            <button onClick={handleGenerate} disabled={loading} style={{ flex: 2, padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? (<><span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Generating…</>) : (<><span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>auto_awesome</span>Generate AI Itinerary</>)}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Result */}
      {step === 3 && result && (
        <div>
          <div style={{ background: 'linear-gradient(135deg,#1a1440,#0d2a5c)', borderRadius: 20, padding: '24px 28px', marginBottom: 20, color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: 20, color: '#c4c0ff' }}>auto_awesome</span>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Your AI Itinerary is Ready!</span>
            </div>
            <h2 style={{ margin: '0 0 4px', fontSize: 22, fontFamily: "'Playfair Display',serif" }}>Trip to {form.destination}</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: 13 }}>{result.itinerary?.length} days · {form.travelers} traveler(s) · {form.travel_style} style</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button onClick={() => navigate(`/itinerary/${result.trip_id}`)} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>View Full Itinerary</button>
              <button onClick={() => { setStep(1); setResult(null) }} style={{ padding: '9px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.25)', background: 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Plan Another</button>
            </div>
          </div>
          {result.itinerary?.map((day: any) => (
            <div key={day.day} style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', marginBottom: 14, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', background: '#f6f2ff', borderBottom: '1px solid #e4e1ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: 15, color: '#4d41df' }}>Day {day.day}</span>
                  <span style={{ color: '#777587', fontSize: 13, marginLeft: 10 }}>{day.date}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1b1b24' }}>{day.theme}</span>
              </div>
              <div style={{ padding: '14px 20px' }}>
                {day.activities?.map((act: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: 14, marginBottom: idx < day.activities.length - 1 ? 14 : 0, paddingBottom: idx < day.activities.length - 1 ? 14 : 0, borderBottom: idx < day.activities.length - 1 ? '1px solid #f0ecf9' : 'none' }}>
                    <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 46 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#4d41df' }}>{act.time}</div>
                      <div style={{ width: 1, height: 24, background: '#e4e1ee', margin: '4px auto 0' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{act.title}</div>
                      <div style={{ color: '#777587', fontSize: 13, marginTop: 2 }}>📍 {act.place}</div>
                      {act.tips && <div style={{ fontSize: 12, color: '#008b5e', marginTop: 4, background: '#f0fdf4', padding: '4px 8px', borderRadius: 6 }}>💡 {act.tips}</div>}
                      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                        {act.duration_mins && <span style={{ fontSize: 11, color: '#777587' }}>⏱ {act.duration_mins}min</span>}
                        {act.cost_estimate > 0 && <span style={{ fontSize: 11, color: '#777587' }}>💵 ~${act.cost_estimate}</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {day.meals && (
                  <div style={{ marginTop: 12, padding: '10px 12px', background: '#fef9f0', borderRadius: 10, border: '1px solid #f0e6c8' }}>
                    <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4, color: '#914800' }}>🍽 Meals</div>
                    <div style={{ fontSize: 12, color: '#464555', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {day.meals.breakfast && <span>🌅 {day.meals.breakfast}</span>}
                      {day.meals.lunch && <span>☀️ {day.meals.lunch}</span>}
                      {day.meals.dinner && <span>🌙 {day.meals.dinner}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
