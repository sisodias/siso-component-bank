"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

const vertexShader = `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
`

const fragmentShader = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_intensity;
  
  // Advanced noise functions
  vec3 hash3(vec2 p) {
    vec3 q = vec3(dot(p, vec2(127.1, 311.7)), 
                  dot(p, vec2(269.5, 183.3)), 
                  dot(p, vec2(419.2, 371.9)));
    return fract(sin(q) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0); // Improved smoothstep
    return mix(mix(dot(hash3(i + vec2(0.0,0.0)).xy, f - vec2(0.0,0.0)), 
                   dot(hash3(i + vec2(1.0,0.0)).xy, f - vec2(1.0,0.0)), u.x),
               mix(dot(hash3(i + vec2(0.0,1.0)).xy, f - vec2(0.0,1.0)), 
                   dot(hash3(i + vec2(1.0,1.0)).xy, f - vec2(1.0,1.0)), u.x), u.y);
  }
  
  float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 0.25;
    
    for(int i = 0; i < 10; i++) {
      if(i >= octaves) break;
      value += amplitude * noise(p * frequency);
      amplitude *= 0.52;
      frequency *= 1.13;
    }
    return value;
  }
  
  // Smooth voronoi
  float voronoi(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float md = 50.0;
    
    for(int i = -2; i <= 2; i++) {
      for(int j = -2; j <= 2; j++) {
        vec2 g = vec2(i, j);
        vec2 o = hash3(n + g).xy;
        o = 0.5 + 0.41 * sin(u_time * 1.5 + 6.28 * o);
        vec2 r = g + o - f;
        float d = dot(r, r);
        md = min(md, d);
      }
    }
    return sqrt(md);
  }
  
  // Smooth plasma
  float plasma(vec2 p, float time) {
    float a = sin(p.x * 8.0 + time * 2.0);
    float b = sin(p.y * 8.0 + time * 1.7);
    float c = sin((p.x + p.y) * 6.0 + time * 1.3);
    float d = sin(sqrt(p.x * p.x + p.y * p.y) * 8.0 + time * 2.3);
    return (a + b + c + d) * 0.5;
  }
  
  // Curl noise for fluid motion
  vec2 curl(vec2 p, float time) {
    float eps = 0.5;
    float n1 = fbm(p + vec2(eps, 0.0), 6);
    float n2 = fbm(p - vec2(eps, 0.0), 6);
    float n3 = fbm(p + vec2(0.0, eps), 6);
    float n4 = fbm(p - vec2(0.0, eps), 6);
    
    return vec2((n3 - n4) / (2.0 * eps), (n2 - n1) / (2.0 * eps));
  }

  // Film grain
  float grain(vec2 uv, float time) {
    vec2 seed = uv * time;
    return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 st = (uv - 0.5) * 2.0;
    st.x *= u_resolution.x / u_resolution.y;
    
    float time = u_time * 0.25; // Reduced from 0.4 for smoother animation
    
    // Fluid motion using curl noise
    vec2 curlForce = curl(st * 2.0, time) * 0.6;
    vec2 flowField = st + curlForce;
    
    // Multiple smooth distortion layers
    float dist1 = fbm(flowField * 1.5 + time * 1.2, 8) * 0.4;
    float dist2 = fbm(flowField * 2.3 - time * 0.8, 6) * 0.3;
    float dist3 = fbm(flowField * 3.1 + time * 1.8, 4) * 0.2;
    float dist4 = fbm(flowField * 4.7 - time * 1.1, 3) * 0.15;
    
    // Smooth voronoi cellular structure
    float cells = voronoi(flowField * 2.5 + time * 0.5);
    cells = smoothstep(0.1, 0.7, cells);
    
    // Enhanced plasma effect
    float plasmaEffect = plasma(flowField + vec2(dist1, dist2), time * 1.5) * 0.2;
    
    // Combined smooth distortion
    float totalDist = dist1 + dist2 + dist3 + dist4 + plasmaEffect;
    
    // Smooth vertical streaks with multiple frequencies
    float streak1 = sin((st.x + totalDist) * 15.0 + time * 3.0) * 0.5 + 0.5;
    float streak2 = sin((st.x + totalDist * 0.7) * 25.0 - time * 2.0) * 0.5 + 0.5;
    float streak3 = sin((st.x + totalDist * 1.3) * 35.0 + time * 4.0) * 0.5 + 0.5;
    
    // Smooth power curves for streaks
    streak1 = smoothstep(0.3, 0.7, streak1);
    streak2 = smoothstep(0.2, 0.8, streak2);
    streak3 = smoothstep(0.4, 0.6, streak3);
    
    float combinedStreaks = streak1 * 0.6 + streak2 * 0.4 + streak3 * 0.5;
    
    // Multiple smooth flowing shapes
    float shape1 = 1.0 - abs(st.x + totalDist * 0.6);
    float shape2 = 1.0 - abs(st.x + totalDist * 0.4 + sin(st.y * 3.0 + time) * 0.15);
    float shape3 = 1.0 - abs(st.x + totalDist * 0.8 + cos(st.y * 2.0 - time) * 0.1);
    
    shape1 = smoothstep(0.0, 1.0, shape1);
    shape2 = smoothstep(0.1, 0.9, shape2);
    shape3 = smoothstep(0.2, 0.8, shape3);
    
    float finalShape = max(shape1 * 0.8, max(shape2 * 0.6, shape3 * 0.4));
    
    // Enhanced dramatic color palette
    vec3 color1 = vec3(1.0, 0.1, 0.6);   // Hot pink
    vec3 color2 = vec3(1.0, 0.3, 0.1);   // Electric orange
    vec3 color3 = vec3(0.9, 0.1, 1.0);   // Electric purple
    vec3 color4 = vec3(0.1, 0.5, 1.0);   // Electric blue
    vec3 color5 = vec3(0.1, 1.0, 0.9);   // Electric cyan
    vec3 color6 = vec3(0.3, 0.1, 0.9);   // Deep purple
    vec3 color7 = vec3(1.0, 0.8, 0.1);   // Electric yellow
    
    // Smooth color transitions
    float gradient = 1.0 - uv.y;
    float colorNoise = fbm(flowField * 3.0 + time * 0.5, 4) * 0.5 + 0.5;
    float colorShift = sin(time * 1.5 + st.y * 2.0) * 0.5 + 0.5;
    
    vec3 finalColor;
    
    // Smooth multi-layer color blending
    float t1 = smoothstep(0.85, 1.0, gradient);
    float t2 = smoothstep(0.7, 0.85, gradient);
    float t3 = smoothstep(0.5, 0.7, gradient);
    float t4 = smoothstep(0.3, 0.5, gradient);
    float t5 = smoothstep(0.15, 0.3, gradient);
    float t6 = smoothstep(0.0, 0.15, gradient);
    
    finalColor = mix(color6, color7, t6);
    finalColor = mix(finalColor, color5, t5);
    finalColor = mix(finalColor, color4, t4);
    finalColor = mix(finalColor, color3, t3);
    finalColor = mix(finalColor, color2, t2);
    finalColor = mix(finalColor, color1, t1);
    
    // Smooth color variations
    finalColor = mix(finalColor, color1, colorNoise * 0.82);
    finalColor = mix(finalColor, color5, colorShift * 0.5);
    
    // Enhanced chromatic aberration
    vec2 aberration = curlForce * 0.02;
    vec3 aberrationColor = finalColor;
    aberrationColor.r = mix(finalColor.r, color1.r, length(aberration) * 2.0);
    aberrationColor.b = mix(finalColor.b, color4.b, length(aberration) * 1.5);
    aberrationColor.g = mix(finalColor.g, color5.g, length(aberration) * 1.2);
    
    // Smooth energy pulses
    float pulse1 = sin(time * 3.0 + st.y * 6.0) * 0.5 + 0.5;
    float pulse2 = sin(time * 4.5 - st.y * 8.0) * 0.5 + 0.5;
    float energyPulse = smoothstep(0.3, 0.7, pulse1 * pulse2);
    
    // Apply all effects smoothly
    float intensity = finalShape * combinedStreaks * (1.0 + energyPulse * 0.4);
    intensity *= (1.0 + cells * 0.2);
    intensity *= u_intensity; // Global intensity control
    
    // Enhanced mouse interaction
    vec2 mouse = u_mouse / u_resolution.xy;
    mouse = (mouse - 0.5) * 2.0;
    mouse.x *= u_resolution.x / u_resolution.y;
    
    float mouseInfluence = 1.0 - length(st - mouse) * 0.6;
    mouseInfluence = max(0.0, mouseInfluence);
    mouseInfluence = smoothstep(0.0, 1.0, mouseInfluence);
    
    intensity += mouseInfluence * 0.6;
    aberrationColor = mix(aberrationColor, color1, 0.3);
    
    // Final color application with post-processing
    vec3 result = aberrationColor * intensity;
    
    // Bloom effect
    float bloom = smoothstep(0.4, 1.0, intensity) * 0.54;
    result += bloom * finalColor;
    
    // Color grading
    result = pow(result, vec3(0.85)); // Gamma correction
    result = mix(result, result * result, 0.2); // Contrast boost
    
    // Vignette effect
    float vignette = 1.0 - length(uv - 0.5) * 0.85;
    vignette = smoothstep(0.2, 1.0, vignette);
    
    // Enhanced background with subtle color
    vec3 bgColor = vec3(0.02, 0.01, 0.12) + finalColor * 0.03;
    result = mix(bgColor, result, smoothstep(0.0, 0.4, intensity));
    result *= vignette;
    
    // Final saturation and brightness
    result = mix(vec3(dot(result, vec3(0.299, 0.587, 0.114))), result, 1.3);

    // Film grain effect
    float grainAmount = 0.11;
    float grainValue = grain(uv, time * 0.5) * 2.0 - 1.0;
    result += grainValue * grainAmount;

    // Enhanced chromatic aberration
    vec2 aberrationOffset = (uv - 0.5) * 0.2;
    //result.r = mix(result.r, texture2D(u_texture, uv + aberrationOffset).r, 0.3);
    //result.b = mix(result.b, texture2D(u_texture, uv - aberrationOffset).b, 0.3);

    // Subtle scanlines
    float scanline = sin(uv.y * u_resolution.y * 2.0) * 0.04;
    result += scanline;
    
    gl_FragColor = vec4(result, 1.0);
  }
`

interface NavLinkProps {
  children: React.ReactNode
  href: string
  gradient: string
  index: number
}

function NavLink({ children, href, gradient, index }: NavLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const link = linkRef.current
    if (!link) return

    const handleMouseEnter = () => {
      setIsHovered(true)
      gsap.to(link, {
        scale: 1.05, // Reduced from 1.1
        rotationX: -2, // Reduced from -5
        z: 20, // Reduced from 50
        duration: 0.6, // Increased from 0.4
        ease: "power3.out", // Changed from "power2.out"
      })

      gsap.to(link, {
        textShadow: "0 5px 20px rgba(255,255,255,0.2)", // Reduced intensity
        duration: 0.5, // Increased from 0.3
        ease: "power3.out",
      })
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      gsap.to(link, {
        scale: 1,
        rotationX: 0,
        z: 0,
        duration: 0.6, // Increased from 0.4
        ease: "power3.out",
      })

      gsap.to(link, {
        textShadow: "0 0 0px rgba(255,255,255,0)",
        duration: 0.5, // Increased from 0.3
        ease: "power3.out",
      })
    }

    link.addEventListener("mouseenter", handleMouseEnter)
    link.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      link.removeEventListener("mouseenter", handleMouseEnter)
      link.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <a
      ref={linkRef}
      href={href}
      className={`block mb-2 text-4xl md:text-6xl lg:text-8xl font-black leading-tight cursor-pointer transition-all duration-300 transform-gpu perspective-1000 ${
        isHovered ? "z-10" : ""
      }`}
      style={{
        background: gradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        filter: isHovered ? "brightness(1.2) saturate(1.3)" : "brightness(1) saturate(1)",
      }}
    >
      {children}
    </a>
  )
}

export default function WebGLHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const bufferRef = useRef<WebGLBuffer | null>(null)
  const positionLocationRef = useRef<number>(0)
  const timeLocationRef = useRef<WebGLUniformLocation | null>(null)
  const resolutionLocationRef = useRef<WebGLUniformLocation | null>(null)
  const mouseLocationRef = useRef<WebGLUniformLocation | null>(null)
  const intensityLocationRef = useRef<WebGLUniformLocation | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const [globalIntensity, setGlobalIntensity] = useState(1.0)

  const navLinks = [
    { text: "IGNITE", href: "/ignite", gradient: "linear-gradient(135deg, #ffffff, #cccccc)" },
    { text: "TRANSFORM", href: "/transform", gradient: "linear-gradient(135deg, #ffffff, #cccccc)" },
    { text: "DOMINATE", href: "/dominate", gradient: "linear-gradient(135deg, #ffffff, #cccccc)" },
    { text: "EVOLVE", href: "/evolve", gradient: "linear-gradient(135deg, #ffffff, #cccccc)" },
  ]

  const createShader = (type: number, source: string) => {
    const gl = glRef.current
    if (!gl) return null

    const shader = gl.createShader(type)
    if (!shader) return null

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  const initGL = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    glRef.current = gl

    // Create shader program
    const vertShader = createShader(gl.VERTEX_SHADER, vertexShader)
    const fragShader = createShader(gl.FRAGMENT_SHADER, fragmentShader)

    if (!vertShader || !fragShader) return

    const program = gl.createProgram()
    if (!program) return

    gl.attachShader(program, vertShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program))
      return
    }

    programRef.current = program

    // Create buffer
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

    bufferRef.current = buffer

    // Get uniform locations
    const positionLocation = gl.getAttribLocation(program, "position")
    positionLocationRef.current = positionLocation
    const timeLocation = gl.getUniformLocation(program, "u_time")
    timeLocationRef.current = timeLocation
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
    resolutionLocationRef.current = resolutionLocation
    const mouseLocation = gl.getUniformLocation(program, "u_mouse")
    mouseLocationRef.current = mouseLocation
    const intensityLocation = gl.getUniformLocation(program, "u_intensity")
    intensityLocationRef.current = intensityLocation

    // Resize canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left) * window.devicePixelRatio
      mouseRef.current.y = (rect.height - (e.clientY - rect.top)) * window.devicePixelRatio

      // Smoother intensity changes
      gsap.to(
        { intensity: globalIntensity },
        {
          intensity: 1.15, // Reduced from 1.2
          duration: 0.3,
          ease: "power2.out",
          onUpdate: function () {
            setGlobalIntensity(this.targets()[0].intensity)
          },
        },
      )

      // Smooth decay back to normal
      gsap.to(
        { intensity: 1.15 },
        {
          intensity: 1.0,
          duration: 1.0, // Longer decay
          delay: 0.1,
          ease: "power2.out",
          onUpdate: function () {
            setGlobalIntensity(this.targets()[0].intensity)
          },
        },
      )
    }

    canvas.addEventListener("mousemove", handleMouseMove)
  }

  const animate = () => {
    const time = (Date.now() - startTimeRef.current) * 0.001
    const gl = glRef.current
    const program = programRef.current
    const buffer = bufferRef.current
    const positionLocation = positionLocationRef.current
    const timeLocation = timeLocationRef.current
    const resolutionLocation = resolutionLocationRef.current
    const mouseLocation = mouseLocationRef.current
    const intensityLocation = intensityLocationRef.current

    if (gl && program && buffer && timeLocation && resolutionLocation && mouseLocation && intensityLocation) {
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      gl.uniform1f(timeLocation, time)
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y)
      gl.uniform1f(intensityLocation, globalIntensity)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    requestAnimationFrame(animate)
  }

  useEffect(() => {
    initGL()
  }, [])

  useEffect(() => {
    const animateFrame = () => {
      const time = (Date.now() - startTimeRef.current) * 0.001
      const gl = glRef.current
      const program = programRef.current
      const buffer = bufferRef.current
      const positionLocation = positionLocationRef.current
      const timeLocation = timeLocationRef.current
      const resolutionLocation = resolutionLocationRef.current
      const mouseLocation = mouseLocationRef.current
      const intensityLocation = intensityLocationRef.current

      if (gl && program && buffer && timeLocation && resolutionLocation && mouseLocation && intensityLocation) {
        gl.useProgram(program)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

        gl.uniform1f(timeLocation, time)
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
        gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y)
        gl.uniform1f(intensityLocation, globalIntensity)

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      requestAnimationFrame(animateFrame)
    }

    animateFrame()
  }, [globalIntensity])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: "#000510" }} />

      <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12">
        {/* Top text */}
        <div ref={heroTextRef} className="text-left">
          <p className="text-gray-300 text-sm md:text-base uppercase tracking-wider font-bold">
            {"Break the boundaries,"}
          </p>
          <p className="text-gray-300 text-sm md:text-base uppercase tracking-wider font-bold">
            {"Unleash your potential"}
          </p>
        </div>

        {/* Bottom content */}
        <div className="flex flex-col md:flex-row justify-between items-end">
          <nav ref={navRef} className="text-left mb-8 md:mb-0">
            {navLinks.map((link, index) => (
              <NavLink key={link.text} href={link.href} gradient={link.gradient} index={index}>
                {link.text}
              </NavLink>
            ))}
          </nav>

          <div ref={ctaRef} className="text-right text-gray-300 text-xs md:text-sm max-w-xs">
            <p className="mb-2 font-semibold text-white">{"The future belongs to those"}</p>
            <p className="mb-2 font-semibold text-white">{"who dare to dream bigger"}</p>
            <p className="mb-4 text-gray-400">{"Every revolution starts with a single spark"}</p>
            <p className="mb-2 text-gray-400">{"Your moment is now."}</p>
            <p className="mb-2 text-gray-400">{"Your power is limitless."}</p>
            <p className="mb-6 text-gray-400">{"Your impact will be legendary."}</p>
            <p className="text-transparent bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text font-bold">
              www.revolution.com
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export const Component = () => {
  return (
    <WebGLHero />
  )
}