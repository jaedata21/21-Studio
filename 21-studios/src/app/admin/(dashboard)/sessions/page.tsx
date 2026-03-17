'use client'
import { useState, useEffect } from 'react'
import { Plus, Camera, Edit2, Trash2, ToggleLeft, ToggleRight, CheckCircle } from 'lucide-react'
import { GoldBtn, GhostBtn, Modal, Field, Input, Textarea, Select, Toggle, AdminCard, Empty, useToast, useConfirm } from '@/components/admin/ui'

interface Session {
  id: string; title: string; price: string; duration: string | null
  description: string | null; includes: string; category: string; active: boolean; sortOrder: number
}

const cats = ['Wedding','Portrait','Newborn','Family','Engagement','Editorial','Commercial','Event','Destination','Other'].map(v => ({ value: v, label: v }))
const blank = { title:'', price:'', duration:'', description:'', category:'Portrait', active:true, includes:[''] }

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing,   setEditing]   = useState<Session | null>(null)
  const [form, setForm] = useState(blank)
  const { show, ToastContainer } = useToast()
  const { confirm, Dialog } = useConfirm()
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const data = await fetch('/api/sessions').then(r => r.json())
    setSessions(Array.isArray(data) ? data : [])
  }
  useEffect(() => { load() }, [])
  

  const openCreate = () => { setEditing(null); setForm(blank); setShowModal(true) }
  const openEdit   = (s: Session) => {
    setEditing(s)
    let inc: string[] = ['']
    try { inc = JSON.parse(s.includes) } catch { /* noop */ }
    setForm({ title: s.title, price: s.price, duration: s.duration || '', description: s.description || '', category: s.category, active: s.active, includes: inc })
    setShowModal(true)
  }

  const save = async () => {
    setLoading(true)
    const body = { ...form, includes: form.includes.filter(Boolean) }
    if (editing) {
      await fetch(`/api/sessions/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      show('Session updated')
    } else {
      await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      show('Session created')
    }
    setLoading(false); setShowModal(false); load()
  }

  const del = async (id: string) => {
    const ok = await confirm('Delete this session permanently?')
    if (!ok) return
    await fetch(`/api/sessions/${id}`, { method: 'DELETE' })
    show('Session deleted'); load()
  }

  const toggleActive = async (s: Session) => {
    await fetch(`/api/sessions/${s.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !s.active }) })
    load()
  }

  const setInclude = (i: number, v: string) =>
    setForm(p => ({ ...p, includes: p.includes.map((x, idx) => idx === i ? v : x) }))
  const addInclude    = () => setForm(p => ({ ...p, includes: [...p.includes, ''] }))
  const removeInclude = (i: number) => setForm(p => ({ ...p, includes: p.includes.filter((_, idx) => idx !== i) }))

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[.6rem] tracking-[.22em] uppercase text-[#b8975a] mb-1">Manage</p>
          <h1 className="text-2xl font-normal text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Sessions & Packages</h1>
        </div>
        <GoldBtn onClick={openCreate}><Plus size={13} /> New Session</GoldBtn>
      </div>

      <AdminCard title={`${sessions.length} sessions`}>
        {sessions.length === 0 ? (
          <Empty icon={Camera} title="No sessions yet" body="Add your photography packages to display on the booking page." />
        ) : (
          <div className="space-y-3">
            {sessions.map(s => {
              let inc: string[] = []
              try { inc = JSON.parse(s.includes) } catch { /* noop */ }
              return (
                <div key={s.id} className={`p-5 border transition-colors group ${s.active ? 'border-white/[0.06] bg-[#0d0d0d]' : 'border-white/[0.03] bg-[#0a0a0a] opacity-60'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <p className="text-white text-sm font-normal">{s.title}</p>
                        <span className="text-[.55rem] tracking-wider uppercase px-2 py-0.5 border border-white/10 text-[#555]">{s.category}</span>
                        {!s.active && <span className="text-[.55rem] tracking-wider uppercase px-2 py-0.5 border border-white/10 text-[#444]">Hidden</span>}
                      </div>
                      <div className="flex items-baseline gap-3 mb-2">
                        <p className="text-[#b8975a] font-normal" style={{ fontFamily: 'Playfair Display, serif' }}>{s.price}</p>
                        {s.duration && <p className="text-[.65rem] text-[#555]">{s.duration}</p>}
                      </div>
                      {inc.length > 0 && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                          {inc.map((item, i) => (
                            <span key={i} className="flex items-center gap-1.5 text-[.62rem] text-[#555]">
                              <CheckCircle size={9} className="text-[#b8975a]/60 shrink-0" /> {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleActive(s)} title={s.active ? 'Hide' : 'Show'}
                        className="w-8 h-8 flex items-center justify-center text-[#444] hover:text-white hover:bg-white/[0.04] transition-colors">
                        {s.active ? <ToggleRight size={15} className="text-[#b8975a]" /> : <ToggleLeft size={15} />}
                      </button>
                      <button onClick={() => openEdit(s)}
                        className="w-8 h-8 flex items-center justify-center text-[#444] hover:text-white hover:bg-white/[0.04] transition-colors">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => del(s.id)}
                        className="w-8 h-8 flex items-center justify-center text-[#444] hover:text-red-400 hover:bg-white/[0.04] transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>

      {showModal && (
        <Modal title={editing ? 'Edit Session' : 'New Session'} onClose={() => setShowModal(false)}>
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <Field label="Session Title *"><Input value={form.title} onChange={v => setForm(p => ({...p,title:v}))} placeholder="e.g. Signature Wedding" required /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price *"><Input value={form.price} onChange={v => setForm(p => ({...p,price:v}))} placeholder="$1,200 or Custom" required /></Field>
              <Field label="Duration"><Input value={form.duration} onChange={v => setForm(p => ({...p,duration:v}))} placeholder="4 Hours" /></Field>
            </div>
            <Field label="Category"><Select value={form.category} onChange={v => setForm(p => ({...p,category:v}))} options={cats} /></Field>
            <Field label="Description"><Textarea value={form.description} onChange={v => setForm(p => ({...p,description:v}))} placeholder="Describe this session…" rows={3} /></Field>

            {/* Includes list */}
            <Field label="What's Included">
              <div className="space-y-2">
                {form.includes.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={item} onChange={e => setInclude(i, e.target.value)} placeholder={`Item ${i+1}…`}
                      className="flex-1 bg-[#0d0d0d] border border-white/10 px-3 py-2 text-sm text-white placeholder-[#444] outline-none focus:border-[#b8975a]/50" />
                    <button onClick={() => removeInclude(i)} className="px-2 text-[#444] hover:text-red-400 transition-colors text-sm">✕</button>
                  </div>
                ))}
                <button onClick={addInclude} className="text-[.65rem] tracking-wider text-[#b8975a] hover:text-[#d4b37a] transition-colors uppercase">
                  + Add item
                </button>
              </div>
            </Field>

            <Toggle value={form.active} onChange={v => setForm(p => ({...p,active:v}))} label="Active (visible on booking page)" />

            <div className="flex gap-3 pt-2">
              <GoldBtn onClick={save} disabled={!form.title || !form.price || loading} className="flex-1 justify-center">
                {loading ? 'Saving…' : editing ? 'Save Changes' : 'Create Session'}
              </GoldBtn>
              <GhostBtn onClick={() => setShowModal(false)}>Cancel</GhostBtn>
            </div>
          </div>
        </Modal>
      )}

      <ToastContainer />
      <Dialog />
    </div>
  )
}
