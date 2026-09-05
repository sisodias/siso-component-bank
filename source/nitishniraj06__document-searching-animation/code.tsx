import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { FileText, Search } from 'lucide-react'

interface GridConfig {
    numCards: number
    cols: number
    xBase: number
    yBase: number
    xStep: number
    yStep: number
}

const AnimatedLoadingSkeleton = () => {
    const [windowWidth, setWindowWidth] = useState(0)
    const controls = useAnimation()

    const getGridConfig = (width: number): GridConfig => {
        const numCards = 6
        const cols = width >= 1024 ? 3 : width >= 640 ? 2 : 1
        return {
            numCards,
            cols,
            xBase: 40,
            yBase: 60,
            xStep: 210,
            yStep: 230
        }
    }

    const generateSearchPath = (config: GridConfig) => {
        const { numCards, cols, xBase, yBase, xStep, yStep } = config
        const rows = Math.ceil(numCards / cols)
        let allPositions = []

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if ((row * cols + col) < numCards) {
                    allPositions.push({
                        x: xBase + (col * xStep),
                        y: yBase + (row * yStep)
                    })
                }
            }
        }

        const numRandomCards = 4
        const shuffledPositions = allPositions
            .sort(() => Math.random() - 0.5)
            .slice(0, numRandomCards)

        shuffledPositions.push(shuffledPositions[0])

        return {
            x: shuffledPositions.map(pos => pos.x),
            y: shuffledPositions.map(pos => pos.y),
            scale: Array(shuffledPositions.length).fill(1.2),
            transition: {
                duration: shuffledPositions.length * 2,
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1],
                times: shuffledPositions.map((_, i) => i / (shuffledPositions.length - 1))
            }
        }
    }

    useEffect(() => {
        setWindowWidth(window.innerWidth)
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const config = getGridConfig(windowWidth)
        controls.start(generateSearchPath(config))
    }, [windowWidth, controls])

    const frameVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    }

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: { delay: i * 0.1, duration: 0.4 }
        })
    }

    const glowVariants = {
        animate: {
            boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.2)",
                "0 0 35px rgba(59, 130, 246, 0.4)",
                "0 0 20px rgba(59, 130, 246, 0.2)"
            ],
            scale: [1, 1.1, 1],
            transition: {
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    const documentVariants = {
        float: {
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    const config = getGridConfig(windowWidth)

    return (
        <motion.div
            className="w-full max-w-4xl mx-auto p-6 bg-background rounded-xl shadow-lg border border-border"
            variants={frameVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-muted/50 to-muted p-8">
                {/* Background Document Skeletons */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={`doc-${i}`}
                            className="absolute"
                            style={{
                                left: `${(i % 4) * 25}%`,
                                top: `${Math.floor(i / 4) * 50}%`,
                            }}
                            variants={documentVariants}
                            animate="float"
                            transition={{ delay: i * 0.2 }}
                        >
                            <div className="bg-foreground/20 p-4 rounded-lg w-16 h-20">
                                <FileText className="w-8 h-8 text-foreground/40" />
                                <div className="mt-2 space-y-1">
                                    <div className="h-1 bg-foreground/30 rounded w-full" />
                                    <div className="h-1 bg-foreground/30 rounded w-3/4" />
                                    <div className="h-1 bg-foreground/30 rounded w-1/2" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Large Background Document */}
                <motion.div
                    className="absolute right-4 top-4 opacity-5 pointer-events-none"
                    variants={documentVariants}
                    animate="float"
                >
                    <div className="bg-foreground/20 p-8 rounded-xl w-32 h-40">
                        <FileText className="w-16 h-16 text-foreground/40 mb-4" />
                        <div className="space-y-2">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-2 bg-foreground/30 rounded"
                                    style={{ width: `${100 - (i * 10)}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>

                                {/* Search icon with animation */}
                <motion.div
                    className="absolute z-30 pointer-events-none"
                    animate={controls}
                    style={{ left: 24, top: 24 }}
                >
                    <motion.div
                        className="bg-primary/20 p-3 rounded-full backdrop-blur-sm border border-primary/30"
                        variants={glowVariants}
                        animate="animate"
                    >
                        <Search className="w-6 h-6 text-primary" />
                    </motion.div>
                </motion.div>

                {/* Grid of animated cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-20">
                    {[...Array(config.numCards)].map((_, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            custom={i}
                            whileHover={{ scale: 1.02 }}
                            className="bg-card rounded-lg shadow-sm p-4 border border-border"
                        >
                            {/* Document icon in card */}
                            <div className="flex items-center mb-3">
                                <FileText className="w-5 h-5 text-muted-foreground mr-2" />
                                <motion.div
                                    className="h-3 w-20 bg-muted rounded"
                                    animate={{
                                        background: ["hsl(var(--muted))", "hsl(var(--muted-foreground) / 0.2)", "hsl(var(--muted))"],
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                />
                            </div>
                            
                            {/* Document content skeleton */}
                            <motion.div
                                className="h-32 bg-muted rounded-md mb-3 flex flex-col justify-center items-center"
                                animate={{
                                    background: ["hsl(var(--muted))", "hsl(var(--muted-foreground) / 0.2)", "hsl(var(--muted))"],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                            >
                                <FileText className="w-12 h-12 text-muted-foreground/50 mb-2" />
                                <div className="space-y-1 w-3/4">
                                    {[...Array(4)].map((_, lineIndex) => (
                                        <div
                                            key={lineIndex}
                                            className="h-1 bg-muted-foreground/30 rounded"
                                            style={{ width: `${100 - (lineIndex * 15)}%` }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                            
                            <motion.div
                                className="h-3 w-3/4 bg-muted rounded mb-2"
                                animate={{
                                    background: ["hsl(var(--muted))", "hsl(var(--muted-foreground) / 0.2)", "hsl(var(--muted))"],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                            />
                            <motion.div
                                className="h-3 w-1/2 bg-muted rounded"
                                animate={{
                                    background: ["hsl(var(--muted))", "hsl(var(--muted-foreground) / 0.2)", "hsl(var(--muted))"],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default AnimatedLoadingSkeleton
