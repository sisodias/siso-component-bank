'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface NavbarProps {
    className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    return (
        <motion.nav
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 w-full py-3 md:py-4 px-4 sm:px-6 lg:px-10 bg-transparent",
                className
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between font-plus-jakarta">
                {/* Logo on the left */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Link href="/" className="flex items-center">
                        <div className="relative w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16">
                            <Image
                                src="https://res.cloudinary.com/dpqhqrs7k/image/upload/v1746595081/ChatGPT_Image_May_7_2025_12_33_53_AM_ngtoat.png"
                                alt="Logo"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                        <span className="text-white relative text-lg sm:text-xl md:text-2xl font-bold ml-2 sm:ml-3 md:ml-4 sm:-left-4 md:-left-6">Jatin</span>
                    </Link>
                </motion.div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <motion.button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white p-2 focus:outline-none"
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle menu"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            className="w-6 h-6"
                        >
                            {isMobileMenuOpen ? (
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M6 18L18 6M6 6l12 12" 
                                />
                            ) : (
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M4 6h16M4 12h16M4 18h16" 
                                />
                            )}
                        </svg>
                    </motion.button>
                </div>

                {/* Desktop Menu items */}
                <motion.div
                    className="hidden md:flex items-center gap-4 lg:gap-8"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Link
                        href="/work"
                        className="text-sm lg:text-base text-white hover:text-white/80 font-medium transition-colors"
                    >
                        Work
                    </Link>
                    <Link
                        href="/services"
                        className="text-sm lg:text-base text-white hover:text-white/80 font-medium transition-colors"
                    >
                        Services
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm lg:text-base text-white hover:text-white/80 font-medium transition-colors"
                    >
                        Contact
                    </Link>
                    <Link
                        href="/get-started"
                        className="text-sm lg:text-base px-4 lg:px-5 py-2 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
                    >
                        Get started
                    </Link>
                </motion.div>
            </div>

            {/* Mobile menu dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden mt-2 mx-4 overflow-hidden backdrop-blur-lg bg-black/30 rounded-xl border border-white/10"
                    >
                        <div className="flex flex-col py-3 px-4 space-y-3">
                            <Link
                                href="/work"
                                className="text-white hover:text-white/80 font-medium transition-colors py-2 text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Work
                            </Link>
                            <Link
                                href="/services"
                                className="text-white hover:text-white/80 font-medium transition-colors py-2 text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Services
                            </Link>
                            <Link
                                href="/contact"
                                className="text-white hover:text-white/80 font-medium transition-colors py-2 text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            <Link
                                href="/get-started"
                                className="bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors py-2 px-4 text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

interface AnimatedPathProps {
    className?: string;
    duration?: number;
    delay?: number;
    repeat?: number | boolean;
    d: string;
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
}

const AnimatedPath = ({
    className = "",
    duration = 2,
    delay = 0,
    repeat = Infinity,
    d,
    stroke = "currentColor",
    strokeWidth = 2,
    fill = "none"
}: AnimatedPathProps) => {
    return (
        <motion.path
            className={className}
            d={d}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
                pathLength: 1,
                opacity: 1,
            }}
            transition={{
                pathLength: {
                    duration,
                    delay,
                    repeat,
                    repeatType: "reverse",
                    ease: "easeInOut",
                },
                opacity: {
                    duration: 0.2,
                    delay,
                }
            }}
            fill={fill}
        />
    );
};

interface TextRotatorProps {
    words: string[];
    className?: string;
    interval?: number;
    textGradient?: boolean;
    letterAnimation?: boolean;
}

const TextRotator = ({
    words,
    className = "",
    interval = 3000,
    textGradient = true,
    letterAnimation = true
}: TextRotatorProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, interval);

        return () => clearInterval(timer);
    }, [words.length, interval]);

    // Animation variants for letter-by-letter effect
    const letterVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(5px)",
            scale: 0.9
        },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                delay: i * 0.05,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
            }
        }),
        exit: (i: number) => ({
            opacity: 0,
            y: -20,
            filter: "blur(5px)",
            scale: 0.9,
            transition: {
                delay: i * 0.02,
                duration: 0.3,
                ease: "easeInOut"
            }
        })
    };

    // Generate gradient colors for letters
    const getGradientColors = (index: number, total: number) => {
        const hueStart = (currentIndex * 30) % 360; // Rotate hue based on word
        const hue = hueStart + (index / total * 60); // Spread across 60 degrees
        return `hsl(${hue}, 80%, 60%)`;
    };

    return (
        <span className={cn(
            "relative inline-block min-w-[250px] min-h-[1.5em]",
            !letterAnimation && textGradient && "bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
            className
        )}>
            <AnimatePresence mode="wait">
                {letterAnimation ? (
                    <motion.span
                        key={currentIndex}
                        className="absolute inset-0 flex items-center justify-center w-full -mt-3"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {words[currentIndex].split('').map((letter, i, array) => (
                            <motion.span
                                key={`${currentIndex}-${i}`}
                                custom={i}
                                variants={letterVariants}
                                style={textGradient ? {
                                    color: getGradientColors(i, array.length),
                                    display: 'inline-block',
                                    textShadow: '0 0 15px rgba(100, 100, 200, 0.15)',
                                    fontWeight: 'inherit'
                                } : {}}
                                className={letter === ' ' ? 'ml-2' : ''}
                            >
                                {letter === ' ' ? '\u00A0' : letter}
                            </motion.span>
                        ))}
                    </motion.span>
                ) : (
                    <motion.span
                        key={currentIndex}
                        className="absolute inset-0 flex items-center justify-center w-full"
                        initial={{
                            y: 40,
                            opacity: 0,
                            filter: "blur(8px)",
                            scale: 0.95,
                        }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            filter: "blur(0px)",
                            scale: 1,
                        }}
                        exit={{
                            y: -40,
                            opacity: 0,
                            filter: "blur(8px)",
                            scale: 0.95,
                        }}
                        transition={{
                            y: { type: "spring", stiffness: 100, damping: 15 },
                            opacity: { duration: 0.5 },
                            filter: { duration: 0.4 },
                            scale: { duration: 0.4 }
                        }}
                    >
                        {words[currentIndex]}
                    </motion.span>
                )}
            </AnimatePresence>
            <span className="opacity-0">{words[0]}</span>
        </span>
    );
};

interface RippleProps {
    x: number;
    y: number;
    size: number;
}

const ButtonRipple = ({
    children,
    className = "",
    onClick,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    [key: string]: any;
}) => {
    const [ripples, setRipples] = useState<RippleProps[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = (e: React.MouseEvent) => {
        if (!buttonRef.current) return;

        const button = buttonRef.current;
        const rect = button.getBoundingClientRect();

        // Calculate ripple position relative to button
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate ripple size (should cover the button)
        const size = Math.max(rect.width, rect.height) * 1.5;

        // Add new ripple
        const newRipple = { x, y, size };
        setRipples([...ripples, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples((prevRipples) => prevRipples.filter(r => r !== newRipple));
        }, 1000);

        // Call original onClick if provided
        if (onClick) onClick(e);
    };

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            className={`relative overflow-hidden ${className}`}
            {...props}
        >
            {/* Ripple effect */}
            <AnimatePresence>
                {ripples.map((ripple, i) => (
                    <motion.span
                        key={i}
                        initial={{
                            opacity: 0.5,
                            scale: 0,
                            x: ripple.x - ripple.size / 2,
                            y: ripple.y - ripple.size / 2,
                        }}
                        animate={{
                            opacity: 0,
                            scale: 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            width: ripple.size,
                            height: ripple.size,
                            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                            borderRadius: '50%',
                            transform: `translate(${ripple.x - ripple.size / 2}px, ${ripple.y - ripple.size / 2}px) scale(0)`,
                            pointerEvents: 'none',
                        }}
                    />
                ))}
            </AnimatePresence>

            {children}
        </button>
    );
};

const HeroBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Noise overlay texture */}
            <div
                className="absolute inset-0 mix-blend-overlay opacity-30 z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '150px 150px',
                }}
            />

            {/* Subtle light beam effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"
                animate={{
                    opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            {/* Dynamic dotted grid */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px),
                        radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px, 30px 30px',
                    backgroundPosition: '0 0, 15px 15px',
                    opacity: 0.3,
                }}
            />

            {/* Ambient light sources */}
            <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/20 blur-2xl"
                animate={{
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />

            <motion.div
                className="absolute bottom-40 -left-20 w-60 h-60 rounded-full bg-white/10 blur-3xl"
                animate={{
                    opacity: [0.05, 0.15, 0.05],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                }}
            />

            {/* Fine grain pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='white' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: '80px 80px'
                }}
            />

            {/* Diagonal highlight animation */}
            <motion.div
                className="absolute -inset-full h-[300%] w-[200%] opacity-10"
                style={{
                    background: 'linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.4) 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60%)',
                    transform: 'rotate(-15deg)',
                }}
                animate={{
                    left: ['-100%', '100%'],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatDelay: 8,
                    ease: "easeInOut"
                }}
            />

            {/* Edge lighting */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
                <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
            </div>
        </div>
    );
};

const ClassyHero = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    // Words to rotate through
    const rotatingWords = ["Infrastructure", "Excellence", "Innovation"];

    // Function to handle button click and show the journey animation
    const handleButtonClick = () => {
        setIsButtonClicked(true);

        // Reset after animation completes
        setTimeout(() => {
            setIsButtonClicked(false);
        }, 3000);
    };

    return (
        <>
            <Navbar />
            <div className="relative bg-black h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                {/* Apply the new background component */}
                <HeroBackground />

                {/* Hero content with animation */}
                <motion.div
                    className="z-20 text-center px-4 relative -mt-40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <motion.h1
                    className="text-white text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto leading-tight flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    >
                    <span>We Build Tech</span>
                    <TextRotator
                        words={rotatingWords}
                        className="font-bold block"
                        interval={4000}
                        letterAnimation={true}
                    />
                    </motion.h1>

                    <motion.p
                        className="text-white/70 text-base md:text-lg mt-2 max-w-xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        For the Future of Business
                    </motion.p>

                    <motion.div
                        className="mt-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                    >
                        {/* Advanced button with ripple effect and animations */}
                        <ButtonRipple
                            className="group relative inline-flex items-center justify-center gap-3 px-5 py-2 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all duration-300 cursor-pointer"
                            onClick={handleButtonClick}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <span className="z-10 relative">Get Started</span>

                            {/* Icon with interactive animation */}
                            <div className="relative z-10 flex items-center justify-center h-6 w-6">
                                <AnimatePresence>
                                    {isButtonClicked ? (
                                        <motion.div
                                            key="journey-icon"
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ opacity: 0, rotate: -20 }}
                                            animate={{
                                                opacity: 1,
                                                rotate: 0,
                                                transition: { duration: 0.3 }
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 1.5,
                                                transition: { duration: 0.3 }
                                            }}
                                        >
                                            {/* Journey animation showing story progression */}
                                            <svg
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <AnimatedPath
                                                    d="M12 3L2 12H5V20H19V12H22L12 3Z"
                                                    stroke="#000"
                                                    strokeWidth={1.5}
                                                    duration={0.6}
                                                    delay={0}
                                                />
                                                <AnimatedPath
                                                    d="M9 14H15"
                                                    stroke="#000"
                                                    strokeWidth={1.5}
                                                    duration={0.3}
                                                    delay={0.6}
                                                />
                                                <AnimatedPath
                                                    d="M9 17H15"
                                                    stroke="#000"
                                                    strokeWidth={1.5}
                                                    duration={0.3}
                                                    delay={0.9}
                                                />
                                                <motion.circle
                                                    cx="12"
                                                    cy="10"
                                                    r="1"
                                                    fill="#000"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 1.2, duration: 0.3 }}
                                                />
                                            </svg>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="arrow-icon"
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ opacity: 1 }}
                                            exit={{ opacity: 0, x: -10 }}
                                        >
                                            <motion.div
                                                animate={{
                                                    x: isHovered ? [0, 3, 0] : 0,
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: isHovered ? Infinity : 0,
                                                    repeatType: "reverse"
                                                }}
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M5 12H19"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M12 5L19 12L12 19"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Gradient hover effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 rounded-full"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: isHovered ? 0.15 : 0,
                                }}
                            />

                            {/* Orbit animation */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        className="absolute rounded-full pointer-events-none"
                                        style={{
                                            width: '150%',
                                            height: '150%',
                                        }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {[...Array(3)].map((_, index) => (
                                            <motion.div
                                                key={index}
                                                className="absolute w-1 h-1 bg-white rounded-full"
                                                initial={{
                                                    top: '50%',
                                                    left: '50%',
                                                    translateX: '-50%',
                                                    translateY: '-50%',
                                                }}
                                                animate={{
                                                    rotate: [0, 360]
                                                }}
                                                transition={{
                                                    rotate: {
                                                        duration: 3 + index,
                                                        ease: "linear",
                                                        repeat: Infinity,
                                                    }
                                                }}
                                                style={{
                                                    width: 2 + index * 1,
                                                    height: 2 + index * 1,
                                                    transformOrigin: 'center',
                                                    top: '50%',
                                                    left: '50%',
                                                    x: '-50%',
                                                    y: '-50%',
                                                    rotate: 0,
                                                    offsetDistance: `${40 + index * 15}%`,
                                                    offsetPath: `path('M 0,0 C 25,-50 75,-50 100,0 C 75,50 25,50 0,0')`,
                                                    offsetRotate: '0deg',
                                                }}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </ButtonRipple>
                    </motion.div>
                </motion.div>
                {/* Email address input box*/}
                <motion.div
                    className="absolute bottom-10 mx-auto transform -translate-x-1/2 text-center z-30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.7 }}
                >
                    <div className="relative flex items-center backdrop-blur-sm bg-white/5 p-1 rounded-full border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)] w-[17rem] mx-auto">
                        <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 to-white/10"
                            animate={{
                                opacity: [0.3, 0.5, 0.3],
                                scale: [1, 1.01, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <div className="flex items-center relative z-10">
                            <svg
                                className="w-4 h-4 text-white/40 absolute left-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="pl-10 pr-4 py-2 text-sm rounded-full bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-300 w-48"
                            />
                        </div>
                        <motion.button
                            className="ml-2 px-4 py-2 text-sm bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300 relative z-10"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                // Create ripple effect
                                const button = document.activeElement as HTMLElement;
                                const circle = document.createElement('div');
                                const diameter = Math.max(button.clientWidth, button.clientHeight);
                                circle.style.width = circle.style.height = `${diameter}px`;
                                circle.style.position = 'absolute';
                                circle.style.borderRadius = '50%';
                                circle.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                                circle.style.transform = 'scale(0)';
                                circle.style.transition = 'all 0.3s ease-out';

                                // Position the ripple
                                const rect = button.getBoundingClientRect();
                                circle.style.left = '0px';
                                circle.style.top = '0px';

                                // Add and animate
                                button.appendChild(circle);
                                requestAnimationFrame(() => {
                                    circle.style.transform = 'scale(2)';
                                    circle.style.opacity = '0';
                                });

                                // Cleanup
                                setTimeout(() => circle.remove(), 300);
                            }}
                        >
                            <motion.span
                                className="cursor-pointer"
                                initial={{ opacity: 0.8 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            >
                                Join
                            </motion.span>
                        </motion.button>
                    </div>
                    <p className="relative text-white/30 text-xs mt-2">Your data is secure and protected by industry-standard encryption</p>
                </motion.div>

                {/* Services Card - Left Side */}
                <motion.div
                    className="absolute bottom-10 left-10 z-30 xl:block hidden"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 2 }}
                >
                                            <div className="absolute inset-0 rounded-2xl bg-white/5 blur-xl"></div>

                    <motion.div
                        className="bg-black/10 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl w-80 relative border border-white/10"
                        whileHover={{
                            y: -3,
                            boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <div className="p-6 flex flex-col relative">
                            <div className="flex justify-between items-start">
                                <h3 className="text-white text-2xl font-bold tracking-tight">Our<br />Services</h3>

                                <div className="text-white/80 bg-white/10 p-2 rounded-lg backdrop-blur-md">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center gap-3 text-white/90">
                                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Infrastructure Solutions</span>
                                </div>

                                <div className="flex items-center gap-3 text-white/90">
                                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Security Services</span>
                                </div>

                                <div className="flex items-center gap-3 text-white/90">
                                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Performance Optimization</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="text-white/60 text-sm">Learn more about our services</div>
                                    <motion.div
                                        className="bg-white/10 p-2 rounded-full cursor-pointer backdrop-blur-sm"
                                        whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Projects Showcase Card - Right Side */}
                <motion.div
                    className="absolute bottom-10 right-10 z-30 xl:block hidden"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                >
                    <motion.div
                        className="w-80 relative"
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <div className="absolute inset-0 rounded-2xl bg-white/5 blur-xl"></div>

                        <div className="bg-black/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">Featured Projects</h3>
                                        <p className="text-white/50 text-sm">Recent work highlights</p>
                                    </div>

                                    <motion.div
                                        className="relative w-10 h-10"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <motion.circle
                                                cx="20"
                                                cy="20"
                                                r="19"
                                                stroke="white"
                                                strokeOpacity="0.1"
                                                strokeWidth="1"
                                                strokeDasharray="1 3"
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 30,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                                style={{ transformOrigin: 'center' }}
                                            />
                                        </svg>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {[
                                        {
                                            title: "Enterprise Dashboard",
                                            desc: "Design System",
                                            progress: 100
                                        },
                                        {
                                            title: "Cloud Platform",
                                            desc: "Infrastructure",
                                            progress: 85
                                        },
                                        {
                                            title: "Mobile Suite",
                                            desc: "Development",
                                            progress: 60
                                        }
                                    ].map((project, index) => (
                                        <motion.div
                                            key={index}
                                            className="bg-white/5 rounded-lg p-3"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.7 + (index * 0.1) }}
                                        >
                                            <div className="flex justify-between mb-2">
                                                <div>
                                                    <h4 className="text-white text-sm font-medium">{project.title}</h4>
                                                    <p className="text-white/40 text-xs">{project.desc}</p>
                                                </div>
                                            </div>

                                            <div className="h-1 bg-white/10 rounded-full">
                                                <motion.div
                                                    className="h-full bg-white/80 rounded-full"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: `${project.progress}%` }}
                                                    transition={{ duration: 1, delay: 2 }}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
                                    {[
                                        { value: "15+", label: "Projects" },
                                        { value: "99%", label: "Success" },
                                        { value: "24/7", label: "Support" }
                                    ].map((stat, index) => (
                                        <motion.div
                                            key={index}
                                            className="text-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 2.2 + (index * 0.1) }}
                                        >
                                            <div className="text-white font-semibold">{stat.value}</div>
                                            <div className="text-white/40 text-xs">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </>
    )
}

export default ClassyHero