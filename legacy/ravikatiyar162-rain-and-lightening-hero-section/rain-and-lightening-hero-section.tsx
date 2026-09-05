"use client"

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  memo,
} from "react"
import { cn } from "../_utils/cn"

// Interfaces for component props and internal state
interface RainDrop {
  id: number
  left: number
  animationDuration: number
  opacity: number
  size: number
  delay: number
}

interface LightningBolt {
  id: number
  type: "flash" | "bolt"
  intensity: number
  duration: number
}

interface WeatherEffectProps {
  // Rain props
  rainIntensity?: number
  rainSpeed?: number
  rainColor?: string
  rainAngle?: number
  rainDropSize?: { min: number; max: number }

  // Lightning props
  lightningEnabled?: boolean
  lightningFrequency?: number // In seconds
  lightningHue?: number
  lightningXOffset?: number
  lightningSpeed?: number
  lightningIntensity?: number
  lightningSize?: number

  // Thunder props
  thunderEnabled?: boolean
  thunderVolume?: number
  thunderDelay?: number // In seconds

  className?: string
  children?: React.ReactNode
}

// WebGL Lightning Component - Renders the visual bolt effect
const Lightning: React.FC<
  Pick<
    WeatherEffectProps,
    | "lightningHue"
    | "lightningXOffset"
    | "lightningSpeed"
    | "lightningIntensity"
    | "lightningSize"
  >
> = memo(
  ({
    lightningHue = 230,
    lightningXOffset = 0,
    lightningSpeed = 1,
    lightningIntensity = 1,
    lightningSize = 1,
  }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const gl = canvas.getContext("webgl")
      if (!gl) {
        console.error("WebGL is not supported in this browser.")
        return
      }

      let animationFrameId: number

      const resizeCanvas = () => {
        if (
          canvas.parentElement &&
          canvas.parentElement.clientWidth > 0 &&
          canvas.parentElement.clientHeight > 0
        ) {
          canvas.width = canvas.parentElement.clientWidth
          canvas.height = canvas.parentElement.clientHeight
        } else {
          canvas.width = canvas.clientWidth
          canvas.height = canvas.clientHeight
        }
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      }

      window.addEventListener("resize", resizeCanvas)
      resizeCanvas()

      const vertexShaderSource = `
        attribute vec2 aPosition;
        void main() {
          gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `
      const fragmentShaderSource = `
        precision mediump float;
        uniform vec2 iResolution;
        uniform float iTime;
        uniform float uHue;
        uniform float uXOffset;
        uniform float uSpeed;
        uniform float uIntensity;
        uniform float uSize;
        
        #define OCTAVE_COUNT 10

        vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
        }

        float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
        }

        float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
        }

        mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
            value += amplitude * noise(p);
            p *= rotate2d(0.45);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;
          
          uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
          
          float dist = abs(uv.x);
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
          gl_FragColor = vec4(pow(col, vec3(1.0)), 1.0);
        }
      `

      const compileShader = (source: string, type: number): WebGLShader | null => {
        const shader = gl.createShader(type)
        if (!shader) return null
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error(`Shader compile error:`, gl.getShaderInfoLog(shader))
          gl.deleteShader(shader)
          return null
        }
        return shader
      }

      const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER)
      const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)

      if (!vertexShader || !fragmentShader) return

      const program = gl.createProgram()
      if (!program) return
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program linking error:", gl.getProgramInfoLog(program))
        return
      }
      gl.useProgram(program)

      const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
      const vertexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

      const aPosition = gl.getAttribLocation(program, "aPosition")
      gl.enableVertexAttribArray(aPosition)
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

      const iResolutionLocation = gl.getUniformLocation(program, "iResolution")
      const iTimeLocation = gl.getUniformLocation(program, "iTime")
      const uHueLocation = gl.getUniformLocation(program, "uHue")
      const uXOffsetLocation = gl.getUniformLocation(program, "uXOffset")
      const uSpeedLocation = gl.getUniformLocation(program, "uSpeed")
      const uIntensityLocation = gl.getUniformLocation(program, "uIntensity")
      const uSizeLocation = gl.getUniformLocation(program, "uSize")

      const startTime = performance.now()

      const renderLoop = () => {
        if (!gl.isContextLost()) {
          gl.uniform2f(iResolutionLocation, gl.canvas.width, gl.canvas.height)
          gl.uniform1f(iTimeLocation, (performance.now() - startTime) / 1000.0)
          gl.uniform1f(uHueLocation, lightningHue)
          gl.uniform1f(uXOffsetLocation, lightningXOffset)
          gl.uniform1f(uSpeedLocation, lightningSpeed)
          gl.uniform1f(uIntensityLocation, lightningIntensity)
          gl.uniform1f(uSizeLocation, lightningSize)
          gl.drawArrays(gl.TRIANGLES, 0, 6)
        }
        animationFrameId = requestAnimationFrame(renderLoop)
      }

      renderLoop()

      return () => {
        window.removeEventListener("resize", resizeCanvas)
        cancelAnimationFrame(animationFrameId)
        if (!gl.isContextLost()) {
          gl.deleteProgram(program)
          gl.deleteShader(vertexShader)
          gl.deleteShader(fragmentShader)
          gl.deleteBuffer(vertexBuffer)
        }
      }
    }, [
      lightningHue,
      lightningXOffset,
      lightningSpeed,
      lightningIntensity,
      lightningSize,
    ])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
  }
)

Lightning.displayName = "Lightning"

// Main Weather Effect Component
export const WeatherEffect: React.FC<WeatherEffectProps> = ({
  rainIntensity = 50,
  rainSpeed = 0.2,
  rainColor = "rgba(174, 194, 224, 0.6)",
  rainAngle = 10,
  rainDropSize = { min: 1, max: 2 },
  lightningEnabled = true,
  lightningFrequency = 4,
  lightningHue,
  lightningXOffset,
  lightningSpeed,
  lightningIntensity,
  lightningSize,
  thunderEnabled = true,
  thunderVolume = 0.5,
  thunderDelay = 2,
  className,
  children,
}) => {
  const [raindrops, setRaindrops] = useState<RainDrop[]>([])
  const [lightning, setLightning] = useState<LightningBolt | null>(null)
  const thunderAudioRef = useRef<HTMLAudioElement | null>(null)
  const lightningTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize thunder audio
  useEffect(() => {
    if (thunderEnabled && typeof window !== "undefined") {
      const audio = new Audio()
      audio.volume = thunderVolume
      audio.src =
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
      thunderAudioRef.current = audio
    }
  }, [thunderEnabled, thunderVolume])

  // Generate raindrops
  useEffect(() => {
    const drops: RainDrop[] = Array.from({ length: rainIntensity }).map(
      (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDuration: (Math.random() * 1 + 0.5) / rainSpeed,
        opacity: Math.random() * 0.6 + 0.2,
        size:
          Math.random() * (rainDropSize.max - rainDropSize.min) +
          rainDropSize.min,
        delay: Math.random() * 2,
      })
    )
    setRaindrops(drops)
  }, [rainIntensity, rainSpeed, rainDropSize])

  // Lightning trigger logic
  const triggerLightning = useCallback(() => {
    if (!lightningEnabled) return

    const newLightning: LightningBolt = {
      id: Date.now(),
      type: "flash",
      intensity: Math.random() * 0.8 + 0.2,
      duration: 200 + Math.random() * 300,
    }

    setLightning(newLightning)

    setTimeout(() => {
      setLightning(null)
    }, newLightning.duration)

    if (thunderEnabled && thunderAudioRef.current) {
      setTimeout(() => {
        if (thunderAudioRef.current) {
          thunderAudioRef.current.currentTime = 0
          thunderAudioRef.current.play().catch(console.error)
        }
      }, thunderDelay * 1000)
    }

    const nextStrike =
      (lightningFrequency + Math.random() * lightningFrequency) * 1000
    lightningTimeoutRef.current = setTimeout(triggerLightning, nextStrike)
  }, [lightningEnabled, lightningFrequency, thunderEnabled, thunderDelay])

  // Start the lightning cycle
  useEffect(() => {
    if (lightningEnabled) {
      const initialDelay = Math.random() * lightningFrequency * 1000
      lightningTimeoutRef.current = setTimeout(triggerLightning, initialDelay)
    }
    return () => {
      if (lightningTimeoutRef.current) {
        clearTimeout(lightningTimeoutRef.current)
      }
    }
  }, [lightningEnabled, triggerLightning, lightningFrequency])

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* WebGL Lightning Layer - Now only renders during a flash for a sudden effect */}
      {lightningEnabled && lightning && (
        <div className="absolute inset-0 z-10">
          <Lightning
            lightningHue={lightningHue}
            lightningXOffset={lightningXOffset}
            lightningSpeed={lightningSpeed}
            lightningIntensity={lightningIntensity}
            lightningSize={lightningSize}
          />
        </div>
      )}

      {/* Screen Flash Effect */}
      {lightning && (
        <div
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            background: `radial-gradient(circle, hsl(var(--background) / ${lightning.intensity}) 0%, hsl(var(--background) / 0) 100%)`,
            animation: `lightning-flash ${lightning.duration}ms ease-out forwards`,
          }}
        />
      )}

      {/* Rain Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          transform: `rotate(${rainAngle}deg)`,
          transformOrigin: "center center",
        }}
      >
        {raindrops.map(drop => (
          <div
            key={drop.id}
            className="absolute top-[-20px]"
            style={{
              left: `${drop.left}%`,
              width: `${drop.size}px`,
              height: `${drop.size * 10}px`,
              background: `linear-gradient(to bottom, transparent, ${rainColor})`,
              borderRadius: `${drop.size}px`,
              animation: `rain-fall ${drop.animationDuration}s linear infinite`,
              animationDelay: `${drop.delay}s`,
              opacity: drop.opacity,
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-40 flex h-full items-center justify-center">
        {children}
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes rain-fall {
          0% { transform: translateY(-20px); }
          100% { transform: translateY(calc(100vh + 20px)); }
        }
        @keyframes lightning-flash {
          0%, 100% { opacity: 0; }
          10%, 30% { opacity: 1; }
          20% { opacity: 0.3; }
          40% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

WeatherEffect.displayName = "WeatherEffect"
