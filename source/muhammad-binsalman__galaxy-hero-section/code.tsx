"use client"

import React, { useState, useEffect, useRef } from "react"
import { Menu, X, Coffee, Terminal, Paintbrush, Package, Zap } from 'lucide-react'

// WebGL Galaxy Component (Full OGL Implementation)
const Galaxy = ({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  disableAnimation = false,
  speed = 1.0,
  mouseInteraction = true,
  glowIntensity = 0.3,
  saturation = 0.0,
  mouseRepulsion = true,
  repulsionStrength = 2,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  autoCenterRepulsion = 0,
  transparent = true,
  ...rest
}) => {
  const ctnDom = useRef(null)
  const targetMousePos = useRef({ x: 0.5, y: 0.5 })
  const smoothMousePos = useRef({ x: 0.5, y: 0.5 })
  const targetMouseActive = useRef(0.0)
  const smoothMouseActive = useRef(0.0)

  useEffect(() => {
    if (!ctnDom.current) return

    const ctn = ctnDom.current
    
    // WebGL setup
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) {
      console.warn('WebGL not supported, falling back to canvas')
      return
    }

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
      }
    `

    // Fragment shader
    const fragmentShaderSource = `
      precision highp float;
      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec2 uFocal;
      uniform vec2 uRotation;
      uniform float uStarSpeed;
      uniform float uDensity;
      uniform float uHueShift;
      uniform float uSpeed;
      uniform vec2 uMouse;
      uniform float uGlowIntensity;
      uniform float uSaturation;
      uniform bool uMouseRepulsion;
      uniform float uTwinkleIntensity;
      uniform float uRotationSpeed;
      uniform float uRepulsionStrength;
      uniform float uMouseActiveFactor;
      uniform float uAutoCenterRepulsion;
      uniform bool uTransparent;
      varying vec2 vUv;

      #define NUM_LAYER 4.0
      #define STAR_COLOR_CUTOFF 0.2
      #define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
      #define PERIOD 3.0

      float Hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float tri(float x) {
        return abs(fract(x) * 2.0 - 1.0);
      }

      float tris(float x) {
        float t = fract(x);
        return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
      }

      float trisn(float x) {
        float t = fract(x);
        return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
      }

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      float Star(vec2 uv, float flare) {
        float d = length(uv);
        float m = (0.05 * uGlowIntensity) / d;
        
        float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * flare * uGlowIntensity;
        
        uv *= MAT45;
        rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * 0.3 * flare * uGlowIntensity;
        
        m *= smoothstep(1.0, 0.2, d);
        return m;
      }

      vec3 StarLayer(vec2 uv) {
        vec3 col = vec3(0.0);
        vec2 gv = fract(uv) - 0.5; 
        vec2 id = floor(uv);
        
        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 si = id + vec2(float(x), float(y));
            float seed = Hash21(si);
            float size = fract(seed * 345.32);
            
            float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
            float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;
            
            float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
            float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
            float grn = min(red, blu) * seed;
            vec3 base = vec3(red, grn, blu);
            
            float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
            hue = fract(hue + uHueShift / 360.0);
            float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
            float val = max(max(base.r, base.g), base.b);
            base = hsv2rgb(vec3(hue, sat, val));
            
            vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
            float star = Star(gv - offset - pad, flareSize);
            vec3 color = base;
            
            float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
            twinkle = mix(1.0, twinkle, uTwinkleIntensity);
            star *= twinkle;
            
            col += star * size * color;
          }
        }
        return col;
      }

      void main() {
        vec2 focalPx = uFocal * uResolution.xy;
        vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
        vec2 mouseNorm = uMouse - vec2(0.5);
        
        if (uAutoCenterRepulsion > 0.0) {
          vec2 centerUV = vec2(0.0, 0.0);
          float centerDist = length(uv - centerUV);
          vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
          uv += repulsion * 0.05;
        } else if (uMouseRepulsion) {
          vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
          float mouseDist = length(uv - mousePosUV);
          vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
          uv += repulsion * 0.05 * uMouseActiveFactor;
        } else {
          vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
          uv += mouseOffset;
        }
        
        float autoRotAngle = uTime * uRotationSpeed;
        mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
        uv = autoRot * uv;
        
        uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;
        
        vec3 col = vec3(0.0);
        for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
          float depth = fract(i + uStarSpeed * uSpeed);
          float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
          float fade = depth * smoothstep(1.0, 0.9, depth);
          col += StarLayer(uv * scale + i * 453.32) * fade;
        }
        
        if (uTransparent) {
          float alpha = length(col);
          alpha = smoothstep(0.0, 0.3, alpha);
          alpha = min(alpha, 1.0);
          gl_FragColor = vec4(col, alpha);
        } else {
          gl_FragColor = vec4(col, 1.0);
        }
      }
    `

    // Shader compilation helper
    function createShader(gl, type, source) {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    // Program creation helper
    function createProgram(gl, vertexShader, fragmentShader) {
      const program = gl.createProgram()
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
      }
      return program
    }

    // Create shaders and program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)

    if (!program) return

    // Create geometry (full screen triangle)
    const positions = new Float32Array([
      -1, -1,  0, 0,
       3, -1,  2, 0,
      -1,  3,  0, 2
    ])

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'position')
    const uvLocation = gl.getAttribLocation(program, 'uv')
    
    const uniforms = {
      uTime: gl.getUniformLocation(program, 'uTime'),
      uResolution: gl.getUniformLocation(program, 'uResolution'),
      uFocal: gl.getUniformLocation(program, 'uFocal'),
      uRotation: gl.getUniformLocation(program, 'uRotation'),
      uStarSpeed: gl.getUniformLocation(program, 'uStarSpeed'),
      uDensity: gl.getUniformLocation(program, 'uDensity'),
      uHueShift: gl.getUniformLocation(program, 'uHueShift'),
      uSpeed: gl.getUniformLocation(program, 'uSpeed'),
      uMouse: gl.getUniformLocation(program, 'uMouse'),
      uGlowIntensity: gl.getUniformLocation(program, 'uGlowIntensity'),
      uSaturation: gl.getUniformLocation(program, 'uSaturation'),
      uMouseRepulsion: gl.getUniformLocation(program, 'uMouseRepulsion'),
      uTwinkleIntensity: gl.getUniformLocation(program, 'uTwinkleIntensity'),
      uRotationSpeed: gl.getUniformLocation(program, 'uRotationSpeed'),
      uRepulsionStrength: gl.getUniformLocation(program, 'uRepulsionStrength'),
      uMouseActiveFactor: gl.getUniformLocation(program, 'uMouseActiveFactor'),
      uAutoCenterRepulsion: gl.getUniformLocation(program, 'uAutoCenterRepulsion'),
      uTransparent: gl.getUniformLocation(program, 'uTransparent')
    }

    // Setup canvas
    if (transparent) {
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.clearColor(0, 0, 0, 0)
    } else {
      gl.clearColor(0, 0, 0, 1)
    }

    let animateId

    function resize() {
      const scale = 1
      canvas.width = ctn.offsetWidth * scale
      canvas.height = ctn.offsetHeight * scale
      canvas.style.width = ctn.offsetWidth + 'px'
      canvas.style.height = ctn.offsetHeight + 'px'
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    function render(t) {
      animateId = requestAnimationFrame(render)

      if (!disableAnimation) {
        gl.uniform1f(uniforms.uTime, t * 0.001)
        gl.uniform1f(uniforms.uStarSpeed, (t * 0.001 * starSpeed) / 10.0)
      }

      const lerpFactor = 0.05
      smoothMousePos.current.x += (targetMousePos.current.x - smoothMousePos.current.x) * lerpFactor
      smoothMousePos.current.y += (targetMousePos.current.y - smoothMousePos.current.y) * lerpFactor
      smoothMouseActive.current += (targetMouseActive.current - smoothMouseActive.current) * lerpFactor

      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)

      // Set uniforms
      gl.uniform3f(uniforms.uResolution, canvas.width, canvas.height, canvas.width / canvas.height)
      gl.uniform2f(uniforms.uFocal, focal[0], focal[1])
      gl.uniform2f(uniforms.uRotation, rotation[0], rotation[1])
      gl.uniform1f(uniforms.uStarSpeed, starSpeed)
      gl.uniform1f(uniforms.uDensity, density)
      gl.uniform1f(uniforms.uHueShift, hueShift)
      gl.uniform1f(uniforms.uSpeed, speed)
      gl.uniform2f(uniforms.uMouse, smoothMousePos.current.x, smoothMousePos.current.y)
      gl.uniform1f(uniforms.uGlowIntensity, glowIntensity)
      gl.uniform1f(uniforms.uSaturation, saturation)
      gl.uniform1i(uniforms.uMouseRepulsion, mouseRepulsion)
      gl.uniform1f(uniforms.uTwinkleIntensity, twinkleIntensity)
      gl.uniform1f(uniforms.uRotationSpeed, rotationSpeed)
      gl.uniform1f(uniforms.uRepulsionStrength, repulsionStrength)
      gl.uniform1f(uniforms.uMouseActiveFactor, smoothMouseActive.current)
      gl.uniform1f(uniforms.uAutoCenterRepulsion, autoCenterRepulsion)
      gl.uniform1i(uniforms.uTransparent, transparent)

      // Set attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0)
      gl.enableVertexAttribArray(uvLocation)
      gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 16, 8)

      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    function handleMouseMove(e) {
      const rect = ctn.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = 1.0 - (e.clientY - rect.top) / rect.height
      targetMousePos.current = { x, y }
      targetMouseActive.current = 1.0
    }

    function handleMouseLeave() {
      targetMouseActive.current = 0.0
    }

    resize()
    ctn.appendChild(canvas)
    animateId = requestAnimationFrame(render)

    window.addEventListener('resize', resize)
    if (mouseInteraction) {
      ctn.addEventListener('mousemove', handleMouseMove)
      ctn.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      cancelAnimationFrame(animateId)
      window.removeEventListener('resize', resize)
      if (mouseInteraction) {
        ctn.removeEventListener('mousemove', handleMouseMove)
        ctn.removeEventListener('mouseleave', handleMouseLeave)
      }
      if (ctn.contains(canvas)) {
        ctn.removeChild(canvas)
      }
      const ext = gl.getExtension('WEBGL_lose_context')
      if (ext) ext.loseContext()
    }
  }, [
    focal,
    rotation,
    starSpeed,
    density,
    hueShift,
    disableAnimation,
    speed,
    mouseInteraction,
    glowIntensity,
    saturation,
    mouseRepulsion,
    twinkleIntensity,
    rotationSpeed,
    repulsionStrength,
    autoCenterRepulsion,
    transparent,
  ])

  return <div ref={ctnDom} className="w-full h-full relative" {...rest} />
}

// Realism Button Component
const RealismButton = ({ text, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative p-[2px] rounded-[16px] text-[1.4rem] border-none cursor-pointer bg-[radial-gradient(circle_80px_at_80%_-10%,_#ffffff,_#181b1b)] transition-all ${className}`}
    >
      {/* Glow behind button */}
      <div className="absolute top-0 right-0 w-[65%] h-[60%] rounded-[120px] shadow-[0_0_20px_#ffffff38] group-hover:shadow-[0_0_40px_#ffffff60] transition-all duration-300 ease-out -z-10" />

      {/* Bottom-left green blob */}
      <div
        className="absolute bottom-0 left-0 w-[50px] h-[50%] rounded-[17px] transition-all duration-300 ease-out 
        bg-[radial-gradient(circle_60px_at_0%_100%,_#3fff75,_#00ff8050,_transparent)]
        shadow-[-2px_9px_40px_#00ff2d40]
        group-hover:w-[90px] group-hover:shadow-[-4px_1px_45px_#00ff2d60]"
      />

      {/* Inner content */}
      <div className="relative px-[25px] py-[14px] group-hover:scale-110 rounded-[14px] text-white bg-[radial-gradient(circle_80px_at_80%_-50%,_#777777,_#0f1111)] z-10 transition-all duration-300">
        {text}
        {/* Inner glow layer */}
        <div className="absolute inset-0 rounded-[14px] bg-[radial-gradient(circle_60px_at_0%_100%,_#00e1ff1a,_#0000ff11,_transparent)] z-[-1]" />
      </div>
    </button>
  )
}

// Badge Component
const Badge = ({ children, className = "" }) => (
  <div className={`inline-flex items-center ${className}`}>
    {children}
  </div>
)

// Main Galaxy Hero Component
export function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      {/* Galaxy Background */}
      <div className="absolute inset-0 z-0">
        <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.2}
          glowIntensity={0.5}
          saturation={0.6}
          hueShift={120}
          transparent={false}
          rotationSpeed={0.03}
          twinkleIntensity={0.4}
          speed={0.8}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/40 to-teal-900/50 z-10" />

      {/* Floating Glassmorphic Elements */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        {/* Top Left Floating Card */}
        <div className="absolute top-20 left-8 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl animate-pulse">
          <div className="flex items-center space-x-2">
            <Coffee className="w-5 h-5 text-emerald-400" />
            <span className="text-white text-sm font-medium">Caffeinated</span>
          </div>
        </div>

        {/* Top Right Floating Card */}
        <div
          className="absolute top-32 right-12 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        >
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-teal-400" />
            <span className="text-white text-sm font-medium">Dev-first</span>
          </div>
        </div>

        {/* Bottom Left Floating Card */}
        <div
          className="absolute bottom-40 left-16 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        >
          <div className="flex items-center space-x-2">
            <Paintbrush className="w-5 h-5 text-cyan-400" />
            <span className="text-white text-sm font-medium">Handcrafted</span>
          </div>
        </div>

        {/* Bottom Right Floating Card */}
        <div
          className="absolute bottom-32 right-8 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-green-400" />
            <span className="text-white text-sm font-medium">Ship ready</span>
          </div>
        </div>
      </div>

      {/* Pill-Shaped Navbar */}
      <nav className="relative z-50 w-full pt-6">
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="backdrop-blur-md bg-slate-900/80 border border-white/10 rounded-full shadow-2xl transition-all duration-300"
            style={{
              backgroundColor: `rgba(15, 23, 42, ${Math.min(0.8 + scrollY * 0.0005, 0.95)})`,
            }}
          >
            <div className="flex items-center justify-between h-14 px-8">
              {/* Logo */}
              <div className="flex items-center">
                <span className="text-xl font-mono font-bold text-white tracking-tight">Mysh UI</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {["Components", "Examples", "Docs", "GitHub"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* CTA Button */}
              <div className="hidden md:block">
                <RealismButton text="Try it out" className="scale-75" />
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-400 hover:text-white p-2 transition-colors"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden border-t border-white/10 rounded-b-full bg-slate-900/90 backdrop-blur-md">
                <div className="px-8 py-6 space-y-4">
                  {["Components", "Examples", "Docs", "GitHub"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block text-gray-300 hover:text-white text-base font-medium transition-colors py-2"
                    >
                      {item}
                    </a>
                  ))}
                  <div className="pt-4 flex justify-center">
                    <RealismButton text="Try it out" className="scale-75" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {/* Pill-Shaped Badge */}
          <div className="mb-8 flex justify-center">
            <Badge className="backdrop-blur-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-200 border border-emerald-400/30 px-8 py-4 text-base rounded-full shadow-2xl">
              <Zap className="w-5 h-5 mr-2" />
              Made for developers who care
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent drop-shadow-2xl">
              Stop fighting
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              your UI
            </span>
          </h1>

          {/* Glassmorphic Subtitle Container */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-3xl p-8 mb-12 shadow-2xl max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Components that actually work the way you think they should. No weird APIs, no fighting with CSS, just
              copy, paste, and ship.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <RealismButton text="Browse components" />
            <div className="backdrop-blur-xl bg-white/10 border-2 border-emerald-400/50 text-emerald-200 hover:bg-white/20 hover:text-white px-10 py-5 text-lg rounded-2xl shadow-xl cursor-pointer transition-all duration-300 hover:scale-105">
              See examples
            </div>
          </div>

          {/* Glassmorphic Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Coffee,
                title: "Actually usable",
                desc: "Built by developers who got tired of reinventing the wheel every project",
                gradient: "from-amber-400 to-orange-400",
              },
              {
                icon: Terminal,
                title: "Copy & paste ready",
                desc: "No package installs, no build steps. Just grab what you need and go",
                gradient: "from-emerald-400 to-teal-400",
              },
              {
                icon: Paintbrush,
                title: "Looks good by default",
                desc: "Designed to work with your existing styles, not fight against them",
                gradient: "from-purple-400 to-pink-400",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 group hover:scale-105 shadow-2xl"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glassmorphic Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-emerald-400/70 rounded-full flex justify-center bg-gradient-to-b from-emerald-400/20 to-transparent">
              <div className="w-1 h-3 bg-emerald-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}