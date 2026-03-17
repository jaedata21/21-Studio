'use client'
import { useEffect, ReactNode } from 'react'

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    let lenis: import('lenis').default | null = null

    async function init() {
      const Lenis = (await import('lenis')).default
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      })

      function raf(time: number) {
        lenis!.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    }

    init()
    return () => { lenis?.destroy() }
  }, [])

  return <>{children}</>
}
