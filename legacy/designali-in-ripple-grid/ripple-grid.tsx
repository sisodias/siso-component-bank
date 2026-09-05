"use client"

import { useEffect, useRef } from "react"

interface RippleGridProps {
  size?: number
  filledCells?: Array<{ row: number; col: number }>
  cellSize?: number
  cellColor?: string
  filledCellColor?: string
  pulseColor?: string
  borderColor?: string
  borderWidth?: number
  pulseScale?: number
  pulseDuration?: number
  rippleDelay?: number 
}

export function RippleGrid({
  size = 5,
  filledCells = [ ],
  cellSize = 50,
  cellColor = "#fff",
  filledCellColor = "#000",
  pulseColor = "#76cefa",
  borderColor = "#000",
  borderWidth = 1,
  pulseScale = 1.1,
  pulseDuration = 300,
  rippleDelay = 100, 
}: RippleGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const gridContainer = gridRef.current
    if (!gridContainer) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.classList.contains("cell")) return

      const clickedRow = Number.parseInt(target.dataset.row || "0")
      const clickedCol = Number.parseInt(target.dataset.col || "0")

      const cells = gridContainer.querySelectorAll(".cell")

      cells.forEach((cell) => {
        const htmlCell = cell as HTMLElement
        const row = Number.parseInt(htmlCell.dataset.row || "0")
        const col = Number.parseInt(htmlCell.dataset.col || "0")

        const distance = Math.abs(row - clickedRow) + Math.abs(col - clickedCol)

        setTimeout(() => {
          htmlCell.classList.add("pulse")

          setTimeout(() => {
            htmlCell.classList.remove("pulse")
          }, pulseDuration + 200)
        }, distance * rippleDelay)
      })
    }

    gridContainer.addEventListener("click", handleClick)

    return () => {
      gridContainer.removeEventListener("click", handleClick)
    }
  }, [pulseDuration, rippleDelay])

  const isFilled = (row: number, col: number) => {
    return filledCells.some((cell) => cell.row === row && cell.col === col)
  }

  const renderGrid = () => {
    const cells = []
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        cells.push(
          <div
            key={`${row}-${col}`}
            className={`cell ${isFilled(row, col) ? "filled" : ""}`}
            data-row={row}
            data-col={col}
          />,
        )
      }
    }
    return cells
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        ref={gridRef}
        className="grid gap-0 mt-12"
        style={{
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
        }}
      >
        {renderGrid()}

        <style jsx>{`
          .cell {
            width: ${cellSize}px;
            height: ${cellSize}px;
            background-color: ${cellColor};
            border: ${borderWidth}px solid ${borderColor};
            box-sizing: border-box;
            cursor: pointer;
          }

          .cell.filled {
            background-color: ${filledCellColor};
          }

          .cell.pulse:not(.filled) {
            animation: pulse-animation ${pulseDuration}ms forwards;
          }

          @keyframes pulse-animation {
            0% {
              background-color: ${cellColor};
              transform: scale(1);
            }
            50% {
              background-color: ${pulseColor};
              transform: scale(${pulseScale});
            }
            100% {
              background-color: ${cellColor};
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  )
}
