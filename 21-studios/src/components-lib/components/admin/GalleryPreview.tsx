'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Monitor, Smartphone, Tablet, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Photo { id: string; url: string; thumbUrl: string | null; alt: string | null }
interface Props  { title: string; photos: Photo[] }

const viewports = [
  { key: 'desktop',  icon: Monitor,     label: 'Desktop',  cols: 'grid-cols-3' },
  { key: 'tablet',   icon: Tablet,      label: 'Tablet',   cols: 'grid-cols-2' },
  { key: 'mobile',   icon: Smartphone,  label: 'Mobile',   cols: 'grid-cols-1' },
] as const

export default function GalleryPreview({ title, photos }: Props) {
  const [viewport,   setViewport]   = useState<'desktop'|'tablet'|'mobile'>('desktop')
  const [lightbox,   setLightbox]   = useState<number | null>(null)

  const cols = viewports.find(v => v.key === viewport)!.cols

  return (
    <div className="flex flex-col gap-4">
      {/* Viewport switcher */}
      <div className="flex items-center justify-between">
        <p className="text-[.6rem] tracking-[.2em] uppercase text-[#555]">
          {photos.length} photos · Live preview
        </p>
        <div className="flex items-center gap-1 bg-[#111] border border-white/[0.06] p-1 rounded-sm">
          {viewports.map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setViewport(key)} title={label}
              className={`p-1.5 rounded-sm transition-all ${viewport === key ? 'bg-[#b8975a]/15 text-[#b8975a]' : 'text-[#444] hover:text-white'}`}>
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Preview frame */}
      <div className={`bg-[#080808] border border-white/[0.06] rounded-sm overflow-hidden transition-all duration-300 ${
        viewport === 'mobile' ? 'max-w-xs mx-auto' : viewport === 'tablet' ? 'max-w-lg mx-auto' : 'w-full'
      }`}>
        {/* Mock browser bar */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.05] bg-[#0a0a0a]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
          </div>
          <div className="flex-1 bg-[#111] rounded-sm px-2 py-0.5 text-[.55rem] text-[#333] text-center">
            21studios.com/portfolio · {title}
          </div>
        </div>

        {/* Gallery grid */}
        <div className={`grid ${cols} gap-1 p-1 min-h-[200px]`}>
          {photos.length === 0 ? (
            <div className={`${cols === 'grid-cols-3' ? 'col-span-3' : cols === 'grid-cols-2' ? 'col-span-2' : ''} flex items-center justify-center py-16 text-[#333] text-xs`}>
              No photos yet
            </div>
          ) : (
            photos.map((p, i) => (
              <button key={p.id} className="relative aspect-square group overflow-hidden bg-[#111]"
                onClick={() => setLightbox(i)}>
                <Image src={p.thumbUrl || p.url} alt={p.alt || ''} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.05]" sizes="300px" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ZoomIn size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[990] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4" onClick={e => e.stopPropagation()}>
            <Image src={photos[lightbox].url} alt="" width={1200} height={800}
              className="object-contain max-h-[85vh] w-auto mx-auto" />
            <div className="absolute bottom-0 left-0 right-0 text-center py-3">
              <p className="text-[.6rem] text-[#555] tracking-wider">{lightbox + 1} / {photos.length}</p>
            </div>
          </div>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors"><X size={18} /></button>
          {lightbox > 0 && (
            <button onClick={() => setLightbox(i => i! - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"><ChevronLeft size={28} /></button>
          )}
          {lightbox < photos.length - 1 && (
            <button onClick={() => setLightbox(i => i! + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"><ChevronRight size={28} /></button>
          )}
        </div>
      )}
    </div>
  )
}
