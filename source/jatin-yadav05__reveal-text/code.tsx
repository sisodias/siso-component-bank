"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

export const MinimalistTextEffect = ({
    text,
    duration,
}: {
    text: string;
    duration?: number;
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [ripplePosition, setRipplePosition] = useState({ cx: "50%", cy: "50%" });
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDark = () => {
            if (typeof window !== "undefined") {
                setIsDark(document.documentElement.classList.contains("dark"));
            }
        };
        checkDark();
        // Listen for class changes (e.g., theme toggles)
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (svgRef.current && cursor.x !== null && cursor.y !== null) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
            const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;

            setRipplePosition({
                cx: `${cxPercentage}%`,
                cy: `${cyPercentage}%`,
            });
        }
    }, [cursor]);

    // Define gradient stops for light and dark themes
    const gradientStops = isDark
        ? [
            // Dark theme: lighter text, darker background
            <stop key="0" offset="0%" stopColor="#f3f4f6" />,   // Tailwind zinc-100
            <stop key="1" offset="50%" stopColor="#52525b" />,   // Tailwind zinc-600
            <stop key="2" offset="100%" stopColor="#18181b" />   // Tailwind zinc-900
        ]
        : [
            // Light theme: darker text, lighter background
            <stop key="0" offset="0%" stopColor="#ffffff" />,    // White
            <stop key="1" offset="50%" stopColor="#a3a3a3" />,   // Tailwind zinc-400
            <stop key="2" offset="100%" stopColor="#171717" />   // Tailwind zinc-900
        ];

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
            }}
            className="w-full h-full"
        >
            <svg
                ref={svgRef}
                width="70%"
                height="70%"
                viewBox="0 0 150 50"
                xmlns="http://www.w3.org/2000/svg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
                className="select-none"
                style={{ display: "block", margin: "0 auto" }}
            >
                <defs>
                    {/* Theme-adaptive monochrome gradient */}
                    <motion.radialGradient
                        id="monoGradient"
                        gradientUnits="userSpaceOnUse"
                        r="35%"
                        animate={ripplePosition}
                        transition={{ duration: duration ?? 0.3, ease: "circOut" }}
                    >
                        {gradientStops}
                    </motion.radialGradient>

                    {/* Inverse ripple mask */}
                    <motion.radialGradient
                        id="inverseMask"
                        gradientUnits="userSpaceOnUse"
                        r="30%"
                        animate={ripplePosition}
                        transition={{
                            duration: duration ?? 0.4,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 150,
                            damping: 20
                        }}
                    >
                        <stop offset="0%" stopColor="black" />
                        <stop offset="80%" stopColor="white" />
                        <stop offset="100%" stopColor="white" />
                    </motion.radialGradient>

                    <mask id="revealMask">
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            fill="url(#inverseMask)"
                        />
                    </mask>
                </defs>

                {/* Revealing filled text */}
                <motion.text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="url(#monoGradient)"
                    mask="url(#revealMask)"
                    className="font-mono font-light tracking-wider"
                    style={{ fontSize: 16 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{
                        duration: 0.6,
                        ease: "easeInOut"
                    }}
                >
                    {text}
                </motion.text>
            </svg>
        </div>
    );
};