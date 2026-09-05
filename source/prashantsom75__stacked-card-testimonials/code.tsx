'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

// --- Utility Components ---

function FluidBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[var(--bg-page)]">
            {/* Noise Texture */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-10"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Fluid Blobs */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 50, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--blob-purple)] rounded-full blur-[120px]"
            />

            <motion.div
                animate={{
                    x: [0, -70, 30, 0],
                    y: [0, 80, -20, 0],
                    scale: [1, 1.1, 0.8, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-[var(--blob-blue)] rounded-full blur-[100px]"
            />

            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, 30, -30, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-[var(--blob-pink)] rounded-full blur-[140px]"
            />
        </div>
    );
}

interface TestimonialImageProps {
    src?: string;
    alt: string;
    className?: string;
    index: number;
}

function TestimonialImage({ src, alt, className = "", index }: TestimonialImageProps) {
    const gradients = [
        "from-purple-500 to-indigo-600",
        "from-blue-500 to-cyan-600",
        "from-orange-500 to-pink-600",
        "from-emerald-500 to-teal-600"
    ];
    const gradient = gradients[index % gradients.length];

    return (
        <div className={`relative overflow-hidden rounded-[32px] ${className}`}>
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: "easeOut" }} // Subtle slow zoom out on enter
                className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative`}
            >
                {src ? (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 to-transparent" />
                )}

                {!src && (
                    <div className="relative text-white/90 font-medium text-4xl tracking-tighter">
                        {alt.charAt(0)}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

// --- Main Component ---

interface Testimonial {
    id: number;
    quote: string;
    author: string;
    role: string;
    company: string;
    src?: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "The simplicity is deceptive. It hides a complexity of thought that is rare in software design today.",
        author: "Elena Fisher",
        role: "Head of Product",
        company: "DesignCo",
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
    },
    {
        id: 2,
        quote: "It just works. The fluidity of the interactions makes every other tool feel ancient by comparison.",
        author: "Marcus Chen",
        role: "Lead Engineer",
        company: "TechFlow",
        src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop"
    },
    {
        id: 3,
        quote: "A true masterclass in user experience. Nothing is superfluous, yet nothing is missing.",
        author: "Sarah James",
        role: "Creative Director",
        company: "Artistry",
        src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop"
    },
    {
        id: 4,
        quote: "Finally, a platform that respects my time and focus. The attention to detail is palpable.",
        author: "David Park",
        role: "Founder",
        company: "StartUp Inc",
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop"
    },
];

export default function CleanTestimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const paginate = useCallback((newDirection: number) => {
        setCurrentIndex((prev) => {
            const next = prev + newDirection;
            if (next < 0) return testimonials.length - 1;
            if (next >= testimonials.length) return 0;
            return next;
        });
    }, []);

    const current = testimonials[currentIndex];
    // No direction state needed for simple cycle, but AnimatePresence for text uses it
    // We can infer direction or just use mode="wait"

    const quoteWords = current.quote.split(" ");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.02,
                delayChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.01,
                staggerDirection: -1
            }
        }
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 15, filter: 'blur(8px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20
            } as any
        },
        exit: {
            opacity: 0,
            y: -15,
            filter: 'blur(8px)',
            transition: { duration: 0.2 }
        }
    };

    // 1. Calculate the stack order for *all* items based on currentIndex
    // We want to render them all, and animate their properties.
    const getCardStyle = (index: number) => {
        // Relative index in the cycle [0, 1, 2, 3...]
        // 0 = Active
        // 1 = Next
        // 2 = Third
        // ...
        const len = testimonials.length;
        // (index - currentIndex + len) % len gives us 0 for current, 1 for next...
        // But we might want handling for "Previous"?
        // The user wants "Top image going back into stack". 
        // This implies Forward navigation: 0 -> Back, 1 -> 0.

        const offset = (index - currentIndex + len) % len;

        if (offset === 0) {
            return "front";
        } else if (offset === 1) {
            return "second";
        } else if (offset === 2) {
            return "third";
        } else {
            return "back";
        }
    };

    const cardVariants = {
        front: {
            zIndex: 30,
            scale: 1,
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            rotate: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 } as any
        },
        second: {
            zIndex: 20,
            scale: 0.9,
            y: -30, // Stack upwards/backwards
            opacity: 0.7,
            filter: 'blur(0px)',
            rotate: 4,
            transition: { type: "spring", stiffness: 300, damping: 30 } as any
        },
        third: {
            zIndex: 10,
            scale: 0.8,
            y: -60,
            opacity: 0.4,
            filter: 'blur(1px)',
            rotate: -4,
            transition: { type: "spring", stiffness: 300, damping: 30 } as any
        },
        back: {
            zIndex: 5,
            scale: 0.7,
            y: -90,
            opacity: 0, // Fade out at the back
            filter: 'blur(4px)',
            rotate: 0,
            transition: { duration: 0.4 } as any
        }
    };

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center p-6 md:p-12 overflow-hidden">
            <FluidBackground />

            {/* Unified Glass Card */}
            <div className="relative z-10 w-full max-w-6xl bg-[var(--bg-card)] backdrop-blur-3xl rounded-[48px] border border-[var(--border-card)] shadow-[var(--shadow-card)] p-8 md:p-12 overflow-hidden">

                {/* Subtle internal noise/texture specific to card */}
                <div className="absolute inset-0 opacity-[0.4] bg-gradient-to-br from-white/40 to-white/0 pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left: Text Content & Navigation (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-between min-h-[400px]">
                        <div className="space-y-8">
                            {/* Header / Counter */}
                            <div className="flex items-center gap-3 text-[var(--text-muted)] font-medium tracking-wide text-sm uppercase">
                                <span className="w-8 h-[2px] bg-[var(--counter-line)] rounded-full"></span>
                                Testimonial {currentIndex + 1} / {testimonials.length}
                            </div>

                            {/* Animated Quote */}
                            <div className="min-h-[180px] md:min-h-[240px] flex items-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={current.id}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={containerVariants}
                                    >
                                        <blockquote className="text-3xl md:text-5xl font-semibold tracking-tighter leading-[1.15] text-[var(--text-main)] drop-shadow-sm">
                                            {quoteWords.map((word, i) => (
                                                <motion.span
                                                    key={i}
                                                    variants={wordVariants}
                                                    className="inline-block mr-[0.25em]"
                                                >
                                                    {word}
                                                </motion.span>
                                            ))}
                                        </blockquote>

                                        <motion.div variants={wordVariants} className="pt-6">
                                            <div className="text-lg font-bold text-[var(--text-main)]">{current.author}</div>
                                            <div className="text-lg text-[var(--text-muted)] font-medium">{current.role}, {current.company}</div>
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Static Navigation Buttons */}
                        <div className="flex items-center gap-4 mt-8 pt-4">
                            <motion.button
                                onClick={() => paginate(-1)}
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.9)' }}
                                whileTap={{ scale: 0.95 }}
                                className="group flex items-center justify-center w-14 h-14 rounded-full bg-[var(--btn-secondary-bg)] backdrop-blur-md border border-[var(--btn-secondary-border)] shadow-sm hover:shadow-md transition-all duration-300"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="w-5 h-5 text-[var(--btn-icon)]" />
                            </motion.button>
                            <motion.button
                                onClick={() => paginate(1)}
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(23,23,23,1)' }}
                                whileTap={{ scale: 0.95 }}
                                className="group flex items-center justify-center w-14 h-14 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-md hover:shadow-lg transition-all duration-300"
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Right: Cyclic Stack (5 cols) */}
                    <div className="lg:col-span-5 h-[400px] lg:h-[500px] w-full relative perspective-[1000px] flex items-center justify-center">
                        {/* Render ALL Card Slots */}
                        {testimonials.map((item, index) => {
                            const variant = getCardStyle(index);
                            return (
                                <motion.div
                                    key={item.id}
                                    className="absolute w-full h-full"
                                    animate={variant}
                                    initial={false}
                                    variants={cardVariants}
                                    layout // Use layout for smooth position swapping
                                >
                                    <TestimonialImage
                                        index={index}
                                        src={item.src}
                                        alt={item.author}
                                        className={`w-full h-full object-cover rounded-[32px] shadow-lg ring-1 transition-all duration-500 ${variant === 'front' ? 'ring-white/20' : 'ring-black/5'}`}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
