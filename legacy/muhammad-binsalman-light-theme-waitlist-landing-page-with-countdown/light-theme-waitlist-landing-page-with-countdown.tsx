import React from "react"
import type { ReactElement } from "react"
import { useState, useEffect, useRef } from "react"
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  QuadraticBezierCurve3,
  Vector3,
  TubeGeometry,
  ShaderMaterial,
  Mesh,
  AdditiveBlending,
  DoubleSide,
  Color,
  PlaneGeometry,
} from "three"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  text-primary-foreground h-10 px-4 py-2 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

export function WaitlistExperience(): ReactElement {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Scene>()
  const rendererRef = useRef<WebGLRenderer>()
  const animationIdRef = useRef<number>()

  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 225,
    hours: 23,
    minutes: 17,
    seconds: 58,
  })

  // Three.js background effect - Enhanced with more visible beams
  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new Scene()
    sceneRef.current = scene

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    rendererRef.current = renderer

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0xf8fafc, 0) // Set alpha to 0 for transparency
    mountRef.current.appendChild(renderer.domElement)

    // Create multiple curved light geometries for a more pronounced effect
    const curves = [
      new QuadraticBezierCurve3(
        new Vector3(-15, -3, 0),
        new Vector3(0, 1, 0),
        new Vector3(12, -2, 0) // Reduced right side extension
      ),
      new QuadraticBezierCurve3(
        new Vector3(-14, -2, 0),
        new Vector3(1, 2, 0),
        new Vector3(10, -1, 0) // Reduced right side extension
      ),
      new QuadraticBezierCurve3(
        new Vector3(-16, -4, 0),
        new Vector3(-1, 0.5, 0),
        new Vector3(11, -3, 0) // Reduced right side extension
      )
    ]

    // Create lighter and more subtle colors
    const colors = [
      new Color(0x88C1FF), // Very light blue
      new Color(0xA0D2FF), // Lighter blue
      new Color(0x78B6FF), // Soft blue
    ]

    // Create multiple light beams for a more pronounced effect
    curves.forEach((curve, index) => {
      // Create tube geometry for the light streak
      const tubeGeometry = new TubeGeometry(curve, 200, index === 0 ? 0.8 : 0.6, 32, false)

      // Create gradient material with lighter colors
      const vertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `

      const fragmentShader = `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Base color with reduced intensity
          vec3 baseColor = color;
          
          // Add subtle pulsing effect
          float pulse = sin(time * 1.5) * 0.1 + 0.9;
          
          // Create gradient effect from left to right
          float gradient = smoothstep(0.0, 1.0, vUv.x);
          
          // Center glow effect
          float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
          glow = pow(glow, 2.0);
          
          // Fade at the ends - more pronounced on the right
          float fade = 1.0;
          if (vUv.x > 0.7) {
            fade = 1.0 - smoothstep(0.7, 1.0, vUv.x);
          } else if (vUv.x < 0.2) {
            fade = smoothstep(0.0, 0.2, vUv.x);
          }
          
          // Final color with reduced intensity
          vec3 finalColor = baseColor * gradient * pulse * glow * fade * 0.8;
          
          gl_FragColor = vec4(finalColor, glow * fade * 0.6);
        }
      `

      const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          time: { value: 0 },
          color: { value: colors[index] }
        },
        transparent: true,
        blending: AdditiveBlending,
        side: DoubleSide,
      })

      const lightStreak = new Mesh(tubeGeometry, material)
      lightStreak.rotation.z = index * 0.15
      scene.add(lightStreak)
    })

    // Add background gradient plane with reduced opacity
    const backgroundGeometry = new PlaneGeometry(80, 55) // Smaller size to avoid right edge
    const backgroundMaterial = new ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          // Create a very light blue gradient from left to right
          vec3 blue1 = vec3(0.7, 0.85, 1.0);
          vec3 blue2 = vec3(0.6, 0.8, 1.0);
          vec3 blue3 = vec3(0.5, 0.75, 0.95);
          
          // Animate the gradient slightly
          float timeFactor = sin(time * 0.2) * 0.05;
          
          // Create gradient effect
          vec3 color = mix(blue1, blue2, vUv.x + timeFactor);
          color = mix(color, blue3, vUv.x * 0.3 + timeFactor);
          
          // Add subtle noise for texture
          float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 0.05;
          
          // Add blur effect using smoothstep
          float blur = smoothstep(0.0, 0.2, vUv.x) * (1.0 - smoothstep(0.8, 1.0, vUv.x));
          
          gl_FragColor = vec4(color + noise, 0.15 * blur);
        }
      `,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      side: DoubleSide,
    })

    const background = new Mesh(backgroundGeometry, backgroundMaterial)
    background.position.z = -5
    background.position.x = -2 // Shift slightly left to avoid right edge
    scene.add(background)

    // Position camera slightly to the left to avoid showing the right edge
    camera.position.z = 7
    camera.position.y = -0.8
    camera.position.x = -1

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001
      
      // Update all materials with time
      scene.traverse((object) => {
        if (object instanceof Mesh && object.material instanceof ShaderMaterial) {
          if (object.material.uniforms.time) {
            object.material.uniforms.time.value = time
          }
        }
      })

      // Very subtle rotation for dynamic effect
      scene.children.forEach((child, index) => {
        if (child instanceof Mesh && index < curves.length) {
          child.rotation.z = Math.sin(time * 0.1 + index * 0.5) * 0.05
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }

      renderer.dispose()
      
      // Dispose of all geometries and materials
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.geometry.dispose()
          if (object.material instanceof ShaderMaterial) {
            object.material.dispose()
          }
        }
      })
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else if (days > 0) {
          days--
          hours = 23
          minutes = 59
          seconds = 59
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      console.log("Email submitted:", email)
    }
  }

  const features = ["Features", "Pricing", "Beta", "Launch", "Updates", "Community"]

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-50">
      {/* Three.js Background */}
      <div ref={mountRef} className="fixed inset-0 w-full h-screen" style={{ zIndex: 0 }} />

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen">
        {/* Top Navigation */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center gap-6">
              <span className="text-slate-800 font-medium">Mysh.ai</span>
              <div className="flex items-center gap-4">
                {features.map((feature, index) => (
                  <button
                    key={feature}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      index === 2
                        ? "bg-slate-800 text-white border border-slate-300"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist Card */}
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="relative">
            <div className="relative backdrop-blur-xl bg-white/30 border border-slate-200/60 rounded-3xl p-8 w-[420px] shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-50/80 to-transparent pointer-events-none" />

              <div className="relative z-10">
                {!isSubmitted ? (
                  <>
                    <div className="mb-8 text-center">
                      <h1 className="text-4xl font-light text-slate-800 mb-4 tracking-wide">Join the waitlist</h1>
                      <p className="text-slate-600 text-base leading-relaxed">
                        Get early access to Mysh.ai - the intelligent
                        <br />
                        AI collaboration platform built for modern teams
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mb-6">
                      <div className="flex gap-3">
                        <Input
                          type="email"
                          placeholder="falana@21st.dev"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="flex-1 bg-white/60 border-slate-300 text-slate-800 placeholder:text-slate-500 focus:border-slate-400 focus:ring-slate-300 h-12 rounded-xl backdrop-blur-sm"
                        />
                        <Button
                          type="submit"
                          className="h-12 px-6 bg-slate-500 hover:bg-slate-700 text-white font-medium cursor-pointer rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl shadow-blue-500/25"
                        >
                          Sign Up
                        </Button>
                      </div>
                    </form>

                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                          M
                        </div>
                        <div className="w-8 h-8 rounded-full bg-emerald-700 border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                          B
                        </div>
                        <div className="w-8 h-8 rounded-full bg-purple-700 border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                          S
                        </div>
                      </div>
                      <span className="text-slate-600 text-sm">~ 20+ Teams already joined</span>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-center">
                      <div>
                        <div className="text-2xl font-light text-slate-800">{timeLeft.days}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">days</div>
                      </div>
                      <div className="text-slate-400">|</div>
                      <div>
                        <div className="text-2xl font-light text-slate-800">{timeLeft.hours}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">hours</div>
                      </div>
                      <div className="text-slate-400">|</div>
                      <div>
                        <div className="text-2xl font-light text-slate-800">{timeLeft.minutes}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">minutes</div>
                      </div>
                      <div className="text-slate-400">|</div>
                      <div>
                        <div className="text-2xl font-light text-slate-800">{timeLeft.seconds}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">seconds</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center border border-emerald-300">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">You're on the list!</h3>
                    <p className="text-slate-600 text-sm">We'll notify you when we launch. Thanks for joining!</p>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/10 to-white/20 pointer-events-none" />
            </div>

            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-xl scale-110 -z-10" />
          </div>
        </div>
      </div>
    </main>
  )
}