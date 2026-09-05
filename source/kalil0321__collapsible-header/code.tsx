"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Component({ className }: { className?: string }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent hydration mismatches by not showing scroll-dependent content until mounted
    const shouldShowScrollBehavior = mounted && isScrolled;

    return (
        <motion.header
            className={cn(
                "sticky top-0 z-1 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                className
            )}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="max-w-6xl mx-auto px-6">
                {/* Top bar with personal info and social links */}
                <motion.div
                    className="flex items-center justify-between py-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <motion.div
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <Link
                                    href="https://kalil0321.com"
                                    className="hidden sm:inline"
                                    target="_blank"
                                >
                                    kalil0321.com
                                </Link>
                            </motion.div>
                        </div>

                        {/* Navigation links in top bar when scrolled */}
                        <motion.div
                            className="hidden md:flex items-center gap-4 text-sm"
                            initial={false}
                            animate={{
                                opacity: shouldShowScrollBehavior ? 1 : 0,
                                x: shouldShowScrollBehavior ? 0 : -20,
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                                pointerEvents: shouldShowScrollBehavior
                                    ? "auto"
                                    : "none",
                            }}
                        >
                            {["Browse", "Documentation", "Examples"].map(
                                (item) => (
                                    <Link
                                        key={item}
                                        href={
                                            item === "Browse"
                                                ? "#components"
                                                : `/${item.toLowerCase()}`
                                        }
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item}
                                    </Link>
                                )
                            )}
                        </motion.div>
                    </div>

                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {/* Show logo and contribute link in top bar when scrolled */}
                        <motion.div
                            className="flex items-center gap-4"
                            initial={false}
                            animate={{
                                opacity: shouldShowScrollBehavior ? 1 : 0,
                                x: shouldShowScrollBehavior ? 0 : 20,
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                                pointerEvents: shouldShowScrollBehavior
                                    ? "auto"
                                    : "none",
                            }}
                        >
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-sm font-medium"
                            >
                                <Code2 className="w-4 h-4" />
                                Components
                            </Link>
                            <Link
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://github.com/kalil0321/components"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Contribute
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Main header content - collapses on scroll */}
                <motion.div
                    className="overflow-hidden"
                    initial={false}
                    animate={{
                        height: shouldShowScrollBehavior ? 0 : "auto",
                        opacity: shouldShowScrollBehavior ? 0 : 1,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <motion.div
                        className="py-2 space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {/* Navigation */}
                        <nav className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2 text-lg font-semibold"
                                    >
                                        <Code2 className="w-5 h-5" />
                                        Components
                                    </Link>
                                </motion.div>
                                <motion.div
                                    className="hidden md:flex items-center gap-6 text-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                >
                                    {[
                                        "Browse",
                                        "Documentation",
                                        "Examples",
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                delay: 0.7 + index * 0.1,
                                                duration: 0.3,
                                            }}
                                            whileHover={{ y: -2 }}
                                        >
                                            <Link
                                                href={
                                                    item === "Browse"
                                                        ? "#components"
                                                        : `/${item.toLowerCase()}`
                                                }
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {item}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>

                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                <motion.div whileHover={{ y: -1 }}>
                                    <Link
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="https://github.com/kalil0321/components"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Contribute
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </nav>

                        {/* Hero section */}
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                            >
                                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                                    Components
                                </h1>
                                <motion.div
                                    className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md border"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 1.2,
                                        duration: 0.5,
                                        type: "spring",
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    v1.0
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.header>
    );
}
