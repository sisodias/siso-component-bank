import {useEffect, useRef, useState} from "react";
import { cn } from "@/lib/utils";

class Pixel {
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    color: string;
    speed: number;
    size: number;
    sizeStep: number;
    minSize: number;
    maxSizeInteger: number;
    maxSize: number;
    delay: number;
    counter: number;
    counterStep: number;
    isIdle: boolean;
    isReverse: boolean;
    isShimmer: boolean;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, color: string, speed: number, delay: number) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = context;
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = this.getRandomValue(0.1, 0.9) * speed;
        this.size = 0;
        this.sizeStep = Math.random() * 0.4;
        this.minSize = 0.5;
        this.maxSizeInteger = 2;
        this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
        this.delay = delay;
        this.counter = 0;
        this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
        this.isIdle = false;
        this.isReverse = false;
        this.isShimmer = false;
    }

    getRandomValue(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    draw() {
        const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(
            this.x + centerOffset,
            this.y + centerOffset,
            this.size,
            this.size
        );
    }

    appear() {
        this.isIdle = false;
        if (this.counter <= this.delay) {
            this.counter += this.counterStep;
            return;
        }
        if (this.size >= this.maxSize) {
            this.isShimmer = true;
        }
        if (this.isShimmer) {
            this.shimmer();
        } else {
            this.size += this.sizeStep;
        }
        this.draw();
    }

    disappear() {
        this.isShimmer = false;
        this.counter = 0;
        if (this.size <= 0) {
            this.isIdle = true;
            return;
        } else {
            this.size -= 0.1;
        }
        this.draw();
    }

    shimmer() {
        if (this.size >= this.maxSize) {
            this.isReverse = true;
        } else if (this.size <= this.minSize) {
            this.isReverse = false;
        }
        if (this.isReverse) {
            this.size -= this.speed;
        } else {
            this.size += this.speed;
        }
    }
}

function getEffectiveSpeed(value: number, reducedMotion: boolean) {
    const min = 0;
    const max = 100;
    const throttle = 0.001;
    const parsed = value;

    if (parsed <= min || reducedMotion) {
        return min;
    } else if (parsed >= max) {
        return max * throttle;
    } else {
        return parsed * throttle;
    }
}

const VARIANTS = {
    default: {
        gap: 5,
        speed: 35,
        noFocus: false
    },
    blue: {
        gap: 10,
        speed: 25,
        noFocus: false
    },
    yellow: {
        gap: 3,
        speed: 20,
        noFocus: false
    },
    pink: {
        gap: 6,
        speed: 80,
        noFocus: true
    }
};

interface PixelCardProps {
    variant?: "default" | "blue" | "yellow" | "pink";
    gap?: number;
    speed?: number;
    className?: string;
    children: React.ReactNode;
}

interface VariantConfig {
    gap: number;
    speed: number;
    noFocus: boolean;
}

export const PixelCard = ({
    variant = "default",
    gap,
    speed,
    className = "",
    children
 }: PixelCardProps): JSX.Element => {

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pixelsRef = useRef<Pixel[]>([]);
    const animationRef = useRef<number | null>(null);
    const timePreviousRef = useRef(performance.now());
    const reducedMotion = useRef(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ).current;

    const [isActive, setIsActive] = useState(false);

    const variantCfg: VariantConfig = VARIANTS[variant] || VARIANTS.default;
    const finalGap = gap ?? variantCfg.gap;
    const finalSpeed = speed ?? variantCfg.speed;
    const finalNoFocus = variantCfg.noFocus;

    const initPixels = () => {
        if (!containerRef.current || !canvasRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);
        const ctx = canvasRef.current.getContext("2d");

        if (!ctx) {
            console.error("Canvas context not available.");
            return;
        }

        canvasRef.current.width = width;
        canvasRef.current.height = height;
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;

        const computedStyle = getComputedStyle(containerRef.current);
        const pixelActiveColor = computedStyle.getPropertyValue('--pixel-active-color').trim();

        const pxs: Pixel[] = [];
        for (let x = 0; x < width; x += finalGap) {
            for (let y = 0; y < height; y += finalGap) {
                const dx = x - width / 2;
                const dy = y - height / 2;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const delay = reducedMotion ? 0 : distance;
                
                pxs.push(
                    new Pixel(
                        canvasRef.current,
                        ctx,
                        x,
                        y,
                        pixelActiveColor,
                        getEffectiveSpeed(finalSpeed, reducedMotion),
                        delay
                    )
                );
            }
        }
        pixelsRef.current = pxs;
    };

    const doAnimate = (fnName: keyof Pixel) => {
        animationRef.current = requestAnimationFrame(() => doAnimate(fnName));
        const timeNow = performance.now();
        const timePassed = timeNow - timePreviousRef.current;
        const timeInterval = 1000 / 60;

        if (timePassed < timeInterval) {
            return;
        }
        timePreviousRef.current = timeNow - (timePassed % timeInterval);

        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx || !canvasRef.current) {
            return;
        }

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        let allIdle = true;
        for (let i = 0; i < pixelsRef.current.length; i++) {
            const pixel = pixelsRef.current[i];
            (pixel[fnName] as () => void)();
            if (!pixel.isIdle) {
                allIdle = false;
            }
        }
        if (allIdle) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };

    const handleAnimation = (name: keyof Pixel) => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        animationRef.current = requestAnimationFrame(() => doAnimate(name));
    };

    const onMouseEnter = () => {
        setIsActive(true);
        handleAnimation("appear");
    };
    const onMouseLeave = () => {
        setIsActive(false);
        handleAnimation("disappear");
    };
    const onFocus: React.FocusEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsActive(true);
        handleAnimation("appear");
    };
    const onBlur: React.FocusEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsActive(false);
        handleAnimation("disappear");
    };

    useEffect(() => {
        initPixels();
        const observer = new ResizeObserver(() => {
            initPixels();
        });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => {
            observer.disconnect();
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, [finalGap, finalSpeed]);

    return (
        <div
            ref={containerRef}
            className={cn(
                `pixel-card-container`,
                `h-[400px] w-[300px] relative overflow-hidden grid place-items-center aspect-[4/5] rounded-[25px] isolate select-none`,
                `transition-colors duration-200 ease-[cubic-bezier(0.5,1,0.89,1)]`,
                className
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={finalNoFocus ? undefined : onFocus}
            onBlur={finalNoFocus ? undefined : onBlur}
            tabIndex={finalNoFocus ? -1 : 0}
        >
            <style jsx>{`
              .pixel-card-container {
                --card-bg: black;
                --card-border: hsl(0 0% 15%);
                --pixel-active-color: hsl(0 0% 75%);
                --content-text-color: hsl(0 0% 75%);
              }
              
              .pixel-card-container {
                background-color: var(--card-bg);
                border: 1px solid var(--card-border);
              }

              html.dark .pixel-card-container {
                --card-bg: black;
                --card-border: hsl(0 0% 15%);
                --pixel-active-color: hsl(0 0% 75%);
                --content-text-color: hsl(0 0% 75%);
              }

              html:not(.dark) .pixel-card-container {
                --card-bg: white;
                --card-border: hsl(0 0% 85%);
                --pixel-active-color: hsl(0 0% 25%);
                --content-text-color: hsl(0 0% 25%);
              }
            `}</style>
            <canvas
                className="w-full h-full block absolute inset-0 z-0"
                ref={canvasRef}
            />
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-4 text-[var(--content-text-color)]">
                {children}
            </div>
        </div>
    );
}