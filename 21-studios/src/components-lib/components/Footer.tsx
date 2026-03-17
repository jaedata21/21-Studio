'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Mail, Phone } from 'lucide-react'

type CMS = Record<string, string>

const workLinks  = [['Portfolio','/portfolio'],['Weddings','/portfolio'],['Portraits','/portfolio'],['Editorial','/portfolio'],['Commercial','/portfolio']]
const studioLinks = [['About','/about'],['Book a Shoot','/booking'],['Client Gallery','/gallery'],['FAQ','/booking#faq']]

export default function Footer() {
  const [cms, setCms] = useState<CMS>({})

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(setCms).catch(() => {})
  }, [])

  const logoText   = cms.logo_text    || '21 Studios'
  const logoImage  = cms.logo_image   || ''
  const email      = cms.contact_email    || 'hello@21studios.com'
  const phone      = cms.contact_phone    || '+1 (876) 123-4567'
  const location   = cms.contact_location || 'Kingston, Jamaica & Worldwide'
  const instagram  = cms.instagram_url    || 'https://instagram.com'

  const parts = logoText.split(' ')
  const first = parts[0]
  const rest  = parts.slice(1).join(' ')

  return (
    <footer className="bg-ink border-t border-white/[0.05]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,1fr] gap-12 md:gap-8">

          {/* Brand */}
          <div>
            <div className="mb-5">
              {logoImage
                ? <Image src={logoImage} alt={logoText} width={120} height={40} className="h-8 w-auto object-contain" />
                : <span className="font-display text-2xl tracking-[.18em] uppercase">
                    <span className="text-ivory">{first}</span>
                    {rest && <span className="text-gold ml-1.5">{rest}</span>}
                  </span>
              }
            </div>
            <p className="font-body font-light text-sm text-smoke leading-relaxed max-w-xs mb-8">
              Premium photography studio. Where light becomes legacy.<br/>Based in Jamaica, shooting worldwide.
            </p>
            <div className="flex gap-3">
              {[
                { href: instagram,            Icon: Instagram, label:'Instagram' },
                { href: `mailto:${email}`,    Icon: Mail,      label:'Email' },
                { href: `tel:${phone.replace(/\s/g,'')}`, Icon: Phone, label:'Phone' },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-smoke hover:border-gold hover:text-gold transition-colors duration-300">
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Work links */}
          <div>
            <h4 className="font-mono text-[.6rem] tracking-[.22em] uppercase text-gold mb-5">Work</h4>
            <ul className="space-y-3">
              {workLinks.map(([label, href]) => (
                <li key={label}><Link href={href} className="font-body text-sm text-smoke hover:text-parchment transition-colors duration-300">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Studio links */}
          <div>
            <h4 className="font-mono text-[.6rem] tracking-[.22em] uppercase text-gold mb-5">Studio</h4>
            <ul className="space-y-3">
              {studioLinks.map(([label, href]) => (
                <li key={label}><Link href={href} className="font-body text-sm text-smoke hover:text-parchment transition-colors duration-300">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-[.6rem] tracking-[.22em] uppercase text-gold mb-5">Contact</h4>
            <ul className="space-y-3">
              <li><a href={`mailto:${email}`} className="font-body text-sm text-smoke hover:text-parchment transition-colors">{email}</a></li>
              <li><a href={`tel:${phone}`}    className="font-body text-sm text-smoke hover:text-parchment transition-colors">{phone}</a></li>
              <li><p className="font-body text-sm text-smoke">{location}</p></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05] px-6 md:px-12 lg:px-20 py-5">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[.58rem] tracking-wider text-ash">© {new Date().getFullYear()} {logoText}. All rights reserved.</p>
          <p className="font-mono text-[.55rem] tracking-[.25em] uppercase text-ash/40">Where Light Becomes Legacy</p>
          <div className="flex gap-5">
            {[['Privacy','/privacy'],['Terms','/terms']].map(([l,h]) => (
              <Link key={l} href={h} className="font-mono text-[.58rem] tracking-wider text-ash hover:text-smoke transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
