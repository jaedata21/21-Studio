import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'
import sharp from 'sharp'
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const THUMB_DIR = path.join(process.cwd(), 'public', 'uploads', 'thumbs')
export async function uploadImageLocally(file: File) {
  await mkdir(UPLOAD_DIR, { recursive: true }); await mkdir(THUMB_DIR, { recursive: true })
  const bytes = await file.arrayBuffer(); const buffer = Buffer.from(bytes)
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = uuid() + '.' + ext; const thumbname = 'thumb_' + filename
  const meta = await sharp(buffer).metadata()
  await sharp(buffer).resize(2400, 2400, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 88 }).toFile(path.join(UPLOAD_DIR, filename))
  await sharp(buffer).resize(600, 600, { fit: 'cover' }).jpeg({ quality: 75 }).toFile(path.join(THUMB_DIR, thumbname))
  return { url: '/uploads/' + filename, thumbUrl: '/uploads/thumbs/' + thumbname, width: meta.width || 1200, height: meta.height || 800, filename }
}