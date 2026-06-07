import { useState } from 'react'
import { translateAPI } from '../api/client'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export default function TranslatePage() {
  const [text, setText] = useState('')
  const [targetLang, setTargetLang] = useState('fr')
  const [sourceLang, setSourceLang] = useState('auto')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { data: langsData } = useQuery({ queryKey: ['languages'], queryFn: () => translateAPI.languages().then(r => r.data) })
  const languages: any[] = langsData?.languages || []

  const translate = async () => {
    if (!text.trim()) { toast.error('Enter text to translate'); return }
    setLoading(true)
    try {
      const res = await translateAPI.text(text, targetLang, sourceLang)
      setResult(res.data)
    } catch { toast.error('Translation failed') } finally { setLoading(false) }
  }

  const QUICK_PHRASES = ['Hello', 'Thank you', 'How much?', 'Where is…?', 'Help!', 'Excuse me', 'Good morning', 'Do you speak English?']

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#0057c2,#2c70e2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 22 }}>translate</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>AI Translator</h1>
      </div>

      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e4e1ee', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e1ee', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#777587', display: 'block', marginBottom: 4 }}>From</label>
            <select value={sourceLang} onChange={e => setSourceLang(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', background: 'white' }}>
              <option value="auto">Detect language</option>
              {languages.map((l: any) => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </div>
          <div style={{ color: '#c7c4d8', fontSize: 20 }}>⇄</div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#777587', display: 'block', marginBottom: 4 }}>To</label>
            <select value={targetLang} onChange={e => setTargetLang(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', background: 'white' }}>
              {languages.map((l: any) => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e1ee' }}>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text to translate…" rows={4}
            style={{ width: '100%', padding: '10px 0', border: 'none', outline: 'none', fontSize: 15, fontFamily: 'inherit', resize: 'none', color: '#1b1b24' }} />
        </div>
        {result && (
          <div style={{ padding: '16px 20px', background: '#f6f2ff', borderBottom: '1px solid #e4e1ee' }}>
            <div style={{ fontSize: 11, color: '#777587', marginBottom: 6 }}>Translation</div>
            <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5 }}>{result.translated}</div>
            <button onClick={() => { navigator.clipboard.writeText(result.translated); toast.success('Copied!') }} style={{ marginTop: 10, padding: '5px 12px', borderRadius: 8, border: '1px solid #e4e1ee', background: 'white', color: '#4d41df', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>content_copy</span>Copy
            </button>
          </div>
        )}
        <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={translate} disabled={loading} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#0057c2,#2c70e2)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            {loading ? 'Translating…' : 'Translate'}
          </button>
        </div>
      </div>

      <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Quick Travel Phrases</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {QUICK_PHRASES.map(p => (
          <button key={p} onClick={() => { setText(p); setResult(null) }} style={{ padding: '7px 14px', borderRadius: 99, border: '1.5px solid #e4e1ee', background: 'white', color: '#464555', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as any).style.borderColor = '#4d41df'; (e.currentTarget as any).style.color = '#4d41df' }}
            onMouseLeave={e => { (e.currentTarget as any).style.borderColor = '#e4e1ee'; (e.currentTarget as any).style.color = '#464555' }}>
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
