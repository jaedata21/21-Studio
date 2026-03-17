import type { Metadata } from 'next'
import './globals.css'
import Navigation   from '@/components/Navigation'
import Footer       from '@/components/Footer'
import Cursor       from '@/components/Cursor'
import Grain        from '@/components/Grain'
import SmoothScroll from '@/components/SmoothScroll'
import Providers    from '@/components/Providers'

export const metadata: Metadata = {
  title:       { default: '21 Studios', template: '%s | 21 Studios' },
  description: 'Where light becomes legacy. Premium photography — weddings, portraits, editorial.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Outfit:wght@200;300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <Grain />
          <Cursor />
          <SmoothScroll>
            <Navigation />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  )
}
