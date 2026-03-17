'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLBodyElement | null>(null)

  useEffect(() => {
    bodyRef.current = document.body as HTMLBodyElement
    const dot  = dotRef.current!
    const ring = ringRef.current!
    let mx = -100, my = -100, rx = -100, ry = -100, id: number

    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      dot.style.left = `${mx}px`; dot.style.top = `${my}px`
    }

    const tick = () => {
      rx += (mx - rx) * .1; ry += (my - ry) * .1
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`
      id = requestAnimationFrame(tick)
    }

    const over  = (e: Event) => {
      if ((e.target as Element).closest('a, button, [data-hover]'))
        document.documentElement.classList.add('cursor-hover')
    }
    const out   = () => document.documentElement.classList.remove('cursor-hover')

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout',  out)
    id = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout',  out)
      cancelAnimationFrame(id)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
