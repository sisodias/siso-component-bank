"use client"

import React, { useRef, useEffect, useState } from 'react'

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  color: string
  scatteredColor: string
  life: number
  mass: number
}

interface InteractiveParticleTextProps {
  text?: string
  svgPaths?: string[]
  svgViewBox?: string
  svgSize?: number
  className?: string
  fontSize?: number
  particleCount?: number
  maxDistance?: number
  scatteredColor?: string
  enableColorChange?: boolean
  bottomText?: string
  bottomLink?: {
    text: string
    href: string
  }
}

export function InteractiveParticleText({
  text = "INTERACTIVE",
  svgPaths = [],
  svgViewBox = "0 0 84 84",
  svgSize = 200,
  className = "",
  fontSize = 120,
  particleCount = 5000,
  maxDistance = 240,
  scatteredColor = "#00DCFF",
  enableColorChange = false,
  bottomText = "Hover to see particle scattering effects",
  bottomLink
}: InteractiveParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
    }

    updateCanvasSize()

    let particles: Particle[] = []
    let textImageData: ImageData | null = null

    function createTextImage() {
      if (!ctx || !canvas) return 0

      ctx.fillStyle = 'white'
      ctx.save()
      
      if (svgPaths.length > 0) {
        // 渲染SVG路径
        const actualSize = isMobile ? svgSize * 0.7 : svgSize
        const viewBoxParts = svgViewBox.split(' ').map(Number)
        const [vbX, vbY, vbWidth, vbHeight] = viewBoxParts
        
        const scale = actualSize / Math.max(vbWidth, vbHeight)
        const offsetX = canvas.width / 2 - (vbWidth * scale) / 2
        const offsetY = canvas.height / 2 - (vbHeight * scale) / 2
        
        ctx.translate(offsetX, offsetY)
        ctx.scale(scale, scale)
        ctx.translate(-vbX, -vbY)
        
        // 绘制SVG路径
        svgPaths.forEach(pathData => {
          const path = new Path2D(pathData)
          ctx.fill(path)
        })
        
        ctx.restore()
        textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        return scale
      } else {
        // 渲染文字
        const actualFontSize = isMobile ? fontSize * 0.6 : fontSize
        ctx.font = `bold ${actualFontSize}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // 绘制文字到画布中心
        ctx.fillText(text, canvas.width / 2, canvas.height / 2)
        
        ctx.restore()
        textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        return actualFontSize / fontSize
      }
    }

    function createParticle() {
      if (!ctx || !canvas || !textImageData) return null

      const data = textImageData.data

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvas.width)
        const y = Math.floor(Math.random() * canvas.height)

        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.5 + 0.5,
            color: 'white',
            scatteredColor: scatteredColor,
            life: Math.random() * 100 + 50,
            mass: Math.random() * 0.5 + 0.5
          }
        }
      }

      return null
    }

    function createInitialParticles() {
      if (!canvas) return
      const adjustedParticleCount = Math.floor(
        particleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080))
      )
      for (let i = 0; i < adjustedParticleCount; i++) {
        const particle = createParticle()
        if (particle) particles.push(particle)
      }
    }

    let animationFrameId: number

    function animate(scale: number) {
      if (!ctx || !canvas) return
      
      // 清除画布并设置黑色背景
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // 鼠标影响范围内的粒子
        if (distance < maxDistance && (isTouchingRef.current || !('ontouchstart' in window))) {
          // 改进的力场计算，考虑粒子质量
          const normalizedDistance = distance / maxDistance
          const force = Math.pow(1 - normalizedDistance, 2) * (1 / p.mass)
          const angle = Math.atan2(dy, dx)
          
          // 计算排斥力（调小范围）
          const repulsionStrength = 40
          const forceX = -Math.cos(angle) * force * repulsionStrength
          const forceY = -Math.sin(angle) * force * repulsionStrength
          
          // 添加速度和阻尼（提高响应速度）
          p.vx += forceX * 0.025
          p.vy += forceY * 0.025
          p.vx *= 0.9  // 减少阻尼，提高响应
          p.vy *= 0.9
          
          // 更新位置
          p.x += p.vx
          p.y += p.vy
          
          // 根据enableColorChange决定是否改变颜色
          ctx.fillStyle = enableColorChange ? p.scatteredColor : 'white'
        } else {
          // 弹性回归到原位置（更快回归）
          const springStrength = 0.02
          const damping = 0.92
          
          const dx_return = p.baseX - p.x
          const dy_return = p.baseY - p.y
          
          // 弹簧力
          p.vx += dx_return * springStrength
          p.vy += dy_return * springStrength
          
          // 阻尼
          p.vx *= damping
          p.vy *= damping
          
          // 更新位置
          p.x += p.vx
          p.y += p.vy
          
          // 添加微小的扰动避免完全静止（更丝滑）
          if (Math.abs(p.vx) < 0.05 && Math.abs(p.vy) < 0.05) {
            const time = Date.now() * 0.002
            p.x += Math.sin(time + p.baseX * 0.001) * 0.05
            p.y += Math.cos(time + p.baseY * 0.001) * 0.05
          }
          
          ctx.fillStyle = 'white'
        }

        // 绘制粒子
        ctx.fillRect(p.x, p.y, p.size, p.size)

        // 粒子生命周期管理
        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle()
          if (newParticle) {
            particles[i] = newParticle
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      // 维持粒子数量
      const targetParticleCount = Math.floor(
        particleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080))
      )
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle()
        if (newParticle) particles.push(newParticle)
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    const scale = createTextImage()
    createInitialParticles()
    animate(scale)

    const handleResize = () => {
      updateCanvasSize()
      createTextImage()
      particles = []
      createInitialParticles()
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!('ontouchstart' in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile, text, fontSize, particleCount, maxDistance, scatteredColor, svgPaths, svgViewBox, svgSize, enableColorChange])

  return (
    <div className={`relative w-full h-screen flex flex-col items-center justify-center bg-black ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full absolute top-0 left-0 touch-none"
        aria-label={`Interactive particle effect with text: ${text}`}
      />
      
      {(bottomText || bottomLink) && (
        <div className="absolute bottom-[100px] text-center z-10">
          <p className="font-mono text-gray-400 text-xs sm:text-base md:text-sm">
            {bottomText}
            {bottomLink && (
              <>
                {' '}
                <a 
                  href={bottomLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 underline"
                >
                  {bottomLink.text}
                </a>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
