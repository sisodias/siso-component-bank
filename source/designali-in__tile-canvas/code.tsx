"use client"

import { useEffect, useRef } from "react"

interface TileCanvasProps {
  side?: number
  sizeConst?: number
  distMult?: number
  sizeDistMult?: number
  frameMult?: number
  alpha?: number
  boostProb?: number
  boostValue?: number
  className?: string
}

interface Tile {
  x: number
  y: number
  dist: number
  size: number
  sizeIncrement: number
  assignCenter: () => void
  step: () => void
}

export function TileCanvas({
  side = 100,
  sizeConst = 1,
  distMult = 1,
  sizeDistMult = 1,
  frameMult = 1,
  alpha = 0.9,
  boostProb = 1,
  boostValue = 1,
  className = "",
}: TileCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    w: 0,
    h: 0,
    ctx: null as CanvasRenderingContext2D | null,
    opts: {
      side,
      sizeConst,
      distMult,
      sizeDistMult,
      frameMult,
      alpha,
      boostProb,
      boostValue,
      cx: 0,
      cy: 0,
    },
    tiles: [] as Tile[],
    tick: 0,
    animationId: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const state = stateRef.current
    state.w = window.innerWidth
    state.h = window.innerHeight
    canvas.width = state.w
    canvas.height = state.h

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    state.ctx = ctx
    state.opts.cx = state.w / 2
    state.opts.cy = state.h / 2

    const initTiles = () => {
      state.tiles.length = 0
      for (let i = -state.opts.side / 2; i < state.w; i += state.opts.side) {
        for (let j = -state.opts.side / 2; j < state.h; j += state.opts.side) {
          const tile: Tile = {
            x: i + state.opts.side / 2,
            y: j + state.opts.side / 2,
            dist: 0,
            size: 0,
            sizeIncrement: 0,
            assignCenter: function () {
              const dx = state.opts.cx - this.x
              const dy = state.opts.cy - this.y
              this.dist = Math.sqrt(dx * dx + dy * dy)
              this.size = state.opts.side
              this.sizeIncrement = (state.opts.side / (this.dist * state.opts.sizeDistMult)) * state.opts.sizeConst
            },
            step: function () {
              this.size -= this.sizeIncrement
              if (Math.random() < state.opts.boostProb) {
                this.size -= state.opts.boostValue
              }
              if (this.size < 0) {
                this.size = state.opts.side
              }
              const hue = state.tick * state.opts.frameMult + this.dist * state.opts.distMult
              ctx.fillStyle = `hsla(${hue},80%,50%,${state.opts.alpha})`
              ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)
            },
          }
          tile.assignCenter()
          state.tiles.push(tile)
        }
      }
    }

    initTiles()

    const loop = () => {
      state.tick++
      state.tiles.forEach((tile) => tile.step())
      state.animationId = requestAnimationFrame(loop)
    }

    loop()

    const handleClick = (e: MouseEvent) => {
      state.opts.cx = e.clientX
      state.opts.cy = e.clientY
      state.tiles.forEach((tile) => tile.assignCenter())
    }

    const handleResize = () => {
      state.w = window.innerWidth
      state.h = window.innerHeight
      canvas.width = state.w
      canvas.height = state.h
      state.opts.cx = state.w / 2
      state.opts.cy = state.h / 2
      initTiles()
    }

    window.addEventListener("click", handleClick)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("click", handleClick)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(state.animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className={`block w-full h-screen ${className}`} style={{ display: "block" }} />
}
