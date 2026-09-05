"use client"
import React, { useState } from 'react'

const ClickTriggerPathWave = () => {
    const [waves, setWaves] = useState<Array<{ id: number; x: number; y: number }>>([])

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const newWave = {
            id: Date.now(),
            x,
            y
        }

        setWaves(prev => [...prev, newWave])

        setTimeout(() => {
            setWaves(prev => prev.filter(w => w.id !== newWave.id))
        }, 2000)
        }

        return (
        <div className="p-4 select-none">
            <div
            className='bg-white dark:bg-black shadow-lg border-2 border-black dark:border-white rounded-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 text-black dark:text-white relative overflow-hidden min-h-[220px] flex items-center justify-center'
            onClick={handleClick}
            >
            <h3 className="text-xl font-semibold text-center">Click for wavy dots</h3>

            {/* Wavy dot effects */}
            {waves.map((wave) => (
                <div
                key={wave.id}
                className='absolute pointer-events-none'
                style={{
                    left: `${wave.x}px`,
                    top: `${wave.y}px`,
                    transform: 'translate(-50%, -50%)'
                }}
                >
                {Array.from({ length: 3 }, (_, i) => (
                    <div
                    key={i}
                    className='absolute w-3 h-3 bg-current rounded-full animate-[wavyPath_2s_ease-out_forwards]'
                    style={{
                        animationDelay: `${i * 0.2}s`
                    }}
                    />
                ))}
                </div>
            ))}
            </div>

            <style jsx global>{`
            @keyframes wavyPath {
                0% { 
                transform: translate(0, 0);
                opacity: 1;
                }
                25% { 
                transform: translate(30px, -20px);
                opacity: 0.8;
                }
                50% { 
                transform: translate(60px, 10px);
                opacity: 0.6;
                }
                75% { 
                transform: translate(90px, -15px);
                opacity: 0.4;
                }
                100% { 
                transform: translate(120px, 5px);
                opacity: 0;
                }
            }
            `}</style>
        </div>
        )
    }

    export default ClickTriggerPathWave
