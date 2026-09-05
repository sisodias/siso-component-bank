"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Database, Users, Globe, ShieldCheck } from 'lucide-react';

// A utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Animated number component
const AnimatedNumber = ({ value }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const spring = useSpring(0, { mass: 0.8, stiffness: 100, damping: 20 });

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [isInView, value, spring]);

    useEffect(() => {
        const unsubscribe = spring.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat('en-US').format(latest.toFixed(2));
            }
        });
        return () => unsubscribe();
    }, [spring]);

    return <span ref={ref}>0</span>;
};

// Stat Card Component with 3D tilt effect
const StatCard = ({ stat, index }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };
    
    const cardVariants = {
        offscreen: { y: 50, opacity: 0 },
        onscreen: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4, duration: 0.8, delay: index * 0.15 } }
    };

    return (
        <motion.div
            key={stat.label}
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative p-8 rounded-xl bg-slate-900/50 backdrop-blur-md border border-slate-800"
        >
             <div 
                style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
                className="flex flex-col h-full"
            >
                <div className="mb-4">{stat.icon}</div>
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                    <AnimatedNumber value={stat.value} />
                    <span className="text-3xl text-slate-400">{stat.unit}</span>
                </h2>
                <h3 className="text-lg font-semibold text-slate-300 mt-2">{stat.label}</h3>
                <p className="text-sm text-slate-500 mt-4 flex-grow">{stat.description}</p>
            </div>
        </motion.div>
    );
};

// The main stats component
const ModernStats = () => {
    const stats = [
        { icon: <Database className="h-8 w-8 text-cyan-400" />, value: 1.6, unit: "B", label: "Transactions", description: "Processed with unmatched speed and reliability." },
        { icon: <Users className="h-8 w-8 text-purple-400" />, value: 2.5, unit: "M", label: "Active Users", description: "A rapidly growing community trusting our platform." },
        { icon: <Globe className="h-8 w-8 text-green-400" />, value: 120, unit: "+", label: "Countries", description: "Providing a seamless experience across borders." },
        { icon: <ShieldCheck className="h-8 w-8 text-pink-400" />, value: 99.99, unit: "%", label: "Uptime", description: "Committed to a stable and reliable platform." },
    ];

    return (
        <div className="relative w-full min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8 md:p-16 overflow-hidden">
            {/* Background Aurora */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="aurora-bg">
                    <div className="aurora-shape-1"></div>
                    <div className="aurora-shape-2"></div>
                </div>
            </div>
            <style>{`
                .aurora-bg { position: absolute; inset: 0; filter: blur(100px); }
                .aurora-shape-1 { width: 600px; height: 600px; background-color: rgba(59, 130, 246, 0.2); top: -10%; left: -10%; border-radius: 50%; animation: moveAurora1 20s infinite alternate ease-in-out; }
                .aurora-shape-2 { width: 500px; height: 500px; background-color: rgba(168, 85, 247, 0.2); bottom: -10%; right: -10%; border-radius: 50%; animation: moveAurora2 25s infinite alternate ease-in-out; }
                @keyframes moveAurora1 { from { transform: translate(0, 0); } to { transform: translate(100px, 80px); } }
                @keyframes moveAurora2 { from { transform: translate(0, 0); } to { transform: translate(-100px, -80px); } }
            `}</style>
            
            <div className="relative z-10 flex flex-col items-center text-center mb-16">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
                    className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 text-white"
                >
                    Scale Without Limits
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
                    className="text-lg text-slate-400 max-w-3xl"
                >
                    Our platform is built on cutting-edge technology, designed to handle massive scale while maintaining peak performance.
                </motion.p>
            </div>

            {/* Stats Grid */}
            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <StatCard key={stat.label} stat={stat} index={index} />
                ))}
            </div>
        </div>
    );
};

export default ModernStats;