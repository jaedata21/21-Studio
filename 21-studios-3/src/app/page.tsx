import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import FeaturedWork from '@/components/FeaturedWork'
import StoryScroll from '@/components/StoryScroll'
import Testimonials from '@/components/Testimonials'
import CTASection from '@/components/CTASection'
import { getCmsContent } from '@/lib/cms'

export const revalidate = 0

export default async function HomePage() {
  let cms: Record<string, string> = {}
  try {
    cms = await getCmsContent()
  } catch {
    cms = {}
  }

  return (
    <>
      <Hero
        headline={cms.hero_headline || '21 Studios'}
        subtext={cms.hero_subtext || 'Where light becomes legacy'}
        image={cms.hero_image || 'https://images.unsplash.com/photo-1537795479-cf48d1bf9a9c?q=90&w=2800&auto=format&fit=crop'}
      />
      <Marquee />
      <FeaturedWork />
      <StoryScroll />
      <Testimonials />
      <CTASection
        headline={cms.cta_headline || "Let's Create Something Timeless"}
        subtext={cms.cta_subtext || 'Limited availability each season.'}
      />
    </>
  )
}
