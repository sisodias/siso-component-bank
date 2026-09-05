"use client"

import { useEffect, useRef } from "react"

interface MagnetFieldProps {
  force?: number
  threshold?: number
  spacing?: number
  radius?: number
  backgroundColor?: string
  blendMode?: string
  colorOffset?: number
  saturation?: number
  brightness?: number
  momentumDecay?: number
  elasticity?: number
  trail?: boolean
  trailOpacity?: number
  mouseAttraction?: "repel" | "attract"
  animateHue?: boolean
}

export function MagnetField({
  force = 0.3,
  threshold = 200,
  spacing = 5,
  radius = 10,
  backgroundColor = "transparent",
  blendMode = "difference",
  colorOffset = 300,
  saturation = 1,
  brightness = 1,
  momentumDecay = 0.8,
  elasticity = 3,
  trail = false,
  trailOpacity = 0.1,
  mouseAttraction = "repel",
  animateHue = true,
}: MagnetFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.17/paper-full.min.js"
    script.async = true

    script.onload = () => {
      const paper = (window as any).paper
      paper.setup(canvas)

      let mousePoint = new paper.Point(paper.view.size.width / 2, paper.view.size.height / 2)
      const magnets: any[] = []

      class Magnet {
        centerPoint: any
        radius: number
        force: number
        hue: number
        momentum: any
        magnet: any

        constructor(pos: any, rad: number, magnetForce: number, hue: number) {
          this.centerPoint = pos
          this.radius = rad
          this.force = magnetForce
          this.hue = hue
          this.momentum = new paper.Point(0, 0)

          this.magnet = new paper.Shape.Ellipse({
            point: this.centerPoint,
            size: [this.radius * 2, this.radius * 2],
            fillColor: {
              hue: this.hue,
              saturation,
              brightness,
            },
            blendMode,
          })
        }

        avoidPoint() {
          const mouseOffset = new paper.Point(mousePoint.subtract(this.centerPoint))
          const mouseDistance = mousePoint.getDistance(this.centerPoint)
          let newDistance = 0

          if (mouseDistance < threshold) {
            const direction = mouseAttraction === "attract" ? -1 : 1
            newDistance = (mouseDistance - threshold) * this.force * direction
          }

          let newOffset = new paper.Point(0, 0)
          if (mouseDistance !== 0) {
            newOffset = new paper.Point(
              (mouseOffset.x / mouseDistance) * newDistance,
              (mouseOffset.y / mouseDistance) * newDistance,
            )
          }

          const newPosition = new paper.Point(this.centerPoint.add(newOffset))
          const distanceToNewPosition = new paper.Point(this.magnet.position.subtract(newPosition))

          this.momentum = this.momentum.subtract(distanceToNewPosition.divide(elasticity))
          this.momentum = this.momentum.multiply(momentumDecay)
          this.magnet.position = this.magnet.position.add(this.momentum)

          if (animateHue) {
            const newHue = this.hue - newDistance * 3
            this.magnet.fillColor.hue = newHue
          }
        }

        clear() {
          this.magnet.remove()
        }
      }

      function createMagnets() {
        const stepSize = radius * 2 + spacing
        const topRight = new paper.Point(-100, -100)
        const amountX = Math.ceil(paper.view.size.width / stepSize) + 3
        const amountY = Math.ceil(paper.view.size.height / stepSize) + 3

        for (let i = 0; i <= amountX; i++) {
          for (let j = 0; j <= amountY; j++) {
            const center = new paper.Point(topRight.x + i * stepSize, topRight.y + j * stepSize)
            const hue = colorOffset + center.getDistance(new paper.Point(0, 0)) / 4
            magnets.push(new Magnet(center, radius, force, hue))
          }
        }
      }

      function clearMagnets() {
        magnets.forEach((m) => m.clear())
        magnets.length = 0
      }

      paper.view.onFrame = () => {
        if (trail) {
          const bg = new paper.Path.Rectangle(paper.view.bounds)
          bg.fillColor = new paper.Color(backgroundColor)
          bg.fillColor.alpha = trailOpacity
          bg.sendToBack()
        }
        for (const magnet of magnets) {
          magnet.avoidPoint()
        }
      }

      const tool = new paper.Tool()
      tool.onMouseMove = (event: any) => {
        mousePoint = event.lastPoint
      }

      const handleResize = () => {
        paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight)
        clearMagnets()
        createMagnets()
      }

      window.addEventListener("resize", handleResize)
      createMagnets()

      return () => {
        window.removeEventListener("resize", handleResize)
        clearMagnets()
      }
    }

    document.head.appendChild(script)
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
    }
  }, [
    force,
    threshold,
    spacing,
    radius,
    backgroundColor,
    blendMode,
    colorOffset,
    saturation,
    brightness,
    momentumDecay,
    elasticity,
    trail,
    trailOpacity,
    mouseAttraction,
    animateHue,
  ])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: backgroundColor,
        display: "block",
      }}
    />
  )
}
