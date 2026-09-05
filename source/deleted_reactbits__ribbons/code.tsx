"use client"; 

import React, { useEffect, useRef, FC } from 'react';
import { Renderer, Transform, Vec3, Color, Polyline } from 'ogl';

interface RibbonsProps {
  colors?: string[];
  baseSpring?: number;
  baseFriction?: number;
  baseThickness?: number;
  offsetFactor?: number;
  maxAge?: number;
  pointCount?: number;
  speedMultiplier?: number;
  enableFade?: boolean;
  enableShaderEffect?: boolean;
  effectAmplitude?: number;
  backgroundColor?: [number, number, number, number]; // R, G, B, A (0-1)
  className?: string; 
  style?: React.CSSProperties; 
}

export const Ribbons: FC<RibbonsProps> = ({
  colors = ['#ff9346', '#7cff67', '#ffee51', '#00d8ff'],
  baseSpring = 0.03,
  baseFriction = 0.9,
  baseThickness = 30,
  offsetFactor = 0.05,
  maxAge = 500, 
  pointCount = 50,
  speedMultiplier = 0.6,
  enableFade = false,
  enableShaderEffect = false,
  effectAmplitude = 2,
  backgroundColor = [0, 0, 0, 0], // Default to transparent black for canvas
  className = "",
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererInstanceRef = useRef<Renderer | null>(null); 
  const animationFrameIdRef = useRef<number | null>(null);
  const resizeHandlerRef = useRef<() => void>(() => {});
  const pointerUpdateHandlerRef = useRef<(e: MouseEvent | TouchEvent) => void>(() => {});


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Cleanup previous instance if effect re-runs
    if (rendererInstanceRef.current) {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener('resize', resizeHandlerRef.current);
      container.removeEventListener('mousemove', pointerUpdateHandlerRef.current);
      container.removeEventListener('touchstart', pointerUpdateHandlerRef.current);
      container.removeEventListener('touchmove', pointerUpdateHandlerRef.current);
      if (rendererInstanceRef.current.gl.canvas && rendererInstanceRef.current.gl.canvas.parentNode === container) {
        container.removeChild(rendererInstanceRef.current.gl.canvas);
      }
      // Consider OGL object disposal if available/needed
      rendererInstanceRef.current = null;
    }

    const renderer = new Renderer({ dpr: window.devicePixelRatio || 2, alpha: true, antialias: true });
    rendererInstanceRef.current = renderer;
    const gl = renderer.gl;
    
    if (Array.isArray(backgroundColor) && backgroundColor.length === 4) {
      gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);
    } else {
      gl.clearColor(0, 0, 0, 0); 
    }

    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    container.appendChild(gl.canvas);

    const scene = new Transform();
    const lines: {
      spring: number; friction: number; mouseVelocity: Vec3; mouseOffset: Vec3;
      points: Vec3[]; polyline: Polyline; thickness: number;
    }[] = [];

    const vertexShader = `
      precision highp float;
      attribute vec3 position; attribute vec3 next; attribute vec3 prev;
      attribute vec2 uv; attribute float side;
      uniform vec2 uResolution; uniform float uDPR; uniform float uThickness;
      uniform float uTime; uniform float uEnableShaderEffect; uniform float uEffectAmplitude;
      varying vec2 vUV;
      vec4 getPosition() {
          vec4 current = vec4(position, 1.0);
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 nextScreen = next.xy * aspect; vec2 prevScreen = prev.xy * aspect;
          vec2 tangent = normalize(nextScreen - prevScreen);
          vec2 normal = vec2(-tangent.y, tangent.x);
          normal /= aspect;
          normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
          float dist = length(nextScreen - prevScreen);
          normal *= smoothstep(0.0, 0.02, dist);
          float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
          float pixelWidth = 1.0 * pixelWidthRatio; // Assumes w is 1 for screen space
          normal *= pixelWidth * uThickness;
          current.xy -= normal * side;
          if(uEnableShaderEffect > 0.5) {
            current.xy += normal * sin(uTime * 2.0 + current.x * 10.0 + current.y * 5.0) * uEffectAmplitude * 0.1;
          }
          return current;
      }
      void main() { vUV = uv; gl_Position = getPosition(); }`;

    const fragmentShader = `
      precision highp float;
      uniform vec3 uColor; uniform float uOpacity; uniform float uEnableFade;
      varying vec2 vUV;
      void main() {
          float fadeFactor = 1.0;
          if(uEnableFade > 0.5) {
              fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y); 
          }
          gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
      }`;

    resizeHandlerRef.current = () => {
      if (!container || !rendererInstanceRef.current) return;
      const width = container.clientWidth; const height = container.clientHeight;
      rendererInstanceRef.current.setSize(width, height);
      lines.forEach(line => line.polyline.resize());
    };
    window.addEventListener('resize', resizeHandlerRef.current);

    const center = (colors.length - 1) / 2;
    colors.forEach((color, index) => {
      const spring = baseSpring + (Math.random() - 0.5) * 0.01;
      const friction = baseFriction + (Math.random() - 0.5) * 0.02;
      const thickness = baseThickness + (Math.random() - 0.5) * (baseThickness * 0.2);
      const mouseOffset = new Vec3(
        (index - center) * offsetFactor + (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.05, 0
      );
      const linePoints: Vec3[] = Array.from({ length: pointCount }, () => new Vec3());
      const polyline = new Polyline(gl, {
        points: linePoints, vertex: vertexShader, fragment: fragmentShader,
        uniforms: {
          uColor: { value: new Color(color) }, uThickness: { value: thickness },
          uOpacity: { value: 1.0 }, uTime: { value: 0.0 },
          uEnableShaderEffect: { value: enableShaderEffect ? 1.0 : 0.0 },
          uEffectAmplitude: { value: effectAmplitude },
          uEnableFade: { value: enableFade ? 1.0 : 0.0 },
        },
      });
      polyline.mesh.setParent(scene);
      lines.push({ spring, friction, mouseVelocity: new Vec3(), mouseOffset, points: linePoints, polyline, thickness });
    });

    resizeHandlerRef.current(); 

    const mouse = new Vec3();
    pointerUpdateHandlerRef.current = (e: MouseEvent | TouchEvent) => {
      if (!container) return;
      let x: number, y: number;
      const rect = container.getBoundingClientRect();
      if ('changedTouches' in e && e.changedTouches && e.changedTouches.length) {
        x = e.changedTouches[0].clientX - rect.left; y = e.changedTouches[0].clientY - rect.top;
      } else if (e instanceof MouseEvent) {
        x = e.clientX - rect.left; y = e.clientY - rect.top;
      } else { return; }
      const width = container.clientWidth; const height = container.clientHeight;
      if (width > 0 && height > 0) { mouse.set((x / width) * 2 - 1, (y / height) * -2 + 1, 0); }
    };
    container.addEventListener('mousemove', pointerUpdateHandlerRef.current);
    container.addEventListener('touchstart', pointerUpdateHandlerRef.current, { passive: true });
    container.addEventListener('touchmove', pointerUpdateHandlerRef.current, { passive: true });

    const tmpVec3 = new Vec3();
    let lastTime = performance.now();
    function animationLoop() {
      animationFrameIdRef.current = requestAnimationFrame(animationLoop);
      const currentTime = performance.now(); const dt = currentTime - lastTime; lastTime = currentTime;

      lines.forEach(line => {
        tmpVec3.copy(mouse).add(line.mouseOffset).sub(line.points[0]).multiply(line.spring);
        line.mouseVelocity.add(tmpVec3).multiply(line.friction);
        line.points[0].add(line.mouseVelocity);
        for (let i = 1; i < line.points.length; i++) {
          const segmentDelay = (isFinite(maxAge) && maxAge > 0) ? maxAge / (line.points.length - 1) : 16.66; // Default to ~60fps if maxAge is not suitable
          const alpha = Math.min(1, (dt * speedMultiplier) / segmentDelay);
          line.points[i].lerp(line.points[i - 1], alpha > 0 ? alpha : 0.9); // Ensure alpha is positive
        }
        if (line.polyline.mesh.program.uniforms.uTime) { line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001; }
        line.polyline.updateGeometry();
      });
      rendererInstanceRef.current?.render({ scene });
    }
    animationLoop();

    return () => {
      // console.log("Ribbons: Cleaning up instance for container:", container);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener('resize', resizeHandlerRef.current);
      container.removeEventListener('mousemove', pointerUpdateHandlerRef.current);
      container.removeEventListener('touchstart', pointerUpdateHandlerRef.current);
      container.removeEventListener('touchmove', pointerUpdateHandlerRef.current);
      if (rendererInstanceRef.current && rendererInstanceRef.current.gl.canvas && rendererInstanceRef.current.gl.canvas.parentNode === container) {
        container.removeChild(rendererInstanceRef.current.gl.canvas);
      }
      // OGL specific cleanup might be needed for scene, polylines etc. if they have dispose methods
      lines.forEach(line => {
        if (line.polyline && scene.children.includes(line.polyline.mesh)) {
             scene.removeChild(line.polyline.mesh);
        }
        // if (line.polyline.dispose) line.polyline.dispose(); // Example
      });
      rendererInstanceRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ // Using JSON.stringify for arrays to ensure stable dependency
    JSON.stringify(colors), baseSpring, baseFriction, baseThickness, offsetFactor,
    maxAge, pointCount, speedMultiplier, enableFade,
    enableShaderEffect, effectAmplitude, JSON.stringify(backgroundColor)
  ]);

  return <div ref={containerRef} className={`relative w-full h-full ${className}`} style={style} />;
};