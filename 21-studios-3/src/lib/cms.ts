type ContentMap = Record<string, string>

const DEFAULTS: ContentMap = {
  hero_headline: '21 Studios',
  hero_subtext: 'Where light becomes legacy',
  hero_image: 'https://images.unsplash.com/photo-1537795479-cf48d1bf9a9c?q=90&w=2800&auto=format&fit=crop',
  about_headline: 'The Vision Behind the Lens',
  about_body: "Founded in 2021, 21 Studios began as a personal pursuit.",
  about_quote: 'I believe every frame holds the power to contain an entire world.',
  photographer_name: 'Jordan Campbell',
  photographer_title: 'Lead Photographer & Creative Director',
  cta_headline: "Let's Create Something Timeless",
  cta_subtext: 'Limited availability each season.',
  contact_email: 'hello@21studios.com',
  contact_phone: '+1 (876) 123-4567',
  contact_location: 'Kingston, Jamaica & Worldwide',
  logo_text: '21 Studios',
  logo_image: '',
  instagram_url: 'https://instagram.com',
}

export async function getCmsContent(group?: string): Promise<ContentMap> {
  try {
    const { default: prisma } = await import('./prisma')
    const items = await prisma.content.findMany({ where: group ? { group } : {} })
    const map: ContentMap = { ...DEFAULTS }
    items.forEach((item: { key: string; value: string }) => { map[item.key] = item.value })
    return map
  } catch {
    return DEFAULTS
  }
}

export async function getSessions() {
  try {
    const { default: prisma } = await import('./prisma')
    return await prisma.session.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } })
  } catch {
    return []
  }
}
