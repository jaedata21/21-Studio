'use client'
import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Pencil, Check, X } from 'lucide-react'

interface InlineEditProps {
  value: string
  onSave: (v: string) => Promise<void> | void
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  placeholder?: string
  multiline?: boolean
}

export default function InlineEdit({
  value, onSave, tag: Tag = 'p', className = '', placeholder = 'Click to edit…', multiline = false,
}: InlineEditProps) {
  const [editing, setEditing]   = useState(false)
  const [draft,   setDraft]     = useState(value)
  const [saving,  setSaving]    = useState(false)
  const [saved,   setSaved]     = useState(false)
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

  useEffect(() => { setDraft(value) }, [value])
  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  const commit = async () => {
    if (draft === value) { setEditing(false); return }
    setSaving(true)
    await onSave(draft)
    setSaving(false); setEditing(false)
    setSaved(true); setTimeout(() => setSaved(false), 1500)
  }

  const cancel = () => { setDraft(value); setEditing(false) }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) commit()
    if (e.key === 'Escape') cancel()
  }

  if (editing) {
    const shared = {
      ref: inputRef as React.RefObject<HTMLInputElement>,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onKeyDown: onKey,
      className: `w-full bg-[#0a0a0a] border border-[#b8975a]/50 px-3 py-2 text-white outline-none resize-none ${className}`,
      placeholder,
    }
    return (
      <div className="relative">
        {multiline
          ? <textarea {...(shared as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} rows={4} />
          : <input type="text" {...(shared as React.InputHTMLAttributes<HTMLInputElement>)} />
        }
        <div className="flex gap-1 mt-1.5">
          <button onClick={commit} disabled={saving}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#b8975a] text-[#0a0a0a] text-[.6rem] tracking-wider uppercase hover:bg-[#d4b37a] disabled:opacity-60 transition-colors">
            <Check size={10} />{saving ? 'Saving' : 'Save'}
          </button>
          <button onClick={cancel}
            className="flex items-center gap-1 px-2.5 py-1 border border-white/15 text-[#555] text-[.6rem] tracking-wider uppercase hover:text-white transition-colors">
            <X size={10} />Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative inline-flex items-start gap-2 cursor-pointer w-full" onClick={() => setEditing(true)}>
      <Tag className={`${className} ${saved ? 'text-[#b8975a]' : ''} transition-colors min-w-0 flex-1`}>
        {value || <span className="text-[#444] italic">{placeholder}</span>}
      </Tag>
      <Pencil size={11} className="text-[#444] opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
    </div>
  )
}
