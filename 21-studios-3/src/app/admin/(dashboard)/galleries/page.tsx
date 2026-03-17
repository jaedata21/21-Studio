'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, FolderOpen, Eye, EyeOff, Star, Trash2, Edit2, Images, ArrowRight } from 'lucide-react'
import {
  GoldBtn, GhostBtn, Modal, Field, Input, Textarea,
  Select, Toggle, AdminCard, Empty, useToast, useConfirm,
} from '@/components/admin/ui'
import GalleryPreview from '@/components/admin/GalleryPreview'

interface Gallery {
  id: string; title: string; slug: string; description: string | null
  category: string; coverImage: string | null; featured: boolean
  published: boolean; _count: { photos: number }
}
interface Photo { id: string; url: string; thumbUrl: string | null; alt: string | null }

const cats = ['Wedding','Portrait','Editorial','Commercial','Event','Newborn','Family','General'].map(v=>({value:v,label:v}))
const blank = { title:'', description:'', category:'General', featured:false, published:true }

export default function GalleriesPage() {
  const [galleries,  setGalleries]  = useState<Gallery[]>([])
  const [showModal,  setShowModal]  = useState(false)
  const [editing,    setEditing]    = useState<Gallery | null>(null)
  const [previewing, setPreviewing] = useState<Gallery | null>(null)
  const [previewPhotos, setPreviewPhotos] = useState<Photo[]>([])
  const [form, setForm] = useState(blank)
  const [saving, setSaving] = useState(false)
  const { show, ToastContainer } = useToast()
  const { confirm, Dialog } = useConfirm()

  const load = async () => {
    const data = await fetch('/api/galleries').then(r => r.json()).catch(() => [])
    setGalleries(Array.isArray(data) ? data : [])
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(blank); setShowModal(true) }
  const openEdit   = (g: Gallery) => {
    setEditing(g)
    setForm({ title: g.title, description: g.description||'', category: g.category, featured: g.featured, published: g.published })
    setShowModal(true)
  }

  const openPreview = async (g: Gallery) => {
    setPreviewing(g)
    const data = await fetch(`/api/galleries/${g.id}`).then(r => r.json()).catch(() => ({}))
    setPreviewPhotos(data.photos || [])
  }

  const save = async () => {
    setSaving(true)
    if (editing) {
      await fetch(`/api/galleries/${editing.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      show('Gallery updated')
    } else {
      await fetch('/api/galleries', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      show('Gallery created ✓')
    }
    setSaving(false); setShowModal(false); load()
  }

  const del = async (g: Gallery) => {
    const ok = await confirm(`Delete "${g.title}"? Photos inside will be kept.`)
    if (!ok) return
    await fetch(`/api/galleries/${g.id}`, { method:'DELETE' })
    show('Gallery deleted', 'info'); load()
  }

  const toggle = async (g: Gallery, field: 'published'|'featured') => {
    await fetch(`/api/galleries/${g.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ [field]: !g[field] }) })
    show(field === 'featured' ? (g.featured ? 'Removed from featured' : 'Set as featured') : (g.published ? 'Gallery hidden' : 'Gallery published'))
    load()
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-7">
        <div>
          <p className="text-[.6rem] tracking-[.22em] uppercase text-[#b8975a] mb-1">Manage</p>
          <h1 className="text-2xl font-normal text-white" style={{ fontFamily:'Playfair Display, serif' }}>Galleries</h1>
        </div>
        <GoldBtn onClick={openCreate}><Plus size={13} /> New Gallery</GoldBtn>
      </div>

      <AdminCard title={`${galleries.length} galleries`} subtitle="Click the eye icon to preview how your gallery looks on the site">
        {galleries.length === 0 ? (
          <Empty icon={FolderOpen} title="No galleries yet" body="Create your first gallery to start organising your photos."
            action={<GoldBtn onClick={openCreate}><Plus size={12} /> Create Gallery</GoldBtn>} />
        ) : (
          <div className="space-y-2">
            {galleries.map(g => (
              <div key={g.id}
                className="flex items-center gap-3 p-3.5 bg-[#111] border border-white/[0.04] hover:border-white/10 rounded-sm transition-all group">
                {/* Cover thumbnail */}
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-sm shrink-0 overflow-hidden">
                  {g.coverImage
                    ? <Image src={g.coverImage} alt="" width={48} height={48} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <FolderOpen size={14} className="text-[#2a2a2a]" />
                      </div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm text-white truncate">{g.title}</p>
                    {g.featured && (
                      <span className="text-[.5rem] tracking-wider uppercase px-1.5 py-0.5 bg-[#b8975a]/10 text-[#b8975a] border border-[#b8975a]/20 rounded-sm">
                        Featured
                      </span>
                    )}
                    {!g.published && (
                      <span className="text-[.5rem] tracking-wider uppercase px-1.5 py-0.5 bg-white/[0.04] text-[#444] border border-white/[0.06] rounded-sm">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-[.62rem] text-[#444]">
                    {g.category} · {g._count.photos} photo{g._count.photos !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openPreview(g)} title="Preview gallery"
                    className="w-8 h-8 flex items-center justify-center text-[#444] hover:text-[#b8975a] hover:bg-[#b8975a]/10 rounded-sm transition-all">
                    <Eye size={13} />
                  </button>
                  <button onClick={() => toggle(g, 'featured')} title={g.featured ? 'Remove featured' : 'Set as featured'}
                    className={`w-8 h-8 flex items-center justify-center rounded-sm transition-all ${g.featured ? 'text-[#b8975a] bg-[#b8975a]/10' : 'text-[#444] hover:text-[#b8975a] hover:bg-[#b8975a]/10'}`}>
                    <Star size={13} />
                  </button>
                  <button onClick={() => toggle(g, 'published')} title={g.published ? 'Hide gallery' : 'Publish gallery'}
                    className="w-8 h-8 flex items-center justify-center text-[#444] hover:text-white hover:bg-white/[0.06] rounded-sm transition-all">
                    {g.published ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <Link href={`/admin/photos?galleryId=${g.id}`} title="Manage photos"
                    className="w-8 h-8 flex items-center justify-center text-[#444] hover:text-white hover:bg-white/[0.06] rounded-sm transition-all">
                    <Images size={13} />
                  </Link>
                  <button onClick={() => openEdit(g)} title="Edit gallery"
                    className="w-8 h-8 flex items-center justify-center text-[#444] hover:text-white hover:bg-white/[0.06] rounded-sm transition-all">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => del(g)} title="Delete gallery"
                    className="w-8 h-8 flex items-center justify-center text-[#444] hover:text-red-400 hover:bg-red-400/10 rounded-sm transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Quick link to photos */}
                <Link href={`/admin/photos?galleryId=${g.id}`}
                  className="hidden sm:flex items-center gap-1 text-[.6rem] text-[#333] hover:text-[#b8975a] transition-colors shrink-0 group-hover:text-[#555]">
                  Photos <ArrowRight size={10} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Create / Edit modal */}
      {showModal && (
        <Modal title={editing ? `Edit "${editing.title}"` : 'New Gallery'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <Field label="Gallery Name *" hint="This appears as the gallery title on your website">
              <Input value={form.title} onChange={v => setForm(p=>({...p,title:v}))} placeholder="e.g. Summer Weddings 2024" required />
            </Field>
            <Field label="Description" hint="Optional — shown below the gallery title">
              <Textarea value={form.description} onChange={v => setForm(p=>({...p,description:v}))} placeholder="A short description of this gallery…" rows={2} />
            </Field>
            <Field label="Category" hint="Used for filtering on the portfolio page">
              <Select value={form.category} onChange={v => setForm(p=>({...p,category:v}))} options={cats} />
            </Field>
            <div className="space-y-3 pt-1">
              <Toggle value={form.featured} onChange={v => setForm(p=>({...p,featured:v}))} label="Feature on homepage" hint="Shows this gallery in the featured work section" />
              <Toggle value={form.published} onChange={v => setForm(p=>({...p,published:v}))} label="Visible on website" hint="Turn off to hide this gallery from visitors" />
            </div>
            <div className="flex gap-3 pt-2">
              <GoldBtn type="button" onClick={save} disabled={!form.title || saving} className="flex-1 justify-center" size="lg">
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Gallery'}
              </GoldBtn>
              <GhostBtn onClick={() => setShowModal(false)} className="flex-1 justify-center">Cancel</GhostBtn>
            </div>
          </div>
        </Modal>
      )}

      {/* Preview modal */}
      {previewing && (
        <Modal title={`Preview — ${previewing.title}`} onClose={() => setPreviewing(null)} wide>
          <GalleryPreview title={previewing.title} photos={previewPhotos} />
        </Modal>
      )}

      <ToastContainer />
      <Dialog />
    </div>
  )
}
