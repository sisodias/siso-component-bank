// src/components/ui/component.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';

const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6H21M9 12H21M9 18H17" />
    <path d="M4.35355 6.35355C4.25979 6.44732 4.13261 6.5 4 6.5C3.86739 6.5 3.74021 6.44732 3.64645 6.35355C3.55268 6.25979 3.5 6.13261 3.5 6C3.5 5.86739 3.55268 5.74021 3.64645 5.64645C3.74021 5.55268 3.86739 5.5 4 5.5C4.13261 5.5 4.25979 5.55268 4.35355 5.64645C4.44732 5.74021 4.5 5.86739 4.5 6C4.5 6.13261 4.44732 6.25979 4.35355 6.35355Z" />
    <path d="M4.35355 12.3536C4.25979 12.4473 4.13261 12.5 4 12.5C3.86739 12.5 3.74021 12.4473 3.64645 12.3536C3.55268 12.2598 3.5 12.1326 3.5 12C3.5 11.8674 3.55268 11.7402 3.64645 11.6464C3.74021 11.5527 3.86739 11.5 4 11.5C4.13261 11.5 4.25979 11.5527 4.35355 11.6464C4.44732 11.7402 4.5 11.8674 4.5 12C4.5 12.1326 4.44732 12.2598 4.35355 12.3536Z" />
    <path d="M4.35355 18.3536C4.25979 18.4473 4.13261 18.5 4 18.5C3.86739 18.5 3.74021 18.4473 3.64645 18.3536C3.55268 18.2598 3.5 18.1326 3.5 18C3.5 17.8674 3.55268 17.7402 3.64645 17.6464C3.74021 17.5527 3.86739 17.5 4 17.5C4.13261 17.5 4.25979 17.5527 4.35355 17.6464C4.44732 17.7402 4.5 17.8674 4.5 18C4.5 18.1326 4.44732 18.2598 4.35355 18.3536Z" />
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.6252 13.5762H6.3752C5.38108 13.5762 4.5752 14.3821 4.5752 15.3762V17.6262C4.5752 18.6203 5.38108 19.4262 6.3752 19.4262H8.6252C9.61931 19.4262 10.4252 18.6203 10.4252 17.6262V15.3762C10.4252 14.3821 9.61931 13.5762 8.6252 13.5762Z" />
    <path d="M17.6252 13.5762H15.3752C14.3811 13.5762 13.5752 14.3821 13.5752 15.3762V17.6262C13.5752 18.6203 14.3811 19.4262 15.3752 19.4262H17.6252C18.6193 19.4262 19.4252 18.6203 19.4252 17.6262V15.3762C19.4252 14.3821 18.6193 13.5762 17.6252 13.5762Z" />
    <path d="M8.6252 4.57617H6.3752C5.38108 4.57617 4.5752 5.38206 4.5752 6.37617V8.62617C4.5752 9.62028 5.38108 10.4262 6.3752 10.4262H8.6252C9.61931 10.4262 10.4252 9.62028 10.4252 8.62617V6.37617C10.4252 5.38206 9.61931 4.57617 8.6252 4.57617Z" />
    <path d="M17.6252 4.57617H15.3752C14.3811 4.57617 13.5752 5.38206 13.5752 6.37617V8.62617C13.5752 9.62028 14.3811 10.4262 15.3752 10.4262H17.6252C18.6193 10.4262 19.4252 9.62028 19.4252 8.62617V6.37617C19.4252 5.38206 18.6193 4.57617 17.6252 4.57617Z" />
  </svg>
);

const buttonsData = [
    { id: 1, icon: <ListIcon /> },
    { id: 2, icon: <GridIcon /> },
];

export function InteractiveNav() {
    const mainRef = useRef<HTMLElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const lightRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<(HTMLDivElement | null)[]>([]);
    const buttonLightsRefs = useRef<(HTMLDivElement | null)[]>([]);
    
    const [buttonStates, setButtonStates] = useState(
        buttonsData.map(() => ({ hover: false, press: false }))
    );

    useEffect(() => {
        const nav = navRef.current;
        const light = lightRef.current;
        const buttons = buttonRefs.current.filter(Boolean) as HTMLDivElement[];
        const allButtonLights = buttonLightsRefs.current.filter(Boolean) as HTMLDivElement[];

        if (!nav || !light || buttons.length === 0 || allButtonLights.length === 0) return;

        const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
        const easeInQuad = (t: number) => t * t;

        const calculateShadow = (event: MouseEvent) => {
            const rect = nav.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = event.clientX - centerX;
            const deltaY = event.clientY - centerY;
            const angle = Math.atan2(deltaY, deltaX);
            const maxOffset = 3;
            const detectionRadius = rect.width * 2;
            const distance = Math.min(maxOffset, Math.sqrt(deltaX ** 2 + deltaY ** 2) / detectionRadius * maxOffset);
            const offsetX = Math.cos(angle) * distance;
            const offsetY = Math.sin(angle) * distance;
            return { x: -offsetX, y: -offsetY };
        };

        const calculateIntensity = (event: MouseEvent, innerRadius: number, outerRadius: number) => {
            const rect = nav.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = event.clientX - centerX;
            const deltaY = event.clientY - centerY;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
            let intensity = 0;
            if (distance > innerRadius && distance <= outerRadius) {
                intensity = (distance - innerRadius) / (outerRadius - innerRadius);
            } else if (distance > outerRadius) {
                intensity = 1;
            } else if (distance <= innerRadius) {
                intensity = 0;
            }
            return intensity;
        };

        const calculateAngle = (element: HTMLElement, cursorX: number, cursorY: number) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(cursorY - centerY, cursorX - centerX) * (180 / Math.PI);
            return (angle + 180) % 360;
        };
        
        const handleMouseMove = (event: MouseEvent) => {
            const x = event.clientX;
            const y = event.clientY;
            
            light.style.transform = `translate(${x}px,${y}px)`;

            const s = calculateShadow(event);
            nav.style.boxShadow = `
                ${s.x * 2.6}px ${s.y * 2.6}px 1.5px rgba(0, 0, 0, 0.081),
                ${s.x * 5.8}px ${s.y * 5.8}px 3.4px rgba(0, 0, 0, 0.12),
                ${s.x * 9.8}px ${s.y * 9.8}px 5.6px rgba(0, 0, 0, 0.15),
                ${s.x * 14.8}px ${s.y * 14.8}px 8.5px rgba(0, 0, 0, 0.174),
                ${s.x * 21.3}px ${s.y * 21.3}px 12.3px rgba(0, 0, 0, 0.195),
                ${s.x * 30.1}px ${s.y * 30.1}px 17.4px rgba(0, 0, 0, 0.216),
                ${s.x * 42.7}px ${s.y * 42.7}px 24.6px rgba(0, 0, 0, 0.24),
                ${s.x * 62.1}px ${s.y * 62.1}px 35.8px rgba(0, 0, 0, 0.27),
                ${s.x * 95.6}px ${s.y * 95.6}px 55.1px rgba(0, 0, 0, 0.309),
                ${s.x * 170}px ${s.y * 170}px 98px rgba(0, 0, 0, 0.39)
            `;

            const lightRadius = 400;
            const opacity = easeInQuad(calculateIntensity(event, lightRadius / 3, lightRadius * 1.3));
            allButtonLights.forEach(el => {
                if(el) el.style.opacity = opacity.toString();
            });

            buttons.forEach((item) => {
                const angle = calculateAngle(item, x, y);
                const scaleY = 10 - easeOutQuint(calculateIntensity(event, 0, lightRadius * 1.4)) * 10;
                const bg = item.querySelector('.button-bg') as HTMLImageElement;
                if (bg) {
                    bg.style.transform = `rotateZ(${angle}deg) scaleY(${scaleY})`;
                }
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const updateButtonState = (index: number, state: Partial<{ hover: boolean; press: boolean }>) => {
        setButtonStates(current =>
            current.map((s, i) => (i === index ? { ...s, ...state } : s))
        );
    };
    
    return (
        <main ref={mainRef}>
            <div className="nav" ref={navRef}>
                {buttonsData.map((button, index) => {
                    const state = buttonStates[index];
                    const className = `button ${state.hover ? 'hover' : ''} ${state.press ? 'press' : ''}`;
                    
                    return (
                        <div
                            key={button.id}
                            ref={el => { buttonRefs.current[index] = el; }}
                            className={className}
                            onMouseEnter={() => updateButtonState(index, { hover: true })}
                            onMouseLeave={() => updateButtonState(index, { hover: false, press: false })}
                            onMouseDown={() => updateButtonState(index, { press: true })}
                            onMouseUp={() => updateButtonState(index, { press: false })}
                            onTouchStart={() => updateButtonState(index, { press: true })}
                            onTouchEnd={() => setTimeout(() => updateButtonState(index, { press: false }), 300)}
                        >
                            <img className="button-bg" src="https://cdn.prod.website-files.com/65cceef869e5a56037c32801/672080ee3e9942d6e0617400_Rectangle%201002.png" alt="" />
                            <div className="frame">
                                {button.icon}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="light" ref={lightRef}></div>

            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    ref={el => { buttonLightsRefs.current[i] = el; }}
                    className={`button-light ${i > 0 ? 'glare' : ''}`}
                    style={i > 0 ? { filter: `blur(${Math.pow((i - 1) * 1.5, 2)}px)` } : {}}
                >
                    {buttonsData.map(button => (
                        <div key={button.id}>
                            {button.icon}
                        </div>
                    ))}
                </div>
            ))}
        </main>
    );
}