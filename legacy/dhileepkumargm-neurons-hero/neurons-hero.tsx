"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit } from 'lucide-react';

// A utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Cosmic Synapse Canvas Component
const CosmicSynapseCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let neurons = [];
        let pulses = [];
        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, radius: 150 };
        const perspective = 400;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };
        
        class Neuron {
            constructor(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
                this.baseX = x;
                this.baseY = y;
                this.baseZ = z;
                this.radius = Math.random() * 2 + 1;
                this.activation = 0;
                this.neighbors = [];
            }

            project() {
                // Apply mouse-based rotation for parallax
                const rotX = (mouse.y - canvas.height / 2) * 0.0001;
                const rotY = (mouse.x - canvas.width / 2) * 0.0001;

                const cosY = Math.cos(rotY);
                const sinY = Math.sin(rotY);
                const cosX = Math.cos(rotX);
                const sinX = Math.sin(rotX);

                const x1 = this.x * cosY - this.z * sinY;
                const z1 = this.z * cosY + this.x * sinY;
                const y1 = this.y * cosX - z1 * sinX;
                const z2 = z1 * cosX + this.y * sinX;

                const scale = perspective / (perspective + z2);
                const projectedX = (x1 * scale) + canvas.width / 2;
                const projectedY = (y1 * scale) + canvas.height / 2;
                return { x: projectedX, y: projectedY, scale };
            }

            draw() {
                const { x, y, scale } = this.project();
                ctx.beginPath();
                ctx.arc(x, y, this.radius * scale, 0, Math.PI * 2);
                const color = `rgba(191, 219, 254, ${0.2 + this.activation * 0.8})`; // Brighter blue
                ctx.fillStyle = color;
                ctx.fill();
            }

            update() {
                // Gravitational pull towards mouse
                const { x: projectedX, y: projectedY } = this.project();
                const dx = mouse.x - projectedX;
                const dy = mouse.y - projectedY;
                const dist = Math.hypot(dx, dy);
                const force = Math.max(0, (mouse.radius - dist) / mouse.radius);
                
                this.x += (dx / dist) * force * 0.5;
                this.y += (dy / dist) * force * 0.5;

                // Return to base position
                this.x += (this.baseX - this.x) * 0.01;
                this.y += (this.baseY - this.y) * 0.01;

                if (this.activation > 0) {
                    this.activation -= 0.01;
                }
                this.draw();
            }
            
            fire() {
                if (this.activation > 0.5) return;
                this.activation = 1;
                this.neighbors.forEach(neighbor => {
                    pulses.push(new Pulse(this, neighbor));
                });
            }
        }

        class Pulse {
            constructor(startNeuron, endNeuron) {
                this.start = startNeuron;
                this.end = endNeuron;
                this.progress = 0;
                this.speed = 0.05;
            }

            update() {
                this.progress += this.speed;
                if (this.progress >= 1) {
                    this.end.activation = Math.min(1, this.end.activation + 0.5);
                    return true;
                }
                return false;
            }

            draw() {
                const startPos = this.start.project();
                const endPos = this.end.project();

                const x = startPos.x + (endPos.x - startPos.x) * this.progress;
                const y = startPos.y + (endPos.y - startPos.y) * this.progress;
                const scale = startPos.scale + (endPos.scale - startPos.scale) * this.progress;

                ctx.beginPath();
                ctx.arc(x, y, 2.5 * scale, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${1 - this.progress})`;
                ctx.shadowColor = 'white';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0; // Reset shadow blur
            }
        }

        const init = () => {
            neurons = [];
            const numNeurons = 1000;
            const radius = 250;
            for (let i = 0; i < numNeurons; i++) {
                const phi = Math.acos(-1 + (2 * i) / numNeurons);
                const theta = Math.sqrt(numNeurons * Math.PI) * phi;
                const x = radius * Math.cos(theta) * Math.sin(phi);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);
                neurons.push(new Neuron(x, y, z));
            }
            
            neurons.forEach(neuron => {
                neurons.forEach(other => {
                    if (neuron !== other) {
                        const dist = Math.hypot(neuron.x - other.x, neuron.y - other.y, neuron.z - other.z);
                        if (dist < 40) {
                            neuron.neighbors.push(other);
                        }
                    }
                });
            });
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            if (Math.random() > 0.99) {
                neurons[Math.floor(Math.random() * neurons.length)].fire();
            }

            neurons.forEach(neuron => neuron.update());
            
            pulses = pulses.filter(pulse => !pulse.update());
            pulses.forEach(pulse => pulse.draw());

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

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full bg-black" />;
};


// The main hero component
const NeuralSynapseHero = () => {
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
            className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        >
            <CosmicSynapseCanvas />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>

            {/* Overlay HTML Content */}
            <div className="relative z-20 text-center p-6">
                <motion.div
                    custom={0} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 backdrop-blur-sm"
                >
                    <BrainCircuit className="h-4 w-4 text-cyan-300" />
                    <span className="text-sm font-medium text-gray-200">
                        Artificial Intelligence Framework
                    </span>
                </motion.div>

                <motion.h1
                    custom={1} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
                >
                    Neural Synapse
                </motion.h1>

                <motion.p
                    custom={2} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="max-w-2xl mx-auto text-lg text-gray-400 mb-10"
                >
                    Build truly intelligent applications with a framework that learns, adapts, and grows. The future of software is alive.
                </motion.p>

                <motion.div
                    custom={3} variants={fadeUpVariants} initial="hidden" animate="visible"
                >
                    <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2 mx-auto">
                        Activate the Network
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};
export default NeuralSynapseHero;
 