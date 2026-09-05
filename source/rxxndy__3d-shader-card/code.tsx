"use client";

/**
 * @name 3DShaderCard
 * @description A card component featuring a floating 3D candy coin with custom GLSL shaders,
 * fresnel rim glow, animated noise iridescence, and smooth bobbing motion.
 *
 * @dependencies
 * npm: @react-three/fiber @react-three/drei three
 */

import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ShaderCardProps {
  /** Card title */
  title?: string;
  /** Card description */
  description?: string;
  /** Button text */
  buttonText?: string;
  /** Button href link */
  buttonHref?: string;
  /** Base color of the candy (hex string) */
  baseColor?: string;
  /** Rim glow color for fresnel effect (hex string) */
  rimColor?: string;
  /** Background color of the 3D viewport (hex string) */
  viewportBackground?: string;
  /** Shadow color (hex string) */
  shadowColor?: string;
  /** Custom SVG path for logo emboss (optional) */
  logoPath?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT LOGO (21 LOGO)
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_LOGO_PATH = `M358.333 0C381.345 0 400 18.6548 400 41.6667V295.833C400 298.135 398.134 300 395.833 300H270.833C268.532 300 266.667 301.865 266.667 304.167V395.833C266.667 398.134 264.801 400 262.5 400H41.6667C18.6548 400 0 381.345 0 358.333V304.72C0 301.793 1.54269 299.081 4.05273 297.575L153.76 207.747C157.159 205.708 156.02 200.679 152.376 200.065L151.628 200H4.16667C1.86548 200 6.71103e-08 198.135 0 195.833V104.167C1.07376e-06 101.865 1.86548 100 4.16667 100H162.5C164.801 100 166.667 98.1345 166.667 95.8333V4.16667C166.667 1.86548 168.532 1.00666e-07 170.833 0H358.333ZM170.833 100C168.532 100 166.667 101.865 166.667 104.167V295.833C166.667 298.135 168.532 300 170.833 300H262.5C264.801 300 266.667 298.135 266.667 295.833V104.167C266.667 101.865 264.801 100 262.5 100H170.833Z`;

// ═══════════════════════════════════════════════════════════════════════════
// LOGO TEXTURE CREATION
// ═══════════════════════════════════════════════════════════════════════════

function createLogoTexture(logoPath: string): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, size, size);

  const path = new Path2D(logoPath);
  const scale = (size * 0.5) / 400;

  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(scale, scale);
  ctx.translate(-200, -200);
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fill(path);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM CANDY SHADER
// ═══════════════════════════════════════════════════════════════════════════

const candyVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const candyFragmentShader = `
uniform float uTime;
uniform vec3 uBaseColor;
uniform vec3 uRimColor;
uniform float uFresnelPower;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vWorldPosition;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  
  return mix(
    mix(
      mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
      mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y
    ),
    mix(
      mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
      mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y
    ), f.z
  );
}

void main() {
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  vec3 normal = normalize(vNormal);
  
  float fresnel = pow(1.0 - max(dot(viewDirection, normal), 0.0), uFresnelPower);
  
  vec3 noiseCoord = vWorldPosition * 2.0 + vec3(uTime * 0.3);
  float noiseVal = noise(noiseCoord) * 0.5 + 0.5;
  
  vec3 noiseCoord2 = vWorldPosition * 4.0 - vec3(uTime * 0.2, 0.0, uTime * 0.15);
  float noiseVal2 = noise(noiseCoord2) * 0.5 + 0.5;
  
  float combinedNoise = mix(noiseVal, noiseVal2, 0.5);
  
  vec3 iridescenceColor1 = uBaseColor * 1.2;
  vec3 iridescenceColor2 = mix(uBaseColor, vec3(1.0), 0.3);
  vec3 iridescenceColor3 = uBaseColor * 0.85;
  
  float iridAngle = dot(viewDirection, normal);
  vec3 iridescence = mix(
    mix(iridescenceColor1, iridescenceColor2, combinedNoise),
    iridescenceColor3,
    pow(1.0 - iridAngle, 2.0)
  );
  
  vec3 candyColor = uBaseColor;
  candyColor = mix(candyColor, iridescence, 0.4 * combinedNoise);
  
  float liquidLight = pow(noiseVal, 3.0) * 0.6;
  candyColor += vec3(liquidLight) * 0.25;
  
  vec3 rimGlow = uRimColor * fresnel;
  candyColor += rimGlow * 1.2;
  
  vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5));
  float specular = pow(max(dot(reflect(-lightDir, normal), viewDirection), 0.0), 32.0);
  candyColor += vec3(specular * 0.5);
  
  vec3 lightDir2 = normalize(vec3(-0.3, 0.8, 0.3));
  float specular2 = pow(max(dot(reflect(-lightDir2, normal), viewDirection), 0.0), 64.0);
  candyColor += vec3(specular2 * 0.35);
  
  float subsurface = pow(max(dot(-viewDirection, normal), 0.0), 2.0) * 0.5;
  candyColor += uBaseColor * subsurface * 0.25;
  
  float alpha = 0.9 + fresnel * 0.1;
  
  gl_FragColor = vec4(candyColor, alpha);
}
`;

// ═══════════════════════════════════════════════════════════════════════════
// SHADER CANDY COIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface CandyCoinProps {
  baseColor: string;
  rimColor: string;
  logoPath: string;
}

function ShaderCandyCoin({ baseColor, rimColor, logoPath }: CandyCoinProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [logoTexture, setLogoTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    setLogoTexture(createLogoTexture(logoPath));
  }, [logoPath]);

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      positions.setY(i, y * 0.25);
    }
    positions.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  const logoGeometry = useMemo(() => new THREE.CircleGeometry(0.6, 64), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color(baseColor) },
      uRimColor: { value: new THREE.Color(rimColor) },
      uFresnelPower: { value: 3.0 },
    }),
    [baseColor, rimColor]
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
    }

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 1.2) * 0.06;
      groupRef.current.rotation.x = 0.4 + Math.sin(time * 0.8) * 0.05;
      groupRef.current.rotation.z = Math.sin(time * 0.6) * 0.03;
    }
  });

  return (
    <group ref={groupRef} scale={0.55}>
      <mesh geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={candyVertexShader}
          fragmentShader={candyFragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {logoTexture && (
        <mesh
          geometry={logoGeometry}
          position={[0, 0.26, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            map={logoTexture}
            transparent
            opacity={0.7}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCENE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface SceneProps {
  baseColor: string;
  rimColor: string;
  backgroundColor: string;
  shadowColor: string;
  logoPath: string;
}

function CandyScene({
  baseColor,
  rimColor,
  backgroundColor,
  shadowColor,
  logoPath,
}: SceneProps) {
  return (
    <>
      <color attach="background" args={[backgroundColor]} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 8, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-3, 4, -2]} intensity={1.2} color="#c4e5ff" />
      <pointLight position={[0, -2, 3]} intensity={1.5} color="#7dd3fc" />
      <pointLight position={[0, 5, 2]} intensity={1.2} color="#ffffff" />

      <ShaderCandyCoin
        baseColor={baseColor}
        rimColor={rimColor}
        logoPath={logoPath}
      />

      <ContactShadows
        position={[0, -0.4, 0]}
        opacity={0.3}
        scale={3}
        blur={2.5}
        far={1}
        color={shadowColor}
      />

      <Environment preset="studio" />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3D VIEWPORT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ViewportProps {
  baseColor: string;
  rimColor: string;
  backgroundColor: string;
  shadowColor: string;
  logoPath: string;
}

function Floating3DViewport({
  baseColor,
  rimColor,
  backgroundColor,
  shadowColor,
  logoPath,
}: ViewportProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <div
          className="w-8 h-8 rounded-full animate-spin"
          style={{
            border: `2px solid ${baseColor}40`,
            borderTopColor: baseColor,
          }}
        />
      </div>
    );
  }

  return (
    <Canvas
      camera={{
        position: [0, 1.5, 2.0],
        fov: 35,
      }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <CandyScene
          baseColor={baseColor}
          rimColor={rimColor}
          backgroundColor={backgroundColor}
          shadowColor={shadowColor}
          logoPath={logoPath}
        />
      </Suspense>
    </Canvas>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function Component({
  title = "3D Shader Card",
  description = "React Three Fiber component with custom GLSL shaders, fresnel rim glow, animated noise iridescence, and smooth bobbing motion.",
  buttonText = "Learn More",
  buttonHref = "/",
  baseColor = "#4db8ff",
  rimColor = "#a8e6ff",
  viewportBackground = "#e8f4fc",
  shadowColor = "#3b82f6",
  logoPath = DEFAULT_LOGO_PATH,
}: ShaderCardProps) {
  return (
    <div className="relative w-72 overflow-hidden rounded-3xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/10">
      {/* 3D Viewport area */}
      <div className="p-1.5 pb-0">
        <div
          className="relative h-56 w-full overflow-hidden rounded-2xl"
          style={{ background: viewportBackground }}
        >
          <Floating3DViewport
            baseColor={baseColor}
            rimColor={rimColor}
            backgroundColor={viewportBackground}
            shadowColor={shadowColor}
            logoPath={logoPath}
          />
        </div>
      </div>

      {/* Info section */}
      <div className="px-3 pb-6 pt-5">
        <h2
          className="text-[22px] font-medium tracking-[-0.02em] text-neutral-900 dark:text-white"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {title}
        </h2>

        <p
          className="mt-2 text-[11px] leading-[1.5] text-neutral-500 dark:text-neutral-400"
          style={{ fontFamily: "monospace", letterSpacing: "0.02em" }}
        >
          {description}
        </p>

        <a
          href={buttonHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg px-4 py-1.5 text-[11px] font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-400"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
}

export default Component;
