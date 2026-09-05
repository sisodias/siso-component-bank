import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'



const TextThree = () => {
    const text = "Namaste World!"
    const [displayText, setDisplayText] = useState("")

    useEffect(() => {
        let currentIndex = 0
        const intervalId = setInterval(() => {
            if (currentIndex <= text.length) {
                setDisplayText(text.slice(0, currentIndex))
                currentIndex++
            } else {
                clearInterval(intervalId)
            }
        }, 100) // Adjust speed here

        return () => clearInterval(intervalId)
    }, [])

    return (
        <div className="flex justify-center items-center h-64 p-4">
            <motion.div
                className="text-4xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {displayText}

            </motion.div>
        </div>
    )
}

export default TextThree