'use client';

import React, { useRef, useEffect } from 'react';

// --- TYPE DEFINITIONS & CONSTANTS ---
type AnimationSetupFunction = (ctx: CanvasRenderingContext2D) => () => void;
const CANVAS_WIDTH = 180;
const CANVAS_HEIGHT = 180;
const GLOBAL_SPEED = 0.5;
const MONOCHROME_FILL = (opacity: number) => `rgba(255, 255, 255, ${Math.max(0, Math.min(1, opacity))})`;
const MONOCHROME_STROKE = (opacity: number) => `rgba(255, 255, 255, ${Math.max(0, Math.min(1, opacity))})`;
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// --- CORNER DECORATION SUB-COMPONENT ---
const Corner = ({ position, rotation, delay }: { position: string; rotation: string; delay: string }) => (
  <div
    className={`absolute z-10 h-4 w-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${position}`}
    style={{ transform: rotation, transitionDelay: delay }}
  >
    <svg viewBox="0 0 512 512" className="h-full w-full">
      <path
        fill="currentColor"
        d="M448,224 288,224 288,64 224,64 224,224 64,224 64,288 224,288 224,448 288,448 288,288 448,288"
      />
    </svg>
  </div>
);

// --- MAIN REUSABLE COMPONENT ---
interface CanvasAnimationProps {
  title: string;
  animationId: keyof typeof animationMap;
}

export const CanvasAnimation: React.FC<CanvasAnimationProps> = ({ title, animationId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const setupFunction = animationMap[animationId];
    if (!setupFunction) return;

    const cleanup = setupFunction(ctx);
    return cleanup;
  }, [animationId]);

  return (
    <div className="group relative flex h-[220px] w-[220px] flex-col items-center overflow-visible border border-white/10 bg-black/50 p-2.5 transition-colors duration-300 hover:border-white/30">
      <Corner position="top-[-8px] left-[-8px]" rotation="rotate(0deg)" delay="0s" />
      <Corner position="top-[-8px] right-[-8px]" rotation="rotate(90deg)" delay="0.1s" />
      <Corner position="bottom-[-8px] left-[-8px]" rotation="rotate(-90deg)" delay="0.2s" />
      <Corner position="bottom-[-8px] right-[-8px]" rotation="rotate(180deg)" delay="0.3s" />
      <div className="mb-[10px] text-center text-xs uppercase tracking-[0.5px]">{title}</div>
      <div className="relative flex h-[180px] w-[180px] items-center justify-center">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="absolute left-0 top-0" />
      </div>
    </div>
  );
};

// --- ANIMATION LOGIC IMPLEMENTATIONS ---

const setup3DSphereScan: AnimationSetupFunction = (ctx) => {
  let frameId: number;
  let time = 0;
  let lastTime = 0;
  const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2, radius = CANVAS_WIDTH * 0.4, numDots = 250;
  const dots = Array.from({ length: numDots }, (_, i) => {
    const theta = Math.acos(1 - 2 * (i / numDots));
    const phi = Math.sqrt(numDots * Math.PI) * theta;
    return { x: radius * Math.sin(theta) * Math.cos(phi), y: radius * Math.sin(theta) * Math.sin(phi), z: radius * Math.cos(theta) };
  });

  const animate = (timestamp: number) => {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    time += deltaTime * 0.0005 * GLOBAL_SPEED;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const rotX = Math.sin(time * 0.3) * 0.5, rotY = time * 0.5;
    const easedTime = easeInOutCubic((Math.sin(time * 2.5) + 1) / 2);
    const scanLine = (easedTime * 2 - 1) * radius, scanWidth = 25;
    dots.forEach(dot => {
      let { x, y, z } = dot;
      let nX = x * Math.cos(rotY) - z * Math.sin(rotY), nZ = x * Math.sin(rotY) + z * Math.cos(rotY);
      x = nX; z = nZ;
      let nY = y * Math.cos(rotX) - z * Math.sin(rotX); nZ = y * Math.sin(rotX) + z * Math.cos(rotX);
      y = nY; z = nZ;
      const scale = (z + radius * 1.5) / (radius * 2.5);
      const pX = centerX + x, pY = centerY + y;
      const distToScan = Math.abs(y - scanLine);
      const scanInfluence = distToScan < scanWidth ? Math.cos((distToScan / scanWidth) * (Math.PI / 2)) : 0;
      const size = Math.max(0, scale * 2.0 + scanInfluence * 2.5);
      const opacity = Math.max(0, scale * 0.6 + scanInfluence * 0.4);
      ctx.beginPath();
      ctx.arc(pX, pY, size, 0, Math.PI * 2);
      ctx.fillStyle = MONOCHROME_FILL(opacity);
      ctx.fill();
    });
    frameId = requestAnimationFrame(animate);
  };
  frameId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(frameId);
};

const setupCrystallineRefraction: AnimationSetupFunction = (ctx) => {
    let frameId: number, time = 0, lastTime = 0;
    const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2, gridSize = 15, spacing = CANVAS_WIDTH / (gridSize - 1);
    const dots = Array.from({ length: gridSize * gridSize }, (_, i) => ({ x: (i % gridSize) * spacing, y: Math.floor(i / gridSize) * spacing }));
    
    const animate = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.16 * GLOBAL_SPEED;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const waveRadius = time % (CANVAS_WIDTH * 1.2), waveWidth = 60;
        dots.forEach(dot => {
            const dist = Math.hypot(dot.x - centerX, dot.y - centerY);
            const distToWave = Math.abs(dist - waveRadius);
            let displacement = 0;
            if (distToWave < waveWidth / 2) {
                const wavePhase = (distToWave / (waveWidth / 2)) * Math.PI;
                displacement = easeInOutCubic(Math.sin(wavePhase)) * 10;
            }
            const angleToCenter = Math.atan2(dot.y - centerY, dot.x - centerX);
            const dx = Math.cos(angleToCenter) * displacement, dy = Math.sin(angleToCenter) * displacement;
            ctx.beginPath();
            ctx.arc(dot.x + dx, dot.y + dy, 1.2 + (Math.abs(displacement) / 10) * 2, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(0.2 + (Math.abs(displacement) / 10) * 0.8);
            ctx.fill();
        });
        frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
};

const setupSonarSweep: AnimationSetupFunction = (ctx) => {
    let frameId: number;
    const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2, fadeTime = 2500, rings: {r: number, angle: number, lastSeen: number}[] = [];
    for (let r = 20; r <= 80; r += 15) for (let i = 0; i < r / 2; i++) rings.push({ r, angle: (i / (r / 2)) * Math.PI * 2, lastSeen: -fadeTime });
    
    const animate = (timestamp: number) => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const scanAngle = (timestamp * 0.001 * (Math.PI / 2) * GLOBAL_SPEED) % (Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + 85 * Math.cos(scanAngle), centerY + 85 * Math.sin(scanAngle));
        ctx.strokeStyle = MONOCHROME_STROKE(0.5);
        ctx.lineWidth = 1;
        ctx.stroke();
        rings.forEach(dot => {
            let angleDiff = Math.abs(dot.angle - scanAngle);
            if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
            if (angleDiff < 0.05) dot.lastSeen = timestamp;
            const timeSinceSeen = timestamp - dot.lastSeen;
            if (timeSinceSeen < fadeTime) {
                const opacity = 1 - easeInOutCubic(timeSinceSeen / fadeTime);
                const size = 1 + opacity * 1.5;
                const x = centerX + dot.r * Math.cos(dot.angle), y = centerY + dot.r * Math.sin(dot.angle);
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = MONOCHROME_FILL(opacity);
                ctx.fill();
            }
        });
        frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
};

const setupHelixScanner: AnimationSetupFunction = (ctx) => {
    let frameId: number, time = 0, lastTime = 0;
    const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2, numDots = 100, radius = 35, height = 120;
    const dots = Array.from({ length: numDots }, (_, i) => ({ angle: i * 0.3, y: (i / numDots) * height - height / 2 }));

    const animate = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        time += (timestamp - lastTime) * 0.001 * GLOBAL_SPEED;
        lastTime = timestamp;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const loopDuration = 8, seamlessProgress = Math.sin((time / loopDuration) * Math.PI * 2);
        const scanY = seamlessProgress * (height / 2), scanWidth = 25, trailLength = height * 0.3;
        dots.forEach(dot => {
            const x = radius * Math.cos(dot.angle + time), z = radius * Math.sin(dot.angle + time);
            const pX = centerX + x, pY = centerY + dot.y, scale = (z + radius) / (radius * 2);
            const distToScan = Math.abs(dot.y - scanY), leadingEdgeInfluence = distToScan < scanWidth ? Math.cos((distToScan / scanWidth) * (Math.PI / 2)) : 0;
            let trailInfluence = 0;
            const distBehindScan = dot.y - scanY, isMovingUp = Math.cos((time / loopDuration) * Math.PI * 2) > 0;
            if ((isMovingUp && distBehindScan < 0 && Math.abs(distBehindScan) < trailLength) || (!isMovingUp && distBehindScan > 0 && Math.abs(distBehindScan) < trailLength)) {
                trailInfluence = Math.pow(1 - Math.abs(distBehindScan) / trailLength, 2) * 0.4;
            }
            const totalInfluence = Math.max(leadingEdgeInfluence, trailInfluence);
            ctx.beginPath();
            ctx.arc(pX, pY, Math.max(0, scale * 1.8 + totalInfluence * 2.8), 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(Math.max(0, scale * 0.4 + totalInfluence * 0.6));
            ctx.fill();
        });
        frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
};

const setupInterconnectingWaves: AnimationSetupFunction = (ctx) => {
    let frameId: number, time = 0, lastTime = 0;
    const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
    const dotRings = [{ radius: 20, count: 12 }, { radius: 45, count: 24 }, { radius: 70, count: 36 }];

    const animate = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        time += (timestamp - lastTime) * 0.001 * GLOBAL_SPEED;
        lastTime = timestamp;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        dotRings.forEach((ring, ringIndex) => {
            if (ringIndex >= dotRings.length - 1) return;
            const nextRing = dotRings[ringIndex + 1];
            for (let i = 0; i < ring.count; i++) {
                const angle1 = (i / ring.count) * Math.PI * 2;
                const rPulse1 = Math.sin(time * 2 - ringIndex * 0.4) * 3;
                const x1 = centerX + Math.cos(angle1) * (ring.radius + rPulse1), y1 = centerY + Math.sin(angle1) * (ring.radius + rPulse1);
                const nextRingRatio = nextRing.count / ring.count;
                for (let j = 0; j < nextRingRatio; j++) {
                    const angle2 = ((i * nextRingRatio + j) / nextRing.count) * Math.PI * 2;
                    const rPulse2 = Math.sin(time * 2 - (ringIndex + 1) * 0.4) * 3;
                    const x2 = centerX + Math.cos(angle2) * (nextRing.radius + rPulse2), y2 = centerY + Math.sin(angle2) * (nextRing.radius + rPulse2);
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.lineWidth = 0.75;
                    ctx.strokeStyle = MONOCHROME_STROKE(0.1 + ((Math.sin(time * 3 - ringIndex * 0.5 + i * 0.3) + 1) / 2) * 0.4);
                    ctx.stroke();
                }
            }
        });
        dotRings.forEach((ring, ringIndex) => {
            for (let i = 0; i < ring.count; i++) {
                const angle = (i / ring.count) * Math.PI * 2;
                const rPulse = Math.sin(time * 2 - ringIndex * 0.4) * 3;
                const x = centerX + Math.cos(angle) * (ring.radius + rPulse), y = centerY + Math.sin(angle) * (ring.radius + rPulse);
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = MONOCHROME_FILL(0.4 + Math.sin(time * 2 - ringIndex * 0.4 + i * 0.2) * 0.6);
                ctx.fill();
            }
        });
        frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
};

const setupCylindricalAnalysis: AnimationSetupFunction = (ctx) => {
    let frameId: number, time = 0, lastTime = 0;
    const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2, radius = 60, height = 100, numLayers = 15, dotsPerLayer = 25;
    
    const animate = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        time += (timestamp - lastTime) * 0.001 * GLOBAL_SPEED;
        lastTime = timestamp;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const easedTime = easeInOutCubic((Math.sin(time * 2) + 1) / 2);
        const scanY = centerY + (easedTime * 2 - 1) * (height / 2), scanWidth = 15;
        for (let i = 0; i < numLayers; i++) {
            const layerY = centerY + (i / (numLayers - 1) - 0.5) * height;
            const rot = time * (0.2 + (i % 2) * 0.1);
            for (let j = 0; j < dotsPerLayer; j++) {
                const angle = (j / dotsPerLayer) * Math.PI * 2 + rot;
                const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius, scale = (z + radius) / (radius * 2);
                const pX = centerX + x * scale, pY = layerY;
                const distToScan = Math.abs(pY - scanY);
                const scanInfluence = distToScan < scanWidth ? Math.cos((distToScan / scanWidth) * (Math.PI / 2)) : 0;
                ctx.beginPath();
                ctx.arc(pX, pY, Math.max(0, scale * 1.5 + scanInfluence * 2), 0, Math.PI * 2);
                ctx.fillStyle = MONOCHROME_FILL(Math.max(0, scale * 0.5 + scanInfluence * 0.5));
                ctx.fill();
            }
        }
        frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
};

const setupVoxelMatrixMorph: AnimationSetupFunction = (ctx) => {
    let frameId: number, time = 0, lastTime = 0;
    const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2, gridSize = 5, spacing = 20;
    const totalSize = (gridSize - 1) * spacing;
    const points = Array.from({ length: gridSize ** 3 }, (_, i) => ({
        x: (i % gridSize - (gridSize - 1) / 2) * spacing,
        y: (Math.floor(i / gridSize) % gridSize - (gridSize - 1) / 2) * spacing,
        z: (Math.floor(i / gridSize ** 2) - (gridSize - 1) / 2) * spacing,
    }));
    
    const animate = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        time += (timestamp - lastTime) * 0.0005 * GLOBAL_SPEED;
        lastTime = timestamp;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const rotX = time * 0.4, rotY = time * 0.6;
        const easedTime = easeInOutCubic((Math.sin(time * 2) + 1) / 2);
        const scanLine = (easedTime * 2 - 1) * (totalSize / 2 + 10), scanWidth = 30;
        points.forEach(p => {
            let { x, y, z } = p;
            let nX = x * Math.cos(rotY) - z * Math.sin(rotY), nZ = x * Math.sin(rotY) + z * Math.cos(rotY);
            x = nX; z = nZ;
            let nY = y * Math.cos(rotX) - z * Math.sin(rotX); nZ = y * Math.sin(rotX) + z * Math.cos(rotX);
            y = nY; z = nZ;
            const distToScan = Math.abs(y - scanLine);
            let scanInfluence = 0, displacement = 1;
            if (distToScan < scanWidth) {
                scanInfluence = Math.cos((distToScan / scanWidth) * (Math.PI / 2));
                displacement = 1 + scanInfluence * 0.4;
            }
            const scale = (z + 80) / 160;
            ctx.beginPath();
            ctx.arc(centerX + x * displacement, centerY + y * displacement, Math.max(0, scale * 2 + scanInfluence * 2), 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(Math.max(0.1, scale * 0.7 + scanInfluence * 0.3));
            ctx.fill();
        });
        frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
};

const setupPhasedArrayEmitter: AnimationSetupFunction = (ctx) => {
    let frameId: number, time = 0, lastTime = 0;
    const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2, fov = 300;
    const ringRadii = [20, 40, 60, 80], pointsPerRing = [12, 18, 24, 30], maxRadius = ringRadii[3];
    const points: {x:number, y:number, z:number}[] = [];
    ringRadii.forEach((radius, i) => {
      for (let j = 0; j < pointsPerRing[i]; j++) {
        const angle = (j / pointsPerRing[i]) * Math.PI * 2;
        points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: 0 });
      }
    });

    const animate = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        time += (timestamp - lastTime) * 0.001 * GLOBAL_SPEED;
        lastTime = timestamp;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const rotX = 1.0, rotY = time * 0.2, waveRadius = (time * 120) % (maxRadius * 1.8), waveWidth = 50, waveHeight = 18;
        const pointsToDraw: {x:number, y:number, z:number, size:number, opacity:number}[] = [];
        points.forEach(p_orig => {
            let { x, y, z } = p_orig;
            const distToWave = Math.abs(Math.hypot(x, y) - waveRadius);
            let waveInfluence = 0;
            if (distToWave < waveWidth / 2) {
                z = easeInOutCubic(Math.sin((1 - distToWave / (waveWidth / 2)) * Math.PI)) * waveHeight;
                waveInfluence = z / waveHeight;
            }
            let tX = x * Math.cos(rotY) - z * Math.sin(rotY), tZ = x * Math.sin(rotY) + z * Math.cos(rotY);
            x = tX; z = tZ;
            let tY = y * Math.cos(rotX) - z * Math.sin(rotX); tZ = y * Math.sin(rotX) + z * Math.cos(rotX);
            y = tY; z = tZ;
            const scale = fov / (fov + z + 100);
            pointsToDraw.push({ x: centerX + x * scale, y: centerY + y * scale, z, size: (1.5 + waveInfluence * 2.5) * scale, opacity: 0.4 + waveInfluence * 0.6 });
        });
        pointsToDraw.sort((a, b) => a.z - b.z).forEach(p => {
            if (p.size < 0.1) return;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(p.opacity);
            ctx.fill();
        });
        frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
};

const setupCrystallineCubeRefraction: AnimationSetupFunction = (ctx) => {
    let frameId: number, time = 0, lastTime = 0;
    const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2, fov = 250, gridSize = 7, spacing = 15;
    const cubeHalfSize = ((gridSize - 1) * spacing) / 2, maxDist = Math.hypot(cubeHalfSize, cubeHalfSize, cubeHalfSize);
    const points: {x:number, y:number, z:number}[] = [];
    for (let x = 0; x < gridSize; x++) for (let y = 0; y < gridSize; y++) for (let z = 0; z < gridSize; z++)
        points.push({ x: x * spacing - cubeHalfSize, y: y * spacing - cubeHalfSize, z: z * spacing - cubeHalfSize });
        
    const animate = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        time += (timestamp - lastTime) * 0.0003 * GLOBAL_SPEED;
        lastTime = timestamp;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const rotX = time * 2, rotY = time * 3, waveRadius = (timestamp * 0.04 * GLOBAL_SPEED) % (maxDist * 1.5), waveWidth = 40, displacementMagnitude = 10;
        const pointsToDraw: {x:number, y:number, z:number, size:number, opacity:number}[] = [];
        points.forEach(p_orig => {
            let { x, y, z } = p_orig;
            const distFromCenter = Math.hypot(x, y, z);
            let waveInfluence = 0;
            if (distFromCenter > 0 && Math.abs(distFromCenter - waveRadius) < waveWidth / 2) {
                const displacementAmount = easeInOutCubic(Math.cos((Math.abs(distFromCenter - waveRadius) / (waveWidth / 2)) * (Math.PI / 2))) * displacementMagnitude;
                const ratio = (distFromCenter + displacementAmount) / distFromCenter;
                x *= ratio; y *= ratio; z *= ratio;
                waveInfluence = displacementAmount / displacementMagnitude;
            }
            let tX = x * Math.cos(rotY) - z * Math.sin(rotY), tZ = x * Math.sin(rotY) + z * Math.cos(rotY);
            x = tX; z = tZ;
            let tY = y * Math.cos(rotX) - z * Math.sin(rotX); tZ = y * Math.sin(rotX) + z * Math.cos(rotX);
            y = tY; z = tZ;
            const scale = fov / (fov + z);
            const size = (1.5 + waveInfluence * 2.5) * scale;
            if(size > 0.1) pointsToDraw.push({ x: centerX + x * scale, y: centerY + y * scale, z, size, opacity: Math.max(0.1, scale * 0.7 + waveInfluence * 0.4) });
        });
        pointsToDraw.sort((a, b) => a.z - b.z).forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(p.opacity);
            ctx.fill();
        });
        frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
};

// --- ANIMATION MAP ---
const animationMap = {
  'sphere-scan': setup3DSphereScan,
  'crystalline-refraction': setupCrystallineRefraction,
  'sonar-sweep': setupSonarSweep,
  'helix-scanner': setupHelixScanner,
  'interconnecting-waves': setupInterconnectingWaves,
  'cylindrical-analysis': setupCylindricalAnalysis,
  'voxel-matrix-morph': setupVoxelMatrixMorph,
  'phased-array-emitter': setupPhasedArrayEmitter,
  'crystalline-cube-refraction': setupCrystallineCubeRefraction,
};