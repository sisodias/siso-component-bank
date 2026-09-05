import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    src?: string; // Kept for compatibility, though unused in this unique variant
}

export const Component: React.FC<PageHeroProps> = ({
    title,
    subtitle,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- Configuration ---
        const particleCount = 40; // Number of distinct tracers
        const particles: any[] = [];

        // Lorenz Attractor Constants
        const SIGMA = 10;
        const RHO = 28;
        const BETA = 8 / 3;
        const DT = 0.008; // Speed of simulation

        // Interaction State
        let rotationX = 0;
        let rotationY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;

        // Initialize Particles
        // We start them slightly offset to create a "ribbon" effect
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: 0.1 + (i * 0.01),
                y: 0,
                z: 0,
                color: i % 2 === 0 ? '#fbbf24' : '#2d6a7f', // Amber or Turtle Light
                history: []
            });
        }

        const resize = () => {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            // Map mouse to rotation angles (-1 to 1)
            targetRotationY = (e.clientX / innerWidth - 0.5) * 2;
            targetRotationX = (e.clientY / innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // --- Animation Loop ---
        const animate = () => {
            // Fade out effect for trails
            // We draw a semi-transparent rectangle over the previous frame
            ctx.fillStyle = 'rgba(15, 41, 51, 0.15)'; // #0f2933 with opacity
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Smooth rotation interpolation
            rotationX += (targetRotationX - rotationX) * 0.05;
            rotationY += (targetRotationY - rotationY) * 0.05;

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const scale = Math.min(canvas.width, canvas.height) / 50; // Scale based on screen size

            particles.forEach((p) => {
                // 1. Calculate Lorenz Attractor Math (Differential Equations)
                const dx = (SIGMA * (p.y - p.x)) * DT;
                const dy = (p.x * (RHO - p.z) - p.y) * DT;
                const dz = (p.x * p.y - BETA * p.z) * DT;

                p.x += dx;
                p.y += dy;
                p.z += dz;

                // 2. 3D Rotation Math
                // Rotate around Y axis
                let x1 = p.x * Math.cos(rotationY) - p.z * Math.sin(rotationY);
                let z1 = p.z * Math.cos(rotationY) + p.x * Math.sin(rotationY);
                let y1 = p.y;

                // Rotate around X axis
                let y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
                let z2 = z1 * Math.cos(rotationX) + y1 * Math.sin(rotationX);
                let x2 = x1;

                // 3. Projection (3D to 2D)
                const x2d = cx + x2 * scale;
                const y2d = cy + y2 * scale; // Flip Y for canvas

                // 4. Draw
                ctx.beginPath();
                // If we have a history, draw line from last point
                if (p.history.length > 0) {
                    ctx.moveTo(p.history[p.history.length - 1].x, p.history[p.history.length - 1].y);
                    ctx.lineTo(x2d, y2d);
                } else {
                    // First frame
                    ctx.fillRect(x2d, y2d, 2, 2);
                }

                // Style
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 1.5;
                ctx.lineCap = 'round';
                ctx.stroke();

                // Glow effect
                if (Math.random() > 0.98) {
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(x2d - 1, y2d - 1, 3, 3);
                }

                // Update History
                p.history.push({ x: x2d, y: y2d });
                if (p.history.length > 2) p.history.shift(); // Keep trail short, the rect fade handles the rest
            });

            requestAnimationFrame(animate);
        };

        animate();
        setIsLoaded(true);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <section ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#275669]">
            {/* 1. Generative Canvas Layer */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Vignette Overlay to focus center */}
            <div className="absolute inset-0 z-10 bg-radial-gradient via-[#275669] to-[#275669] pointer-events-none" />

            {/* 2. Content Layer */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center">



                {/* Main Title */}
                <h1 className="max-w-5xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium text-white tracking-tight leading-[1.1] mb-8 opacity-0 animate-fade-in-up mix-blend-overlay" style={{ animationDelay: '0.4s' }}>
                    {title}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                    <p className="max-w-2xl text-lg md:text-xl text-slate-300 font-light leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        {subtitle}
                    </p>
                )}
            </div>



            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 opacity-0 animate-fade-in" style={{ animationDelay: '1.5s' }}>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Hover Me</span>
            </div>

            <style>{`
                .bg-radial-gradient {
                    background: radial-gradient(circle at center, transparent 0%, rgba(15, 41, 51, 0.4) 60%, rgba(15, 41, 51, 1) 100%);
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-down {
                    animation: slideDown 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 1.5s ease-out forwards;
                }
            `}</style>
        </section>
    );
};