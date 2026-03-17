'use client'
import { useState, useRef, useCallback } from 'react'
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Crop as CropIcon, RotateCcw, Check, X } from 'lucide-react'
import { GoldBtn, GhostBtn } from './ui'

interface Props {
  src: string
  onDone: (croppedBlob: Blob, previewUrl: string) => void
  onCancel: () => void
  aspect?: number
}

function centerAspect(w: number, h: number, aspect: number): Crop {
  return centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspect, w, h), w, h)
}

async function getCroppedBlob(img: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const scaleX  = img.naturalWidth  / img.width
  const scaleY  = img.naturalHeight / img.height
  canvas.width  = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height)
  return new Promise(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.92))
}

const ASPECTS = [
  { label: 'Free',  value: 0 },
  { label: '1:1',   value: 1 },
  { label: '4:3',   value: 4/3 },
  { label: '16:9',  value: 16/9 },
  { label: '3:4',   value: 3/4 },
]

export default function ImageCropper({ src, onDone, onCancel, aspect: defaultAspect = 0 }: Props) {
  const imgRef  = useRef<HTMLImageElement>(null)
  const [crop,       setCrop]       = useState<Crop>()
  const [completed,  setCompleted]  = useState<PixelCrop>()
  const [aspect,     setAspect]     = useState(defaultAspect)
  const [applying,   setApplying]   = useState(false)

  const onLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    if (aspect) setCrop(centerAspect(width, height, aspect))
  }, [aspect])

  const apply = async () => {
    if (!imgRef.current || !completed) return
    setApplying(true)
    const blob = await getCroppedBlob(imgRef.current, completed)
    const url  = URL.createObjectURL(blob)
    onDone(blob, url)
    setApplying(false)
  }

  const changeAspect = (a: number) => {
    setAspect(a)
    if (imgRef.current && a) setCrop(centerAspect(imgRef.current.width, imgRef.current.height, a))
    else setCrop(undefined)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Aspect ratio pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[.58rem] tracking-[.15em] uppercase text-[#555] mr-1">Crop ratio:</span>
        {ASPECTS.map(a => (
          <button key={a.label} onClick={() => changeAspect(a.value)}
            className={`px-3 py-1 text-[.6rem] tracking-wider border rounded-full transition-all ${
              aspect === a.value ? 'border-[#b8975a] text-[#b8975a] bg-[#b8975a]/10' : 'border-white/10 text-[#555] hover:border-white/25 hover:text-white'
            }`}>
            {a.label}
          </button>
        ))}
        <button onClick={() => setCrop(undefined)} title="Reset" className="text-[#444] hover:text-white transition-colors ml-1">
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Crop area */}
      <div className="bg-[#0a0a0a] rounded-sm overflow-hidden flex items-center justify-center" style={{ maxHeight: '60vh' }}>
        <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompleted(c)}
          aspect={aspect || undefined} keepSelection>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} src={src} alt="Crop" onLoad={onLoad}
            style={{ maxHeight: '58vh', maxWidth: '100%', display: 'block' }} />
        </ReactCrop>
      </div>

      <div className="flex items-center gap-2 text-[.62rem] text-[#444]">
        <CropIcon size={12} className="text-[#b8975a]" />
        Drag to select the area to keep. Drag corners to resize.
      </div>

      <div className="flex gap-3">
        <GoldBtn onClick={apply} disabled={applying || !completed} className="flex-1 justify-center">
          {applying ? 'Applying…' : <><Check size={13} /> Apply Crop</>}
        </GoldBtn>
        <GhostBtn onClick={onCancel} className="flex-1 justify-center">
          <X size={13} /> Cancel
        </GhostBtn>
      </div>
    </div>
  )
}
