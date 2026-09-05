import React from "react"

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
} from "three"
import type { ReactElement } from "react"
import { useState, useEffect, useRef } from "react"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type= { type }
    className = {`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`
  }
        ref = { ref }
        { ...props }
  />
    )
  },
)
Input.displayName = "Input"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className= {`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${className}`
  }
        ref = { ref }
        { ...props }
  >
  { children }
  < /button>
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

  // Three.js background effect
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
    renderer.setClearColor(0x000000, 1)
    mountRef.current.appendChild(renderer.domElement)

    // Create curved light geometry
    const curve = new QuadraticBezierCurve3(new Vector3(-15, -4, 0), new Vector3(2, 3, 0), new Vector3(18, 0.8, 0))

    // Create tube geometry for the light streak
    const tubeGeometry = new TubeGeometry(curve, 200, 0.8, 32, false)

    // Create gradient material
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
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Create the gradient from red/orange to purple/magenta
        vec3 color1 = vec3(1.0, 0.2, 0.1); // Red/Orange
        vec3 color2 = vec3(0.8, 0.1, 0.6); // Purple/Magenta
        vec3 color3 = vec3(0.4, 0.05, 0.8); // Deep purple
        
        // Mix colors based on UV coordinates
        vec3 finalColor = mix(color1, color2, vUv.x);
        finalColor = mix(finalColor, color3, vUv.x * 0.7);
        
        // Add glow effect
        float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
        glow = pow(glow, 2.0);
        
        float fade = 1.0;
        if (vUv.x > 0.85) {
          fade = 1.0 - smoothstep(0.85, 1.0, vUv.x);
        }
        
        // Add subtle animation
        float pulse = sin(time * 2.0) * 0.1 + 0.9;
        
        gl_FragColor = vec4(finalColor * glow * pulse * fade, glow * fade * 0.8);
      }
    `

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
      },
      transparent: true,
      blending: AdditiveBlending,
      side: DoubleSide,
    })

    const lightStreak = new Mesh(tubeGeometry, material)
    scene.add(lightStreak)

    // Add additional glow layers for more realistic effect
    const glowGeometry = new TubeGeometry(curve, 200, 1.5, 32, false)
    const glowMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec3 color1 = vec3(1.0, 0.3, 0.2);
          vec3 color2 = vec3(0.6, 0.2, 0.8);
          
          vec3 finalColor = mix(color1, color2, vUv.x);
          
          float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
          glow = pow(glow, 4.0);
          
          float fade = 1.0;
          if (vUv.x > 0.85) {
            fade = 1.0 - smoothstep(0.85, 1.0, vUv.x);
          }
          
          float pulse = sin(time * 1.5) * 0.05 + 0.95;
          
          gl_FragColor = vec4(finalColor * glow * pulse * fade, glow * fade * 0.3);
        }
      `,
      uniforms: {
        time: { value: 0 },
      },
      transparent: true,
      blending: AdditiveBlending,
      side: DoubleSide,
    })

    const glowLayer = new Mesh(glowGeometry, glowMaterial)
    scene.add(glowLayer)

    // Position camera
    camera.position.z = 7
    camera.position.y = -0.8

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001
      material.uniforms.time.value = time
      glowMaterial.uniforms.time.value = time

      // Subtle rotation for dynamic effect
      lightStreak.rotation.z = Math.sin(time * 0.2) * 0.05
      glowLayer.rotation.z = Math.sin(time * 0.2) * 0.05

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
      tubeGeometry.dispose()
      glowGeometry.dispose()
      material.dispose()
      glowMaterial.dispose()
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

  const features = ["Community","Pricing", "Beta", "Launch", "Updates"]

  return (
    <main className= "relative min-h-screen overflow-hidden bg-black w-full" >
    {/* Three.js Background */ }
    < div ref = { mountRef } className = "fixed inset-0 w-full h-full" style = {{ zIndex: 0 }
} />

{/* Content Layer */ }
<div className="relative z-10 min-h-screen" >
  {/* Top Navigation */ }
  < div className = "absolute top-8 left-1/2 transform -translate-x-1/2 z-20" >
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6 py-3" >
      <div className="flex items-center gap-6" >
          < div className = "flex items-center gap-4" >
          {
            features.map((feature, index) => (
              <button
                    key= { feature }
                    className = {`text-sm px-3 py-1 rounded-full transition-colors ${index === 2
                  ? "bg-black/60 text-white border border-white/20"
                  : "text-white/60 hover:text-white/80"
                }`}
            >
            { feature }
            < /button>
                ))}
</div>
  < /div>
  < /div>
  < /div>

{/* Waitlist Card */ }
<div className="flex items-center justify-center min-h-screen px-4" >
  <div className="relative" >
    <div className="relative backdrop-blur-xl bg-black/60 border border-white/20 rounded-3xl p-8 w-[420px] shadow-2xl" >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        <div className="relative z-10" >
          {!isSubmitted ? (
            <>
            <div className= "mb-8 text-center" >
            <h1 className="text-4xl font-light text-white mb-4 tracking-wide" > Join the waitlist < /h1>
              < p className = "text-white/70 text-base leading-relaxed" >
                Get early access to Mysh AI - the next generation
                  < br />
                  workflow automation platform launching soon
                    < /p>
                    < /div>

                    < form onSubmit = { handleSubmit } className = "mb-6" >
                      <div className="flex gap-3" >
                        <Input
                          type="email"
placeholder = "saleem@21st.dev"
value = { email }
onChange = {(e) => setEmail(e.target.value)}
required
className = "flex-1 bg-black/40 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 h-12 rounded-xl backdrop-blur-sm"
  />
  <Button
                          type="submit"
className = "h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
  >
  Get Notified
    < /Button>
    < /div>
    < /form>

    < div className = "flex items-center justify-center gap-3 mb-6" >
      <div className="flex -space-x-2" >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white/20 flex items-center justify-center text-white text-xs font-medium" >
          J
          < /div>
          < div className = "w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white/20 flex items-center justify-center text-white text-xs font-medium" >
            A
            < /div>
            < div className = "w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white/20 flex items-center justify-center text-white text-xs font-medium" >
              M
              < /div>
              < /div>
              < span className = "text-white/70 text-sm" > ~2k + Peoples already joined < /span>
                < /div>

                < div className = "flex items-center justify-center gap-6 text-center" >
                  <div>
                  <div className="text-2xl font-light text-white" > { timeLeft.days } < /div>
                    < div className = "text-xs text-white/60 uppercase tracking-wide" > days < /div>
                      < /div>
                      < div className = "text-white/40" >| </div>
                        < div >
                        <div className="text-2xl font-light text-white" > { timeLeft.hours } < /div>
                          < div className = "text-xs text-white/60 uppercase tracking-wide" > hours < /div>
                            < /div>
                            < div className = "text-white/40" >| </div>
                              < div >
                              <div className="text-2xl font-light text-white" > { timeLeft.minutes } < /div>
                                < div className = "text-xs text-white/60 uppercase tracking-wide" > minutes < /div>
                                  < /div>
                                  < div className = "text-white/40" >| </div>
                                    < div >
                                    <div className="text-2xl font-light text-white" > { timeLeft.seconds } < /div>
                                      < div className = "text-xs text-white/60 uppercase tracking-wide" > seconds < /div>
                                        < /div>
                                        < /div>
                                        < />
                ) : (
  <div className= "text-center py-4" >
  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400/30 to-emerald-500/30 flex items-center justify-center border border-green-400/40" >
    <svg
                        className="w-8 h-8 text-green-400 drop-shadow-lg"
fill = "none"
stroke = "currentColor"
viewBox = "0 0 24 24"
  >
  <path strokeLinecap="round" strokeLinejoin = "round" strokeWidth = { 2} d = "M5 13l4 4L19 7" />
    </svg>
    < /div>
    < h3 className = "text-xl font-semibold text-white mb-2 drop-shadow-lg" > You're on the list!</h3>
      < p className = "text-white/90 text-sm drop-shadow-md" >
        We'll notify you when we launch. Thanks for joining!
          < /p>
          < /div>
                )}
</div>

  < div className = "absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none" />
    </div>

    < div className = "absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/10 to-purple-600/10 blur-xl scale-110 -z-10" />
      </div>
      < /div>
      < /div>
      < /main>
  )
}
