'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Images, FolderOpen, Camera, ArrowRight, Upload, Plus, FileText, Grid, Sparkles } from 'lucide-react'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({ photos:0, galleries:0, sessions:0 })
  const [seeding, setSeeding] = useState(false)
  const [seeded,  setSeeded]  = useState(false)

  useEffect(()=>{
    async function load() {
      try {
        const [p,g,s] = await Promise.all([
          fetch('/api/photos').then(r=>r.json()),
          fetch('/api/galleries').then(r=>r.json()),
          fetch('/api/sessions').then(r=>r.json()),
        ])
        setStats({ photos:p.length??0, galleries:g.length??0, sessions:s.length??0 })
      } catch {}
    }
    load()
  },[seeded])

  const seed = async()=>{ setSeeding(true); await fetch('/api/seed'); setSeeded(true); setSeeding(false) }

  const hour = new Date().getHours()
  const greeting = hour<12?'Good morning':hour<17?'Good afternoon':'Good evening'
  const name = session?.user.name?.split(' ')[0]||'there'

  const s: Record<string, React.CSSProperties> = {
    page:   { padding:'32px 40px', maxWidth:'900px', fontFamily:'Josefin Sans, sans-serif' },
    h1:     { fontFamily:'Cormorant Garamond, serif', fontSize:'2rem', fontWeight:400, color:'#ede8e0', marginBottom:'6px' },
    sub:    { color:'#555', fontSize:'.8rem', marginBottom:'40px' },
    tag:    { color:'#c4a456', fontSize:'.58rem', letterSpacing:'.25em', textTransform:'uppercase', marginBottom:'4px', display:'block', fontFamily:'DM Mono, monospace' },
    card:   { background:'#0f0f0f', border:'1px solid rgba(255,255,255,.05)', padding:'20px', textDecoration:'none', display:'block', transition:'border-color .3s' },
    statN:  { fontFamily:'Cormorant Garamond, serif', fontSize:'2.8rem', fontWeight:400, color:'#ede8e0', lineHeight:1 },
    statL:  { fontFamily:'DM Mono, monospace', fontSize:'.55rem', letterSpacing:'.2em', textTransform:'uppercase', color:'#444', marginTop:'4px' },
  }

  return (
    <div style={s.page}>
      <span style={s.tag}>{greeting}</span>
      <h1 style={s.h1}>Welcome, <em style={{ fontStyle:'italic', color:'#c4a456' }}>{name}</em></h1>
      <p style={s.sub}>Manage your 21 Studios website from here.</p>

      {stats.galleries===0&&!seeded&&(
        <div style={{ marginBottom:'32px', padding:'20px', border:'1px solid rgba(196,164,86,.2)', background:'rgba(196,164,86,.05)', display:'flex', alignItems:'flex-start', gap:'14px' }}>
          <Sparkles size={18} style={{ color:'#c4a456', marginTop:'2px', flexShrink:0 }}/>
          <div>
            <p style={{ color:'#ede8e0', fontSize:'.85rem', marginBottom:'6px' }}>Database is empty</p>
            <p style={{ color:'#666', fontSize:'.72rem', marginBottom:'14px', lineHeight:1.6 }}>Seed with sample content to get started quickly.</p>
            <button onClick={seed} disabled={seeding}
              style={{ padding:'9px 18px', background:'#c4a456', color:'#030303', border:'none', fontSize:'.6rem', letterSpacing:'.18em', textTransform:'uppercase', cursor:'pointer', opacity:seeding?.6:1 }}>
              {seeding?'Setting up…':'Set up sample content'}
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'36px' }}>
        {[
          {label:'Photos',    value:stats.photos,    icon:Images,    href:'/admin/portfolio'},
          {label:'Galleries', value:stats.galleries, icon:FolderOpen,href:'/admin/galleries'},
          {label:'Sessions',  value:stats.sessions,  icon:Camera,    href:'/admin/sessions'},
        ].map(({label,value,icon:Icon,href})=>(
          <Link key={label} href={href} style={{...s.card}} onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(196,164,86,.25)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,.05)')}>
            <Icon size={15} style={{ color:'#c4a456', opacity:.7, marginBottom:'12px' }}/>
            <p style={s.statN}>{value}</p>
            <p style={s.statL}>{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <p style={{ fontFamily:'DM Mono, monospace', fontSize:'.58rem', letterSpacing:'.2em', textTransform:'uppercase', color:'#444', marginBottom:'12px' }}>Quick Actions</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'8px', marginBottom:'36px' }}>
        {[
          {label:'Upload Photos',     desc:'Add new images',         href:'/admin/portfolio', icon:Upload},
          {label:'Create Gallery',    desc:'Group your photos',      href:'/admin/galleries', icon:Plus},
          {label:'Edit Site Text',    desc:'Headlines & copy',       href:'/admin/content',   icon:FileText},
          {label:'Manage Portfolio',  desc:'Reorder & caption',      href:'/admin/portfolio', icon:Grid},
        ].map(({label,desc,href,icon:Icon})=>(
          <Link key={label} href={href} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px', background:'#0f0f0f', border:'1px solid rgba(255,255,255,.05)', textDecoration:'none', transition:'all .3s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(196,164,86,.2)'; e.currentTarget.style.background='rgba(196,164,86,.03)' }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,.05)'; e.currentTarget.style.background='#0f0f0f' }}>
            <div style={{ width:'34px', height:'34px', border:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon size={13} style={{ color:'#555' }}/>
            </div>
            <div>
              <p style={{ color:'#ede8e0', fontSize:'.78rem' }}>{label}</p>
              <p style={{ color:'#444', fontSize:'.62rem', marginTop:'2px' }}>{desc}</p>
            </div>
            <ArrowRight size={12} style={{ marginLeft:'auto', color:'#333' }}/>
          </Link>
        ))}
      </div>

      <div style={{ background:'#0f0f0f', border:'1px solid rgba(255,255,255,.05)', padding:'20px' }}>
        <p style={{ fontFamily:'DM Mono, monospace', fontSize:'.58rem', letterSpacing:'.2em', textTransform:'uppercase', color:'#444', marginBottom:'16px' }}>How it works</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'20px' }}>
          {[
            {n:'01',t:'Upload Photos',b:"Drag photos into Portfolio → Upload. They're auto-optimised."},
            {n:'02',t:'Build Galleries',b:'Group photos into collections. Star one to feature on homepage.'},
            {n:'03',t:'Edit Content',b:'Content page → click any field to edit. Auto-saves on blur.'},
          ].map(({n,t,b})=>(
            <div key={n}>
              <p style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'2.5rem', fontWeight:300, color:'rgba(196,164,86,.12)', lineHeight:1, marginBottom:'8px' }}>{n}</p>
              <p style={{ color:'#ede8e0', fontSize:'.78rem', marginBottom:'5px' }}>{t}</p>
              <p style={{ color:'#444', fontSize:'.68rem', lineHeight:1.6 }}>{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
