"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Layers } from 'lucide-react';

// A utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Data Sphere Canvas Component
const DataSphereCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let rotation = 0;
        const radius = 150; // Moved radius to the parent scope

        const resizeCanvas = () => {
            canvas.width = 500;
            canvas.height = 500;
        };
        
        const chars = 'アァカサタナハマヤラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユルグズブプエケセテネヘメレオコソトノホモヨロヲゴゾドボポヴッン01';
        
        class Particle {
            constructor(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
                this.char = chars[Math.floor(Math.random() * chars.length)];
            }

            project(rotationX, rotationY) {
                // Rotating around Y axis
                const rotY_x = Math.cos(rotationY) * this.x + Math.sin(rotationY) * this.z;
                const rotY_z = -Math.sin(rotationY) * this.x + Math.cos(rotationY) * this.z;
                
                // Rotating around X axis
                const rotX_y = Math.cos(rotationX) * this.y - Math.sin(rotationX) * rotY_z;
                const rotX_z = Math.sin(rotationX) * this.y + Math.cos(rotationX) * rotY_z;

                const scaleProjected = 250 / (250 - rotX_z);
                
                return {
                    x: (rotY_x * scaleProjected) + canvas.width / 2,
                    y: (rotX_y * scaleProjected) + canvas.height / 2,
                    z: rotX_z,
                    scale: scaleProjected,
                };
            }
        }

        const init = () => {
            particles = [];
            const numParticles = 2000;
            for (let i = 0; i < numParticles; i++) {
                const phi = Math.acos(-1 + (2 * i) / numParticles);
                const theta = Math.sqrt(numParticles * Math.PI) * phi;
                
                const x = radius * Math.cos(theta) * Math.sin(phi);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);
                
                particles.push(new Particle(x, y, z));
            }
        };

        const animate = () => {
            rotation += 0.002;
            ctx.fillStyle = 'rgba(2, 6, 23, 0.2)'; // Use the bg color with some transparency for a trailing effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.sort((a, b) => {
                const aPos = a.project(rotation, rotation);
                const bPos = b.project(rotation, rotation);
                return aPos.z - bPos.z;
            });

            particles.forEach(p => {
                const { x, y, z, scale } = p.project(rotation, rotation);
                
                if (Math.random() > 0.98) {
                     p.char = chars[Math.floor(Math.random() * chars.length)];
                }

                const fontSize = 10 * scale;
                ctx.font = `${fontSize}px monospace`;
                
                const opacity = Math.max(0, (z + radius) / (radius * 2));
                ctx.fillStyle = `rgba(0, 192, 255, ${opacity * 0.8})`;

                ctx.fillText(p.char, x, y);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        init();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} />;
};


// The main hero component
const BlueprintWeaverHero = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useTransform(mouseY, [-window.innerHeight / 2, window.innerHeight / 2], [10, -10]);
    const rotateY = useTransform(mouseX, [-window.innerWidth / 2, window.innerWidth / 2], [-10, 10]);

    const handleMouseMove = (event) => {
        const { clientX, clientY, currentTarget } = event;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = clientX - left - width / 2;
        const y = clientY - top - height / 2;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2 + 0.5,
                duration: 0.8,
                ease: "easeInOut",
            },
        }),
    };

    return (
        <div 
            className="relative h-screen w-full bg-[#020617] flex flex-col items-center justify-center overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* The interactive blueprint background */}
            <motion.div 
                className="absolute z-10"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
            >
                <DataSphereCanvas />
            </motion.div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617] z-20"></div>

            {/* Overlay HTML Content */}
            <div className="relative z-30 text-center p-6">
                <motion.div
                    custom={0} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 backdrop-blur-sm"
                >
                    <Layers className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium text-gray-200">
                        Architectural Intelligence Engine
                    </span>
                </motion.div>

                <motion.h1
                    custom={1} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
                >
                    Blueprint Weaver
                </motion.h1>

                <motion.p
                    custom={2} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="max-w-2xl mx-auto text-lg text-gray-400 mb-10"
                >
                    Construct complex digital systems with an AI-powered framework that designs, builds, and optimizes your infrastructure in real-time.
                </motion.p>

                <motion.div
                    custom={3} variants={fadeUpVariants} initial="hidden" animate="visible"
                >
                    <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2 mx-auto">
                        Start Building
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default BlueprintWeaverHero
 