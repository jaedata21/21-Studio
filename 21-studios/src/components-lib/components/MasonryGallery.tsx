'use client'
import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { GalleryImage } from '@/lib/galleryData'

/* ── Lightbox ── */
function Lightbox({ images, index, onClose, onPrev, onNext }: {
  images: GalleryImage[]; index: number
  onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [onClose, onPrev, onNext])

  const img = images[index]

  return (
    <motion.div className="fixed inset-0 z-[800] flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: .3 }}>
      <div className="absolute inset-0 bg-void/96 backdrop-blur-xl" onClick={onClose} />

      <motion.div key={index} className="relative z-10 max-w-[88vw] max-h-[88vh]"
        initial={{ opacity: 0, scale: .94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: .97 }}
        transition={{ duration: .5, ease: [0.16, 1, 0.3, 1] }}>
        <Image src={img.src} alt={img.alt}
          width={img.width} height={img.height}
          className="object-contain max-h-[82vh] w-auto max-w-[86vw]"
          priority />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-void/80 to-transparent">
          <p className="font-display text-xl italic text-ivory">{img.title}</p>
          <p className="font-mono text-[.58rem] tracking-[.2em] uppercase text-gold mt-0.5">{img.category}</p>
        </div>
      </motion.div>

      <button onClick={onClose} aria-label="Close"
        className="absolute top-5 right-5 z-20 w-10 h-10 border border-white/20 bg-void/60 backdrop-blur-sm flex items-center justify-center text-ivory hover:border-gold hover:text-gold transition-colors">
        <X size={15} />
      </button>
      <button onClick={onPrev} disabled={index === 0} aria-label="Previous"
        className="absolute left-4 z-20 w-11 h-11 border border-white/20 bg-void/60 backdrop-blur-sm flex items-center justify-center text-ivory hover:border-gold hover:text-gold transition-colors disabled:opacity-20">
        <ChevronLeft size={16} />
      </button>
      <button onClick={onNext} disabled={index === images.length - 1} aria-label="Next"
        className="absolute right-4 z-20 w-11 h-11 border border-white/20 bg-void/60 backdrop-blur-sm flex items-center justify-center text-ivory hover:border-gold hover:text-gold transition-colors disabled:opacity-20">
        <ChevronRight size={16} />
      </button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
        <span className="font-mono text-[.6rem] tracking-wider text-smoke">{index + 1} / {images.length}</span>
      </div>
    </motion.div>
  )
}

/* ── Card ── */
function Card({ img, index, onClick }: { img: GalleryImage; index: number; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <motion.div className="masonry-item group cursor-pointer" data-hover
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .7, delay: (index % 9) * .06, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}>
      <div className="relative overflow-hidden bg-charcoal">
        <div style={{ paddingBottom: `${(img.height / img.width) * 100}%` }} className="relative">
          {!loaded && <div className="skeleton absolute inset-0" />}
          <Image src={img.src} alt={img.alt} fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            className={`object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.07] ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          <div className="flex justify-end">
            <div className="w-8 h-8 border border-white/30 bg-void/50 backdrop-blur-sm flex items-center justify-center">
              <ZoomIn size={12} className="text-ivory" />
            </div>
          </div>
          <div>
            <span className="font-mono text-[.55rem] tracking-[.2em] uppercase text-gold border border-gold/30 px-2 py-0.5 bg-void/40 backdrop-blur-sm">{img.category}</span>
            <p className="font-display text-lg italic text-ivory mt-1.5 leading-tight">{img.title}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main export ── */
export default function MasonryGallery({ images, filter = 'All' }: { images: GalleryImage[]; filter?: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const filtered = filter === 'All' ? images : images.filter(i => i.category === filter)

  const open  = useCallback((i: number) => setLightbox(i), [])
  const close = useCallback(() => setLightbox(null), [])
  const prev  = useCallback(() => setLightbox(i => i !== null && i > 0 ? i - 1 : i), [])
  const next  = useCallback(() => setLightbox(i => i !== null && i < filtered.length - 1 ? i + 1 : i), [filtered.length])

  return (
    <>
      <div className="masonry">
        <AnimatePresence>
          {filtered.map((img, i) => (
            <Card key={img.id} img={img} index={i} onClick={() => open(i)} />
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox images={filtered} index={lightbox} onClose={close} onPrev={prev} onNext={next} />
        )}
      </AnimatePresence>
    </>
  )
}
