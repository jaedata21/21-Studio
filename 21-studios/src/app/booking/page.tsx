'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import Reveal, { LineReveal, LineWipe } from '@/components/Reveal'
import { Send, CheckCircle, ChevronDown } from 'lucide-react'

/* ─── Types ─────────────────────────────────────────────── */
interface Session {
  id: string; title: string; price: string; duration: string | null
  description: string | null; includes: string; category: string
}

/* ─── FAQ ───────────────────────────────────────────────── */
const faqs = [
  { q:'How far in advance should I book?',    a:'We recommend 6–12 months for weddings. Portrait and commercial sessions can typically be scheduled within 2–4 weeks.' },
  { q:'What is your editing style?',          a:'Cinematic and warm — rich shadows, luminous highlights, true-to-life skin tones. No heavy filters or trendy presets.' },
  { q:'How long until I receive my photos?',  a:'Wedding galleries within 4–6 weeks. Portraits within 1–2 weeks. Rush delivery available for commercial projects.' },
  { q:'Do you travel for shoots?',            a:"We've shot across 4 continents. Travel fees apply depending on destination. Destination wedding packages available." },
  { q:'What is your deposit policy?',         a:'A 30% retainer reserves your date. The balance is due 14 days before your session. We accept bank transfer and major cards.' },
]

function FAQItem({ q, a }: { q:string; a:string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/[0.07]">
      <button className="w-full flex items-center justify-between py-5 text-left gap-6 group" onClick={() => setOpen(!open)}>
        <span className="font-body text-sm text-parchment group-hover:text-ivory transition-colors">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration:.3, ease:[0.16,1,0.3,1] }} className="shrink-0">
          <ChevronDown size={15} className="text-gold" />
        </motion.div>
      </button>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration:.42, ease:[0.16,1,0.3,1] }} className="overflow-hidden">
        <p className="font-body text-sm text-smoke leading-relaxed pb-5">{a}</p>
      </motion.div>
    </div>
  )
}

/* ─── Package card ──────────────────────────────────────── */
function PackageCard({ session, highlight }: { session: Session; highlight: boolean }) {
  let includes: string[] = []
  try { includes = JSON.parse(session.includes) } catch { /* noop */ }

  return (
    <div className={`relative p-8 md:p-10 border transition-all duration-500 hover:-translate-y-1 flex flex-col ${
      highlight ? 'border-gold bg-charcoal/40' : 'border-white/10 bg-charcoal/10 hover:border-white/20'
    }`}>
      {highlight && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-gold px-4 py-1">
          <span className="font-mono text-[.55rem] tracking-[.2em] uppercase text-void">Most Popular</span>
        </div>
      )}
      <p className={`font-mono text-[.58rem] tracking-[.2em] uppercase mb-2 ${highlight ? 'text-gold' : 'text-smoke'}`}>
        {session.duration || session.category}
      </p>
      <h3 className="font-display text-3xl font-normal text-ivory mb-1">{session.title}</h3>
      <p className={`font-display text-[2.8rem] font-normal leading-none mb-4 ${highlight ? 'text-gold' : 'text-parchment'}`}>
        {session.price}
      </p>
      {session.description && (
        <p className="font-body text-sm text-smoke leading-relaxed mb-4">{session.description}</p>
      )}
      <div className="w-8 h-px bg-gold/30 mb-5" />
      <ul className="space-y-3 mb-8 flex-1">
        {includes.map((item, i) => (
          <li key={i} className="flex items-center gap-3 font-body text-sm text-smoke">
            <CheckCircle size={11} className="text-gold shrink-0" />{item}
          </li>
        ))}
      </ul>
      <a href="#inquiry" className={`flex justify-center w-full ${highlight ? 'btn-gold' : 'btn-ghost'}`}>
        Select Package
      </a>
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────── */
export default function BookingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] })
  const rawY = useTransform(scrollYProgress, [0,1], ['0%','22%'])
  const imgY = useSpring(rawY, { stiffness:55, damping:18 })

  const [sessions, setSessions] = useState<Session[]>([])
  const [contact,  setContact]  = useState({ email:'hello@21studios.com', phone:'+1 (876) 123-4567', location:'Kingston, Jamaica & Worldwide' })
  const [form, setForm] = useState({ name:'', email:'', phone:'', type:'', date:'', message:'' })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  useEffect(() => {
    fetch('/api/sessions').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setSessions(data)
    }).catch(() => {})
    fetch('/api/content?group=contact').then(r => r.json()).then(data => {
      setContact({
        email:    data.contact_email    || 'hello@21studios.com',
        phone:    data.contact_phone    || '+1 (876) 123-4567',
        location: data.contact_location || 'Kingston, Jamaica & Worldwide',
      })
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false); setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <div ref={heroRef} className="relative h-[62vh] min-h-[480px] overflow-hidden">
        <motion.div className="absolute inset-0 scale-[1.15]" style={{ y: imgY }}>
          <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=85&w=2800&auto=format&fit=crop" alt="Book a shoot" fill priority className="object-cover" sizes="100vw" />
        </motion.div>
        <div className="absolute inset-0 bg-void/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-transparent to-void" />
        <div className="relative z-10 h-full flex items-end pb-18 px-6 md:px-12 lg:px-20">
          <div className="max-w-[1440px] mx-auto w-full">
            <motion.p className="section-tag mb-4" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}>
              — Let&apos;s Work Together
            </motion.p>
            <h1 className="font-display text-[clamp(3rem,9vw,8rem)] font-normal leading-none">
              <div className="clip-parent">
                <motion.span className="block text-ivory" initial={{ y:'112%' }} animate={{ y:'0%' }} transition={{ delay:.42, duration:1, ease:[0.16,1,0.3,1] }}>Book Your</motion.span>
              </div>
              <div className="clip-parent">
                <motion.span className="block italic text-gold" initial={{ y:'112%' }} animate={{ y:'0%' }} transition={{ delay:.55, duration:1, ease:[0.16,1,0.3,1] }}>Session</motion.span>
              </div>
            </h1>
          </div>
        </div>
      </div>

      {/* Packages — loaded from CMS */}
      {sessions.length > 0 && (
        <section className="py-24 md:py-36 px-6 md:px-12 lg:px-20">
          <div className="max-w-[1440px] mx-auto">
            <Reveal><p className="section-tag mb-4">— Investment</p></Reveal>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-normal leading-none mb-14">
              <LineReveal><span className="text-ivory">Our </span></LineReveal>
              <LineReveal delay={.1}><em className="italic text-gold">Packages</em></LineReveal>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sessions.map((s, i) => (
                <Reveal key={s.id} delay={i * .1}>
                  <PackageCard session={s} highlight={i === 1} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inquiry form */}
      <section id="inquiry" className="py-24 md:py-36 px-6 md:px-12 lg:px-20 bg-charcoal/15">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-16 items-start">
          <div>
            <Reveal><p className="section-tag mb-4">— Inquire</p></Reveal>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] font-normal leading-none mb-6">
              <LineReveal><span className="text-ivory">Start the</span></LineReveal>
              <LineReveal delay={.1}><em className="italic text-gold">Conversation</em></LineReveal>
            </h2>
            <Reveal delay={.2}>
              <p className="font-body text-sm text-smoke leading-relaxed max-w-xs mb-10">
                We respond within 24 hours with availability and a personalised quote.
              </p>
              <div className="space-y-4">
                {[['Email', contact.email, `mailto:${contact.email}`], ['Phone', contact.phone, `tel:${contact.phone.replace(/\s/g,'')}`]].map(([label, val, href]) => (
                  <div key={label}>
                    <p className="font-mono text-[.55rem] tracking-[.2em] uppercase text-gold mb-1">{label}</p>
                    <a href={href} className="font-body text-sm text-parchment hover:text-gold transition-colors">{val}</a>
                  </div>
                ))}
                <div>
                  <p className="font-mono text-[.55rem] tracking-[.2em] uppercase text-gold mb-1">Location</p>
                  <p className="font-body text-sm text-smoke">{contact.location}</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={.15}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" className="flex flex-col items-center justify-center py-20 text-center"
                  initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.6, ease:[0.16,1,0.3,1] }}>
                  <CheckCircle size={44} className="text-gold mb-5" />
                  <h3 className="font-display text-3xl italic font-normal text-ivory mb-3">Message Received</h3>
                  <p className="font-body text-sm text-smoke max-w-xs">We&apos;ll be in touch within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[['Your Name *','text','name','Jordan Smith',true],['Email Address *','email','email','hello@you.com',true],['Phone Number','tel','phone','+1 (000) 000-0000',false]].map(([label,type,key,placeholder,req]) => (
                      <div key={String(key)}>
                        <label className="block font-mono text-[.55rem] tracking-[.2em] uppercase text-gold mb-2">{String(label)}</label>
                        <input type={String(type)} required={Boolean(req)} placeholder={String(placeholder)} className="field"
                          value={(form as Record<string,string>)[String(key)]}
                          onChange={e => setForm(p => ({ ...p, [String(key)]: e.target.value }))} />
                      </div>
                    ))}
                    <div>
                      <label className="block font-mono text-[.55rem] tracking-[.2em] uppercase text-gold mb-2">Session Type *</label>
                      <select required className="field appearance-none cursor-pointer bg-transparent" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                        <option value="" disabled className="bg-obsidian">Select a service</option>
                        {sessions.length > 0
                          ? sessions.map(s => <option key={s.id} value={s.id} className="bg-obsidian">{s.title}</option>)
                          : ['Wedding','Portrait','Editorial','Commercial','Event','Other'].map(o => <option key={o} value={o.toLowerCase()} className="bg-obsidian">{o}</option>)
                        }
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-mono text-[.55rem] tracking-[.2em] uppercase text-gold mb-2">Preferred Date</label>
                      <input type="date" className="field" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} />
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono text-[.55rem] tracking-[.2em] uppercase text-gold mb-2">Tell Us About Your Vision</label>
                    <textarea rows={5} placeholder="Share your ideas, location preferences, and any details…" className="field resize-none" value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-gold gap-3 disabled:opacity-60">
                    {loading ? <><span className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" />Sending…</> : <>Send Inquiry <Send size={13} /></>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 md:py-36 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-16">
          <div>
            <Reveal><p className="section-tag mb-4">— FAQ</p></Reveal>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] font-normal leading-none">
              <LineReveal><span className="text-ivory">Common </span></LineReveal>
              <LineReveal delay={.1}><em className="italic text-gold">Questions</em></LineReveal>
            </h2>
          </div>
          <Reveal delay={.1}>
            <div>{faqs.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}</div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
