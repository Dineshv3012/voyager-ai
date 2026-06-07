import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { expenseAPI } from '../api/client'
import toast from 'react-hot-toast'

const CATEGORIES = ['food','transport','accommodation','activity','shopping','other']
const CAT_ICONS: Record<string,string> = { food:'restaurant', transport:'directions_bus', accommodation:'hotel', activity:'sports_tennis', shopping:'shopping_bag', other:'more_horiz' }
const CAT_COLORS: Record<string,string> = { food:'#914800', transport:'#0057c2', accommodation:'#4d41df', activity:'#008b5e', shopping:'#b65c00', other:'#777587' }

export default function ExpensePage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', amount: '', currency: 'USD', category: 'food', notes: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const { data: expenses = [] } = useQuery({ queryKey: ['expenses'], queryFn: () => expenseAPI.list().then(r => r.data) })
  const { data: summary } = useQuery({ queryKey: ['expense-summary'], queryFn: () => expenseAPI.summary().then(r => r.data) })

  const addExpense = async () => {
    if (!form.title || !form.amount) { toast.error('Fill title and amount'); return }
    try {
      await expenseAPI.add({ ...form, amount: parseFloat(form.amount) })
      toast.success('Expense added')
      qc.invalidateQueries({ queryKey: ['expenses'] })
      qc.invalidateQueries({ queryKey: ['expense-summary'] })
      setForm({ title: '', amount: '', currency: 'USD', category: 'food', notes: '' })
      setShowForm(false)
    } catch { toast.error('Failed to add expense') }
  }

  const deleteExpense = async (id: string) => {
    try {
      await expenseAPI.delete(id)
      toast.success('Deleted')
      qc.invalidateQueries({ queryKey: ['expenses'] })
      qc.invalidateQueries({ queryKey: ['expense-summary'] })
    } catch { toast.error('Failed') }
  }

  const byCategory: Record<string,number> = summary?.by_category || {}

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#008b5e,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 22 }}>account_balance_wallet</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Expense Tracker</h1>
        </div>
        <button onClick={() => setShowForm(v => !v)} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#008b5e,#059669)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showForm ? 'close' : 'add'}</span>{showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14, marginBottom: 24 }}>
        <div style={{ background: 'linear-gradient(135deg,#008b5e,#059669)', borderRadius: 16, padding: '18px 20px', color: 'white' }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Total Spent</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>${summary?.total_usd?.toFixed(2) || '0.00'}</div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>{summary?.expense_count || 0} expenses</div>
        </div>
        {Object.entries(byCategory).slice(0, 3).map(([cat, amt]) => (
          <div key={cat} style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: 16, color: CAT_COLORS[cat] || '#777587' }}>{CAT_ICONS[cat] || 'more_horiz'}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#464555', textTransform: 'capitalize' }}>{cat}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>${(amt as number).toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e4e1ee', padding: 22, marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Add Expense</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 14 }}>
            <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Dinner at restaurant" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} /></div>
            <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Amount *</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                <select value={form.currency} onChange={e => set('currency', e.target.value)} style={{ padding: '11px 8px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'white' }}>
                  {['USD','INR','EUR','GBP','JPY','AUD','SGD','AED'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div></div>
            <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select></div>
            <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Notes</label>
              <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional notes" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e4e1ee', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} /></div>
          </div>
          <button onClick={addExpense} style={{ padding: '11px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#008b5e,#059669)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Add Expense</button>
        </div>
      )}

      {/* Expense list */}
      <div>
        <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>All Expenses</h2>
        {(expenses as any[]).length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, border: '2px dashed #e4e1ee', borderRadius: 16, color: '#777587' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8, color: '#c7c4d8' }}>receipt_long</span>
            No expenses yet. Add your first expense above.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(expenses as any[]).map((e: any) => (
              <div key={e.id} style={{ background: 'white', borderRadius: 12, border: '1px solid #e4e1ee', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: (CAT_COLORS[e.category] || '#777587') + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined fill" style={{ fontSize: 18, color: CAT_COLORS[e.category] || '#777587' }}>{CAT_ICONS[e.category] || 'more_horiz'}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: '#777587' }}>{e.category} · {new Date(e.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{e.currency} {e.amount?.toFixed(2)}</div>
                    {e.usd_amount && e.currency !== 'USD' && <div style={{ fontSize: 11, color: '#777587' }}>≈ ${e.usd_amount?.toFixed(2)}</div>}
                  </div>
                  <button onClick={() => deleteExpense(e.id)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: '#fef2f2', color: '#ba1a1a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
