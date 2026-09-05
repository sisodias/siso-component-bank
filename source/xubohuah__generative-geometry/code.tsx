'use client'

import p5 from 'p5'
import { useEffect, useRef } from 'react'

export const Sketch = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const sketch = (p: p5) => {
      interface Square {
        x: number
        y: number
        width: number
        height: number
        color?: string
      }

      let squares: Square[] = []
      let canvasSize: number
      const white = '#F2F5F1'
      const colors = ['#D40920', '#1356A2', '#F7D842'] // Red, Blue, Yellow

      p.setup = () => {
        canvasSize = p.min(p.windowWidth, p.windowHeight) * 0.7
        p.createCanvas(canvasSize, canvasSize)
        generateMondrian()
      }

      p.draw = () => {
        drawMondrian()
        p.noLoop()
      }

      const generateMondrian = () => {
        const size = canvasSize
        const step = size / 7

        // Start with one big square
        squares = [{
          x: 0,
          y: 0,
          width: size,
          height: size
        }]

        // Split squares on grid lines
        for (let i = step; i < size; i += step) {
          splitSquaresWith({ y: i })
          splitSquaresWith({ x: i })
        }

        // Add some random color to squares
        const numColored = p.floor(p.random(3, 6))
        for (let i = 0; i < numColored; i++) {
          const randomSquare = squares[p.floor(p.random(squares.length))]
          randomSquare.color = colors[i % colors.length]
        }
      }

      const splitSquaresWith = (coordinates: { x?: number; y?: number }) => {
        const { x, y } = coordinates

        for (let i = squares.length - 1; i >= 0; i--) {
          const square = squares[i]

          if (x && x > square.x && x < square.x + square.width) {
            if (p.random() > 0.5) {
              squares.splice(i, 1)
              splitOnX(square, x)
            }
          }

          if (y && y > square.y && y < square.y + square.height) {
            if (p.random() > 0.5) {
              squares.splice(i, 1)
              splitOnY(square, y)
            }
          }
        }
      }

      const splitOnX = (square: Square, splitAt: number) => {
        const squareA: Square = {
          x: square.x,
          y: square.y,
          width: square.width - (square.width - splitAt + square.x),
          height: square.height
        }

        const squareB: Square = {
          x: splitAt,
          y: square.y,
          width: square.width - splitAt + square.x,
          height: square.height
        }

        squares.push(squareA)
        squares.push(squareB)
      }

      const splitOnY = (square: Square, splitAt: number) => {
        const squareA: Square = {
          x: square.x,
          y: square.y,
          width: square.width,
          height: square.height - (square.height - splitAt + square.y)
        }

        const squareB: Square = {
          x: square.x,
          y: splitAt,
          width: square.width,
          height: square.height - splitAt + square.y
        }

        squares.push(squareA)
        squares.push(squareB)
      }

      const drawMondrian = () => {
        p.background(255)
        p.strokeWeight(8)
        p.stroke(0)

        for (let i = 0; i < squares.length; i++) {
          const square = squares[i]

          // Fill color
          if (square.color) {
            p.fill(square.color)
          } else {
            p.fill(white)
          }

          // Draw rectangle
          p.rect(square.x, square.y, square.width, square.height)
        }
      }

      p.windowResized = () => {
        canvasSize = p.min(p.windowWidth, p.windowHeight) * 0.7
        p.resizeCanvas(canvasSize, canvasSize)
        squares = []
        generateMondrian()
        p.redraw()
      }

      p.mousePressed = () => {
        squares = []
        generateMondrian()
        p.redraw()
      }
    }

    const p5Instance = new p5(sketch, containerRef.current)

    return () => {
      p5Instance.remove()
    }
  }, [])

  return <div ref={containerRef} className="flex items-center justify-center w-screen h-screen"></div>
}
