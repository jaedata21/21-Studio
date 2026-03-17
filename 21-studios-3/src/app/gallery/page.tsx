'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal, { LineReveal } from '@/components/Reveal'
import { Lock, ArrowRight, Download, Check, Eye, X } from 'lucide-react'

const galleries = [
  { id:'ae-2024', name:'Amara & Elijah', date:'March 2024', location:'Montego Bay', count:487, password:'ae2024',
    cover:'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1400&auto=format&fit=crop',
    images:[
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1537795479-cf48d1bf9a9c?q=80&w=900&auto=format&fit=crop',
    ],
  },
  { id:'gh-2024', name:'Golden Hour Series', date:'January 2024', location:'Negril', count:212, password:'gh2024',
    cover:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1400&auto=format&fit=crop',
    images:[
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
    ],
  },
]

type Gallery = typeof galleries[0]
type Step = 'browse' | 'unlock' | 'view'

function GalleryCard({ g, onClick }: { g: Gallery; onClick: () => void }) {
  return (
    <button className="w-full text-left group" onClick={onClick} data-hover>
      <div className="border border-white/[0.06] hover:border-gold/30 transition-all duration-500">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={g.cover} alt={g.name} fill
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
            sizes="(max-width:768px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="font-mono text-[.55rem] tracking-[.2em] uppercase text-gold border border-gold/30 px-2 py-0.5 bg-void/50 backdrop-blur-sm">
              {g.count} photos
            </span>
          </div>
        </div>
        <div className="p-6 bg-charcoal/20">
          <h3 className="font-display text-2xl font-normal italic text-ivory">{g.name}</h3>
          <p className="font-mono text-[.58rem] tracking-wider text-smoke mt-1">{g.date} · {g.location}</p>
        </div>
      </div>
    </button>
  )
}

function UnlockedView({ g, onClose }: { g: Gallery; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (src: string) =>
    setSelected(p => p.includes(src) ? p.filter(s => s !== src) : [...p, src])

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
      transition={{ duration:.55, ease:[0.16,1,0.3,1] }}>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="font-display text-3xl font-normal italic text-ivory">{g.name}</h2>
          <p className="font-mono text-[.58rem] tracking-wider text-smoke mt-1">{g.count} photos · {g.location}</p>
        </div>
        <div className="flex items-center gap-3">
          {selected.length > 0 && (
            <span className="font-mono text-[.58rem] tracking-wider text-gold">{selected.length} selected</span>
          )}
          <button className="btn-gold text-[.6rem] py-2.5 px-5 gap-2 inline-flex items-center">
            <Download size={12} /> Download All
          </button>
          <button onClick={onClose} className="btn-ghost text-[.6rem] py-2.5 px-4 inline-flex items-center gap-2">
            <Lock size={11} /> Lock
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {g.images.map((src, i) => (
          <motion.div key={src} className="relative aspect-square overflow-hidden group cursor-pointer"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: i * .07, duration:.5, ease:[0.16,1,0.3,1] }}
            onClick={() => toggle(src)} data-hover>
            <Image src={src} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" sizes="33vw" />
            <div className={`absolute inset-0 transition-all duration-300 ${selected.includes(src) ? 'bg-gold/20 border-2 border-gold' : 'bg-transparent group-hover:bg-void/30'}`} />
            {selected.includes(src) ? (
              <div className="absolute top-3 right-3 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                <Check size={11} className="text-void" />
              </div>
            ) : (
              <div className="absolute top-3 right-3 w-6 h-6 border border-white/30 rounded-full flex items-center justify-center bg-void/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye size={10} className="text-ivory" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function GalleryPage() {
  const [step, setStep] = useState<Step>('browse')
  const [picked, setPicked] = useState<Gallery | null>(null)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const select = (g: Gallery) => { setPicked(g); setStep('unlock'); setPw(''); setErr('') }

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault(); if (!picked) return
    setLoading(true); setErr('')
    await new Promise(r => setTimeout(r, 700))
    setLoading(false)
    if (pw === picked.password) { setStep('view') }
    else { setErr('Incorrect password. Please try again.'); setPw('') }
  }

  return (
    <>
      <section className="pt-44 pb-14 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1440px] mx-auto">
          <Reveal><p className="section-tag mb-5">— Client Portal</p></Reveal>
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] font-normal leading-none mb-6">
            <LineReveal><span className="text-ivory">Your </span></LineReveal>
            <LineReveal delay={.12}><em className="italic text-gold">Gallery</em></LineReveal>
          </h1>
          <Reveal delay={.2}>
            <p className="font-body font-light text-smoke text-sm max-w-md leading-relaxed mb-14">
              Select your event below and enter your unique password to view and download your images.
            </p>
          </Reveal>

          <AnimatePresence mode="wait">
            {step === 'browse' && (
              <motion.div key="browse" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {galleries.map((g, i) => (
                    <Reveal key={g.id} delay={i * .1}>
                      <GalleryCard g={g} onClick={() => select(g)} />
                    </Reveal>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'unlock' && picked && (
              <motion.div key="unlock" className="max-w-md"
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }}
                transition={{ duration:.55, ease:[0.16,1,0.3,1] }}>
                <div className="relative aspect-video overflow-hidden mb-8">
                  <Image src={picked.cover} alt={picked.name} fill className="object-cover" sizes="500px" />
                  <div className="absolute inset-0 bg-void/65 flex flex-col items-center justify-center gap-3">
                    <Lock size={22} className="text-gold" />
                    <p className="font-display text-2xl italic text-ivory">{picked.name}</p>
                    <p className="font-mono text-[.58rem] tracking-wider text-smoke">{picked.count} photos</p>
                  </div>
                </div>
                <form onSubmit={unlock} className="space-y-6">
                  <div>
                    <label className="block font-mono text-[.55rem] tracking-[.2em] uppercase text-gold mb-2">Gallery Password</label>
                    <input type="password" required placeholder="Enter your password" autoFocus
                      className="field" value={pw} onChange={e => setPw(e.target.value)} />
                    {err && <p className="font-mono text-[.6rem] text-red-400 mt-2">{err}</p>}
                    <p className="font-mono text-[.55rem] text-smoke/40 mt-2">Demo hint: try "ae2024"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button type="submit" disabled={loading} className="btn-gold gap-2 disabled:opacity-60">
                      {loading ? <><span className="w-3.5 h-3.5 border-2 border-void/30 border-t-void rounded-full animate-spin" />Unlocking...</> : <>Unlock Gallery <ArrowRight size={13} /></>}
                    </button>
                    <button type="button" className="btn-text" onClick={() => setStep('browse')}>Back</button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'view' && picked && (
              <motion.div key="view" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                <UnlockedView g={picked} onClose={() => setStep('browse')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
