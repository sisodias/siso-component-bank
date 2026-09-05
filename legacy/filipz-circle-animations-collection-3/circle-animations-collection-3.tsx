"use client";

import React, { useRef, useEffect } from "react";

// --- ANIMATION LOGIC ---
const MONOCHROME_FILL = (opacity: number) => `rgba(255, 255, 255, ${Math.max(0, Math.min(1, opacity))})`;

type AnimateFunction = (timestamp: number) => void;
type SetupFunction = (ctx: CanvasRenderingContext2D, width: number, height: number) => AnimateFunction;

const animationLogic = {
    pulseWave: ((ctx, CANVAS_WIDTH, CANVAS_HEIGHT) => {
        const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
        let time = 0, lastTime = 0;
        const dotRings = [{ radius: 15, count: 6 }, { radius: 30, count: 12 }, { radius: 45, count: 18 }, { radius: 60, count: 24 }, { radius: 75, count: 30 }];
        return (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dT = timestamp - lastTime; lastTime = timestamp; time += dT * 0.001;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.beginPath(); ctx.arc(centerX, centerY, 2, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(0.9); ctx.fill();
            dotRings.forEach((ring, rIdx) => {
                for (let i = 0; i < ring.count; i++) {
                    const angle = (i / ring.count) * Math.PI * 2, p = Math.sin(time * 2 - rIdx * 0.4) * 3;
                    const x = centerX + Math.cos(angle) * (ring.radius + p), y = centerY + Math.sin(angle) * (ring.radius + p);
                    const o = 0.4 + ((Math.sin(time * 2 - rIdx * 0.4 + i * 0.2) + 1) / 2) * 0.6;
                    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(o); ctx.fill();
                }
            });
        };
    }) as SetupFunction,
    pulseWaveShockwave: ((ctx, CANVAS_WIDTH, CANVAS_HEIGHT) => {
        const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
        let time = 0, lastTime = 0;
        const dotRings = [{ radius: 15, count: 6 }, { radius: 30, count: 12 }, { radius: 45, count: 18 }, { radius: 60, count: 24 }, { radius: 75, count: 30 }];
        const waveSpeed = 30, waveThickness = 40, maxR = dotRings[dotRings.length - 1].radius + waveThickness;
        const rotMag = 0.15, rotSpeed = 3;
        return (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dT = timestamp - lastTime; lastTime = timestamp; time += dT * 0.001;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.beginPath(); ctx.arc(centerX, centerY, 1.5, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(0.8); ctx.fill();
            const waveFront = (time * waveSpeed) % maxR;
            dotRings.forEach(ring => {
                for (let i = 0; i < ring.count; i++) {
                    const bAngle = (i / ring.count) * Math.PI * 2, dist = ring.radius - waveFront;
                    let pF = 0; if (Math.abs(dist) < waveThickness / 2) pF = Math.max(0, Math.cos((dist / (waveThickness / 2)) * (Math.PI / 2)));
                    let angle = bAngle; if (pF > 0.01) angle += pF * Math.sin(time * rotSpeed + i * 0.5) * rotMag;
                    const s = 1.5 + pF * 1.8, o = 0.2 + pF * 0.7;
                    const x = centerX + Math.cos(angle) * ring.radius, y = centerY + Math.sin(angle) * ring.radius;
                    ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(o); ctx.fill();
                }
            });
        };
    }) as SetupFunction,
    pulseWaveSpiral: ((ctx, CANVAS_WIDTH, CANVAS_HEIGHT) => {
        const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
        let time = 0, lastTime = 0;
        const dotRings = [{ radius: 15, count: 6 }, { radius: 30, count: 12 }, { radius: 45, count: 18 }, { radius: 60, count: 24 }, { radius: 75, count: 30 }];
        return (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dT = timestamp - lastTime; lastTime = timestamp; time += dT * 0.001;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.beginPath(); ctx.arc(centerX, centerY, 2, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(0.9); ctx.fill();
            dotRings.forEach((ring, rIdx) => {
                const rotSpeed = 0.2 + rIdx * 0.03;
                for (let i = 0; i < ring.count; i++) {
                    const bAngle = (i / ring.count) * Math.PI * 2, spiralOffset = (ring.radius / 15) * 0.4;
                    const angle = bAngle + time * rotSpeed + spiralOffset;
                    const pPhase = time * 1.5 - ring.radius / 20 + (i / ring.count) * Math.PI, pRadius = Math.sin(pPhase) * 3;
                    const cRadius = ring.radius + pRadius;
                    const x = centerX + Math.cos(angle) * cRadius, y = centerY + Math.sin(angle) * cRadius;
                    const o = 0.3 + ((Math.sin(pPhase - Math.PI / 4) + 1) / 2) * 0.7;
                    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(o); ctx.fill();
                }
            });
        };
    }) as SetupFunction,
    pulseWaveBreathingGrid: ((ctx, CANVAS_WIDTH, CANVAS_HEIGHT) => {
        const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
        let time = 0, lastTime = 0;
        const gridSize = 9, spacing = 18, dots: {x:number, y:number}[] = [];
        const gridOffsetX = centerX - ((gridSize - 1) * spacing) / 2, gridOffsetY = centerY - ((gridSize - 1) * spacing) / 2;
        for (let r = 0; r < gridSize; r++) for (let c = 0; c < gridSize; c++) dots.push({ x: gridOffsetX + c * spacing, y: gridOffsetY + r * spacing });
        const waveSpeed = 60, waveThickness = 40, maxDist = Math.hypot(centerX, centerY) + waveThickness;
        return (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dT = timestamp - lastTime; lastTime = timestamp; time += dT * 0.001;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            const waveCenterDist = (time * waveSpeed) % maxDist;
            dots.forEach(dot => {
                const distCenter = Math.hypot(dot.x - centerX, dot.y - centerY), distWave = Math.abs(distCenter - waveCenterDist);
                let pF = 0; if (distWave < waveThickness / 2) pF = Math.sin(((1 - distWave / (waveThickness / 2)) * Math.PI) / 2);
                const s = 1.5 + pF * 2.5, o = 0.2 + pF * 0.8;
                ctx.beginPath(); ctx.arc(dot.x, dot.y, s, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(o); ctx.fill();
            });
        };
    }) as SetupFunction,
    flowingEnergyBands: ((ctx, CANVAS_WIDTH, CANVAS_HEIGHT) => {
        const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
        let time = 0, lastTime = 0;
        const dotRings = [{ radius: 15, count: 8 }, { radius: 30, count: 12 }, { radius: 45, count: 16 }, { radius: 60, count: 20 }, { radius: 75, count: 24 }];
        const numBands = 3, bandWidth = CANVAS_WIDTH / 2.5, bandSpeed = 25, totalPath = CANVAS_WIDTH + bandWidth;
        return (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dT = timestamp - lastTime; lastTime = timestamp; time += dT * 0.001;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.beginPath(); ctx.arc(centerX, centerY, 1.5, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(0.7); ctx.fill();
            dotRings.forEach((ring, rIdx) => {
                for (let i = 0; i < ring.count; i++) {
                    const angle = (i / ring.count) * Math.PI * 2 + time * 0.03 * (rIdx % 2 === 0 ? 1 : -1);
                    const x = centerX + Math.cos(angle) * ring.radius, y = centerY + Math.sin(angle) * ring.radius;
                    let maxInf = 0;
                    for (let b = 0; b < numBands; b++) {
                        const bandCenterY = ((time * bandSpeed + b * (totalPath / numBands)) % totalPath) - bandWidth / 2;
                        const distToBand = Math.abs(y - bandCenterY);
                        let inf = 0; if (distToBand < bandWidth / 2) inf = Math.max(0, Math.cos((distToBand / (bandWidth / 2)) * (Math.PI / 2)));
                        maxInf = Math.max(maxInf, inf);
                    }
                    const s = 1.5 + maxInf * 2.0, o = 0.2 + maxInf * 0.7;
                    ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(o); ctx.fill();
                }
            });
        };
    }) as SetupFunction,
    pulseWaveStretched: ((ctx, CANVAS_WIDTH, CANVAS_HEIGHT) => {
        const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
        let time = 0, lastTime = 0;
        const dotRings = [{ radius: 15, count: 6 }, { radius: 30, count: 12 }, { radius: 45, count: 18 }, { radius: 60, count: 24 }, { radius: 75, count: 30 }];
        return (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dT = timestamp - lastTime; lastTime = timestamp; time += dT * 0.001;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.beginPath(); ctx.arc(centerX, centerY, 2, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(0.9); ctx.fill();
            dotRings.forEach((ring, rIdx) => {
                for (let i = 0; i < ring.count; i++) {
                    const angle = (i / ring.count) * Math.PI * 2, waveProg = time * 1.5 - rIdx * 0.5;
                    const pF = Math.sin(waveProg), posPulse = (pF + 1) / 2;
                    const stretch = pF * 2, rX = 2 + Math.abs(stretch), rY = 2;
                    const x = centerX + Math.cos(angle) * ring.radius, y = centerY + Math.sin(angle) * ring.radius;
                    const o = 0.3 + posPulse * 0.7;
                    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.beginPath();
                    ctx.ellipse(0, 0, rX, rY, 0, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(o); ctx.fill(); ctx.restore();
                }
            });
        };
    }) as SetupFunction,
    interwovenRingPulses: ((ctx, CANVAS_WIDTH, CANVAS_HEIGHT) => {
        const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
        let time = 0, lastTime = 0;
        const ringData = Array.from({ length: 5 }, (_, i) => ({
            radius: (i + 1) * 15, count: 8 + i * 4, pulseSpeed: 0.8 + i * 0.1, phaseOffset: (i * Math.PI) / 3, maxAmplitude: 2 + i * 0.5, rotationSpeed: (i % 2 === 0 ? 0.02 : -0.02) * (1 + i * 0.1)
        }));
        return (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dT = timestamp - lastTime; lastTime = timestamp; time += dT * 0.001;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.beginPath(); ctx.arc(centerX, centerY, 1.5, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(0.8); ctx.fill();
            ringData.forEach(ring => {
                const pulse = (Math.sin(time * ring.pulseSpeed + ring.phaseOffset) + 1) / 2;
                const size = 1.5 + pulse * ring.maxAmplitude * 0.5, opacity = 0.2 + pulse * 0.6;
                for (let i = 0; i < ring.count; i++) {
                    const angle = (i / ring.count) * Math.PI * 2 + time * ring.rotationSpeed;
                    const x = centerX + Math.cos(angle) * ring.radius, y = centerY + Math.sin(angle) * ring.radius;
                    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(opacity); ctx.fill();
                }
            });
        };
    }) as SetupFunction,
    spiralRadiatingPulse: ((ctx, CANVAS_WIDTH, CANVAS_HEIGHT) => {
        const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
        let time = 0, lastTime = 0;
        const numArms = 8, dotsPerArm = 15, minR = 10, maxR = (CANVAS_WIDTH / 2) * 0.85;
        const twist = 0.025, rotSpeed = 0.03, waveSpeed = 25, waveLen = maxR / 2;
        const arms = Array.from({ length: numArms }, (_, i) => ({
            baseAngle: (i / numArms) * Math.PI * 2,
            dots: Array.from({ length: dotsPerArm }, (__, j) => ({ baseRadius: minR + j * ((maxR - minR) / (dotsPerArm - 1)), size: 1.0 }))
        }));
        return (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dT = timestamp - lastTime; lastTime = timestamp; time += dT * 0.001;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.beginPath(); ctx.arc(centerX, centerY, 1.5, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(0.7); ctx.fill();
            const gRot = time * rotSpeed, pulsePeak = ((time * waveSpeed) % (maxR + waveLen)) - waveLen / 2;
            arms.forEach(arm => {
                arm.dots.forEach(dot => {
                    const finalAngle = arm.baseAngle + gRot + dot.baseRadius * twist;
                    const x = centerX + Math.cos(finalAngle) * dot.baseRadius, y = centerY + Math.sin(finalAngle) * dot.baseRadius;
                    let pInf = 0; const dist = Math.abs(dot.baseRadius - pulsePeak);
                    if (dist < waveLen / 2) pInf = Math.max(0, Math.cos((dist / (waveLen / 2)) * (Math.PI / 2)));
                    const size = dot.size + pInf * 1.2, opacity = 0.15 + pInf * 0.6;
                    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(opacity); ctx.fill();
                });
            });
        };
    }) as SetupFunction,
    radiatingLineScan: ((ctx, CANVAS_WIDTH, CANVAS_HEIGHT) => {
        const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
        let time = 0, lastTime = 0;
        const numLines = 16, maxLen = (CANVAS_WIDTH / 2) * 0.9, scanWidth = 25, scanSpeed = 35, rotSpeed = 0.05;
        return (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dT = timestamp - lastTime; lastTime = timestamp; time += dT * 0.001;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.beginPath(); ctx.arc(centerX, centerY, 2, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(0.7); ctx.fill();
            const scanPos = ((time * scanSpeed) % (maxLen + scanWidth * 1.5)) - scanWidth * 0.75;
            for (let i = 0; i < numLines; i++) {
                const angle = (i / numLines) * Math.PI * 2 + time * rotSpeed;
                const endX = centerX + Math.cos(angle) * maxLen, endY = centerY + Math.sin(angle) * maxLen;
                ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(endX, endY);
                ctx.strokeStyle = MONOCHROME_FILL(0.1); ctx.lineWidth = 0.5; ctx.stroke();
                const scanStart = Math.max(0, scanPos - scanWidth / 2), scanEnd = Math.min(maxLen, scanPos + scanWidth / 2);
                if (scanStart < scanEnd) {
                    const sX = centerX + Math.cos(angle) * scanStart, sY = centerY + Math.sin(angle) * scanStart;
                    const eX = centerX + Math.cos(angle) * scanEnd, eY = centerY + Math.sin(angle) * scanEnd;
                    const grad = ctx.createLinearGradient(sX, sY, eX, eY);
                    const pulse = 0.6 + ((Math.sin(time * 1.5 + i * 0.4) + 1) / 2) * 0.4;
                    grad.addColorStop(0, MONOCHROME_FILL(0));
                    grad.addColorStop(0.5, MONOCHROME_FILL(0.85 * pulse));
                    grad.addColorStop(1, MONOCHROME_FILL(0));
                    ctx.beginPath(); ctx.moveTo(sX, sY); ctx.lineTo(eX, eY);
                    ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();
                }
            }
        };
    }) as SetupFunction,
};


// --- REACT COMPONENTS ---

const CANVAS_WIDTH = 180;
const CANVAS_HEIGHT = 180;

type AnimationId = keyof typeof animationLogic;

const ANIMATIONS: { id: AnimationId; title: string }[] = [
  { id: "pulseWave", title: "Pulse Wave" },
  { id: "pulseWaveShockwave", title: "Pulse Shockwave" },
  { id: "pulseWaveSpiral", title: "Spiral Galaxy" },
  { id: "pulseWaveBreathingGrid", title: "Breathing Grid" },
  { id: "flowingEnergyBands", title: "Flowing Energy" },
  { id: "pulseWaveStretched", title: "Stretched Rings" },
  { id: "interwovenRingPulses", title: "Interwoven Pulses" },
  { id: "spiralRadiatingPulse", title: "Spiral Radiating Pulse" },
  { id: "radiatingLineScan", title: "Radiating Scan" },
];

const useCanvasAnimation = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  animationId: AnimationId
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    let animationFrameId: number;
    const animateFunction = animationLogic[animationId];

    if (animateFunction) {
      const render = animateFunction(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
      const loop = (timestamp: number) => {
        render(timestamp);
        animationFrameId = requestAnimationFrame(loop);
      };
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, animationId]);
};

const Corner = ({ path, className }: { path: string; className: string }) => (
  <div className={`corner ${className}`}>
    <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d={path} />
    </svg>
  </div>
);

const AnimationCard = ({ id, title }: { id: AnimationId; title:string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasAnimation(canvasRef, id);

  const cornerPath = "M11,4H13V11H20V13H13V20H11V13H4V11H11V4Z";

  return (
    <div className="animation-container">
      <Corner path={cornerPath} className="top-left" />
      <Corner path={cornerPath} className="top-right" />
      <Corner path={cornerPath} className="bottom-left" />
      <Corner path={cornerPath} className="bottom-right" />
      <div className="animation-title">{title}</div>
      <div className="circle-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};


export const CircleAnimationsGrid = () => {
  return (
    <div className="animations-grid-container">
      {ANIMATIONS.map((anim) => (
        <AnimationCard key={anim.id} id={anim.id} title={anim.title} />
      ))}
    </div>
  );
};