'use client'
import React, { useState } from 'react';

export default function LetterHoverEffect() {
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
    const text = "Hover Me";

    const getThemeColors = () => {
        return {
            text: 'var(--th-text, #222)',
            textDark: 'var(--th-text-dark, #fff)',
            shadow: '0 2px 6px rgba(0,0,0,0.15)',
            shadowLight: '0 2px 6px rgba(0,0,0,0.08)',
            shadowDark: '0 2px 6px rgba(0,0,0,0.25)',
        };
    };

    const getLetterStyle = (index: number) => {
        const isHovered = hoveredIndex === index;
        const distance = hoveredIndex >= 0 ? Math.abs(index - hoveredIndex) : 0;

        let scale = 1;
        let translateY = 0;
        let rotateX = 0;
        let brightness = 1;

        if (hoveredIndex >= 0) {
            if (isHovered) {
                scale = 1.4;
                translateY = -20;
                rotateX = -15;
                brightness = 1.3;
            } else if (distance === 1) {
                scale = 1.2;
                translateY = -10;
                rotateX = -8;
                brightness = 1.15;
            } else if (distance === 2) {
                scale = 1.1;
                translateY = -5;
                rotateX = -4;
                brightness = 1.08;
            }
        }

        // Use CSS variables for color and shadow, so theme can be controlled via Tailwind or global CSS
        return {
            transform: `
                perspective(1000px) 
                translateY(${translateY}px) 
                rotateX(${rotateX}deg) 
                scale(${scale})
                translateZ(${isHovered ? 30 : distance <= 2 ? 15 : 0}px)
            `,
            filter: `brightness(${brightness})`,
            textShadow: distance <= 2
                ? 'var(--th-shadow, 0 2px 6px rgba(0,0,0,0.15))'
                : 'var(--th-shadow-light, 0 1px 2px rgba(0,0,0,0.08))',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            zIndex: isHovered ? 10 : distance <= 2 ? 5 : 1,
            color: 'var(--th-text, #222)',
            marginRight: '0.1em',
        };
    };
    return (
        <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br dark:from-black/90 dark:to-black from-white/90 to-white transition-colors duration-500">
            <div className="text-6xl font-medium select-none text-black dark:text-white">
                <span className="inline-flex">
                    {text.split('').map((letter, index) => (
                        <span
                            key={index}
                            className="inline-block cursor-pointer relative"
                            style={getLetterStyle(index)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(-1)}
                        >
                            <span className="font-bold" style={{ color: 'var(--th-text, #222)' }}>
                                {letter === ' ' ? '\u00A0' : letter}
                            </span>
                        </span>
                    ))}
                </span>
            </div>
            {/* Inline style for demo; move to global CSS for production */}
           <style jsx global>{`
                :root {
                    --th-text: #000; /* Dark text for light theme */
                    --th-shadow: 0 2px 6px rgba(0,0,0,0.15);
                    --th-shadow-light: 0 1px 2px rgba(0,0,0,0.08);
                }
                html.dark {
                    --th-text: #fff; /* Light text for dark theme */
                    --th-shadow: 0 2px 6px rgba(0,0,0,0.25);
                    --th-shadow-light: 0 1px 2px rgba(0,0,0,0.15);
                }
            `}</style>
        </div>
    );
}