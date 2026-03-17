'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  if (status === 'loading') return <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center' }}><p style={{ color:'#b8975a' }}>Loading…</p></div>
  if (!session) return null

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'white', fontFamily:'Outfit, sans-serif', padding:'40px' }}>
      <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:'2rem', marginBottom:'8px' }}>Welcome, {session.user.name}</h1>
      <p style={{ color:'#555', marginBottom:'40px', fontSize:'.9rem' }}>Manage your 21 Studios website</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'16px', maxWidth:'800px' }}>
        {[
          { href:'/admin/content',   label:'Edit Content',  desc:'Headlines & text' },
          { href:'/admin/galleries', label:'Galleries',     desc:'Manage collections' },
          { href:'/admin/photos',    label:'Photos',        desc:'Upload images' },
          { href:'/admin/sessions',  label:'Sessions',      desc:'Pricing packages' },
          { href:'/admin/settings',  label:'Settings',      desc:'Logo & account' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{ display:'block', padding:'24px', background:'#141414', border:'1px solid rgba(255,255,255,.06)', textDecoration:'none', transition:'border-color .3s' }}>
            <p style={{ color:'white', fontSize:'.9rem', marginBottom:'4px' }}>{item.label}</p>
            <p style={{ color:'#555', fontSize:'.75rem' }}>{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
