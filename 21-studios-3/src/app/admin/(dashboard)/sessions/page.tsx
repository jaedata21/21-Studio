'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, ToggleLeft, ToggleRight, CheckCircle } from 'lucide-react'

interface Session { id:string; title:string; price:string; duration:string|null; description:string|null; includes:string; category:string; active:boolean }
const blank = { title:'', price:'', duration:'', description:'', category:'Portrait', active:true, includes:[''] }

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState<Session|null>(null)
  const [form,     setForm]     = useState(blank)
  const [toast,    setToast]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const load = async()=>{ const d=await fetch('/api/sessions').then(r=>r.json()); setSessions(Array.isArray(d)?d:[]) }
  useEffect(()=>{ load() },[])
  const showToast=(m:string)=>{ setToast(m); setTimeout(()=>setToast(''),3000) }

  const openCreate=()=>{ setEditing(null); setForm(blank); setModal(true) }
  const openEdit=(s:Session)=>{
    setEditing(s)
    let inc=['']
    try { inc=JSON.parse(s.includes) } catch{}
    setForm({ title:s.title, price:s.price, duration:s.duration||'', description:s.description||'', category:s.category, active:s.active, includes:inc })
    setModal(true)
  }
  const save=async()=>{
    setLoading(true)
    const body={...form,includes:form.includes.filter(Boolean)}
    if(editing) await fetch(`/api/sessions/${editing.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    else await fetch('/api/sessions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    setLoading(false); setModal(false); load(); showToast(editing?'Session updated':'Session created')
  }
  const del=async(id:string)=>{ if(!confirm('Delete?')) return; await fetch(`/api/sessions/${id}`,{method:'DELETE'}); showToast('Deleted'); load() }
  const toggle=async(s:Session)=>{ await fetch(`/api/sessions/${s.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({active:!s.active})}); load() }
  const setInc=(i:number,v:string)=>setForm(p=>({...p,includes:p.includes.map((x,idx)=>idx===i?v:x)}))

  const inp: React.CSSProperties = { width:'100%', background:'#0a0a0a', border:'1px solid rgba(255,255,255,.08)', padding:'9px 13px', color:'#ede8e0', fontSize:'13px', outline:'none', fontFamily:'Josefin Sans, sans-serif' }
  const lbl: React.CSSProperties = { display:'block', fontSize:'.56rem', letterSpacing:'.2em', textTransform:'uppercase', color:'#c4a456', marginBottom:'6px', fontFamily:'DM Mono, monospace' }

  return (
    <div style={{ padding:'32px 40px', maxWidth:'800px', fontFamily:'Josefin Sans, sans-serif' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
        <div>
          <p style={{ fontFamily:'DM Mono, monospace', fontSize:'.58rem', letterSpacing:'.22em', textTransform:'uppercase', color:'#c4a456', marginBottom:'4px' }}>Manage</p>
          <h1 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'1.8rem', fontWeight:400, color:'#ede8e0' }}>Sessions & Packages</h1>
        </div>
        <button onClick={openCreate} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'10px 20px', background:'#c4a456', color:'#030303', border:'none', fontSize:'.6rem', letterSpacing:'.18em', textTransform:'uppercase', cursor:'pointer' }}>
          <Plus size={12}/> New Session
        </button>
      </div>

      {sessions.length===0?(
        <div style={{ textAlign:'center', padding:'60px', background:'#0f0f0f', border:'1px solid rgba(255,255,255,.05)' }}>
          <p style={{ color:'#ede8e0', marginBottom:'6px', fontSize:'.9rem' }}>No sessions yet</p>
          <p style={{ color:'#555', fontSize:'.75rem' }}>Add your photography packages</p>
        </div>
      ):(
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {sessions.map(s=>{
            let inc:string[]=[]
            try { inc=JSON.parse(s.includes) } catch{}
            return (
              <div key={s.id} style={{ padding:'18px', background:'#0f0f0f', border:'1px solid rgba(255,255,255,.05)', opacity:s.active?1:.5 }}>
                <div style={{ display:'flex', justifyContent:'space-between', gap:'12px' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'3px', flexWrap:'wrap' }}>
                      <p style={{ color:'#ede8e0', fontSize:'.9rem' }}>{s.title}</p>
                      <span style={{ fontSize:'.5rem', border:'1px solid rgba(255,255,255,.08)', color:'#555', padding:'2px 7px', letterSpacing:'.1em', textTransform:'uppercase' }}>{s.category}</span>
                    </div>
                    <p style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'1.4rem', fontWeight:400, color:'#c4a456', marginBottom:'6px' }}>
                      {s.price} {s.duration&&<span style={{ color:'#555', fontSize:'.8rem', fontFamily:'Josefin Sans, sans-serif' }}>· {s.duration}</span>}
                    </p>
                    {inc.length>0&&(
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                        {inc.map((item,i)=>(
                          <span key={i} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'.62rem', color:'#666' }}>
                            <CheckCircle size={9} color="#c4a456"/> {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display:'flex', gap:'3px', flexShrink:0 }}>
                    <button onClick={()=>toggle(s)} style={{ background:'none', border:'none', cursor:'pointer', padding:'6px', color:s.active?'#c4a456':'#444' }}>
                      {s.active?<ToggleRight size={17}/>:<ToggleLeft size={17}/>}
                    </button>
                    <button onClick={()=>openEdit(s)} style={{ background:'none', border:'none', cursor:'pointer', padding:'6px', color:'#555' }}><Edit2 size={14}/></button>
                    <button onClick={()=>del(s.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:'6px', color:'#555' }}><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal&&(
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.88)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
          <div style={{ background:'#0f0f0f', border:'1px solid rgba(255,255,255,.08)', width:'100%', maxWidth:'480px', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ padding:'18px 22px', borderBottom:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'space-between' }}>
              <p style={{ color:'#ede8e0', fontSize:'.85rem' }}>{editing?'Edit Session':'New Session'}</p>
              <button onClick={()=>setModal(false)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:'1.1rem' }}>✕</button>
            </div>
            <div style={{ padding:'22px', display:'flex', flexDirection:'column', gap:'14px' }}>
              <div><label style={lbl}>Title *</label><input style={inp} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Signature Wedding"/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div><label style={lbl}>Price *</label><input style={inp} value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} placeholder="$1,200"/></div>
                <div><label style={lbl}>Duration</label><input style={inp} value={form.duration} onChange={e=>setForm(p=>({...p,duration:e.target.value}))} placeholder="4 Hours"/></div>
              </div>
              <div>
                <label style={lbl}>Category</label>
                <select style={{...inp,cursor:'pointer'}} value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                  {['Wedding','Portrait','Newborn','Family','Engagement','Editorial','Commercial','Event','Destination'].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Description</label><textarea style={{...inp,resize:'none'}} rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></div>
              <div>
                <label style={lbl}>What&apos;s Included</label>
                <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
                  {form.includes.map((item,i)=>(
                    <div key={i} style={{ display:'flex', gap:'7px' }}>
                      <input style={{...inp,flex:1}} value={item} onChange={e=>setInc(i,e.target.value)} placeholder={`Item ${i+1}`}/>
                      <button onClick={()=>setForm(p=>({...p,includes:p.includes.filter((_,idx)=>idx!==i)}))} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', padding:'0 8px' }}>✕</button>
                    </div>
                  ))}
                  <button onClick={()=>setForm(p=>({...p,includes:[...p.includes,'']}))} style={{ background:'none', border:'none', color:'#c4a456', cursor:'pointer', textAlign:'left', fontSize:'.62rem', letterSpacing:'.15em', textTransform:'uppercase', padding:0 }}>+ Add item</button>
                </div>
              </div>
              <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
                <input type="checkbox" checked={form.active} onChange={e=>setForm(p=>({...p,active:e.target.checked}))}/>
                <span style={{ color:'#777', fontSize:'.8rem' }}>Active (visible on booking page)</span>
              </label>
              <div style={{ display:'flex', gap:'10px', paddingTop:'6px' }}>
                <button onClick={save} disabled={!form.title||!form.price||loading}
                  style={{ flex:1, padding:'11px', background:'#c4a456', color:'#030303', border:'none', fontSize:'.6rem', letterSpacing:'.18em', textTransform:'uppercase', cursor:'pointer', opacity:(!form.title||!form.price||loading)?.6:1 }}>
                  {loading?'Saving…':editing?'Save Changes':'Create Session'}
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
