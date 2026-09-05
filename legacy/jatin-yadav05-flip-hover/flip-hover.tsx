"use client"
import React, { useState } from 'react'

interface FlipHoverProps {
    imageUrl: string;
}

const FlipHover = ({ imageUrl }: FlipHoverProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleHover = () => {
        if (!isFlipped) {
            setIsFlipped(true);
            setTimeout(() => setIsFlipped(false), 700);
        }
    };

    return (
        <div 
            className="w-44 h-60 [perspective:1000px]"
            onMouseEnter={handleHover}
        >
            <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${
                isFlipped 
                    ? '[transform:rotateY(180deg)_translateY(-40px)]' 
                    : '[transform:rotateY(0deg)_translateY(0px)]'
            }`}>
                
                {/* Front Side */}
                <div className="absolute w-full h-full rounded-xl overflow-hidden shadow-xl [backface-visibility:hidden]">
                    <img
                        src={imageUrl}
                        alt="Front"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Back Side */}
                <div className="absolute w-full h-full rounded-xl overflow-hidden shadow-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <img
                        src={imageUrl}
                        alt="Back"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    )
}

export default FlipHover;