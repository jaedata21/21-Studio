export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
export async function GET() {
  const sessions = await prisma.session.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(sessions)
}
export async function POST(req: NextRequest) {
  const body = await req.json()
  const slug = body.title.toLowerCase().replace(/\s+/g,'-') + '-' + Date.now()
  const s = await prisma.session.create({ data: { title: body.title, slug, description: body.description || null, price: body.price || 'TBD', duration: body.duration || null, includes: JSON.stringify(body.includes || []), category: body.category || 'Portrait', active: body.active !== false } })
  return NextResponse.json(s, { status: 201 })
}
