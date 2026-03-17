'use client'
import { useRef, ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
interface RevealProps { children: ReactNode; className?: string; delay?: number; duration?: number; y?: number; once?: boolean }
export default function Reveal({ children, className = '', delay = 0, duration = 0.9, y = 48, once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, amount: 0.12 })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}
export function LineReveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <div ref={ref} className={'clip-parent ' + className}>
      <motion.div initial={{ y: '110%', rotate: 1.5 }} animate={inView ? { y: '0%', rotate: 0 } : {}} transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </motion.div>
    </div>
  )
}
export function LineWipe({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} className={'overflow-hidden ' + className}>
      <motion.div className="gold-line" initial={{ scaleX: 0, transformOrigin: 'left' }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }} />
    </div>
  )
}
export function Stagger({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={inView ? 'show' : 'hidden'}
      variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: delay } } }}>
      {children}
    </motion.div>
  )
}
export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={{ hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } } }}>
      {children}
    </motion.div>
  )
}