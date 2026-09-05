import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * TYPES & INTERFACES
 */
export interface NavItem {
    label: string;
    href: string;
}

export interface ReactiveDockProps {
    items?: NavItem[];
    className?: string;
}

type DockPosition = "top" | "bottom";

interface DragState {
    x: number;
    y: number;
}

/**
 * CUSTOM HOOK: useDockDrag
 * Manages the dragging logic, position state, and window event listeners.
 */
const useDockDrag = (isOpen: boolean, initialPosition: DockPosition = "bottom") => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState<DockPosition>(initialPosition);
    const [offset, setOffset] = useState<DragState>({ x: 0, y: 0 });
    const startPos = useRef<DragState>({ x: 0, y: 0 });

    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (isOpen) return;

        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        startPos.current = {
            x: clientX - offset.x,
            y: clientY - offset.y
        };
    }, [isOpen, offset.x, offset.y]);

    const handleDragUpdate = useCallback((clientX: number, clientY: number) => {
        if (!isDragging) return;

        const dx = clientX - startPos.current.x;
        const dy = clientY - startPos.current.y;

        // Constraint horizontal movement
        const maxX = window.innerWidth / 2 - 40;
        const clampedX = Math.max(-maxX, Math.min(maxX, dx));

        setOffset({ x: clampedX, y: dy });
    }, [isDragging]);

    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);

        const vh = window.innerHeight;
        const currentY = offset.y;
        const absoluteY = position === "bottom" ? vh - 60 + currentY : 60 + currentY;

        // Snap to top or bottom
        setPosition(absoluteY < vh / 2 ? "top" : "bottom");
        setOffset({ x: 0, y: 0 });
    }, [isDragging, offset.y, position]);

    useEffect(() => {
        if (!isDragging) return;

        const onMove = (e: MouseEvent | TouchEvent) => {
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
            handleDragUpdate(clientX, clientY);
        };

        const onEnd = () => handleDragEnd();

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onEnd);
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("touchend", onEnd);

        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onEnd);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onEnd);
        };
    }, [isDragging, handleDragUpdate, handleDragEnd]);

    return {
        isDragging,
        position,
        offset,
        handleDragStart
    };
};

/**
 * INTERNAL COMPONENT: DockMenu
 * Renders the fullscreen navigation menu.
 */
const DockMenu = ({
    id,
    isOpen,
    items,
    position
}: {
    id: string;
    isOpen: boolean;
    items: NavItem[];
    position: DockPosition
}) => {
    return (
        <div
            id={id}
            className={cn(
                "fixed inset-0 z-40 bg-white flex items-center justify-center transition-all duration-300 ease-out",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            style={{ transitionDelay: isOpen ? "0ms" : "200ms" }}
            aria-hidden={!isOpen}
        >
            <nav className="flex flex-col gap-4 items-center" role="navigation">
                {items.map((item, index) => (
                    <a
                        key={`${item.label}-${index}`}
                        href={item.href}
                        className={cn(
                            "font-black text-4xl md:text-5xl uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all text-black decoration-none",
                            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                        style={{
                            transitionDelay: isOpen
                                ? `${50 + index * 40}ms`
                                : `${(items.length - 1 - index) * 30}ms`,
                            transitionDuration: "300ms"
                        }}
                    >
                        {item.label}
                    </a>
                ))}
            </nav>

            <button
                type="button"
                className={cn(
                    "absolute w-14 h-14 rounded-full border-4 border-black bg-white flex items-center justify-center font-bold text-lg shadow-neo hover:scale-110 transition-all text-black",
                    position === "bottom" ? "top-8" : "bottom-8",
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
                )}
                style={{
                    transitionDelay: isOpen ? "250ms" : "0ms",
                    transitionDuration: "200ms"
                }}
            >
                EN
            </button>
        </div>
    );
};

/**
 * INTERNAL COMPONENT: DockButton
 * The interactive floating button that toggles the menu.
 */
const DockButton = ({
    isOpen,
    onClick,
    onDragStart,
    isDragging,
    offset,
    position,
    ariaControls
}: {
    isOpen: boolean;
    onClick: () => void;
    onDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
    isDragging: boolean;
    offset: DragState;
    position: DockPosition;
    ariaControls: string;
}) => {
    // We memoize the transform to avoid unnecessary recalculations during non-drag states
    const transformStyle = useMemo(() => {
        if (isOpen) return "translate(-50%, 0)";
        return `translate(calc(-50% + ${offset.x}px), ${offset.y}px)`;
    }, [isOpen, offset.x, offset.y]);

    return (
        <div
            style={{ transform: transformStyle }}
            className={cn(
                "fixed left-1/2 z-50",
                position === "bottom" ? "bottom-8" : "top-8",
                isDragging ? "transition-none" : "transition-transform duration-300 ease-out"
            )}
        >
            <button
                type="button"
                onClick={onClick}
                onMouseDown={onDragStart}
                onTouchStart={onDragStart}
                className={cn(
                    "w-16 h-16 rounded-full border-4 border-black bg-white flex items-center justify-center shadow-neo transition-transform duration-200 focus:outline-none",
                    !isOpen && "cursor-grab active:cursor-grabbing hover:scale-110",
                    isOpen && "active:scale-95"
                )}
                aria-expanded={isOpen}
                aria-controls={ariaControls}
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    strokeWidth="4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn(
                        "text-black w-8 h-8 transition-transform duration-300 ease-out",
                        isOpen ? "-rotate-45" : "rotate-0"
                    )}
                >
                    <path
                        className="transition-all duration-300 ease-out"
                        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                        style={{
                            strokeDasharray: isOpen ? "20 300" : "12 63",
                            strokeDashoffset: isOpen ? "-32.42px" : "0px",
                        }}
                    />
                    <path d="M7 16 27 16" />
                </svg>
            </button>
        </div>
    );
};

/**
 * EXPORTED COMPONENT: ReactiveDock
 * Main entry point for the component.
 */
export const Component = ({ items = [], className }: ReactiveDockProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuId = "reactive-dock-menu";

    const { isDragging, position, offset, handleDragStart } = useDockDrag(isOpen);

    const toggleMenu = useCallback(() => {
        setIsOpen((prev: boolean) => !prev);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <div className={className}>
            <DockMenu
                id={menuId}
                isOpen={isOpen}
                items={items}
                position={position}
            />

            <DockButton
                isOpen={isOpen}
                onClick={toggleMenu}
                onDragStart={handleDragStart}
                isDragging={isDragging}
                offset={offset}
                position={position}
                ariaControls={menuId}
            />
        </div>
    );
};
