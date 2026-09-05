import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, ReactNode } from 'react';


class Spring {
    current: number;
    target: number;
    velocity: number;
    stiffness: number;
    damping: number;
    lastTime: number;

    constructor(initialValue: number = 0, stiffness: number = 170, damping: number = 26) {
        this.current = initialValue;
        this.target = initialValue;
        this.velocity = 0;
        this.stiffness = stiffness;
        this.damping = damping;
        this.lastTime = performance.now();
    }

    set(target: number): void {
        this.target = target;
    }

    update(): number {
        const now = performance.now();
        const dt = Math.min((now - this.lastTime) / 1000, 0.1);
        this.lastTime = now;

        const force = this.stiffness * (this.target - this.current);
        const acceleration = force - this.damping * this.velocity;

        this.velocity += acceleration * dt;
        this.current += this.velocity * dt;

        if (Math.abs(this.velocity) < 0.01 && Math.abs(this.current - this.target) < 0.01) {
            this.current = this.target;
            this.velocity = 0;
        }

        return this.current;
    }
}

interface AnimatedCounterProps {
    value: number;
}

interface SpringData {
    place: number;
    spring: Spring;
}

const AnimatedCounter = ({ value }: AnimatedCounterProps) => {
    const places = [100000, 10000, 1000, 100, 10, 1];
    const springsRef = useRef<SpringData[] | null>(null);
    const [, setTick] = useState(0);

    useEffect(() => {
        springsRef.current = places.map(place => ({
            place,
            spring: new Spring(Math.floor(value / place))
        }));
    }, []);

    useEffect(() => {
        if (!springsRef.current) return;

        springsRef.current.forEach(({ spring, place }) => {
            spring.set(Math.floor(value / place));
        });

        const animate = () => {
            setTick(t => t + 1);
            requestAnimationFrame(animate);
        };

        const frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [value]);

    interface DigitColumnProps {
        place: number;
    }

    const DigitColumn = ({ place }: DigitColumnProps) => {
        const spring = springsRef.current?.find(s => s.place === place)?.spring;
        if (!spring) return null;

        const currentSpringValue = spring.update();
        const placeValue = currentSpringValue % 10;
        const shouldDisplay = value >= place || place === 1;

        if (!shouldDisplay) return null;

        return (
            <div className="digit-column">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                    let offset = (10 + num - placeValue) % 10;
                    let y = offset * 28;
                    if (offset > 5) {
                        y -= 10 * 28;
                    }

                    return (
                        <span
                            key={num}
                            className="digit-number"
                            style={{ transform: `translateY(${y}px)` }}
                        >
                            {num}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="counter-wrapper">
            {places.map(place => (
                <DigitColumn key={place} place={place} />
            ))}
        </div>
    );
};

interface Metric {
    label: string;
    count: number;
    icon: ReactNode;
}

export interface MetricCarouselProps {
    initialMetrics?: Metric[];
    rotationInterval?: number;
    updateInterval?: number;
}

const MetricCarousel = ({
    initialMetrics,
    rotationInterval = 3000,
    updateInterval = 2000
}: MetricCarouselProps) => {
    const defaultMetrics: Metric[] = [
        {
            label: "Total Likes",
            count: 132,
            icon: (
                <svg className="icon icon-red" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            )
        },
        {
            label: "Live Visitors",
            count: 345,
            icon: (
                <svg className="icon icon-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            )
        },
        {
            label: "Active Carts",
            count: 20,
            icon: (
                <svg className="icon icon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
            )
        }
    ];

    const [metrics, setMetrics] = useState<Metric[]>(initialMetrics || defaultMetrics);
    const [activeIndex, setActiveIndex] = useState(0);
    const cartUpdateCounterRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % metrics.length);
        }, rotationInterval);

        return () => clearInterval(interval);
    }, [metrics.length, rotationInterval]);

    useEffect(() => {
        const interval = setInterval(() => {
            cartUpdateCounterRef.current++;

            setMetrics(prev => prev.map((metric, i) => {
                if (i === 2 && cartUpdateCounterRef.current % 3 !== 0) {
                    return metric;
                }

                const change = Math.floor(Math.random() * 11) - 5;
                const newCount = Math.max(0, metric.count + change);
                return { ...metric, count: newCount };
            }));
        }, updateInterval);

        return () => clearInterval(interval);
    }, [updateInterval]);

    return (
        <div className="container">
            <div className="stack-wrapper">
                {metrics.map((metric, index) => (
                    <div
                        key={index}
                        className={`metric-card ${index === activeIndex ? 'active' : ''} ${index !== activeIndex && index === (activeIndex - 1 + metrics.length) % metrics.length ? 'exit' : ''
                            }`}
                    >
                        <div className="metric-content">
                            <div className="icon-box">
                                {metric.icon}
                            </div>
                            <div className="metric-info">
                                <p>{metric.label}</p>
                                <AnimatedCounter value={metric.count} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MetricCarousel;
