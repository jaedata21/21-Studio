'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion'
import Reveal, { LineReveal } from './Reveal'
import { ArrowUpRight } from 'lucide-react'

/* ─── Image data — 5 columns, varied heights ─────────────── */
const columns = [
  // Column 0 — slowest (speed 0.18), starts lowest
  {
    speed: 0.18,
    initialY: 60,
    images: [
      { src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=900&auto=format&fit=crop', label: 'Wedding',   ratio: '3/4'  },
      { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=900&auto=format&fit=crop', label: 'Editorial', ratio: '4/3'  },
      { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop', label: 'Fashion',   ratio: '2/3'  },
    ],
  },
  // Column 1 — slow (speed 0.3), starts high
  {
    speed: 0.30,
    initialY: -40,
    images: [
      { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=900&auto=format&fit=crop', label: 'Portrait',  ratio: '2/3'  },
      { src: 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?q=80&w=900&auto=format&fit=crop', label: 'Wedding',   ratio: '4/5'  },
      { src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=900&auto=format&fit=crop', label: 'Commercial', ratio: '4/3'  },
    ],
  },
  // Column 2 — medium (speed 0.48), centre anchor
  {
    speed: 0.48,
    initialY: 20,
    images: [
      { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop', label: 'Wedding',   ratio: '3/4'  },
      { src: 'https://images.unsplash.com/photo-1537795479-cf48d1bf9a9c?q=80&w=900&auto=format&fit=crop', label: 'Editorial', ratio: '3/2'  },
      { src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=900&auto=format&fit=crop', label: 'Wedding',   ratio: '4/3'  },
    ],
  },
  // Column 3 — fast (speed 0.65), starts very low
  {
    speed: 0.65,
    initialY: 80,
    images: [
      { src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop', label: 'Portrait',  ratio: '3/4'  },
      { src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=900&auto=format&fit=crop', label: 'Event',     ratio: '4/3'  },
      { src: 'https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?q=80&w=900&auto=format&fit=crop', label: 'Landscape', ratio: '3/4'  },
    ],
  },
  // Column 4 — fastest (speed 0.82), starts highest
  {
    speed: 0.82,
    initialY: -60,
    images: [
      { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=900&auto=format&fit=crop', label: 'Nature',    ratio: '2/3'  },
      { src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=900&auto=format&fit=crop', label: 'Portrait',  ratio: '3/4'  },
      { src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=900&auto=format&fit=crop', label: 'Fine Art',  ratio: '4/3'  },
    ],
  },
]

/* ─── Single image card ──────────────────────────────────── */
function ParallaxCard({
  src, label, ratio,
}: { src: string; label: string; ratio: string }) {
  return (
    <Link href="/portfolio" className="block group relative overflow-hidden" data-hover>
      <div style={{ aspectRatio: ratio }} className="relative overflow-hidden bg-graphite">
        <Image
          src={src} alt={label} fill
          className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.08]"
          sizes="(max-width:640px) 50vw, 22vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Category label */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <span className="font-mono text-[.55rem] tracking-[.22em] uppercase text-gold">
            {label}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-display text-sm italic text-ivory">View work</span>
            <ArrowUpRight size={10} className="text-ivory" />
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─── One column with spring-dampened parallax ───────────── */
function ParallaxColumn({
  col,
  scrollY,
  index,
}: {
  col: typeof columns[0]
  scrollY: MotionValue<number>
  index: number
}) {
  // Each column transforms by a different multiple of scrollY
  // Faster columns (higher speed) travel more px for the same scroll
  const rawY    = useTransform(scrollY, (v) => v * col.speed * -1 + col.initialY)
  const springY = useSpring(rawY, { stiffness: 38, damping: 16, restDelta: 0.001 })

  return (
    <motion.div
      className="flex flex-col gap-3 md:gap-4 will-change-transform"
      style={{ y: springY }}
      initial={{ opacity: 0, y: col.initialY + 40 }}
      whileInView={{ opacity: 1, y: col.initialY }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 1.1, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
    >
      {col.images.map((img) => (
        <ParallaxCard key={img.src} {...img} />
      ))}
    </motion.div>
  )
}

/* ─── Main export ────────────────────────────────────────── */
export default function ParallaxGallery() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // Scroll position relative to the section entering the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Convert 0–1 progress into a pixel range each column can multiply
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 800])

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Subtle radial vignette to bleed edges into the page */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse 100% 60% at 50% 50%, transparent 55%, var(--void) 100%)',
        }}
      />

      <div className="max-w-[1440px] mx-auto">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-20">
          <div>
            <Reveal>
              <p className="section-tag mb-4">— In Motion</p>
            </Reveal>
            <h2 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] font-normal leading-none">
              <LineReveal>
                <span className="text-ivory">Every </span>
              </LineReveal>
              <LineReveal delay={0.12}>
                <em className="italic text-gold">Frame</em>
              </LineReveal>
            </h2>
          </div>
          <Reveal delay={0.2}>
            <div className="flex flex-col items-start md:items-end gap-3 pb-1">
              <p className="font-body font-light text-sm text-smoke max-w-xs leading-relaxed">
                A living archive — scroll to move through our world.
              </p>
              <Link href="/portfolio" className="btn-text">
                Full portfolio <ArrowUpRight size={11} />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* ── 5-column parallax grid ── */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4"
          style={{ height: 'clamp(560px, 90vh, 900px)' }}
        >
          {columns.map((col, i) => (
            <ParallaxColumn
              key={i}
              col={col}
              scrollY={scrollY}
              index={i}
            />
          ))}
        </div>

        {/* CTA pill at bottom */}
        <Reveal delay={0.1} className="relative z-20 flex justify-center mt-16">
          <Link href="/portfolio" className="btn-gold">
            Explore Full Portfolio <ArrowUpRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
