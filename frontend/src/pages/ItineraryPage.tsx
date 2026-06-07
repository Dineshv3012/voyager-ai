import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tripsAPI } from '../api/client'
import { useState } from 'react'

export default function ItineraryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeDay, setActiveDay] = useState(1)

  const { data: trips } = useQuery({ queryKey: ['trips'], queryFn: () => tripsAPI.list().then(r => r.data) })
  const { data: trip } = useQuery({
    queryKey: ['trip', id], enabled: !!id,
    queryFn: () => tripsAPI.get(id!).then(r => r.data),
  })

  const allTrips: any[] = trips || []
  const currentTrip: any = id ? trip : null

  if (id && !trip) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e4e1ee', borderTopColor: '#4d41df', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
      <p style={{ color: '#777587' }}>Loading itinerary…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // Trip list view
  if (!id) return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>My Itineraries</h1>
        <button onClick={() => navigate('/planner')} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="material-symbols-outlined fill" style={{ fontSize: 16 }}>add</span> New Trip
        </button>
      </div>
      {allTrips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '2px dashed #e4e1ee', borderRadius: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#c7c4d8', display: 'block', marginBottom: 12 }}>map</span>
          <p style={{ color: '#777587', marginBottom: 16 }}>No itineraries yet</p>
          <button onClick={() => navigate('/planner')} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Plan with AI</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {allTrips.map((t: any) => (
            <div key={t.id} onClick={() => navigate(`/itinerary/${t.id}`)} style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: '18px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget as any).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
              onMouseLeave={e => (e.currentTarget as any).style.boxShadow = 'none'}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#4d41df,#675df9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 24 }}>flight_takeoff</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.title}</div>
                  <div style={{ color: '#777587', fontSize: 13 }}>{t.destination} · {t.itinerary?.length || 0} days</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {t.ai_generated && <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, background: '#e3dfff', color: '#4d41df', fontWeight: 600 }}>✨ AI</span>}
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, background: t.status === 'completed' ? '#dcfce7' : t.status === 'active' ? '#dbeafe' : '#f0ecf9', color: t.status === 'completed' ? '#166534' : t.status === 'active' ? '#1e40af' : '#4d41df', fontWeight: 600 }}>{t.status}</span>
                <span className="material-symbols-outlined" style={{ color: '#c7c4d8', fontSize: 20 }}>chevron_right</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // Single trip detail
  const itinerary: any[] = currentTrip?.itinerary || []
  const days = itinerary.length

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '28px 24px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1a1440,#0d2a5c)', borderRadius: 20, padding: '24px 28px', marginBottom: 24, color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <button onClick={() => navigate('/itinerary')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, marginBottom: 12 }}>← All Trips</button>
          <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, fontFamily: "'Playfair Display',serif" }}>{currentTrip.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', margin: 0, fontSize: 14 }}>📍 {currentTrip.destination} · {days} days</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            {[
              { icon: 'calendar_month', label: currentTrip.start_date || 'Flexible dates' },
              { icon: 'account_balance_wallet', label: currentTrip.budget ? `${currentTrip.currency} ${currentTrip.budget?.toLocaleString()}` : 'No budget set' },
              { icon: currentTrip.ai_generated ? 'auto_awesome' : 'edit', label: currentTrip.ai_generated ? 'AI Generated' : 'Manual' },
            ].map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', padding: '5px 12px', borderRadius: 20, backdropFilter: 'blur(10px)' }}>
                <span className="material-symbols-outlined fill" style={{ fontSize: 14, color: '#c4c0ff' }}>{b.icon}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day tabs */}
      {days > 0 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20, scrollbarWidth: 'none' }}>
          {itinerary.map((day: any) => (
            <button key={day.day} onClick={() => setActiveDay(day.day)} style={{ flexShrink: 0, padding: '8px 18px', borderRadius: 99, border: `1.5px solid ${activeDay === day.day ? '#4d41df' : '#e4e1ee'}`, background: activeDay === day.day ? '#e3dfff' : 'white', color: activeDay === day.day ? '#4d41df' : '#464555', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Day {day.day}
              {day.date && <span style={{ fontSize: 11, color: activeDay === day.day ? '#675df9' : '#c7c4d8', marginLeft: 6 }}>{day.date}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Active day */}
      {itinerary.filter(d => d.day === activeDay).map((day: any) => (
        <div key={day.day}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{day.theme}</h2>
              {day.daily_budget && <span style={{ fontSize: 13, color: '#777587' }}>Est. daily budget: ${day.daily_budget}</span>}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', overflow: 'hidden', marginBottom: 20 }}>
            {day.activities?.map((act: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', gap: 0, borderBottom: idx < day.activities.length - 1 ? '1px solid #f0ecf9' : 'none' }}>
                <div style={{ width: 80, flexShrink: 0, padding: '18px 0 18px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#4d41df' }}>{act.time}</div>
                  {act.duration_mins && <div style={{ fontSize: 11, color: '#777587', marginTop: 3 }}>{act.duration_mins}m</div>}
                </div>
                <div style={{ width: 2, background: '#f0ecf9', margin: '14px 16px', flexShrink: 0 }} />
                <div style={{ flex: 1, padding: '16px 20px 16px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{act.title}</div>
                      <div style={{ color: '#777587', fontSize: 13, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined fill" style={{ fontSize: 14 }}>location_on</span>{act.place}
                      </div>
                    </div>
                    {act.cost_estimate > 0 && (
                      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 99, background: '#f0fdf4', color: '#008b5e', fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>${act.cost_estimate}</span>
                    )}
                  </div>
                  {act.tips && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#464555', background: '#f6f2ff', padding: '6px 10px', borderRadius: 8, border: '1px solid #e3dfff' }}>
                      💡 {act.tips}
                    </div>
                  )}
                  <span style={{ display: 'inline-block', marginTop: 8, fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#f0ecf9', color: '#464555' }}>{act.category}</span>
                </div>
              </div>
            ))}
          </div>
          {day.meals && (
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e4e1ee', padding: '16px 20px', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined fill" style={{ fontSize: 18, color: '#914800' }}>restaurant</span> Meals
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[['🌅 Breakfast', day.meals.breakfast], ['☀️ Lunch', day.meals.lunch], ['🌙 Dinner', day.meals.dinner]].map(([label, val]) => val ? (
                  <div key={label as string} style={{ padding: '10px 12px', background: '#fef9f0', borderRadius: 10, border: '1px solid #f0e6c8' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#914800' }}>{label}</div>
                    <div style={{ fontSize: 13, marginTop: 3 }}>{val}</div>
                  </div>
                ) : null)}
              </div>
            </div>
          )}
          {day.accommodation && (
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e4e1ee', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: 22, color: '#0057c2' }}>hotel</span>
              <div><div style={{ fontWeight: 600, fontSize: 14 }}>Accommodation</div><div style={{ color: '#777587', fontSize: 13 }}>{day.accommodation}</div></div>
            </div>
          )}
        </div>
      ))}
      {days === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#777587' }}>
          <p>No itinerary data yet.</p>
          <button onClick={() => navigate('/planner')} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Generate with AI</button>
        </div>
      )}
    </div>
  )
}
