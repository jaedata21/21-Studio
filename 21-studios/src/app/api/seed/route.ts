export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const password = await bcrypt.hash('admin123', 12)
    await prisma.user.upsert({
      where: { email: 'admin@21studios.com' },
      update: {},
      create: { email: 'admin@21studios.com', password, name: 'Jordan Campbell', role: 'admin' },
    })

    const content = [
      { key: 'hero_headline',     value: '21 Studios',                    group: 'hero',    label: 'Hero Headline' },
      { key: 'hero_subtext',      value: 'Where light becomes legacy',    group: 'hero',    label: 'Hero Subtext' },
      { key: 'hero_image',        value: 'https://images.unsplash.com/photo-1537795479-cf48d1bf9a9c?q=90&w=2800&auto=format&fit=crop', group: 'hero', label: 'Hero Background' },
      { key: 'about_headline',    value: 'The Vision Behind the Lens',    group: 'about',   label: 'About Headline' },
      { key: 'about_body',        value: "Founded in 2021, 21 Studios began as a personal pursuit and grew into Jamaica's most sought-after photography studio.", group: 'about', label: 'About Body' },
      { key: 'about_quote',       value: 'I believe every frame holds the power to contain an entire world.', group: 'about', label: 'About Quote' },
      { key: 'photographer_name', value: 'Jordan Campbell',               group: 'about',   label: 'Photographer Name' },
      { key: 'photographer_title',value: 'Lead Photographer & Creative Director', group: 'about', label: 'Photographer Title' },
      { key: 'cta_headline',      value: "Let's Create Something Timeless", group: 'cta',   label: 'CTA Headline' },
      { key: 'cta_subtext',       value: 'Limited availability each season.', group: 'cta', label: 'CTA Subtext' },
      { key: 'contact_email',     value: 'hello@21studios.com',           group: 'contact', label: 'Contact Email' },
      { key: 'contact_phone',     value: '+1 (876) 123-4567',             group: 'contact', label: 'Contact Phone' },
      { key: 'contact_location',  value: 'Kingston, Jamaica & Worldwide', group: 'contact', label: 'Location' },
      { key: 'logo_text',         value: '21 Studios',                    group: 'brand',   label: 'Logo Text' },
      { key: 'logo_image',        value: '',                               group: 'brand',   label: 'Logo Image' },
      { key: 'instagram_url',     value: 'https://instagram.com',         group: 'social',  label: 'Instagram URL' },
    ]

    for (const item of content) {
      await prisma.content.upsert({
        where: { key: item.key }, update: {},
        create: { ...item, type: item.key.includes('image') ? 'image' : 'text' },
      })
    }

    const sessions = [
      { title: 'Essential', slug: 'essential', price: '$1,200', duration: '4 Hours', description: 'Perfect for portraits and intimate sessions.', includes: JSON.stringify(['1 photographer','200+ edited images','Online gallery','Print release']), category: 'Portrait', sortOrder: 0 },
      { title: 'Signature', slug: 'signature', price: '$2,800', duration: 'Full Day', description: 'Full-day coverage with a second shooter.', includes: JSON.stringify(['2 photographers','500+ edited images','Premium gallery','Prints included','Engagement session']), category: 'Wedding', sortOrder: 1 },
      { title: 'Legacy',    slug: 'legacy',    price: 'Custom', duration: 'Multi-Day', description: 'The ultimate experience for destination shoots.', includes: JSON.stringify(['Full creative team','Unlimited images','Video highlights','Album design','Worldwide travel']), category: 'Destination', sortOrder: 2 },
    ]
    for (const s of sessions) {
      await prisma.session.upsert({ where: { slug: s.slug }, update: {}, create: s })
    }

    return NextResponse.json({ ok: true, message: 'Database seeded. Login: admin@21studios.com / admin123' })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
