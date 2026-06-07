import { useState } from 'react'
import { contentAPI } from '../api/client'
import toast from 'react-hot-toast'

export default function ContentPage() {
  const [tab, setTab] = useState<'blog'|'caption'|'packing'>('blog')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const [dest, setDest] = useState('')
  const [highlights, setHighlights] = useState('')
  const [mood, setMood] = useState('excited')
  const [platform, setPlatform] = useState('instagram')
  const [days, setDays] = useState(7)
  const [activities, setActivities] = useState('')

  const generate = async () => {
    if (!dest.trim()) { toast.error('Enter a destination'); return }
    setLoading(true)
    try {
      let res
      if (tab === 'blog') res = await contentAPI.blog(dest, highlights.split(',').map(s => s.trim()).filter(Boolean))
      else if (tab === 'caption') res = await contentAPI.caption(dest, mood, platform)
      else res = await contentAPI.packingList(dest, days, activities.split(',').map(s => s.trim()).filter(Boolean))
      setResult(res.data)
    } catch { toast.error('Generation failed') } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#675df9,#4d41df)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 22 }}>edit_note</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>AI Content Creator</h1>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[['blog','Travel Blog'],['caption','Social Caption'],['packing','Packing List']].map(([t,l]) => (
          <button key={t} onClick={() => { setTab(t as any); setResult(null) }} style={{ flex: 1, padding: '10px 8px', borderRadius: 12, border: `1.5px solid ${tab===t?'#4d41df':'#e4e1ee'}`, background: tab===t?'#e3dfff':'white', color: tab===t?'#4d41df':'#464555', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{l}</button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: 22, marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Destination *</label>
            <input value={dest} onChange={e => setDest(e.target.value)} placeholder="e.g. Bali, Paris, Tokyo" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          {tab === 'blog' && <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Trip Highlights (comma separated)</label>
            <input value={highlights} onChange={e => setHighlights(e.target.value)} placeholder="e.g. Ubud rice terraces, beach sunset, local food tour" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          </div>}
          {tab === 'caption' && <>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Mood</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['excited','relaxed','adventurous','nostalgic','grateful'].map(m => <button key={m} onClick={() => setMood(m)} style={{ flex: 1, padding: '7px 4px', borderRadius: 10, border: `1.5px solid ${mood===m?'#4d41df':'#e4e1ee'}`, background: mood===m?'#e3dfff':'white', color: mood===m?'#4d41df':'#464555', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>{m}</button>)}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Platform</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['instagram','twitter','facebook','linkedin'].map(p => <button key={p} onClick={() => setPlatform(p)} style={{ flex: 1, padding: '7px 4px', borderRadius: 10, border: `1.5px solid ${platform===p?'#4d41df':'#e4e1ee'}`, background: platform===p?'#e3dfff':'white', color: platform===p?'#4d41df':'#464555', fontWeight: 600, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize' }}>{p}</button>)}
              </div>
            </div>
          </>}
          {tab === 'packing' && <>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Trip Duration (days)</label>
              <input type="number" min={1} value={days} onChange={e => setDays(parseInt(e.target.value))} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Activities (comma separated)</label>
              <input value={activities} onChange={e => setActivities(e.target.value)} placeholder="e.g. hiking, swimming, business meetings" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            </div>
          </>}
          <button onClick={generate} disabled={loading} style={{ padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#4d41df,#675df9)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? 'Generating…' : <><span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>auto_awesome</span>Generate with AI</>}
          </button>
        </div>
      </div>

      {result && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>
              {tab === 'blog' ? result.title : tab === 'caption' ? 'Your Caption' : 'Packing List'}
            </h3>
            <button onClick={() => { navigator.clipboard.writeText(tab === 'blog' ? result.content : tab === 'caption' ? result.caption : JSON.stringify(result.packing_list, null, 2)); toast.success('Copied!') }} style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid #e4e1ee', background: '#f6f2ff', color: '#4d41df', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Copy</button>
          </div>
          {tab === 'blog' && <p style={{ lineHeight: 1.7, color: '#1b1b24', whiteSpace: 'pre-wrap' }}>{result.content}</p>}
          {tab === 'caption' && <div style={{ padding: '14px', background: '#f6f2ff', borderRadius: 10, fontSize: 15, lineHeight: 1.6 }}>{result.caption}</div>}
          {tab === 'packing' && result.packing_list && (
            <div style={{ display: 'grid', gap: 16 }}>
              {Object.entries(result.packing_list).map(([cat, items]) => (
                <div key={cat}><h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#4d41df', textTransform: 'capitalize' }}>{cat}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(items as string[]).map((item: string) => <span key={item} style={{ padding: '4px 10px', borderRadius: 8, background: '#f0ecf9', border: '1px solid #e3dfff', fontSize: 13 }}>{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
