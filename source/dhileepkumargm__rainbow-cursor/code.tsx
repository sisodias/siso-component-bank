"use client";

import React, { useRef, useEffect } from 'react';

/**
 * A React component that creates a "Rainbow Thunder God" cursor effect on a canvas.
 * It's self-contained and handles its own animation loop and event listeners.
 */
const RainbowCursor  = () => {
    // Ref for the canvas element
    const canvasRef = useRef(null);
    // Ref to store the animation frame ID for cleanup
    const animationFrameId = useRef(null);

    useEffect(() => {
        // This effect runs once when the component mounts
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // --- Global State ---
        let particles = [];
        let lightning = [];
        let mouse = { x: null, y: null };
        let flashAlpha = 0;
        let hue = 0; // For the rainbow effect

        // --- Particle Class (Sparks) ---
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.speedX = Math.random() * 6 - 3;
                this.speedY = Math.random() * 6 - 3;
                this.size = Math.random() * 3 + 1;
                // Use the global hue for rainbow colors
                this.color = `hsl(${hue}, 100%, 70%)`;
                this.life = 1;
                this.decay = Math.random() * 0.04 + 0.01;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.speedX *= 0.97;
                this.speedY *= 0.97;
                if (this.size > 0.2) this.size -= 0.1;
                this.life -= this.decay;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.life;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // --- Lightning Bolt Class ---
        class Lightning {
            constructor(startX, startY, endX, endY) {
                this.startX = startX;
                this.startY = startY;
                this.endX = endX;
                this.endY = endY;
                this.segments = this.createSegments();
                this.life = 1;
            }

            // Creates a jagged, branching path for the lightning
            createSegments() {
                const segments = [];
                let currentX = this.startX;
                let currentY = this.startY;
                const dx = this.endX - this.startX;
                const dy = this.endY - this.startY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const segmentCount = Math.floor(distance / 10);

                for (let i = 1; i <= segmentCount; i++) {
                    const nextX = this.startX + (dx * i) / segmentCount + (Math.random() - 0.5) * 20;
                    const nextY = this.startY + (dy * i) / segmentCount + (Math.random() - 0.5) * 20;
                    segments.push({ x1: currentX, y1: currentY, x2: nextX, y2: nextY });
                    
                    // Add a random chance for a branch
                    if (Math.random() > 0.95) {
                        const branchX = nextX + (Math.random() - 0.5) * 100;
                        const branchY = nextY + (Math.random() - 0.5) * 100;
                        segments.push({ x1: nextX, y1: nextY, x2: branchX, y2: branchY });
                    }
                    
                    currentX = nextX;
                    currentY = nextY;
                }
                return segments;
            }
            
            update() {
                this.life -= 0.05; // Lightning fades quickly
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.life > 0 ? this.life : 0;
                // Use rainbow colors for the lightning
                ctx.strokeStyle = `hsl(${hue + Math.random() * 40}, 100%, 75%)`;
                ctx.lineWidth = Math.random() * 2 + 1;
                ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
                ctx.shadowBlur = 20;
                
                ctx.beginPath();
                this.segments.forEach(seg => {
                    ctx.moveTo(seg.x1, seg.y1);
                    ctx.lineTo(seg.x2, seg.y2);
                });
                ctx.stroke();
                ctx.restore();
            }
        }
        
        // --- Main Action Function ---
        function createThunderStrike() {
            flashAlpha = 1; // Trigger the screen flash
            const strikeCount = Math.floor(Math.random() * 5) + 3;
            
            for (let i = 0; i < strikeCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 200 + 150;
                const endX = mouse.x + Math.cos(angle) * radius;
                const endY = mouse.y + Math.sin(angle) * radius;
                lightning.push(new Lightning(mouse.x, mouse.y, endX, endY));
            }

            // Create a powerful particle explosion
            for (let i = 0; i < 150; i++) {
                let p = new Particle(mouse.x, mouse.y);
                p.speedX = (Math.random() - 0.5) * (Math.random() * 18);
                p.speedY = (Math.random() - 0.5) * (Math.random() * 18);
                p.size = Math.random() * 4 + 2;
                particles.push(p);
            }
        }

        // --- Event Handlers ---
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const handleMouseMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
            // Create a trail of sparks
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(mouse.x, mouse.y));
            }
        };

        const handleMouseDown = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
            createThunderStrike();
        };

        // --- Animation Loop ---
        const animate = () => {
            // Clear canvas with a semi-transparent background for a trail effect
            ctx.fillStyle = 'rgba(0, 0, 10, 0.2)';
            ctx.fillRect(0, 0, width, height);
            
            // Handle the screen flash effect on click
            if (flashAlpha > 0) {
                ctx.fillStyle = `rgba(200, 220, 255, ${flashAlpha})`;
                ctx.fillRect(0, 0, width, height);
                flashAlpha -= 0.05; // Fade out the flash
            }

            ctx.globalAlpha = 1;

            // Update and draw all particles
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].life <= 0) particles.splice(i, 1);
            }
            
            // Update and draw all lightning bolts
            for (let i = lightning.length - 1; i >= 0; i--) {
                lightning[i].update();
                lightning[i].draw();
                if (lightning[i].life <= 0) lightning.splice(i, 1);
            }
            
            // Draw the custom cursor
            if (mouse.x !== null) {
                const cursorColor = `hsl(${hue}, 100%, 85%)`;
                ctx.fillStyle = cursorColor;
                ctx.shadowColor = cursorColor;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0; // Reset shadow for other elements
            }
            
            // Cycle through the rainbow
            hue = (hue + 1) % 360;

            animationFrameId.current = requestAnimationFrame(animate);
        };

        // --- Setup and Teardown ---
        window.addEventListener('resize', handleResize);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);

        animate(); // Start the animation loop

        // Cleanup function to run when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []); // Empty dependency array means this effect runs only once

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export {RainbowCursor};