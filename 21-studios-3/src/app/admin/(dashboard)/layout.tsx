'use client'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Images, FolderOpen, Camera, FileText, Settings, LogOut, Menu, X, ChevronRight, Eye, Layers, Grid } from 'lucide-react'

const nav = [
  { href:'/admin',             label:'Dashboard',  icon:LayoutDashboard, desc:'Overview' },
  { href:'/admin/portfolio',   label:'Portfolio',  icon:Grid,            desc:'Photos & captions' },
  { href:'/admin/galleries',   label:'Galleries',  icon:FolderOpen,      desc:'Collections' },
  { href:'/admin/photos',      label:'All Photos', icon:Images,          desc:'Upload & manage' },
  { href:'/admin/sessions',    label:'Sessions',   icon:Camera,          desc:'Packages & pricing' },
  { href:'/admin/content',     label:'Content',    icon:FileText,        desc:'Edit site text' },
  { href:'/admin/sections',    label:'Homepage',   icon:Layers,          desc:'Reorder sections' },
  { href:'/admin/settings',    label:'Settings',   icon:Settings,        desc:'Logo & account' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router   = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(()=>{
    if(status==='unauthenticated') router.push('/admin/login')
  },[status,router])

  if(status==='loading') return (
    <div style={{ minHeight:'100vh', background:'#030303', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'28px', height:'28px', border:'2px solid rgba(196,164,86,.2)', borderTopColor:'#c4a456', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
    </div>
  )
  if(!session) return null

  const current = nav.find(n=>n.href===pathname||(n.href!=='/admin'&&pathname.startsWith(n.href)))

  return (
    <div style={{ minHeight:'100vh', background:'#080808', display:'flex', fontFamily:'Josefin Sans, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{
        position:'fixed', top:0, left:0, bottom:0, zIndex:50, width:'196px',
        background:'#0a0a0a', borderRight:'1px solid rgba(255,255,255,.05)',
        display:'flex', flexDirection:'column',
        transform: open?'translateX(0)':'translateX(-100%)',
        transition:'transform .3s cubic-bezier(0.16,1,0.3,1)',
      }} className="lg:translate-x-0 lg:transform-none">

        {/* Logo */}
        <div style={{ height:'64px', display:'flex', alignItems:'center', padding:'0 16px', borderBottom:'1px solid rgba(255,255,255,.05)', gap:'10px' }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }} onClick={()=>setOpen(false)}>
            <div style={{ width:'28px', height:'28px', background:'#c4a456', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ color:'#030303', fontSize:'.6rem', fontWeight:700 }}>21</span>
            </div>
            <span style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'1rem', color:'#ede8e0', letterSpacing:'.1em' }}>Studios</span>
          </Link>
          <span style={{ marginLeft:'auto', fontSize:'.45rem', letterSpacing:'.18em', textTransform:'uppercase', color:'#333', border:'1px solid rgba(255,255,255,.06)', padding:'2px 6px', flexShrink:0 }}>CMS</span>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'8px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'2px' }}>
          {nav.map(({href,label,icon:Icon,desc})=>{
            const active = pathname===href||(href!=='/admin'&&pathname.startsWith(href))
            return (
              <Link key={href} href={href} onClick={()=>setOpen(false)}
                style={{
                  display:'flex', alignItems:'center', gap:'10px',
                  padding:'10px 12px', borderRadius:'2px', textDecoration:'none',
                  background: active?'rgba(196,164,86,.1)':'transparent',
                  transition:'all .2s',
                }}>
                <Icon size={14} style={{ color:active?'#c4a456':'#444', flexShrink:0 }}/>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:'.72rem', color:active?'#c4a456':'#666', lineHeight:1 }}>{label}</p>
                  <p style={{ fontSize:'.56rem', color:active?'rgba(196,164,86,.5)':'#333', marginTop:'2px' }}>{desc}</p>
                </div>
                {active&&<ChevronRight size={10} style={{ marginLeft:'auto', color:'rgba(196,164,86,.4)' }}/>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding:'8px', borderTop:'1px solid rgba(255,255,255,.05)' }}>
          <Link href="/" target="_blank" style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', color:'#444', textDecoration:'none', fontSize:'.62rem', borderRadius:'2px', transition:'color .2s' }}>
            <Eye size={12}/> View live site
          </Link>
          <button onClick={()=>signOut({callbackUrl:'/admin/login'})}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', background:'none', border:'none', cursor:'pointer', color:'#444', fontSize:'.62rem', borderRadius:'2px', transition:'color .2s' }}>
            <LogOut size={12}/> Sign out
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,.05)', marginTop:'4px' }}>
            <div style={{ width:'24px', height:'24px', borderRadius:'50%', background:'rgba(196,164,86,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:'.58rem', color:'#c4a456' }}>{session.user.name?.[0]}</span>
            </div>
            <div style={{ minWidth:0 }}>
              <p style={{ fontSize:'.62rem', color:'#ede8e0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{session.user.name}</p>
              <p style={{ fontSize:'.52rem', color:'#444', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{session.user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open&&<div style={{ position:'fixed', inset:0, zIndex:40, background:'rgba(0,0,0,.75)', backdropFilter:'blur(4px)' }} onClick={()=>setOpen(false)} className="lg:hidden"/>}

      {/* Main */}
      <div style={{ flex:1, marginLeft:0, display:'flex', flexDirection:'column', minHeight:'100vh' }} className="lg:ml-[196px]">
        <header style={{ height:'64px', display:'flex', alignItems:'center', padding:'0 20px', borderBottom:'1px solid rgba(255,255,255,.05)', background:'#0a0a0a', flexShrink:0 }}>
          <button className="lg:hidden" onClick={()=>setOpen(!open)} style={{ background:'none', border:'none', cursor:'pointer', color:'#666', marginRight:'12px' }}>
            {open?<X size={18}/>:<Menu size={18}/>}
          </button>
          <div>
            <p style={{ color:'#ede8e0', fontSize:'.85rem' }}>{current?.label||'Dashboard'}</p>
            <p style={{ color:'#444', fontSize:'.58rem', marginTop:'2px' }}>{current?.desc}</p>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#4ade80' }}/>
            <span style={{ fontSize:'.58rem', color:'#444' }}>Live</span>
          </div>
        </header>
        <main style={{ flex:1, overflow:'auto' }}>{children}</main>
      </div>
    </div>
  )
}
