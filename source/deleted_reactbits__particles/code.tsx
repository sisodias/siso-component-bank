// component.tsx
import React, { useEffect, useRef, FC } from "react";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";
import { gsap } from "gsap"; // <--- IMPORT GSAP HERE

interface ComponentProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  className?: string;
}

const defaultColors: string[] = ["#ffffff", "#ffffff", "#ffffff"];

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertexShader = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread; 

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime * 0.1; 

    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x) * 0.5;
    mPos.y += cos(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w) * 0.5;
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z) * 0.5;
    
    vec4 mvPos = viewMatrix * mPos;

    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / -mvPos.z;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5)); 
    
    if(uAlphaParticles < 0.5) { 
      if(d > 0.5) {
        discard; 
      }
      gl_FragColor = vec4(vColor + 0.1 * sin(uv.yxx + uTime * 0.5 + vRandom.y * 6.28), 1.0);
    } else { 
      float circleAlpha = smoothstep(0.5, 0.4, d); 
      gl_FragColor = vec4(vColor + 0.1 * sin(uv.yxx + uTime * 0.5 + vRandom.y * 6.28), circleAlpha * 0.8); 
    }
  }
`;

export const Component: FC<ComponentProps> = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<Mesh | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const programRef = useRef<Program | null>(null); // Store program for uniform updates


  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    const renderer = new Renderer({ 
        dpr: Math.min(window.devicePixelRatio, 2),
        depth: false, 
        alpha: true 
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(0, 0, cameraDistance);
    cameraRef.current = camera;

    const resize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      rendererRef.current.setSize(width, height);
      cameraRef.current.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener("resize", resize, false);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };

    if (moveParticlesOnHover) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, lenSq: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        lenSq = x * x + y * y + z * z;
      } while (lenSq > 1 || lenSq === 0); 

      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1.0 : 0.0 },
      },
      transparent: true,
      depthTest: false,
    });
    programRef.current = program; // Store program

    const particlesMesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
    sceneRef.current = particlesMesh;

    let animationFrameId: number;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      
      const currentTime = performance.now();
      const delta = (currentTime - lastTime);
      lastTime = currentTime;
      elapsed += delta * speed;

      if (programRef.current) { // Use stored programRef
        programRef.current.uniforms.uTime.value = elapsed * 0.001;
      }

      if (sceneRef.current) {
        if (moveParticlesOnHover) {
          gsap.to(sceneRef.current.position, {
            x: -mouseRef.current.x * particleHoverFactor * 0.1,
            y: -mouseRef.current.y * particleHoverFactor * 0.1,
            duration: 0.5,
            ease: "power2.out"
          });
        } else {
           // Only tween if not already at 0,0 to avoid unnecessary tweens
           if (sceneRef.current.position.x !== 0 || sceneRef.current.position.y !== 0) {
             gsap.to(sceneRef.current.position, {x:0, y:0, duration: 0.5, ease: "power2.out"});
           }
        }

        if (!disableRotation) {
          sceneRef.current.rotation.x = Math.sin(elapsed * 0.00005) * 0.1;
          sceneRef.current.rotation.y += 0.0005 * speed;
        }
      }
      
      if(rendererRef.current && sceneRef.current && cameraRef.current){
        rendererRef.current.render({ scene: sceneRef.current, camera: cameraRef.current });
      }
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      if (moveParticlesOnHover && container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
      gsap.killTweensOf(sceneRef.current?.position); // Kill GSAP tweens on cleanup

      if (container && rendererRef.current && container.contains(rendererRef.current.gl.canvas)) {
        container.removeChild(rendererRef.current.gl.canvas);
      }
      // OGL specific cleanup (optional but good practice for complex scenes)
      // geometry?.remove(); // ogl types might not have remove directly on Geometry instance
      // program?.remove();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      programRef.current = null;
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    JSON.stringify(particleColors),
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className || ""}`}
      style={{ touchAction: 'none' }}
    />
  );
};