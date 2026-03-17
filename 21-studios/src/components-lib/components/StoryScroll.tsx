'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Reveal, { LineReveal, LineWipe } from './Reveal'

const panels = [
  {
    num: '01', title: 'Every Frame,', titleEm: 'a Story',
    body: 'We believe photography transcends documentation. It is the art of revealing what the eye overlooks — the pause between heartbeats, the light that falls just so.',
    img: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=85&w=2400&auto=format&fit=crop',
    flip: false,
  },
  {
    num: '02', title: 'Light is', titleEm: 'Our Medium',
    body: 'Golden hour. Blue hour. Studio strobes. We choreograph each shoot around light — sculpting depth, warmth, and dimension into every image we create.',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=85&w=2400&auto=format&fit=crop',
    flip: true,
  },
  {
    num: '03', title: 'Moments That', titleEm: 'Last Forever',
    body: 'From the first glance to the final dance, we document with discretion and artistry. Your memories deserve nothing less than obsessive perfection.',
    img: 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?q=85&w=2400&auto=format&fit=crop',
    flip: false,
  },
]

function Panel({ p, i }: { p: typeof panels[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rawY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const imgY = useSpring(rawY, { stiffness: 50, damping: 18 })
  const revealX = useTransform(scrollYProgress, [.1, .45], ['100%', '0%'])

  return (
    <div ref={ref}
      className={`flex flex-col ${p.flip ? 'md:flex-row-reverse' : 'md:flex-row'} min-h-[75vh]`}>

      {/* Image side */}
      <div className="relative flex-1 overflow-hidden min-h-[55vw] md:min-h-0">
        <motion.div className="absolute inset-0 scale-[1.18]" style={{ y: imgY }}>
          <Image src={p.img} alt={p.title} fill
            className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
        </motion.div>

        {/* Clip-path unveil */}
        <motion.div
          className="absolute inset-0 bg-void"
          style={{ clipPath: revealX.get() === '0%' ? undefined : undefined }}
          initial={{ scaleX: 1, transformOrigin: p.flip ? 'right' : 'left' }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true, amount: .3 }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }} />

        {/* Number watermark */}
        <span className="absolute bottom-6 right-6 font-display text-[6rem] font-normal leading-none text-white/[.04] select-none">
          {p.num}
        </span>
      </div>

      {/* Text side */}
      <div className={`flex-1 flex flex-col justify-center bg-ink py-20 md:py-32 px-8 md:px-16 lg:px-24 ${p.flip ? 'md:pr-20' : 'md:pl-20'}`}>
        <Reveal delay={.05}>
          <p className="section-tag mb-6">— {p.num}</p>
        </Reveal>

        <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] font-normal leading-[1.05] mb-6">
          <LineReveal delay={.1}><span className="text-ivory">{p.title}</span></LineReveal>
          <LineReveal delay={.22}><em className="italic text-gold">{p.titleEm}</em></LineReveal>
        </h2>

        <LineWipe className="mb-7 max-w-[60px]" delay={.3} />

        <Reveal delay={.35}>
          <p className="font-body font-light text-smoke text-[.95rem] leading-[2] max-w-[340px]">{p.body}</p>
        </Reveal>
      </div>
    </div>
  )
}

export default function StoryScroll() {
  return (
    <section>
      {panels.map((p, i) => <Panel key={p.num} p={p} i={i} />)}
    </section>
  )
}
