import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import FeaturedWork from '@/components/FeaturedWork'
import StoryScroll from '@/components/StoryScroll'
import Testimonials from '@/components/Testimonials'
import CTASection from '@/components/CTASection'
import { getCmsContent } from '@/lib/cms'

export const revalidate = 0

export default async function HomePage() {
  const cms = await getCmsContent()
  return (
    <>
      <Hero
        headline={cms.hero_headline}
        subtext={cms.hero_subtext}
        image={cms.hero_image}
      />
      <Marquee />
      <FeaturedWork />
      <StoryScroll />
      <Testimonials />
      <CTASection
        headline={cms.cta_headline}
        subtext={cms.cta_subtext}
      />
    </>
  )
}
