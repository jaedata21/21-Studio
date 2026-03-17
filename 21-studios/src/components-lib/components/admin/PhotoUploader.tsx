'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Upload, X, CheckCircle, AlertCircle, Loader2, ImagePlus } from 'lucide-react'

export interface UploadItem {
  file: File; preview: string
  status: 'pending'|'uploading'|'done'|'error'
  errMsg?: string
}

interface PhotoUploaderProps {
  galleryId?: string
  onUploaded?: () => void
  compact?: boolean
}

export default function PhotoUploader({ galleryId, onUploaded, compact = false }: PhotoUploaderProps) {
  const [items, setItems] = useState<UploadItem[]>([])
  const [busy,  setBusy]  = useState(false)

  const onDrop = useCallback((accepted: File[]) => {
    setItems(prev => [
      ...prev,
      ...accepted.map(f => ({ file: f, preview: URL.createObjectURL(f), status: 'pending' as const })),
    ])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg','.jpeg','.png','.webp','.heic'] },
    multiple: true,
  })

  const remove = (i: number) => {
    URL.revokeObjectURL(items[i].preview)
    setItems(p => p.filter((_, idx) => idx !== i))
  }

  const upload = async () => {
    const pending = items.filter(it => it.status === 'pending')
    if (!pending.length) return
    setBusy(true)
    for (let i = 0; i < items.length; i++) {
      if (items[i].status !== 'pending') continue
      setItems(p => p.map((it, idx) => idx === i ? { ...it, status: 'uploading' } : it))
      try {
        const fd = new FormData()
        fd.append('files', items[i].file)
        if (galleryId) fd.append('galleryId', galleryId)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!res.ok) throw new Error('Upload failed')
        setItems(p => p.map((it, idx) => idx === i ? { ...it, status: 'done' } : it))
      } catch (e) {
        setItems(p => p.map((it, idx) => idx === i ? { ...it, status: 'error', errMsg: String(e) } : it))
      }
    }
    setBusy(false)
    onUploaded?.()
  }

  const pending = items.filter(i => i.status === 'pending').length
  const done    = items.filter(i => i.status === 'done').length
  const errors  = items.filter(i => i.status === 'error').length

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div {...getRootProps()}
        className={`relative border-2 border-dashed rounded-sm cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-[#b8975a] bg-[#b8975a]/5 scale-[1.01]'
            : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
        } ${compact ? 'p-6' : 'p-12'}`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center gap-3">
          {isDragActive
            ? <div className="w-12 h-12 bg-[#b8975a]/20 rounded-full flex items-center justify-center animate-bounce">
                <ImagePlus size={22} className="text-[#b8975a]" />
              </div>
            : <div className="w-12 h-12 bg-white/[0.04] rounded-full flex items-center justify-center">
                <Upload size={20} className="text-[#555]" />
              </div>
          }
          <div>
            <p className="text-sm text-[#888]">
              {isDragActive ? 'Drop photos here' : 'Drag & drop photos, or click to browse'}
            </p>
            <p className="text-[.6rem] text-[#444] mt-1">JPG, PNG, WebP, HEIC — up to 50MB each</p>
          </div>
          {!isDragActive && (
            <span className="text-[.62rem] tracking-[.15em] uppercase text-[#b8975a] border border-[#b8975a]/30 px-3 py-1.5 hover:bg-[#b8975a]/10 transition-colors">
              Choose Files
            </span>
          )}
        </div>
      </div>

      {/* Preview grid */}
      {items.length > 0 && (
        <div>
          {/* Status bar */}
          <div className="flex items-center justify-between mb-3 text-xs text-[#555]">
            <div className="flex items-center gap-3">
              <span>{items.length} photo{items.length !== 1 ? 's' : ''}</span>
              {done > 0   && <span className="text-emerald-500">✓ {done} uploaded</span>}
              {errors > 0 && <span className="text-red-400">✗ {errors} failed</span>}
            </div>
            <button onClick={() => setItems([])} className="text-[#444] hover:text-white transition-colors">
              Clear all
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
            {items.map((it, i) => (
              <div key={i} className="relative aspect-square bg-[#111] rounded-sm overflow-hidden group">
                <Image src={it.preview} alt="" fill className="object-cover" sizes="130px" />

                {/* Overlay by status */}
                {it.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 size={16} className="text-[#b8975a] animate-spin" />
                  </div>
                )}
                {it.status === 'done' && (
                  <div className="absolute inset-0 bg-emerald-900/50 flex items-center justify-center">
                    <CheckCircle size={16} className="text-emerald-400" />
                  </div>
                )}
                {it.status === 'error' && (
                  <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                    <AlertCircle size={16} className="text-red-400" />
                  </div>
                )}

                {/* Remove (pending only) */}
                {it.status === 'pending' && (
                  <button onClick={() => remove(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80">
                    <X size={9} className="text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Upload button */}
          {pending > 0 && (
            <button onClick={upload} disabled={busy}
              className="mt-4 w-full py-3 bg-[#b8975a] text-[#080808] text-[.68rem] tracking-[.2em] uppercase font-medium hover:bg-[#d4b37a] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {busy
                ? <><Loader2 size={13} className="animate-spin" /> Uploading {pending} photo{pending !== 1 ? 's' : ''}…</>
                : <><Upload size={13} /> Upload {pending} photo{pending !== 1 ? 's' : ''}</>
              }
            </button>
          )}
        </div>
      )}
    </div>
  )
}
