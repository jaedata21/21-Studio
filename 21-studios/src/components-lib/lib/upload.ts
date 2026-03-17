import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'
import sharp from 'sharp'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const THUMB_DIR  = path.join(process.cwd(), 'public', 'uploads', 'thumbs')

export async function ensureDirs() {
  await mkdir(UPLOAD_DIR, { recursive: true })
  await mkdir(THUMB_DIR,  { recursive: true })
}

export interface UploadResult {
  url:      string
  thumbUrl: string
  width:    number
  height:   number
  filename: string
}

export async function uploadImageLocally(file: File): Promise<UploadResult> {
  await ensureDirs()

  const bytes    = await file.arrayBuffer()
  const buffer   = Buffer.from(bytes)
  const ext      = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${uuid()}.${ext}`
  const thumbname = `thumb_${filename}`

  const fullPath  = path.join(UPLOAD_DIR, filename)
  const thumbPath = path.join(THUMB_DIR,  thumbname)

  // Get image metadata
  const meta = await sharp(buffer).metadata()
  const width  = meta.width  || 1200
  const height = meta.height || 800

  // Save original (optimised)
  await sharp(buffer)
    .resize(2400, 2400, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 88, progressive: true })
    .toFile(fullPath)

  // Generate thumbnail
  await sharp(buffer)
    .resize(600, 600, { fit: 'cover' })
    .jpeg({ quality: 75 })
    .toFile(thumbPath)

  return {
    url:      `/uploads/${filename}`,
    thumbUrl: `/uploads/thumbs/${thumbname}`,
    width,
    height,
    filename,
  }
}

// ── S3 upload (swap in when ready) ─────────────────────
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
// const s3 = new S3Client({ region: process.env.AWS_REGION! })
// export async function uploadToS3(file: File): Promise<UploadResult> { ... }
