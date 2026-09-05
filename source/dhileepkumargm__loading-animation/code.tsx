import React, { useEffect, useRef } from 'react';

export const KineticTypographyLoader = () => {
    const loaderTextRef = useRef(null);
    const words = ["LOADING", "ASSEMBLING", "FINALIZING"];
    let currentWordIndex = 0;

    useEffect(() => {
        const loaderText = loaderTextRef.current;
        if (!loaderText) return;

        let animationTimeout;
        let wordCycleTimeout;

        function animateWord() {
            const word = words[currentWordIndex];
            loaderText.innerHTML = ''; // Clear previous word

            const chars = word.split('').map((char, index) => {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char;
                
                const fromX = (Math.random() - 0.5) * 800;
                const fromY = (Math.random() - 0.5) * 800;
                const fromZ = (Math.random() - 0.5) * 800;
                const fromRotX = (Math.random() - 0.5) * 360;
                const fromRotY = (Math.random() - 0.5) * 360;
                span.style.setProperty('--transform-from', `translate3d(${fromX}px, ${fromY}px, ${fromZ}px) rotateX(${fromRotX}deg) rotateY(${fromRotY}deg)`);
                
                span.style.animationName = 'fly-in';
                span.style.animationDelay = `${index * 0.05}s`;
                span.style.animationPlayState = 'running';
                
                loaderText.appendChild(span);
                return span;
            });

            animationTimeout = setTimeout(() => {
                chars.forEach((span, index) => {
                    const toX = (Math.random() - 0.5) * 800;
                    const toY = (Math.random() - 0.5) * 800;
                    const toZ = (Math.random() - 0.5) * 800;
                    const toRotX = (Math.random() - 0.5) * 360;
                    const toRotY = (Math.random() - 0.5) * 360;
                    span.style.setProperty('--transform-to', `translate3d(${toX}px, ${toY}px, ${toZ}px) rotateX(${toRotX}deg) rotateY(${toRotY}deg)`);

                    span.style.animationName = 'fly-out';
                    span.style.animationDelay = `${(chars.length - index) * 0.05}s`;
                });
            }, 2500);

            wordCycleTimeout = setTimeout(() => {
                currentWordIndex = (currentWordIndex + 1) % words.length;
                animateWord();
            }, 3500);
        }

        animateWord();

        // Cleanup function to clear timeouts when the component unmounts
        return () => {
            clearTimeout(animationTimeout);
            clearTimeout(wordCycleTimeout);
        };
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="loader-container">
            <h1 ref={loaderTextRef} className="text-4xl sm:text-6xl lg:text-8xl font-extrabold text-white whitespace-nowrap">
            </h1>
        </div>
    );
};
