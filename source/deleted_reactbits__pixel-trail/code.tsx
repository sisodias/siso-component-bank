/* eslint-disable react/no-unknown-property */
import React, { useMemo, useEffect, FC } from "react"; // Added FC for functional component type
import { Canvas, useThree, CanvasProps, ThreeEvent } from "@react-three/fiber";
import { shaderMaterial, useTrailTexture } from "@react-three/drei";
import * as THREE from "three";

// Helper Interfaces
interface GooeyFilterProps {
  id?: string;
  strength?: number;
}

interface SceneProps {
  gridSize: number;
  trailSize: number;
  maxAge: number;
  interpolate: number;
  easingFunction: (x: number) => number;
  pixelColor: string;
}

// Main Component Interface
interface PixelTrailProps {
  gridSize?: number;
  trailSize?: number;
  maxAge?: number;
  interpolate?: number;
  easingFunction?: (x: number) => number;
  canvasProps?: Partial<CanvasProps>;
  glProps?: WebGLContextAttributes & { powerPreference?: string };
  gooeyFilter?: { id: string; strength: number };
  color?: string;
  className?: string; // For styling the <Canvas> element
}

// GooeyFilter Component
const GooeyFilter: FC<GooeyFilterProps> = ({
  id = "goo-filter",
  strength = 10,
}) => {
  return (
    <svg className="absolute w-0 h-0 overflow-hidden -z-10 pointer-events-none">
      <defs>
        <filter id={id}>
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={strength}
            result="blur"
          />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" // Standard goo effect matrix
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};

// Shader Material Definition
const DotMaterial = shaderMaterial(
  {
    // Uniforms
    resolution: new THREE.Vector2(),      // Canvas resolution
    mouseTrail: null,                     // Texture for mouse trail
    gridSize: 100,                        // Size of the grid for pixels
    pixelColor: new THREE.Color("#ffffff"), // Color of the pixels
  },
  // Vertex Shader
  `
    void main() {
      // Simple pass-through for a full-screen quad
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec2 resolution;
    uniform sampler2D mouseTrail;
    uniform float gridSize;
    uniform vec3 pixelColor; // RGB color

    // Helper to ensure UVs cover the screen correctly, maintaining aspect ratio
    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y); // Aspect ratio correction
      vec2 newUv = (uv - 0.5) * s + 0.5; // Center and scale
      return clamp(newUv, 0.0, 1.0); // Clamp to [0,1] range
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution; // Normalized screen coordinates [0,1]
      vec2 uv = coverUv(screenUv); // UVs corrected for aspect ratio

      // Calculate the center of the current grid cell
      vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;

      // Sample the mouse trail texture at the grid cell's center
      // The .r component (red channel) of the trail texture typically stores intensity
      float trailIntensity = texture2D(mouseTrail, gridUvCenter).r;

      // Output color: use the pixelColor uniform for RGB, and trailIntensity for alpha
      gl_FragColor = vec4(pixelColor, trailIntensity);
    }
  `
);

// TypeScript interface for the extended ShaderMaterial to satisfy R3F
interface DotMaterialExtended extends THREE.ShaderMaterial {
  uniforms: {
    resolution: { value: THREE.Vector2 };
    mouseTrail: { value: THREE.Texture | null };
    gridSize: { value: number };
    pixelColor: { value: THREE.Color };
  };
}

// Scene Component (Internal to PixelTrail)
function Scene({
  gridSize,
  trailSize,
  maxAge,
  interpolate,
  easingFunction,
  pixelColor, // String hex color
}: SceneProps) {
  const size = useThree((s) => s.size); // R3F hook for canvas size
  const viewport = useThree((s) => s.viewport); // R3F hook for viewport details

  // Memoize the shader material instance to prevent re-creation on every render
  const dotMaterialInstance = useMemo(() => {
    // Cast to 'any' then to 'DotMaterialExtended' to bypass constructor signature issues with shaderMaterial
    const mat = new (DotMaterial as any)() as DotMaterialExtended;
    mat.uniforms.pixelColor.value.set(pixelColor); // Set initial color
    return mat;
  }, []); // Empty dependency array means it's created only once

  // Effect to update the pixelColor uniform if the prop changes
  useEffect(() => {
    dotMaterialInstance.uniforms.pixelColor.value.set(pixelColor);
  }, [pixelColor, dotMaterialInstance]);

  // Effect to update the gridSize uniform if the prop changes
  useEffect(() => {
    dotMaterialInstance.uniforms.gridSize.value = gridSize;
  }, [gridSize, dotMaterialInstance]);

  // Effect to update the resolution uniform when canvas size or DPR changes
  useEffect(() => {
    dotMaterialInstance.uniforms.resolution.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
  }, [size, viewport.dpr, dotMaterialInstance]);

  // useTrailTexture hook from @react-three/drei to generate the mouse trail
  const [trailTexture, onPointerMoveHandler] = useTrailTexture({
    size: 512,         // Size of the internal trail texture
    radius: trailSize,   // Radius of the "brush" for the trail
    maxAge: maxAge,      // How long (in ms) a point stays on the trail
    interpolate: interpolate, // Number of interpolation steps for smoother trail
    ease: easingFunction,// Easing function for the trail points
  }) as [THREE.Texture | null, (e: ThreeEvent<PointerEvent>) => void]; // Type assertion

  // Effect to configure the trail texture and assign it to the material's uniform
  useEffect(() => {
    if (trailTexture) {
      trailTexture.minFilter = THREE.NearestFilter; // For pixelated look
      trailTexture.magFilter = THREE.NearestFilter; // For pixelated look
      trailTexture.wrapS = THREE.ClampToEdgeWrapping; // Prevent wrapping
      trailTexture.wrapT = THREE.ClampToEdgeWrapping; // Prevent wrapping
      dotMaterialInstance.uniforms.mouseTrail.value = trailTexture;
    }
  }, [trailTexture, dotMaterialInstance]);
  
  // Scale the plane mesh to cover the entire viewport
  const planeScale = Math.max(viewport.width, viewport.height);

  return (
    // A mesh that covers the screen, with the shader material
    <mesh 
      scale={[planeScale, planeScale, 1]} 
      onPointerMove={onPointerMoveHandler} // Attach pointer move handler for trail
    >
      <planeGeometry args={[1, 1]} /> {/* Unit plane, scaled by the mesh */}
      <primitive object={dotMaterialInstance} /> {/* Use the shader material */}
    </mesh>
  );
}

// PixelTrail Component (Named Export)
export const PixelTrail: FC<PixelTrailProps> = ({
  gridSize = 40,
  trailSize = 0.1,
  maxAge = 250,
  interpolate = 5,
  easingFunction = (x: number) => x, // Linear easing by default
  canvasProps = {},
  glProps = {
    antialias: false, // No antialiasing for a sharper pixel look
    powerPreference: "high-performance",
    alpha: true, // Important: makes canvas background transparent
  },
  gooeyFilter,
  color = "#ffffff", // Default color if not provided
  className = "",   // Class for the <Canvas> element
}: PixelTrailProps) => {
  // Ensure a unique ID for the goo filter if multiple instances are used
  const filterId = gooeyFilter ? gooeyFilter.id : "default-goo-filter-pixel-trail"; 
  
  return (
    <>
      {gooeyFilter && (
        <GooeyFilter id={filterId} strength={gooeyFilter.strength} />
      )}
      <Canvas
        {...canvasProps} // Spread any additional canvas props
        gl={glProps}     // Spread WebGL context attributes
        className={`absolute inset-0 w-full h-full z-10 ${className}`} // Canvas fills parent, on top
        style={gooeyFilter ? { filter: `url(#${filterId})` } : {}} // Apply goo filter if enabled
        orthographic // Use orthographic camera for a 2D pixel effect
        camera={{ near: 0.1, far: 1000, position: [0, 0, 100] }} // Configure camera
      >
        <Scene
          gridSize={gridSize}
          trailSize={trailSize}
          maxAge={maxAge}
          interpolate={interpolate}
          easingFunction={easingFunction}
          pixelColor={color} // Pass the color to the scene
        />
      </Canvas>
    </>
  );
};