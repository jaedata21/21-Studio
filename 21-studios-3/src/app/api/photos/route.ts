export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
export async function GET(req: NextRequest) {
  const galleryId = req.nextUrl.searchParams.get('galleryId')
  const photos = await prisma.photo.findMany({ where: galleryId ? { galleryId } : {}, orderBy: { sortOrder: 'asc' }, include: { gallery: { select: { title: true } } } })
  return NextResponse.json(photos)
}
export async function PATCH(req: NextRequest) {
  const body = await req.json()
  if (Array.isArray(body)) {
    await Promise.all(body.map(({ id, sortOrder }: { id: string; sortOrder: number }) => prisma.photo.update({ where: { id }, data: { sortOrder } })))
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: 'Invalid' }, { status: 400 })
}
