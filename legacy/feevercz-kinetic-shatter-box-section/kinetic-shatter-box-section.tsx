import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "../_utils/cn";
/**
 * =========================================================================
 *                              TYPES & INTERFACES
 * =========================================================================
 */
export interface SectionCardProps {
    title: string;
    description: string;
    className?: string; // Optional className for custom styling
    onBreak?: () => void; // Callback when the card completely breaks
}
interface FallState {
    active: boolean;    // Is the falling animation active?
    velocityX: number;  // Horizontal velocity for drift
    velocityY: number;  // Vertical velocity (gravity)
    rotation: number;   // Rotational momentum
}
interface DebrisData {
    id: number;
    x: number;       // X position (%)
    y: number;       // Y position (%)
    rot: number;     // Rotation (deg)
    delay: number;   // Animation delay (s)
    path: string;    // SVG path string for the chunk shape
}
/**
 * =========================================================================
 *                              CONSTANTS & CONFIG
 * =========================================================================
 */
// Physics Configuration
const PHYSICS = {
    MAX_RANGE: 45,            // Maximum pixels the card can be dragged from center
    DAMAGE_THRESHOLD: 2.5,    // Velocity required to trigger damage/cracking
    DAMAGE_INCREMENT: 0.08,   // How much damage to add per damaging frame
    RECOVERY_RATE: 0.05,      // How fast damage recovers when holding still (input smoothing)
    RESPAWN_TIME_MS: 7000,    // Time until the card reappears after breaking
    DEBRIS_DISAPPEAR_MS: 3000, // Time until debris chunks fade away
    HEALING_DURATION_MS: 10000 // Time for full damage healing (10s)
} as const;
// Irregular polygon shapes for debris chunks
const CHUNK_PATHS = [
    "M 0 0 L 20 5 L 15 25 L 5 20 Z",
    "M 5 0 L 25 10 L 15 30 L 0 25 Z",
    "M 10 5 L 30 0 L 25 25 L 5 30 Z",
    "M 0 10 L 20 0 L 30 20 L 10 30 Z",
];
// Damage thresholds for spawning debris
const DEBRIS_THRESHOLDS = [0.3, 0.5, 0.7, 0.9];
/**
 * =========================================================================
 *                              HOOKS
 * =========================================================================
 */
/**
 * useBreakableCard
 * 
 * Central logic controller for the breakable card interaction.
 * Handles dragging physics, velocity calculation, crack progression,
 * debris spawning, and the final "break" state/animation.
 */
const useBreakableCard = (onBreak?: () => void) => {
    // --- State ---
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [crackLevel, setCrackLevel] = useState(0); // Range: 0.0 to 1.0
    const [isBroken, setIsBroken] = useState(false);
    const [fallState, setFallState] = useState<FallState>({
        active: false,
        velocityX: 0,
        velocityY: 0,
        rotation: 0
    });
    const [debrisChunks, setDebrisChunks] = useState<DebrisData[]>([]);
    const [respawnProgress, setRespawnProgress] = useState(0);
    const [isFlashing, setIsFlashing] = useState(false);
    // --- Refs (Mutable state for physics loop) ---
    const lastPos = useRef({ x: 0, y: 0 });
    const startPos = useRef({ x: 0, y: 0 });
    const lastTime = useRef(Date.now());
    const shakeIntensity = useRef(0);
    const velocityRef = useRef({ x: 0, y: 0 });
    const crackLevelRef = useRef(0); // Ref copy for synchronous access in event handlers
    const isBrokenRef = useRef(false); // Ref copy to prevent multiple triggers
    /**
     * triggerBreak
     * Initiates the 'broken' state, disabling drag and starting the fall animation.
     */
    const triggerBreak = useCallback(() => {
        if (isBrokenRef.current) return;
        isBrokenRef.current = true;
        setIsBroken(true);
        setIsDragging(false);
        // Calculate fall physics based on last frame's velocity
        const vx = velocityRef.current.x;
        // Smoother rotation based on velocity, but clamped
        const baseRotation = Math.max(-60, Math.min(60, vx));
        setFallState({
            active: true,
            velocityX: vx * 0.3, // Reduced horizontal drift for "smoother falling down"
            velocityY: 5,
            rotation: baseRotation
        });
        onBreak?.();
    }, [onBreak]);
    /**
     * spawnDebris
     * Checks if new debris needs to be spawned based on current damage level.
     */
    const spawnDebris = useCallback((level: number) => {
        const newChunks: DebrisData[] = [];
        DEBRIS_THRESHOLDS.forEach((threshold, i) => {
            // Spawn if threshold reached and we haven't spawned this specific chunk yet
            // (Assumes order of thresholds matches index in debrisChunks for simplicity)
            if (level >= threshold && debrisChunks.length <= i) {
                newChunks.push({
                    id: Date.now() + i,
                    x: Math.random() * 80 + 10, // Random pos 10-90%
                    y: Math.random() * 80 + 10,
                    rot: Math.random() * 360,
                    delay: 0,
                    path: CHUNK_PATHS[Math.floor(Math.random() * CHUNK_PATHS.length)]
                });
            }
        });
        if (newChunks.length > 0) {
            setDebrisChunks(prev => [...prev, ...newChunks]);
        }
    }, [debrisChunks.length]);
    // --- Interaction Handlers ---
    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (isBrokenRef.current) return;
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        // Record initial offset to prevent jumping
        startPos.current = {
            x: clientX - position.x,
            y: clientY - position.y
        };
        lastPos.current = { x: clientX, y: clientY };
        lastTime.current = Date.now();
        shakeIntensity.current = 0;
    }, [position.x, position.y]);
    const handleDragMove = useCallback((clientX: number, clientY: number) => {
        if (!isDragging || isBrokenRef.current) return;
        const now = Date.now();
        const dt = Math.max(1, now - lastTime.current); // Prevent divide by zero
        // 1. Calculate Velocity
        const dx = clientX - lastPos.current.x;
        const dy = clientY - lastPos.current.y;
        const vx = dx / dt;
        const vy = dy / dt;
        // Store scaled velocity for fall physics
        velocityRef.current = { x: vx * 100, y: vy * 100 };
        // 2. Update Position with Clamping
        const newX = clientX - startPos.current.x;
        const newY = clientY - startPos.current.y;
        const clampedX = Math.max(-PHYSICS.MAX_RANGE, Math.min(PHYSICS.MAX_RANGE, newX));
        const clampedY = Math.max(-PHYSICS.MAX_RANGE, Math.min(PHYSICS.MAX_RANGE, newY));
        setPosition({ x: clampedX, y: clampedY });
        // 3. Damage Calculation (Horizontal = Strong, Vertical = Weak)
        const pushedRight = clampedX >= PHYSICS.MAX_RANGE && vx > 0;
        const pushedLeft = clampedX <= -PHYSICS.MAX_RANGE && vx < 0;
        const pushedDown = clampedY >= PHYSICS.MAX_RANGE && vy > 0;
        const pushedUp = clampedY <= -PHYSICS.MAX_RANGE && vy < 0;
        const isHorizontalImpact = (pushedRight || pushedLeft) && Math.abs(vx) > 0.5;
        const isVerticalImpact = (pushedDown || pushedUp) && Math.abs(vy) > 0.5;
        if (isHorizontalImpact) {
            shakeIntensity.current += PHYSICS.DAMAGE_INCREMENT * 1.5; // Full damage
            setIsFlashing(true);
            setTimeout(() => setIsFlashing(false), 150);
        } else if (isVerticalImpact) {
            shakeIntensity.current += PHYSICS.DAMAGE_INCREMENT * 0.5; // Reduced damage
        } else {
            shakeIntensity.current = Math.max(0, shakeIntensity.current - PHYSICS.RECOVERY_RATE);
        }
        // 4. Update Damage State
        setCrackLevel(prev => {
            const newLevel = Math.min(1, prev + shakeIntensity.current * 0.025);
            crackLevelRef.current = newLevel;
            spawnDebris(newLevel);
            if (newLevel >= 1) {
                // Defer break trigger to next tick to avoid render cycles
                setTimeout(() => triggerBreak(), 0);
            }
            return newLevel;
        });
        lastPos.current = { x: clientX, y: clientY };
        lastTime.current = now;
    }, [isDragging, spawnDebris, triggerBreak]);
    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        // Always snap back on release. 
        // Cards only break now by hitting 100% damage during the shake.
        setPosition({ x: 0, y: 0 });
        shakeIntensity.current = 0; // Clear any pending damage momentum
    }, [isDragging]);
    // --- Side Effects ---
    // Healing Logic (Slowly repair damage when not dragging and not broken)
    useEffect(() => {
        if (!isDragging && !isBroken && crackLevel > 0) {
            const interval = setInterval(() => {
                setCrackLevel(prev => {
                    // Heal rate: 1.0 (full health) / 10000ms * 50ms interval = 0.005 per tick
                    const healAmount = 50 / PHYSICS.HEALING_DURATION_MS;
                    const newLevel = Math.max(0, prev - healAmount);
                    crackLevelRef.current = newLevel; // Keep ref in sync
                    // Clear debris if fully healed? Optional, but keeping chunks feels more "scarred" until full heal.
                    // For now, let's just clear chunks if we hit 0 to clean up.
                    if (newLevel <= 0) {
                        setDebrisChunks([]);
                    }
                    return newLevel;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isDragging, isBroken, crackLevel]);
    // Respawn Timer Logic
    useEffect(() => {
        if (isBroken) {
            setRespawnProgress(0);
            const startTime = Date.now();
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(100, (elapsed / PHYSICS.RESPAWN_TIME_MS) * 100);
                setRespawnProgress(progress);
                if (elapsed >= PHYSICS.RESPAWN_TIME_MS) {
                    clearInterval(interval);
                    // Reset EVERYTHING
                    setIsBroken(false);
                    isBrokenRef.current = false;
                    setCrackLevel(0);
                    crackLevelRef.current = 0;
                    setPosition({ x: 0, y: 0 });
                    setDebrisChunks([]);
                    setFallState({ active: false, velocityX: 0, velocityY: 0, rotation: 0 });
                    shakeIntensity.current = 0;
                    velocityRef.current = { x: 0, y: 0 };
                    setRespawnProgress(0);
                }
            }, 50); // 20fps update for smooth bar
            return () => clearInterval(interval);
        }
    }, [isBroken]);
    // Global Event Listeners for Dragging
    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e: MouseEvent | TouchEvent) => {
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
            handleDragMove(clientX, clientY);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", handleDragEnd);
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("touchend", handleDragEnd);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", handleDragEnd);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", handleDragEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);
    return {
        isDragging,
        position,
        crackLevel,
        isBroken,
        fallState,
        debrisChunks,
        handleDragStart,
        respawnProgress,
        isFlashing
    };
};
/**
 * =========================================================================
 *                              SUB-COMPONENTS
 * =========================================================================
 */
/**
 * DebrisChunk
 * A visual shard that detaches from the card.
 * Handles its own fade-out lifecycle.
 */
interface DebrisChunkProps {
    x: number;
    y: number;
    rot: number;
    path: string;
    [key: string]: any; // Allow React special props in object literals
}
const DebrisChunk = ({ x, y, rot, path }: DebrisChunkProps) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), PHYSICS.DEBRIS_DISAPPEAR_MS);
        return () => clearTimeout(timer);
    }, []);
    if (!visible) return null;
    return (
        <svg
            className="absolute w-8 h-8 pointer-events-none z-30 overflow-visible"
            style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `rotate(${rot}deg)`,
                animation: `debris-fall 0.8s cubic-bezier(0.55, 0, 1, 0.45) 0s forwards`
            }}
        >
            <path d={path} fill="white" stroke="black" strokeWidth="2" />
        </svg>
    );
};
/**
 * CrackLines
 * Renders progressive SVG cracks based on damage level.
 */
const CrackLines = ({ level }: { level: number }) => {
    if (level < 0.1) return null;
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            {level >= 0.1 && <path d="M0 20 L15 25 L8 40 L20 50" fill="none" stroke="black" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ opacity: Math.min(1, level * 2) }} />}
            {level >= 0.5 && <path d="M50 100 L55 80 L45 70 L60 55" fill="none" stroke="black" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ opacity: Math.min(1, (level - 0.4) * 2) }} />}
            {level >= 0.9 && <path d="M20 0 L25 20 L40 25 L35 45 L50 50" fill="none" stroke="black" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeDasharray="4 2" />}
        </svg>
    );
};
/**
 * =========================================================================
 *                              MAIN COMPONENT
 * =========================================================================
 */
export const BreakableCard = ({ title, description, className, onBreak }: SectionCardProps) => {
    const {
        isDragging,
        position,
        crackLevel,
        isBroken,
        fallState,
        debrisChunks,
        handleDragStart,
        respawnProgress,
        isFlashing
    } = useBreakableCard(onBreak);
    // Unique ID for the mask to prevent collisions between multiple cards
    const cardId = useMemo(() => `card-${Math.random().toString(36).substr(2, 9)}`, []);
    // Unique figure number for each card instance
    const figNum = useMemo(() => Math.floor(Math.random() * 99) + 1, []);
    // Calculate CSS transform for the falling animation
    const fallTransform = useMemo(() => {
        if (!fallState.active) return '';
        const horizontalDrift = fallState.velocityX * 5;
        const rotation = fallState.rotation + (fallState.velocityX > 0 ? 45 : -45);
        return `translate(${horizontalDrift}px, 120vh) rotate(${rotation}deg)`;
    }, [fallState]);
    return (
        <div className={cn("relative w-full h-full", className)}>
            {/* 
               LAYER 1: Shadow Remnant (Background) 
               Always visible, indicating where the card was/should be.
            */}
            <div className="absolute inset-0 bg-zinc-900 border-4 border-dashed border-zinc-700 flex flex-col items-center justify-center z-0">
                <span className="text-zinc-400 font-black text-2xl uppercase tracking-widest mb-2">Gone</span>
                {/* Loading Bar (Visible only when waiting for respawn) */}
                {isBroken && (
                    <div className="w-24 h-4 border-2 border-zinc-700 bg-zinc-950 relative overflow-hidden mt-2">
                        <div
                            className="absolute inset-0 bg-zinc-400 transition-all duration-75 ease-linear"
                            style={{ width: `${respawnProgress}%` }}
                        />
                    </div>
                )}
            </div>
            {/* 
               LAYER 2: Debris Chunks  
               These must be outside the masked container but move with the card initially.
               We transform this container to match the card, so chunks spawn in the right place,
               then their own CSS animation takes over for falling.
            */}
            <div className="pointer-events-none absolute inset-0 z-50 overflow-visible"
                style={{
                    transform: isBroken
                        ? fallTransform
                        : `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.15}deg)`
                }}>
                {debrisChunks.map((chunk: DebrisData) => (
                    <DebrisChunk
                        key={chunk.id}
                        x={chunk.x}
                        y={chunk.y}
                        rot={chunk.rot}
                        path={chunk.path}
                    />
                ))}
            </div>
            {/* 
               LAYER 3: Interactive Card (Foreground)
               This is the main block that gets masked/holed.
            */}
            <div
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                className={cn(
                    "relative z-10 bg-white border-4 border-black p-6 shadow-neo cursor-grab active:cursor-grabbing select-none h-full flex flex-col justify-between overflow-hidden transition-[background-color]",
                    !isDragging && !isBroken && "hover:animate-[hover-wiggle_0.8s_ease-in-out_infinite]",
                    isBroken && "pointer-events-none",
                    isFlashing && "bg-red-50"
                )}
                style={{
                    // Physics Transform
                    transform: isBroken
                        ? fallTransform
                        : `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.15}deg)`,
                    // Transition Handling (Instant for drag, smooth for snap-back/fall)
                    transition: isDragging
                        ? 'none'
                        : isBroken
                            ? 'transform 1.0s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 1.0s ease-out' // Ease-in for gravity feel
                            : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    opacity: isBroken ? 0 : 1,
                    // CSS MASKING for holes
                    // Uses SVG mask defined below to punch out shape of debris
                    maskImage: debrisChunks.length > 0 ? `url(#mask-${cardId})` : 'none',
                    WebkitMaskImage: debrisChunks.length > 0 ? `url(#mask-${cardId})` : 'none',
                    maskSize: '100% 100%',
                    WebkitMaskSize: '100% 100%',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                }}
            >
                <div>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-black text-3xl uppercase tracking-tighter leading-none">{title}</h3>
                        <div className="w-8 h-8 bg-black rounded-full flex-shrink-0" />
                    </div>
                    {/* Body */}
                    <p className="font-bold text-lg leading-tight">{description}</p>
                </div>
                {/* Footer */}
                <div className="mt-8 border-t-2 border-black pt-2 flex justify-between text-xs font-mono uppercase">
                    <span>Fig. {figNum.toString().padStart(2, '0')}</span>
                    <span className={cn(crackLevel > 0.7 && "text-red-600 font-bold")}>
                        {crackLevel > 0 ? `${Math.round(crackLevel * 100)}% DMG` : 'INTACT'}
                    </span>
                </div>
                {/* Overlays */}
                <CrackLines level={crackLevel} />
                {crackLevel > 0.2 && (
                    <div className="absolute inset-0 bg-red-500 mix-blend-multiply pointer-events-none" style={{ opacity: crackLevel * 0.15 }} />
                )}
            </div>
            {/* 
               LAYER 4: Global SVG Definitions
               Hidden SVG defining the clipping masks for this specific card
            */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <mask id={`mask-${cardId}`} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
                        {/* 1. White base = visible */}
                        <rect x="0" y="0" width="1" height="1" fill="white" />
                        {/* 2. Black chunks = hidden (the holes) */}
                        {debrisChunks.map((chunk: DebrisData) => (
                            <g key={`hole-${chunk.id}`} transform={`translate(${chunk.x / 100}, ${chunk.y / 100}) rotate(${chunk.rot}) scale(0.003)`}>
                                <path d={chunk.path} fill="black" />
                            </g>
                        ))}
                    </mask>
                </defs>
            </svg>
        </div>
    );
};
export const Component = BreakableCard;