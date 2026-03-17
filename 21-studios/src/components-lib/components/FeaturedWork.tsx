'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import Reveal, { LineReveal, LineWipe, Stagger, StaggerItem } from './Reveal'
import { ArrowUpRight } from 'lucide-react'

const projects = [
  {
    id: 1, title: 'Amara & Elijah',   category: 'Wedding',    year: '2024',
    location: 'Montego Bay, Jamaica',
    img: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2400&auto=format&fit=crop',
    span: 'row-span-2',
  },
  {
    id: 2, title: 'Golden Hour',       category: 'Editorial',  year: '2024',
    location: 'Negril Cliffs',
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1800&auto=format&fit=crop',
    span: '',
  },
  {
    id: 3, title: 'Studio Portraits',  category: 'Portrait',   year: '2024',
    location: 'Kingston Studio',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1800&auto=format&fit=crop',
    span: '',
  },
  {
    id: 4, title: 'Soleil Campaign',   category: 'Commercial', year: '2023',
    location: 'Paradise Beach',
    img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2400&auto=format&fit=crop',
    span: 'col-span-2',
  },
]

function Card({ p, i }: { p: typeof projects[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <Reveal delay={i * .1} className={`group ${p.span}`}>
      <Link href={`/portfolio#${p.id}`} className="block h-full">
        <div className="relative overflow-hidden h-full min-h-[320px] bg-charcoal" ref={ref} data-hover>

          {/* Parallax image */}
          <motion.div className="absolute inset-0 scale-[1.15]" style={{ y: imgY }}>
            <Image src={p.img} alt={p.title} fill
              className="object-cover transition-none"
              sizes="(max-width:768px) 100vw, 50vw" />
          </motion.div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-700" />

          {/* Top badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="font-mono text-[.6rem] tracking-[.2em] uppercase text-gold border border-gold/30 px-3 py-1 bg-void/40 backdrop-blur-sm">
              {p.category}
            </span>
          </div>

          {/* Arrow */}
          <div className="absolute top-4 right-4 z-10 w-9 h-9 border border-white/20 flex items-center justify-center bg-void/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
            <ArrowUpRight size={13} className="text-ivory" />
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <p className="font-body text-[.6rem] tracking-[.2em] uppercase text-gold/70 mb-1">{p.location}</p>
            <h3 className="font-display text-2xl font-normal text-ivory italic">{p.title}</h3>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

export default function FeaturedWork() {
  return (
    <section className="py-28 md:py-40 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <Reveal><p className="section-tag mb-4">— Selected Work</p></Reveal>
            <h2 className="font-display text-[clamp(2.8rem,7vw,6rem)] font-normal leading-none">
              <LineReveal>
                <span className="text-ivory">Featured </span>
              </LineReveal>
              <LineReveal delay={.12}>
                <em className="italic text-gold">Projects</em>
              </LineReveal>
            </h2>
          </div>
          <Reveal delay={.2}>
            <div className="flex flex-col items-start md:items-end gap-3 pb-1">
              <p className="font-body font-light text-sm text-smoke max-w-xs leading-relaxed">
                Each frame a deliberate act. Each session a collaboration built on trust and vision.
              </p>
              <Link href="/portfolio" className="btn-text">
                View all work <ArrowUpRight size={11} />
              </Link>
            </div>
          </Reveal>
        </div>

        <LineWipe className="mb-12" />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[380px]">
          {projects.map((p, i) => <Card key={p.id} p={p} i={i} />)}
        </div>

        {/* Stats */}
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-14 border-t border-white/[0.06]" delay={.1}>
          {[['340+','Sessions'],['12','Countries'],['8','Awards'],['99%','Satisfaction']].map(([n,l]) => (
            <StaggerItem key={l}>
              <p className="font-display text-[clamp(3rem,6vw,5rem)] font-normal text-ivory leading-none">{n}</p>
              <p className="font-mono text-[.6rem] tracking-[.22em] uppercase text-smoke mt-2">{l}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
