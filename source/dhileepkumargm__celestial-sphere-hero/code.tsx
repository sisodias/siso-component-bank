"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

// A utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// 2D Canvas Particle Sphere Component
const ParticleSphereCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const mouse = { x: null, y: null, radius: 150 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor(radius, angle, y) {
                this.radius = radius;
                this.angle = angle;
                this.y = y;
                this.size = 2;
                this.color = `rgba(236, 72, 153, ${Math.random() * 0.5 + 0.2})`;
            }

            draw(rotation) {
                const x3d = this.radius * Math.cos(this.angle + rotation);
                const z3d = this.radius * Math.sin(this.angle + rotation);
                
                // Simple 3D projection
                const scale = 300 / (300 + z3d);
                const x2d = (x3d * scale) + canvas.width / 2;
                const y2d = (this.y * scale) + canvas.height / 2;

                // Mouse interaction
                let dx = mouse.x - x2d;
                let dy = mouse.y - y2d;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let force = 0;
                if(distance < mouse.radius) {
                    force = (mouse.radius - distance) / mouse.radius;
                }
                
                const finalSize = this.size + force * 4;
                const finalColor = distance < mouse.radius ? `rgba(255, 255, 255, ${0.5 + force * 0.5})` : this.color;

                ctx.beginPath();
                ctx.arc(x2d, y2d, finalSize, 0, Math.PI * 2);
                ctx.fillStyle = finalColor;
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            const numParticles = 3000;
            for (let i = 0; i < numParticles; i++) {
                const radius = Math.random() * 100 + 80;
                const angle = Math.random() * Math.PI * 2;
                const y = (Math.random() - 0.5) * 200;
                particles.push(new Particle(radius, angle, y));
            }
        };

        let rotation = 0;
        const animate = () => {
            rotation += 0.001;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => p.draw(rotation));
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        const handleMouseOut = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        init();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" />;
};

// The main hero component
const CelestialSphereHero = () => {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2 + 0.5, duration: 0.8, ease: "easeInOut" },
        }),
    };

    return (
        <div className="relative h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
            <ParticleSphereCanvas />
            
            <div className="relative z-20 text-center p-6">
                <motion.div
                    custom={0} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6 backdrop-blur-sm"
                >
                    <Star className="h-4 w-4 text-pink-400" />
                    <span className="text-sm font-medium text-gray-200">
                        Decentralized Data Constellation
                    </span>
                </motion.div>

                <motion.h1
                    custom={1} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
                >
                    Celestial Sphere
                </motion.h1>

                <motion.p
                    custom={2} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="max-w-2xl mx-auto text-lg text-gray-400 mb-10"
                >
                    A new paradigm for data storage. Weave your information into a secure, distributed network that's as vast and resilient as the cosmos.
                </motion.p>

                <motion.div
                    custom={3} variants={fadeUpVariants} initial="hidden" animate="visible"
                >
                    <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2 mx-auto">
                        Join the Network
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default CelestialSphereHero;
