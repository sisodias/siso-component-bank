"use client"
import { motion, transform, useAnimate } from "motion/react"
import { useEffect, useState } from "react"

function CharactersRemaining() {
    const [value, setValue] = useState("")
    const maxLength = 12
    const charactersRemaining = maxLength - value.length
    const [counterRef, animate] = useAnimate()
    const mapRemainingToColor = transform([2, 6], ["#ff008c", "#ccc"])
    
    useEffect(() => {
        if (charactersRemaining > 6) return
        const mapRemainingToSpringVelocity = transform([0, 5], [50, 0])
        animate(
            counterRef.current,
            { scale: 1 },
            {
                type: "spring",
                velocity: mapRemainingToSpringVelocity(charactersRemaining),
                stiffness: 700,
                damping: 80,
            }
        )
    }, [animate, charactersRemaining])
    
    return (
        <div className="relative text-4xl leading-none">
            <input 
                value={value} 
                onChange={(e) => setValue(e.target.value)}
                className="relative bg-gray-900 text-gray-100 border-2 border-gray-800 rounded-lg p-5 pr-20 w-80 text-4xl leading-none focus:border-blue-500 focus:outline-none"
                maxLength={maxLength}
            />
            <div className="absolute top-1/2 right-0.5 -translate-y-1/2 text-gray-400 bg-gradient-to-r from-transparent via-gray-900/80 to-gray-900 py-2.5 pr-5 pl-12">
                <motion.span
                    ref={counterRef}
                    style={{
                        color: mapRemainingToColor(charactersRemaining),
                        willChange: "transform",
                    }}
                    className="block"
                >
                    {charactersRemaining}
                </motion.span>
            </div>
        </div>
    )
}

export default CharactersRemaining