'use client'
import { ReactNode, useState, useRef, useEffect } from 'react'
import { X, Check, AlertCircle, CheckCircle, Info } from 'lucide-react'

/* ── Gold button ─────────────────────────────────────── */
export function GoldBtn({ children, onClick, type = 'button', disabled = false, className = '', size = 'md' }: {
  children: ReactNode; onClick?: () => void; type?: 'button'|'submit'
  disabled?: boolean; className?: string; size?: 'sm'|'md'|'lg'
}) {
  const sz = size === 'sm' ? 'px-3 py-1.5 text-[.6rem]' : size === 'lg' ? 'px-7 py-3.5 text-[.72rem]' : 'px-5 py-2.5 text-[.65rem]'
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 ${sz} bg-[#b8975a] text-[#080808] tracking-[.18em] uppercase font-medium hover:bg-[#d4b37a] active:bg-[#a07848] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 ${className}`}>
      {children}
    </button>
  )
}

/* ── Ghost button ────────────────────────────────────── */
export function GhostBtn({ children, onClick, className = '', disabled = false, size = 'md' }: {
  children: ReactNode; onClick?: () => void; className?: string; disabled?: boolean; size?: 'sm'|'md'
}) {
  const sz = size === 'sm' ? 'px-3 py-1.5 text-[.6rem]' : 'px-5 py-2.5 text-[.65rem]'
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 ${sz} border border-white/15 text-[#777] tracking-[.15em] uppercase hover:border-white/30 hover:text-white disabled:opacity-40 transition-all duration-200 ${className}`}>
      {children}
    </button>
  )
}

/* ── Danger button ───────────────────────────────────── */
export function DangerBtn({ children, onClick, className = '' }: {
  children: ReactNode; onClick?: () => void; className?: string
}) {
  return (
    <button type="button" onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 border border-red-500/25 text-red-400 text-[.65rem] tracking-wider uppercase hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-200 ${className}`}>
      {children}
    </button>
  )
}

/* ── Icon button ─────────────────────────────────────── */
export function IconBtn({ icon: Icon, onClick, title, danger = false, active = false }: {
  icon: React.ElementType; onClick?: () => void; title?: string; danger?: boolean; active?: boolean
}) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`w-8 h-8 flex items-center justify-center transition-all duration-200 rounded-sm ${
        active  ? 'bg-[#b8975a]/15 text-[#b8975a]' :
        danger  ? 'text-[#444] hover:text-red-400 hover:bg-red-400/10' :
                  'text-[#444] hover:text-white hover:bg-white/[0.06]'
      }`}>
      <Icon size={13} />
    </button>
  )
}

/* ── Field wrapper ───────────────────────────────────── */
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[.58rem] tracking-[.2em] uppercase text-[#b8975a] mb-1.5 font-normal">{label}</label>
      {children}
      {hint && <p className="text-[.58rem] text-[#444] mt-1.5 leading-relaxed">{hint}</p>}
    </div>
  )
}

/* ── Input ───────────────────────────────────────────── */
export function Input({ value, onChange, placeholder = '', type = 'text', required = false, disabled = false }: {
  value: string; onChange: (v: string) => void; placeholder?: string
  type?: string; required?: boolean; disabled?: boolean
}) {
  return (
    <input type={type} value={value} required={required} disabled={disabled} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-[#111] border border-white/[0.08] px-3.5 py-2.5 text-sm text-white placeholder-[#333] outline-none focus:border-[#b8975a]/50 focus:bg-[#141414] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-sm" />
  )
}

/* ── Textarea ────────────────────────────────────────── */
export function Textarea({ value, onChange, placeholder = '', rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <textarea value={value} rows={rows} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-[#111] border border-white/[0.08] px-3.5 py-2.5 text-sm text-white placeholder-[#333] outline-none focus:border-[#b8975a]/50 focus:bg-[#141414] transition-all duration-200 resize-none rounded-sm" />
  )
}

/* ── Select ──────────────────────────────────────────── */
export function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-[#111] border border-white/[0.08] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#b8975a]/50 transition-all duration-200 appearance-none cursor-pointer rounded-sm">
      {options.map(o => <option key={o.value} value={o.value} className="bg-[#111]">{o.label}</option>)}
    </select>
  )
}

/* ── Toggle ──────────────────────────────────────────── */
export function Toggle({ value, onChange, label, hint }: {
  value: boolean; onChange: (v: boolean) => void; label: string; hint?: string
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <button type="button" onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-all duration-300 shrink-0 mt-0.5 ${value ? 'bg-[#b8975a]' : 'bg-white/10'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
      <div>
        <span className="text-sm text-[#888] group-hover:text-white transition-colors">{label}</span>
        {hint && <p className="text-[.58rem] text-[#444] mt-0.5">{hint}</p>}
      </div>
    </label>
  )
}

/* ── Modal ───────────────────────────────────────────── */
export function Modal({ title, onClose, children, wide = false }: {
  title: string; onClose: () => void; children: ReactNode; wide?: boolean
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className={`relative z-10 w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} bg-[#0f0f0f] border border-white/[0.08] shadow-2xl rounded-sm`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm text-white font-normal tracking-wide">{title}</h2>
          <button onClick={onClose} className="text-[#444] hover:text-white transition-colors p-1">
            <X size={15} />
          </button>
        </div>
        <div className="p-5 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

/* ── Admin card ──────────────────────────────────────── */
export function AdminCard({ title, subtitle, children, action, noPad = false }: {
  title: string; subtitle?: string; children: ReactNode; action?: ReactNode; noPad?: boolean
}) {
  return (
    <div className="bg-[#0f0f0f] border border-white/[0.06] rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h2 className="text-[.72rem] text-[#888] tracking-[.18em] uppercase font-normal">{title}</h2>
          {subtitle && <p className="text-[.6rem] text-[#444] mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={noPad ? '' : 'p-5'}>{children}</div>
    </div>
  )
}

/* ── Empty state ─────────────────────────────────────── */
export function Empty({ icon: Icon, title, body, action }: {
  icon: React.ElementType; title: string; body: string; action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="w-14 h-14 border border-white/[0.08] flex items-center justify-center rounded-sm">
        <Icon size={22} className="text-[#2a2a2a]" />
      </div>
      <div>
        <p className="text-white text-sm mb-1">{title}</p>
        <p className="text-[#444] text-xs max-w-xs leading-relaxed">{body}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

/* ── Toast notification ──────────────────────────────── */
export function useToast() {
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: 'success'|'error'|'info' }[]>([])
  const show = (msg: string, type: 'success'|'error'|'info' = 'success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }
  const ToastContainer = () => (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id}
          className={`flex items-center gap-3 px-4 py-3 text-sm border shadow-xl rounded-sm animate-[fadeUp_0.3s_ease] ${
            t.type === 'success' ? 'bg-[#0f1a0f] border-emerald-500/30 text-emerald-400' :
            t.type === 'error'   ? 'bg-[#1a0f0f] border-red-500/30 text-red-400' :
                                   'bg-[#0f0f1a] border-[#b8975a]/30 text-[#b8975a]'
          }`}>
          {t.type === 'success' ? <CheckCircle size={14} /> :
           t.type === 'error'   ? <AlertCircle size={14} /> :
                                  <Info size={14} />}
          {t.msg}
        </div>
      ))}
    </div>
  )
  return { show, ToastContainer }
}

/* ── Confirm dialog ──────────────────────────────────── */
export function useConfirm() {
  const [state, setState] = useState<{ msg: string; resolve: (v: boolean) => void } | null>(null)
  const confirm = (msg: string) => new Promise<boolean>(resolve => setState({ msg, resolve }))
  const Dialog = () => state ? (
    <div className="fixed inset-0 z-[950] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { state.resolve(false); setState(null) }} />
      <div className="relative z-10 bg-[#0f0f0f] border border-white/[0.08] rounded-sm p-6 max-w-sm w-full shadow-2xl">
        <p className="text-sm text-white mb-5 leading-relaxed">{state.msg}</p>
        <div className="flex gap-3">
          <DangerBtn onClick={() => { state.resolve(true); setState(null) }} className="flex-1 justify-center">
            <Check size={13} /> Confirm
          </DangerBtn>
          <GhostBtn onClick={() => { state.resolve(false); setState(null) }} className="flex-1 justify-center">
            Cancel
          </GhostBtn>
        </div>
      </div>
    </div>
  ) : null
  return { confirm, Dialog }
}

/* ── Inline editable text ────────────────────────────── */
export function InlineText({ value, onChange, as: Tag = 'p', className = '', placeholder = 'Click to edit…' }: {
  value: string; onChange: (v: string) => void
  as?: 'p'|'h1'|'h2'|'h3'|'span'; className?: string; placeholder?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState(value)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { if (editing) ref.current?.focus() }, [editing])

  const commit = () => { setEditing(false); onChange(draft) }

  if (editing) return (
    <textarea ref={ref} value={draft} rows={2}
      className={`${className} w-full bg-[#b8975a]/10 border border-[#b8975a]/50 outline-none px-2 py-1 resize-none rounded-sm`}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit() } if (e.key === 'Escape') { setDraft(value); setEditing(false) } }} />
  )

  return (
    <Tag className={`${className} cursor-text group relative`} onClick={() => { setDraft(value); setEditing(true) }}>
      {value || <span className="opacity-30 italic">{placeholder}</span>}
      <span className="absolute -top-5 left-0 text-[.5rem] tracking-wider text-[#b8975a] bg-[#b8975a]/10 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        ✏ click to edit
      </span>
    </Tag>
  )
}
