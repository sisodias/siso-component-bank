"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GitBranch } from 'lucide-react';

// A utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Fractal Bloom Canvas Component
const FractalBloomCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        const mouse = { x: window.innerWidth / 2, y: window.innerHeight };
        let currentDepth = 0;
        const maxDepth = 9;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawBranch = (x, y, angle, length, depth) => {
            if (depth > currentDepth) return;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            
            const endX = x + Math.cos(angle) * length;
            const endY = y + Math.sin(angle) * length;
            
            ctx.lineTo(endX, endY);
            
            const opacity = 1 - (depth / maxDepth);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
            ctx.lineWidth = 1 - (depth / maxDepth) * 0.5;
            ctx.stroke();

            // Mouse influence on branching angle
            const distToMouse = Math.hypot(endX - mouse.x, endY - mouse.y);
            const mouseEffect = Math.max(0, 1 - distToMouse / (canvas.height / 2));
            const angleOffset = (Math.PI / 8) * mouseEffect;

            drawBranch(endX, endY, angle - (Math.PI / 10) - angleOffset, length * 0.8, depth + 1);
            drawBranch(endX, endY, angle + (Math.PI / 10) + angleOffset, length * 0.8, depth + 1);
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(2, 6, 23, 0.2)'; // Fading effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const startX = canvas.width / 2;
            const startY = canvas.height;
            const startLength = canvas.height / 5;
            
            drawBranch(startX, startY, -Math.PI / 2, startLength, 0);

            if (currentDepth < maxDepth) {
                currentDepth += 0.03;
            }
            
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        
        resizeCanvas();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full bg-[#020617]" />;
};


// The main hero component
const FractalBloomHero = () => {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2 + 1.5, // Delay for fractal to grow
                duration: 0.8,
                ease: "easeInOut",
            },
        }),
    };

    return (
        <div 
            className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        >
            <FractalBloomCanvas />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10"></div>

            {/* Overlay HTML Content */}
            <div className="relative z-20 text-center p-6">
                <motion.div
                    custom={0} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/20 mb-6 backdrop-blur-sm"
                >
                    <GitBranch className="h-4 w-4 text-slate-300" />
                    <span className="text-sm font-medium text-gray-200">
                        Generative Development Platform
                    </span>
                </motion.div>

                <motion.h1
                    custom={1} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
                >
                    Fractal Bloom
                </motion.h1>

                <motion.p
                    custom={2} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="max-w-2xl mx-auto text-lg text-gray-400 mb-10"
                >
                    An evolutionary framework that grows and adapts your code, creating complex, resilient, and beautiful software systems organically.
                </motion.p>

                <motion.div
                    custom={3} variants={fadeUpVariants} initial="hidden" animate="visible"
                >
                    <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2 mx-auto">
                        Start Growing
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default FractalBloomHero;