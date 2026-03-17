export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  if (body.includes && Array.isArray(body.includes)) body.includes = JSON.stringify(body.includes)
  const s = await prisma.session.update({ where: { id }, data: body })
  return NextResponse.json(s)
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.session.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
