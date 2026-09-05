import { useState } from 'react'
import { motion } from 'framer-motion'

export function FlipButton({ text1, text2 }:{text1: string, text2: string}) {
  const [show, setShow] = useState(false)
  const flipVariants = {
    one: {
      rotateX: 0,
      backgroundColor: '#3b82f6',
      color: '#ffffff',
    },
    two: {
      rotateX: 180,
      backgroundColor: '#f4f4f5',
      color: '#18181b',
    },
  }

  return (
      <div className="w-full max-w-[270px]">
        <motion.button
          className="w-full cursor-pointer px-6 py-3 font-medium"
          style={{
            borderRadius: 999,
          }}
          onClick={() => setShow(!show)}
          animate={show ? 'two' : 'one'}
          variants={flipVariants}
          transition={{ duration: 0.6, type: 'spring' }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ rotateX: show ? 180 : 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            {show ? text1 : text2}
          </motion.div>
          <motion.div
            animate={{ rotateX: show ? 0 : -180 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="absolute inset-0"
          ></motion.div>
        </motion.button>
      </div>
  );
};
