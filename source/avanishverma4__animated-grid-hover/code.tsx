import React from 'react'
import { motion } from 'framer-motion'

const TilesComponent = ({ className, rows: r, cols: c }) => {
  const rows = new Array(r || 100).fill(1)
  const cols = new Array(c || 10).fill(1)
  
  return (
    <div className={`relative z-0 flex w-full h-full justify-center ${className || ''}`}>
      {rows.map((_, i) => (
        <motion.div
          key={`row${i}`}
          className="w-12 h-12 border-l border-white/5 relative"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: 'rgba(209, 213, 219, 0.3)',
                transition: { duration: 0 }
              }}
              animate={{
                transition: { duration: 2 }
              }}
              key={`col${j}`}
              className="w-12 h-12 border-r border-t border-white/5 relative"
            />
          ))}
        </motion.div>
      ))}
    </div>
  )
}

const Tiles = React.memo(TilesComponent)

const AnimatedGridBackgroundSection = ({ children }) => {
  return (
    <div className="w-screen h-screen relative overflow-hidden flex items-center justify-center bg-black">
      <div className="w-fit h-fit relative z-[2]">{children}</div>
      <div className="absolute top-0 left-0 w-full h-full">
        <Tiles rows={50} cols={50} />
      </div>
    </div>
  )
}

export default function Example() {
  return (
    <AnimatedGridBackgroundSection>
      <div className="text-xl font-bold text-white">
        This is a cool background effect
      </div>
    </AnimatedGridBackgroundSection>
  )
}
