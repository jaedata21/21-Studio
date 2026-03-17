'use client'
import { useState, useEffect } from 'react'
import { Save, Eye, RefreshCw } from 'lucide-react'
import { GoldBtn, GhostBtn, AdminCard, Field, useToast, Toggle } from '@/components/admin/ui'

type CMap = Record<string, string>

/* Each group with its fields */
const groups = [
  {
    key: 'hero', label: '🏠 Hero Section', desc: 'The first thing visitors see',
    fields: [
      { key:'hero_headline', label:'Main Headline',      type:'text',     placeholder:'21 Studios',                    hint:'Large text displayed over the hero image' },
      { key:'hero_subtext',  label:'Tagline',            type:'text',     placeholder:'Where light becomes legacy',    hint:'Smaller text below the headline' },
      { key:'hero_image',    label:'Background Image',   type:'url',      placeholder:'https://… or /your-image.jpg', hint:'Paste an image URL or upload in Photos then copy the path' },
    ],
  },
  {
    key: 'about', label: '📷 About Page', desc: 'Your story and photographer bio',
    fields: [
      { key:'photographer_name',  label:'Your Name',            type:'text',     placeholder:'Jordan Campbell' },
      { key:'photographer_title', label:'Your Title',           type:'text',     placeholder:'Lead Photographer & Creative Director' },
      { key:'about_headline',     label:'Page Headline',        type:'text',     placeholder:'The Vision Behind the Lens' },
      { key:'about_quote',        label:'Feature Quote',        type:'textarea', placeholder:'"I believe every frame holds the power to contain an entire world."', hint:'Displayed large and italic — make it personal' },
      { key:'about_body',         label:'Bio / Story',          type:'textarea', placeholder:'Your photography story…', hint:'Shown in paragraph form on the About page' },
    ],
  },
  {
    key: 'cta', label: '🎯 Call to Action', desc: 'The booking prompt section',
    fields: [
      { key:'cta_headline', label:'Headline', type:'text',     placeholder:"Let's Create Something Timeless" },
      { key:'cta_subtext',  label:'Subtext',  type:'textarea', placeholder:'Limited availability each season. Inquire now.' },
    ],
  },
  {
    key: 'contact', label: '📬 Contact Info', desc: 'Shown in footer and booking page',
    fields: [
      { key:'contact_email',    label:'Email Address', type:'email', placeholder:'hello@21studios.com' },
      { key:'contact_phone',    label:'Phone Number',  type:'tel',   placeholder:'+1 (876) 123-4567' },
      { key:'contact_location', label:'Location',      type:'text',  placeholder:'Kingston, Jamaica & Worldwide' },
    ],
  },
  {
    key: 'brand', label: '🎨 Brand & Social', desc: 'Logo text and social links',
    fields: [
      { key:'logo_text',     label:'Logo Text',       type:'text', placeholder:'21 Studios',              hint:'Shown in the nav bar if no logo image is uploaded' },
      { key:'logo_image',    label:'Logo Image URL',  type:'url',  placeholder:'/logo.png or https://…',  hint:'Upload your logo in Settings, then paste the path here' },
      { key:'instagram_url', label:'Instagram URL',   type:'url',  placeholder:'https://instagram.com/21studios' },
    ],
  },
]

export default function ContentPage() {
  const [content,  setContent]  = useState<CMap>({})
  const [saving,   setSaving]   = useState<string | null>(null)
  const [changed,  setChanged]  = useState<Set<string>>(new Set())
  const [preview,  setPreview]  = useState(false)
  const { show, ToastContainer } = useToast()

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(setContent).catch(() => {})
  }, [])

  const set = (key: string, value: string) => {
    setContent(p => ({ ...p, [key]: value }))
    setChanged(p => new Set([...p, key]))
  }

  const saveGroup = async (groupKey: string, fields: typeof groups[0]['fields']) => {
    setSaving(groupKey)
    const body: CMap = {}
    fields.forEach(f => { body[f.key] = content[f.key] || '' })
    await fetch('/api/content', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
    setSaving(null)
    setChanged(p => { const n = new Set(p); fields.forEach(f => n.delete(f.key)); return n })
    show('Changes saved ✓')
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
        <div>
          <p className="text-[.6rem] tracking-[.22em] uppercase text-[#b8975a] mb-1">CMS</p>
          <h1 className="text-2xl font-normal text-white" style={{ fontFamily:'Playfair Display, serif' }}>Site Content</h1>
          <p className="text-[.62rem] text-[#444] mt-0.5">Edit your website text — no coding needed</p>
        </div>
        {changed.size > 0 && (
          <div className="flex items-center gap-2 text-[.6rem] text-[#b8975a] border border-[#b8975a]/20 bg-[#b8975a]/5 px-3 py-2 rounded-sm">
            <div className="w-1.5 h-1.5 bg-[#b8975a] rounded-full animate-pulse" />
            {changed.size} unsaved change{changed.size !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Tips banner */}
      <div className="flex items-start gap-3 bg-[#111] border border-white/[0.06] p-4 rounded-sm mb-6">
        <div className="w-6 h-6 bg-[#b8975a]/15 rounded-full flex items-center justify-center shrink-0 mt-0.5">
          <Eye size={11} className="text-[#b8975a]" />
        </div>
        <div>
          <p className="text-xs text-white mb-0.5">How to use</p>
          <p className="text-[.62rem] text-[#555] leading-relaxed">
            Edit the text in each field, then click <strong className="text-[#888]">Save Section</strong> to publish your changes.
            Changes appear on your live website immediately after saving.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {groups.map(group => {
          const hasChanges = group.fields.some(f => changed.has(f.key))
          return (
            <AdminCard
              key={group.key}
              title={group.label}
              subtitle={group.desc}
              action={
                <GoldBtn
                  size="sm"
                  onClick={() => saveGroup(group.key, group.fields)}
                  disabled={saving === group.key}>
                  {saving === group.key
                    ? <><RefreshCw size={10} className="animate-spin" /> Saving…</>
                    : <><Save size={10} /> Save Section</>
                  }
                </GoldBtn>
              }>
              <div className="space-y-5">
                {group.fields.map(field => (
                  <Field key={field.key} label={field.label} hint={field.hint}>
                    {field.type === 'textarea'
                      ? <textarea value={content[field.key] || ''} rows={4} placeholder={field.placeholder}
                          onChange={e => set(field.key, e.target.value)}
                          className={`w-full bg-[#111] border px-3.5 py-2.5 text-sm text-white placeholder-[#333] outline-none transition-all resize-none rounded-sm ${
                            changed.has(field.key) ? 'border-[#b8975a]/40 bg-[#b8975a]/5' : 'border-white/[0.08] focus:border-[#b8975a]/50'
                          }`} />
                      : <div className="relative">
                          <input type={field.type} value={content[field.key] || ''} placeholder={field.placeholder}
                            onChange={e => set(field.key, e.target.value)}
                            className={`w-full bg-[#111] border px-3.5 py-2.5 text-sm text-white placeholder-[#333] outline-none transition-all rounded-sm ${
                              changed.has(field.key) ? 'border-[#b8975a]/40 bg-[#b8975a]/5' : 'border-white/[0.08] focus:border-[#b8975a]/50'
                            }`} />
                          {changed.has(field.key) && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#b8975a] rounded-full" />
                          )}
                        </div>
                    }
                  </Field>
                ))}

                {/* Inline preview for hero */}
                {group.key === 'hero' && content['hero_headline'] && (
                  <div className="border border-white/[0.06] rounded-sm overflow-hidden">
                    <p className="text-[.55rem] tracking-[.2em] uppercase text-[#444] px-3 py-2 border-b border-white/[0.04]">
                      Live preview
                    </p>
                    <div className="relative h-32 bg-[#0a0a0a] flex items-end p-4 overflow-hidden">
                      {content['hero_image'] && (
                        <div className="absolute inset-0 opacity-30">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={content['hero_image']} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="relative z-10">
                        <p className="text-white leading-none text-2xl" style={{ fontFamily:'Playfair Display, serif' }}>
                          {content['hero_headline'] || '21 Studios'}
                        </p>
                        <p className="text-[#888] text-[.65rem] mt-1 tracking-wider">
                          {content['hero_subtext'] || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AdminCard>
          )
        })}
      </div>

      <ToastContainer />
    </div>
  )
}
