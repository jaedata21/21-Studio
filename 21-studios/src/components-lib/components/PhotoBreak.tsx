'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface PhotoBreakProps {
  src: string
  quote: string
  author?: string
}

export default function PhotoBreak({ src, quote, author }: PhotoBreakProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rawY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])
  const y    = useSpring(rawY, { stiffness: 50, damping: 20 })
  const scale = useTransform(scrollYProgress, [0, .5, 1], [1.08, 1.03, 1.08])
  const textY = useTransform(scrollYProgress, [.2, .7], ['20px', '-20px'])
  const textO = useTransform(scrollYProgress, [.2, .4, .65, .8], [0, 1, 1, 0])

  return (
    <div ref={ref} className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Parallax image */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image src={src} alt="" fill className="object-cover" sizes="100vw" />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-void/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/40" />

      {/* Quote */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
        style={{ y: textY, opacity: textO }}>
        <span className="font-display text-[5rem] text-gold/15 leading-none select-none mb-2">"</span>
        <p className="font-display text-[clamp(1.4rem,3.5vw,2.6rem)] font-normal italic text-ivory leading-[1.35] max-w-3xl">
          {quote}
        </p>
        {author && (
          <p className="font-mono text-[.6rem] tracking-[.28em] uppercase text-gold mt-6">{author}</p>
        )}
      </motion.div>
    </div>
  )
}
