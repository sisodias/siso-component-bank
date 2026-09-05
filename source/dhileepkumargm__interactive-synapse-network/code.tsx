// src/components/interactive-synapse-network.tsx
import React, { useRef, useEffect, ReactNode } from 'react'

export interface InteractiveSynapseNetworkProps {
  /** Content to render on top of the network canvas */
  children?: ReactNode
  /** Color of each node (CSS color string or CSS var) */
  nodeColor?: string
  /** Color of the traveling pulse (CSS color string or CSS var) */
  pulseColor?: string
  /** How many nodes to simulate */
  nodeCount?: number
  /** Maximum distance (px) for a connection */
  connectionRadius?: number
  /** Opacity of the fading background trail (0–1) */
  trailOpacity?: number
  /** ARIA label for assistive technologies */
  ariaLabel?: string
  /** Additional CSS classes on the wrapper */
  className?: string
}

const InteractiveSynapseNetwork: React.FC<InteractiveSynapseNetworkProps> = ({
  children,
  nodeColor = 'rgba(0,220,255,0.8)',
  pulseColor = 'rgba(255,255,255,1)',
  nodeCount = 50,
  connectionRadius = 200,
  trailOpacity = 0.2,
  ariaLabel = 'Interactive synapse network',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    interface Pulse {
      start: Node
      end: Node
      progress: number
      speed: number
      update(): void
      draw(): void
    }

    class PulseImpl implements Pulse {
      start: Node
      end: Node
      progress = 0
      speed = 0.03

      constructor(s: Node, e: Node) {
        this.start = s
        this.end = e
      }

      update() {
        this.progress += this.speed
      }

      draw() {
        const x = this.start.x + (this.end.x - this.start.x) * this.progress
        const y = this.start.y + (this.end.y - this.start.y) * this.progress
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = pulseColor
        ctx.fill()
      }
    }

    class Node {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      connections: Node[] = []
      pulses: Pulse[] = []
      activation = 0

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.radius = Math.random() * 2 + 2
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1

        const dx = this.x - mouseRef.current.x
        const dy = this.y - mouseRef.current.y
        const dist = Math.hypot(dx, dy)
        const target = Math.max(0, 1 - dist / (connectionRadius * 0.8))
        this.activation += (target - this.activation) * 0.1

        if (this.activation > 0.5 && Math.random() > 0.98) {
          const to = this.connections[
            Math.floor(Math.random() * this.connections.length)
          ]
          if (to) this.pulses.push(new PulseImpl(this, to))
        }

        this.pulses = this.pulses.filter(p => p.progress < 1)
        this.pulses.forEach(p => p.update())
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        const alpha = Math.max(0.2, this.activation)
        ctx.fillStyle = nodeColor.replace(/[^,]+(?=\))/, alpha.toString())
        ctx.fill()

        this.pulses.forEach(p => p.draw())
      }
    }

    // initialize nodes
    nodesRef.current = Array.from({ length: nodeCount }, () => new Node())
    nodesRef.current.forEach(n1 => {
      nodesRef.current.forEach(n2 => {
        if (n1 !== n2) {
          const d = Math.hypot(n1.x - n2.x, n1.y - n2.y)
          if (d < connectionRadius) n1.connections.push(n2)
        }
      })
    })

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }
    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize', onResize)

    const animate = () => {
      ctx.fillStyle = `rgba(0,15,25,${trailOpacity})`
      ctx.fillRect(0, 0, width, height)

      nodesRef.current.forEach(n1 => {
        n1.connections.forEach(n2 => {
          const a = Math.max(0.05, n1.activation, n2.activation) * 0.2
          ctx.beginPath()
          ctx.moveTo(n1.x, n1.y)
          ctx.lineTo(n2.x, n2.y)
          ctx.strokeStyle = `rgba(0,220,255,${a})`
          ctx.stroke()
        })
      })

      nodesRef.current.forEach(n => {
        n.update()
        n.draw()
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafRef.current!)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [nodeColor, pulseColor, nodeCount, connectionRadius, trailOpacity])

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`relative w-screen h-screen overflow-hidden bg-[hsl(var(--network-bg))] ${className}`}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full block"
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  )
}

export default InteractiveSynapseNetwork
