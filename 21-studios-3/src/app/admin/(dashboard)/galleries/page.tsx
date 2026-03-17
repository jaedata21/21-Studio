'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Eye, EyeOff, Star, Trash2, Edit2, Images } from 'lucide-react'

interface Gallery { id:string; title:string; slug:string; description:string|null; category:string; coverImage:string|null; featured:boolean; published:boolean; _count:{photos:number} }
const blank = { title:'', description:'', category:'General', featured:false, published:true }

export default function GalleriesPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [modal,     setModal]     = useState(false)
  const [editing,   setEditing]   = useState<Gallery|null>(null)
  const [form,      setForm]      = useState(blank)
  const [toast,     setToast]     = useState('')
  const [loading,   setLoading]   = useState(false)

  const load=async()=>{ const d=await fetch('/api/galleries').then(r=>r.json()); setGalleries(Array.isArray(d)?d:[]) }
  useEffect(()=>{ load() },[])
  const showToast=(m:string)=>{ setToast(m); setTimeout(()=>setToast(''),3000) }

  const save=async()=>{
    setLoading(true)
    if(editing) await fetch(`/api/galleries/${editing.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    else await fetch('/api/galleries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    setLoading(false); setModal(false); load(); showToast(editing?'Updated':'Created')
  }
  const del=async(id:string)=>{ if(!confirm('Delete gallery?')) return; await fetch(`/api/galleries/${id}`,{method:'DELETE'}); showToast('Deleted'); load() }
  const toggle=async(g:Gallery,field:'published'|'featured')=>{ await fetch(`/api/galleries/${g.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({[field]:!g[field]})}); load() }

  const inp: React.CSSProperties = { width:'100%', background:'#0a0a0a', border:'1px solid rgba(255,255,255,.08)', padding:'9px 13px', color:'#ede8e0', fontSize:'13px', outline:'none', fontFamily:'Josefin Sans, sans-serif' }
  const lbl: React.CSSProperties = { display:'block', fontSize:'.56rem', letterSpacing:'.2em', textTransform:'uppercase', color:'#c4a456', marginBottom:'6px', fontFamily:'DM Mono, monospace' }

  return (
    <div style={{ padding:'32px 40px', maxWidth:'900px', fontFamily:'Josefin Sans, sans-serif' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
        <div>
          <p style={{ fontFamily:'DM Mono, monospace', fontSize:'.58rem', letterSpacing:'.22em', textTransform:'uppercase', color:'#c4a456', marginBottom:'4px' }}>Manage</p>
          <h1 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'1.8rem', fontWeight:400, color:'#ede8e0' }}>Galleries</h1>
        </div>
        <button onClick={()=>{ setEditing(null); setForm(blank); setModal(true) }}
          style={{ display:'flex', alignItems:'center', gap:'7px', padding:'10px 20px', background:'#c4a456', color:'#030303', border:'none', fontSize:'.6rem', letterSpacing:'.18em', textTransform:'uppercase', cursor:'pointer' }}>
          <Plus size={12}/> New Gallery
        </button>
      </div>

      {galleries.length===0?(
        <div style={{ textAlign:'center', padding:'60px', background:'#0f0f0f', border:'1px solid rgba(255,255,255,.05)' }}>
          <p style={{ color:'#ede8e0', marginBottom:'6px' }}>No galleries yet</p>
          <p style={{ color:'#555', fontSize:'.75rem' }}>Create your first gallery to organise your photos</p>
        </div>
      ):(
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'14px' }}>
          {galleries.map(g=>(
            <div key={g.id} style={{ background:'#0f0f0f', border:'1px solid rgba(255,255,255,.05)', overflow:'hidden' }}>
              <div style={{ position:'relative', height:'140px', background:'#141414' }}>
                {g.coverImage
                  ? <Image src={g.coverImage} alt="" fill className="object-cover" sizes="350px"/>
                  : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}><Images size={22} color="#222"/></div>
                }
                {g.featured&&<span style={{ position:'absolute', top:'10px', left:'10px', background:'#c4a456', color:'#030303', fontSize:'.48rem', letterSpacing:'.15em', textTransform:'uppercase', padding:'3px 8px' }}>Featured</span>}
                <div style={{ position:'absolute', bottom:'10px', right:'10px', background:'rgba(3,3,3,.7)', padding:'3px 8px' }}>
                  <span style={{ fontFamily:'DM Mono, monospace', fontSize:'.52rem', color:'#888' }}>{g._count.photos} photos</span>
                </div>
              </div>
              <div style={{ padding:'14px' }}>
                <p style={{ color:'#ede8e0', fontSize:'.88rem', marginBottom:'3px' }}>{g.title}</p>
                <p style={{ color:'#555', fontSize:'.65rem', marginBottom:'12px' }}>{g.category}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'4px', borderTop:'1px solid rgba(255,255,255,.04)', paddingTop:'10px' }}>
                  <Link href={`/admin/photos?galleryId=${g.id}`}
                    style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 10px', border:'1px solid rgba(255,255,255,.08)', color:'#888', textDecoration:'none', fontSize:'.58rem', letterSpacing:'.15em', textTransform:'uppercase', transition:'all .2s' }}>
                    <Images size={10}/> Photos
                  </Link>
                  <button onClick={()=>toggle(g,'featured')} style={{ background:'none', border:'none', cursor:'pointer', padding:'6px', color:g.featured?'#c4a456':'#444' }} title="Feature on homepage"><Star size={14}/></button>
                  <button onClick={()=>toggle(g,'published')} style={{ background:'none', border:'none', cursor:'pointer', padding:'6px', color:'#444' }} title={g.published?'Hide':'Publish'}>
                    {g.published?<Eye size={14}/>:<EyeOff size={14}/>}
                  </button>
                  <button onClick={()=>{ setEditing(g); setForm({title:g.title,description:g.description||'',category:g.category,featured:g.featured,published:g.published}); setModal(true) }} style={{ background:'none', border:'none', cursor:'pointer', padding:'6px', color:'#444' }}><Edit2 size={14}/></button>
                  <button onClick={()=>del(g.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:'6px', color:'#444' }}><Trash2 size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal&&(
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.88)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
          <div style={{ background:'#0f0f0f', border:'1px solid rgba(255,255,255,.08)', width:'100%', maxWidth:'440px' }}>
            <div style={{ padding:'18px 22px', borderBottom:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'space-between' }}>
              <p style={{ color:'#ede8e0', fontSize:'.85rem' }}>{editing?'Edit Gallery':'New Gallery'}</p>
              <button onClick={()=>setModal(false)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ padding:'22px', display:'flex', flexDirection:'column', gap:'14px' }}>
              <div><label style={lbl}>Gallery Name *</label><input style={inp} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Summer Weddings"/></div>
              <div><label style={lbl}>Description</label><textarea style={{...inp,resize:'none'}} rows={2} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></div>
              <div>
                <label style={lbl}>Category</label>
                <select style={{...inp,cursor:'pointer'}} value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                  {['Wedding','Portrait','Editorial','Commercial','Event','Newborn','Family','General'].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e=>setForm(p=>({...p,featured:e.target.checked}))}/>
                <span style={{ color:'#777', fontSize:'.8rem' }}>Feature on homepage</span>
              </label>
              <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
                <input type="checkbox" checked={form.published} onChange={e=>setForm(p=>({...p,published:e.target.checked}))}/>
                <span style={{ color:'#777', fontSize:'.8rem' }}>Published (visible on site)</span>
              </label>
              <div style={{ display:'flex', gap:'10px' }}>
                <button onClick={save} disabled={!form.title||loading}
                  style={{ flex:1, padding:'11px', background:'#c4a456', color:'#030303', border:'none', fontSize:'.6rem', letterSpacing:'.18em', textTransform:'uppercase', cursor:'pointer', opacity:(!form.title||loading)?.6:1 }}>
                  {loading?'Saving…':editing?'Save':'Create'}
                </button>
                <button onClick={()=>setModal(false)} style={{ padding:'11px 18px', background:'none', border:'1px solid rgba(255,255,255,.12)', color:'#666', fontSize:'.6rem', letterSpacing:'.18em', textTransform:'uppercase', cursor:'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {toast&&<div style={{ position:'fixed', bottom:'24px', right:'24px', background:'rgba(196,164,86,.1)', border:'1px solid rgba(196,164,86,.3)', color:'#c4a456', padding:'12px 20px', fontSize:'.8rem' }}>{toast}</div>}
    </div>
  )
}
