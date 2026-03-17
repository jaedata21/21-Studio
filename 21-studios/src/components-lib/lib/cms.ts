// src/lib/cms.ts
// Server-side helpers for fetching CMS content.
// Used by page.tsx server components to hydrate from the database.

type ContentMap = Record<string, string>

const DEFAULTS: ContentMap = {
  hero_headline:      '21 Studios',
  hero_subtext:       'Where light becomes legacy',
  hero_image:         'https://images.unsplash.com/photo-1537795479-cf48d1bf9a9c?q=90&w=2800&auto=format&fit=crop',
  about_headline:     'The Vision Behind the Lens',
  about_body:         "Founded in 2021, 21 Studios began as a personal pursuit and grew into Jamaica's most sought-after photography studio. We've shot across 12 countries, contributed to international publications, and built a reputation for imagery that lives at the intersection of documentary authenticity and fine-art beauty.",
  about_quote:        'I believe every frame holds the power to contain an entire world.',
  photographer_name:  'Jordan Campbell',
  photographer_title: 'Lead Photographer & Creative Director',
  cta_headline:       "Let's Create Something Timeless",
  cta_subtext:        'Limited availability each season. Inquire now to check dates and begin crafting your vision.',
  contact_email:      'hello@21studios.com',
  contact_phone:      '+1 (876) 123-4567',
  contact_location:   'Kingston, Jamaica & Worldwide',
  logo_text:          '21 Studios',
  logo_image:         '',
  instagram_url:      'https://instagram.com',
}

export async function getCmsContent(group?: string): Promise<ContentMap> {
  try {
    // Import prisma lazily to avoid build-time errors
    const { default: prisma } = await import('./prisma')
    const items = await prisma.content.findMany({
      where: group ? { group } : {},
    })
    const map: ContentMap = { ...DEFAULTS }
    items.forEach((item: { key: string; value: string }) => {
      map[item.key] = item.value
    })
    return map
  } catch {
    // DB not ready (build time, first run) — return defaults
    return DEFAULTS
  }
}

export async function getSessions() {
  try {
    const { default: prisma } = await import('./prisma')
    return await prisma.session.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    })
  } catch {
    return []
  }
}

export async function getGalleries(featuredOnly = false) {
  try {
    const { default: prisma } = await import('./prisma')
    return await prisma.gallery.findMany({
      where: { published: true, ...(featuredOnly ? { featured: true } : {}) },
      orderBy: { sortOrder: 'asc' },
      include: {
        photos: { orderBy: { sortOrder: 'asc' }, take: 6 },
        _count: { select: { photos: true } },
      },
    })
  } catch {
    return []
  }
}
