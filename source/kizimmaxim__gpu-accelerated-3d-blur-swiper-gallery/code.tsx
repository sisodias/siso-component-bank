"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utils ---
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Types ---
export interface MediaItem {
    src: string;
    type: "image" | "video";
    heightRatio?: number;
}

interface GalleryColumn {
    items: MediaItem[];
    flexWeight: number;
}

export interface GalleryProps {
    columns: GalleryColumn[];
    layout?: "masonry" | "grid" | "vertical";
    items?: MediaItem[];
}

export interface ImageSwiperRef {
    next: () => void;
    prev: () => void;
}

// --- Internal Components ---
const BLUR_STEP = 4;

const ImageSwiper = React.forwardRef<ImageSwiperRef, {
    items: MediaItem[];
    initialIndex?: number;
    className?: string;
    onClose?: () => void;
}>(({ items, initialIndex = 0, className = "", onClose }, ref) => {
    const cardStackRef = useRef<HTMLDivElement>(null);
    const isSwiping = useRef(false);
    const hasDragged = useRef(false);
    const startX = useRef(0);
    const currentX = useRef(0);
    const animationFrameId = useRef<number | null>(null);
    const pendingPrevAnim = useRef(false);

    const [cursorKey, setCursorKey] = useState<"left" | "right" | "close">("close");

    const closeCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='8' fill='white'/%3E%3Cline x1='14' y1='14' x2='26' y2='26' stroke='black' stroke-width='1.8' stroke-linecap='round'/%3E%3Cline x1='26' y1='14' x2='14' y2='26' stroke='black' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E") 20 20, auto`;
    const leftCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='8' fill='white'/%3E%3Cpolyline points='23 14 16 20 23 26' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 20 20, auto`;
    const rightCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='8' fill='white'/%3E%3Cpolyline points='17 14 24 20 17 26' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 20 20, auto`;

    const [cardOrder, setCardOrder] = useState<number[]>(() => {
        const list = Array.from({ length: items.length }, (_, i) => i);
        if (initialIndex > 0 && initialIndex < list.length) {
            return [...list.slice(initialIndex), ...list.slice(0, initialIndex)];
        }
        return list;
    });

    const getDuration = useCallback((): number => {
        if (!cardStackRef.current) return 400;
        const value = getComputedStyle(cardStackRef.current).getPropertyValue("--card-swap-duration").trim();
        if (!value) return 400;
        if (value.endsWith("ms")) return parseFloat(value);
        if (value.endsWith("s")) return parseFloat(value) * 1000;
        return 400;
    }, []);

    const getCards = useCallback((): HTMLElement[] => {
        if (!cardStackRef.current) return [];
        return [...cardStackRef.current.querySelectorAll(".image-card")] as HTMLElement[];
    }, []);

    const getActiveCard = useCallback((): HTMLElement | null => {
        return getCards()[0] || null;
    }, [getCards]);

    const applySwipeStyles = useCallback((deltaX: number) => {
        const card = getActiveCard();
        if (!card) return;
        card.style.setProperty("--swipe-x", `${deltaX}px`);
        card.style.setProperty("--swipe-rotate", `${deltaX * 0.2}deg`);
        card.style.opacity = (1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.75).toString();
    }, [getActiveCard]);

    const updatePositions = useCallback((isPrevAnim = false) => {
        const duration = getDuration();
        const transition = `transform ${duration}ms ease, filter ${duration}ms ease, opacity ${duration}ms ease, -webkit-filter ${duration}ms ease`;
        const cards = getCards();

        cards.forEach((card, i) => {
            if (i === 0 && isPrevAnim) {
                card.style.transition = "none";
                card.style.setProperty("--i", "1");
                card.style.setProperty("--swipe-x", "-350px");
                card.style.setProperty("--swipe-rotate", "-10deg");
                card.style.webkitFilter = `blur(${(items.length - 1) * BLUR_STEP}px)`;
                card.style.filter = `blur(${(items.length - 1) * BLUR_STEP}px)`;
                card.style.opacity = "0.5";

                requestAnimationFrame(() => requestAnimationFrame(() => {
                    card.style.transition = transition;
                    card.style.setProperty("--swipe-x", "0px");
                    card.style.setProperty("--swipe-rotate", "0deg");
                    card.style.webkitFilter = "blur(0px)";
                    card.style.filter = "blur(0px)";
                    card.style.opacity = "1";
                }));
            } else {
                card.style.transition = transition;
                card.style.setProperty("--i", (i + 1).toString());
                card.style.setProperty("--swipe-x", "0px");
                card.style.setProperty("--swipe-rotate", "0deg");
                card.style.webkitFilter = `blur(${i * BLUR_STEP}px)`;
                card.style.filter = `blur(${i * BLUR_STEP}px)`;
                card.style.opacity = "1";
            }
        });
    }, [getCards, getDuration, items.length]);

    const handleNext = useCallback(() => {
        const duration = getDuration();
        const card = getActiveCard();
        if (!card) return;

        const finalBlur = (items.length - 1) * BLUR_STEP;
        card.style.transition = `transform ${duration}ms ease, filter ${duration}ms ease, opacity ${duration}ms ease, -webkit-filter ${duration}ms ease`;
        card.style.setProperty("--swipe-x", "350px");
        card.style.setProperty("--swipe-rotate", "10deg");
        card.style.webkitFilter = `blur(${finalBlur}px)`;
        card.style.filter = `blur(${finalBlur}px)`;
        card.style.opacity = "0.5";

        setTimeout(() => {
            setCardOrder(prev => (prev.length === 0 ? [] : [...prev.slice(1), prev[0]]));
        }, duration);
    }, [getActiveCard, getDuration, items.length]);

    const handlePrev = useCallback(() => {
        pendingPrevAnim.current = true;
        setCardOrder(prev => (prev.length === 0 ? [] : [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]));
    }, []);

    React.useImperativeHandle(ref, () => ({ next: handleNext, prev: handlePrev }));

    const handleStart = useCallback((clientX: number) => {
        if (isSwiping.current) return;
        isSwiping.current = true;
        hasDragged.current = false;
        startX.current = clientX;
        currentX.current = clientX;
        const card = getActiveCard();
        if (card) card.style.transition = "none";
    }, [getActiveCard]);

    const handleEnd = useCallback(() => {
        if (!isSwiping.current) return;
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }

        const deltaX = currentX.current - startX.current;
        const threshold = 50;
        const duration = getDuration();
        const card = getActiveCard();

        if (card) {
            if (Math.abs(deltaX) > threshold) {
                const direction = Math.sign(deltaX);
                if (direction > 0) {
                    card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease, filter ${duration}ms ease, -webkit-filter ${duration}ms ease`;
                    applySwipeStyles(0);
                    handlePrev();
                } else {
                    card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease, filter ${duration}ms ease, -webkit-filter ${duration}ms ease`;
                    card.style.setProperty("--swipe-x", `${direction * 350}px`);
                    card.style.setProperty("--swipe-rotate", `${direction * 10}deg`);
                    card.style.webkitFilter = `blur(${(items.length - 1) * BLUR_STEP}px)`;
                    card.style.filter = `blur(${(items.length - 1) * BLUR_STEP}px)`;
                    card.style.opacity = "0.5";

                    setTimeout(() => {
                        setCardOrder(prev => (prev.length === 0 ? [] : [...prev.slice(1), prev[0]]));
                    }, duration);
                }
            } else {
                card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease, filter ${duration}ms ease, -webkit-filter ${duration}ms ease`;
                applySwipeStyles(0);
                if (card.style.filter) {
                    card.style.webkitFilter = "blur(0px)";
                    card.style.filter = "blur(0px)";
                }
            }
        }

        if (!hasDragged.current && Math.abs(deltaX) < 5) {
            if (cursorKey === "left") handlePrev();
            else if (cursorKey === "right") handleNext();
        }

        isSwiping.current = false;
        startX.current = 0;
        currentX.current = 0;
    }, [getDuration, getActiveCard, applySwipeStyles, cursorKey, handleNext, handlePrev, items.length]);

    const handleMove = useCallback((clientX: number) => {
        if (!isSwiping.current) return;
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame(() => {
            currentX.current = clientX;
            const deltaX = currentX.current - startX.current;
            if (Math.abs(deltaX) > 5) hasDragged.current = true;
            applySwipeStyles(deltaX);
            if (Math.abs(deltaX) > 50) handleEnd();
        });
    }, [applySwipeStyles, handleEnd]);

    useEffect(() => {
        const el = cardStackRef.current;
        if (!el) return;
        const down = (e: PointerEvent) => handleStart(e.clientX);
        const move = (e: PointerEvent) => handleMove(e.clientX);
        const up = () => handleEnd();
        el.addEventListener("pointerdown", down);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerup", up);
        return () => {
            el.removeEventListener("pointerdown", down);
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerup", up);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [handleStart, handleMove, handleEnd]);

    useEffect(() => {
        const isPrev = pendingPrevAnim.current;
        pendingPrevAnim.current = false;
        updatePositions(isPrev);
    }, [cardOrder, updatePositions]);

    return (
        <section
            className={`relative grid place-items-center select-none w-full h-full overflow-hidden ${className}`}
            ref={cardStackRef}
            onClick={(e) => {
                if (e.target === cardStackRef.current && onClose) onClose();
            }}
            onPointerMove={(e) => {
                if (e.target === cardStackRef.current) setCursorKey("close");
            }}
            style={{
                touchAction: "none",
                perspective: "1000px",
                cursor: cursorKey === "close" ? closeCursor : cursorKey === "left" ? leftCursor : rightCursor,
                "--card-z-offset": "15px",
                "--card-y-offset": "10px",
                "--card-swap-duration": "0.4s",
            } as React.CSSProperties}
        >
            {cardOrder.map((originalIndex, displayIndex) => {
                const item = items[originalIndex];

                if (displayIndex >= 4) {
                    return (
                        <div key={`${item.src}-${originalIndex}-preload`} style={{ display: "none" }}>
                            {item.type === "video" ? (
                                <video src={item.src} preload="auto" muted playsInline />
                            ) : (
                                <img src={item.src} alt="" loading="eager" />
                            )}
                        </div>
                    );
                }

                return (
                    <article
                        key={`${item.src}-${originalIndex}`}
                        className="image-card absolute place-self-center rounded-xl overflow-hidden shadow-2xl bg-transparent will-change-transform"
                        onPointerMove={(e) => {
                            if (isSwiping.current && hasDragged.current) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const isLeft = (e.clientX - rect.left) < rect.width / 2;
                            setCursorKey(isLeft ? "left" : "right");
                        }}
                        style={{
                            "--i": (displayIndex + 1).toString(),
                            zIndex: items.length - displayIndex,
                            borderRadius: "12px",
                            transform: `translateZ(calc(-1 * var(--card-z-offset) * var(--i)))
                                        translateY(calc(var(--card-y-offset) * var(--i)))
                                        translateX(var(--swipe-x, 0px))
                                        rotateY(var(--swipe-rotate, 0deg))`,
                            WebkitFilter: `blur(${displayIndex * BLUR_STEP}px)`,
                            filter: `blur(${displayIndex * BLUR_STEP}px)`,
                            willChange: "transform, filter, opacity",
                            transition: "transform var(--card-swap-duration) ease, filter var(--card-swap-duration) ease, opacity var(--card-swap-duration) ease, -webkit-filter var(--card-swap-duration) ease"
                        } as React.CSSProperties}
                    >
                        {item.type === "video" ? (
                            <video
                                src={item.src}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="block max-w-[90vw] lg:max-w-[1200px] max-h-[85vh] lg:max-h-[800px] w-auto h-auto pointer-events-none select-none bg-transparent object-cover transform-gpu scale-[1.01]"
                                draggable={false}
                            />
                        ) : (
                            <img
                                src={item.src}
                                alt={`Media ${originalIndex + 1}`}
                                className="block max-w-[90vw] lg:max-w-[1200px] max-h-[85vh] lg:max-h-[800px] w-auto h-auto pointer-events-none select-none bg-transparent object-cover transform-gpu scale-[1.01]"
                                draggable={false}
                            />
                        )}
                    </article>
                );
            })}
        </section>
    );
});
ImageSwiper.displayName = "ImageSwiper";

const GalleryItem = ({ item, expandCursor, onClick }: { item: MediaItem, index: number, expandCursor: string, onClick: () => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);

    useEffect(() => {
        const media = mediaRef.current;
        if (!media) return;
        if (item.type === "video") {
            const video = media as HTMLVideoElement;
            if (video.readyState >= 3) setIsLoaded(true);
        } else {
            const img = media as HTMLImageElement;
            if (img.complete) setIsLoaded(true);
        }
    }, [item.src, item.type]);

    return (
        <div
            className="bg-transparent rounded-lg overflow-hidden relative group transition-all duration-500 hover:z-10"
            style={{
                cursor: expandCursor,
                aspectRatio: item.heightRatio ? `1 / ${item.heightRatio}` : undefined,
            }}
            onClick={onClick}
        >
            <AnimatePresence mode="wait">
                {!isLoaded && (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 bg-zinc-200/50 animate-pulse"
                    />
                )}
            </AnimatePresence>

            {item.type === "video" ? (
                <video
                    ref={mediaRef as React.RefObject<HTMLVideoElement>}
                    src={item.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={() => setIsLoaded(true)}
                    className={cn(
                        "w-full h-auto block object-cover transition-all duration-700 transform-gpu scale-[1.01] group-hover:scale-[1.02]",
                        isLoaded ? "opacity-100" : "opacity-0"
                    )}
                />
            ) : (
                <img
                    ref={mediaRef as React.RefObject<HTMLImageElement>}
                    src={item.src}
                    alt="Gallery item"
                    onLoad={() => setIsLoaded(true)}
                    className={cn(
                        "w-full h-auto block object-cover transition-all duration-700 transform-gpu scale-[1.01] group-hover:scale-[1.02]",
                        isLoaded ? "opacity-100" : "opacity-0"
                    )}
                    loading="lazy"
                />
            )}
        </div>
    );
};

export const Gallery = ({ columns, layout = "masonry", items: providedItems }: GalleryProps) => {
    const items = providedItems || columns.flatMap(col => col.items);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const swiperRef = useRef<ImageSwiperRef>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const expandCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='8' fill='white'/%3E%3Cpolyline points='26 10 30 10 30 14' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpolyline points='14 30 10 30 10 26' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cline x1='30' y1='10' x2='22' y2='18' stroke='black' stroke-width='1.8' stroke-linecap='round'/%3E%3Cline x1='10' y1='30' x2='18' y2='22' stroke='black' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E") 20 20, zoom-in`;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === "Escape") setSelectedIndex(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex]);

    let currentOffset = 0;
    const colOffsets = columns.map(col => {
        const offset = currentOffset;
        currentOffset += col.items.length;
        return offset;
    });

    const renderGalleryGrid = () => {
        if (layout === "masonry") {
            return (
                <div className="flex flex-col md:flex-row gap-4">
                    {columns.map((col, colIndex) => (
                        <div
                            key={colIndex}
                            className="flex flex-col gap-4 min-w-0"
                            style={{ flex: `${col.flexWeight} 1 0%` }}
                        >
                            {col.items.map((item, itemIndex) => {
                                const globalIndex = colOffsets[colIndex] + itemIndex;
                                return (
                                    <GalleryItem
                                        key={item.src}
                                        item={item}
                                        index={globalIndex}
                                        expandCursor={expandCursor}
                                        onClick={() => setSelectedIndex(globalIndex)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className={cn(
                "grid gap-4",
                layout === "vertical" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            )}>
                {items.map((item, index) => (
                    <GalleryItem
                        key={item.src}
                        item={item}
                        index={index}
                        expandCursor={expandCursor}
                        onClick={() => setSelectedIndex(index)}
                    />
                ))}
            </div>
        );
    };

    return (
        <>
            {renderGalleryGrid()}

            {mounted && createPortal(
                <AnimatePresence>
                    {selectedIndex !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
                            style={{ isolation: "isolate", transform: "translateZ(0)" }}
                        >
                            <div
                                className="absolute inset-0 bg-black/40"
                                style={{
                                    WebkitBackdropFilter: "blur(24px)",
                                    backdropFilter: "blur(24px)",
                                    transform: "translateZ(0)",
                                    cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='8' fill='white'/%3E%3Cline x1='14' y1='14' x2='26' y2='26' stroke='black' stroke-width='1.8' stroke-linecap='round'/%3E%3Cline x1='26' y1='14' x2='14' y2='26' stroke='black' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E") 20 20, auto`
                                }}
                                onClick={() => setSelectedIndex(null)}
                            />

                            <motion.div
                                initial={{ scale: 0.95, y: 15 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: -15, opacity: 0 }}
                                transition={{
                                    delay: 0.05,
                                    duration: 0.4,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                                className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none"
                            >
                                <div className="pointer-events-auto w-full h-full flex items-center justify-center">
                                    <ImageSwiper
                                        ref={swiperRef}
                                        items={items}
                                        initialIndex={selectedIndex}
                                        onClose={() => setSelectedIndex(null)}
                                    />
                                </div>

                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden z-20 flex items-center gap-2 pointer-events-auto">
                                    <button
                                        onClick={() => swiperRef.current?.prev()}
                                        className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                                        aria-label="Previous"
                                    >
                                        <svg className="w-5 h-5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => setSelectedIndex(null)}
                                        className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                                        aria-label="Close"
                                    >
                                        <svg className="w-5 h-5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => swiperRef.current?.next()}
                                        className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                                        aria-label="Next"
                                    >
                                        <svg className="w-5 h-5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};
