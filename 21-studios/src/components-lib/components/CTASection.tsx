'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Reveal, { LineReveal } from './Reveal'
import { ArrowUpRight } from 'lucide-react'

interface CTAProps {
  headline?: string
  subtext?:  string
}

export default function CTASection({
  headline = "Let's Create Something Timeless",
  subtext  = 'Limited availability each season. Inquire now to check dates and begin crafting your vision.',
}: CTAProps) {
  const ref  = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rawY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const y    = useSpring(rawY, { stiffness: 50, damping: 20 })

  // Split last word for gold italic
  const words = headline.trim().split(/\s+/)
  const main  = words.slice(0, -1).join(' ')
  const last  = words[words.length - 1]

  return (
    <section ref={ref} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0 scale-[1.2]" style={{ y }}>
        <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=85&w=2800&auto=format&fit=crop"
          alt="Book a shoot" fill className="object-cover" sizes="100vw" />
      </motion.div>
      <div className="absolute inset-0 bg-void/72" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-void/80" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <Reveal><p className="section-tag mb-6 text-center">— Limited Availability Each Season</p></Reveal>
        <h2 className="font-display text-[clamp(3rem,9vw,7.5rem)] font-normal leading-none mb-8">
          <LineReveal><span className="text-ivory">{main} </span></LineReveal>
          <LineReveal delay={.14}><em className="italic text-gold">{last}</em></LineReveal>
        </h2>
        <Reveal delay={.25}>
          <p className="font-body font-light text-smoke text-base max-w-sm mx-auto leading-relaxed mb-10">
            {subtext}
          </p>
        </Reveal>
        <Reveal delay={.35}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/booking" className="btn-gold">Book Your Session <ArrowUpRight size={14} /></Link>
            <Link href="/portfolio" className="btn-ghost">View Portfolio</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
