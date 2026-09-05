    "use client";

    import React, { useState, useRef, useEffect, useCallback } from "react";
    import { cn } from "@/lib/utils";

    /**
     * =========================================================================
     * PHYSICS HOOK (Smoother + More Dynamic)
     * =========================================================================
     */
    const useSymbiotePhysics = () => {
    // Container State
    const [pos, setPos] = useState({ x: 0, y: 0 });

    // Core State
    const [coreOffset, setCoreOffset] = useState({ x: 0, y: 0 });
    const [stretch, setStretch] = useState({ x: 1, y: 1, rotation: 0 });
    const [stress, setStress] = useState(0);
    const [particles, setParticles] = useState<any[]>([]);

    // Physics Refs
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const currentPos = useRef({ x: 0, y: 0 });
    const currentCorePos = useRef({ x: 0, y: 0 });
    const velocity = useRef({ x: 0, y: 0 });
    const rafId = useRef(0);

    // Smoother constants
    const TENSION = 0.045; // slightly softer
    const FRICTION = 0.93; // smoother deceleration
    const MAX_STRETCH = 0.28;

    // subtle idle wobble
    const idleTime = useRef(0);

    const update = useCallback(() => {
        idleTime.current += 0.01;

        // Idle wobble if not dragging and near center
        if (!isDragging.current) {
        const wobbleX = Math.sin(idleTime.current * 1.6) * 2;
        const wobbleY = Math.cos(idleTime.current * 1.3) * 2;
        currentCorePos.current.x += (wobbleX - currentCorePos.current.x) * 0.03;
        currentCorePos.current.y += (wobbleY - currentCorePos.current.y) * 0.03;
        }

        // Spring Physics toward origin
        const dx = -currentCorePos.current.x;
        const dy = -currentCorePos.current.y;

        velocity.current.x += dx * TENSION;
        velocity.current.y += dy * TENSION;
        velocity.current.x *= FRICTION;
        velocity.current.y *= FRICTION;

        currentCorePos.current.x += velocity.current.x;
        currentCorePos.current.y += velocity.current.y;

        // Stretch Calculation
        const speed = Math.sqrt(
        velocity.current.x ** 2 + velocity.current.y ** 2
        );
        const angle = Math.atan2(velocity.current.y, velocity.current.x);
        const stretchAmount = Math.min(speed * 0.035, MAX_STRETCH);

        // Stress Calculation (slightly smoother)
        setStress((prev) => {
        const target =
            speed > 6 ? Math.min(100, prev + speed * 0.7) : Math.max(0, prev - 1);
        return target;
        });

        // Update State
        setCoreOffset({ ...currentCorePos.current });
        setStretch({
        x: 1 + stretchAmount,
        y: 1 - stretchAmount * 0.4,
        rotation: angle * (180 / Math.PI),
        });

        rafId.current = requestAnimationFrame(update);
    }, []);

    const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
        isDragging.current = true;
        const cx =
        "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const cy =
        "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        dragStart.current = {
        x: cx - currentPos.current.x,
        y: cy - currentPos.current.y,
        };
    };

    const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging.current) return;
        const cx =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const cy =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

        const newX = cx - dragStart.current.x;
        const newY = cy - dragStart.current.y;

        const CLAMP = 42;
        const clamped = {
        x: Math.max(-CLAMP, Math.min(CLAMP, newX)),
        y: Math.max(-CLAMP, Math.min(CLAMP, newY)),
        };

        // Smooth pos instead of snapping
        currentPos.current = {
        x: currentPos.current.x + (clamped.x - currentPos.current.x) * 0.4,
        y: currentPos.current.y + (clamped.y - currentPos.current.y) * 0.4,
        };

        setPos({ ...currentPos.current });

        // Soft inertial push
        velocity.current.x -= (newX - currentPos.current.x) * 0.06;
        velocity.current.y -= (newY - currentPos.current.y) * 0.06;
    }, []);

    const handleUp = useCallback(() => {
        isDragging.current = false;
        // Let physics pull it back instead of hard reset
    }, []);

    // Particles Init
    useEffect(() => {
        setParticles(
        Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            x: (Math.random() - 0.5) * 60,
            y: (Math.random() - 0.5) * 60,
            size: Math.random() * 3 + 1,
            alpha: Math.random() * 0.4 + 0.15,
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.6,
        }))
        );

        rafId.current = requestAnimationFrame(update);
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
        window.addEventListener("touchmove", handleMove);
        window.addEventListener("touchend", handleUp);
        return () => {
        cancelAnimationFrame(rafId.current);
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleUp);
        };
    }, [handleMove, handleUp, update]);

    // Gentle particle drift
    useEffect(() => {
        const id = setInterval(() => {
        setParticles((prev) =>
            prev.map((p) => {
            const angle = p.phase;
            const nx = p.x + Math.cos(angle) * p.speed;
            const ny = p.y + Math.sin(angle) * p.speed;
            return {
                ...p,
                x: nx * 0.98,
                y: ny * 0.98,
                phase: p.phase + 0.04,
            };
            })
        );
        }, 32);
        return () => clearInterval(id);
    }, []);

    return { pos, coreOffset, stretch, stress, particles, handleDown };
    };

    /**
     * =========================================================================
     * MINIMALIST COMPONENT (Richer Color System)
     * =========================================================================
     */

    interface SymbioteProps {
    className?: string;
    label?: string;
    }

    export const PlasmaCard = ({ className, label = "09" }: SymbioteProps) => {
    const { pos, coreOffset, stretch, stress, particles, handleDown } =
        useSymbiotePhysics();

    // Map stress (0–100) → 0–1
    const t = Math.min(1, Math.max(0, stress / 100));

    // Multi-color gradient phases (cyan → blue → violet → rose → amber)
    const calmCore =
        "conic-gradient(from 0deg, #06b6d4, #22d3ee, #38bdf8, #06b6d4)";
    const midCore =
        "conic-gradient(from 0deg, #3b82f6, #6366f1, #8b5cf6, #3b82f6)";
    const hotCore =
        "conic-gradient(from 0deg, #f97316, #f97316, #fb7185, #facc15, #f97316)";

    const coreBackground =
        t < 0.4 ? calmCore : t < 0.8 ? midCore : hotCore;

    const glowColor =
        t < 0.4
        ? "rgba(56, 189, 248, 0.35)" // cyan / blue
        : t < 0.8
        ? "rgba(129, 140, 248, 0.4)" // indigo / violet
        : "rgba(248, 113, 113, 0.45)"; // warm / danger

    const statusColor =
        t < 0.35
        ? "bg-cyan-400"
        : t < 0.7
        ? "bg-indigo-400"
        : "bg-rose-500";

    const borderAccent =
        t < 0.35
        ? "from-cyan-400/40 via-sky-500/30 to-emerald-300/20"
        : t < 0.7
        ? "from-indigo-400/40 via-violet-500/30 to-fuchsia-400/20"
        : "from-orange-400/40 via-rose-500/35 to-amber-300/25";

    return (
        <div className={cn("relative w-full h-full min-h-87.5 group", className)}>
        {/* Outer gradient halo */}
        <div
            className={cn(
            "pointer-events-none absolute -inset-0.5 rounded-[34px] opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-90",
            "bg-linear-to-tr",
            borderAccent
            )}
        />

        {/* 1. The Container (Interactive) */}
        <div
            onMouseDown={handleDown}
            onTouchStart={handleDown}
            className={cn(
            "relative z-10 w-full h-full rounded-[32px] cursor-grab active:cursor-grabbing",
            "border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%),rgba(15,23,42,0.88)]",
            "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            )}
            style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.x * 0.04}deg)`,
            backdropFilter: "blur(26px)",
            boxShadow:
                "0 18px 40px -18px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
        >
            {/* 2. Top UI: Status Dot */}
            <div className="absolute top-6 left-6 flex items-center gap-3">
            <div className="relative flex items-center justify-center">
                <div
                className={cn(
                    "w-2.5 h-2.5 rounded-full transition-colors duration-500",
                    statusColor
                )}
                />
                <div
                className={cn(
                    "absolute w-6 h-6 rounded-full opacity-70 transition-all duration-700",
                    "animate-[ping_1.7s_cubic-bezier(0,0,0.2,1)_infinite]",
                    statusColor
                )}
                />
            </div>
            <span className="text-[10px] font-medium tracking-[0.22em] text-zinc-500 uppercase font-sans">
                {t < 0.35 ? "Stable" : t < 0.7 ? "Charged" : "Overloaded"}
            </span>
            </div>

            {/* 3. Bottom UI: Label */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2">
            <span className="rounded-full border border-white/5 bg-white/5 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-300">
                Symbiote
            </span>
            <span className="text-[10px] font-bold text-zinc-600 font-mono">
                ID_{label}
            </span>
            </div>

            {/* 4. THE FLUID CORE */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
                className="relative w-40 h-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                transform: `
                    translate3d(${coreOffset.x * 1.2}px, ${coreOffset.y * 1.2}px, 0)
                    rotate(${stretch.rotation}deg)
                    scale(${stretch.x}, ${stretch.y})
                `,
                filter: "blur(30px)",
                background: coreBackground,
                opacity: 0.9,
                }}
            >
                <div className="absolute -inset-2 rounded-[999px] bg-white/10 mix-blend-overlay" />
            </div>
            </div>

            {/* 5. Particles (Minimalist but Dynamic) */}
            <div className="absolute inset-0 overflow-hidden rounded-[32px]">
            {particles.map((p) => (
                <div
                key={p.id}
                className="absolute rounded-full transition-colors duration-500"
                style={{
                    width: p.size,
                    height: p.size,
                    left: "50%",
                    top: "50%",
                    transform: `translate3d(${p.x * 2.4}px, ${p.y * 2.4}px, 0)`,
                    opacity: p.alpha * (0.4 + t * 0.6),
                    background:
                    t < 0.4
                        ? "#22d3ee"
                        : t < 0.8
                        ? "#6366f1"
                        : "#fb7185",
                    boxShadow: `0 0 12px ${
                    t < 0.4 ? "#22d3ee" : t < 0.8 ? "#6366f1" : "#fb7185"
                    }`,
                }}
                />
            ))}
            </div>

            {/* 6. Glass Reflections (Subtle) */}
            <div className="absolute inset-0 rounded-[32px] pointer-events-none bg-[linear-gradient(115deg,rgba(255,255,255,0.12),transparent_55%,rgba(15,23,42,0.4))] opacity-60" />

            {/* 7. Stress Glow (Container Border Effect) */}
            <div
            className="absolute inset-0 rounded-[32px] transition-opacity duration-400 pointer-events-none"
            style={{
                boxShadow: `inset 0 0 110px ${glowColor}`,
                opacity: 0.2 + (stress / 100) * 0.8,
            }}
            />
        </div>

        {/* 8. Shadow Element (Under the card) */}
        <div className="absolute -inset-4 bg-transparent z-0 flex items-end justify-center">
            <div
            className="w-3/4 h-8 rounded-[999px] blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
                background:
                t < 0.4
                    ? "radial-gradient(circle, rgba(56,189,248,0.2), transparent)"
                    : t < 0.8
                    ? "radial-gradient(circle, rgba(129,140,248,0.22), transparent)"
                    : "radial-gradient(circle, rgba(248,113,113,0.25), transparent)",
                transform: `translate3d(${pos.x * 0.45}px, ${pos.y * 0.18}px, 0) scale(${
                0.9 - Math.min(0.35, Math.abs(pos.x) / 180)
                })`,
            }}
            />
        </div>
        </div>
    );
    };
