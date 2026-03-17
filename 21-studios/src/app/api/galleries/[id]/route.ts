export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gallery = await prisma.gallery.findUnique({ where: { id }, include: { photos: { orderBy: { sortOrder: 'asc' } } } })
  if (!gallery) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(gallery)
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const gallery = await prisma.gallery.update({ where: { id }, data: body })
  return NextResponse.json(gallery)
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.gallery.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
