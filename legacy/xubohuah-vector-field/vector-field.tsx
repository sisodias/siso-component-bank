"use client"

import React, { useRef, useEffect } from 'react'

interface VectorPoint {
  x: number
  y: number
  angle: number
  newAngle: number
  locked: boolean
  speed: number
  direction: boolean
}

interface VectorFieldProps {
  gridSize?: number
  maxVector?: number
  padding?: number
  margin?: number
  maxRotationSpeed?: number
  lockedChance?: number
  className?: string
}

export function VectorField({
  gridSize = 32,
  maxVector = 12,
  padding = 1,
  margin = 32,
  maxRotationSpeed = 0.08,
  lockedChance = 0.003,
  className = ""
}: VectorFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const vectorPointsRef = useRef<VectorPoint[][]>([])
  const frameCountRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Calculate canvas size and set high DPI
    const canvasWidth = margin * 2 + gridSize * maxVector + padding * gridSize
    const canvasHeight = margin * 2 + gridSize * maxVector + padding * gridSize
    
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvasWidth * dpr
    canvas.height = canvasHeight * dpr
    canvas.style.width = `${canvasWidth}px`
    canvas.style.height = `${canvasHeight}px`
    ctx.scale(dpr, dpr)

    // Initialize vector point grid
    const initVectorField = () => {
      vectorPointsRef.current = []
      
      // Calculate actual grid dimensions
      const actualGridWidth = (gridSize - 1) * (maxVector + padding)
      const actualGridHeight = (gridSize - 1) * (maxVector + padding)
      
      // Center the grid in the canvas
      const offsetX = (canvasWidth - actualGridWidth) / 2
      const offsetY = (canvasHeight - actualGridHeight) / 2
      
      for (let x = 0; x < gridSize; x++) {
        vectorPointsRef.current[x] = []
        for (let y = 0; y < gridSize; y++) {
          vectorPointsRef.current[x][y] = {
            x: offsetX + (x * (maxVector + padding)),
            y: offsetY + (y * (maxVector + padding)),
            angle: Math.random() * Math.PI * 2,
            newAngle: 0,
            locked: Math.random() < lockedChance,
            speed: (Math.random() - 0.5) * 2 * maxRotationSpeed,
            direction: Math.random() > 0.5
          }
          // Set initial newAngle
          vectorPointsRef.current[x][y].newAngle = vectorPointsRef.current[x][y].angle
        }
      }
    }

    // Get neighboring points
    const getNeighbors = (x: number, y: number): VectorPoint[] => {
      const neighbors: VectorPoint[] = []
      const mod = (n: number, m: number) => ((n % m) + m) % m
      
      // 8 neighboring points
      const offsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ]
      
      offsets.forEach(([dx, dy]) => {
        const nx = mod(x + dx, gridSize)
        const ny = mod(y + dy, gridSize)
        neighbors.push(vectorPointsRef.current[nx][ny])
      })
      
      return neighbors
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      frameCountRef.current++

      // Clear canvas with black background
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Update all vector points
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          const point = vectorPointsRef.current[x][y]
          
          if (!point.locked) {
            const neighbors = getNeighbors(x, y)
            if (neighbors.length > 0) {
              // Calculate average angle of neighbors
              let averageAngle = 0
              neighbors.forEach(neighbor => {
                averageAngle += neighbor.angle
              })
              averageAngle = 1.001 * averageAngle / neighbors.length
              point.newAngle = averageAngle
            }
          } else {
            // Locked points rotate autonomously
            if (point.direction) {
              point.newAngle = point.newAngle + point.speed
            } else {
              point.newAngle = point.newAngle - point.speed
            }
            
            // More elegant direction changes
            if (frameCountRef.current % 150 === 0 && Math.random() > 0.7) {
              point.direction = !point.direction
              point.speed = (Math.random() - 0.5) * 2 * maxRotationSpeed
            }
          }
        }
      }

      // Apply new angles and draw
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          const point = vectorPointsRef.current[x][y]
          point.angle = point.newAngle
          
          // Calculate dynamic opacity based on time and position
          const fadeAmount = (Math.sin(frameCountRef.current * 0.01 + point.x * 0.02 + point.y * 0.02) + 1) * 0.3 + 0.4
          
          // Draw elegant vectors
          const vectorLength = maxVector * (point.locked ? 1.1 : 0.9)
          const endX = point.x + Math.sin(point.angle) * vectorLength
          const endY = point.y + Math.cos(point.angle) * vectorLength
          
          // Create gradient effect
          const gradient = ctx.createLinearGradient(point.x, point.y, endX, endY)
          if (point.locked) {
            gradient.addColorStop(0, `rgba(168, 85, 247, ${fadeAmount * 0.8})`)
            gradient.addColorStop(1, `rgba(196, 125, 255, ${fadeAmount})`)
          } else {
            gradient.addColorStop(0, `rgba(255, 255, 255, ${fadeAmount * 0.6})`)
            gradient.addColorStop(1, `rgba(255, 255, 255, ${fadeAmount})`)
          }
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = point.locked ? 1.8 : 1.2
          ctx.lineCap = 'round'
          
          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
          ctx.lineTo(endX, endY)
          ctx.stroke()
          
          // Draw elegant arrowheads
          const arrowSize = point.locked ? 5 : 3.5
          const arrowAngle = 0.35
          const arrowOpacity = fadeAmount * (point.locked ? 0.9 : 0.7)
          
          ctx.strokeStyle = point.locked ? `rgba(168, 85, 247, ${arrowOpacity})` : `rgba(255, 255, 255, ${arrowOpacity})`
          ctx.lineWidth = point.locked ? 1.5 : 1
          
          ctx.beginPath()
          ctx.moveTo(endX, endY)
          ctx.lineTo(
            endX - arrowSize * Math.sin(point.angle - arrowAngle),
            endY - arrowSize * Math.cos(point.angle - arrowAngle)
          )
          ctx.moveTo(endX, endY)
          ctx.lineTo(
            endX - arrowSize * Math.sin(point.angle + arrowAngle),
            endY - arrowSize * Math.cos(point.angle + arrowAngle)
          )
          ctx.stroke()
          
          // Add glow effect for locked points
          if (point.locked && frameCountRef.current % 3 === 0) {
            ctx.beginPath()
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(168, 85, 247, ${fadeAmount * 0.3})`
            ctx.fill()
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    initVectorField()
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gridSize, maxVector, padding, margin, maxRotationSpeed, lockedChance])

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          maxHeight: '100vh',
          objectFit: 'contain'
        }}
      />
    </div>
  )
}

// Preset configuration components
export function LargeVectorField(props: Partial<VectorFieldProps>) {
  return (
    <VectorField
      gridSize={40}
      maxVector={16}
      padding={2.5}
      margin={48}
      maxRotationSpeed={0.04}
      lockedChance={0.003}
      {...props}
    />
  )
}

export function SmallVectorField(props: Partial<VectorFieldProps>) {
  return (
    <VectorField
      gridSize={24}
      maxVector={10}
      padding={1}
      margin={24}
      maxRotationSpeed={0.1}
      lockedChance={0.002}
      {...props}
    />
  )
}

export function DenseVectorField(props: Partial<VectorFieldProps>) {
  return (
    <VectorField
      gridSize={64}
      maxVector={8}
      padding={0.5}
      margin={32}
      maxRotationSpeed={0.05}
      lockedChance={0.005}
      {...props}
    />
  )
}
