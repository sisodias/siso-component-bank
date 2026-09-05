import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cardData } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface CardProps {
    id: number;
    title: string;
    description: string;
    index: number;
    totalCards: number;
    color: string;
}

const Card: React.FC<CardProps> = ({ title, description, index, totalCards, color }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        const container = containerRef.current;
        if (!card || !container) return;

        const targetScale = 1 - (totalCards - index) * 0.05;

        // Set initial state
        gsap.set(card, {
            scale: 1,
            transformOrigin: "center top"
        });

        // Create scroll trigger for stacking effect (similar to the reference component)
        ScrollTrigger.create({
            trigger: container,
            start: "top center",
            end: "bottom center",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const scale = gsap.utils.interpolate(1, targetScale, progress);

                gsap.set(card, {
                    scale: Math.max(scale, targetScale),
                    transformOrigin: "center top"
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [index, totalCards]);

    return (
        <div
            ref={containerRef}
            style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'sticky',
                top: 0
            }}
        >
            <div
                ref={cardRef}
                style={{
                    position: 'relative',
                    width: '70%',
                    height: '450px',
                    borderRadius: '24px',
                    isolation: 'isolate',
                    top: `calc(-5vh + ${index * 25}px)`,
                    transformOrigin: 'top'
                }}
                className="card-content"
            >
                {/* Neumorphic Background Card */}
                <div className="neumorphic-card" />

                {/* Electric Border Effect */}
                <div
                    style={{
                        position: 'absolute',
                        inset: '-2px',
                        borderRadius: '26px',
                        padding: '2px',
                        background: `conic-gradient(
                            from 0deg,
                            transparent 0deg,
                            ${color.replace('0.8', '0.3')} 60deg,
                            ${color.replace('0.8', '0.2')} 120deg,
                            transparent 180deg,
                            ${color.replace('0.8', '0.15')} 240deg,
                            transparent 360deg
                        )`,
                        zIndex: 1,
                        opacity: 0.6
                    }}
                />

                {/* Main Card Content with Apple Liquid Glass Effect */}
                <div 
                    className="liquid-glass-card"
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '2rem',
                        background: `
                            linear-gradient(135deg, 
                                rgba(255, 255, 255, 0.12) 0%,
                                rgba(255, 255, 255, 0.06) 50%,
                                rgba(255, 255, 255, 0.02) 100%
                            )
                        `,
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.125)',
                        borderRadius: '24px',
                        boxShadow: `
                            0 25px 50px rgba(0, 0, 0, 0.25),
                            0 0 0 1px rgba(255, 255, 255, 0.05),
                            inset 0 1px 0 rgba(255, 255, 255, 0.1),
                            inset 0 -1px 0 rgba(255, 255, 255, 0.05)
                        `,
                        overflow: 'hidden'
                    }}>
                    {/* Apple Liquid Glass Reflections */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                        pointerEvents: 'none',
                        borderRadius: '24px 24px 0 0',
                        animation: 'liquidFlow 4s ease-in-out infinite'
                    }} />

                    {/* Liquid shine effect */}
                    <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        right: '8px',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.9) 50%, transparent 100%)',
                        borderRadius: '0.5px',
                        pointerEvents: 'none'
                    }} />

                    {/* Dynamic liquid edge glow */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '1px',
                        height: '100%',
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                        borderRadius: '24px 0 0 24px',
                        pointerEvents: 'none'
                    }} />

                    {/* Liquid texture pattern */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `
                            radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.12) 1px, transparent 2px),
                            radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.08) 1px, transparent 2px),
                            radial-gradient(circle at 50% 50%, rgba(120, 219, 255, 0.06) 1px, transparent 2px)
                        `,
                        backgroundSize: '40px 40px, 30px 30px, 50px 50px',
                        pointerEvents: 'none',
                        borderRadius: '24px',
                        opacity: 0.4,
                        animation: 'shimmer 6s ease-in-out infinite'
                    }} />

                    {/* Content */}
                    <div className="card-content" style={{ position: 'relative', zIndex: 2 }}>
                        <h3 className="card-title">{title}</h3>
                        <p className="card-description">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const StackedCards: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        gsap.fromTo(container,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1.2,
                ease: "power2.out"
            }
        );
    }, []);

    return (
        <main ref={containerRef} style={{ background: 'transparent' }}>
            {/* Hero Section */}
            <section style={{
                height: '70vh',
                width: '100%',
                display: 'grid',
                placeContent: 'center',
                position: 'relative',
                color: '#2c3e50'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
                        linear-gradient(to right, rgba(150, 150, 150, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(150, 150, 150, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '54px 54px',
                    maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
                    opacity: 0.3
                }} />
                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    fontWeight: '600',
                    textAlign: 'center',
                    lineHeight: '1.2',
                    padding: '0 2rem',
                    position: 'relative',
                    zIndex: 1,
                    textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
                }}>
                    Liquid Glass & Neumorphic Cards <br /> Scroll down! 👇
                </h1>
            </section>

            {/* Cards Section */}
            <section style={{
                color: '#2c3e50',
                width: '100%'
            }}>
                {cardData.map((card, index) => {
                    const targetScale = 1 - (cardData.length - index) * 0.05;
                    return (
                        <Card
                            key={card.id}
                            id={card.id}
                            title={card.title}
                            description={card.description}
                            index={index}
                            totalCards={cardData.length}
                            color={card.color}
                        />
                    );
                })}
            </section>
        </main>
    );
};
