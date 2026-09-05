"use client";

import { useEffect, useRef } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  z: number; // Depth coordinate for 3D effect
  velocityX: number;
  velocityY: number;
  velocityZ: number; // Velocity towards viewer
  rotation: number;
  rotationSpeed: number;
  baseSize: number;
  opacity: number;
  shape: 'rectangle' | 'circle' | 'star' | 'diamond';
  color: string;
  // Random movement properties
  floatPhase: number;
  swayAmplitude: number;
  bobAmplitude: number;
  // Fade properties
  fadeStart: number;
  isFading: boolean;
}

export default function ConfettiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const confettiRef = useRef<ConfettiPiece[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // White color variations for confetti
    const whiteColors = [
      'rgba(255, 255, 255, 0.9)',
      'rgba(248, 250, 252, 0.8)',
      'rgba(241, 245, 249, 0.9)',
      'rgba(226, 232, 240, 0.8)',
      'rgba(203, 213, 225, 0.7)',
    ];

    // Initialize confetti pieces
    const initConfetti = () => {
      confettiRef.current = [];
      for (let i = 0; i < 180; i++) {
        confettiRef.current.push({
          // Start from entire top area and some sides to cover full screen
          x: -canvas.width * 0.2 + Math.random() * canvas.width * 1.4,
          y: -Math.random() * canvas.height * 0.3,
          z: Math.random() * 1500 + 800, // Start further back
          velocityX: (Math.random() - 0.5) * 0.6, // Random horizontal movement
          velocityY: Math.random() * 0.3 + 0.1, // Downward movement
          velocityZ: -(Math.random() * 0.6 + 0.3), // Approach toward viewer
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.04, // Rotation
          baseSize: Math.random() * 12 + 6,
          opacity: 1,
          shape: ['rectangle', 'circle', 'star', 'diamond'][Math.floor(Math.random() * 4)] as 'rectangle' | 'circle' | 'star' | 'diamond',
          color: whiteColors[Math.floor(Math.random() * whiteColors.length)],
          // Add random movement properties
          floatPhase: Math.random() * Math.PI * 2,
          swayAmplitude: Math.random() * 0.5 + 0.2,
          bobAmplitude: Math.random() * 0.3 + 0.1,
          // Fade properties
          fadeStart: 0,
          isFading: false,
        });
      }
    };

    // Draw confetti piece with 3D perspective
    const drawConfetti = (piece: ConfettiPiece) => {
      // Calculate perspective scale based on z-depth
      const perspective = 800;
      const scale = perspective / (perspective + piece.z);
      const projectedX = piece.x + (piece.x - canvas.width / 2) * (1 - scale);
      const projectedY = piece.y + (piece.y - canvas.height / 2) * (1 - scale);
      
      // Skip drawing if too far or too close
      if (scale <= 0.01 || scale > 2) return;
      
      const size = piece.baseSize * scale;
      const opacity = Math.min(piece.opacity * scale * 1.5, 1);
      
      ctx.save();
      ctx.translate(projectedX, projectedY);
      ctx.rotate(piece.rotation);
      ctx.globalAlpha = opacity;
      
      // Add depth-based shadow
      const shadowIntensity = Math.min(scale * 0.3, 0.2);
      ctx.shadowColor = `rgba(0, 0, 0, ${shadowIntensity})`;
      ctx.shadowBlur = scale * 4;
      ctx.shadowOffsetX = scale * 3;
      ctx.shadowOffsetY = scale * 3;

      ctx.fillStyle = piece.color;

      switch (piece.shape) {
        case 'rectangle':
          // Traditional confetti rectangle (paper strip)
          const width = size * 1.5;
          const height = size * 0.8;
          ctx.fillRect(-width / 2, -height / 2, width, height);
          break;
        case 'circle':
          // Round confetti dot
          ctx.beginPath();
          ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'star':
          // 6-pointed star confetti
          ctx.beginPath();
          const starSize = size * 0.7;
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * starSize;
            const y = Math.sin(angle) * starSize;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            
            const innerAngle = ((i + 0.5) * Math.PI) / 3;
            const innerX = Math.cos(innerAngle) * starSize * 0.5;
            const innerY = Math.sin(innerAngle) * starSize * 0.5;
            ctx.lineTo(innerX, innerY);
          }
          ctx.closePath();
          ctx.fill();
          break;
        case 'diamond':
          // Diamond/rhombus confetti
          ctx.beginPath();
          const diamondSize = size * 0.8;
          ctx.moveTo(0, -diamondSize);
          ctx.lineTo(diamondSize * 0.6, 0);
          ctx.lineTo(0, diamondSize);
          ctx.lineTo(-diamondSize * 0.6, 0);
          ctx.closePath();
          ctx.fill();
          break;
      }

      ctx.restore();
    };

    // Update confetti positions with 3D movement toward bottom left
    const updateConfetti = () => {
      confettiRef.current.forEach((piece) => {
        // Update float phase for organic movement
        piece.floatPhase += 0.02;
        
        // Apply random floating motion
        const swayX = Math.sin(piece.floatPhase) * piece.swayAmplitude * 0.3;
        const bobY = Math.cos(piece.floatPhase * 0.7) * piece.bobAmplitude * 0.2;
        
        // Update 3D position with much slower movement and random floating
        piece.x += piece.velocityX + swayX;
        piece.y += piece.velocityY + bobY;
        piece.z += piece.velocityZ;
        piece.rotation += piece.rotationSpeed;

        // Add more random turbulence for organic movement
        const turbulence = Math.max(0, 1 - piece.z / 1500) * 0.08;
        piece.velocityX += (Math.random() - 0.5) * turbulence * 0.5;
        piece.velocityY += (Math.random() - 0.5) * turbulence * 0.5;
        
        // Add continuous random drift
        piece.velocityX += (Math.random() - 0.5) * 0.005;
        piece.velocityY += (Math.random() - 0.5) * 0.005;
        
        // Apply air resistance to velocities for more natural movement
        piece.velocityX *= 0.999;
        piece.velocityY *= 0.999;
        
        // Very gentle downward bias but allow horizontal spread
        piece.velocityY += 0.0005;

        // Gradually increase speed as pieces get closer (perspective effect) - much slower
        piece.velocityZ *= 1.0005;

        // Start fading when close to exit points (expanded boundaries)
        if (!piece.isFading && (piece.z <= 200 || piece.x < -150 || piece.x > canvas.width + 150 || piece.y > canvas.height + 150)) {
          piece.isFading = true;
          piece.fadeStart = piece.opacity;
        }
        
        // Apply fade effect
        if (piece.isFading) {
          piece.opacity -= 0.02;
        }

        // Reset confetti when fully faded
        if (piece.opacity <= 0) {
          // Respawn from entire top area to cover full screen
          piece.x = -canvas.width * 0.2 + Math.random() * canvas.width * 1.4;
          piece.y = -Math.random() * canvas.height * 0.3;
          piece.z = Math.random() * 800 + 1200;
          piece.velocityX = (Math.random() - 0.5) * 0.6;
          piece.velocityY = Math.random() * 0.3 + 0.1;
          piece.velocityZ = -(Math.random() * 0.6 + 0.3);
          piece.floatPhase = Math.random() * Math.PI * 2;
          piece.opacity = 1;
          piece.isFading = false;
          piece.fadeStart = 0;
        }
      });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      updateConfetti();
      confettiRef.current.forEach(drawConfetti);

      animationRef.current = requestAnimationFrame(animate);
    };

    initConfetti();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'transparent',
      }}
    />
  );
}