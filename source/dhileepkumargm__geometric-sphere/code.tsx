import React, { useState, useEffect, useCallback, useRef } from "react";

// --- CONFIGURATION BLOCK for Easy Remixing ---
export const CONFIG = {
  // Visuals
  primaryColor: "139, 92, 246", // RGB for Purple (Wireframe & Main Glow)
  secondaryColor: "59, 130, 246", // RGB for Blue (Core Light)

  // Animation Speed (Higher value = slower animation)
  sphereRotationDuration: "240s", // Time for full sphere rotation
  gridPanDuration: "180s", // Time for full background grid pan
  coreGlowDuration: "25s", // Time for core light pulsation

  // Intensity & Depth
  wireframeOpacity: 0.75, // Opacity of the wireframe lines
  wireframeShadowIntensity: 70, // Glow size (in px) of the wireframe
  coreBlur: 200, // Blur radius (in px) of the core light
  parallaxDepth: 35, // Strength of the mouse-follow effect (Higher = more movement)
  lerpFactor: 0.08, // Smoothing factor for mouse movement (0.01 is slow, 0.2 is fast)
  sphereDensity: 12, // Number of layered rings in the sphere (Higher = denser mesh)
};

// Helper function for linear interpolation (Lerp)
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * SphereHero
 *
 * Self-contained, propless hero component with layered background:
 * - panning grid
 * - volumetric haze
 * - chromatic core glow
 * - animated wireframe sphere (multiple rings)
 * - soft bloom, noise, vignette
 * - foreground hero content with call-to-actions
 *
 * All visual tuning via CONFIG above for remixing.
 */
export default function SphereHero() {
  const [targetMousePos, setTargetMousePos] = useState({ x: 0, y: 0 });
  const currentMousePos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef();

  const animateLerp = useCallback(() => {
    currentMousePos.current.x = lerp(
      currentMousePos.current.x,
      targetMousePos.x,
      CONFIG.lerpFactor
    );
    currentMousePos.current.y = lerp(
      currentMousePos.current.y,
      targetMousePos.y,
      CONFIG.lerpFactor
    );

    // trigger minimal state update so React re-renders with new smooth position
    // using a no-op setState pattern: flip a ref-derived value into state by
    // setting targetMousePos to its current smoothed values (keeps source of truth)
    setTargetMousePos((p) => ({
      x: currentMousePos.current.x,
      y: currentMousePos.current.y,
    }));

    animationFrameRef.current = requestAnimationFrame(animateLerp);
  }, [targetMousePos.x, targetMousePos.y]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animateLerp);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [animateLerp]);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const x = (clientX - centerX) / centerX;
    const y = (clientY - centerY) / centerY;
    setTargetMousePos({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const { x: smoothX, y: smoothY } = currentMousePos.current;

  // Parallax & rotation math
  const parallaxDepth = CONFIG.parallaxDepth;
  const rotationStrength = 5;

  const baseTranslate = `translate3d(${smoothX * parallaxDepth}px, ${smoothY * parallaxDepth}px, 0)`;
  const gridTranslate = `translate3d(${-smoothX * (parallaxDepth / 2)}px, ${-smoothY * (parallaxDepth / 2)}px, 0)`;
  const hazeTranslate = `translate3d(${smoothX * (parallaxDepth / 2)}px, ${smoothY * (parallaxDepth / 2)}px, 0)`;

  const tiltRotateX = smoothY * rotationStrength;
  const tiltRotateY = -smoothX * rotationStrength;
  const tiltTranslate = `rotateX(${tiltRotateX}deg) rotateY(${tiltRotateY}deg)`;

  // Generate sphere rings
  const sphereRings = Array.from({ length: CONFIG.sphereDensity }, (_, i) => {
    const step = 90 / (CONFIG.sphereDensity / 2);
    const angle = i * step;
    const commonStyle = {
      transform:
        i % 2 === 0 ? `rotateY(${angle}deg)` : `rotateX(${angle}deg)`,
    };
    return (
      <div
        key={`ring-${i}`}
        className="wireframe-line"
        style={commonStyle}
        aria-hidden="true"
      />
    );
  });

  // Inline style values derived from CONFIG to be set on elements
  const coreLightStyle = {
    width: "400px",
    height: "400px",
    backgroundImage: `radial-gradient(circle, rgba(${CONFIG.secondaryColor}, 0.45) 0%, transparent 70%)`,
    filter: `blur(${CONFIG.coreBlur}px)`,
    boxShadow: `0 0 ${CONFIG.coreBlur / 2}px 30px rgba(${CONFIG.secondaryColor}, 0.2), 0 0 ${CONFIG.coreBlur}px 50px rgba(${CONFIG.primaryColor}, 0.15)`,
  };

  const panningGridStyle = {
    transform: gridTranslate,
    backgroundImage:
      "repeating-linear-gradient(to right, rgba(10,10,10,0.9) 1px, transparent 1px), repeating-linear-gradient(to bottom, rgba(10,10,10,0.9) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    opacity: 0.15,
  };

  const hazeStyle = {
    transform: hazeTranslate,
    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(${CONFIG.primaryColor}, 0.15) 0%, transparent 50%)`,
    filter: "blur(150px)",
    opacity: 0.6,
    mixBlendMode: "screen",
  };

  const deepBaseStyle = {
    transform: baseTranslate,
    backgroundImage: `radial-gradient(at 50% 50%, rgba(${CONFIG.primaryColor}, 0.08) 0%, #030712 90%)`,
  };

  const bloomStyle = {
    transform: baseTranslate,
    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(${CONFIG.primaryColor}, 0.35) 0%, transparent 50%), radial-gradient(circle at 10% 10%, rgba(${CONFIG.secondaryColor}, 0.25) 0%, transparent 30%)`,
    mixBlendMode: "screen",
    filter: "blur(100px)",
    opacity: 0.95,
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-950 flex items-center justify-center font-sans">
      {/* Layer 0: Panning Grid Layer (Farthest Back - ZIndex 0) */}
      <div className="absolute inset-0 panning-grid" style={panningGridStyle} />

      {/* Layer 1: Volumetric Haze (Medium - ZIndex 1) */}
      <div className="absolute inset-0" style={hazeStyle} />

      {/* Layer 2: Deep Base Background & Core Glow (ZIndex 2-3) */}
      <div className="absolute inset-0" style={deepBaseStyle}>
        <div className="core-light absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" style={coreLightStyle} />
      </div>

      {/* Layer 3: Geometric Glow Sphere (3D Animated Element) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sphere-container z-40 pointer-events-none">
        <div
          className="w-[700px] h-[700px] sphere-rotation"
          style={{
            transform: tiltTranslate,
            transformOrigin: "center center",
            animationDuration: CONFIG.sphereRotationDuration,
          }}
        >
          {sphereRings}
        </div>
      </div>

      {/* Layer 4: Soft Radial Bloom (Ambient Light Layer) */}
      <div className="absolute inset-0" style={bloomStyle} />

      {/* Layer 5: Noise Layer (For Film Grain Texture) */}
      <div
        className="absolute inset-0 pointer-events-none noise-layer"
        style={{
          backgroundImage:
            'url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")',
          backgroundSize: "200px",
          opacity: 0.05,
          mixBlendMode: "overlay",
        }}
      />

      {/* Layer 6: Hero Content (Foreground) */}
      <div className="relative z-20 text-center max-w-5xl mx-auto p-8 backdrop-blur-sm rounded-xl content-foreground">
        <h1 className="hero-title">
          <span className="hero-gradient">Vector Intelligence</span>
        </h1>

        <p className="hero-sub">
          Designing at the intersection of 3D fidelity and dynamic user experience. This is excellence, redefined.
        </p>

        <div className="hero-cta">
          <button className="btn-primary">Initiate Launch</button>
          <button className="btn-ghost">View Geometric Mesh</button>
        </div>
      </div>

      {/* Final Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none vignette-overlay" />
    </div>
  );
}
