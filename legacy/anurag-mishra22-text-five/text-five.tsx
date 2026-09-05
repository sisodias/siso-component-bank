import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const TextFive = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Trigger animation after component mount
        setTimeout(() => setVisible(true), 1000)
    }, [])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.8
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1.2,
                ease: "easeOut"
            }
        }
    }

    return (
        <div className="h-[50vh] md:h-64 bg-black flex items-center p-4 md:p-8 justify-center">
            <motion.div
                variants={container}
                initial="hidden"
                animate={visible ? "show" : "hidden"}
                className="text-center"
            >
                <motion.h2
                    variants={item}
                    className="text-white text-2xl sm:text-3xl md:text-4xl mb-4 md:mb-8 font-bold"
                >
                    COMING SOON
                </motion.h2>
                <motion.h1
                    variants={item}
                    className="text-white text-4xl sm:text-5xl md:text-7xl mb-4 md:mb-8 font-extrabold"
                >
                    Mishra Hub
                </motion.h1>
                <motion.p
                    variants={item}
                    className="text-white text-xl sm:text-xl md:text-2xl italic"
                >
                    Summer 2025
                </motion.p>
            </motion.div>
        </div>
    )
}

export default TextFive