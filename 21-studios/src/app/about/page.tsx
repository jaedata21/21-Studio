'use client'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Reveal, { LineReveal, LineWipe } from '@/components/Reveal'
import CTASection from '@/components/CTASection'
import { ArrowUpRight } from 'lucide-react'

type CMS = Record<string, string>

const services = [
  { n:'01', title:'Wedding Photography',  desc:'Full-day cinematic coverage. We capture the poetry between moments — from quiet morning preparations to the final dance.' },
  { n:'02', title:'Portrait Sessions',    desc:'Personal and professional portraits revealing authentic character. Studio or location, built on ease and genuine connection.' },
  { n:'03', title:'Editorial & Fashion',  desc:'Magazine-quality storytelling for brands and publications who demand imagery that commands attention and stops the scroll.' },
  { n:'04', title:'Commercial & Brand',   desc:'Strategic photography for businesses ready to elevate their visual identity. Images that work as hard as you do.' },
]

const awards = [
  { year:'2024', title:'Caribbean Wedding Photographer of the Year', org:'CWPA' },
  { year:'2023', title:'Best Editorial Shoot',                       org:'Jamaica Creatives' },
  { year:'2023', title:'Top 10 Emerging Photographers',              org:'PhotoVogue' },
  { year:'2022', title:'Excellence in Portrait Photography',         org:'IPA' },
]

export default function AboutPage() {
  const [cms, setCms] = useState<CMS>({})
  useEffect(() => {
    fetch('/api/content?group=about').then(r => r.json()).then(setCms).catch(() => {})
  }, [])

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] })
  const rawY = useTransform(scrollYProgress, [0,1], ['0%','22%'])
  const imgY = useSpring(rawY, { stiffness: 55, damping: 18 })
  const ovO  = useTransform(scrollYProgress, [0,.8], [.45, .88])

  const name     = cms.photographer_name  || 'Jordan Campbell'
  const title    = cms.photographer_title || 'Lead Photographer & Creative Director'
  const headline = cms.about_headline     || 'The Vision Behind the Lens'
  const quote    = cms.about_quote        || 'I believe every frame holds the power to contain an entire world.'
  const body     = cms.about_body         || "Founded in 2021, 21 Studios began as a personal pursuit and grew into Jamaica's most sought-after photography studio."

  return (
    <>
      {/* Hero */}
      <div ref={heroRef} className="relative h-[78vh] min-h-[560px] overflow-hidden">
        <motion.div className="absolute inset-0 scale-[1.15]" style={{ y: imgY }}>
          <Image src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=85&w=2800&auto=format&fit=crop"
            alt={headline} fill priority className="object-cover object-center" sizes="100vw" />
        </motion.div>
        <motion.div className="absolute inset-0 bg-void" style={{ opacity: ovO }} />
        <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-transparent to-void" />

        <div className="relative z-10 h-full flex items-end pb-20 px-6 md:px-12 lg:px-20">
          <div className="max-w-[1440px] mx-auto w-full">
            <motion.p className="section-tag mb-4" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:.35, duration:.8, ease:[0.16,1,0.3,1] }}>
              — About the Artist
            </motion.p>
            <h1 className="font-display text-[clamp(3rem,9vw,8rem)] font-normal leading-none">
              <div className="clip-parent">
                <motion.span className="block text-ivory" initial={{ y:'112%' }} animate={{ y:'0%' }} transition={{ delay:.45, duration:1, ease:[0.16,1,0.3,1] }}>
                  {headline.split(' ').slice(0,-2).join(' ')}
                </motion.span>
              </div>
              <div className="clip-parent">
                <motion.span className="block italic text-gold" initial={{ y:'112%' }} animate={{ y:'0%' }} transition={{ delay:.58, duration:1, ease:[0.16,1,0.3,1] }}>
                  {headline.split(' ').slice(-2).join(' ')}
                </motion.span>
              </div>
            </h1>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="py-28 md:py-40 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-16 md:gap-28 items-start">
          <div className="md:sticky md:top-28">
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden mb-6 img-zoom">
                <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1400&auto=format&fit=crop"
                  alt={name} fill className="object-cover" sizes="400px" />
              </div>
            </Reveal>
            <Reveal delay={.1}>
              <p className="font-display text-2xl font-normal text-ivory">{name}</p>
              <p className="font-mono text-[.58rem] tracking-[.2em] uppercase text-gold mt-1.5">{title}</p>
            </Reveal>
            <Reveal delay={.15}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn-text mt-5 inline-flex">
                Instagram <ArrowUpRight size={10} />
              </a>
            </Reveal>
          </div>

          <div>
            <Reveal delay={.1}>
              <blockquote className="font-display text-[clamp(1.5rem,2.8vw,2.1rem)] font-normal italic text-ivory leading-[1.55] mb-8">
                "{quote}"
              </blockquote>
            </Reveal>
            <LineWipe className="mb-9 max-w-[80px]" delay={.18} />
            {body.split('\n').filter(Boolean).map((para, i) => (
              <Reveal key={i} delay={.22 + i * .09}>
                <p className="font-body font-light text-smoke text-[.95rem] leading-[2] mb-5">{para}</p>
              </Reveal>
            ))}

            {/* Awards */}
            <Reveal delay={.52}>
              <p className="font-mono text-[.6rem] tracking-[.22em] uppercase text-gold mt-14 mb-6">Recognition</p>
              <div className="space-y-4">
                {awards.map((a, i) => (
                  <Reveal key={a.title} delay={.56 + i * .07}>
                    <div className="flex items-baseline gap-6 pb-4 border-b border-white/[0.06]">
                      <span className="font-display text-4xl font-normal text-gold/20 w-16 shrink-0">{a.year}</span>
                      <div>
                        <p className="font-body text-sm text-parchment">{a.title}</p>
                        <p className="font-mono text-[.58rem] tracking-wider text-smoke mt-0.5">{a.org}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 md:py-36 px-6 md:px-12 lg:px-20 bg-charcoal/15">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16">
            <Reveal><p className="section-tag mb-4">— What We Offer</p></Reveal>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-none">
              <LineReveal><span className="text-ivory">Our </span></LineReveal>
              <LineReveal delay={.1}><em className="italic text-gold">Services</em></LineReveal>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04]">
            {services.map((s, i) => (
              <Reveal key={s.n} delay={i * .08}>
                <div className="bg-obsidian p-10 md:p-12 group hover:bg-ink transition-colors duration-500">
                  <span className="font-display text-[4rem] leading-none font-normal text-gold/[.08] select-none block mb-4">{s.n}</span>
                  <h3 className="font-display text-2xl font-normal text-ivory mb-4">{s.title}</h3>
                  <div className="w-8 h-px bg-gold/40 mb-4 group-hover:w-14 group-hover:bg-gold transition-all duration-500" />
                  <p className="font-body text-sm text-smoke leading-relaxed mb-6">{s.desc}</p>
                  <Link href="/booking" className="btn-text">Inquire <ArrowUpRight size={10} /></Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
