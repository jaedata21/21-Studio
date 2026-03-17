'use client'
import { useState, useEffect } from 'react'
import { Save, Eye, CheckCircle, Monitor, Smartphone, RefreshCw } from 'lucide-react'

type CMS = Record<string, string>

const groups = [
  {
    key:'hero', label:'🌅 Hero Section', desc:'Full-screen opening image and headline',
    fields:[
      { key:'hero_headline',  label:'Main Headline',        type:'text',     placeholder:'21 Studios' },
      { key:'hero_subtext',   label:'Tagline',              type:'text',     placeholder:'Where light becomes legacy' },
      { key:'hero_image',     label:'Background Image URL', type:'image-url',placeholder:'https://res.cloudinary.com/...' },
    ],
  },
  {
    key:'about', label:'👤 About Page', desc:'Your story and photographer bio',
    fields:[
      { key:'about_headline',     label:'Page Headline',        type:'text',     placeholder:'The Vision Behind the Lens' },
      { key:'about_quote',        label:'Signature Quote',      type:'textarea', placeholder:'"I believe every frame…"' },
      { key:'about_body',         label:'Story Text',           type:'textarea', placeholder:'Your story…' },
      { key:'photographer_name',  label:'Your Name',            type:'text',     placeholder:'Sanjae Whyte' },
      { key:'photographer_title', label:'Your Title',           type:'text',     placeholder:'Lead Photographer' },
    ],
  },
  {
    key:'cta', label:'📣 Call to Action', desc:'Booking prompt section',
    fields:[
      { key:'cta_headline', label:'CTA Headline', type:'text',     placeholder:"Let's Create Something Timeless" },
      { key:'cta_subtext',  label:'CTA Subtext',  type:'textarea', placeholder:'Limited availability…' },
    ],
  },
  {
    key:'contact', label:'📞 Contact Info', desc:'Shown on booking page and footer',
    fields:[
      { key:'contact_email',    label:'Email',    type:'email', placeholder:'hello@21studios.com' },
      { key:'contact_phone',    label:'Phone',    type:'text',  placeholder:'+1 (876) 123-4567' },
      { key:'contact_location', label:'Location', type:'text',  placeholder:'Kingston, Jamaica & Worldwide' },
    ],
  },
  {
    key:'brand', label:'🎨 Brand', desc:'Logo and social links',
    fields:[
      { key:'logo_text',     label:'Logo Text',      type:'text', placeholder:'21 Studios' },
      { key:'logo_image',    label:'Logo Image URL', type:'image-url', placeholder:'https://…' },
      { key:'instagram_url', label:'Instagram URL',  type:'url',  placeholder:'https://instagram.com/…' },
    ],
  },
]

export default function ContentPage() {
  const [content,  setContent]  = useState<CMS>({})
  const [active,   setActive]   = useState('hero')
  const [saving,   setSaving]   = useState<string|null>(null)
  const [saved,    setSaved]    = useState<string|null>(null)
  const [preview,  setPreview]  = useState<'desktop'|'mobile'>('desktop')
  const [showPrev, setShowPrev] = useState(false)

  useEffect(()=>{
    fetch('/api/content').then(r=>r.json()).then(setContent).catch(()=>{})
  },[])

  const set = (key:string, value:string) => setContent(p=>({...p,[key]:value}))

  const saveGroup = async (groupKey:string, fields:{key:string}[]) => {
    setSaving(groupKey)
    const body:CMS = {}
    fields.forEach(f=>{ body[f.key]=content[f.key]||'' })
    await fetch('/api/content',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
    setSaving(null); setSaved(groupKey)
    setTimeout(()=>setSaved(null),2500)
  }

  const saveField = async (key:string, value:string) => {
    set(key,value)
    await fetch('/api/content',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({[key]:value}) })
  }

  const currentGroup = groups.find(g=>g.key===active)!

  const inputStyle: React.CSSProperties = {
    width:'100%', background:'#0a0a0a',
    border:'1px solid rgba(255,255,255,.08)',
    padding:'10px 14px', color:'#ede8e0',
    fontSize:'13px', outline:'none',
    fontFamily:'Josefin Sans, sans-serif', fontWeight:300,
    transition:'border-color .3s',
  }
  const labelStyle: React.CSSProperties = {
    display:'block', fontSize:'.58rem', letterSpacing:'.22em',
    textTransform:'uppercase', color:'#c4a456', marginBottom:'7px',
    fontFamily:'DM Mono, monospace',
  }

  return (
    <div style={{ height:'100%', display:'flex', fontFamily:'Josefin Sans, sans-serif' }}>

      {/* Section sidebar */}
      <div style={{ width:'180px', flexShrink:0, borderRight:'1px solid rgba(255,255,255,.05)', background:'#0a0a0a', padding:'12px', display:'flex', flexDirection:'column', gap:'2px' }}>
        <p style={{ fontSize:'.52rem', letterSpacing:'.2em', textTransform:'uppercase', color:'#444', padding:'8px 12px 12px', fontFamily:'DM Mono, monospace' }}>Sections</p>
        {groups.map(g=>(
          <button key={g.key} onClick={()=>setActive(g.key)}
            style={{
              textAlign:'left', padding:'10px 12px', border:'none', cursor:'pointer',
              borderRadius:'2px', transition:'all .2s', fontSize:'.72rem',
              background: active===g.key ? 'rgba(196,164,86,.1)' : 'transparent',
              color: active===g.key ? '#c4a456' : '#666',
            }}>
            {g.label}
          </button>
        ))}
        <div style={{ marginTop:'auto', padding:'12px 0', borderTop:'1px solid rgba(255,255,255,.05)' }}>
          <a href="/" target="_blank" style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'.62rem', color:'#444', textDecoration:'none', padding:'8px 12px' }}>
            <Eye size={11}/> Live site
          </a>
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px', maxWidth:'750px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h2 style={{ color:'#ede8e0', fontSize:'1.5rem', fontFamily:'Cormorant Garamond, serif', fontWeight:400 }}>{currentGroup.label}</h2>
            <p style={{ color:'#555', fontSize:'.75rem', marginTop:'3px' }}>{currentGroup.desc}</p>
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={()=>setShowPrev(!showPrev)}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', border:'1px solid rgba(255,255,255,.1)', background:'transparent', color:'#888', fontSize:'.62rem', letterSpacing:'.15em', textTransform:'uppercase', cursor:'pointer', transition:'all .3s' }}>
              <Eye size={12}/> {showPrev?'Hide':'Preview'}
            </button>
            <button onClick={()=>saveGroup(active,currentGroup.fields)} disabled={saving===active}
              style={{
                display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', border:'none', cursor:'pointer',
                fontSize:'.62rem', letterSpacing:'.18em', textTransform:'uppercase', transition:'all .3s',
                background: saved===active ? 'rgba(34,197,94,.1)' : '#c4a456',
                color: saved===active ? '#4ade80' : '#030303',
                borderWidth:'1px', borderStyle:'solid',
                borderColor: saved===active ? 'rgba(34,197,94,.3)' : '#c4a456',
              }}>
              {saved===active ? <><CheckCircle size={12}/> Saved!</> : saving===active ? 'Saving…' : <><Save size={12}/> Save</>}
            </button>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          {currentGroup.fields.map(field=>(
            <div key={field.key}
              style={{ padding:'18px', background:'#0f0f0f', border:'1px solid rgba(255,255,255,.05)' }}>
              <label style={labelStyle}>{field.label}</label>

              {field.type==='textarea' ? (
                <textarea rows={4} value={content[field.key]||''} placeholder={field.placeholder}
                  onChange={e=>set(field.key,e.target.value)}
                  onBlur={e=>saveField(field.key,e.target.value)}
                  style={{...inputStyle, resize:'vertical'}}/>
              ) : (
                <input type={field.type==='image-url'?'text':field.type}
                  value={content[field.key]||''} placeholder={field.placeholder}
                  onChange={e=>set(field.key,e.target.value)}
                  onBlur={e=>saveField(field.key,e.target.value)}
                  style={inputStyle}/>
              )}

              {/* Image preview */}
              {field.type==='image-url' && content[field.key] && (
                <div style={{ marginTop:'12px', position:'relative', height:'120px', overflow:'hidden', border:'1px solid rgba(255,255,255,.06)' }}>
                  <img src={content[field.key]} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(3,3,3,.3),transparent)', pointerEvents:'none' }}/>
                  <span style={{ position:'absolute', top:'8px', right:'8px', fontFamily:'DM Mono', fontSize:'.5rem', letterSpacing:'.15em', textTransform:'uppercase', color:'#c4a456', background:'rgba(3,3,3,.7)', padding:'3px 8px', backdropFilter:'blur(8px)' }}>
                    Live Preview
                  </span>
                </div>
              )}

              <p style={{ fontSize:'.58rem', color:'#333', marginTop:'6px' }}>
                Auto-saves when you click away · Press Tab to move to next field
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Live preview panel */}
      {showPrev && (
        <div style={{ width:'420px', flexShrink:0, borderLeft:'1px solid rgba(255,255,255,.05)', display:'flex', flexDirection:'column', background:'#070707' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,.05)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:'.6rem', color:'#666', letterSpacing:'.15em', textTransform:'uppercase' }}>Preview</span>
            <div style={{ display:'flex', gap:'4px' }}>
              {(['desktop','mobile'] as const).map(d=>(
                <button key={d} onClick={()=>setPreview(d)}
                  style={{ padding:'5px 10px', border:'none', cursor:'pointer', fontSize:'.58rem', borderRadius:'2px', background:preview===d?'rgba(196,164,86,.15)':'transparent', color:preview===d?'#c4a456':'#444', transition:'all .2s' }}>
                  {d==='desktop'?<Monitor size={12}/>:<Smartphone size={12}/>}
                </button>
              ))}
              <button onClick={()=>setShowPrev(false)}
                style={{ padding:'5px 8px', border:'none', cursor:'pointer', background:'transparent', color:'#444', fontSize:'1rem', lineHeight:1 }}>
                ✕
              </button>
            </div>
          </div>

          {/* Mini hero preview */}
          {active==='hero' && (
            <div style={{ flex:1, padding:'16px', overflow:'auto' }}>
              <div style={{
                position:'relative', width:'100%',
                height: preview==='mobile' ? '420px' : '280px',
                overflow:'hidden', background:'#111',
                border:'1px solid rgba(255,255,255,.06)',
                maxWidth: preview==='mobile' ? '220px' : '100%',
                margin:'0 auto',
              }}>
                {content.hero_image && (
                  <img src={content.hero_image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                )}
                <div style={{ position:'absolute', inset:0, background:'rgba(3,3,3,.55)' }}/>
                <div style={{ position:'absolute', bottom:'20px', left:'20px', right:'20px' }}>
                  <p style={{ fontFamily:'Cormorant Garamond, serif', fontSize:preview==='mobile'?'2rem':'1.6rem', fontWeight:300, color:'#ede8e0', lineHeight:.9, marginBottom:'8px' }}>
                    {content.hero_headline||'21 Studios'}
                  </p>
                  <p style={{ fontFamily:'Josefin Sans, sans-serif', fontSize:'.55rem', letterSpacing:'.2em', textTransform:'uppercase', color:'rgba(237,232,224,.7)' }}>
                    {content.hero_subtext||'Where light becomes legacy'}
                  </p>
                </div>
              </div>
              <div style={{ marginTop:'16px', padding:'12px', background:'rgba(196,164,86,.05)', border:'1px solid rgba(196,164,86,.15)' }}>
                <p style={{ fontSize:'.62rem', color:'#c4a456', letterSpacing:'.12em' }}>
                  💡 Changes auto-save when you click away. Push to GitHub to update your live site.
                </p>
              </div>
            </div>
          )}

          {active!=='hero' && (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
              <div style={{ textAlign:'center' }}>
                <p style={{ color:'#333', fontSize:'.8rem' }}>Preview available for Hero section</p>
                <p style={{ color:'#222', fontSize:'.68rem', marginTop:'6px' }}>Other sections update live on save</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
