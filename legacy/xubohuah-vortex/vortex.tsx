'use client'

import { useEffect, useState, useRef } from 'react'

// Collection of mathematical expressions
const expressions = [
    // Square Rotation
    'sin(x*cos(t) - y*sin(t))*8 * (1-max(abs(x), abs(y)))',
    // Psychedelic Chessboard
    'sin(round(x*8)*round(y*8) + t)*cos(r*4)',
    // Light Beam Interweaving
    'sin(th + t + r*tan(t))',
    // Quantum Vortex
    'sin(r*8 - t) * exp(-r*2) * cos(th/2) + sin(th*4 + t)',
    // Snake
    'sin(hypot(x-sin(t),y-cos(t))*8) * exp(-hypot(x-sin(t*0.5),y-cos(t*0.5))*1.5) + sin(hypot(x-sin(t*0.7+2),y-cos(t*0.7+2))*8) * exp(-hypot(x-sin(t*0.3+2),y-cos(t*0.3+2))*1.5)',
    // Light and Shadow Snake
    '(sin(hypot(x-sin(t),y-cos(t))*8) * exp(-hypot(x-sin(t),y-cos(t))*1.8) + sin(hypot(x-sin(t-0.2),y-cos(t-0.2))*8) * exp(-hypot(x-sin(t-0.2),y-cos(t-0.2))*1.8)) * (1-r*0.7) * (0.8 + sin(t*3)*0.2)',
    // Snake 2.0 - With Tail Trail Effect
    'max(sin(hypot(x-sin(t),y-cos(t))*8) * exp(-hypot(x-sin(t),y-cos(t))), sin(hypot(x-sin(t-0.5),y-cos(t-0.5))*8) * exp(-hypot(x-sin(t-0.5),y-cos(t-0.5))*1.2)) * (1-r*0.5)',
    // Space-Time Tunnel
    'sin(hypot(x,y)*8 - t) * (1-r) + cos(atan2(y,x)*4 + t)',
    // Dimension Gate
    'sin(sqrt(abs(x*y))*12 + t) * cos(atan2(y,x)*6 - t)',
    // Fractal Light and Shadow
    'sin(x*10+t) * cos(y*10-t) * noise(r*3) + sin(th*6)',
    // Hyperdimensional Jump
    'sin(r*15 - t*2) * cos(th*8 + noise(r+t)*5) * exp(-r)',
    // Light Rhythm
    'sin(th*2 + r*sin(t*2)) * exp(-r*1.5) * cos(t)',
    // Quantum Resonance
    'sin(r*20 + noise(th+t)) * exp(-r*2) * cos(th*8)',
    // Space-Time Ripples
    'sin(hypot(x,y)*10) * cos(atan2(y,x)*6 + t) * (1-r)',
    // Dimensional Fold
    'sin(x*y*6 + t) * cos(r*10 - t) * noise(th+t)',
    // Light Dance
    'sin(th*4 + t) * (1-r) * cos(r*6 - t) + sin(r*8)',
    // Fractal Nebula
    'sin(r*15 + noise(th*2+t)*8) * cos(th*12 + sin(t))',
    // Hyperspace Channel
    'sin(hypot(x,y)*12-t*2) * cos(atan2(y,x)*8+t) * noise(r)',
    // Quantum Entanglement
    'sin(x*12 + noise(t)) * cos(y*12 + noise(t+1)) * sin(r*6)',
    // Space-Time Tapestry
    'sin(r*20 + th*4 - t) * cos(th*10 + r*sin(t)) * exp(-r)',
    // Light Pulse
    'sin(r*25 + noise(th*3+t)*10) * exp(-r*2) * cos(th*16)',
    // Dimensional Resonance
    'sin(sqrt(x*x + y*y)*15 - t) * cos(th*8 + noise(r)*6)',
    // Fractal Vortex
    'sin(th*12 + r*8 - t) * cos(r*6 + noise(th)*4) * exp(-r)',
    // String Oscillation
    'sin(hypot(x,y)*20) * cos(atan2(y,x)*12 + t) * noise(r*2)',
    // Quantum Garden
    'sin(x*15+t) * cos(y*15-t) * noise(r*4) * sin(th*8)',
    // Translation Wave
    'sin((x + t)*8) * cos((y - t)*8) * (1-r)',
    // Spiral Translation
    'sin(th + r*8 + x*t) * cos(y + t) * exp(-r)',
    // Diagonal Scan
    'sin((x + y + t)*10) * cos((x - y - t)*10) * (1-r)',
    // Ring Diffusion
    'sin(r*15 - t) * cos(th + t*2) * (sin(t - r*5))',
    // Square Ripple
    'sin(max(abs(x), abs(y))*20 - t) * (1-r)',
    // Diamond Scan
    'sin(abs(x) + abs(y) + t*2) * cos(th*8) * (1-r)',
    // Rotating Cross
    'sin(x*cos(t) + y*sin(t))*10 * cos(x*sin(t) - y*cos(t))*10',
    // Scaling Pulse
    'sin(r*(1 + sin(t))) * cos(th*8) * exp(-r)',
    // Spiral Scan
    'sin(th*8 + r*10 + t) * cos(x + y + t) * (1-r)',
    // Radial Compression
    'sin(r/(1 + sin(t)*0.5))*10 * cos(th*6) * exp(-r)',
    // Wave Propagation
    'sin(hypot(x-sin(t), y-cos(t))*10) * (1-r)',
    // Space Distortion
    'sin(x + sin(y + t)*2)*5 * cos(y + sin(x - t)*2)*5 * (1-r)',
    // Fractal Displacement
    'sin(x*8 + sin(y*8 + t)) * cos(y*8 + sin(x*8 - t)) * (1-r)',
    // Four-Way Diffusion
    'sin(sqrt(abs(x*cos(t)) + abs(y*sin(t)))*15) * (1-r)',
    // Spiral Compression
    'sin(th*6 + r*10/(1 + cos(t))) * exp(-r*2)',
    // Progressive Scan
    'sin((atan2(y,x) + t)*8) * cos((hypot(x,y) - t)*8) * (1-r)',
    // Symmetric Displacement
    'sin(x*10 + t) * sin(y*10 - t) * cos(r*8) * (1-r)',
    // Grid Deformation
    'sin(x*10 + sin(t)*y*10) * cos(y*10 + cos(t)*x*10) * (1-r)',
    // Radial Ripple
    'sin(r*20 + atan2(y-sin(t), x-cos(t))) * exp(-r)',
    // Fractal Walk
    'sin(x*8 + t) * cos(y*8 + noise(t)) * sin(r*8 + th) * (1-r)',
    // Space Fold
    'sin(hypot(x*cos(t), y*sin(t))*10) * cos(atan2(y,x)*6 + t)',
    // Quantum Walk
    'sin(x + noise(t)) * cos(y + noise(t+1)) * sin(r*12) * (1-r)',
    // Dimensional Slide
    'sin(sqrt(abs(x*sin(t)) + abs(y*cos(t)))*12) * cos(th*8)',
    // Phase Shift
    'sin(r*15 + th + t) * cos(x + y + sin(t)*5) * exp(-r)',
    // Space-Time Fold
    'sin((x*cos(t) + y*sin(t))*8) * cos((y*cos(t) - x*sin(t))*8) * (1-r)',
    // Spiral Dance
    'sin(th*8 + r*12 + sin(t)) * cos(r*6 - cos(t)) * exp(-r)',
    // Fractal Drift
    'sin(x*10 + noise(t)*y*10) * cos(y*10 + noise(t+1)*x*10) * (1-r)'
]

export function VortexPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const getContext = () => canvasRef.current?.getContext('2d')
    const [highResolution, setHighResolution] = useState(false)
    const isHoveringRef = useRef(false)
    const isDarkMode = true // Default to dark mode

    // Use default expression
    const [currentExpression, setCurrentExpression] = useState(expressions[0])

    // Define color themes
    const colorThemes = [
        { dark: 220, light: 160 },  // Cyan-Green
        { dark: 280, light: 320 },  // Purple
        { dark: 30, light: 50 },    // Orange
        { dark: 180, light: 200 },  // Cyan
        { dark: 340, light: 0 },    // Red
        { dark: 60, light: 80 },    // Yellow
        { dark: 260, light: 280 },  // Purple-Blue
        { dark: 120, light: 140 },  // Green
        { dark: 300, light: 320 },  // Pink
        { dark: 200, light: 220 },  // Blue
    ]

    // Current color theme
    const [currentColorTheme, setCurrentColorTheme] = useState(colorThemes[0])

    // Handle expression change
    const handleExpressionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentExpression(e.target.value)
    }

    // Handle click event
    const handleClick = () => {
        if (!isHoveringRef.current) return
        const currentIndex = expressions.indexOf(currentExpression)
        const nextExpression = currentIndex === -1 || currentIndex === expressions.length - 1
            ? expressions[0]
            : expressions[currentIndex + 1]
        setCurrentExpression(nextExpression)

        // Randomly select new color theme
        const newColorTheme = colorThemes[Math.floor(Math.random() * colorThemes.length)]
        setCurrentColorTheme(newColorTheme)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        const x = e.clientX
        const y = e.clientY
        const hovering = (
            x > window.innerWidth / 2 - 200 &&
            x < window.innerWidth / 2 + 200 &&
            y > window.innerHeight / 2 - 200 &&
            y < window.innerHeight / 2 + 200
        )
        isHoveringRef.current = hovering
    }

    const handleMouseLeave = () => {
        isHoveringRef.current = false
    }

    // Handle keyboard events with useEffect
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault()
                setHighResolution(prev => !prev)
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])

    useEffect(() => {
        const ctx = getContext()
        if (!ctx) return

        // Set canvas size
        const updateCanvasSize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth
                canvasRef.current.height = window.innerHeight
            }
        }
        
        // Initial size setup
        updateCanvasSize()
        
        // Listen for window resize
        window.addEventListener('resize', updateCanvasSize)

        let frameId: number
        const startTime = Date.now()
        const size = 400

        // Define center coordinates
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2

        // Extended function definition
        type ExtendedFunction = (params: {
            t: number    // time
            r: number    // radius
            th: number   // angle
            x: number    // cartesian coordinate x
            y: number    // cartesian coordinate y
            noise: (v: number) => number  // perlin noise
            exp: (v: number) => number    // exponential function
            hypot: (x: number, y: number) => number  // euclidean distance
        }) => number

        // Perlin noise implementation
        const noise = (() => {
            const permutation = new Array(256).fill(0)
                .map((_, i) => i)
                .sort(() => Math.random() - 0.5);

            const p = new Array(512);
            for (let i = 0; i < 256; i++) {
                p[i] = p[i + 256] = permutation[i];
            }

            const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
            const lerp = (t: number, a: number, b: number) => a + t * (b - a);
            const grad = (hash: number, x: number) => {
                const h = hash & 15;
                const grad = 1 + (h & 7);
                return ((h & 8) === 0 ? grad : -grad) * x;
            };

            return function (v: number) {
                v = v * 2.0;
                const X = Math.floor(v) & 255;
                const x = v - Math.floor(v);
                const u = fade(x);
                const A = p[X] & 255;
                const B = p[X + 1] & 255;
                const g1 = grad(p[A], x);
                const g2 = grad(p[B], x - 1);
                return lerp(u, g1, g2);
            };
        })();

        // Use current expression
        const expression = currentExpression
        let fn: ExtendedFunction
        try {
            fn = new Function('params', `
                const {sin, cos, tan, abs, sqrt, exp, hypot, atan2, max, min, round, ceil, floor, random} = Math;
                const {t, r, th, x, y, noise} = params;
                return (${expression});
            `) as ExtendedFunction

            fn({ t: 0, r: 0, th: 0, x: 0, y: 0, noise, exp: Math.exp, hypot: Math.hypot })
        } catch {
            console.error('Expression compilation error')
            fn = () => 0
        }

        const draw = () => {
            const t = (Date.now() - startTime) / 1000
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

            const baseHue = isDarkMode ? currentColorTheme.dark : currentColorTheme.light

            const resolution = highResolution ? 2 : 4
            for (let px = -size / 2; px < size / 2; px += resolution) {
                for (let py = -size / 2; py < size / 2; py += resolution) {
                    const x = px / (size / 2)
                    const y = py / (size / 2)
                    const r = Math.sqrt(x * x + y * y)
                    const th = Math.atan2(y, x)

                    let value: number
                    try {
                        value = fn({
                            t,
                            r,
                            th,
                            x,
                            y,
                            noise,
                            exp: Math.exp,
                            hypot: Math.hypot
                        })
                        value = Math.max(-1, Math.min(1, value))
                    } catch {
                        value = 0
                    }

                    const intensity = Math.abs(value)
                    const hueOffset = r * 30
                    const hue = (baseHue + t * 10 + hueOffset) % 360
                    const lightness = isDarkMode ? 45 + intensity * 35 : 35 + intensity * 30
                    const saturation = isDarkMode ? 70 + intensity * 20 : 60 + intensity * 25
                    const alpha = isDarkMode ? intensity * 0.7 : intensity * 0.8

                    ctx.fillStyle = value > 0
                        ? `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
                        : `hsla(${(hue + 180) % 360}, ${saturation}%, ${lightness}%, ${alpha})`

                    ctx.fillRect(
                        centerX + px,
                        centerY + py,
                        resolution,
                        resolution
                    )
                }
            }

            frameId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(frameId)
            window.removeEventListener('resize', updateCanvasSize)
        }
    }, [getContext, canvasRef, currentExpression, currentColorTheme, highResolution])

    return (
        <div className="relative w-full h-screen bg-black">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            />
            <div className="fixed left-1/2 -translate-x-1/2 text-base font-mono text-[#666666] text-center" style={{ top: 'calc(50% + 220px)' }}>
                <textarea
                    value={currentExpression}
                    onChange={handleExpressionChange}
                    className="bg-transparent focus:outline-none px-2 w-[400px] text-center resize-none h-[48px] leading-6 overflow-hidden"
                    rows={2}
                    spellCheck={false}
                />
            </div>
        </div>
    )
}
