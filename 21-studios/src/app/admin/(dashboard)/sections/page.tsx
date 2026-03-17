'use client'
import { useState } from 'react'
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff, Layers } from 'lucide-react'
import { AdminCard, GoldBtn, Toggle, useToast } from '@/components/admin/ui'

interface Section {
  id: string; label: string; desc: string; icon: string
  visible: boolean; locked?: boolean
}

const DEFAULT_SECTIONS: Section[] = [
  { id:'hero',        label:'Hero',            desc:'Full-screen cinematic opener with headline',          icon:'🎬', visible:true,  locked:true  },
  { id:'marquee',     label:'Ticker',          desc:'Scrolling text strip with service categories',        icon:'📜', visible:true  },
  { id:'featured',    label:'Featured Work',   desc:'Grid of selected projects with stats',                icon:'⭐', visible:true  },
  { id:'parallax',    label:'Parallax Gallery',desc:'5-column scroll gallery with depth effect',           icon:'🖼', visible:true  },
  { id:'photobreak1', label:'Photo Quote 1',   desc:'Full-bleed photo with floating quote',                icon:'💬', visible:true  },
  { id:'story',       label:'Story Sections',  desc:'Alternating image/text panels',                       icon:'📖', visible:true  },
  { id:'testimonials',label:'Testimonials',    desc:'Client quote carousel',                               icon:'🌟', visible:true  },
  { id:'photobreak2', label:'Photo Quote 2',   desc:'Second full-bleed photo with quote',                  icon:'💬', visible:true  },
  { id:'cta',         label:'Call to Action',  desc:'Booking prompt section',                              icon:'📅', visible:true,  locked:true  },
]

const STORAGE_KEY = 'admin_sections_order'

function load(): Section[] {
  if (typeof window === 'undefined') return DEFAULT_SECTIONS
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_SECTIONS
    const parsed: Section[] = JSON.parse(saved)
    // Merge — keep any new defaults not in saved
    const ids = new Set(parsed.map(s => s.id))
    const merged = [...parsed, ...DEFAULT_SECTIONS.filter(s => !ids.has(s.id))]
    return merged
  } catch { return DEFAULT_SECTIONS }
}

function SortableRow({ section, onToggle }: { section: Section; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id, disabled: !!section.locked })

  return (
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className={`flex items-center gap-3 px-4 py-3.5 border rounded-sm transition-all ${
        isDragging ? 'border-[#b8975a]/40 bg-[#b8975a]/5 shadow-xl shadow-black/50' :
        section.visible ? 'border-white/[0.06] bg-[#111] hover:border-white/10' :
                          'border-white/[0.03] bg-[#0d0d0d] opacity-50'
      }`}>

      {/* Drag handle */}
      {section.locked
        ? <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <div className="w-3 h-3 border border-[#333] rounded-sm flex items-center justify-center">
              <span className="text-[.45rem] text-[#333]">🔒</span>
            </div>
          </div>
        : <div {...attributes} {...listeners}
            className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0 touch-none text-[#333] hover:text-[#666] transition-colors">
            <GripVertical size={14} />
          </div>
      }

      {/* Icon */}
      <span className="text-lg w-7 text-center shrink-0">{section.icon}</span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-normal ${section.visible ? 'text-white' : 'text-[#555]'}`}>
          {section.label}
          {section.locked && <span className="ml-2 text-[.5rem] tracking-wider uppercase text-[#444] border border-white/[0.06] px-1.5 py-0.5 rounded-sm align-middle">locked</span>}
        </p>
        <p className="text-[.6rem] text-[#444] mt-0.5 truncate">{section.desc}</p>
      </div>

      {/* Visibility toggle */}
      {section.locked
        ? <div className="text-[.58rem] text-[#333] tracking-wider">Always shown</div>
        : <button onClick={onToggle} title={section.visible ? 'Hide section' : 'Show section'}
            className={`w-8 h-8 flex items-center justify-center rounded-sm transition-all ${
              section.visible ? 'text-[#b8975a] hover:bg-[#b8975a]/10' : 'text-[#333] hover:text-white hover:bg-white/[0.06]'
            }`}>
            {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
      }
    </div>
  )
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>(load)
  const [saved,    setSaved]    = useState(false)
  const { show, ToastContainer } = useToast()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    setSections(s => {
      const oldI = s.findIndex(x => x.id === active.id)
      const newI = s.findIndex(x => x.id === over.id)
      return arrayMove(s, oldI, newI)
    })
    setSaved(false)
  }

  const toggle = (id: string) => {
    setSections(s => s.map(x => x.id === id ? { ...x, visible: !x.visible } : x))
    setSaved(false)
  }

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections))
    setSaved(true)
    show('Homepage order saved ✓')
    setTimeout(() => setSaved(false), 3000)
  }

  const reset = () => {
    setSections(DEFAULT_SECTIONS)
    localStorage.removeItem(STORAGE_KEY)
    show('Reset to default order', 'info')
  }

  const visible  = sections.filter(s => s.visible).length
  const hidden   = sections.filter(s => !s.visible && !s.locked).length

  return (
    <div className="max-w-2xl">
      <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
        <div>
          <p className="text-[.6rem] tracking-[.22em] uppercase text-[#b8975a] mb-1">Customise</p>
          <h1 className="text-2xl font-normal text-white" style={{ fontFamily:'Playfair Display, serif' }}>Homepage Sections</h1>
          <p className="text-[.62rem] text-[#444] mt-0.5">{visible} visible · {hidden} hidden</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="text-[.62rem] text-[#444] hover:text-white transition-colors tracking-wider">
            Reset
          </button>
          <GoldBtn onClick={save}>
            Save Order
          </GoldBtn>
        </div>
      </div>

      {/* Instructions */}
      <div className="flex items-start gap-3 bg-[#111] border border-white/[0.06] p-4 rounded-sm mb-5">
        <Layers size={14} className="text-[#b8975a] mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-white mb-0.5">How to use</p>
          <p className="text-[.62rem] text-[#555] leading-relaxed">
            <strong className="text-[#888]">Drag</strong> sections to reorder them on the homepage.
            Click the <strong className="text-[#888]">eye icon</strong> to show or hide any section.
            Click <strong className="text-[#888]">Save Order</strong> when you&apos;re happy with the layout.
          </p>
        </div>
      </div>

      <AdminCard title="Sections" subtitle="Drag to reorder • Eye icon to show/hide">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sections.map(s => <SortableRow key={s.id} section={s} onToggle={() => toggle(s.id)} />)}
            </div>
          </SortableContext>
        </DndContext>
      </AdminCard>

      {/* Note about code */}
      <div className="mt-5 p-4 bg-[#111] border border-white/[0.04] rounded-sm">
        <p className="text-[.6rem] text-[#444] leading-relaxed">
          <strong className="text-[#555]">Note:</strong> Section order is saved in your browser. To make this drive live reordering on the site, connect it to the homepage via the <code className="text-[#b8975a] bg-[#b8975a]/10 px-1">ADMIN_SECTIONS_ORDER</code> API (already wired up — just deploy).
        </p>
      </div>

      <ToastContainer />
    </div>
  )
}
