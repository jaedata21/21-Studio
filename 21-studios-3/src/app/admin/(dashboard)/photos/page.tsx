'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Images, Trash2, GripVertical, Upload, Crop, Edit2, X, Check } from 'lucide-react'
import PhotoUploader from '@/components/admin/PhotoUploader'
import ImageCropper  from '@/components/admin/ImageCropper'
import { AdminCard, Empty, GhostBtn, Modal, Field, Select, useToast, useConfirm } from '@/components/admin/ui'

interface Photo {
  id: string; url: string; thumbUrl: string | null
  alt: string | null; width: number; height: number; sortOrder: number
  gallery: { title: string } | null
}
interface Gallery { id: string; title: string }

/* ── Sortable card ───────────────────────────────────── */
function PhotoCard({ photo, onDelete, onCrop, onEditAlt }: {
  photo: Photo
  onDelete: (id: string) => void
  onCrop: (photo: Photo) => void
  onEditAlt: (photo: Photo) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.id })

  return (
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 }}
      className="relative aspect-square bg-[#111] group border border-white/[0.04] hover:border-white/10 transition-all rounded-sm overflow-hidden">

      <Image src={photo.thumbUrl || photo.url} alt={photo.alt || ''} fill
        className="object-cover" sizes="180px" />

      {/* Drag handle — always visible on mobile, hover on desktop */}
      <div {...attributes} {...listeners}
        className="absolute top-1.5 left-1.5 w-6 h-6 bg-black/60 rounded-sm flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity touch-none z-10">
        <GripVertical size={11} className="text-[#888]" />
      </div>

      {/* Action overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1">
          <button onClick={() => onCrop(photo)} title="Crop image"
            className="flex items-center gap-1 px-2 py-1 bg-black/70 rounded-sm text-[.55rem] text-white hover:bg-[#b8975a]/80 transition-colors">
            <Crop size={9} /> Crop
          </button>
          <button onClick={() => onEditAlt(photo)} title="Edit caption"
            className="flex items-center gap-1 px-2 py-1 bg-black/70 rounded-sm text-[.55rem] text-white hover:bg-white/20 transition-colors">
            <Edit2 size={9} /> Alt
          </button>
          <button onClick={() => onDelete(photo.id)} title="Delete"
            className="flex items-center gap-1 px-2 py-1 bg-black/70 rounded-sm text-[.55rem] text-red-400 hover:bg-red-500/60 transition-colors">
            <Trash2 size={9} /> Del
          </button>
        </div>
      </div>

      {/* Gallery badge */}
      {photo.gallery && (
        <div className="absolute top-1.5 right-1.5 bg-[#b8975a]/80 px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-[.5rem] text-white truncate max-w-[60px]">{photo.gallery.title}</p>
        </div>
      )}
    </div>
  )
}

/* ── Main ────────────────────────────────────────────── */
function PhotosContent() {
  const searchParams = useSearchParams()
  const galleryId    = searchParams.get('galleryId')

  const [photos,    setPhotos]    = useState<Photo[]>([])
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [tab,       setTab]       = useState<'grid'|'upload'>('grid')
  const [cropPhoto, setCropPhoto] = useState<Photo | null>(null)
  const [altPhoto,  setAltPhoto]  = useState<Photo | null>(null)
  const [altText,   setAltText]   = useState('')
  const [assignModal, setAssignModal] = useState<Photo | null>(null)
  const [assignTo,    setAssignTo]    = useState('')
  const { show, ToastContainer } = useToast()
  const { confirm, Dialog }      = useConfirm()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const load = useCallback(async () => {
    const url = galleryId ? `/api/photos?galleryId=${galleryId}` : '/api/photos'
    const [p, g] = await Promise.all([
      fetch(url).then(r => r.json()).catch(() => []),
      fetch('/api/galleries').then(r => r.json()).catch(() => []),
    ])
    setPhotos(Array.isArray(p) ? p : [])
    setGalleries(Array.isArray(g) ? g : [])
  }, [galleryId])

  useEffect(() => { load() }, [load])

  const del = async (id: string) => {
    const ok = await confirm('Delete this photo permanently?')
    if (!ok) return
    await fetch(`/api/photos/${id}`, { method:'DELETE' })
    show('Photo deleted', 'info'); load()
  }

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldI = photos.findIndex(p => p.id === active.id)
    const newI = photos.findIndex(p => p.id === over.id)
    const reordered = arrayMove(photos, oldI, newI).map((p, i) => ({ ...p, sortOrder: i }))
    setPhotos(reordered)
    await fetch('/api/photos', {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(reordered.map(p => ({ id:p.id, sortOrder:p.sortOrder }))),
    })
    show('Order saved ✓')
  }

  const saveAlt = async () => {
    if (!altPhoto) return
    await fetch(`/api/photos/${altPhoto.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ alt: altText }) })
    show('Caption saved ✓'); setAltPhoto(null); load()
  }

  const assign = async () => {
    if (!assignModal) return
    await fetch(`/api/photos/${assignModal.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ galleryId: assignTo || null }) })
    show('Photo assigned to gallery ✓'); setAssignModal(null); load()
  }

  const applyCrop = async (blob: Blob, _previewUrl: string) => {
    if (!cropPhoto) return
    const fd = new FormData()
    fd.append('files', new File([blob], `crop_${cropPhoto.id}.jpg`, { type:'image/jpeg' }))
    if (galleryId) fd.append('galleryId', galleryId)
    await fetch('/api/upload', { method:'POST', body: fd })
    // Delete old
    await fetch(`/api/photos/${cropPhoto.id}`, { method:'DELETE' })
    show('Cropped photo saved ✓'); setCropPhoto(null); load()
  }

  const currentGallery = galleries.find(g => g.id === galleryId)

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
        <div>
          <p className="text-[.6rem] tracking-[.22em] uppercase text-[#b8975a] mb-1">
            {currentGallery ? `Gallery: ${currentGallery.title}` : 'All Photos'}
          </p>
          <h1 className="text-2xl font-normal text-white" style={{ fontFamily:'Playfair Display, serif' }}>
            Photos
          </h1>
          <p className="text-[.62rem] text-[#444] mt-0.5">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} · Drag to reorder · Hover for options
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-[#111] border border-white/[0.06] p-1 rounded-sm">
          {[{key:'grid',label:'Grid'},{key:'upload',label:'Upload'}].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as 'grid'|'upload')}
              className={`flex items-center gap-1.5 px-4 py-2 text-[.65rem] tracking-wider uppercase rounded-sm transition-all ${
                tab === t.key ? 'bg-[#b8975a]/15 text-[#b8975a]' : 'text-[#555] hover:text-white'
              }`}>
              {t.key === 'upload' && <Upload size={11} />}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'upload' ? (
        <AdminCard title="Upload Photos" subtitle="Drag & drop your photos or click to browse">
          <PhotoUploader galleryId={galleryId || undefined} onUploaded={() => { load(); setTab('grid') }} />
        </AdminCard>
      ) : (
        <AdminCard title="Photo Grid" subtitle="Drag photos to reorder them">
          {photos.length === 0 ? (
            <Empty icon={Images} title="No photos here yet"
              body={galleryId ? "Upload photos to this gallery using the Upload tab above." : "Upload your first photos to get started."}
              action={<button onClick={() => setTab('upload')} className="text-[.65rem] tracking-wider text-[#b8975a] border border-[#b8975a]/30 px-4 py-2 hover:bg-[#b8975a]/10 transition-colors">
                Upload Photos
              </button>} />
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={photos.map(p => p.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
                  {photos.map(p => (
                    <PhotoCard key={p.id} photo={p}
                      onDelete={del}
                      onCrop={setCropPhoto}
                      onEditAlt={p => { setAltPhoto(p); setAltText(p.alt || '') }} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </AdminCard>
      )}

      {/* Crop modal */}
      {cropPhoto && (
        <Modal title="Crop Photo" onClose={() => setCropPhoto(null)} wide>
          <ImageCropper src={cropPhoto.url} onDone={applyCrop} onCancel={() => setCropPhoto(null)} />
        </Modal>
      )}

      {/* Alt text modal */}
      {altPhoto && (
        <Modal title="Edit Photo Caption" onClose={() => setAltPhoto(null)}>
          <div className="space-y-4">
            <div className="aspect-video relative overflow-hidden rounded-sm bg-[#111]">
              <Image src={altPhoto.thumbUrl || altPhoto.url} alt="" fill className="object-contain" sizes="500px" />
            </div>
            <Field label="Alt Text / Caption" hint="Describes the photo for accessibility and SEO">
              <input value={altText} onChange={e => setAltText(e.target.value)}
                placeholder="e.g. Bride and groom at sunset in Montego Bay"
                className="w-full bg-[#111] border border-white/[0.08] px-3.5 py-2.5 text-sm text-white placeholder-[#333] outline-none focus:border-[#b8975a]/50 transition-all rounded-sm"
                onKeyDown={e => e.key === 'Enter' && saveAlt()} autoFocus />
            </Field>
            <div className="flex gap-3">
              <button onClick={saveAlt} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#b8975a] text-[#080808] text-[.65rem] tracking-[.18em] uppercase hover:bg-[#d4b37a] transition-colors">
                <Check size={13} /> Save Caption
              </button>
              <GhostBtn onClick={() => setAltPhoto(null)} className="flex-1 justify-center">Cancel</GhostBtn>
            </div>
          </div>
        </Modal>
      )}

      <ToastContainer />
      <Dialog />
    </div>
  )
}

export default function PhotosPage() {
  return <Suspense fallback={<div className="text-[#444] text-sm p-8">Loading…</div>}><PhotosContent /></Suspense>
}
