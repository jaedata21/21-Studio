export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
export async function GET(req: NextRequest) {
  const group = req.nextUrl.searchParams.get('group')
  const items = await prisma.content.findMany({ where: group ? { group } : {} })
  const map: Record<string,string> = {}
  items.forEach((i: {key:string;value:string}) => { map[i.key] = i.value })
  return NextResponse.json(map)
}
export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string,string>
  await Promise.all(Object.entries(body).map(([key,value]) => prisma.content.upsert({ where:{key}, update:{value}, create:{key,value,group:'general'} })))
  return NextResponse.json({ success: true })
}
