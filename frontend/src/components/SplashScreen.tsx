import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(p + 4, 100)), 80)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(135deg, #1a1440 0%, #0d1a3a 50%, #1a1440 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: 24,
        background: 'linear-gradient(135deg, #4d41df, #675df9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 50px rgba(103,93,249,0.6)',
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 44 }}>flight_takeoff</span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 38, fontWeight: 800, color: 'white', margin: 0 }}>Voyager AI</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 15 }}>Your AI Travel Super App</p>
      </div>
      <div style={{ width: 220, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#4d41df,#675df9)', borderRadius: 99, transition: 'width 0.08s linear' }} />
      </div>
      <style>{`@keyframes pulse { 0%,100%{transform:scale(1);box-shadow:0 0 50px rgba(103,93,249,0.6)} 50%{transform:scale(1.06);box-shadow:0 0 70px rgba(103,93,249,0.8)} }`}</style>
    </div>
  )
}
