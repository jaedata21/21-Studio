'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload } from 'lucide-react'

export default function SettingsPage() {
  const [logo,     setLogo]     = useState('')
  const [preview,  setPreview]  = useState('')
  const [uploading,setUploading]= useState(false)
  const [toast,    setToast]    = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const showToast=(m:string)=>{ setToast(m); setTimeout(()=>setToast(''),3000) }

  const pickFile=(e:React.ChangeEvent<HTMLInputElement>)=>{ const f=e.target.files?.[0]; if(f) setPreview(URL.createObjectURL(f)) }
  const uploadLogo=async()=>{
    const f=fileRef.current?.files?.[0]; if(!f) return
    setUploading(true)
    const fd=new FormData(); fd.append('files',f)
    const res=await fetch('/api/upload',{method:'POST',body:fd})
    const data=await res.json()
    if(data.photos?.[0]?.url){
      await fetch('/api/content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({logo_image:data.photos[0].url})})
      setLogo(data.photos[0].url); showToast('Logo uploaded!')
    }
    setUploading(false)
  }

  const s: Record<string,React.CSSProperties> = {
    card: { background:'#0f0f0f', border:'1px solid rgba(255,255,255,.05)', marginBottom:'16px' },
    head: { padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,.05)', color:'#888', fontSize:'.6rem', letterSpacing:'.2em', textTransform:'uppercase', fontFamily:'DM Mono, monospace' },
    body: { padding:'20px' },
  }

  return (
    <div style={{ padding:'32px 40px', maxWidth:'600px', fontFamily:'Josefin Sans, sans-serif' }}>
      <p style={{ fontFamily:'DM Mono, monospace', fontSize:'.58rem', letterSpacing:'.22em', textTransform:'uppercase', color:'#c4a456', marginBottom:'4px' }}>Settings</p>
      <h1 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'1.8rem', fontWeight:400, color:'#ede8e0', marginBottom:'28px' }}>Site Settings</h1>

      <div style={s.card}>
        <div style={s.head}>Logo</div>
        <div style={s.body}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'16px' }}>
            <div style={{ width:'80px', height:'80px', background:'#141414', border:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
              {(preview||logo)
                ? <Image src={preview||logo} alt="Logo" width={80} height={80} style={{ objectFit:'contain', width:'100%', height:'100%' }}/>
                : <span style={{ fontSize:'.55rem', color:'#333', letterSpacing:'.1em' }}>No logo</span>
              }
            </div>
            <div>
              <p style={{ color:'#ede8e0', fontSize:'.82rem', marginBottom:'4px' }}>Upload your logo</p>
              <p style={{ color:'#555', fontSize:'.68rem' }}>PNG or SVG with transparency. Max 2MB.</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={pickFile}/>
            <button onClick={()=>fileRef.current?.click()} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'8px 14px', border:'1px solid rgba(255,255,255,.12)', background:'transparent', color:'#888', fontSize:'.62rem', letterSpacing:'.15em', textTransform:'uppercase', cursor:'pointer' }}>
              <Upload size={11}/> Choose File
            </button>
            {preview&&(
              <button onClick={uploadLogo} disabled={uploading}
                style={{ padding:'8px 16px', background:'#c4a456', color:'#030303', border:'none', fontSize:'.62rem', letterSpacing:'.15em', textTransform:'uppercase', cursor:'pointer', opacity:uploading?.6:1 }}>
                {uploading?'Uploading…':'Save Logo'}
              </button>
            )}
          </div>
          <p style={{ marginTop:'10px', fontSize:'.62rem', color:'#444' }}>
            Or set a logo URL in <a href="/admin/content" style={{ color:'#c4a456' }}>Content → Brand</a>
          </p>
        </div>
      </div>

      {toast&&<div style={{ position:'fixed', bottom:'24px', right:'24px', background:'rgba(196,164,86,.1)', border:'1px solid rgba(196,164,86,.3)', color:'#c4a456', padding:'12px 20px', fontSize:'.8rem' }}>{toast}</div>}
    </div>
  )
}
