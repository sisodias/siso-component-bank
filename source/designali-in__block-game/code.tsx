"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Game constants
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const EMPTY_CELL = 0

// Tetromino shapes
const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "bg-cyan-500",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "bg-yellow-500",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-purple-500",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "bg-green-500",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-red-500",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-blue-500",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-orange-500",
  },
}

const TETROMINO_KEYS = Object.keys(TETROMINOES)

type TetrominoType = keyof typeof TETROMINOES
type Board = number[][]
type Position = { x: number; y: number }

interface Piece {
  shape: number[][]
  color: string
  position: Position
  type: TetrominoType
}

export const Component = () => {
  const [board, setBoard] = useState<Board>(() =>
    Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL)),
  )
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Create a new random piece
  const createNewPiece = useCallback((): Piece => {
    const randomType = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)] as TetrominoType
    const tetromino = TETROMINOES[randomType]
    return {
      shape: tetromino.shape,
      color: tetromino.color,
      position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2), y: 0 },
      type: randomType,
    }
  }, [])

  // Check if a piece can be placed at a position
  const canPlacePiece = useCallback(
    (piece: Piece, newPosition: Position): boolean => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = newPosition.x + x
            const newY = newPosition.y + y

            if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
              return false
            }

            if (newY >= 0 && board[newY][newX] !== EMPTY_CELL) {
              return false
            }
          }
        }
      }
      return true
    },
    [board],
  )

  // Rotate a piece 90 degrees clockwise
  const rotatePiece = useCallback((piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, index) => piece.shape.map((row) => row[index]).reverse())
    return { ...piece, shape: rotated }
  }, [])

  // Place piece on board
  const placePieceOnBoard = useCallback(
    (piece: Piece): Board => {
      const newBoard = board.map((row) => [...row])

      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const boardY = piece.position.y + y
            const boardX = piece.position.x + x
            if (boardY >= 0) {
              newBoard[boardY][boardX] = 1
            }
          }
        }
      }

      return newBoard
    },
    [board],
  )

  // Clear completed lines
  const clearLines = useCallback((board: Board): { newBoard: Board; linesCleared: number } => {
    const newBoard = board.filter((row) => row.some((cell) => cell === EMPTY_CELL))
    const linesCleared = BOARD_HEIGHT - newBoard.length

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL))
    }

    return { newBoard, linesCleared }
  }, [])

  // Move piece down
  const movePieceDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    const newPosition = { ...currentPiece.position, y: currentPiece.position.y + 1 }

    if (canPlacePiece(currentPiece, newPosition)) {
      setCurrentPiece({ ...currentPiece, position: newPosition })
    } else {
      // Place piece and create new one
      const newBoard = placePieceOnBoard(currentPiece)
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)

      setBoard(clearedBoard)
      setLines((prev) => prev + linesCleared)
      setScore((prev) => prev + linesCleared * 100 * level)

      const nextPiece = createNewPiece()
      if (canPlacePiece(nextPiece, nextPiece.position)) {
        setCurrentPiece(nextPiece)
      } else {
        setGameOver(true)
      }
    }
  }, [currentPiece, gameOver, isPaused, canPlacePiece, placePieceOnBoard, clearLines, level, createNewPiece])

  // Handle keyboard input
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!currentPiece || gameOver || isPaused) return

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          const leftPosition = { ...currentPiece.position, x: currentPiece.position.x - 1 }
          if (canPlacePiece(currentPiece, leftPosition)) {
            setCurrentPiece({ ...currentPiece, position: leftPosition })
          }
          break

        case "ArrowRight":
          event.preventDefault()
          const rightPosition = { ...currentPiece.position, x: currentPiece.position.x + 1 }
          if (canPlacePiece(currentPiece, rightPosition)) {
            setCurrentPiece({ ...currentPiece, position: rightPosition })
          }
          break

        case "ArrowDown":
          event.preventDefault()
          movePieceDown()
          break

        case "ArrowUp":
        case " ":
          event.preventDefault()
          const rotated = rotatePiece(currentPiece)
          if (canPlacePiece(rotated, rotated.position)) {
            setCurrentPiece(rotated)
          }
          break
      }
    },
    [currentPiece, gameOver, isPaused, canPlacePiece, movePieceDown, rotatePiece],
  )

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const interval = setInterval(
      () => {
        movePieceDown()
      },
      Math.max(100, 1000 - (level - 1) * 100),
    )

    return () => clearInterval(interval)
  }, [gameStarted, gameOver, isPaused, level, movePieceDown])

  // Keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  // Update level based on lines cleared
  useEffect(() => {
    setLevel(Math.floor(lines / 10) + 1)
  }, [lines])

  // Start game
  const startGame = () => {
    setBoard(
      Array(BOARD_HEIGHT)
        .fill(null)
        .map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL)),
    )
    setCurrentPiece(createNewPiece())
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameOver(false)
    setIsPaused(false)
    setGameStarted(true)
  }

  // Render the game board with current piece
  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row])

    // Add current piece to display board
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.position.y + y
            const boardX = currentPiece.position.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = 2 // Current piece
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-6 h-6 border border-gray-300 ${
              cell === 1 ? "bg-gray-700" : cell === 2 ? currentPiece?.color || "bg-gray-500" : "bg-gray-100"
            }`}
          />
        ))}
      </div>
    ))
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Block Game</h1>

      <div className="flex gap-6 flex-wrap justify-center">
        {/* Game Board */}
        <Card className="p-4">
          <div className="border-2 border-gray-400 bg-white">{renderBoard()}</div>
        </Card>

        {/* Game Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{score}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Level</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{level}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lines</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{lines}</p>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>← → Move</p>
              <p>↓ Soft drop</p>
              <p>↑ / Space Rotate</p>
            </CardContent>
          </Card>

          {/* Game Controls */}
          <div className="space-y-2">
            {!gameStarted || gameOver ? (
              <Button onClick={startGame} className="w-full">
                {gameOver ? "Play Again" : "Start Game"}
              </Button>
            ) : (
              <Button onClick={() => setIsPaused(!isPaused)} variant="outline" className="w-full">
                {isPaused ? "Resume" : "Pause"}
              </Button>
            )}
          </div>

          {gameOver && (
            <Card className="border-red-500">
              <CardContent className="pt-6">
                <p className="text-center text-red-600 font-bold">Game Over!</p>
                <p className="text-center text-sm">Final Score: {score}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}