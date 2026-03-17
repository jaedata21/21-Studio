'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CTASection     from '@/components/CTASection'
import Reveal, { LineReveal, LineWipe } from '@/components/Reveal'
import MasonryGallery from '@/components/MasonryGallery'
import { GalleryImage } from '@/lib/galleryData'

interface ApiPhoto {
  id: string; url: string; thumbUrl: string | null; alt: string | null
  width: number; height: number; gallery: { title: string } | null
}

const DB_CATEGORIES = ['All'] as string[]

export default function PortfolioPage() {
  const [filter,   setFilter]   = useState('All')
  const [images,   setImages]   = useState<GalleryImage[]>([])
  const [cats,     setCats]     = useState<string[]>(DB_CATEGORIES)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetch('/api/photos')
      .then(r => r.json())
      .then((data: ApiPhoto[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          // Fall back to static gallery data
          import('@/lib/galleryData').then(m => {
            setImages(m.images)
            setCats(m.categories)
            setLoading(false)
          })
          return
        }

        const mapped: GalleryImage[] = data.map((p, i) => ({
          id:       i + 1,
          src:      p.url,
          alt:      p.alt || 'Photo',
          category: p.gallery?.title || 'Uncategorised',
          title:    p.alt || `Photo ${i + 1}`,
          width:    p.width,
          height:   p.height,
        }))

        const unique = ['All', ...Array.from(new Set(mapped.map(m => m.category)))]
        setImages(mapped)
        setCats(unique)
        setLoading(false)
      })
      .catch(() => {
        import('@/lib/galleryData').then(m => {
          setImages(m.images)
          setCats(m.categories)
          setLoading(false)
        })
      })
  }, [])

  return (
    <>
      <section className="pt-44 pb-14 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1440px] mx-auto">
          <Reveal><p className="section-tag mb-5">— Portfolio</p></Reveal>
          <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-normal leading-none mb-12">
            <LineReveal><span className="text-ivory">The </span></LineReveal>
            <LineReveal delay={.12}><em className="italic text-gold">Work</em></LineReveal>
          </h1>
          <LineWipe className="mb-12" />

          {/* Filter tabs */}
          <Reveal delay={.15}>
            <div className="flex flex-wrap gap-2 mb-14">
              {cats.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`font-mono text-[.6rem] tracking-[.2em] uppercase px-5 py-2.5 border transition-all duration-350 ${
                    filter === cat
                      ? 'border-gold bg-gold text-void'
                      : 'border-white/10 text-smoke hover:border-white/30 hover:text-parchment'
                  }`}>
                  {cat}
                  {cat !== 'All' && (
                    <span className="ml-2 opacity-50">{images.filter(i => i.category === cat).length}</span>
                  )}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Gallery */}
          {loading ? (
            <div className="flex items-center justify-center py-28">
              <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .45 }}>
              <MasonryGallery images={images} filter={filter} />
            </motion.div>
          )}
        </div>
      </section>
      <CTASection />
    </>
  )
}
