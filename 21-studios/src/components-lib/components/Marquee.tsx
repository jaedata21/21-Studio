'use client'
import { motion } from 'framer-motion'

const items = ['Weddings','✦','Portraits','✦','Editorial','✦','Events','✦','Fashion','✦','Commercial','✦','Fine Art','✦','Destination','✦']

export default function Marquee({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden py-4 border-y border-white/[0.05]">
      <motion.div className="flex gap-10 whitespace-nowrap w-max"
        animate={{ x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
        {doubled.map((item, i) => (
          <span key={i} className={`font-mono text-[.6rem] tracking-[.22em] uppercase shrink-0 ${item === '✦' ? 'text-gold' : 'text-smoke'}`}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
