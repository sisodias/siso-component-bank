"use client"

import * as THREE from "three"
import { useMemo, useState, useRef } from "react"
import { createPortal, useFrame, Canvas } from "@react-three/fiber"
import { useFBO, Effects } from "@react-three/drei"
import { useControls } from "leva"
import * as easing from "maath/easing"

// Shader utility - periodic noise GLSL
const periodicNoiseGLSL = /* glsl */ `
  // Periodic noise function using sine and cosine waves
  float periodicNoise(vec3 p, float time) {
    // Create multiple frequency components for more complex movement
    // All time multipliers are integer values to ensure perfect 2π periodicity
    float noise = 0.0;
    
    // Primary wave - period = 2π
    noise += sin(p.x * 2.0 + time) * cos(p.z * 1.5 + time);
    
    // Secondary wave - period = π (time * 2)
    noise += sin(p.x * 3.2 + time * 2.0) * cos(p.z * 2.1 + time) * 0.6;
    
    // Tertiary wave - period = 2π/3 (time * 3)
    noise += sin(p.x * 1.7 + time) * cos(p.z * 2.8 + time * 3.0) * 0.4;
    
    // Cross-frequency interaction - period = π (time * 2)
    noise += sin(p.x * p.z * 0.5 + time * 2.0) * 0.3;
    
    return noise * 0.3; // Scale down the result
  }
`

// Vignette Shader
const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    darkness: { value: 1.0 },
    offset: { value: 1.0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float darkness;
    uniform float offset;
    varying vec2 vUv;
    
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      
      vec2 uv = (vUv - 0.5) * 2.0;
      float dist = dot(uv, uv);
      
      float vignette = 1.0 - smoothstep(offset, offset + darkness, dist);
      
      gl_FragColor = vec4(texel.rgb * vignette, texel.a);
    }
  `,
}

// DOF Points Material
class DofPointsMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: /* glsl */ `
      uniform sampler2D positions;
      uniform sampler2D initialPositions;
      uniform float uTime;
      uniform float uFocus;
      uniform float uFov;
      uniform float uBlur;
      uniform float uPointSize;
      varying float vDistance;
      varying float vPosY;
      varying vec3 vWorldPosition;
      varying vec3 vInitialPosition;
      void main() { 
        vec3 pos = texture2D(positions, position.xy).xyz;
        vec3 initialPos = texture2D(initialPositions, position.xy).xyz;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vDistance = abs(uFocus - -mvPosition.z);
        vPosY = pos.y;
        vWorldPosition = pos;
        vInitialPosition = initialPos;
        gl_PointSize = max(vDistance * uBlur * uPointSize, 3.0);
      }`,
      fragmentShader: /* glsl */ `
      uniform float uOpacity;
      uniform float uRevealFactor;
      uniform float uRevealProgress;
      uniform float uTime;
      varying float vDistance;
      varying float vPosY;
      varying vec3 vWorldPosition;
      varying vec3 vInitialPosition;
      uniform float uTransition;

      ${periodicNoiseGLSL}

      float sparkleNoise(vec3 seed, float time) {
        float hash = sin(seed.x * 127.1 + seed.y * 311.7 + seed.z * 74.7) * 43758.5453;
        hash = fract(hash);
        
        float slowTime = time * 1.0;
        
        float sparkle = 0.0;
        sparkle += sin(slowTime + hash * 6.28318) * 0.5;
        sparkle += sin(slowTime * 1.7 + hash * 12.56636) * 0.3;
        sparkle += sin(slowTime * 0.8 + hash * 18.84954) * 0.2;
        
        float hash2 = sin(seed.x * 113.5 + seed.y * 271.9 + seed.z * 97.3) * 37849.3241;
        hash2 = fract(hash2);
        
        float sparkleMask = sin(hash2 * 6.28318) * 0.7;
        sparkleMask += sin(hash2 * 12.56636) * 0.3;
        
        if (sparkleMask < 0.3) {
          sparkle *= 0.05;
        }
        
        float normalizedSparkle = (sparkle + 1.0) * 0.5;
        float smoothCurve = pow(normalizedSparkle, 4.0);
        float blendFactor = normalizedSparkle * normalizedSparkle;
        float finalBrightness = mix(normalizedSparkle, smoothCurve, blendFactor);
        
        return 0.7 + finalBrightness * 1.3;
      }

      float sdCircle(vec2 p, float r) {
        return length(p) - r;
      }

      void main() {
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        
        float sdf = sdCircle(cxy, 0.5);
        
        if (sdf > 0.0) discard;

        float distanceFromCenter = length(vWorldPosition.xz);
        
        float noiseValue = periodicNoise(vInitialPosition * 4.0, 0.0);
        float revealThreshold = uRevealFactor + noiseValue * 0.3;
        
        float revealMask = 1.0 - smoothstep(revealThreshold - 0.2, revealThreshold + 0.1, distanceFromCenter);
        
        float sparkleBrightness = sparkleNoise(vInitialPosition, uTime);
        
        float alpha = (1.04 - clamp(vDistance, 0.0, 1.0)) * clamp(smoothstep(-0.5, 0.25, vPosY), 0.0, 1.0) * uOpacity * revealMask * uRevealProgress * sparkleBrightness;

        gl_FragColor = vec4(vec3(1.0), mix(alpha, sparkleBrightness - 1.1, uTransition));
      }`,
      uniforms: {
        positions: { value: null },
        initialPositions: { value: null },
        uTime: { value: 0 },
        uFocus: { value: 5.1 },
        uFov: { value: 50 },
        uBlur: { value: 30 },
        uTransition: { value: 0.0 },
        uPointSize: { value: 2.0 },
        uOpacity: { value: 1.0 },
        uRevealFactor: { value: 0.0 },
        uRevealProgress: { value: 0.0 },
      },
      transparent: true,
      depthWrite: false,
    })
  }
}

// Simulation Material
function getPlane(count: number, components: number, size = 512, scale = 1.0) {
  const length = count * components
  const data = new Float32Array(length)

  for (let i = 0; i < count; i++) {
    const i4 = i * components

    const x = (i % size) / (size - 1)
    const z = Math.floor(i / size) / (size - 1)

    data[i4 + 0] = (x - 0.5) * 2 * scale
    data[i4 + 1] = 0
    data[i4 + 2] = (z - 0.5) * 2 * scale
    data[i4 + 3] = 1.0
  }

  return data
}

class SimulationMaterial extends THREE.ShaderMaterial {
  constructor(scale = 10.0) {
    const positionsTexture = new THREE.DataTexture(
      getPlane(512 * 512, 4, 512, scale),
      512,
      512,
      THREE.RGBAFormat,
      THREE.FloatType,
    )
    positionsTexture.needsUpdate = true

    super({
      vertexShader: /* glsl */ `varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
      fragmentShader: /* glsl */ `uniform sampler2D positions;
      uniform float uTime;
      uniform float uNoiseScale;
      uniform float uNoiseIntensity;
      uniform float uTimeScale;
      uniform float uLoopPeriod;
      varying vec2 vUv;

      ${periodicNoiseGLSL}

      void main() {
        vec3 originalPos = texture2D(positions, vUv).rgb;
        
        float continuousTime = uTime * uTimeScale * (6.28318530718 / uLoopPeriod);
        
        vec3 noiseInput = originalPos * uNoiseScale;
        
        float displacementX = periodicNoise(noiseInput + vec3(0.0, 0.0, 0.0), continuousTime);
        float displacementY = periodicNoise(noiseInput + vec3(50.0, 0.0, 0.0), continuousTime + 2.094);
        float displacementZ = periodicNoise(noiseInput + vec3(0.0, 50.0, 0.0), continuousTime + 4.188);
        
        vec3 distortion = vec3(displacementX, displacementY, displacementZ) * uNoiseIntensity;
        vec3 finalPos = originalPos + distortion;
        
        gl_FragColor = vec4(finalPos, 1.0);
      }`,
      uniforms: {
        positions: { value: positionsTexture },
        uTime: { value: 0 },
        uNoiseScale: { value: 1.0 },
        uNoiseIntensity: { value: 0.5 },
        uTimeScale: { value: 1 },
        uLoopPeriod: { value: 24.0 },
      },
    })
  }
}

// Particles Component
function Particles({
  speed,
  aperture,
  focus,
  size = 512,
  noiseScale = 1.0,
  noiseIntensity = 0.5,
  timeScale = 0.5,
  pointSize = 2.0,
  opacity = 1.0,
  planeScale = 1.0,
  useManualTime = false,
  manualTime = 0,
  introspect = false,
  ...props
}: {
  speed: number
  aperture: number
  focus: number
  size: number
  noiseScale?: number
  noiseIntensity?: number
  timeScale?: number
  pointSize?: number
  opacity?: number
  planeScale?: number
  useManualTime?: boolean
  manualTime?: number
  introspect?: boolean
}) {
  const revealStartTime = useRef<number | null>(null)
  const [isRevealing, setIsRevealing] = useState(true)
  const revealDuration = 3.5

  const simulationMaterial = useMemo(() => {
    return new SimulationMaterial(planeScale)
  }, [planeScale])

  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  })

  const dofPointsMaterial = useMemo(() => {
    const m = new DofPointsMaterial()
    m.uniforms.positions.value = target.texture
    m.uniforms.initialPositions.value = simulationMaterial.uniforms.positions.value
    return m
  }, [simulationMaterial])

  const [scene] = useState(() => new THREE.Scene())
  const [camera] = useState(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1))
  const [positions] = useState(() => new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]))
  const [uvs] = useState(() => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]))

  const particles = useMemo(() => {
    const length = size * size
    const particles = new Float32Array(length * 3)
    for (let i = 0; i < length; i++) {
      const i3 = i * 3
      particles[i3 + 0] = (i % size) / size
      particles[i3 + 1] = i / size / size
    }
    return particles
  }, [size])

  useFrame((state, delta) => {
    if (!dofPointsMaterial || !simulationMaterial) return

    state.gl.setRenderTarget(target)
    state.gl.clear()
    // @ts-ignore
    state.gl.render(scene, camera)
    state.gl.setRenderTarget(null)

    const currentTime = useManualTime ? manualTime : state.clock.elapsedTime

    if (revealStartTime.current === null) {
      revealStartTime.current = currentTime
    }

    const revealElapsed = currentTime - revealStartTime.current
    const revealProgress = Math.min(revealElapsed / revealDuration, 1.0)

    const easedProgress = 1 - Math.pow(1 - revealProgress, 3)

    const revealFactor = easedProgress * 4.0

    if (revealProgress >= 1.0 && isRevealing) {
      setIsRevealing(false)
    }

    dofPointsMaterial.uniforms.uTime.value = currentTime

    dofPointsMaterial.uniforms.uFocus.value = focus
    dofPointsMaterial.uniforms.uBlur.value = aperture

    easing.damp(dofPointsMaterial.uniforms.uTransition, "value", introspect ? 1.0 : 0.0, introspect ? 0.35 : 0.2, delta)

    simulationMaterial.uniforms.uTime.value = currentTime
    simulationMaterial.uniforms.uNoiseScale.value = noiseScale
    simulationMaterial.uniforms.uNoiseIntensity.value = noiseIntensity
    simulationMaterial.uniforms.uTimeScale.value = timeScale * speed

    dofPointsMaterial.uniforms.uPointSize.value = pointSize
    dofPointsMaterial.uniforms.uOpacity.value = opacity
    dofPointsMaterial.uniforms.uRevealFactor.value = revealFactor
    dofPointsMaterial.uniforms.uRevealProgress.value = easedProgress
  })

  return (
    <>
      {createPortal(
        // @ts-ignore
        <mesh material={simulationMaterial}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-uv" args={[uvs, 2]} />
          </bufferGeometry>
        </mesh>,
        // @ts-ignore
        scene,
      )}
      {/* @ts-ignore */}
      <points material={dofPointsMaterial} {...props}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
      </points>
    </>
  )
}

// Main GL Component
export function GL({ hovering }: { hovering: boolean }) {
  const {
    speed,
    focus,
    aperture,
    size,
    noiseScale,
    noiseIntensity,
    timeScale,
    pointSize,
    opacity,
    planeScale,
    vignetteDarkness,
    vignetteOffset,
    useManualTime,
    manualTime,
  } = useControls("Particle System", {
    speed: { value: 1.0, min: 0, max: 2, step: 0.01 },
    noiseScale: { value: 0.6, min: 0.1, max: 5, step: 0.1 },
    noiseIntensity: { value: 0.52, min: 0, max: 2, step: 0.01 },
    timeScale: { value: 1, min: 0, max: 2, step: 0.01 },
    focus: { value: 3.8, min: 0.1, max: 20, step: 0.1 },
    aperture: { value: 1.79, min: 0, max: 2, step: 0.01 },
    pointSize: { value: 10.0, min: 0.1, max: 10, step: 0.1 },
    opacity: { value: 0.8, min: 0, max: 1, step: 0.01 },
    planeScale: { value: 10.0, min: 0.1, max: 10, step: 0.1 },
    size: {
      value: 512,
      options: [256, 512, 1024],
    },
    showDebugPlane: { value: false },
    vignetteDarkness: { value: 1.5, min: 0, max: 2, step: 0.1 },
    vignetteOffset: { value: 0.4, min: 0, max: 2, step: 0.1 },
    useManualTime: { value: false },
    manualTime: { value: 0, min: 0, max: 50, step: 0.01 },
  })

  return (
    <div id="webgl" className="min-h-screen w-full absolute inset-0 z-0">
      <Canvas
        camera={{
          position: [1.2629783123314589, 2.664606471394044, -1.8178993743288914],
          fov: 50,
          near: 0.01,
          far: 300,
        }}
      >
        <color attach="background" args={["#000"]} />
        <Particles
          speed={speed}
          aperture={aperture}
          focus={focus}
          size={size}
          noiseScale={noiseScale}
          noiseIntensity={noiseIntensity}
          timeScale={timeScale}
          pointSize={pointSize}
          opacity={opacity}
          planeScale={planeScale}
          useManualTime={useManualTime}
          manualTime={manualTime}
          introspect={hovering}
        />
        <Effects multisamping={0} disableGamma>
          <shaderPass
            args={[VignetteShader]}
            uniforms-darkness-value={vignetteDarkness}
            uniforms-offset-value={vignetteOffset}
          />
        </Effects>
      </Canvas>
    </div>
  )
}
