import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const password = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@21studios.com' },
    update: {},
    create: { email: 'admin@21studios.com', password, name: 'Jordan Campbell', role: 'admin' },
  })

  // Default site content
  const content = [
    { key: 'hero_headline',    value: '21 Studios',                                      type: 'text',  group: 'hero',    label: 'Hero Headline' },
    { key: 'hero_subtext',     value: 'Where light becomes legacy',                      type: 'text',  group: 'hero',    label: 'Hero Subtext' },
    { key: 'hero_image',       value: 'https://images.unsplash.com/photo-1537795479-cf48d1bf9a9c?q=90&w=2800&auto=format&fit=crop', type: 'image', group: 'hero', label: 'Hero Background' },
    { key: 'about_headline',   value: 'The Vision Behind the Lens',                      type: 'text',  group: 'about',   label: 'About Headline' },
    { key: 'about_body',       value: 'Founded in 2021, 21 Studios began as a personal pursuit and grew into Jamaica\'s most sought-after photography studio.', type: 'text', group: 'about', label: 'About Body' },
    { key: 'about_quote',      value: 'I believe every frame holds the power to contain an entire world.',  type: 'text',  group: 'about',   label: 'About Quote' },
    { key: 'photographer_name',value: 'Jordan Campbell',                                 type: 'text',  group: 'about',   label: 'Photographer Name' },
    { key: 'photographer_title',value: 'Lead Photographer & Creative Director',          type: 'text',  group: 'about',   label: 'Photographer Title' },
    { key: 'booking_headline', value: 'Book Your Session',                               type: 'text',  group: 'booking', label: 'Booking Headline' },
    { key: 'booking_subtext',  value: 'We respond within 24 hours with availability and a personalised quote.', type: 'text', group: 'booking', label: 'Booking Subtext' },
    { key: 'cta_headline',     value: 'Let\'s Create Something Timeless',               type: 'text',  group: 'cta',     label: 'CTA Headline' },
    { key: 'cta_subtext',      value: 'Limited availability each season. Inquire now.',  type: 'text',  group: 'cta',     label: 'CTA Subtext' },
    { key: 'contact_email',    value: 'hello@21studios.com',                             type: 'text',  group: 'contact', label: 'Contact Email' },
    { key: 'contact_phone',    value: '+1 (876) 123-4567',                               type: 'text',  group: 'contact', label: 'Contact Phone' },
    { key: 'contact_location', value: 'Kingston, Jamaica & Worldwide',                   type: 'text',  group: 'contact', label: 'Location' },
    { key: 'logo_text',        value: '21 Studios',                                      type: 'text',  group: 'brand',   label: 'Logo Text' },
    { key: 'logo_image',       value: '',                                                 type: 'image', group: 'brand',   label: 'Logo Image (optional)' },
    { key: 'instagram_url',    value: 'https://instagram.com',                           type: 'text',  group: 'social',  label: 'Instagram URL' },
  ]

  for (const item of content) {
    await prisma.content.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    })
  }

  // Default sessions
  const sessions = [
    {
      title: 'Essential', slug: 'essential', price: '$1,200', duration: '4 Hours',
      description: 'Perfect for portraits and short events. Clean, intimate, and beautifully lit.',
      includes: JSON.stringify(['1 photographer', '200+ edited images', 'Online gallery', 'Print release']),
      category: 'Portrait', sortOrder: 0,
    },
    {
      title: 'Signature', slug: 'signature', price: '$2,800', duration: 'Full Day',
      description: 'Our most popular package. Full-day coverage with a second shooter for complete peace of mind.',
      includes: JSON.stringify(['2 photographers', '500+ edited images', 'Premium gallery', 'Prints included', 'Engagement session']),
      category: 'Wedding', sortOrder: 1,
    },
    {
      title: 'Legacy', slug: 'legacy', price: 'Custom', duration: 'Multi-Day',
      description: 'The ultimate experience for destination weddings and large-scale productions.',
      includes: JSON.stringify(['Full creative team', 'Unlimited images', 'Video highlights', 'Album design', 'Worldwide travel']),
      category: 'Destination', sortOrder: 2,
    },
  ]

  for (const s of sessions) {
    await prisma.session.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    })
  }

  // Default galleries
  const galleries = [
    { title: 'Weddings', slug: 'weddings', description: 'Cinematic wedding photography', category: 'Wedding', featured: true, sortOrder: 0 },
    { title: 'Portraits', slug: 'portraits', description: 'Intimate portrait sessions', category: 'Portrait', sortOrder: 1 },
    { title: 'Editorial', slug: 'editorial', description: 'Magazine-quality editorial work', category: 'Editorial', sortOrder: 2 },
  ]

  for (const g of galleries) {
    await prisma.gallery.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    })
  }

  console.log('✅ Seed complete!')
  console.log('   Admin email:    admin@21studios.com')
  console.log('   Admin password: admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
