import { useState, useRef, useEffect } from 'react'
import { chatbotAPI } from '../api/client'
import { useQuery } from '@tanstack/react-query'

interface Message { role: 'user' | 'assistant'; content: string; time: string }

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Voyager AI, your personal travel assistant. Ask me anything about destinations, flights, hotels, travel tips, or let me help you plan your next adventure! ✈️", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: suggestionsData } = useQuery({ queryKey: ['chat-suggestions'], queryFn: () => chatbotAPI.suggestions().then(r => r.data) })
  const suggestions: string[] = suggestionsData?.suggestions || []

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(m => [...m, { role: 'user', content: msg, time }])
    setLoading(true)
    try {
      const res = await chatbotAPI.chat([...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: msg }])
      setMessages(m => [...m, { role: 'assistant', content: res.data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: "Sorry, I couldn't connect to the AI service. Please check the backend is running.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    } finally { setLoading(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', maxWidth: 760, margin: '0 auto', padding: '0 0' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #e4e1ee', background: 'white', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#4d41df,#675df9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 24 }}>smart_toy</span>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Voyager AI Assistant</div>
          <div style={{ fontSize: 12, color: '#008b5e', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#008b5e' }} /> Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, background: '#f6f2ff' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: 99, background: 'linear-gradient(135deg,#4d41df,#675df9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 16 }}>smart_toy</span>
              </div>
            )}
            <div style={{ maxWidth: '72%' }}>
              <div style={{
                padding: '11px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? 'linear-gradient(135deg,#4d41df,#675df9)' : 'white',
                color: msg.role === 'user' ? 'white' : '#1b1b24',
                fontSize: 14, lineHeight: 1.55,
                border: msg.role === 'assistant' ? '1px solid #e4e1ee' : 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}>
                {msg.content}
              </div>
              <div style={{ fontSize: 10, color: '#c7c4d8', marginTop: 3, textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ width: 32, height: 32, borderRadius: 99, background: 'linear-gradient(135deg,#4d41df,#675df9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 16 }}>smart_toy</span>
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'white', border: '1px solid #e4e1ee', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#c7c4d8', animation: `bounce 1s ${d}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && suggestions.length > 0 && (
        <div style={{ padding: '10px 24px', background: 'white', borderTop: '1px solid #e4e1ee' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#777587', marginBottom: 8 }}>Quick suggestions:</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {suggestions.slice(0, 4).map((s: string) => (
              <button key={s} onClick={() => send(s)} style={{ padding: '6px 12px', borderRadius: 99, border: '1.5px solid #e4e1ee', background: 'white', color: '#4d41df', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as any).style.borderColor = '#4d41df'; (e.currentTarget as any).style.background = '#e3dfff' }}
                onMouseLeave={e => { (e.currentTarget as any).style.borderColor = '#e4e1ee'; (e.currentTarget as any).style.background = 'white' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '14px 24px', background: 'white', borderTop: '1px solid #e4e1ee', display: 'flex', gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask me anything about travel…" disabled={loading}
          style={{ flex: 1, padding: '11px 16px', borderRadius: 12, border: '1.5px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#f6f2ff', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = '#4d41df'} onBlur={e => e.target.style.borderColor = '#e4e1ee'} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 44, height: 44, borderRadius: 12, border: 'none', background: input.trim() && !loading ? 'linear-gradient(135deg,#4d41df,#675df9)' : '#e4e1ee', color: input.trim() && !loading ? 'white' : '#c7c4d8', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          <span className="material-symbols-outlined fill" style={{ fontSize: 20 }}>send</span>
        </button>
      </div>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0.7)}40%{transform:scale(1)} }`}</style>
    </div>
  )
}
