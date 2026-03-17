'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Upload, Trash2, GripVertical, Edit2, Check, X, Loader2, Plus } from 'lucide-react'

interface Photo {
  id:string; url:string; thumbUrl:string|null; alt:string|null
  width:number; height:number; sortOrder:number
  gallery:{ title:string; id:string }|null
}
interface Gallery { id:string; title:string }

function SortableCard({ photo, onDelete, onEditAlt }:{
  photo:Photo; onDelete:(id:string)=>void; onEditAlt:(id:string,alt:string)=>void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({id:photo.id})
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState(photo.alt||'')

  const save = async () => {
    await onEditAlt(photo.id, draft)
    setEditing(false)
  }

  return (
    <div ref={setNodeRef}
      style={{ transform:CSS.Transform.toString(transform), transition, opacity:isDragging?.4:1 }}
      className="relative group bg-charcoal border border-white/[0.04] hover:border-white/10 transition-all overflow-hidden">

      <div className="relative aspect-square overflow-hidden">
        <Image src={photo.thumbUrl||photo.url} alt={photo.alt||''} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" sizes="200px"/>

        {/* Hover actions */}
        <div className="absolute inset-0 bg-void/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
          <div className="flex justify-between">
            <button {...attributes} {...listeners}
              className="w-7 h-7 bg-white/10 flex items-center justify-center cursor-grab touch-none hover:bg-white/20 transition-colors">
              <GripVertical size={12} className="text-white"/>
            </button>
            <button onClick={()=>onDelete(photo.id)}
              className="w-7 h-7 bg-red-500/20 hover:bg-red-500/50 flex items-center justify-center transition-colors">
              <Trash2 size={11} className="text-red-300"/>
            </button>
          </div>
          <button onClick={()=>setEditing(true)}
            className="w-full py-1.5 bg-void/70 backdrop-blur-sm border border-white/15 text-[.58rem] tracking-wider uppercase text-ivory hover:border-gold hover:text-gold transition-colors flex items-center justify-center gap-1.5">
            <Edit2 size={10}/> Edit Caption
          </button>
        </div>
      </div>

      {/* Caption */}
      {editing ? (
        <div className="p-2 flex gap-1.5">
          <input autoFocus value={draft} onChange={e=>setDraft(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') save(); if(e.key==='Escape') setEditing(false) }}
            className="flex-1 bg-void border border-gold/40 px-2 py-1 text-[.68rem] text-ivory outline-none"/>
          <button onClick={save} className="w-6 h-6 bg-gold flex items-center justify-center"><Check size={10} className="text-void"/></button>
          <button onClick={()=>setEditing(false)} className="w-6 h-6 bg-steel flex items-center justify-center"><X size={10} className="text-ivory"/></button>
        </div>
      ) : (
        <div className="px-2.5 py-2">
          <p className="text-[.6rem] text-smoke truncate">{photo.alt||'No caption'}</p>
          {photo.gallery && <p className="text-[.52rem] text-gold/60 mt-0.5 truncate">{photo.gallery.title}</p>}
        </div>
      )}
    </div>
  )
}

export default function PortfolioAdminPage() {
  const [photos,    setPhotos]    = useState<Photo[]>([])
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [filter,    setFilter]    = useState('all')
  const [uploading, setUploading] = useState(false)
  const [queue,     setQueue]     = useState<{file:File;preview:string}[]>([])
  const [assignTo,  setAssignTo]  = useState('')
  const [toast,     setToast]     = useState('')
  const [tab,       setTab]       = useState<'library'|'upload'>('library')

  const showToast = (msg:string)=>{ setToast(msg); setTimeout(()=>setToast(''),3000) }

  const load = useCallback(async()=>{
    const [p,g] = await Promise.all([
      fetch('/api/photos').then(r=>r.json()),
      fetch('/api/galleries').then(r=>r.json()),
    ])
    setPhotos(Array.isArray(p)?p:[])
    setGalleries(Array.isArray(g)?g:[])
  },[])

  useEffect(()=>{ load() },[load])

  const onDrop = useCallback((files:File[])=>{
    const items = files.map(f=>({ file:f, preview:URL.createObjectURL(f) }))
    setQueue(p=>[...p,...items])
    setTab('upload')
  },[])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept:{'image/*':['.jpg','.jpeg','.png','.webp']},
  })

  const upload = async()=>{
    if(!queue.length) return
    setUploading(true)
    for(const item of queue){
      const fd = new FormData()
      fd.append('files',item.file)
      if(assignTo) fd.append('galleryId',assignTo)
      await fetch('/api/upload',{method:'POST',body:fd})
    }
    setUploading(false)
    setQueue([])
    setTab('library')
    showToast(`${queue.length} photo${queue.length!==1?'s':''} uploaded`)
    load()
  }

  const del = async(id:string)=>{
    if(!confirm('Delete permanently?')) return
    await fetch(`/api/photos/${id}`,{method:'DELETE'})
    showToast('Deleted'); load()
  }

  const editAlt = async(id:string, alt:string)=>{
    await fetch(`/api/photos/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({alt})})
    showToast('Caption saved'); load()
  }

  const onDragEnd = async(e:DragEndEvent)=>{
    const {active,over}=e
    if(!over||active.id===over.id) return
    const oldI=photos.findIndex(p=>p.id===active.id)
    const newI=photos.findIndex(p=>p.id===over.id)
    const reordered=arrayMove(photos,oldI,newI).map((p,i)=>({...p,sortOrder:i}))
    setPhotos(reordered)
    await fetch('/api/photos',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(reordered.map(p=>({id:p.id,sortOrder:p.sortOrder})))})
    showToast('Order saved')
  }

  const displayed = filter==='all' ? photos : photos.filter(p=>p.gallery?.id===filter)

  const btnStyle = (active:boolean): React.CSSProperties => ({
    padding:'7px 16px', border:'none', cursor:'pointer', fontSize:'.62rem',
    letterSpacing:'.18em', textTransform:'uppercase',
    background: active?'rgba(196,164,86,.15)':'transparent',
    color: active?'#c4a456':'#555',
    transition:'all .2s',
  })

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', fontFamily:'Josefin Sans, sans-serif' }}>

      {/* Toolbar */}
      <div style={{ padding:'14px 24px', borderBottom:'1px solid rgba(255,255,255,.05)', background:'#0a0a0a', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
        <div style={{ display:'flex', background:'#141414', border:'1px solid rgba(255,255,255,.06)', borderRadius:'2px', overflow:'hidden' }}>
          <button style={btnStyle(tab==='library')} onClick={()=>setTab('library')}>
            Library ({photos.length})
          </button>
          <button style={btnStyle(tab==='upload')} onClick={()=>setTab('upload')}>
            <Plus size={11} style={{ display:'inline', marginRight:'5px' }}/> Upload{queue.length>0?` (${queue.length})`:''}
          </button>
        </div>

        {/* Gallery filter */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginLeft:'auto' }}>
          <span style={{ fontSize:'.58rem', color:'#444', letterSpacing:'.15em', textTransform:'uppercase' }}>Filter:</span>
          <select value={filter} onChange={e=>setFilter(e.target.value)}
            style={{ background:'#141414', border:'1px solid rgba(255,255,255,.08)', color:'#888', fontSize:'.68rem', padding:'6px 12px', outline:'none', cursor:'pointer' }}>
            <option value="all">All Photos</option>
            {galleries.map(g=><option key={g.id} value={g.id}>{g.title}</option>)}
          </select>
        </div>

        {/* Assign to */}
        <select value={assignTo} onChange={e=>setAssignTo(e.target.value)}
          style={{ background:'#141414', border:'1px solid rgba(255,255,255,.08)', color:'#888', fontSize:'.68rem', padding:'6px 12px', outline:'none', cursor:'pointer' }}>
          <option value="">No gallery</option>
          {galleries.map(g=><option key={g.id} value={g.id}>{g.title}</option>)}
        </select>
      </div>

      {/* Body */}
      <div style={{ flex:1, overflow:'auto', padding:'24px' }}>
        {tab==='upload' ? (
          <div style={{ maxWidth:'700px' }}>
            {/* Drop zone */}
            <div {...getRootProps()} style={{
              border:`2px dashed ${isDragActive?'#c4a456':'rgba(255,255,255,.08)'}`,
              background: isDragActive?'rgba(196,164,86,.06)':'rgba(255,255,255,.01)',
              padding:'60px 24px', textAlign:'center', cursor:'pointer', marginBottom:'20px',
              transition:'all .3s', transform: isDragActive?'scale(1.01)':'scale(1)',
            }}>
              <input {...getInputProps()}/>
              <Upload size={28} style={{ margin:'0 auto 12px', color: isDragActive?'#c4a456':'#333', display:'block' }}/>
              <p style={{ color:'#888', fontSize:'.85rem', marginBottom:'4px' }}>{isDragActive?'Drop images here':'Drag photos here or click to browse'}</p>
              <p style={{ color:'#444', fontSize:'.7rem' }}>JPG, PNG, WebP</p>
            </div>

            {queue.length>0&&(
              <>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))', gap:'8px', marginBottom:'16px' }}>
                  {queue.map((item,i)=>(
                    <div key={i} style={{ position:'relative', aspectRatio:'1', overflow:'hidden', background:'#141414' }}>
                      <img src={item.preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      <button onClick={()=>setQueue(p=>p.filter((_,idx)=>idx!==i))}
                        style={{ position:'absolute', top:'4px', right:'4px', width:'20px', height:'20px', background:'rgba(0,0,0,.7)', border:'none', cursor:'pointer', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <X size={10}/>
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={upload} disabled={uploading}
                  style={{ display:'flex', alignItems:'center', gap:'8px', padding:'11px 24px', background:'#c4a456', color:'#030303', border:'none', fontSize:'.62rem', letterSpacing:'.18em', textTransform:'uppercase', cursor:'pointer', opacity:uploading?.6:1 }}>
                  {uploading?<><Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/>Uploading…</>:<><Upload size={13}/>Upload {queue.length} photo{queue.length!==1?'s':''}</>}
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <p style={{ fontSize:'.58rem', color:'#444', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:'16px' }}>
              Drag to reorder · Hover for options · Click caption to edit
            </p>
            {displayed.length===0 ? (
              <div style={{ textAlign:'center', padding:'60px', color:'#333' }}>
                <p style={{ fontSize:'.9rem' }}>No photos yet</p>
                <button onClick={()=>setTab('upload')} style={{ marginTop:'16px', padding:'10px 20px', background:'#c4a456', color:'#030303', border:'none', fontSize:'.62rem', letterSpacing:'.18em', textTransform:'uppercase', cursor:'pointer' }}>
                  Upload Photos
                </button>
              </div>
            ) : (
              <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={displayed.map(p=>p.id)} strategy={rectSortingStrategy}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'10px' }}>
                    {displayed.map(p=>(
                      <SortableCard key={p.id} photo={p} onDelete={del} onEditAlt={editAlt}/>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </>
        )}
      </div>

      {toast&&(
        <div style={{ position:'fixed', bottom:'24px', right:'24px', background:'rgba(196,164,86,.1)', border:'1px solid rgba(196,164,86,.3)', color:'#c4a456', padding:'12px 20px', fontSize:'.8rem', zIndex:998 }}>
          {toast}
        </div>
      )}
    </div>
  )
}
