'use client'

import { useEffect, useRef, useState } from 'react'

const generateRandomPath = (width: number, height: number, index: number): string => {
  const patterns = [
    () => {
      const points = []
      const segments = 8 + Math.floor(Math.random() * 4)
      for (let i = 0; i <= segments; i++) {
        const x = (width / segments) * i
        const y = height / 2 + (Math.random() - 0.5) * height * 0.8
        points.push(`${x},${y}`)
      }
      return `M${points[0]} ${points.slice(1).map(p => `L${p}`).join(' ')}`
    },

    () => {
      const amplitude = height * 0.3
      const frequency = 2 + Math.random() * 3
      const phase = Math.random() * Math.PI * 2
      const points = []
      for (let x = 0; x <= width; x += 5) {
        const y = height / 2 + Math.sin((x / width) * Math.PI * frequency + phase) * amplitude
        points.push(`${x},${y}`)
      }
      return `M${points[0]} ${points.slice(1).map(p => `L${p}`).join(' ')}`
    },

    () => {
      const cp1x = width * 0.25 + (Math.random() - 0.5) * width * 0.3
      const cp1y = Math.random() * height
      const cp2x = width * 0.75 + (Math.random() - 0.5) * width * 0.3
      const cp2y = Math.random() * height
      return `M0,${height / 2} C${cp1x},${cp1y} ${cp2x},${cp2y} ${width},${height / 2}`
    },

    () => {
      const loops = 3 + Math.floor(Math.random() * 3)
      let path = `M0,${height / 2}`
      for (let i = 1; i <= loops; i++) {
        const x = (width / loops) * i
        const y = height / 2
        const r = height * 0.2 + Math.random() * height * 0.2
        const dir = i % 2 === 0 ? 1 : -1
        path += ` Q${x - width / loops / 2},${y + r * dir} ${x},${y}`
      }
      return path
    },

    () => {
      const zigzags = 5 + Math.floor(Math.random() * 5)
      const points = []
      for (let i = 0; i <= zigzags; i++) {
        const x = (width / zigzags) * i
        const y = i % 2 === 0 ? height * 0.2 : height * 0.8
        points.push(`${x},${y + (Math.random() - 0.5) * 10}`)
      }
      return `M${points[0]} ${points.slice(1).map(p => `L${p}`).join(' ')}`
    },

    () => {
      const steps = 15 + Math.floor(Math.random() * 10)
      let path = `M0,${height / 2}`
      let currentY = height / 2
      for (let i = 1; i <= steps; i++) {
        const x = (width / steps) * i
        const deltaY = (Math.random() - 0.5) * height * 0.4
        currentY = Math.max(0, Math.min(height, currentY + deltaY))
        path += ` L${x},${currentY}`
      }
      return path
    },

    () => {
      const circles = 2 + Math.floor(Math.random() * 2)
      let path = `M0,${height / 2}`
      for (let i = 0; i < circles; i++) {
        const startX = (width / circles) * i
        const endX = (width / circles) * (i + 1)
        const r = (endX - startX) / 2
        path += ` A${r},${r * 0.8} 0 0,${i % 2} ${endX},${height / 2}`
      }
      return path
    },

    () => {
      const points = []
      const baseY = height / 2
      for (let x = 0; x <= width; x += 10) {
        const noise1 = Math.sin(x * 0.02) * height * 0.2
        const noise2 = Math.sin(x * 0.05 + 1) * height * 0.1
        const noise3 = Math.sin(x * 0.1 + 2) * height * 0.05
        const y = baseY + noise1 + noise2 + noise3
        points.push(`${x},${y}`)
      }
      return `M${points[0]} ${points.slice(1).map(p => `L${p}`).join(' ')}`
    },

    () => {
      const spirals = 1 + Math.floor(Math.random() * 2)
      let path = ''
      for (let s = 0; s < spirals; s++) {
        const startX = (width / spirals) * s
        const endX = (width / spirals) * (s + 1)
        const cx = (startX + endX) / 2
        const cy = height / 2
        const maxR = (endX - startX) / 2

        const points = []
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.2) {
          const r = (angle / (Math.PI * 2)) * maxR
          const x = cx + Math.cos(angle) * r
          const y = cy + Math.sin(angle) * r * 0.5
          points.push(`${x},${y}`)
        }
        path += (s === 0 ? 'M' : ' L') + points.join(' L')
      }
      return path
    },

    () => {
      const waves = 2 + Math.floor(Math.random() * 2)
      const points = []
      for (let x = 0; x <= width; x += 5) {
        let y = height / 2
        for (let w = 0; w < waves; w++) {
          const freq = (w + 1) * 2
          const amp = height * 0.15 / (w + 1)
          y += Math.sin((x / width) * Math.PI * freq + w) * amp
        }
        points.push(`${x},${y}`)
      }
      return `M${points[0]} ${points.slice(1).map(p => `L${p}`).join(' ')}`
    }
  ]

  return patterns[index % patterns.length]()
}

export const Sketch = () => {
  const [mounted, setMounted] = useState(false)
  const animationRefs = useRef<{ [key: string]: { enter?: gsap.core.Tween | null, leave?: gsap.core.Tween | null } }>({})
  const pathIndexRef = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const loadGSAP = async () => {
      const { gsap } = await import('gsap')
      const { DrawSVGPlugin } = await import('gsap/DrawSVGPlugin')

      gsap.registerPlugin(DrawSVGPlugin)

      const initDrawing = () => {
        const links = document.querySelectorAll('[data-draw-line]')

        links.forEach((link) => {
          const box = link.querySelector('[data-draw-line-box]')
          if (!box) return

          const linkId = Math.random().toString(36).substr(2, 9)

          link.addEventListener('mouseenter', () => {
            if (animationRefs.current[linkId]?.enter?.isActive()) return
            if (animationRefs.current[linkId]?.leave?.isActive()) {
              animationRefs.current[linkId].leave.kill()
            }

            const width = 310
            const height = 40
            const strokeWidth = 10 + Math.random() * 10
            const pathData = generateRandomPath(width, height, pathIndexRef.current++)

            const color = '#000000'

            box.innerHTML = `
              <svg class="absolute w-full h-full overflow-visible" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" preserveAspectRatio="none">
                <path d="${pathData}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" fill="none"/>
              </svg>
            `

            const svg = box.querySelector('svg')
            const path = svg?.querySelector('path')

            if (path) {
              gsap.set(path, { drawSVG: '0%' })

              const duration = 0.3 + Math.random() * 0.4
              const ease = ['power2.inOut', 'power3.out', 'elastic.out(1, 0.5)', 'back.out(1.7)'][Math.floor(Math.random() * 4)]

              animationRefs.current[linkId] = {
                enter: gsap.to(path, {
                  duration,
                  drawSVG: '100%',
                  ease,
                  onComplete: () => {
                    animationRefs.current[linkId].enter = null
                  }
                })
              }
            }
          })

          link.addEventListener('mouseleave', () => {
            const path = box.querySelector('path')
            if (!path) return

            const playOut = () => {
              if (animationRefs.current[linkId]?.leave?.isActive()) return

              const duration = 0.3 + Math.random() * 0.2
              const direction = Math.random() > 0.5 ? '100% 100%' : '0% 0%'

              animationRefs.current[linkId].leave = gsap.to(path, {
                duration,
                drawSVG: direction,
                ease: 'power2.inOut',
                onComplete: () => {
                  animationRefs.current[linkId].leave = null
                  box.innerHTML = ''
                }
              })
            }

            if (animationRefs.current[linkId]?.enter?.isActive()) {
              animationRefs.current[linkId].enter.eventCallback('onComplete', playOut)
            } else {
              playOut()
            }
          })
        })
      }

      initDrawing()
    }

    loadGSAP()

    return () => {
      const animations = animationRefs.current
      Object.values(animations).forEach((anim) => {
        anim?.enter?.kill()
        anim?.leave?.kill()
      })
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <a
        data-draw-line=""
        href="#"
        className="inline-block text-black no-underline"
      >
        <p className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-normal" style={{ fontFamily: 'Zapfino, "Brush Script MT", "Lucida Handwriting", cursive' }}>
          21st.dev
        </p>
        <div data-draw-line-box="" className="relative w-full h-[0.625em] overflow-visible mt-2"></div>
      </a>
    </div>
  )
}