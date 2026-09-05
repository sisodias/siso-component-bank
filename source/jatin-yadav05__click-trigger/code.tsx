"use client"
import React, { useState } from 'react'

const ClickTrigger = () => {
    const [isClicked, setIsClicked] = useState(false)
    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        setClickPosition({ x, y })
        setIsClicked(true)
        setTimeout(() => setIsClicked(false), 600)
    }

    return (
        <div className="p-4 select-none">
            <div
                className='bg-white dark:bg-black shadow-lg border border-gray-200 dark:border-neutral-800 rounded-lg p-6 cursor-pointer hover:shadow-xl dark:hover:shadow-neutral-800/50 transition-shadow duration-300 text-neutral-800 dark:text-gray-200 relative overflow-hidden min-h-[200px] flex items-center justify-center'
                onClick={handleClick}
            >
                <h3 className="text-lg font-medium">Click anywhere on this card</h3>

                {/* Animated rectangles forming a plus */}
                {isClicked && (
                    <>
                        {/* Top */}
                        <div 
                            className='absolute w-1 h-3 bg-black dark:bg-white rounded-sm animate-[slideUp_0.6s_ease-out_forwards]'
                            style={{ 
                                left: `${clickPosition.x}px`, 
                                top: `${clickPosition.y}px`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                        {/* Right */}
                        <div 
                            className='absolute w-3 h-1 bg-black dark:bg-white rounded-sm animate-[slideRight_0.6s_ease-out_forwards]'
                            style={{ 
                                left: `${clickPosition.x}px`, 
                                top: `${clickPosition.y}px`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                        {/* Bottom */}
                        <div 
                            className='absolute w-1 h-3 bg-black dark:bg-white rounded-sm animate-[slideDown_0.6s_ease-out_forwards]'
                            style={{ 
                                left: `${clickPosition.x}px`, 
                                top: `${clickPosition.y}px`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                        {/* Left */}
                        <div 
                            className='absolute w-3 h-1 bg-black dark:bg-white rounded-sm animate-[slideLeft_0.6s_ease-out_forwards]'
                            style={{ 
                                left: `${clickPosition.x}px`, 
                                top: `${clickPosition.y}px`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                    </>
                )}
            </div>

            <style jsx global>{`
                @keyframes slideUp {
                    0% { opacity: 1; }
                    100% { transform: translate(-50%, -50%) translateY(-40px); opacity: 0; }
                }
                @keyframes slideRight {
                    0% { opacity: 1; }
                    100% { transform: translate(-50%, -50%) translateX(40px); opacity: 0; }
                }
                @keyframes slideDown {
                    0% { opacity: 1; }
                    100% { transform: translate(-50%, -50%) translateY(40px); opacity: 0; }
                }
                @keyframes slideLeft {
                    0% { opacity: 1; }
                    100% { transform: translate(-50%, -50%) translateX(-40px); opacity: 0; }
                }
            `}</style>
        </div>
    )
}

export default ClickTrigger