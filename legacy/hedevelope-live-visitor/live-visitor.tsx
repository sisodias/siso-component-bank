import { cn } from "../_utils/cn";

import { useState, useEffect, useRef } from 'react';
import { MotionValue, motion, useSpring, useTransform } from 'motion/react';
import '@/index.css';

const AVATARS: string[] = [
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Technologist.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Student.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Mechanic.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Student.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Teacher.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Technologist.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Person%20With%20Blond%20Hair.png"
];

const AVATAR_COLORS: string[] = ['#dbeafe', '#dcfce7', '#fce7f3', '#ffedd5', '#f3f4f6'];

interface AvatarConfig {
    displayLimit: number;
    showPlus: boolean;
}

interface DigitPlaceProps {
    place: number;
    value: number;
}

const LiveVisitorCounter = () => {
    const [visitorCount, setVisitorCount] = useState<number>(135);
    const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({ displayLimit: 3, showPlus: false });

    useEffect(() => {
        const baseVisitors = 135;
        const baseAvatars = 5;
        const visitorsAboveBase = visitorCount - baseVisitors;
        const additionalAvatars = Math.floor(visitorsAboveBase / 3);
        const calculatedLimit = baseAvatars + additionalAvatars;
        const displayLimit = Math.max(1, Math.min(calculatedLimit, 5));
        const showPlus = calculatedLimit > 5;

        setAvatarConfig({ displayLimit, showPlus });
    }, [visitorCount]);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisitorCount(prev => {
                const change = Math.floor(Math.random() * 11) - 5;
                const newCount = prev + change;
                return Math.max(105, Math.min(140, newCount));
            });
        }, 1660);

        return () => clearInterval(interval);
    }, []);

    const DigitPlace: React.FC<DigitPlaceProps> = ({ place, value }) => {
        const [offset, setOffset] = useState<number>(0);
        const targetRef = useRef<number>(0);
        const currentRef = useRef<number>(0);

        useEffect(() => {
            const valueRoundedToPlace = Math.floor(value / place);
            targetRef.current = valueRoundedToPlace % 10;

            // Smooth transition using requestAnimationFrame
            let animationFrame: number;
            const animate = () => {
                const diff = targetRef.current - currentRef.current;
                if (Math.abs(diff) > 0.01) {
                    currentRef.current += diff * 0.15; // Smooth easing
                    setOffset(currentRef.current);
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    currentRef.current = targetRef.current;
                    setOffset(targetRef.current);
                }
            };

            animationFrame = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(animationFrame);
        }, [value, place]);

        const shouldDisplay = value >= place;

        if (!shouldDisplay) return null;

        return (
            <div className="digit-place">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                    let digitOffset = (10 + num - offset) % 10;
                    let translateY = digitOffset * 20;

                    if (digitOffset > 5) {
                        translateY -= 10 * 20;
                    }

                    return (
                        <span
                            key={num}
                            className="digit-number"
                            style={{
                                transform: `translateY(${translateY}px)`,
                                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}
                        >
                            {num}
                        </span>
                    );
                })}
            </div>
        );
    };

    const visibleAvatars = AVATARS.slice(0, avatarConfig.displayLimit);

    return (
        <div className="visitor-card">
            <div className="header">
                <span className="label">Live Visitors</span>
                <span className="pulse-dot">
                    <span className="pulse-ring"></span>
                    <span className="pulse-core"></span>
                </span>
            </div>

            <div className="content">
                <div className="counter">
                    {[10000, 1000, 100, 10, 1].map(place => (
                        <DigitPlace key={place} place={place} value={visitorCount} />
                    ))}
                </div>

                <div className="avatar-stack">
                    {visibleAvatars.map((url, index) => (
                        <div
                            key={index}
                            className="avatar avatar-enter"
                            style={{
                                zIndex: 10 + index,
                                backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
                                animationDelay: `${index * 120}ms`
                            }}
                        >
                            <img src={url} alt={`Visitor ${index}`} />
                        </div>
                    ))}
                    {avatarConfig.showPlus && (
                        <div className="avatar-plus avatar-enter" style={{ zIndex: 20 }}>
                            <span>+</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveVisitorCounter;