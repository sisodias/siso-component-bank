"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap } from 'lucide-react';

// A utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// The main pricing component
const AuroraPricing = () => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

    const plans = [
        {
            name: 'Starter',
            price: { monthly: 19, yearly: 190 },
            description: 'Perfect for individuals and small projects.',
            features: ['5 Projects', 'Basic Analytics', '24/7 Support', '10GB Storage'],
            isFeatured: false,
        },
        {
            name: 'Pro',
            price: { monthly: 49, yearly: 490 },
            description: 'For growing teams and businesses.',
            features: ['Unlimited Projects', 'Advanced Analytics', 'Priority Support', '100GB Storage', 'Team Collaboration'],
            isFeatured: true,
        },
        {
            name: 'Enterprise',
            price: { monthly: 99, yearly: 990 },
            description: 'For large organizations with custom needs.',
            features: ['Everything in Pro', 'Dedicated Account Manager', 'Custom Integrations', 'SLA & Security Audits'],
            isFeatured: false,
        },
    ];

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15 + 0.3,
                duration: 0.6,
                ease: "easeInOut",
            },
        }),
    };

    return (
        <div className="relative w-full min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* The interactive gradient background */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="aurora-bg">
                    <div className="aurora-shape-1"></div>
                    <div className="aurora-shape-2"></div>
                </div>
            </div>
            <style>{`
                .aurora-bg { position: absolute; inset: 0; filter: blur(100px); }
                .aurora-shape-1, .aurora-shape-2 { position: absolute; border-radius: 50%; }
                .aurora-shape-1 { width: 600px; height: 600px; background-color: rgba(0, 128, 255, 0.5); top: 10%; left: 10%; animation: moveAurora1 20s infinite alternate ease-in-out; }
                .aurora-shape-2 { width: 500px; height: 500px; background-color: rgba(128, 0, 255, 0.5); bottom: 10%; right: 10%; animation: moveAurora2 25s infinite alternate ease-in-out; }
                @keyframes moveAurora1 { from { transform: translate(0, 0) rotate(0deg); } to { transform: translate(100px, 50px) rotate(180deg); } }
                @keyframes moveAurora2 { from { transform: translate(0, 0) rotate(0deg); } to { transform: translate(-100px, -50px) rotate(-180deg); } }
            `}</style>

            <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
                >
                    <Zap className="h-4 w-4 text-indigo-300" />
                    <span className="text-sm font-medium text-gray-200">
                        Flexible & Transparent Pricing
                    </span>
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
                    className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-white"
                >
                    Find the Perfect Plan
                </motion.h1>

                {/* Billing Cycle Toggle */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
                    className="flex items-center justify-center space-x-4 mb-12"
                >
                    <span className={cn("text-lg", billingCycle === 'monthly' ? 'text-white' : 'text-gray-500')}>Monthly</span>
                    <div 
                        className="w-14 h-8 flex items-center bg-gray-700 rounded-full p-1 cursor-pointer"
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    >
                        <motion.div 
                            className="w-6 h-6 bg-indigo-500 rounded-full"
                            layout
                            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                            style={{ marginLeft: billingCycle === 'yearly' ? 'auto' : '0' }}
                        />
                    </div>
                    <span className={cn("text-lg", billingCycle === 'yearly' ? 'text-white' : 'text-gray-500')}>Yearly</span>
                    <span className="text-sm text-indigo-400 font-semibold">(Save 20%)</span>
                </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        custom={index}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -10, scale: 1.02 }}
                        className={cn(
                            "relative p-8 rounded-2xl border border-gray-700/50 overflow-hidden",
                            plan.isFeatured ? 'bg-gray-900/80' : 'bg-gray-950/50 backdrop-blur-sm'
                        )}
                    >
                        <div className={cn(
                            "absolute inset-0 opacity-0 transition-opacity duration-500",
                            plan.isFeatured ? 'card-aurora-featured' : 'card-aurora'
                        )}></div>
                         {plan.isFeatured && (
                            <div className="absolute top-0 right-0 text-xs font-bold text-black bg-indigo-400 px-4 py-1.5 rounded-bl-lg">
                                MOST POPULAR
                            </div>
                        )}
                        <div className="relative z-10 flex flex-col h-full">
                            <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                            <p className="text-gray-400 mt-2">{plan.description}</p>
                            
                            <div className="flex items-baseline mt-8">
                                <span className="text-5xl font-bold text-white tracking-tight">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={billingCycle}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            ${plan.price[billingCycle]}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                <span className="text-gray-400 ml-2">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                            </div>

                            <ul className="mt-8 space-y-4">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-center text-gray-300">
                                        <CheckCircle className="h-5 w-5 text-indigo-400 mr-3" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={cn(
                                "w-full mt-auto pt-4 text-lg font-semibold rounded-lg py-3 transition-colors",
                                plan.isFeatured ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                            )}>
                                Choose Plan
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
             <style>{`
                .card-aurora, .card-aurora-featured {
                    background-size: 300% 300%;
                    animation: gradient-animation 10s ease infinite;
                    filter: blur(50px);
                }
                .card-aurora { background-image: linear-gradient(45deg, #0077ff, #00ff77); }
                .card-aurora-featured { background-image: linear-gradient(45deg, #8A2BE2, #4A00E0); }
                [class*="card-aurora"] { transition: opacity 0.5s ease; }
                .group:hover .card-aurora, .group:hover .card-aurora-featured,
                div:hover > .card-aurora, div:hover > .card-aurora-featured {
                    opacity: 0.3;
                }
            `}</style>
        </div>
    );
};

export default AuroraPricing;