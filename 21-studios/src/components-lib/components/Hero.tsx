'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

interface HeroProps {
  headline?: string
  subtext?:  string
  image?:    string
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1537795479-cf48d1bf9a9c?q=90&w=2800&auto=format&fit=crop'

export default function Hero({ headline = '21 Studios', subtext = 'Where light becomes legacy', image = FALLBACK_IMG }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const rawImgY  = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const imgY     = useSpring(rawImgY, { stiffness: 60, damping: 20 })
  const overlayO = useTransform(scrollYProgress, [0, .7], [0.38, 0.9])
  const contentY = useTransform(scrollYProgress, [0, .6], ['0%', '22%'])
  const contentO = useTransform(scrollYProgress, [0, .45], [1, 0])

  // Split headline into words — last word gets gold italic
  const words = headline.trim().split(/\s+/)
  const main  = words.slice(0, -1).join(' ')
  const last  = words[words.length - 1]

  return (
    <div ref={ref} className="relative h-screen min-h-[700px] overflow-hidden">
      <motion.div className="absolute inset-0 scale-[1.15]" style={{ y: imgY }}>
        <Image src={image} alt={headline} fill priority className="object-cover object-center" sizes="100vw" quality={95} />
      </motion.div>

      <motion.div className="absolute inset-0 bg-void" style={{ opacity: overlayO }} />
      <div className="absolute inset-0 bg-gradient-to-b from-void/50 via-transparent to-void" />
      <div className="absolute inset-0 bg-gradient-to-r from-void/60 via-transparent to-transparent" />

      <motion.div
        className="relative z-10 h-full flex flex-col justify-end pb-28 md:pb-36 px-6 md:px-14 lg:px-20"
        style={{ y: contentY, opacity: contentO }}>
        <div className="max-w-[1440px] mx-auto w-full">
          <motion.div className="flex items-center gap-4 mb-7"
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .9, delay: .5, ease: [0.16, 1, 0.3, 1] }}>
            <span className="block w-8 h-px bg-gold" />
            <span className="section-tag">Premium Photography — Est. 2021</span>
          </motion.div>

          <h1 className="font-display font-normal leading-[.88] tracking-[-0.03em] text-[clamp(4.5rem,13vw,12rem)] mb-3">
            {main && (
              <div className="clip-parent inline-block mr-[.18em]">
                <motion.span className="block text-ivory"
                  initial={{ y: '115%', skewY: 3 }} animate={{ y: '0%', skewY: 0 }}
                  transition={{ duration: 1.1, delay: .6, ease: [0.16, 1, 0.3, 1] }}>
                  {main}
                </motion.span>
              </div>
            )}
            <div className="clip-parent inline-block">
              <motion.span className="block italic text-gold"
                initial={{ y: '115%', skewY: 3 }} animate={{ y: '0%', skewY: 0 }}
                transition={{ duration: 1.1, delay: main ? .75 : .6, ease: [0.16, 1, 0.3, 1] }}>
                {last}
              </motion.span>
            </div>
          </h1>

          <div className="clip-parent mb-10">
            <motion.p className="font-body text-[clamp(.85rem,1.2vw,1.1rem)] font-light text-silver tracking-[.18em] uppercase"
              initial={{ y: '110%' }} animate={{ y: '0%' }}
              transition={{ duration: .9, delay: .95, ease: [0.16, 1, 0.3, 1] }}>
              {subtext}
            </motion.p>
          </div>

          <motion.div className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}>
            <Link href="/portfolio" className="btn-gold">View Portfolio</Link>
            <Link href="/booking"   className="btn-ghost">Book a Shoot</Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="absolute bottom-10 right-12 z-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: .8 }}>
        <span className="section-tag" style={{ writingMode: 'vertical-rl', letterSpacing: '.25em' }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={13} className="text-gold" />
        </motion.div>
      </motion.div>
    </div>
  )
}
