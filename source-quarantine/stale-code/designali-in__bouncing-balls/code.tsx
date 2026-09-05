"use client"

import { useEffect, useRef, type FC } from "react"

interface Ball {
  fillColor: string
  radius: number
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: number
  vx: number
  vy: number
  draw: (ctx: CanvasRenderingContext2D) => void
}

interface BouncingBallsProps {
  numBalls?: number
  backgroundColor?: string
  colors?: string[]
  opacity?: number
  minRadius?: number
  maxRadius?: number
  speed?: number
  bounceDamping?: number
  gravity?: number
  friction?: number
  interactionRadius?: number
  interactionScale?: number
  interactive?: boolean
  followMouse?: boolean
  trailAlpha?: number
}

export const BouncingBalls: FC<BouncingBallsProps> = ({
  numBalls = 150,
  backgroundColor = "transparent",
  colors,
  opacity = 1,
  minRadius = 0.4,
  maxRadius = 2,
  speed = 0.5,
  bounceDamping = 1,
  gravity = 0,
  friction = 1,
  interactionRadius = 100,
  interactionScale = 4,
  interactive = true,
  followMouse = false,
  trailAlpha = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    const getRandomColor = (): string => {
      if (colors && colors.length > 0) {
        return colors[Math.floor(Math.random() * colors.length)]
      }
      // fallback to random RGB
      return `rgba(${Math.ceil(Math.random() * 255)}, ${Math.ceil(
        Math.random() * 255
      )}, ${Math.ceil(Math.random() * 255)}, ${opacity})`
    }

    const createBall = (fillColor: string, radius: number): Ball => ({
      fillColor,
      radius,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      vx: 0,
      vy: 0,
      draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.scale(this.scaleX, this.scaleY)
        ctx.rotate(this.rotation)
        ctx.fillStyle = this.fillColor
        ctx.beginPath()
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      },
    })

    // Mouse interaction
    const mouse = { x: W / 2, y: H / 2 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.pageX - canvas.offsetLeft
      mouse.y = e.pageY - canvas.offsetTop
    }
    if (interactive) canvas.addEventListener("mousemove", handleMouseMove)

    // Create balls
    const balls: Ball[] = []
    for (let i = 0; i < numBalls; i++) {
      const ball = createBall(getRandomColor(), Math.random() * (maxRadius - minRadius) + minRadius)
      ball.x = Math.random() * W
      ball.y = Math.random() * H
      ball.vx = (Math.random() * 2 - 1) * speed
      ball.vy = (Math.random() * 2 - 1) * speed
      balls.push(ball)
    }

    const updateBall = (ball: Ball) => {
      // physics
      ball.vy += gravity
      ball.vx *= friction
      ball.vy *= friction

      ball.x += ball.vx
      ball.y += ball.vy

      // boundary bounce
      if (ball.x + ball.radius > W) {
        ball.x = W - ball.radius
        ball.vx *= -bounceDamping
      } else if (ball.x - ball.radius < 0) {
        ball.x = ball.radius
        ball.vx *= -bounceDamping
      }

      if (ball.y + ball.radius > H) {
        ball.y = H - ball.radius
        ball.vy *= -bounceDamping
      } else if (ball.y - ball.radius < 0) {
        ball.y = ball.radius
        ball.vy *= -bounceDamping
      }

      // mouse attraction
      if (followMouse) {
        const dx = mouse.x - ball.x
        const dy = mouse.y - ball.y
        ball.vx += dx * 0.0005
        ball.vy += dy * 0.0005
      }
    }

    const enlargeBalls = (ball: Ball) => {
      if (!interactive) return
      const dx = mouse.x - ball.x
      const dy = mouse.y - ball.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < interactionRadius) {
        ball.scaleX = ball.scaleY = interactionScale
      } else if (distance < interactionRadius * 1.5) {
        ball.scaleX = ball.scaleY = interactionScale * 0.6
      } else {
        ball.scaleX = ball.scaleY = 1
      }
    }

    const animate = () => {
      requestAnimationFrame(animate)

      if (trailAlpha < 1) {
        ctx.fillStyle = backgroundColor === "transparent"
          ? `rgba(0, 0, 0, ${1 - trailAlpha})`
          : backgroundColor
        ctx.fillRect(0, 0, W, H)
      } else {
        ctx.clearRect(0, 0, W, H)
      }

      balls.forEach((ball) => {
        enlargeBalls(ball)
        updateBall(ball)
        ball.draw(ctx)
      })
    }

    animate()

    const handleResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    return () => {
      if (interactive) canvas.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [
    numBalls,
    backgroundColor,
    colors,
    opacity,
    minRadius,
    maxRadius,
    speed,
    bounceDamping,
    gravity,
    friction,
    interactionRadius,
    interactionScale,
    interactive,
    followMouse,
    trailAlpha,
  ])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        backgroundColor,
      }}
    />
  )
}
