'use client'
import { useState } from 'react'
import { DndContext, closestCenter, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff, CheckCircle } from 'lucide-react'

const DEFAULT = [
  {id:'hero',        label:'Hero',             icon:'🌅', desc:'Full-screen opening image',      visible:true},
  {id:'marquee',     label:'Marquee Ticker',   icon:'↔️', desc:'Scrolling services strip',        visible:true},
  {id:'featured',    label:'Featured Work',    icon:'⭐', desc:'Grid of best projects',          visible:true},
  {id:'parallax',    label:'Parallax Gallery', icon:'🎞️', desc:'Cinematic multi-column gallery',  visible:true},
  {id:'photobreak1', label:'Photo Break #1',   icon:'🖼️', desc:'Full-bleed image with quote',    visible:true},
  {id:'story',       label:'Story Sections',   icon:'📖', desc:'Apple-style alternating panels', visible:true},
  {id:'testimonials',label:'Testimonials',     icon:'💬', desc:'Client quotes carousel',         visible:true},
  {id:'photobreak2', label:'Photo Break #2',   icon:'🖼️', desc:'Second full-bleed moment',       visible:true},
  {id:'cta',         label:'Call to Action',   icon:'📅', desc:'Booking invitation',             visible:true},
]

function SortRow({ s, onToggle }: { s: typeof DEFAULT[0]; onToggle: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: s.id })

  const rowStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    background: isDragging ? 'rgba(196,164,86,.06)' : '#0f0f0f',
    border: `1px solid ${isDragging ? 'rgba(196,164,86,.3)' : 'rgba(255,255,255,.05)'}`,
    marginBottom: '6px',
    opacity: !s.visible ? 0.45 : isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={rowStyle}>
      <button {...attributes} {...listeners}
        style={{ background:'none', border:'none', color:'#444', cursor:'grab', padding:'3px', touchAction:'none' }}>
        <GripVertical size={14}/>
      </button>
      <span style={{ fontSize:'1.1rem', width:'22px', textAlign:'center' }}>{s.icon}</span>
      <div style={{ flex:1 }}>
        <p style={{ color:'#ede8e0', fontSize:'.78rem' }}>{s.label}</p>
        <p style={{ color:'#444', fontSize:'.62rem', marginTop:'2px' }}>{s.desc}</p>
      </div>
      <button onClick={() => onToggle(s.id)}
        style={{
          display:'flex', alignItems:'center', gap:'6px',
          padding:'6px 12px',
          border: `1px solid ${s.visible ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.04)'}`,
          background:'transparent',
          color: s.visible ? '#888' : '#444',
          fontSize:'.58rem', letterSpacing:'.15em', textTransform:'uppercase',
          cursor:'pointer', transition:'all .2s',
        }}>
        {s.visible ? <Eye size={11}/> : <EyeOff size={11}/>}
        {s.visible ? 'Visible' : 'Hidden'}
      </button>
    </div>
  )
}

export default function SectionsPage() {
  const [sections, setSections] = useState(DEFAULT)
  const [saved,    setSaved]    = useState(false)
  const sensors = useSensors(useSensor(PointerSensor))

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oi = sections.findIndex(s => s.id === active.id)
    const ni = sections.findIndex(s => s.id === over.id)
    setSections(arrayMove(sections, oi, ni))
  }

  const toggle = (id: string) => setSections(p => p.map(s => s.id === id ? { ...s, visible: !s.visible } : s))

  const save = () => {
    localStorage.setItem('21studios_sections', JSON.stringify(sections))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ padding:'32px 40px', maxWidth:'650px', fontFamily:'Josefin Sans, sans-serif' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px', gap:'16px', flexWrap:'wrap' }}>
        <div>
          <p style={{ fontFamily:'DM Mono, monospace', fontSize:'.58rem', letterSpacing:'.22em', textTransform:'uppercase', color:'#c4a456', marginBottom:'4px' }}>Layout</p>
          <h1 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'1.8rem', fontWeight:400, color:'#ede8e0' }}>Homepage Sections</h1>
          <p style={{ color:'#555', fontSize:'.72rem', marginTop:'4px' }}>Drag to reorder · Toggle to show/hide</p>
        </div>
        <button onClick={save} style={{
          display:'flex', alignItems:'center', gap:'7px',
          padding:'10px 18px', border:'none', fontSize:'.62rem',
          letterSpacing:'.18em', textTransform:'uppercase', cursor:'pointer',
          background: saved ? 'rgba(34,197,94,.1)' : '#c4a456',
          color: saved ? '#4ade80' : '#030303',
          borderWidth:'1px', borderStyle:'solid',
          borderColor: saved ? 'rgba(34,197,94,.3)' : '#c4a456',
        }}>
          {saved ? <><CheckCircle size={12}/> Saved!</> : 'Save Order'}
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map(s => <SortRow key={s.id} s={s} onToggle={toggle}/>)}
        </SortableContext>
      </DndContext>

      <p style={{ fontFamily:'DM Mono, monospace', fontSize:'.55rem', letterSpacing:'.15em', color:'#333', textAlign:'center', marginTop:'16px' }}>
        {sections.filter(s => s.visible).length} of {sections.length} sections visible
      </p>
    </div>
  )
}
