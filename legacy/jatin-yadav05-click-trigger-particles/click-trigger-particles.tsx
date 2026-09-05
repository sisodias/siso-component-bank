"use client"
import React, { useState } from 'react'

const ClickTriggerParticles = () => {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        // Create multiple particles
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
            id: Date.now() + i,
            x,
            y
        }))
        
        setParticles(prev => [...prev, ...newParticles])
        
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)))
        }, 800)
    }

    return (
        <div className="p-4 select-none">
            <div
                className='bg-white dark:bg-black shadow-lg border-2 border-black dark:border-white rounded-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 text-black dark:text-white relative overflow-hidden min-h-[220px] flex items-center justify-center'
                onClick={handleClick}
            >
                <h3 className="text-xl font-semibold text-center">Click for particle burst effect</h3>

                {/* Particle effects */}
                {particles.map((particle, index) => (
                    <div 
                        key={particle.id}
                        className='absolute w-3 h-3 bg-black dark:bg-white rounded-full animate-[particleBurst_0.8s_ease-out_forwards]'
                        style={{ 
                            left: `${particle.x}px`, 
                            top: `${particle.y}px`,
                            transform: 'translate(-50%, -50%)',
                            animationDelay: `${index * 0.05}s`,
                            '--particle-angle': `${(index * 45)}deg`
                        } as React.CSSProperties & { '--particle-angle': string }}
                    />
                ))}
            </div>

            <style jsx global>{`
                @keyframes particleBurst {
                    0% { 
                        opacity: 1;
                        transform: translate(-50%, -50%) rotate(var(--particle-angle)) translateX(0) scale(1);
                    }
                    70% { 
                        opacity: 0.6;
                        transform: translate(-50%, -50%) rotate(var(--particle-angle)) translateX(60px) scale(0.8);
                    }
                    100% { 
                        opacity: 0;
                        transform: translate(-50%, -50%) rotate(var(--particle-angle)) translateX(80px) scale(0.3);
                    }
                }
            `}</style>
        </div>
    )
}

export default ClickTriggerParticles
