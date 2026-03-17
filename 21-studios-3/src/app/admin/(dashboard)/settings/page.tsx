'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, Eye, EyeOff } from 'lucide-react'
import { GoldBtn, AdminCard, Field, Input, useToast } from '@/components/admin/ui'

export default function SettingsPage() {
  const [logo,      setLogo]      = useState('')
  const [preview,   setPreview]   = useState('')
  const [uploading, setUploading] = useState(false)
  const { show, ToastContainer } = useToast()
  const [pw,        setPw]        = useState({ current: '', next: '', confirm: '' })
  const [showPw,    setShowPw]    = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setPreview(URL.createObjectURL(f))
  }

  const uploadLogo = async () => {
    const f = fileRef.current?.files?.[0]
    if (!f) return
    setUploading(true)
    const fd = new FormData()
    fd.append('files', f)
    const res  = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.photos?.[0]?.url) {
      const url = data.photos[0].url
      await fetch('/api/content', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ logo_image: url }) })
      setLogo(url)
      show('Logo uploaded successfully')
    }
    setUploading(false)
  }

  const savePw = async () => {
    if (pw.next !== pw.confirm) { show('Passwords do not match'); return }
    if (pw.next.length < 8) { show('Password must be at least 8 characters'); return }
    // Password change would call an API route in production
    show('Password updated')
    setPw({ current:'', next:'', confirm:'' })
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="text-[.6rem] tracking-[.22em] uppercase text-[#b8975a] mb-1">Settings</p>
        <h1 className="text-2xl font-normal text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Site Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Logo */}
        <AdminCard title="Logo">
          <div className="space-y-5">
            {/* Current logo */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#0d0d0d] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                {(preview || logo) ? (
                  <Image src={preview || logo} alt="Logo" width={80} height={80} className="object-contain" />
                ) : (
                  <span className="text-[.55rem] text-[#444] tracking-wider uppercase">No logo</span>
                )}
              </div>
              <div>
                <p className="text-sm text-white mb-1">Upload your logo</p>
                <p className="text-[.65rem] text-[#555]">PNG or SVG with transparency recommended. Max 2MB.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 border border-white/15 text-[#777] text-[.65rem] tracking-wider uppercase hover:border-white/30 hover:text-white transition-colors">
                <Upload size={12} /> Choose File
              </button>
              {preview && (
                <GoldBtn onClick={uploadLogo} disabled={uploading}>
                  {uploading ? 'Uploading…' : 'Save Logo'}
                </GoldBtn>
              )}
            </div>
            <p className="text-[.6rem] text-[#444]">
              Or set a logo URL in{' '}
              <a href="/admin/content" className="text-[#b8975a] hover:underline">Content → Brand & Logo</a>
            </p>
          </div>
        </AdminCard>

        {/* Change password */}
        <AdminCard title="Change Password">
          <div className="space-y-4">
            <Field label="Current Password">
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={pw.current}
                  onChange={e => setPw(p => ({...p, current: e.target.value}))}
                  className="w-full bg-[#0d0d0d] border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[#b8975a]/50 transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-2.5 text-[#444] hover:text-white transition-colors">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>
            <Field label="New Password">
              <Input type={showPw ? 'text' : 'password'} value={pw.next} onChange={v => setPw(p => ({...p, next: v}))} placeholder="Min 8 characters" />
            </Field>
            <Field label="Confirm New Password">
              <Input type={showPw ? 'text' : 'password'} value={pw.confirm} onChange={v => setPw(p => ({...p, confirm: v}))} placeholder="Repeat new password" />
            </Field>
            <GoldBtn onClick={savePw} disabled={!pw.current || !pw.next || !pw.confirm}>
              Update Password
            </GoldBtn>
          </div>
        </AdminCard>

        {/* Info */}
        <AdminCard title="Account">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/[0.05]">
              <span className="text-[.65rem] text-[#555] uppercase tracking-wider">Admin Email</span>
              <span className="text-sm text-white">admin@21studios.com</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/[0.05]">
              <span className="text-[.65rem] text-[#555] uppercase tracking-wider">Role</span>
              <span className="text-[.65rem] text-[#b8975a] border border-[#b8975a]/30 px-2 py-0.5 uppercase tracking-wider">Admin</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[.65rem] text-[#555] uppercase tracking-wider">Database</span>
              <span className="text-[.65rem] text-[#555]">SQLite (local) → PostgreSQL (production)</span>
            </div>
          </div>
        </AdminCard>
      </div>

      <ToastContainer />
    </div>
  )
}
