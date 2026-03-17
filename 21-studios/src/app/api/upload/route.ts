export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { uploadImageLocally } from '@/lib/upload'
import prisma from '@/lib/prisma'
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]
    const galleryId = formData.get('galleryId') as string | null
    if (!files.length) return NextResponse.json({ error: 'No files' }, { status: 400 })
    const results = await Promise.all(files.map(async (file, i) => {
      const { url, thumbUrl, width, height } = await uploadImageLocally(file)
      return prisma.photo.create({ data: { url, thumbUrl, width, height, alt: file.name.replace(/\.[^.]+$/, ''), galleryId: galleryId || null, sortOrder: i } })
    }))
    return NextResponse.json({ photos: results })
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
