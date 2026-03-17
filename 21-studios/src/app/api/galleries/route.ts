export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
export async function GET() {
  const galleries = await prisma.gallery.findMany({ orderBy: { sortOrder: 'asc' }, include: { _count: { select: { photos: true } } } })
  return NextResponse.json(galleries)
}
export async function POST(req: NextRequest) {
  const body = await req.json()
  const slug = body.title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') + '-' + Date.now()
  const gallery = await prisma.gallery.create({ data: { title: body.title, slug, description: body.description || null, category: body.category || 'General', featured: body.featured || false, published: body.published !== false } })
  return NextResponse.json(gallery, { status: 201 })
}
