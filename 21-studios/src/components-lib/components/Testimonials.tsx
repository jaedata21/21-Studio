'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal, { LineReveal } from './Reveal'

const testimonials = [
  {
    quote: 'Working with 21 Studios was the single best decision we made for our wedding. Every photograph looks like it belongs in a gallery. We wept seeing the final collection.',
    name: 'Amara Thompson', role: 'Bride — Montego Bay Wedding', init: 'AT',
  },
  {
    quote: 'The editorial shoot exceeded every expectation. Jordan understands light in a way I have never seen. The campaign performed beyond anything we projected.',
    name: 'Marcus Reid', role: 'Creative Director, Soleil Magazine', init: 'MR',
  },
  {
    quote: 'Our brand photography has become our strongest asset. Clients constantly ask who shot our visuals. 21 Studios delivers images that convert.',
    name: 'Priya Nair', role: 'Founder, Azure Skincare', init: 'PN',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % testimonials.length), 5500)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-28 md:py-40 px-6 md:px-12 lg:px-20 bg-charcoal/20">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-16 items-center">

        {/* Left */}
        <div>
          <Reveal><p className="section-tag mb-4">— Client Stories</p></Reveal>
          <h2 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-normal leading-none">
            <LineReveal><span className="text-ivory">What they </span></LineReveal>
            <LineReveal delay={.12}><em className="italic text-gold">say</em></LineReveal>
          </h2>

          {/* Dots */}
          <div className="flex gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  i === active ? 'w-10 bg-gold' : 'w-4 bg-steel hover:bg-mist'
                }`} />
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="relative min-h-[260px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: .65, ease: [0.16, 1, 0.3, 1] }}>
              {/* Large quote mark */}
              <span className="absolute -top-8 -left-4 font-display text-[7rem] leading-none text-gold/[.07] select-none pointer-events-none">
                "
              </span>
              <p className="font-display text-[clamp(1.2rem,2.4vw,1.75rem)] font-normal italic text-ivory leading-[1.55] mb-8 relative z-10">
                {testimonials[active].quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0">
                  <span className="font-display text-sm text-gold">{testimonials[active].init}</span>
                </div>
                <div>
                  <p className="font-body text-sm text-ivory font-normal">{testimonials[active].name}</p>
                  <p className="font-mono text-[.6rem] tracking-wider text-smoke mt-0.5">{testimonials[active].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
