import React, { useRef, useEffect } from 'react';

export const FrostedGlassCard = () => {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = (x - centerX) / centerX * 10;
            const rotateX = (y - centerY) / centerY * -10;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        };

        const handleMouseLeave = () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className="card-container">
            <div ref={cardRef} className="card w-full max-w-md rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Glassmorphism UI</h2>
                        <p className="text-indigo-300">A New Design Trend</p>
                    </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                    This card uses the "glassmorphism" effect to create a sense of depth and transparency. The 3D tilt and dynamic glare are powered by JavaScript to create a futuristic and engaging user experience.
                </p>
            </div>
        </div>
    );
};
