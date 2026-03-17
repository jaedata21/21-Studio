'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about',     label: 'About' },
  { href: '/booking',   label: 'Book' },
  { href: '/gallery',   label: 'Client Gallery' },
]

export default function Navigation() {
  const [scrolled,  setScrolled]  = useState(false)
  const [open,      setOpen]      = useState(false)
  const [logoImg,   setLogoImg]   = useState('')
  const [logoText,  setLogoText]  = useState('21 Studios')
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    fetch('/api/content?group=brand').then(r => r.json()).then(data => {
      if (data.logo_image) setLogoImg(data.logo_image)
      if (data.logo_text)  setLogoText(data.logo_text)
    }).catch(() => {})
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  const parts = logoText.split(' ')
  const first = parts[0]
  const rest  = parts.slice(1).join(' ')

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-[500] h-[80px] transition-all duration-700 ${scrolled ? 'nav-glass' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 h-full flex items-center justify-between">

          <Link href="/" className="flex items-center">
            {logoImg
              ? <Image src={logoImg} alt={logoText} width={120} height={40} className="h-8 w-auto object-contain" />
              : <span className="font-display text-lg font-normal tracking-[.2em] uppercase text-ivory">
                  {first}{rest && <> <span className="text-gold">{rest}</span></>}
                </span>
            }
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className={`font-body text-[.7rem] tracking-[.2em] uppercase transition-colors duration-300 relative group ${pathname === l.href ? 'text-gold' : 'text-mist hover:text-ivory'}`}>
                {l.label}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-500 ${pathname === l.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </nav>

          <Link href="/booking" className="btn-gold hidden md:inline-flex text-[.65rem] py-3 px-6">Book a Shoot</Link>

          <button className="md:hidden text-ivory p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[490] bg-void flex flex-col items-center justify-center"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: .7, ease: [0.16, 1, 0.3, 1] }}>
            <nav className="flex flex-col items-center gap-8">
              {links.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: .15 + i * .08, duration: .65, ease: [0.16, 1, 0.3, 1] }}>
                  <Link href={l.href} className="font-display text-5xl font-normal text-ivory hover:text-gold transition-colors italic">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .55, duration: .6, ease: [0.16, 1, 0.3, 1] }}>
                <Link href="/booking" className="btn-gold mt-4">Book a Shoot</Link>
              </motion.div>
            </nav>
            <p className="absolute bottom-10 font-mono text-[.6rem] tracking-[.3em] text-smoke uppercase">
              Where Light Becomes Legacy
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
